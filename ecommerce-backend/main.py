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