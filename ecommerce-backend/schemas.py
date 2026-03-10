from pydantic import BaseModel

class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    image_url: str

class ProductCreate(ProductBase):
    category_id: int

class Product(ProductBase):
    id: int
    class Config:
        orm_mode = True # Tells Pydantic to read data even if it's not a dict