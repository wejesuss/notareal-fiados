from pydantic import field_validator
from app.utils.exceptions import error_messages

class AmountValidatorMixin:
    @field_validator("amount", mode="after")
    def validate_amount(cls, value):
        if value is None:
            return value
        if value <= 0:
            raise ValueError(error_messages.PAYMENT_INVALID_AMOUNT)
        return value

