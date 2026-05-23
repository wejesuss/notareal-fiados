from dataclasses import dataclass


# Store basic information about the client
@dataclass
class Client:
    id: int
    name: str
    nickname: str | None
    phone: str | None
    email: str | None
    is_active: bool
    created_at: int
    updated_at: int

    @staticmethod
    def from_row(row):
        return Client(
            id=row[0],
            name=row[1],
            nickname=row[2],
            phone=row[3],
            email=row[4],
            is_active=bool(row[5]),
            created_at=int(row[6]),
            updated_at=int(row[7]),
        )

    def to_tuple(self):
        return (
            self.name,
            self.nickname,
            self.phone,
            self.email,
            self.is_active,
            self.created_at,
            self.updated_at,
        )
