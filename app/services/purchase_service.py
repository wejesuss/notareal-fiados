from typing import List
from models.purchase import Purchase
from services import payment_service
from repositories import purchase_repository

def get_purchase_by_id(purchase_id: int) -> Purchase | None:
    return purchase_repository.get_purchase_by_id(purchase_id)

def get_purchases(limit: int = None, offset: int = 0, only_pending: bool = True) -> List[Purchase]:
    purchases = purchase_repository.get_purchases(limit, offset, only_pending)
    if not purchases:
        return []
    
    return purchases

def create_purchase(client_id: int, data: dict) -> Purchase:
    # TODO - validate fields
    create_new_payment = False

    total_paid_value = float(data.get("total_paid_value"))

    status = "pending"
    if total_paid_value >= float(data.get("total_value")):
        create_new_payment = True
        status = "paid"
    elif total_paid_value > 0:
        create_new_payment = True
        status = "partial"

    data.update({"client_id": client_id, "status": status})

    if create_new_payment:
        print(f"Creating new payment based on purchase id: {data.get('id')}")

    return purchase_repository.insert_purchase(data)

def update_purchase(purchase_id: int, data: dict) -> Purchase | None:
    purchase_exists = purchase_repository.get_purchase_by_id(purchase_id)
    if not purchase_exists:
        return None

    valid_status = {"pending", "partial", "paid"}
    if "status" in data and data["status"] not in valid_status:
        raise ValueError("Status inválido. Use 'pending', 'partial' ou 'paid'.")

    purchase = purchase_repository.update_purchase(purchase_id, data)
    return purchase

def delete_purchase(purchase_id: int) -> bool:
    """Deactivate a purchase."""
    success = purchase_repository.delete_purchase(purchase_id)
    
    return success

# Client related services (business logic)
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

    return success