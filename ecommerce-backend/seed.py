from database import SessionLocal, engine
import models

# Connect to the DB and create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()


def seed_data():
    # 1. Create a Category
    tech_category = models.Category(name="Electronics")
    db.add(tech_category)
    db.commit()
    db.refresh(tech_category)


    # 2. Add some Products
sample_products = [
    # --- Essentials ---
    models.Product(
        title="Mechanical Keyboard",
        description="RGB backlit with tactile brown switches for peak productivity.",
        price=89.99,
        image_url="https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500",
        category_id=tech_category.id,
        stock_quantity=15
    ),
    models.Product(
        title="Wireless Mouse",
        description="Ergonomic 2.4GHz silent clicking with adjustable DPI.",
        price=25.50,
        image_url="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
        category_id=tech_category.id,
        stock_quantity=50
    ),
    # --- Audio ---
    models.Product(
        title="Noise Cancelling Headphones",
        description="Studio quality sound with 40-hour battery life.",
        price=299.00,
        image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        category_id=tech_category.id,
        stock_quantity=12
    ),
    models.Product(
        title="USB Streaming Microphone",
        description="Cardioid pickup pattern perfect for podcasts and gaming.",
        price=129.00,
        image_url="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500",
        category_id=tech_category.id,
        stock_quantity=8
    ),
    # --- Displays & Visuals ---
    models.Product(
        title="4K Ultra-Wide Monitor",
        description="34-inch curved display with 144Hz refresh rate.",
        price=499.00,
        image_url="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
        category_id=tech_category.id,
        stock_quantity=5
    ),
    models.Product(
        title="Webcam 1080p HD",
        description="Wide-angle lens with built-in dual microphones.",
        price=65.00,
        image_url="https://images.unsplash.com/photo-1626082896492-766af4eb6501?w=500",
        category_id=tech_category.id,
        stock_quantity=20
    ),
    # --- Power & Protection ---
    models.Product(
        title="Portable Power Bank",
        description="20,000mAh capacity with USB-C fast charging.",
        price=45.00,
        image_url="https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
        category_id=tech_category.id,
        stock_quantity=30
    ),
    models.Product(
        title="Leather Laptop Sleeve",
        description="Handcrafted genuine leather for 14-inch laptops.",
        price=55.00,
        image_url="https://images.unsplash.com/photo-1544333346-64e3fe1bad65?w=500",
        category_id=tech_category.id,
        stock_quantity=10
    ),
    # --- Smart Tech ---
    models.Product(
        title="Smart Watch Series X",
        description="Heart rate monitor, GPS, and water resistance up to 50m.",
        price=199.99,
        image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        category_id=tech_category.id,
        stock_quantity=25
    ),
    models.Product(
        title="Minimalist Desk Lamp",
        description="Adjustable brightness and color temperature with touch controls.",
        price=39.00,
        image_url="https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500",
        category_id=tech_category.id,
        stock_quantity=18
    ),
    models.Product(
        title="Smart Home Hub",
        description="Control your lights, locks, and music with one device.",
        price=115.00,
        image_url="https://images.unsplash.com/photo-1558002038-103792e07927?w=500",
        category_id=tech_category.id,
        stock_quantity=14
    ),
    models.Product(
        title="SSD External Drive 1TB",
        description="Blazing fast 1050MB/s read speeds in a rugged case.",
        price=149.00,
        image_url="https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=500",
        category_id=tech_category.id,
        stock_quantity=22
    ),
    models.Product(
        title="Graphic Drawing Tablet",
        description="Battery-free stylus with 8192 levels of pressure sensitivity.",
        price=79.00,
        image_url="https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500",
        category_id=tech_category.id,
        stock_quantity=7
    )
]
db.add_all(sample_products)
db.commit()
print("Database seeded successfully! 🌱")

if __name__ == "__main__":
    seed_data()
