from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# ===== Base =====
class ClientBase(BaseModel):
    name: str = Field(..., example="João da Silva")
    nickname: str | None = Field(None, example="Joãozinho")
    phone: str | None = Field(None, example="(11) 99999-9999")
    email: EmailStr | None = Field(None, example="joao@example.com")

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

    class Config:
        from_attributes = True
