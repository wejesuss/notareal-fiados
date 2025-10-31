from dataclasses import dataclass
from datetime import datetime

# Store basic information about the client
@dataclass
class Payment:
    id: int
    purchase_id: int
    amount: float
    payment_date: datetime | None
    method: str
    description: str | None
    receipt_number: str # REC-0001
    is_active: int
    created_at : datetime
    updated_at : datetime | None

    @staticmethod
    def from_row(row):
        return Payment(
            id = row[0],
            purchase_id = row[1],
            amount = row[2],
            payment_date = datetime.fromtimestamp(row[3]) if row[3] else None,
            method = row[4],
            description = row[5],
            receipt_number = row[6],
            is_active = row[7],
            created_at = datetime.fromtimestamp(row[8]) if row[8] else None,
            updated_at = datetime.fromtimestamp(row[9]) if row[9] else None
        )

    def to_tuple(self):
        return (
            self.purchase_id,
            self.amount,
            int(self.payment_date.timestamp()) if self.payment_date else None,
            self.method,
            self.description,
            self.receipt_number,
            self.is_active,
            int(self.created_at.timestamp()) if self.created_at else None,
            int(self.updated_at.timestamp() if self.updated_at else None)
        )