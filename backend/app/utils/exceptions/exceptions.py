class BaseClassError(Exception):
    """Raised when any error is raised and handled as expected."""
    pass

class NotFoundError(BaseClassError):
    """Raised when a resource is not found in the database or service layer."""
    pass


class BusinessRuleError(BaseClassError):
    """Raised when a business logic rule or data integrity constraint is violated."""
    pass


class ValidationError(BaseClassError):
    """Raised when provided data is invalid or missing."""
    pass


class DatabaseError(BaseClassError):
    """Raised for unexpected database-related issues."""
    pass
