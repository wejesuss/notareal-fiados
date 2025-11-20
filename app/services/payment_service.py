from typing import List
from models import Payment
from repositories import payment_repository
from utils.exceptions import (
    ValidationError, NotFoundError,
    error_messages
)

def get_payments(limit: int = None, offset: int = 0, purchase_id: int = None) -> List[Payment]:
    """Retrieve payments, optionally filtered by purchase."""
    payments = payment_repository.get_payments(limit, offset, purchase_id)
    if not payments:
        return []
    
    return payments

def get_payment_by_id(payment_id: int) -> Payment | None:
    """Retrieve a single payment by ID."""
    return payment_repository.get_payment_by_id(payment_id)

def create_payment(data: dict) -> Payment:
    """Create a new payment record."""
    # Validate fields, method, note_number etc.
    if not data.get("purchase_id"):
        raise ValueError("O pagamento precisa estar vinculado a uma compra.")
    if not data.get("amount") or data.get("amount") <= 0:
        raise ValueError("O valor do pagamento deve ser maior que zero.")

    return payment_repository.insert_payment(data)

def update_payment(payment_id: int, data: dict) -> Payment | None:
    """Update payment for allowed payment fields (amount, payment_date, method, description)"""
    # fields that are allowed to be updated
    allowed_fields = ["amount", "payment_date", "method", "description"]

    # filter data fields
    validated_data = {k: v for k, v in data.items() if k in allowed_fields}
    if not validated_data:
        raise ValidationError(error_messages.DATA_FIELDS_EMPTY)

    # validate is_active, only allowing deactivation from the correct route
    if validated_data.get("is_active") == 0:
        raise ValidationError(error_messages.PURCHASE_INVALID_ACTIVATION_ROUTE)

    # Validate amount
    if "amount" in update_data:
        amount = float(update_data["amount"])
        if amount < 0:
            raise ValidationError(error_messages.PAYMENT_INVALID_AMOUNT)

    updated = payment_repository.update_payment(payment_id, data)
    return updated

def activate_payment(payment_id: int, data: dict) -> Payment:
    """Activate payment for the given ID"""
    return payment_repository.update_payment(payment_id, data)

def deactivate_payment(payment_id: int) -> bool:
    """Deactivate (soft delete) a payment."""
    return payment_repository.deactivate_payment(payment_id)

def deactivate_payments_by_purchase(purchase_id: int):
    """Deactivate all payments for a given purchase."""
    return payment_repository.deactivate_payments_by_purchase_id(purchase_id)
