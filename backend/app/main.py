from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, pujas, bookings, payments, admin, pandits, chatbot, consultations
import os
import razorpay

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Har Ghar Pooja API",
    description="AsthaSetu for Every Devotee",
    version="1.0.0"
)

# CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(pujas.router)
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(admin.router)
app.include_router(pandits.router)
app.include_router(chatbot.router)
app.include_router(consultations.router)

@app.get("/")
def root():
    return {"message": "Har Ghar Pooja API - AsthaSetu for Every Devotee"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
