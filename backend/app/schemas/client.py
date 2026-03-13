from typing import List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from app.schemas.base import CamelModel
from app.schemas.mixins import (
    NameValidatorMixin,
    NicknameValidatorMixin,
    PhoneValidatorMixin,
    SummaryMixin,
)


# ===== Base =====
class ClientBase(
    NameValidatorMixin, NicknameValidatorMixin, PhoneValidatorMixin, CamelModel
):
    name: str | None = Field(None, example="João da Silva", min_length=2, max_length=40)
    nickname: str | None = Field(None, example="Joãozinho")
    phone: str | None = Field(
        None,
        example="(11) 99999-9999",
        min_length=8,
        max_length=20,  # regex for Brazillian and USA phone numbers
        pattern=r"(?:^\+?\d{1,3}?\s?)?(?:\(\d{1,4}\)|\d{1,4})[\s\-\.]?(?:9?\s?\d{3,4})[\s\-\.]?\d{4}$",
    )
    email: EmailStr | None = Field(None, example="joao@example.com")

    model_config = dict(extra="ignore")


# ===== CREATE =====
class ClientCreateSchema(ClientBase):
    name: str = Field(
        ..., example="João da Silva", min_length=2, max_length=40
    )  # required for creation


# ===== UPDATE =====
class ClientUpdateSchema(ClientBase):
    pass


# ===== RESPONSE =====
class ClientResponseSchema(CamelModel):
    id: int
    name: str
    nickname: str | None
    phone: str | None
    email: EmailStr | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = dict(from_attributes=True)


class ClientSummaryResponseSchema(CamelModel, SummaryMixin):
    total_purchases: int
    total_paid_cents: int
    outstanding_balance_cents: int


class ClientWithMessageResponseSchema(BaseModel):
    message: str
    client: ClientResponseSchema


class ClientListResponseSchema(BaseModel):
    message: str
    clients: List[ClientResponseSchema]
    total: int


# ===== LISTING =====
class ClientListQuerySchema(CamelModel):
    limit: int | None = Field(
        default=None, ge=1, description="Número máximo de clientes na listagem"
    )
    offset: int = Field(
        default=0, ge=0, description="Número de clientes para ignorar antes da listagem"
    )
    only_active: bool = Field(
        default=True, description="Filtrar somente clientes ativos"
    )
