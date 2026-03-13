from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey # For defining table columns and relationships
from sqlalchemy.orm import relationship # For defining relationships between tables
from sqlalchemy.sql import func # For automatic timestamping
from database import Base # <-- Import the Base from database.py to define our models

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    email = Column(String)
    shipping_address = Column(String)
    total_price = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # will also add an OrderItem table later to link products to orders
class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    image_url = Column(String)
    stock_quantity = Column(Integer)
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    category = relationship("Category", back_populates="products")