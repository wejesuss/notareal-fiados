from fastapi import APIRouter, HTTPException, Depends
from app.services.purchase_service import (
    get_purchase_by_id,
    get_purchase_by_note_number,
    get_purchases,
    create_purchase,
    update_purchase,
    activate_purchase,
    deactivate_purchase
)
from app.routes.payments import router as payment_router
from app.utils.exceptions import handle_service_exceptions
from app.schemas.purchase import (
    PurchaseListResponseSchema,
    PurchaseListQuerySchema,
    PurchaseResponseSchema,
    PurchaseWithMessageResponseSchema,
    PurchaseCreateSchema,
    PurchaseUpdateSchema
)

router = APIRouter(prefix="/purchases", tags=["Purchases"])

@router.get("/", response_model=PurchaseListResponseSchema)
@handle_service_exceptions
def list_purchases(params: PurchaseListQuerySchema = Depends()):
    """List all purchases."""
    limit = params.limit
    offset = params.offset
    only_pending = params.only_pending

    purchases = get_purchases(limit, offset, only_pending)
    return {"message": "Compras encontradas.", "purchases": purchases}

@router.get("/{purchase_id}", response_model=PurchaseResponseSchema)
@handle_service_exceptions
def read_purchase(purchase_id: int):
    """Get purchase by ID."""
    purchase = get_purchase_by_id(purchase_id)
    return purchase

@router.get("/by-note/{note_number}", response_model=PurchaseResponseSchema)
@handle_service_exceptions
def read_purchase_by_note(note_number: str):
    """Get purchase by note_number."""
    purchase = get_purchase_by_note_number(note_number)
    return purchase

@router.post("/{client_id}", response_model=PurchaseWithMessageResponseSchema)
@handle_service_exceptions
def add_purchase(client_id: int, data: PurchaseCreateSchema):
    """Add new purchase."""
    data: dict = data.model_dump()

    if not client_id or client_id < 1:
        raise HTTPException(status_code=400, detail="Não é possível criar uma compra sem um cliente associado (client_id).")

    purchase = create_purchase(client_id, data)
    return {"message": "Compra criada com sucesso.", "purchase": purchase}

@router.put("/{purchase_id}", response_model=PurchaseWithMessageResponseSchema)
@handle_service_exceptions
def edit_purchase(purchase_id: int, data: PurchaseUpdateSchema):
    """Update purchase."""
    purchase = update_purchase(purchase_id, data.model_dump(exclude_none=True))
    return {"message": "Compra atualizada.", "purchase": purchase}

@router.put("/{purchase_id}/restore", response_model=PurchaseWithMessageResponseSchema)
@handle_service_exceptions
def restore_purchase(purchase_id: int):
    """Activate purchase changing is_active field. Related payments remain unchanged, but totals are recalculated."""
    purchase = activate_purchase(purchase_id, {"is_active": 1})
    return {"message": "Compra atualizada.", "purchase": purchase}

@router.delete("/{purchase_id}", response_model=PurchaseWithMessageResponseSchema, response_model_exclude_none=True)
@handle_service_exceptions
def remove_purchase(purchase_id: int):
    """Delete purchase (soft delete)."""
    success = deactivate_purchase(purchase_id)
    if not success:
        raise HTTPException(status_code=404, detail="Compra não encontrada.")
    return {"message": "Compra removida com sucesso.", "purchase": None}

# Include payment related routes
router.include_router(payment_router)