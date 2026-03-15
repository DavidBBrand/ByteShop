from pydantic import BaseModel
from typing import List


# ---  Product Schemas ---
class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    image_url: str
    stock_quantity: int

class ProductCreate(ProductBase):
    category_id: int

class Product(ProductBase):
    id: int
    model_config ={"from_attributes" : True} # Modern Pydantic v2 syntax for ORM compatibility

# --- Order Schemas ---    
class CartItemIn(BaseModel):
    product_id: int
    quantity: int
    price: float
    
class OrderCreate(BaseModel):
    customer_name: str
    email: str
    shipping_address: str
    total_price: float
    items: List[CartItemIn]