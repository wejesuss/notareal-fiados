from typing import List
from datetime import datetime
from pydantic import BaseModel, Field
from app.utils.exceptions import (ValidationError, error_messages)

# ===== Base =====
class PaymentBase(BaseModel):
    amount: float = Field(..., example=60.00)
    payment_date: int | None = Field(None, example=1700000000)  # timestamp
    method: str = Field(..., example="pix")
    description: str | None = Field(None)
    receipt_number: str | None = Field(None, example="REC-0003")


# ===== CREATE =====
class PaymentCreateSchema(PaymentBase):
    purchase_id: int | None = None  # filled by route/service


# ===== UPDATE =====
class PaymentUpdateSchema(BaseModel):
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
    method: str | None
    description: str | None
    receipt_number: str | None
    is_active: int
    created_at: datetime
    updated_at: datetime | None

    model_config = dict(from_attributes = True)

class PaymentListResponseSchema(BaseModel):
    message: str
    payments: List[PaymentResponseSchema]


# ===== LISTING =====
class PaymentListQuerySchema(BaseModel):
    limit: int | None = Field(default=None, ge=1, description="Número máximo de pagamentos na listagem")
    offset: int = Field(default=0, ge=0, description="Número de pagamentos para ignorar antes da listagem")