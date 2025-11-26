from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from .. import schemas, crud, auth, models
from ..database import get_db

router = APIRouter(prefix="/api/pujas", tags=["Pujas"])


@router.get("", response_model=List[schemas.PujaTypeResponse])
def get_all_pujas(db: Session = Depends(get_db)):
    """Get all puja types (public endpoint)"""
    return crud.get_all_puja_types(db)


@router.get("/{puja_id}", response_model=schemas.PujaTypeResponse)
def get_puja(puja_id: UUID, db: Session = Depends(get_db)):
    """Get a specific puja type by ID"""
    puja = crud.get_puja_type_by_id(db, puja_id)
    if not puja:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Puja type not found"
        )
    return puja
