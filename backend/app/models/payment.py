from dataclasses import dataclass


# Store basic information about the payment
@dataclass
class Payment:
    id: int
    purchase_id: int
    amount_cents: int
    payment_date: int | None
    method: str
    description: str | None
    receipt_number: str  # REC-0001
    is_active: int
    created_at: int
    updated_at: int

    @staticmethod
    def from_row(row):
        return Payment(
            id=row[0],
            purchase_id=row[1],
            amount_cents=row[2],
            payment_date=int(row[3]) if row[3] else None,
            method=row[4],
            description=row[5],
            receipt_number=row[6],
            is_active=row[7],
            created_at=int(row[8]),
            updated_at=int(row[9]),
        )

    def to_tuple(self):
        return (
            self.purchase_id,
            self.amount_cents,
            self.payment_date if self.payment_date else None,
            self.method,
            self.description,
            self.receipt_number,
            self.is_active,
            self.created_at,
            self.updated_at,
        )
