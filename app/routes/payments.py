from fastapi import APIRouter, HTTPException, Depends
from app.services.purchase_service import (
    get_payments_for_purchase,
    get_payment_by_id,
    create_payment,
    activate_payment,
    update_payment,
    deactivate_payment
)
from app.utils.exceptions import handle_service_exceptions
from app.schemas.payment import (
    PaymentListResponseSchema,
    PaymentListQuerySchema,
    PaymentWithMessageResponseSchema,
    PaymentCreateSchema,
)

router = APIRouter(prefix="/{purchase_id}/payments", tags=["Payments"])

@router.get("/", response_model=PaymentListResponseSchema)
@handle_service_exceptions
def list_payments_for_purchase(purchase_id: int, params: PaymentListQuerySchema = Depends()):
    """List all payments for a specific purchase."""
    limit = params.limit
    offset = params.offset

    payments = get_payments_for_purchase(purchase_id, limit, offset)
    return {"message": "Pagamentos encontrados.", "payments": payments}

@router.post("/", response_model=PaymentWithMessageResponseSchema)
@handle_service_exceptions
def add_payment(purchase_id: int, data: PaymentCreateSchema):
    """Create a new payment for a specific purchase."""
    payment = create_payment(purchase_id, data.model_dump())
    return {"message": "Pagamento criado com sucesso.", "payment": payment}

@router.put("/{payment_id}")
@handle_service_exceptions
def edit_payment(purchase_id: int, payment_id: int, data: dict):
    """Edit allowed fields of a payment (amount, method, description, payment_date)."""
    updated = update_payment(purchase_id, payment_id, data)
    if not updated:
        raise HTTPException(status_code=400, detail="Nada foi atualizado.")
    return {"message": "Pagamento atualizado com sucesso.", "payment": updated.__dict__}

@router.put("/{payment_id}/restore")
@handle_service_exceptions
def restore_payment(purchase_id: int, payment_id: int):
    """Activate payment changing is_active field if related purchase is active. Purchase totals are recalculated."""
    payment = activate_payment(purchase_id, payment_id, {"is_active": 1})
    return {"message": "Pagamento atualizado.", "payment": payment.__dict__}

@router.delete("/{payment_id}")
@handle_service_exceptions
def remove_payment(purchase_id: int, payment_id: int):
    """Deactivate (soft delete) a payment and update related purchase totals."""
    success = deactivate_payment(purchase_id, payment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado ou já desativado.")
    return {"message": "Pagamento desativado com sucesso."}
