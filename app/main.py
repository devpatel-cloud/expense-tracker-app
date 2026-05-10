from fastapi import FastAPI
from .database import engine, Base
from . import models
from .routers import users
from .routers import expenses
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(expenses.router)
app.include_router(users.router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "Expense Tracker API Running"}

@app.get("/health")
def health():
    return {"status": "healthy"}