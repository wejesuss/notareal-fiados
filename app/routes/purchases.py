from fastapi import APIRouter, HTTPException
from services.purchase_service import (
    get_purchase_by_id,
    get_purchase_by_note_number,
    get_purchases,
    create_purchase,
    update_purchase,
    deactivate_purchase
)
from routes.payments import router as payment_router
from utils.exceptions import handle_service_exceptions

router = APIRouter(prefix="/purchases", tags=["Purchases"])

@router.get("/")
@handle_service_exceptions
def list_purchases(limit: int = None, offset: int = 0, only_pending: bool | None = None):
    """List all purchases."""
    purchases = get_purchases(limit, offset, only_pending)
    if not purchases:
        return {"message": "Compras não encontradas.", "purchases": []}
    
    purchases_data = [p.__dict__ for p in purchases]
    return {"message": "Compras encontradas.", "purchases": purchases_data}

@router.get("/{purchase_id}")
@handle_service_exceptions
def read_purchase(purchase_id: int):
    """Get purchase by ID."""
    purchase = get_purchase_by_id(purchase_id)
    if not purchase:
        raise HTTPException(status_code=404, detail="Compra não encontrada.")
    return purchase.__dict__

@router.get("/by-note/{note_number}")
@handle_service_exceptions
def read_purchase_by_note(note_number: str):
    """Get purchase by note_number."""
    purchase = get_purchase_by_note_number(note_number)
    if not purchase:
        raise HTTPException(status_code=404, detail="Compra não encontrada.")
    return purchase.__dict__

@router.post("/{client_id}")
@handle_service_exceptions
def add_purchase(client_id: int, data: dict):
    """Add new purchase."""
    if not client_id:
        raise HTTPException(status_code=400, detail="Não é possível criar uma compra sem um cliente associado (client_id).")

    if data.get("status") or data.get("client_id"):
        raise HTTPException(status_code=400, detail="Chamada inválida, campos (status ou client_id) não são esperados.")

    purchase = create_purchase(client_id, data)
    return {"message": "Compra criada com sucesso.", "purchase": purchase.__dict__}

@router.put("/{purchase_id}")
@handle_service_exceptions
def edit_purchase(purchase_id: int, data: dict):
    """Update purchase."""
    purchase = update_purchase(purchase_id, data)
    if not purchase:
        raise HTTPException(status_code=404, detail="Compra não encontrada.")
    return {"message": "Compra atualizada.", "purchase": purchase.__dict__}

@router.delete("/{purchase_id}")
@handle_service_exceptions
def remove_purchase(purchase_id: int):
    """Delete purchase (soft delete)."""
    success = deactivate_purchase(purchase_id)
    if not success:
        raise HTTPException(status_code=404, detail="Compra não encontrada.")
    return {"message": "Compra removida com sucesso."}

# Include payment related routes
router.include_router(payment_router)