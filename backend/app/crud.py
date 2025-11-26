from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from uuid import UUID
from . import models, schemas
from .auth import get_password_hash


# User CRUD
def create_user(db: Session, user: schemas.UserCreate, role: models.UserRole = models.UserRole.USER) -> models.User:
    """Create a new user"""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        phone=user.phone,
        email=user.email,
        hashed_password=hashed_password,
        role=role,
        city=user.city,
        state=user.state
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_phone(db: Session, phone: str) -> Optional[models.User]:
    """Get user by phone number"""
    return db.query(models.User).filter(models.User.phone == phone).first()


def get_user_by_id(db: Session, user_id: UUID) -> Optional[models.User]:
    """Get user by ID"""
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    """Get all users"""
    return db.query(models.User).offset(skip).limit(limit).all()


# Pandit CRUD
def create_pandit(db: Session, user_id: UUID, pandit: schemas.PanditCreate) -> models.Pandit:
    """Create a pandit profile"""
    db_pandit = models.Pandit(
        user_id=user_id,
        city=pandit.city,
        state=pandit.state,
        bio=pandit.bio,
        photo_url=pandit.photo_url,
        approved=False
    )
    db.add(db_pandit)
    db.commit()
    db.refresh(db_pandit)
    return db_pandit


def get_pandit_by_user_id(db: Session, user_id: UUID) -> Optional[models.Pandit]:
    """Get pandit profile by user ID"""
    return db.query(models.Pandit).filter(models.Pandit.user_id == user_id).first()


def get_pandit_by_id(db: Session, pandit_id: UUID) -> Optional[models.Pandit]:
    """Get pandit by ID"""
    return db.query(models.Pandit).filter(models.Pandit.id == pandit_id).first()


def get_all_pandits(db: Session, approved_only: bool = False) -> List[models.Pandit]:
    """Get all pandits"""
    query = db.query(models.Pandit)
    if approved_only:
        query = query.filter(models.Pandit.approved == True)
    return query.all()


def approve_pandit(db: Session, pandit_id: UUID, approved: bool) -> Optional[models.Pandit]:
    """Approve or reject pandit"""
    pandit = get_pandit_by_id(db, pandit_id)
    if pandit:
        pandit.approved = approved
        db.commit()
        db.refresh(pandit)
    return pandit


# Puja Type CRUD
def create_puja_type(db: Session, puja: schemas.PujaTypeCreate) -> models.PujaType:
    """Create a new puja type"""
    db_puja = models.PujaType(**puja.dict())
    db.add(db_puja)
    db.commit()
    db.refresh(db_puja)
    return db_puja


def get_puja_type_by_id(db: Session, puja_id: UUID) -> Optional[models.PujaType]:
    """Get puja type by ID"""
    return db.query(models.PujaType).filter(models.PujaType.id == puja_id).first()


def get_all_puja_types(db: Session) -> List[models.PujaType]:
    """Get all puja types"""
    return db.query(models.PujaType).all()


def update_puja_type(db: Session, puja_id: UUID, puja_update: schemas.PujaTypeUpdate) -> Optional[models.PujaType]:
    """Update puja type"""
    puja = get_puja_type_by_id(db, puja_id)
    if puja:
        update_data = puja_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(puja, key, value)
        db.commit()
        db.refresh(puja)
    return puja


