from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from .. import schemas, crud, auth, models
from ..database import get_db

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.post("/pujas", response_model=schemas.PujaTypeResponse, status_code=status.HTTP_201_CREATED)
def create_puja(
    puja: schemas.PujaTypeCreate,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new puja type (Admin only)"""
    return crud.create_puja_type(db, puja)


@router.patch("/pujas/{puja_id}", response_model=schemas.PujaTypeResponse)
def update_puja(
    puja_id: UUID,
    puja_update: schemas.PujaTypeUpdate,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a puja type (Admin only)"""
    puja = crud.update_puja_type(db, puja_id, puja_update)
    if not puja:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Puja type not found"
        )
    return puja


@router.get("/pandits", response_model=List[schemas.PanditResponse])
def get_all_pandits(
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all pandits including unapproved (Admin only)"""
    return crud.get_all_pandits(db, approved_only=False)


@router.patch("/pandits/{pandit_id}/approve", response_model=schemas.PanditResponse)
def approve_pandit(
    pandit_id: UUID,
    approval: schemas.PanditApproval,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Approve or reject a pandit (Admin only)"""
    pandit = crud.approve_pandit(db, pandit_id, approval.approved)
    if not pandit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pandit not found"
        )
    
    # Update user role to pandit if approved
    if approval.approved:
        user = crud.get_user_by_id(db, pandit.user_id)
        if user:
            user.role = models.UserRole.PANDIT
            db.commit()
    
    return pandit


@router.get("/stats", response_model=schemas.AdminStats)
def get_admin_stats(
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics"""
    return crud.get_admin_stats(db)


@router.get("/bookings", response_model=List[schemas.BookingResponse])
def get_all_bookings(
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all bookings (Admin only)"""
    return crud.get_all_bookings(db)


@router.get("/users", response_model=List[schemas.UserResponse])
def get_all_users(
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all users (Admin only)"""
    return crud.get_all_users(db)


@router.post("/virtual-sessions", response_model=schemas.VirtualSessionResponse, status_code=status.HTTP_201_CREATED)
def create_virtual_session(
    session: schemas.VirtualSessionCreate,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a virtual puja session (Admin only)"""
    return crud.create_virtual_session(db, session)


@router.get("/virtual-sessions", response_model=List[schemas.VirtualSessionResponse])
def get_virtual_sessions(
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all virtual sessions (Admin only)"""
    return crud.get_active_virtual_sessions(db)
