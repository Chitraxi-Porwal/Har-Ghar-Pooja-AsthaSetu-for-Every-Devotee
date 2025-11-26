from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from .database import Base


class UserRole(str, enum.Enum):
    USER = "user"
    PANDIT = "pandit"
    ADMIN = "admin"


class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    phone = Column(String(15), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    pandit_profile = relationship("Pandit", back_populates="user", uselist=False)
    bookings = relationship("Booking", foreign_keys="Booking.user_id", back_populates="user")
    consultations_as_user = relationship("Consultation", foreign_keys="Consultation.user_id", back_populates="user")


class Pandit(Base):
    __tablename__ = "pandits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    photo_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="pandit_profile")
    bookings = relationship("Booking", back_populates="pandit")
    consultations = relationship("Consultation", foreign_keys="Consultation.pandit_id", back_populates="pandit")


class PujaType(Base):
    __tablename__ = "puja_types"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name_local = Column(String(255), nullable=False)  # Hindi name
    name_en = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)  # Short description
    detailed_description = Column(Text, nullable=True)  # Detailed description for read more
    benefits = Column(Text, nullable=True)  # Benefits of the puja
    image_url = Column(String(500), nullable=True)  # Temple/deity image
    duration_minutes = Column(Integer, nullable=True)  # Duration of puja
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=True)
    default_price = Column(Float, nullable=False)
    is_virtual = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    bookings = relationship("Booking", back_populates="puja_type")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    pandit_id = Column(UUID(as_uuid=True), ForeignKey("pandits.id"), nullable=True)
    puja_type_id = Column(UUID(as_uuid=True), ForeignKey("puja_types.id"), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    address = Column(Text, nullable=True)
    stream_url = Column(String(500), nullable=True)
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="bookings")
    pandit = relationship("Pandit", back_populates="bookings")
    puja_type = relationship("PujaType", back_populates="bookings")
    payment = relationship("Payment", back_populates="booking", uselist=False)


class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    provider = Column(String(50), nullable=False)  # razorpay, stripe
    provider_payment_id = Column(String(255), nullable=True)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    booking = relationship("Booking", back_populates="payment")


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    pandit_id = Column(UUID(as_uuid=True), ForeignKey("pandits.id"), nullable=False)
    consultation_date = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="consultations_as_user")
    pandit = relationship("Pandit", back_populates="consultations")


class VirtualSession(Base):
    __tablename__ = "virtual_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    stream_url = Column(String(500), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    puja_type_id = Column(UUID(as_uuid=True), ForeignKey("puja_types.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
