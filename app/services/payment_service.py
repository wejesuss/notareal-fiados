from typing import List
from models.payment import Payment
from repositories import payment_repository

def get_payments(limit: int = None, offset: int = 0, purchase_id: int = None) -> List[Payment]:
    payments = payment_repository.get_payments(limit, offset, purchase_id)
    if not payments:
        return []
    
    return payments

def get_payment_by_id(payment_id: int) -> Payment | None:
    return payment_repository.get_payment_by_id(payment_id)

def create_payment(data: dict) -> Payment:
    return payment_repository.insert_payment(data)

def delete_payment(payment_id: int):
    """Deactivate (soft delete) a payment."""
    return payment_repository.delete_payment(payment_id)

# Payment related services (business logic)
def deactivate_payments_by_purchase(purchase_id: int):
    """Deactivate all payments for a given purchase."""
    return payment_repository.deactivate_payments_by_purchase_id(purchase_id)
