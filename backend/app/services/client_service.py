from typing import List
from app.models import Client
from app.services.purchase_service import deactivate_purchases_by_client
import app.repositories.client_repository as client_repository
from app.utils.exceptions import (
    NotFoundError,
    error_messages
)

def get_clients(limit: int = None, offset: int = 0, only_active: bool = True) -> List[Client]:
    clients = client_repository.get_clients(limit, offset, only_active)
    if not clients:
        return []
    
    return clients

def get_client_by_id(client_id: int) -> Client | None:
    client = client_repository.get_client_by_id(client_id)
    if not client:
        raise NotFoundError(error_messages.CLIENT_NOT_FOUND)

    return client

def create_client(data: dict) -> Client:
    return client_repository.insert_client(data)

def update_client(client_id: int, data: dict) -> Client | None:
    client_exists = client_repository.get_client_by_id(client_id)
    if not client_exists:
        raise NotFoundError(error_messages.CLIENT_NOT_FOUND)

    client = client_repository.update_client(client_id, data)
    return client

def deactivate_client(client_id: int) -> bool:
    """Deactivate (soft delete) a client and cascade deactivate related purchases/payments."""
    success = client_repository.deactivate_client(client_id)
    if success:
        # cascade disable purchases and payments
        deactivate_purchases_by_client(client_id)
    
    return success
