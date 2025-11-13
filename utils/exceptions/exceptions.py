class NotFoundError(Exception):
    """Raised when a resource is not found in the database or service layer."""
    pass


class BusinessRuleError(Exception):
    """Raised when a business logic rule or data integrity constraint is violated."""
    pass


class ValidationError(Exception):
    """Raised when provided data is invalid or missing."""
    pass


class DatabaseError(Exception):
    """Raised for unexpected database-related issues."""
    pass
