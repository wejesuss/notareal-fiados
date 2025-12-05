from typing import List
from datetime import datetime
from pydantic import BaseModel, Field
from app.utils.exceptions import (ValidationError, error_messages)

# ===== Base =====
class PaymentBase(BaseModel):
    amount: float | None = Field(None, example=30.00)
    payment_date: int | None = Field(None, example=1764793214)  # timestamp
    method: str | None = Field(None, example="pix")
    description: str | None = Field(None, example="Pagamento adicional")


# ===== CREATE =====
class PaymentCreateSchema(PaymentBase):
    amount: float = Field(..., example=60.00)
    method: str = Field(..., example="pix")
    receipt_number: str | None = Field(None, example="REC-0003")


# ===== UPDATE =====
class PaymentUpdateSchema(PaymentBase):
   pass


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

class PaymentWithMessageResponseSchema(BaseModel):
    message: str
    payment: PaymentResponseSchema

class PaymentListResponseSchema(BaseModel):
    message: str
    payments: List[PaymentResponseSchema]


# ===== LISTING =====
class PaymentListQuerySchema(BaseModel):
    limit: int | None = Field(default=None, ge=1, description="Número máximo de pagamentos na listagem")
    offset: int = Field(default=0, ge=0, description="Número de pagamentos para ignorar antes da listagem")