from typing import List
from datetime import datetime
from database import get_connection, sqlite3
from models.payment import Payment

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

    except sqlite3.IntegrityError as e:
        if "FOREIGN KEY constraint failed" in str(e):
            raise ValueError("Uma compra com esse id não existe.")
    except sqlite3.Error as e:
        raise ValueError("Erro inesperado do banco.") from e
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
            raise ValueError("Um pagamento com esse número de recibo já existe.")
        elif "FOREIGN KEY constraint failed" in str(e):
            raise ValueError("Uma compra com esse id não existe.")
    except sqlite3.Error as e:
        raise ValueError("Erro inesperado do banco.") from e
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

def delete_payment(payment_id: int) -> bool:
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
        raise ValueError("Erro inesperado do banco.") from e
    finally:
        if conn:
            conn.close()

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
    except sqlite3.IntegrityError as e:
        if "FOREIGN KEY constraint failed" in str(e):
            raise ValueError("Uma compra com esse id não existe.")
    except sqlite3.Error as e:
        raise ValueError("Erro inesperado do banco.") from e
    finally:
        if conn:
            conn.close()
