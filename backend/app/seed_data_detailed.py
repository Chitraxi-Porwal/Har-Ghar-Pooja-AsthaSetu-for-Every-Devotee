from sqlalchemy.orm import Session
from . import models, crud, schemas
from .database import SessionLocal, engine
from .auth import get_password_hash
import os

def seed_database():
    """Seed the database with detailed puja information"""
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
    
    # Detailed Puja data with descriptions, benefits, and images
    pujas_data = [
        {
            "name_local": "पितृ शांति",
            "name_en": "Pitru Shanti",
            "description": "Sacred ritual for peace and blessings of ancestors",
            "detailed_description": "Pitru Shanti Puja is performed to seek blessings from ancestors and to liberate their souls. This powerful ritual helps remove Pitru Dosha from one's horoscope and brings peace to departed souls. The puja involves offering prayers, tarpan (water offering), and specific mantras dedicated to ancestors. It is especially beneficial for those experiencing unexplained obstacles in life, relationship issues, or financial problems that may be caused by ancestral dissatisfaction.",
            "benefits": "• Removes Pitru Dosha from horoscope\n• Brings peace to departed ancestors\n• Removes obstacles in personal and professional life\n• Improves family harmony\n• Helps in progeny-related issues\n• Brings prosperity and success",
            "image_url": "https://images.unsplash.com/photo-1532274203680-c80a456246cf?w=800",
            "duration_minutes": 120,
            "min_price": 5100,
            "max_price": 5100,
            "default_price": 5100
        },
        {
            "name_local": "नारायण बली",
            "name_en": "Narayan Bali",
            "description": "Powerful ritual to remove ancestral curses and doshas",
            "detailed_description": "Narayan Bali is an extremely powerful Vedic ritual performed to alleviate the effects of ancestral curses and premature deaths in the family. This puja is specifically performed when there are indications of Nag Dosha or when ancestors have died unnatural deaths. The ritual involves creating an effigy representing the troubled soul and performing elaborate ceremonies to liberate it. Priests chant specific mantras from ancient texts while offering sacred items. This puja brings immense relief to families experiencing repeated misfortunes and unexplained problems.",
            "benefits": "• Removes effects of ancestral curses\n• Liberates souls of those who died prematurely\n• Alleviates Nag Dosha\n• Removes repeated obstacles and failures\n• Brings mental peace to family members\n• Resolves chronic health issues\n• Improves overall family prosperity",
            "image_url": "https://images.unsplash.com/photo-1605481836684-a423464f71db?w=800",
            "duration_minutes": 240,
            "min_price": 21000,
            "max_price": 21000,
            "default_price": 21000
        },
        {
            "name_local": "काल सर्प दोष",
            "name_en": "Kaal Sarp Dosh",
            "description": "Remedy for Kaal Sarp Yoga in horoscope",
            "detailed_description": "Kaal Sarp Dosh Nivaran Puja is performed when all planets in one's birth chart are positioned between Rahu and Ketu, creating a powerful negative combination. This dosha can cause significant obstacles in various aspects of life including career, marriage, health, and finances. The puja involves elaborate rituals performed by experienced pandits who invoke Lord Shiva and Nag Devtas. Special abhishekam is performed, and specific mantras are chanted to neutralize the malefic effects. Many devotees have experienced remarkable positive changes after this powerful remedy.",
            "benefits": "• Neutralizes Kaal Sarp Yoga effects\n• Removes career obstacles and delays\n• Improves marital harmony\n• Resolves health issues\n• Brings financial stability\n• Reduces mental stress and anxiety\n• Opens blocked opportunities",
            "image_url": "https://images.unsplash.com/photo-1588953936179-d2f4e80e5f4e?w=800",
            "duration_minutes": 180,
            "min_price": 4100,
            "max_price": 4100,
            "default_price": 4100
        },
        {
            "name_local": "रुद्राभिषेक",
            "name_en": "Rudrabhishek",
            "description": "Sacred abhishekam of Lord Shiva with holy offerings",
            "detailed_description": "Rudrabhishek is one of the most powerful and sacred rituals dedicated to Lord Shiva. This abhishekam (ritual bathing of the deity) involves pouring various sacred items like milk, honey, ghee, yogurt, and water over the Shiva Lingam while chanting Vedic mantras, particularly the Rudram from Yajurveda. The ritual can be performed with different materials and scales depending on individual needs and capacity. It is believed that Lord Shiva, in his Rudra form, removes all negative energies and bestows blessings of health, wealth, and spiritual progress. Regular performance of Rudrabhishek brings immense positive energy and divine grace.",
            "benefits": "• Removes negative energies and evil eye\n• Fulfills desires and wishes\n• Brings peace and prosperity\n• Improves health and longevity\n• Removes obstacles in spiritual path\n• Grants mental clarity and focus\n• Protects from accidents and mishaps",
            "image_url": "https://images.unsplash.com/photo-1582662267804-f52bbe1bd6b7?w=800",
            "duration_minutes": 90,
            "min_price": 1100,
            "max_price": 11000,
            "default_price": 5000
        },
        {
            "name_local": "मंगल शांति",
            "name_en": "Mangal Shanti",
            "description": "Puja to pacify planet Mars and remove Manglik Dosha",
            "detailed_description": "Mangal Shanti Puja is performed to reduce the malefic effects of planet Mars (Mangal) in one's horoscope. This puja is especially important for those suffering from Mangal Dosha (Manglik), which can cause delays in marriage, marital discord, health issues, and aggressive behavior. The ritual involves worshiping Lord Hanuman and Mars deity with specific mantras and offerings. Red-colored items, jaggery, and red flowers are offered. The puja helps balance the aggressive energy of Mars and channels it positively, bringing harmony in relationships and success in endeavors requiring courage and determination.",
            "benefits": "• Removes Mangal Dosha (Manglik)\n• Facilitates smooth marriage prospects\n• Improves marital happiness\n• Reduces anger and aggressive tendencies\n• Brings courage and determination\n• Helps in property-related matters\n• Improves blood-related health issues",
            "image_url": "https://images.unsplash.com/photo-1609783262698-4fa5888c4394?w=800",
            "duration_minutes": 120,
            "min_price": 3100,
            "max_price": 3100,
            "default_price": 3100
        },
        {
            "name_local": "भात पूजन",
            "name_en": "Bhaat Poojan",
            "description": "Traditional wedding ceremony seeking divine blessings",
            "detailed_description": "Bhaat Poojan is an auspicious pre-wedding ceremony performed to seek blessings from family deities and ancestors for the upcoming marriage. This beautiful ritual involves worshiping Lord Ganesha, family Kul Devta, and ancestors. The ceremony includes preparation and offering of sacred rice (bhaat) along with other traditional items. Elders of the family bless the bride or groom, and mantras are chanted for a happy and prosperous married life. This ceremony strengthens family bonds and ensures ancestral blessings for the new chapter of life. It is considered essential for removing any doshas that might affect the marriage.",
            "benefits": "• Ensures happy married life\n• Removes obstacles in wedding arrangements\n• Brings ancestral blessings\n• Strengthens family bonds\n• Ensures prosperity in married life\n• Protects from evil eye\n• Brings harmony between families",
            "image_url": "https://images.unsplash.com/photo-1591024167569-7f9b8e5d9e1f?w=800",
            "duration_minutes": 150,
            "min_price": 2100,
            "max_price": 2100,
            "default_price": 2100
        },
        {
            "name_local": "ग्रहण दोष शांति",
            "name_en": "Grahan Dosh Shanti",
            "description": "Remedy for eclipse-related doshas in birth chart",
            "detailed_description": "Grahan Dosh Shanti Puja is performed when a person is born during a solar or lunar eclipse, or when eclipse-related doshas are present in the birth chart. This dosha can cause health problems, relationship issues, financial instability, and spiritual obstacles. The puja involves specific rituals to pacify Rahu and Ketu, the shadow planets responsible for eclipses. Priests perform havan with prescribed materials, chant eclipse-specific mantras, and make charitable donations. The ritual neutralizes the negative effects of the eclipse and brings stability, clarity, and positive energy into one's life.",
            "benefits": "• Removes eclipse-related doshas\n• Improves mental clarity and focus\n• Resolves relationship complications\n• Brings financial stability\n• Enhances spiritual growth\n• Reduces fears and phobias\n• Improves overall life quality",
            "image_url": "https://images.unsplash.com/photo-1604608640540-1a3d2d0b8f7d?w=800",
            "duration_minutes": 120,
            "min_price": 2100,
            "max_price": 2100,
            "default_price": 2100
        },
        {
            "name_local": "नवग्रह शांति",
            "name_en": "Navgraha Shanti",
            "description": "Puja to pacify all nine planets for overall well-being",
            "detailed_description": "Navgraha Shanti Puja is a comprehensive ritual to appease all nine planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu) simultaneously. This powerful puja is performed when multiple planetary doshas are present or during major life transitions. The ceremony involves creating a mandap, installing the Navgraha yantra, and performing individual pujas for each planet with their specific mantras, colors, and offerings. Each planet is worshiped according to Vedic traditions. This puja brings balance and harmony by aligning all planetary energies positively, resulting in overall improvement in health, wealth, relationships, and spiritual growth.",
            "benefits": "• Balances all planetary energies\n• Improves overall life circumstances\n• Removes multiple doshas simultaneously\n• Brings health and longevity\n• Enhances career and finances\n• Improves relationships\n• Brings peace and prosperity\n• Protects from malefic planetary periods",
            "image_url": "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800",
            "duration_minutes": 180,
            "min_price": 2500,
            "max_price": 2500,
            "default_price": 2500
        },
        {
            "name_local": "चांडाल दोष शांति",
            "name_en": "Chandal Dosh Shanti",
            "description": "Remedy for Jupiter-Rahu conjunction in horoscope",
            "detailed_description": "Chandal Dosh Shanti Puja is performed when Jupiter (Guru) and Rahu are conjunct in one's birth chart, creating a powerful dosha that can affect wisdom, ethics, spirituality, and social standing. This combination can lead to confusion in judgment, obstacles in education, difficulties with teachers or mentors, and challenges in spiritual progress. The puja involves elaborate rituals to appease both Jupiter and Rahu separately and then together. Special havan is performed with specific herbs, and mantras from ancient texts are chanted. The ritual helps restore the benefic nature of Jupiter while controlling Rahu's malefic influence.",
            "benefits": "• Removes Guru-Chandal Yoga effects\n• Restores wisdom and good judgment\n• Improves relationships with elders\n• Removes obstacles in education\n• Enhances spiritual growth\n• Improves social reputation\n• Brings clarity in decision-making",
            "image_url": "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800",
            "duration_minutes": 150,
            "min_price": 2500,
            "max_price": 2500,
            "default_price": 2500
        },
        {
            "name_local": "कुंभ विवाह",
            "name_en": "Kumbh Vivah",
            "description": "Ritual marriage with sacred pot to remove Manglik Dosha",
            "detailed_description": "Kumbh Vivah is a unique and powerful remedy for severe Mangal Dosha (Manglik). In this ritual, the person with Manglik dosha performs a symbolic marriage with a Kumbh (sacred pot) or sometimes with a peepal tree, banana tree, or Lord Vishnu's idol. This ceremony is believed to fulfill the dosha's requirement, protecting the actual life partner from any malefic effects. The ritual follows complete wedding traditions including mantras, pheras, and all customary rites. After the ceremony, the pot or tree is ceremonially immersed or disposed of according to tradition. This powerful remedy has helped countless individuals find happy marriages.",
            "benefits": "• Removes severe Mangal Dosha\n• Protects future spouse from malefic effects\n• Enables smooth marriage prospects\n• Removes delays in marriage\n• Ensures marital happiness\n• Eliminates fears about Manglik effects\n• Brings peace to family",
            "image_url": "https://images.unsplash.com/photo-1587070163711-ade2ade10295?w=800",
            "duration_minutes": 180,
            "min_price": 3500,
            "max_price": 3500,
            "default_price": 3500
        },
        {
            "name_local": "अर्क विवाह",
            "name_en": "Ark Vivah",
            "description": "Marriage ceremony with Peepal tree for dosha removal",
            "detailed_description": "Ark Vivah is a sacred ritual where a person performs symbolic marriage with an Ark (Peepal/Sacred Fig) tree to remove severe Mangal Dosha or other marital doshas. The Peepal tree is considered highly sacred in Hinduism, representing the Trinity. This ceremony is performed with complete Vedic rituals, including Ganesh Puja, Kalash Sthapana, and traditional wedding ceremonies. The person is married to the tree with all mantras and rituals, and after the ceremony, symbolic widowhood is performed. This nullifies the dosha's negative effects, ensuring a happy and prosperous actual marriage. The ceremony is usually performed at an auspicious time determined by astrologers.",
            "benefits": "• Removes Mangal Dosha completely\n• Eliminates marital delays\n• Protects spouse from malefic effects\n• Brings harmony in married life\n• Resolves relationship issues\n• Ensures longevity of spouse\n• Brings divine blessings",
            "image_url": "https://images.unsplash.com/photo-1604514628550-47eb97ec64c9?w=800",
            "duration_minutes": 150,
            "min_price": 3100,
            "max_price": 3100,
            "default_price": 3100
        },
        {
            "name_local": "वास्तु पूजन",
            "name_en": "Vastu Poojan",
            "description": "Sacred ceremony for harmony in home or workplace",
            "detailed_description": "Vastu Poojan is performed to harmonize the energies of a building with the five elements (earth, water, fire, air, and space) and cosmic forces. This elaborate ceremony is conducted before entering a new home, office, or after major renovations. The puja involves worshiping Vastu Purush (the deity of the building), performing Ganesh Puja, Navagraha Puja, and other rituals at specific corners representing different directions and elements. Priests perform havan with sacred herbs, chant Vastu-specific mantras, and energize the space. This powerful ritual removes Vastu doshas, negative energies, and creates a positive, prosperous environment conducive to health, wealth, and happiness.",
            "benefits": "• Removes Vastu doshas\n• Brings prosperity and success\n• Creates positive energy flow\n• Improves health of occupants\n• Enhances peace and harmony\n• Attracts wealth and opportunities\n• Protects from negative influences\n• Ensures overall well-being",
            "image_url": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800",
            "duration_minutes": 240,
            "min_price": 11000,
            "max_price": 11000,
            "default_price": 11000
        },
        {
            "name_local": "ग्रह शांति",
            "name_en": "Graha Shanti",
            "description": "Specific planetary remedies for malefic effects",
            "detailed_description": "Graha Shanti Puja is performed to pacify specific planets causing problems in one's life. Based on the birth chart analysis, this puja can be customized for any particular planet - Sun (Surya), Moon (Chandra), Mars (Mangal), Mercury (Budh), Jupiter (Guru), Venus (Shukra), Saturn (Shani), Rahu, or Ketu. Each planet has specific mantras, offerings, colors, and rituals. The puja involves worshiping the planet's deity, performing havan with planet-specific materials, chanting prescribed mantras, and making donations associated with that planet. This targeted remedy brings relief from specific problems caused by that planet's negative influence.",
            "benefits": "• Pacifies malefic planetary effects\n• Improves specific life areas\n• Reduces Dasha/Antardasha problems\n• Brings targeted relief\n• Enhances positive planetary influence\n• Removes obstacles in affected areas\n• Brings overall balance",
            "image_url": "https://images.unsplash.com/photo-1613457234776-0742f23c5863?w=800",
            "duration_minutes": 90,
            "min_price": 1100,
            "max_price": 1100,
            "default_price": 1100
        },
        {
            "name_local": "जप",
            "name_en": "Jap",
            "description": "Continuous chanting of powerful mantras for wishes",
            "detailed_description": "Jap (Mantra Jap) is the continuous, focused chanting of specific mantras to achieve desired results. This ancient practice can be customized based on individual needs - Mahamrityunjaya Jap for health, Gayatri Jap for wisdom, Lakshmi Jap for wealth, etc. The number of chantings can range from 1,000 to 125,000 or even more, depending on the purpose and astrological requirements. Professional pandits perform the jap with complete devotion and proper pronunciation. A havan is usually conducted at the completion. The vibrations created by continuous mantra chanting have profound effects on the individual's energy field and cosmic connections, manifesting desired outcomes.",
            "benefits": "• Fulfills specific desires\n• Removes karmic obstacles\n• Brings desired results\n• Enhances spiritual power\n• Purifies mind and soul\n• Creates protective shield\n• Attracts divine grace\n• Brings peace and prosperity",
            "image_url": "https://images.unsplash.com/photo-1582542451084-c7e05d4d5ead?w=800",
            "duration_minutes": 180,
            "min_price": 1000,
            "max_price": 51000,
            "default_price": 10000
        },
        {
            "name_local": "वैवाहिक एवं मांगलिक पूजन",
            "name_en": "Vaivahik Manglik Poojan",
            "description": "Complete wedding ceremonies with Vedic rituals",
            "detailed_description": "Vaivahik Manglik Poojan encompasses all the sacred ceremonies and rituals performed during Hindu weddings. This comprehensive puja includes Ganesh Puja, Kalash Sthapana, Mandap Puja, Griha Shanti, Havan, and the main wedding ceremony with Kanyadaan, Phere (circling the sacred fire), and all traditional rites. Experienced pandits conduct the ceremonies according to Vedic traditions while explaining their significance. The rituals ensure divine blessings for the couple, remove any doshas, and create positive energy for a happy, prosperous married life. All ceremonies are performed with proper mantras, timings, and traditions specific to the families' cultures.",
            "benefits": "• Ensures happy married life\n• Removes all marital doshas\n• Brings family harmony\n• Establishes sacred bond\n• Attracts prosperity\n• Ensures progeny blessings\n• Creates lifetime protection\n• Fulfills religious obligations",
            "image_url": "https://images.unsplash.com/photo-1591604466107-ec97de57aef8?w=800",
            "duration_minutes": 300,
            "min_price": 11000,
            "max_price": 11000,
            "default_price": 11000
        }
    ]
    
    existing_pujas = db.query(models.PujaType).count()
    if existing_pujas == 0:
        for puja_data in pujas_data:
            puja = models.PujaType(**puja_data)
            db.add(puja)
        db.commit()
        print("✓ Puja types seeded with detailed information")
    
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
                bio=f"Experienced pandit from {pd['city']} specializing in Vedic rituals",
                approved=True
            )
            db.add(pandit_profile)
            db.commit()
    
    print("✓ Sample pandits created")
    db.close()
    print("\n🎉 Database seeded with detailed puja information!")

if __name__ == "__main__":
    seed_database()
