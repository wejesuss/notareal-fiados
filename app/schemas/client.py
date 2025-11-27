from typing import List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from app.schemas.mixins import NameValidatorMixin, NicknameValidatorMixin, PhoneValidatorMixin

# ===== Base =====
class ClientBase(NameValidatorMixin, NicknameValidatorMixin, PhoneValidatorMixin, BaseModel):
    name: str = Field(..., example="João da Silva", min_length=2, max_length=40)
    nickname: str | None = Field(None, example="Joãozinho")
    phone: str | None = Field(None, example="(11) 99999-9999", \
        min_length=8, max_length=20, \
        # regex for Brazillian and USA phone numbers
        pattern=r"(?:^\+?\d{1,3}?\s?)?(?:\(\d{1,4}\)|\d{1,4})[\s\-\.]?(?:9?\s?\d{3,4})[\s\-\.]?\d{4}$"
    )
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

class ClientListResponseSchema(BaseModel):
    message: str
    clients: List[ClientResponseSchema]


# ===== LISTING =====
class ClientListQuerySchema(BaseModel):
    limit: int | None = Field(default=None, ge=1, description="Número máximo de clientes")
    offset: int = Field(default=0, ge=0, description="Número de clientes para pular")
    only_active: bool = Field(default=True, description="Retorna somente cliente ativos")
