from dataclasses import dataclass


@dataclass
class ClientSummary:
    total_purchases: int
    total_paid_cents: int
    outstanding_balance_cents: int
