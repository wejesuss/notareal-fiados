from fastapi import HTTPException
from exceptions import NotFoundError, BusinessRuleError, ValidationError, DatabaseError

def handle_service_exceptions(func):
    """Decorator to translate service exceptions into HTTP errors."""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except ValidationError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except BusinessRuleError as e:
            raise HTTPException(status_code=409, detail=str(e))
        except DatabaseError as e:
            raise HTTPException(status_code=500, detail="Erro interno no banco de dados.")
    return wrapper
