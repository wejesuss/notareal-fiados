from typing import List
from datetime import datetime
from app.database import get_connection, sqlite3
from app.models import Payment
from app.utils.exceptions import (
    BusinessRuleError, DatabaseError,
    error_messages
)

def get_payments(limit: int = None, offset: int = 0, purchase_id: int = None) -> List[Payment]:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Default limit if not provided (-1 means "no limit" in SQLite)
        search_limit = -1 if limit is None else limit
        values = []

        where_clause = "WHERE is_active = 1"
        if purchase_id:
            where_clause = "WHERE purchase_id = ?"
            values.append(purchase_id)
        
        # add search_limit and offset to query parameters (values list)
        values.append(search_limit)
        values.append(offset)

        cursor.execute(f"""
            SELECT * FROM payments {where_clause} ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        """, tuple(values))

        rows = cursor.fetchall()

        if not rows:
            return []

        return [Payment.from_row(row) for row in rows]

    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()

def insert_payment(data: dict) -> Payment:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        now = int(datetime.now().timestamp())

        cursor.execute("""INSERT INTO payments (
            purchase_id,
            amount,
            payment_date,
            method,
            description,
            receipt_number,
            is_active,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?);
        """, (
            int(data.get("purchase_id")),
            data.get("amount"),
            int(data.get("payment_date")) if data.get("payment_date") else None,
            data.get("method"),
            data.get("description"),
            data.get("receipt_number"),
            now,
            now
        ))

        conn.commit()
        payment_id = cursor.lastrowid

        return get_payment_by_id(payment_id)

    except sqlite3.IntegrityError as e:
        if "UNIQUE constraint failed" in str(e):
            raise BusinessRuleError(error_messages.PAYMENT_ALREADY_EXISTS) from e
        elif "FOREIGN KEY constraint failed" in str(e):
            raise BusinessRuleError(error_messages.PAYMENT_PURCHASE_NOT_FOUND) from e
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()

def get_payment_by_id(payment_id: int) -> Payment | None:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM payments WHERE id = ?", (payment_id,))
        row = cursor.fetchone()

        if not row:
            return None

        return Payment.from_row(row)
    finally:
        if conn:
            conn.close()

def update_payment(payment_id: int, data: dict) -> Payment | None:
    """Update a payment."""
    conn = None

    # Add the updated_at column
    now = int(datetime.now().timestamp())
    data["updated_at"] = now

    columns = [f"{key} = ?" for key in data.keys()]
    values = list(data.values())

    # Add the payment_id for the WHERE clause
    values.append(payment_id)

    query = f"""
        UPDATE payments SET {', '.join(columns)}
        WHERE id = ?
    """

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(query, tuple(values))
        conn.commit()

        if cursor.rowcount == 0:
            return None

        return get_payment_by_id(payment_id)
    except sqlite3.IntegrityError as e:
        if "UNIQUE constraint failed" in str(e):
            raise BusinessRuleError(error_messages.PAYMENT_ALREADY_EXISTS) from e
        elif "FOREIGN KEY constraint failed" in str(e):
            raise BusinessRuleError(error_messages.PAYMENT_PURCHASE_NOT_FOUND) from e
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()

def deactivate_payment(payment_id: int) -> bool:
    """Deactivate (soft delete) a payment."""
    conn = None

    now = int(datetime.now().timestamp())

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE payments SET is_active = 0, updated_at = ?
            WHERE id = ? AND is_active = 1
        """, (now, payment_id))

        conn.commit()

        return cursor.rowcount > 0
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()

# Purchase related functions
def deactivate_payments_by_purchase_id(purchase_id: int) -> bool:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        now = int(datetime.now().timestamp())

        cursor.execute("""
            UPDATE payments SET is_active = 0, updated_at = ?
            WHERE purchase_id = ? AND is_active = 1
        """, (now, purchase_id))

        conn.commit()

        return cursor.rowcount > 0
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()
