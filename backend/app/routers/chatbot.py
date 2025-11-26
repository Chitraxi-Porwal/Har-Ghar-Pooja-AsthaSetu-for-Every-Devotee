from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])

@router.post("", response_model=schemas.ChatbotResponse)
def chatbot_query(query: schemas.ChatbotQuery, db: Session = Depends(get_db)):
    """Mock chatbot for spiritual Q&A"""
    question = query.question.lower()
    
    # Simple rule-based responses
    if "puja" in question or "ritual" in question:
        return {
            "answer": "We offer various pujas for peace, prosperity, and health. Popular ones include Rudrabhishek, Navgraha Shanti, and Vastu Poojan.",
            "suggested_pujas": ["रुद्राभिषेक", "नवग्रह शांति", "वास्तु पूजन"]
        }
    elif "price" in question or "cost" in question:
        return {
            "answer": "Puja prices range from ₹1,100 to ₹51,000 depending on the type. Check our pricing section for details.",
            "suggested_pujas": []
        }
    else:
        return {
            "answer": "I can help you find the right puja for your needs. What are you looking for - peace, prosperity, or spiritual guidance?",
            "suggested_pujas": []
        }

@router.post("/recommend", response_model=List[schemas.RecommendationResponse])
def recommend_puja(request: schemas.RecommendationRequest, db: Session = Depends(get_db)):
    """Recommend pujas based on purpose and budget"""
    all_pujas = crud.get_all_puja_types(db)
    recommendations = []
    
    for puja in all_pujas:
        if request.budget_min and puja.default_price < request.budget_min:
            continue
        if request.budget_max and puja.default_price > request.budget_max:
            continue
        
        recommendations.append({
            "puja_type": puja.name_local,
            "puja_type_id": puja.id,
            "reason": f"Recommended for {request.purpose}",
            "estimated_price": puja.default_price
        })
    
    return recommendations[:5]