# Booking CRUD
def create_booking(db: Session, user_id: UUID, booking: schemas.BookingCreate) -> models.Booking:
    """Create a new booking"""
    puja = get_puja_type_by_id(db, booking.puja_type_id)
    price = puja.default_price if puja else 0
    
    db_booking = models.Booking(
        user_id=user_id,
        puja_type_id=booking.puja_type_id,
        pandit_id=booking.pandit_id,
        scheduled_at=booking.scheduled_at,
        address=booking.address,
        price=price,
        status=models.BookingStatus.PENDING
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


def get_booking_by_id(db: Session, booking_id: UUID) -> Optional[models.Booking]:
    """Get booking by ID"""
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()


def get_user_bookings(db: Session, user_id: UUID) -> List[models.Booking]:
    """Get all bookings for a user"""
    return db.query(models.Booking).filter(models.Booking.user_id == user_id).all()


def get_pandit_bookings(db: Session, pandit_id: UUID) -> List[models.Booking]:
    """Get all bookings for a pandit"""
    return db.query(models.Booking).filter(models.Booking.pandit_id == pandit_id).all()


def get_all_bookings(db: Session) -> List[models.Booking]:
    """Get all bookings"""
    return db.query(models.Booking).all()


def update_booking(db: Session, booking_id: UUID, booking_update: schemas.BookingUpdate) -> Optional[models.Booking]:
    """Update booking"""
    booking = get_booking_by_id(db, booking_id)
    if booking:
        update_data = booking_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(booking, key, value)
        db.commit()
        db.refresh(booking)
    return booking


def cancel_booking(db: Session, booking_id: UUID) -> Optional[models.Booking]:
    """Cancel a booking"""
    booking = get_booking_by_id(db, booking_id)
    if booking:
        booking.status = models.BookingStatus.CANCELLED
        db.commit()
        db.refresh(booking)
    return booking


# Payment CRUD
def create_payment(db: Session, booking_id: UUID, provider: str, amount: float) -> models.Payment:
    """Create a payment record"""
    db_payment = models.Payment(
        booking_id=booking_id,
        amount=amount,
        provider=provider,
        status=models.PaymentStatus.PENDING
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment


def get_payment_by_booking_id(db: Session, booking_id: UUID) -> Optional[models.Payment]:
    """Get payment by booking ID"""
    return db.query(models.Payment).filter(models.Payment.booking_id == booking_id).first()


def update_payment_status(
    db: Session,
    payment_id: UUID,
    status: models.PaymentStatus,
    provider_payment_id: Optional[str] = None
) -> Optional[models.Payment]:
    """Update payment status"""
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if payment:
        payment.status = status
        if provider_payment_id:
            payment.provider_payment_id = provider_payment_id
        db.commit()
        db.refresh(payment)
    return payment


# Consultation CRUD
def create_consultation(db: Session, user_id: UUID, consultation: schemas.ConsultationCreate) -> models.Consultation:
    """Create a consultation"""
    db_consultation = models.Consultation(
        user_id=user_id,
        pandit_id=consultation.pandit_id,
        consultation_date=consultation.consultation_date,
        price=consultation.price,
        notes=consultation.notes,
        status=models.BookingStatus.PENDING
    )
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation


def get_pandit_consultations(db: Session, pandit_id: UUID) -> List[models.Consultation]:
    """Get all consultations for a pandit"""
    return db.query(models.Consultation).filter(models.Consultation.pandit_id == pandit_id).all()


# Virtual Session CRUD
def create_virtual_session(db: Session, session: schemas.VirtualSessionCreate) -> models.VirtualSession:
    """Create a virtual session"""
    db_session = models.VirtualSession(**session.dict())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


def get_virtual_session_by_id(db: Session, session_id: UUID) -> Optional[models.VirtualSession]:
    """Get virtual session by ID"""
    return db.query(models.VirtualSession).filter(models.VirtualSession.id == session_id).first()


def get_active_virtual_sessions(db: Session) -> List[models.VirtualSession]:
    """Get all active virtual sessions"""
    return db.query(models.VirtualSession).filter(models.VirtualSession.is_active == True).all()


# Admin Stats
def get_admin_stats(db: Session) -> dict:
    """Get admin dashboard statistics"""
    total_users = db.query(func.count(models.User.id)).filter(
        models.User.role == models.UserRole.USER
    ).scalar()
    
    total_pandits = db.query(func.count(models.Pandit.id)).scalar()
    
    total_bookings = db.query(func.count(models.Booking.id)).scalar()
    
    total_revenue = db.query(func.sum(models.Payment.amount)).filter(
        models.Payment.status == models.PaymentStatus.SUCCESS
    ).scalar() or 0
    
    pending_approvals = db.query(func.count(models.Pandit.id)).filter(
        models.Pandit.approved == False
    ).scalar()
    
    active_sessions = db.query(func.count(models.VirtualSession.id)).filter(
        models.VirtualSession.is_active == True
    ).scalar()
    
    return {
        "total_users": total_users,
        "total_pandits": total_pandits,
        "total_bookings": total_bookings,
        "total_revenue": float(total_revenue),
        "pending_approvals": pending_approvals,
        "active_virtual_sessions": active_sessions
    }
