from dataclasses import dataclass
from datetime import datetime

# Store basic information about the client
@dataclass
class Client:
    id: int
    name: str
    nickname: str | None
    phone: str | None
    email: str | None
    is_active: int
    created_at: datetime
    updated_at: datetime

    @staticmethod
    def from_row(row):
        return Client(
            id = row[0],
            name = row[1],
            nickname = row[2],
            phone = row[3],
            email = row[4],
            is_active = row[5],
            created_at = datetime.fromtimestamp(row[6]),
            updated_at = datetime.fromtimestamp(row[7]),
        )

    def to_tuple(self):
        return (
            self.name,
            self.nickname,
            self.phone,
            self.email,
            self.is_active,
            int(self.created_at.timestamp()),
            int(self.updated_at.timestamp())
        )