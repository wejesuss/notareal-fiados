import unicodedata
from app.utils.exceptions import ValidationError, error_messages

ALLOWED_EXTRA = set(" .'-")


def filter_allowed(data: dict, allowed: set[str]) -> dict:
    return {k: v for k, v in data.items() if k in allowed}


def is_valid_name(name: str) -> bool:
    for ch in name:
        if ch in ALLOWED_EXTRA:
            continue

        cat = unicodedata.category(ch)
        # L = Letter
        if cat.startswith("L"):
            continue

        return False

    return True


def validate_amount_cents(amount: int | None) -> int:
    if amount is None or not isinstance(amount, int) or amount <= 0:
        raise ValidationError(error_messages.PAYMENT_INVALID_AMOUNT)
    return amount
