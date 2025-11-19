from fastapi import APIRouter, HTTPException
from services.purchase_service import (
    get_payments_for_purchase,
    get_payment_by_id,
    create_payment,
    activate_payment,
    update_payment,
    deactivate_payment
)

router = APIRouter(prefix="/{purchase_id}/payments", tags=["Payments"])

@router.get("/")
def list_payments_for_purchase(purchase_id: int, limit: int = None, offset: int = 0):
    """List all payments for a specific purchase."""
    try:
        payments = get_payments_for_purchase(purchase_id, limit, offset)
        if not payments:
            return {"message": "Nenhum pagamento encontrado para esta compra.", "payments": []}

        return {"message": "Pagamentos encontrados.", "payments": [p.__dict__ for p in payments]}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/")
def add_payment(purchase_id: int, data: dict):
    """Create a new payment for a specific purchase."""
    try:
        payment = create_payment(purchase_id, data)
        return {"message": "Pagamento criado com sucesso.", "payment": payment.__dict__}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{payment_id}")
def edit_payment(purchase_id: int, payment_id: int, data: dict):
    """Edit allowed fields of a payment (amount, method, description, payment_date)."""
    payment = get_payment_by_id(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado.")
    if payment.purchase_id != purchase_id:
        raise HTTPException(status_code=400, detail="Pagamento não pertence a esta compra.")

    try:
        updated = update_payment(purchase_id, payment_id, data)
        if not updated:
            raise HTTPException(status_code=400, detail="Nada foi atualizado.")
        return {"message": "Pagamento atualizado com sucesso.", "payment": updated.__dict__}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{payment_id}/restore")
def restore_payment(purchase_id: int, payment_id: int):
    """Activate payment changing is_active field if related purchase is active. Purchase totals are recalculated."""
    try:
        payment = activate_payment(purchase_id, payment_id, {"is_active": 1})
        return {"message": "Pagamento atualizado.", "payment": payment.__dict__}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{payment_id}")
def remove_payment(purchase_id: int, payment_id: int):
    """Deactivate (soft delete) a payment."""
    try:
        success = deactivate_payment(purchase_id, payment_id)
        if not success:
            raise HTTPException(status_code=404, detail="Pagamento não encontrado ou já desativado.")
        return {"message": "Pagamento desativado com sucesso."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e