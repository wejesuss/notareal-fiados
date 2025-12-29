import regex as re
from pydantic import field_validator
from app.utils.helpers import is_valid_name
from app.utils.exceptions import error_messages

class NameValidatorMixin:
    @field_validator("name", mode="after")
    def validate_name(cls, v):
        v = " ".join(v.split())  # Remove multiple spaces

        # Invalid end char: space, apostrophe, hyphen
        if re.search(r"[ '\-]$", v):
            raise ValueError(error_messages.CLIENT_INVALID_NAME)

        # Multiple allowed symbols in sequence
        if re.search(r"['\-]{2,}", v):
            raise ValueError(error_messages.CLIENT_INVALID_NAME)

        # Excessive repetition of any character
        if re.search(r"(.)\1\1\1", v):
            raise ValueError(error_messages.CLIENT_INVALID_NAME)

        # Global invalid characters
        if not is_valid_name(v):
            raise ValueError(error_messages.CLIENT_INVALID_NAME)

        return v

class NicknameValidatorMixin:
    @field_validator("nickname", mode="after")
    def validate_nickname(cls, v):
        if v is None:
            return None

        v = v.strip().casefold() # Normalize to case comparison and remove spaces
        
        if re.search(r"\s", v):
            # Nickname must be a single-word value
            raise ValueError("Apelido deve conter somente uma palavra.")

        if len(v) < 3:
            raise ValueError("Apelido deve conter pelo menos 3 caracteres.")

        return v

class PhoneValidatorMixin:
    @field_validator("phone", mode="after")
    def validate_phone(cls, v):
        if v is None:
            return None

        v = " ".join(v.split())  # Remove multiple spaces
        return v
