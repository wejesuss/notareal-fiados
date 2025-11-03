from fastapi import APIRouter, HTTPException
from services.payment_service import (
    get_payment_by_id,
    get_payments,
    create_payment,
    delete_payment
)

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.get("/")
def list_payments(limit: int = None, offset: int = 0):
    """List all payments."""
    payments = get_payments(limit, offset)
    if not payments:
        return {"message": "Pagamentos não encontrados.", "payments": []}
    
    payments_data = [p.__dict__ for p in payments]
    return {"message": "Pagamentos encontrados.", "payments": payments_data}

@router.get("/{payment_id}")
def read_payment(payment_id: int):
    """Get payment by ID."""
    payment = get_payment_by_id(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado.")
    return payment.__dict__

@router.post("/")
def add_payment(data: dict):
    """Add new payment."""
    payment = create_payment(data)
    return {"message": "Pagamento registrado com sucesso.", "payment": payment.__dict__}

@router.delete("/{payment_id}")
def remove_payment(payment_id: int):
    """Delete payment (soft delete)."""
    success = delete_payment(payment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado.")
    return {"message": "Pagamento removido com sucesso."}
