from builtins import isinstance
from typing import List
from datetime import datetime
from app.models import (Purchase, Payment)
from app.services import payment_service
from app.repositories import (purchase_repository)
from app.utils.exceptions import (
    BusinessRuleError, NotFoundError, ValidationError, BaseClassError,
    error_messages
)

def get_purchase_by_id(purchase_id: int) -> Purchase:
    purchase = purchase_repository.get_purchase_by_id(purchase_id)
    if not purchase:
        raise NotFoundError(error_messages.PURCHASE_NOT_FOUND)

    return purchase

def get_purchase_by_note_number(note_number: str) -> Purchase:
    purchase = purchase_repository.get_purchase_by_note_number(note_number)
    if not purchase:
        raise NotFoundError(error_messages.PURCHASE_NOT_FOUND)

    return purchase

def get_purchases(limit: int = None, offset: int = 0, only_pending: bool | None = None) -> List[Purchase]:
    purchases = purchase_repository.get_purchases(limit, offset, only_pending)
    if not purchases:
        return []
    
    return purchases

def create_purchase(client_id: int, data: dict) -> Purchase:
    try:
        total_value = float(data.get("total_value", 0))

        # Attempt to get and convert amount to float
        amount = data.get("amount")
        if amount is not None:
            amount = float(amount)  # Convert only if it's not None
            if amount <= 0:
                raise ValidationError(error_messages.PAYMENT_INVALID_AMOUNT)
    except ValueError:
        raise ValidationError(error_messages.RESOURCE_CREATION_VALUE_ERROR)

    if total_value <= 0:
        raise ValidationError(error_messages.PURCHASE_INVALID_TOTAL)

    create_new_payment = False
    status = "pending"
    total_paid_value = 0.0

    if amount is not None:
        if amount >= total_value:
            create_new_payment = True
            total_paid_value = total_value
            status = "paid"
        elif amount > 0:
            create_new_payment = True
            total_paid_value = amount
            status = "partial"

    data.update({"client_id": client_id, "status": status, "total_paid_value": total_paid_value})
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

        try:
            payment_service.create_payment(payment_data)
        except Exception as e:
            purchase_repository.deactivate_purchase(purchase.id)
            error = error_messages.PAYMENT_PURCHASE_CREATION_FAILED

            if isinstance(e, BaseClassError):
                merged_error = error + " " + str(e)
                raise BusinessRuleError(merged_error) from e
            else:
                raise BusinessRuleError(error) from e

    return purchase

def update_purchase(purchase_id: int, data: dict) -> Purchase:
    # validate is_active, only allowing deactivation from the correct route
    if "is_active" in data:
        raise ValidationError(error_messages.PURCHASE_INVALID_ACTIVATION_ROUTE)

    purchase_exists = purchase_repository.get_purchase_by_id(purchase_id)
    if not purchase_exists:
        raise NotFoundError(error_messages.PURCHASE_NOT_FOUND)

    # fields that are allowed to be updated
    allowed_fields = ["client_id", "description", "total_value"]

    # filter data fields
    validated_data = {k: v for k, v in data.items() if k in allowed_fields}
    if not validated_data:
        raise ValidationError(error_messages.DATA_FIELDS_EMPTY)

    purchase = purchase_repository.update_purchase(purchase_id, validated_data)
    # Recalculate totals if relevant fields changed
    relevant_fields_changed = "total_value" in data or "client_id" in data
    if relevant_fields_changed:
        return recalculate_purchase_totals(purchase_id)

    return purchase

def activate_purchase(purchase_id: int, data: dict) -> Purchase:
    purchase_exists = purchase_repository.get_purchase_by_id(purchase_id)
    if not purchase_exists:
        raise NotFoundError(error_messages.PURCHASE_NOT_FOUND)

    purchase_repository.update_purchase(purchase_id, data)
    purchase = recalculate_purchase_totals(purchase_id)

    return purchase

def deactivate_purchase(purchase_id: int) -> bool:
    """Deactivate a purchase."""
    purchase = purchase_repository.get_purchase_by_id(purchase_id)
    if not purchase:
        raise NotFoundError(error_messages.PURCHASE_NOT_FOUND)

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
    purchase = purchase_repository.get_purchase_by_id(purchase_id)
    if not purchase or not purchase.is_active:
        raise BusinessRuleError(error_messages.PAYMENT_CREATION_FAILED)

    data["purchase_id"] = purchase_id
    payment = payment_service.create_payment(data)
    recalculate_purchase_totals(purchase_id)

    return payment

def update_payment(purchase_id: int, payment_id: int, data: dict) -> Payment | None:
    """Update a payment and recalculate the related purchase totals."""
    payment = payment_service.get_payment_by_id(payment_id)
    if not payment:
        raise NotFoundError(error_messages.PAYMENT_NOT_FOUND)

    if payment.purchase_id != purchase_id:
        raise BusinessRuleError(error_messages.PAYMENT_NOT_LINKED)

    updated = payment_service.update_payment(payment_id, data)
    if updated:
        recalculate_purchase_totals(purchase_id)

    return updated

def activate_payment(purchase_id: int, payment_id: int, data: dict) -> Payment | None:
    """Activate a payment that belongs to the given purchase and update totals."""
    purchase_exists = purchase_repository.get_purchase_by_id(purchase_id)
    if not purchase_exists:
        raise NotFoundError(error_messages.PURCHASE_NOT_FOUND)

    payment = payment_service.get_payment_by_id(payment_id)
    if not payment:
        return None
    if payment.purchase_id != purchase_id:
        raise ValidationError(error_messages.PAYMENT_NOT_LINKED)

    payment = payment_service.activate_payment(payment_id, data)
    if payment:
        recalculate_purchase_totals(purchase_id)

    return payment

def deactivate_payment(purchase_id: int, payment_id: int) -> bool:
    """Deactivate a payment that belongs to the given purchase and update totals."""
    payment = payment_service.get_payment_by_id(payment_id)
    
    if not payment:
        return False
    if payment.purchase_id != purchase_id:
        raise ValueError("O identificador da compra é diferente do identificador do pagamento associado a ela.")
    
    success = payment_service.deactivate_payment(payment_id)
    if success:
        recalculate_purchase_totals(purchase_id)
    
    return success

def compute_purchase_totals(purchase: Purchase, payments: list[Payment]):
    """Pure function: given a purchase + payments, returns the recalculated fields."""
    active_payments = [p for p in payments if p.is_active]
    total_paid = sum(p.amount for p in active_payments)

    if total_paid >= purchase.total_value:
        new_status = "paid"
    elif total_paid > 0:
        new_status = "partial"
    else:
        new_status = "pending"

    return {
        "total_paid_value": total_paid,
        "status": new_status
    }

def recalculate_purchase_totals(purchase_id: int) -> Purchase | None:
    """Recalculate purchase total_paid_value and status based on active payments."""
    purchase = purchase_repository.get_purchase_by_id(purchase_id)
    if not purchase or not purchase.is_active:
        return None

    payments = payment_service.get_payments(limit = None, offset = 0, purchase_id = purchase_id)
    updates = compute_purchase_totals(purchase, payments)

    return purchase_repository.update_purchase(purchase_id, updates)
