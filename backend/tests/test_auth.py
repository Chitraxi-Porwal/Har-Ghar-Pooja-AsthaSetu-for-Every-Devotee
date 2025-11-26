import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

client = TestClient(app)

# Create tables for testing
Base.metadata.create_all(bind=engine)


def test_register_user():
    """Test user registration"""
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "phone": "919999111122",
            "password": "Test@123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["phone"] == "919999111122"


def test_register_duplicate_phone():
    """Test registration with existing phone"""
    # First registration
    client.post(
        "/api/auth/register",
        json={
            "name": "User One",
            "phone": "919999222233",
            "password": "Test@123"
        }
    )
    
    # Duplicate registration
    response = client.post(
        "/api/auth/register",
        json={
            "name": "User Two",
            "phone": "919999222233",
            "password": "Test@456"
        }
    )
    assert response.status_code == 400


def test_login_success():
    """Test successful login"""
    # Register first
    client.post(
        "/api/auth/register",
        json={
            "name": "Login Test",
            "phone": "919999333344",
            "password": "Test@123"
        }
    )
    
    # Login
    response = client.post(
        "/api/auth/login",
        json={
            "phone": "919999333344",
            "password": "Test@123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_login_wrong_password():
    """Test login with wrong password"""
    # Register
    client.post(
        "/api/auth/register",
        json={
            "name": "Wrong Pass Test",
            "phone": "919999444455",
            "password": "Correct@123"
        }
    )
    
    # Login with wrong password
    response = client.post(
        "/api/auth/login",
        json={
            "phone": "919999444455",
            "password": "Wrong@123"
        }
    )
    assert response.status_code == 401


def test_get_current_user():
    """Test getting current user info"""
    # Register and get token
    register_response = client.post(
        "/api/auth/register",
        json={
            "name": "Current User Test",
            "phone": "919999555566",
            "password": "Test@123"
        }
    )
    token = register_response.json()["access_token"]
    
    # Get user info
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["phone"] == "919999555566"
    assert data["name"] == "Current User Test"


def test_unauthorized_access():
    """Test accessing protected route without token"""
    response = client.get("/api/auth/me")
    assert response.status_code == 403  # No credentials provided
