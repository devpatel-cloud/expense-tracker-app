from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import users
from .routers import expenses

# Create FastAPI App
app = FastAPI(
    title="Expense Tracker API",
    description="FastAPI Expense Tracker with Frontend",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Database Tables
Base.metadata.create_all(bind=engine)

# Include Routers
app.include_router(users.router)
app.include_router(expenses.router)

# Serve Frontend Static Files
app.mount(
    "/frontend",
    StaticFiles(directory="frontend"),
    name="frontend"
)

# Root Endpoint
@app.get("/")
def home():
    return {
        "message": "Expense Tracker API Running Successfully"
    }

# Health Check Endpoint
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }