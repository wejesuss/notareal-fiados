from fastapi import APIRouter, HTTPException
from services.purchase_service import (
    get_purchase_by_id,
    get_purchases,
    create_purchase,
    update_purchase,
    delete_purchase
)

router = APIRouter(prefix="/purchases", tags=["Purchases"])

@router.get("/")
def list_purchases(limit: int = None, offset: int = 0, only_pending: bool = True):
    """List all purchases."""
    purchases = get_purchases(limit, offset, only_pending)
    if not purchases:
        return {"message": "Compra não encontrada.", "purchases": []}
    
    purchases_data = [p.__dict__ for p in purchases]
    return {"message": "Compras encontradas.", "purchases": purchases_data}

@router.get("/{purchase_id}")
def read_purchase(purchase_id: int):
    """Get purchase by ID."""
    purchase = get_purchase_by_id(purchase_id)
    if not purchase:
        raise HTTPException(status_code=404, detail="Compra não encontrada.")
    return purchase.__dict__

@router.post("/{client_id}")
def add_purchase(client_id: int, data: dict):
    """Add new purchase."""
    try:
        if not client_id:
            raise HTTPException(status_code=400, detail="Não é possível criar uma compra sem um cliente associado (client_id).")

        if data.get("status") or data.get("client_id"):
            raise HTTPException(status_code=400, detail="Chamada inválida, campos (status ou client_id) não são esperados.")

        purchase = create_purchase(client_id, data)
        return {"message": "Compra criada com sucesso.", "purchase": purchase.__dict__}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{purchase_id}")
def edit_purchase(purchase_id: int, data: dict):
    """Update purchase."""
    try:    
        purchase = update_purchase(purchase_id, data)
        if not purchase:
            raise HTTPException(status_code=404, detail="Compra não encontrada.")
        return {"message": "Compra atualizada.", "purchase": purchase.__dict__}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{purchase_id}")
def remove_purchase(purchase_id: int):
    """Delete purchase."""
    success = delete_purchase(purchase_id)
    if not success:
        raise HTTPException(status_code=404, detail="Compra não encontrada.")
    return {"message": "Compra removida com sucesso."}
