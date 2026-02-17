from dataclasses import dataclass
from typing import Generic, TypeVar, List

T = TypeVar("T")


@dataclass
class PaginatedResult(Generic[T]):
    items: List[T]
    total: int
