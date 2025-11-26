from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from enum import Enum


# Enums
class UserRole(str, Enum):
    USER = "user"
    PANDIT = "pandit"
    ADMIN = "admin"


class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


# User Schemas
class UserBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    phone: str
    password: str


class UserResponse(UserBase):
    id: UUID
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


# Pandit Schemas
class PanditBase(BaseModel):
    city: str
    state: str
    bio: Optional[str] = None
    photo_url: Optional[str] = None


class PanditCreate(PanditBase):
    pass


class PanditResponse(PanditBase):
    id: UUID
    user_id: UUID
    approved: bool
    created_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


class PanditApproval(BaseModel):
    approved: bool


# Puja Type Schemas
class PujaTypeBase(BaseModel):
    name_local: str
    name_en: str
    description: Optional[str] = None
    detailed_description: Optional[str] = None
    benefits: Optional[str] = None
    image_url: Optional[str] = None
    duration_minutes: Optional[int] = None
    min_price: float
    max_price: Optional[float] = None
    default_price: float
    is_virtual: bool = False


class PujaTypeCreate(PujaTypeBase):
    pass


class PujaTypeUpdate(BaseModel):
    name_local: Optional[str] = None
    name_en: Optional[str] = None
    description: Optional[str] = None
    detailed_description: Optional[str] = None
    benefits: Optional[str] = None
    image_url: Optional[str] = None
    duration_minutes: Optional[int] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    default_price: Optional[float] = None
    is_virtual: Optional[bool] = None


class PujaTypeResponse(PujaTypeBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# Booking Schemas
class BookingBase(BaseModel):
    puja_type_id: UUID
    pandit_id: Optional[UUID] = None
    scheduled_at: datetime
    address: Optional[str] = None
    is_virtual: bool = False


class BookingCreate(BookingBase):
    pass


class BookingResponse(BookingBase):
    id: UUID
    user_id: UUID
    status: BookingStatus
    price: float
    stream_url: Optional[str] = None
    created_at: datetime
    puja_type: Optional[PujaTypeResponse] = None
    user: Optional['UserResponse'] = None

    class Config:
        from_attributes = True


class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    scheduled_at: Optional[datetime] = None
    pandit_id: Optional[UUID] = None
    stream_url: Optional[str] = None


# Payment Schemas
class PaymentCreate(BaseModel):
    booking_id: UUID
    provider: str  # razorpay or stripe


class PaymentResponse(BaseModel):
    id: UUID
    booking_id: UUID
    amount: float
    provider: str
    provider_payment_id: Optional[str] = None
    status: PaymentStatus
    created_at: datetime

    class Config:
        from_attributes = True


class PaymentWebhook(BaseModel):
    provider: str
    event: str
    payload: dict


# Consultation Schemas
class ConsultationBase(BaseModel):
    pandit_id: UUID
    consultation_date: datetime
    price: float
    notes: Optional[str] = None


class ConsultationCreate(ConsultationBase):
    pass


class ConsultationResponse(ConsultationBase):
    id: UUID
    user_id: UUID
    status: BookingStatus
    created_at: datetime

    class Config:
        from_attributes = True


# Virtual Session Schemas
class VirtualSessionBase(BaseModel):
    title: str
    description: Optional[str] = None
    stream_url: str
    scheduled_at: datetime
    puja_type_id: Optional[UUID] = None


class VirtualSessionCreate(VirtualSessionBase):
    pass


class VirtualSessionResponse(VirtualSessionBase):
    id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Chatbot Schemas
class ChatbotQuery(BaseModel):
    question: str
    user_id: Optional[UUID] = None


class ChatbotResponse(BaseModel):
    answer: str
    suggested_pujas: Optional[List[str]] = None


# Recommendation Schemas
class RecommendationRequest(BaseModel):
    purpose: str
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None


class RecommendationResponse(BaseModel):
    puja_type: str
    puja_type_id: UUID
    reason: str
    estimated_price: float


# Admin Stats
class AdminStats(BaseModel):
    total_users: int
    total_pandits: int
    total_bookings: int
    total_revenue: float
    pending_approvals: int
    active_virtual_sessions: int
