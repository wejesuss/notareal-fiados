from dataclasses import dataclass
from datetime import datetime

# Store basic information about the client
@dataclass
class Payment:
    id: int
    purchase_id: int
    amount: float
    note: str | None
    receipt_number: str # REC-0001
    payment_date: datetime

    @staticmethod
    def from_row(row):
        return Payment(
            id = row[0],
            purchase_id = row[1],
            amount = row[2],
            note = row[3],
            receipt_number = row[4],
            payment_date = datetime.fromtimestamp(row[5])
        )

    def to_tuple(self):
        return (
            self.purchase_id,
            self.amount,
            self.note,
            self.receipt_number,         
            int(self.payment_date.timestamp())            
        )