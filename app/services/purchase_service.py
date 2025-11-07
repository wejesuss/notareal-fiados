from typing import List
from datetime import datetime
from models import (Purchase, Payment)
from services import payment_service
from repositories import (purchase_repository, payment_repository)

def get_purchase_by_id(purchase_id: int) -> Purchase | None:
    return purchase_repository.get_purchase_by_id(purchase_id)

def get_purchase_by_note_number(note_number: str) -> Purchase | None:
    return purchase_repository.get_purchase_by_note_number(note_number)

def get_purchases(limit: int = None, offset: int = 0, only_pending: bool | None = True) -> List[Purchase]:
    purchases = purchase_repository.get_purchases(limit, offset, only_pending)
    if not purchases:
        return []
    
    return purchases

def create_purchase(client_id: int, data: dict) -> Purchase:
    total_paid_value = float(data.get("total_paid_value"))
    total_value = float(data.get("total_value"))
    amount = float(data.get("amount"))

    if not total_value or total_value <= 0:
        raise ValueError("O preço da compra deve ser maior que zero.")
    if not amount or amount <= 0:
        raise ValueError("O valor do pagamento deve ser maior que zero.")

    create_new_payment = False

    status = "pending"
    if total_paid_value >= total_value:
        create_new_payment = True
        status = "paid"
    elif amount > 0:
        total_paid_value = amount
        create_new_payment = True
        status = "partial"

    data.update({"client_id": client_id, "status": status})

    purchase = purchase_repository.insert_purchase(data)

    if create_new_payment:
        payment_data: dict = {
            "purchase_id": purchase.id,
            "amount": amount,
            "payment_date": data.get("payment_date"),
            "method": data.get("method"),
            "description": data.get("payment_description"),
            "receipt_number": data.get("receipt_number")
        }

        payment_service.create_payment(payment_data)

    return purchase

def update_purchase(purchase_id: int, data: dict) -> Purchase | None:
    purchase_exists = purchase_repository.get_purchase_by_id(purchase_id)
    if not purchase_exists:
        return None

    valid_status = {"pending", "partial", "paid"}
    if "status" in data and data["status"] not in valid_status:
        raise ValueError("Status inválido. Use 'pending', 'partial' ou 'paid'.")

    purchase = purchase_repository.update_purchase(purchase_id, data)
    recalculate_purchase_totals(purchase_id)

    return purchase

def deactivate_purchase(purchase_id: int) -> bool:
    """Deactivate a purchase."""
    success = purchase_repository.deactivate_purchase(purchase_id)
    if success:
        payment_service.deactivate_payments_by_purchase(purchase_id)
        recalculate_purchase_totals(purchase_id)
    
    return success

# Client related services (business logic)
def get_purchases_by_client(client_id: int, only_active: bool = True) -> List[Purchase]:
    return purchase_repository.get_purchases_by_client_id(client_id, only_active)

def deactivate_purchases_by_client(client_id: int) -> None:
    """Deactivate all purchases (and related payments) for a given client."""
    # get purchases ids related to that client
    purchases_ids = purchase_repository.get_purchases_ids_by_client_id(client_id)

    # disable all purchases related to that client
    success = purchase_repository.deactivate_purchases_by_client_id(client_id)

    # cascade to payments
    if success:
        for purchase_id in purchases_ids:
            payment_service.deactivate_payments_by_purchase(purchase_id)
            purchase_repository.update_purchase(purchase_id, {
                "total_paid_value": 0,
                "status": "pending"
            })

    return success

# Payment related services (business logic)
def get_payments_for_purchase(purchase_id: int, limit: int = None, offset: int = 0) -> List[Payment]:
    """List payments for a specific purchase."""
    return payment_service.get_payments(limit, offset, purchase_id)

def get_payment_by_id(payment_id: int) -> Payment | None:
    return payment_service.get_payment_by_id(payment_id)

def create_payment(purchase_id: int, data: dict) -> Payment:
    """Create a new payment and update purchase totals."""
    data["purchase_id"] = purchase_id
    payment = payment_service.create_payment(data)
    recalculate_purchase_totals(purchase_id)

    return payment

def deactivate_payment(purchase_id: int, payment_id: int) -> bool:
    """Deactivate a payment and update purchase totals."""
    success = payment_service.deactivate_payment(payment_id)
    if success:
        recalculate_purchase_totals(purchase_id)
    return success

def recalculate_purchase_totals(purchase_id: int):
    """Recalculate purchase total_paid_value and status based on active payments."""
    purchase = purchase_repository.get_purchase_by_id(purchase_id)
    if not purchase or not purchase.is_active:
        return

    payments = payment_service.get_payments(limit = None, offset = 0, purchase_id = purchase_id)
    active_payments = [p for p in payments if p.is_active]
    total_paid = sum(p.amount for p in active_payments)

    new_status = "pending"
    if total_paid >= purchase.total_value:
        new_status = "paid"
    elif total_paid > 0:
        new_status = "partial"

    purchase_repository.update_purchase(purchase_id, {
        "total_paid_value": total_paid,
        "status": new_status
    })
