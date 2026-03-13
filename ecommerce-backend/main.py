from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, database

app = FastAPI()

# 1. KEEP THIS: The "Bouncer" (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. KEEP THIS: Initialize the DB tables
models.Base.metadata.create_all(bind=database.engine)

# 3. KEEP THIS: The DB connection helper
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 4. UPGRADE THIS: Real database fetching instead of hardcoded list
@app.get("/products", response_model=list[schemas.Product])
def read_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

from fastapi import HTTPException # Add this to your imports at the top!

# ... (keep your existing code) ...

@app.post("/orders")
def create_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db)):
    try:
        # 1. Create the Order entry
        new_order = models.Order(
            customer_name=order_data.customer_name,
            email=order_data.email,
            shipping_address=order_data.shipping_address,
            total_price=order_data.total_price
        )
        db.add(new_order)
        db.flush()  # "Flush" creates the ID in the DB without finishing the transaction

        # 2. Handle the items and stock
        for item in order_data.items:
            # Check if product exists and check stock
            product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
            
            if not product:
                raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
            if product.stock_quantity < item.quantity:
                raise HTTPException(status_code=400, detail=f"Not enough stock for {product.title}")

            # Create the link record
            order_item = models.OrderItem(
                order_id=new_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price_at_purchase=item.price
            )
            db.add(order_item)

            # 3. Reduce stock
            product.stock_quantity -= item.quantity

        db.commit() # Save everything!
        return {"message": "Order placed successfully", "order_id": new_order.id}

    except Exception as e:
        db.rollback() # Undo everything if a single part fails
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))