"""
Seed script to populate the database with initial data
Run: python seed_data.py
"""
from app.database import SessionLocal, engine, Base
from app.models.user import User, Role, UserRole
from app.models.food import Food, Category
from app.utils.security import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    print("🌱 Seeding database...")

    # Create categories
    categories_data = [
        {"name": "Pizza", "description": "Delicious Italian pizzas"},
        {"name": "Burger", "description": "Juicy beef and chicken burgers"},
        {"name": "Biryani", "description": "Aromatic Indian rice dishes"},
        {"name": "Drinks", "description": "Refreshing beverages"},
        {"name": "Dessert", "description": "Sweet treats and desserts"},
    ]

    categories = {}
    for cat_data in categories_data:
        existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
        if not existing:
            category = Category(**cat_data)
            db.add(category)
            db.flush()
            categories[cat_data["name"]] = category
            print(f"  ✅ Created category: {cat_data['name']}")
        else:
            categories[cat_data["name"]] = existing
            print(f"  ⏭️  Category exists: {cat_data['name']}")

    db.commit()

    # Create foods
    foods_data = [
        {
            "name": "Burger",
            "description": "Grilled beef patty stacked with mashed potato wedges, served with special sauce",
            "price": 12.99,
            "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
            "category_name": "Burger",
            "rating": 4.8,
            "reviews_count": 95,
            "prep_time": "25 min",
        },
        {
            "name": "Chicken Biryani",
            "description": "Aromatic basmati rice served with tender chicken pieces, infused with exotic spices",
            "price": 14.99,
            "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
            "category_name": "Biryani",
            "rating": 4.5,
            "reviews_count": 120,
            "prep_time": "35 min",
        },
        {
            "name": "Classic Burger Combo",
            "description": "Juicy beef patty with fresh vegetables, melted cheese, crispy fries and a refreshing cola",
            "price": 11.99,
            "original_price": 10.99,
            "image": "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop",
            "category_name": "Burger",
            "rating": 4.7,
            "reviews_count": 120,
            "prep_time": "20 min",
            "is_special": True,
        },
        {
            "name": "Margherita Pizza",
            "description": "Classic Italian pizza with fresh mozzarella, tomato sauce, basil, and olive oil",
            "price": 13.99,
            "image": "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop",
            "category_name": "Pizza",
            "rating": 4.6,
            "reviews_count": 85,
            "prep_time": "30 min",
        },
        {
            "name": "Pepperoni Pizza",
            "description": "Loaded with rich pepperoni, melted mozzarella cheese on our signature crust",
            "price": 15.99,
            "image": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
            "category_name": "Pizza",
            "rating": 4.8,
            "reviews_count": 110,
            "prep_time": "30 min",
        },
        {
            "name": "Vegetable Biryani",
            "description": "Fragrant basmati rice with mixed vegetables, aromatic spices, and rich flavors",
            "price": 10.99,
            "image": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
            "category_name": "Biryani",
            "rating": 4.4,
            "reviews_count": 75,
            "prep_time": "30 min",
        },
        {
            "name": "Mango Smoothie",
            "description": "Fresh tropical mango blended with creamy yogurt and a hint of honey",
            "price": 5.99,
            "image": "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop",
            "category_name": "Drinks",
            "rating": 4.7,
            "reviews_count": 60,
            "prep_time": "5 min",
        },
        {
            "name": "Chocolate Brownie",
            "description": "Rich, fudgy chocolate brownie topped with vanilla ice cream and chocolate drizzle",
            "price": 6.99,
            "image": "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop",
            "category_name": "Dessert",
            "rating": 4.9,
            "reviews_count": 140,
            "prep_time": "10 min",
        },
    ]

    for food_data in foods_data:
        existing = db.query(Food).filter(Food.name == food_data["name"]).first()
        if not existing:
            category = categories.get(food_data.pop("category_name"))
            food = Food(**food_data, category_id=category.id)
            db.add(food)
            print(f"  ✅ Created food: {food.name}")
        else:
            print(f"  ⏭️  Food exists: {food_data['name']}")

    db.commit()

    # Create admin user
    admin_email = "admin@tastybites.com"
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    
    if not existing_admin:
        admin_user = User(
            email=admin_email,
            hashed_password=get_password_hash("admin123"),
            first_name="Admin",
            last_name="User",
            phone="+1 555-000-0000",
            is_active=True
        )
        db.add(admin_user)
        db.flush()
        
        # Add admin role
        admin_role = Role(user_id=admin_user.id, role=UserRole.ADMIN)
        db.add(admin_role)
        
        # Also add user role
        user_role = Role(user_id=admin_user.id, role=UserRole.USER)
        db.add(user_role)
        
        print(f"  ✅ Created admin user: {admin_email} (password: admin123)")
    else:
        print(f"  ⏭️  Admin user exists: {admin_email}")

    # Create demo user
    demo_email = "demo@tastybites.com"
    existing_demo = db.query(User).filter(User.email == demo_email).first()
    
    if not existing_demo:
        demo_user = User(
            email=demo_email,
            hashed_password=get_password_hash("demo123"),
            first_name="John",
            last_name="Doe",
            phone="+1 555-123-4567",
            address="123 Main Street, Apt 4",
            city="New York",
            zip_code="10001",
            is_active=True
        )
        db.add(demo_user)
        db.flush()
        
        # Add user role
        user_role = Role(user_id=demo_user.id, role=UserRole.USER)
        db.add(user_role)
        
        print(f"  ✅ Created demo user: {demo_email} (password: demo123)")
    else:
        print(f"  ⏭️  Demo user exists: {demo_email}")

    db.commit()
    print("\n🎉 Database seeding completed!")

except Exception as e:
    print(f"❌ Error seeding database: {e}")
    db.rollback()
finally:
    db.close()
