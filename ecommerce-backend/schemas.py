from pydantic import BaseModel, EmailStr
from typing import List

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr
    
class UserCreate(UserBase):
    password: str # this is used only when recieving data from the user
    
class UserOut(UserBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True # This tells Pydantic to read data even from ORM objects, not just dicts

# ---  Product Schemas ---
class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    image_url: str

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