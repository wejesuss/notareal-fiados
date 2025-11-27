from fastapi import APIRouter, HTTPException, Depends
from app.services.client_service import (
    get_client_by_id,
    get_clients,
    create_client,
    update_client,
    deactivate_client
)
from app.services.purchase_service import (get_purchases_by_client)
from app.utils.exceptions import handle_service_exceptions
from app.schemas.client import (
    ClientCreateSchema,
    ClientCreateResponseSchema,
    ClientListResponseSchema,
    ClientListQuerySchema,
    ClientResponseSchema,
    ClientWithMessageResponseSchema,
)

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("/", response_model=ClientListResponseSchema)
@handle_service_exceptions
def list_clients(params: ClientListQuerySchema = Depends()):
    """List all clients."""

    limit = params.limit
    offset = params.offset
    only_active = params.only_active
 
    clients = get_clients(limit, offset, only_active)
    return {"message": "Clientes encontrados.", "clients": clients}

@router.get("/{client_id}", response_model=ClientResponseSchema)
@handle_service_exceptions
def read_client(client_id: int):
    """Get client by ID."""
    client = get_client_by_id(client_id)
    return client

@router.post("/", response_model=ClientWithMessageResponseSchema)
@handle_service_exceptions
def add_client(data: ClientCreateSchema):
    """Add new client."""
    client = create_client(data.model_dump())
    return {"message": "Cliente criado com sucesso.", "client": client}

@router.put("/{client_id}")
@handle_service_exceptions
def edit_client(client_id: int, data: dict):
    """Update client data."""
    client = update_client(client_id, data)
    return {"message": "Cliente atualizado.", "client": client.__dict__}

@router.delete("/{client_id}")
@handle_service_exceptions
def remove_client(client_id: int):
    """Delete a client (soft delete)."""
    success = deactivate_client(client_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cliente não encontrado ou já desativado.")
    return {"message": "Cliente removido com sucesso."}

# Purchase related routes
@router.get("/{client_id}/purchases")
@handle_service_exceptions
def list_purchases_for_client(client_id: int, only_active: bool = True):
    """List all purchases for a specific client."""
    purchases = get_purchases_by_client(client_id, only_active)
    if not purchases:
        return {"message": "Compras não encontradas.", "purchases": []}

    purchases_data = [p.__dict__ for p in purchases]
    return {"message": "Compras encontradas.", "purchases": purchases_data}