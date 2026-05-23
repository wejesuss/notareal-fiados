from dataclasses import dataclass


# Store basic information about the purchase
@dataclass
class Purchase:
    id: int
    client_id: int
    description: str
    total_cents: int
    total_paid_cents: int
    status: str  # 'pending' (default), 'partial', 'paid'
    note_number: str  # NF-0001
    is_active: int
    created_at: int
    updated_at: int

    @staticmethod
    def from_row(row):
        return Purchase(
            id=row[0],
            client_id=row[1],
            description=row[2],
            total_cents=row[3],
            total_paid_cents=row[4],
            status=row[5],
            note_number=row[6],
            is_active=row[7],
            created_at=int(row[8]),
            updated_at=int(row[9]),
        )

    def to_tuple(self):
        return (
            self.client_id,
            self.description,
            self.total_cents,
            self.total_paid_cents,
            self.status,
            self.note_number,
            self.is_active,
            self.created_at,
            self.updated_at,
        )
