from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, crud, auth, models
from ..database import get_db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    db_user = crud.get_user_by_phone(db, phone=user.phone)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )
    
    # Create user
    new_user = crud.create_user(db=db, user=user)
    
    # Generate tokens
    access_token = auth.create_access_token(data={"sub": new_user.phone})
    refresh_token = auth.create_refresh_token(data={"sub": new_user.phone})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": new_user
    }


@router.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = auth.authenticate_user(db, user_credentials.phone, user_credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate tokens
    access_token = auth.create_access_token(data={"sub": user.phone})
    refresh_token = auth.create_refresh_token(data={"sub": user.phone})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/refresh", response_model=schemas.Token)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """Refresh access token"""
    # Verify refresh token
    payload = auth.verify_token(refresh_token, "refresh")
    phone = payload.get("sub")
    
    if not phone:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Get user
    user = crud.get_user_by_phone(db, phone)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Generate new tokens
    new_access_token = auth.create_access_token(data={"sub": user.phone})
    new_refresh_token = auth.create_refresh_token(data={"sub": user.phone})
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    """Get current user information"""
    return current_user
