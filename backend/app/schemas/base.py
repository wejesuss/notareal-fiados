from pydantic import BaseModel, ConfigDict, config
from pydantic.alias_generators import to_camel


# ===== Camel Base =====
class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        validate_by_name=True,
        validate_by_alias=True,
    )
