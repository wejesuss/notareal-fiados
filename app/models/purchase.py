from dataclasses import dataclass
from datetime import datetime

# Store basic information about the client
@dataclass
class Purchase:
    id: int
    client_id: int
    description: str
    total_value: float
    total_paid_value: float
    status: str # 'pending' (default), 'partial', 'paid'
    note_number: str # NF-0001
    created_at: datetime
    updated_at: datetime

    @staticmethod
    def from_row(row):
        return Purchase(
            id = row[0],
            client_id = row[1],
            description = row[2],
            total_value = row[3],
            total_paid_value = row[4],
            status = row[5],
            note_number = row[6],
            created_at = datetime.fromtimestamp(row[7]),
            updated_at = datetime.fromtimestamp(row[8])
        )

    def to_tuple(self):
        return (
            self.client_id,
            self.description,
            self.total_value,
            self.total_paid_value,
            self.status,
            self.note_number,            
            int(self.created_at.timestamp()),
            int(self.updated_at.timestamp())
        )