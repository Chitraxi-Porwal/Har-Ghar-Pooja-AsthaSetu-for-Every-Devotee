from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from .. import schemas, crud, auth, models
from ..database import get_db

router = APIRouter(prefix="/api/pandits", tags=["Pandits"])


@router.post("/apply", response_model=schemas.PanditResponse, status_code=status.HTTP_201_CREATED)
def apply_as_pandit(
    pandit_data: schemas.PanditCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Apply to become a pandit"""
    # Check if user already has a pandit profile
    existing_pandit = crud.get_pandit_by_user_id(db, current_user.id)
    if existing_pandit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pandit profile already exists"
        )
    
    # Create pandit profile
    pandit = crud.create_pandit(db, current_user.id, pandit_data)
    return pandit


@router.get("", response_model=List[schemas.PanditResponse])
def get_approved_pandits(db: Session = Depends(get_db)):
    """Get all approved pandits (public endpoint)"""
    return crud.get_all_pandits(db, approved_only=True)


@router.get("/{pandit_id}", response_model=schemas.PanditResponse)
def get_pandit(pandit_id: UUID, db: Session = Depends(get_db)):
    """Get a specific pandit by ID"""
    pandit = crud.get_pandit_by_id(db, pandit_id)
    if not pandit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pandit not found"
        )
    return pandit


@router.get("/{pandit_id}/bookings", response_model=List[schemas.BookingResponse])
def get_pandit_bookings(
    pandit_id: UUID,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all bookings for a pandit"""
    # Verify pandit exists
    pandit = crud.get_pandit_by_id(db, pandit_id)
    if not pandit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pandit not found"
        )
    
    # Only the pandit themselves or admin can view
    if pandit.user_id != current_user.id and current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    return crud.get_pandit_bookings(db, pandit_id)


@router.get("/{pandit_id}/consultations", response_model=List[schemas.ConsultationResponse])
def get_pandit_consultations(
    pandit_id: UUID,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all consultations for a pandit"""
    # Verify pandit exists
    pandit = crud.get_pandit_by_id(db, pandit_id)
    if not pandit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pandit not found"
        )
    
    # Only the pandit themselves or admin can view
    if pandit.user_id != current_user.id and current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    return crud.get_pandit_consultations(db, pandit_id)
