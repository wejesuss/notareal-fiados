from datetime import datetime
from pydantic import BaseModel, Field, field_validator
from app.schemas.mixins import AmountValidatorMixin
from app.utils.exceptions import (ValidationError, error_messages)

# ===== Base =====
class PaymentBase(AmountValidatorMixin):
    amount: float = Field(..., example=60.00)
    payment_date: int | None = Field(None, example=1700000000)  # timestamp
    method: str = Field(..., example="pix")
    description: str | None = Field(None)
    receipt_number: str | None = Field(None, example="REC-0003")


# ===== CREATE =====
class PaymentCreateSchema(PaymentBase):
    purchase_id: int | None = None  # filled by route/service


# ===== UPDATE =====
class PaymentUpdateSchema(AmountValidatorMixin):
    amount: float | None = None
    payment_date: int | None = None
    method: str | None = None
    description: str | None = None


# ===== RESPONSE =====
class PaymentResponseSchema(BaseModel):
    id: int
    purchase_id: int
    amount: float
    payment_date: datetime | None
    method: str
    description: str | None
    receipt_number: str
    is_active: int
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True
