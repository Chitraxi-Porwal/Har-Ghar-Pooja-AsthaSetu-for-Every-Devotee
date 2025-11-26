from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, crud, auth, models
from ..database import get_db

router = APIRouter(prefix="/api/consultations", tags=["Consultations"])

@router.post("", response_model=schemas.ConsultationResponse, status_code=status.HTTP_201_CREATED)
def create_consultation(
    consultation: schemas.ConsultationCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Book a consultation with a pandit"""
    pandit = crud.get_pandit_by_id(db, consultation.pandit_id)
    if not pandit or not pandit.approved:
        raise HTTPException(status_code=404, detail="Pandit not found or not approved")
    
    return crud.create_consultation(db, current_user.id, consultation)
