from pydantic import field_validator
from pydantic import BaseModel, ValidationError
from app.utils.exceptions import error_messages

class AmountValidatorMixin(BaseModel):
    @field_validator("amount")
    def validate_amount(cls, value):
        if value is None:
            return value
        if value <= 0:
            raise ValidationError(error_messages.PAYMENT_INVALID_AMOUNT)
        return value

    class Config:
        extra = "ignore"  # if there is no 'amount' field in the schema
