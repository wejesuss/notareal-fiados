from app.models import Client
from app.repositories.client_repository import get_client_by_id
from app.utils.exceptions import NotFoundError, error_messages


def get_client_or_404(client_id: int) -> Client:
    client = get_client_by_id(client_id)

    if not client:
        raise NotFoundError(error_messages.CLIENT_NOT_FOUND)

    return client
