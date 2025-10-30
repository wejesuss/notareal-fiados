from fastapi import APIRouter, HTTPException
from services.client_service import (
    get_client_by_id,
    get_clients,
    create_client,
    update_client,
    delete_client
)

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("/")
def list_clients(limit: int = None, offset: int = 0):
    """List all clients."""
 
    clients = get_clients(limit, offset)
    if not clients:
        return {"message": "Cliente não encontrado.", "clients": []}

    clients_data = [c.__dict__ for c in clients]
    return {"message": "Clientes encontrados.", "clients": clients_data}

@router.get("/{client_id}")
def read_client(client_id: int):
    """Get client by ID."""
    client = get_client_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    return client.__dict__

@router.post("/")
def add_client(data: dict):
    """Add new client."""
    try:
        client = create_client(data)
        return {"message": "Cliente criado com sucesso.", "client": client.__dict__}
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.put("/{client_id}")
def edit_client(client_id: int, data: dict):
    """Update client data."""
    try:
        client = update_client(client_id, data)
        if not client:
            raise HTTPException(status_code=404, detail="Cliente não encontrado.")
        return {"message": "Cliente atualizado.", "client": client.__dict__}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{client_id}")
def remove_client(client_id: int):
    """Delete a client (soft delete)."""
    success = delete_client(client_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cliente não encontrado ou já desativado.")
    return {"message": "Cliente removido com sucesso."}
