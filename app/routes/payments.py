from fastapi import APIRouter, HTTPException
from services.purchase_service import (
    get_payments_for_purchase,
    create_payment,
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