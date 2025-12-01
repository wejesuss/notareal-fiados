from typing import List
from datetime import datetime
from pydantic import BaseModel, Field

# ===== Base =====
class PurchaseBase(BaseModel):
    description: str = Field(..., example="Compra de produtos agrícolas")
    total_value: float = Field(..., example=150.75)
    note_number: str | None = Field(None, example="NF-0001")

    # optional payment fields for creation
    amount: float | None = Field(None, example=50.00)
    payment_date: int | None = Field(None, example=1700000000)  # timestamp
    method: str | None = Field(None, example="pix")
    payment_description: str | None = Field(None, example="Pagamento adiantado")
    receipt_number: str | None = Field(None, example="REC-0001")

    model_config = dict(extra="ignore")

# ===== CREATE =====
class PurchaseCreateSchema(PurchaseBase):
    pass


# ===== UPDATE =====
class PurchaseUpdateSchema(BaseModel):
    description: str | None = Field(
        None,
        example="Compra de produtos agrícolas",
        description="Descrição da compra."
    )
    total_value: float | None = Field(
        None,
        example=150.75,
        gt=0,
        description="Valor total da compra. Deve ser maior que zero."
    )
    client_id: int | None = Field(
        None,
        ge=1,
        strict=True,
        description="ID do cliente associado. Deve ser um inteiro estrito."
    )

    model_config = dict(extra="ignore")


# ===== RESPONSE =====
class PurchaseResponseSchema(BaseModel):
    id: int
    client_id: int
    description: str
    total_value: float
    total_paid_value: float
    status: str
    note_number: str | None
    is_active: int
    created_at: datetime
    updated_at: datetime

    model_config = dict(from_attributes = True)

class PurchaseWithMessageResponseSchema(BaseModel):
    message: str
    purchase: PurchaseResponseSchema | None = None

class PurchaseListResponseSchema(BaseModel):
    message: str
    purchases: List[PurchaseResponseSchema]


# ===== LISTING =====
class PurchaseListQuerySchema(BaseModel):
    limit: int | None = Field(default=None, ge=1, description="Número máximo de compras na listagem")
    offset: int = Field(default=0, ge=0, description="Número de compras para ignorar antes da listagem")
    only_pending: bool | None = Field(default=None, description="Filtrar somente compras ativas não quitadas. Se nulo, busca compras já desativadas.")