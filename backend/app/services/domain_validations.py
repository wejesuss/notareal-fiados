from typing import List
from app.models import Client
from app.common import PurchaseStatus
from app.repositories.client_repository import get_client_by_id
from app.utils.exceptions import NotFoundError, BusinessRuleError, error_messages


def get_client_or_404(client_id: int) -> Client:
    client = get_client_by_id(client_id)

    if not client:
        raise NotFoundError(error_messages.CLIENT_NOT_FOUND)

    return client


def validate_status_with_is_active(
    is_active: bool | None, statuses: List[PurchaseStatus] | None
):
    if is_active is False and statuses is not None:
        raise BusinessRuleError(error_messages.PURCHASE_INVALID_FILTER)
