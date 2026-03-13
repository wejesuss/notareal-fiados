from typing import List
from app.models import Client, Purchase
from app.common import PaginatedResult
from app.services.purchase_service import deactivate_purchases_by_client
from app.services.domain_validations import get_client_or_404
import app.repositories.client_repository as client_repository
from app.utils.exceptions import NotFoundError, error_messages


def get_clients(
    limit: int = None, offset: int = 0, only_active: bool = True
) -> PaginatedResult[Client]:
    result = client_repository.get_clients(limit, offset, only_active)
    if not result.items:
        return PaginatedResult([], result.total)

    return result


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


def activate_client(client_id: int) -> Client:
    """Activate a client, keeping purchases/payments unchaged."""
    # Ensure client exists
    original = get_client_or_404(client_id)
    if original.is_active:
        raise BusinessRuleError(error_messages.CLIENT_ALREADY_ENABLED)

    client = client_repository.update_client(client_id, {"is_active": 1})
    return client


def deactivate_client(client_id: int) -> Client:
    """Deactivate (soft delete) a client and cascade deactivate related purchases/payments."""
    # Ensure client exists
    original = get_client_or_404(client_id)
    if not original.is_active:
        raise BusinessRuleError(error_messages.CLIENT_ALREADY_DISABLED)

    success = client_repository.deactivate_client(client_id)
    if not success:
        raise NotFoundError(error_messages.CLIENT_NOT_FOUND)

    # cascade disable purchases and payments
    deactivate_purchases_by_client(client_id)

    return client_repository.get_client_by_id(client_id)


# Client Financial Summary
def get_client_summary_by_id(client_id: int):
    get_client_or_404(client_id)

    return client_repository.get_client_summary(client_id)
