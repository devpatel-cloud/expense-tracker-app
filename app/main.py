from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from . import models
from .routers import users
from .routers import expenses

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(users.router)
app.include_router(expenses.router)

# Create Database Tables
Base.metadata.create_all(bind=engine)

# Serve Frontend Files
app.mount("/frontend", StaticFiles(directory="/app/frontend"), name="frontend")

# Home Endpoint
@app.get("/")
def home():
    return {"message": "Expense Tracker API Running"}

# Health Check Endpoint
@app.get("/health")
def health():
    return {"status": "healthy"}