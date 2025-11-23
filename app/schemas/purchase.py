from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.mixins import AmountValidatorMixin

# ===== Base =====
class PurchaseBase(AmountValidatorMixin):
    description: str = Field(..., example="Compra de produtos agrícolas")
    total_value: float = Field(..., example=150.75)
    note_number: str | None = Field(None, example="NF-0001")

    # optional payment fields for creation
    amount: float | None = Field(None, example=50.00)
    payment_date: int | None = Field(None, example=1700000000)  # timestamp
    method: str | None = Field(None, example="pix")
    payment_description: str | None = Field(None)
    receipt_number: str | None = Field(None, example="REC-0001")


# ===== CREATE =====
class PurchaseCreateSchema(PurchaseBase):
    pass


# ===== UPDATE =====
class PurchaseUpdateSchema(BaseModel):
    description: str | None = None
    total_value: float | None = None
    client_id: int | None = None


# ===== RESPONSE =====
class PurchaseResponseSchema(BaseModel):
    id: int
    client_id: int
    description: str
    total_value: float
    total_paid_value: float
    status: str
    note_number: str
    is_active: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
