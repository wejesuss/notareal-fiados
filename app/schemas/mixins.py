import regex as re
from pydantic import field_validator
from app.utils.helpers import is_valid_name
from app.utils.exceptions import error_messages

class AmountValidatorMixin:
    @field_validator("amount", mode="after")
    def validate_amount(cls, value):
        if value is None:
            return value
        if value <= 0:
            raise ValueError(error_messages.PAYMENT_INVALID_AMOUNT)
        return value

class NameValidatorMixin:
    @field_validator("name", mode="after")
    def validate_name(cls, v):
        v = " ".join(v.split())  # Remove multiple spaces

        # Check for multiple repetitions of allowed symbols like hifens
        if re.search(r"[' -]{2,}", v): 
            raise ValueError(error_messages.CLIENT_INVALID_NAME)
        
        # Check for multiple repetitions of allowed symbols like hifens
        if re.search(r"[ '-]$", v):
            raise ValueError(error_messages.CLIENT_INVALID_NAME)

        # Check for multiple repetitions of the same string
        if re.search(r"(.)\1\1\1", v):
            raise ValueError(error_messages.CLIENT_INVALID_NAME)

        # Check if string has any invalid chars (not similar to letters)
        if not is_valid_name(v):
            raise ValueError(error_messages.CLIENT_INVALID_NAME)

        return v
