from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from .. import schemas, crud, auth, models
from ..database import get_db

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


@router.post("", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking: schemas.BookingCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new booking"""
    # Verify puja type exists
    puja = crud.get_puja_type_by_id(db, booking.puja_type_id)
    if not puja:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Puja type not found"
        )
    
    # Verify pandit exists and is approved (if specified)
    if booking.pandit_id:
        pandit = crud.get_pandit_by_id(db, booking.pandit_id)
        if not pandit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pandit not found"
            )
        if not pandit.approved:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pandit is not approved"
            )
    
    # Create booking
    new_booking = crud.create_booking(db, current_user.id, booking)
    return new_booking


@router.get("/my-bookings", response_model=List[schemas.BookingResponse])
def get_my_bookings(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all bookings for the current user"""
    return crud.get_user_bookings(db, current_user.id)


@router.get("/{booking_id}", response_model=schemas.BookingResponse)
def get_booking(
    booking_id: UUID,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific booking"""
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Verify user has access to this booking
    if booking.user_id != current_user.id and current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this booking"
        )
    
    return booking


@router.patch("/{booking_id}/cancel", response_model=schemas.BookingResponse)
def cancel_booking(
    booking_id: UUID,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel a booking"""
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Verify user owns this booking
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this booking"
        )
    
    # Check if booking is already completed or cancelled
    if booking.status in [models.BookingStatus.COMPLETED, models.BookingStatus.CANCELLED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel a {booking.status} booking"
        )
    
    return crud.cancel_booking(db, booking_id)


@router.patch("/{booking_id}", response_model=schemas.BookingResponse)
def update_booking(
    booking_id: UUID,
    booking_update: schemas.BookingUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update a booking (for pandits/admins)"""
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Only pandit assigned to booking or admin can update
    is_authorized = False
    if current_user.role == models.UserRole.ADMIN:
        is_authorized = True
    elif current_user.role == models.UserRole.PANDIT:
        pandit = crud.get_pandit_by_user_id(db, current_user.id)
        if pandit and booking.pandit_id == pandit.id:
            is_authorized = True
    
    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this booking"
        )
    
    return crud.update_booking(db, booking_id, booking_update)
