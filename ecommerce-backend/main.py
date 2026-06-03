import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv
import stripe

import models, schemas, auth_utils
from database import get_db, engine

load_dotenv()
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

# Initialize the DB tables (Alembic handles this usually, but keep this for safety)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-Commerce API")

# --- MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTHENTICATION ---

@app.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        (models.User.email == user.email) | (models.User.username == user.username)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists."
        )

    hashed_password = auth_utils.hash_password(user.password)
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()

    if not user or not auth_utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = auth_utils.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# --- PRODUCTS ---

@app.get("/products", response_model=List[schemas.Product])
def read_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


@app.get("/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# --- STRIPE ---

class PaymentIntentRequest(BaseModel):
    amount: float  # in dollars


@app.post("/create-payment-intent")
def create_payment_intent(
    body: PaymentIntentRequest,
    current_user: models.User = Depends(auth_utils.get_current_user)
):
    try:
        # Stripe amounts are in cents
        amount_cents = round(body.amount * 100)

        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency="usd",
            metadata={"user_email": current_user.email},
            automatic_payment_methods={"enabled": True},
        )
        return {"client_secret": intent.client_secret}
    except stripe.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


# --- ORDERS ---

@app.post("/orders")
def create_order(
    order_data: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user)
):
    try:
        new_order = models.Order(
            user_id=current_user.id,
            customer_name=order_data.customer_name,
            email=current_user.email,
            shipping_address=order_data.shipping_address,
            total_price=order_data.total_price
        )
        db.add(new_order)
        db.flush()

        for item in order_data.items:
            product = db.query(models.Product).filter(models.Product.id == item.product_id).first()

            if not product:
                raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
            if product.stock_quantity < item.quantity:
                raise HTTPException(status_code=400, detail=f"Not enough stock for {product.title}")

            order_item = models.OrderItem(
                order_id=new_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price_at_purchase=item.price
            )
            db.add(order_item)
            product.stock_quantity -= item.quantity

        db.commit()
        return {
            "message": "Order placed successfully",
            "order_id": new_order.id,
            "user": current_user.username
        }

    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/orders/me", response_model=List[schemas.Order])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user)
):
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    return orders
