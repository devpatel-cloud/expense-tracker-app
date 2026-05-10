from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user

router = APIRouter()

@router.post("/expenses")
def create_expense(
    expense: schemas.ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_expense = models.Expense(
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        owner_id=current_user.id
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return {
        "message": "Expense created successfully"
    }

@router.get("/expenses")
def get_expenses(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    expenses = db.query(models.Expense).filter(
        models.Expense.owner_id == current_user.id
    ).all()

    return expenses