from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from app.schemas.mixins import NameValidatorMixin

# ===== Base =====
class ClientBase(NameValidatorMixin, BaseModel):
    name: str = Field(..., example="João da Silva", min_length=2)
    nickname: str | None = Field(None, example="Joãozinho")
    phone: str | None = Field(None, example="(11) 99999-9999")
    email: EmailStr | None = Field(None, example="joao@example.com")

    model_config = dict(extra="ignore")

# ===== CREATE =====
class ClientCreateSchema(ClientBase):
    pass

# ===== UPDATE =====
class ClientUpdateSchema(BaseModel):
    name: str | None = Field(None)
    nickname: str | None = Field(None)
    phone: str | None = Field(None)
    email: EmailStr | None = Field(None)
    is_active: int | None = Field(None)

# ===== RESPONSE =====
class ClientResponseSchema(BaseModel):
    id: int
    name: str
    nickname: str | None
    phone: str | None
    email: EmailStr | None
    is_active: int
    created_at: datetime
    updated_at: datetime

    model_config = dict(from_attributes = True)

class ClientCreateResponseSchema(BaseModel):
    message: str
    client: ClientResponseSchema
