from sqlalchemy.orm import Session
from . import models, crud, schemas
from .database import SessionLocal, engine
from .auth import get_password_hash
import os

def seed_database():
    """Seed the database with initial data"""
    Base = models.Base
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Create admin user
    admin_phone = os.getenv("ADMIN_PHONE", "919999999999")
    if not crud.get_user_by_phone(db, admin_phone):
        admin = models.User(
            name="Admin",
            phone=admin_phone,
            hashed_password=get_password_hash(os.getenv("ADMIN_PASSWORD", "Admin@123")),
            role=models.UserRole.ADMIN,
            city="Delhi",
            state="Delhi"
        )
        db.add(admin)
        db.commit()
        print("✓ Admin user created")
    
    # Create sample user
    if not crud.get_user_by_phone(db, "919876543210"):
        user = models.User(
            name="Aaryan Kumar",
            phone="919876543210",
            email="aaryan@example.com",
            hashed_password=get_password_hash("User@123"),
            role=models.UserRole.USER,
            city="Mumbai",
            state="Maharashtra"
        )
        db.add(user)
        db.commit()
        print("✓ Sample user created")
    
    # Create puja types with Hindi names
    pujas_data = [
        {"name_local": "पितृ शांति", "name_en": "Pitru Shanti", "min_price": 5100, "max_price": 5100, "default_price": 5100},
        {"name_local": "नारायण बली", "name_en": "Narayan Bali", "min_price": 21000, "max_price": 21000, "default_price": 21000},
        {"name_local": "काल सर्प दोष", "name_en": "Kaal Sarp Dosh", "min_price": 4100, "max_price": 4100, "default_price": 4100},
        {"name_local": "रुद्राभिषेक", "name_en": "Rudrabhishek", "min_price": 1100, "max_price": 11000, "default_price": 5000},
        {"name_local": "मंगल शांति", "name_en": "Mangal Shanti", "min_price": 3100, "max_price": 3100, "default_price": 3100},
        {"name_local": "भात पूजन", "name_en": "Bhaat Poojan", "min_price": 2100, "max_price": 2100, "default_price": 2100},
        {"name_local": "ग्रहण दोष शांति", "name_en": "Grahan Dosh Shanti", "min_price": 2100, "max_price": 2100, "default_price": 2100},
        {"name_local": "नवग्रह शांति", "name_en": "Navgraha Shanti", "min_price": 2500, "max_price": 2500, "default_price": 2500},
        {"name_local": "चांडाल दोष शांति", "name_en": "Chandal Dosh Shanti", "min_price": 2500, "max_price": 2500, "default_price": 2500},
        {"name_local": "कुंभ विवाह", "name_en": "Kumbh Vivah", "min_price": 3500, "max_price": 3500, "default_price": 3500},
        {"name_local": "अर्क विवाह", "name_en": "Ark Vivah", "min_price": 3100, "max_price": 3100, "default_price": 3100},
        {"name_local": "वास्तु पूजन", "name_en": "Vastu Poojan", "min_price": 11000, "max_price": 11000, "default_price": 11000},
        {"name_local": "ग्रह शांति", "name_en": "Graha Shanti", "min_price": 1100, "max_price": 1100, "default_price": 1100},
        {"name_local": "जप", "name_en": "Jap", "min_price": 1000, "max_price": 51000, "default_price": 10000},
        {"name_local": "वैवाहिक एवं मांगलिक पूजन", "name_en": "Vaivahik Manglik Poojan", "min_price": 11000, "max_price": 11000, "default_price": 11000},
    ]
    
    existing_pujas = db.query(models.PujaType).count()
    if existing_pujas == 0:
        for puja_data in pujas_data:
            puja = models.PujaType(**puja_data, description=f"Traditional {puja_data['name_en']} ritual")
            db.add(puja)
        db.commit()
        print("✓ Puja types seeded")
    
    # Create sample pandits
    pandit_data = [
        {"name": "Pandit Ramesh Sharma", "phone": "919111111111", "city": "Delhi", "state": "Delhi"},
        {"name": "Pandit Suresh Joshi", "phone": "919222222222", "city": "Mumbai", "state": "Maharashtra"},
        {"name": "Pandit Vivek Tiwari", "phone": "919333333333", "city": "Varanasi", "state": "Uttar Pradesh"},
    ]
    
    for pd in pandit_data:
        if not crud.get_user_by_phone(db, pd["phone"]):
            pandit_user = models.User(
                name=pd["name"],
                phone=pd["phone"],
                hashed_password=get_password_hash("Pandit@123"),
                role=models.UserRole.PANDIT,
                city=pd["city"],
                state=pd["state"]
            )
            db.add(pandit_user)
            db.commit()
            
            pandit_profile = models.Pandit(
                user_id=pandit_user.id,
                city=pd["city"],
                state=pd["state"],
                bio=f"Experienced pandit from {pd['city']}",
                approved=True
            )
            db.add(pandit_profile)
            db.commit()
    
    print("✓ Sample pandits created")
    db.close()
    print("\n🎉 Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
