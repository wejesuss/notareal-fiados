from typing import List
from models.client import Client
from services.purchase_service import deactivate_purchases_by_client
import repositories.client_repository as client_repository

def get_client_by_id(client_id: int) -> Client | None:
    return client_repository.get_client_by_id(client_id)

def get_clients(limit: int = None, offset: int = 0) -> List[Client]:
    clients = client_repository.get_clients(limit, offset)
    if not clients:
        return []
    
    return clients

def create_client(data: dict) -> Client:
    # TODO - validate fields
    return client_repository.insert_client(data)

def update_client(client_id: int, data: dict) -> Client | None:
    client_exists = client_repository.get_client_by_id(client_id)
    if not client_exists:
        return None

    client = client_repository.update_client(client_id, data)
    return client

def deactivate_client(client_id: int) -> bool:
    """Deactivate (soft delete) a client and cascade deactivate related purchases/payments."""
    success = client_repository.deactivate_client(client_id)
    if success:
        # cascade disable purchases and payments
        deactivate_purchases_by_client(client_id)
    
    return success
