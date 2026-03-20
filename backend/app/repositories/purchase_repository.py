from typing import List
from datetime import datetime
from app.database import get_connection, sqlite3
from app.models import Purchase
from app.common import PurchaseStatus
from app.utils.exceptions import (
    BusinessRuleError,
    DatabaseError,
    error_messages,
)


def get_purchases(
    limit: int | None = None,
    offset: int = 0,
    statuses: List[PurchaseStatus] | None = None,
    is_active: bool | None = None,
) -> List[Purchase]:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Default limit if not provided (-1 means "no limit" in SQLite)
        search_limit = -1 if limit is None else limit

        # Create WHERE clause based on status and is_active
        # The semantics and group meaning of status and is_active being used together
        # should be verified in the service-layer. Here it is considered "as is".
        params = []
        clauses = []

        if statuses:
            placeholders = ", ".join(["?"] * len(statuses))
            clauses.append(f"status IN ({placeholders})")
            params.extend([s.value for s in statuses])

        if is_active is not None:
            clauses.append("is_active = ?")
            params.append(int(is_active))

        where_clause = f"WHERE {' AND '.join(clauses)}" if clauses else ""

        params.append((search_limit, offset))

        query = f"""
            SELECT * FROM purchases 
            {where_clause} 
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        """

        cursor.execute(query, params)

        rows = cursor.fetchall()

        if not rows:
            return []

        return [Purchase.from_row(row) for row in rows]
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()


def insert_purchase(data: dict) -> Purchase:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        client_id = data.get("client_id")

        if client_id is None:
            raise BusinessRuleError(error_messages.FOREIGN_KEY_ERROR)

        now = int(datetime.now().timestamp())

        cursor.execute(
            """INSERT INTO purchases (
                client_id,
                description,
                total_cents,
                total_paid_cents,
                status,
                note_number,
                is_active,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?);
        """,
            (
                int(client_id),
                data.get("description"),
                data.get("total_cents"),
                data.get("total_paid_cents"),
                data.get("status"),
                data.get("note_number"),
                now,
                now,
            ),
        )

        conn.commit()
        purchase_id = cursor.lastrowid

        return get_purchase_by_id(purchase_id)

    except sqlite3.IntegrityError as e:
        if "UNIQUE constraint failed" in str(e):
            raise BusinessRuleError(error_messages.PURCHASE_ALREADY_EXISTS) from e
        elif "FOREIGN KEY constraint failed" in str(e):
            raise BusinessRuleError(error_messages.PURCHASE_CLIENT_NOT_FOUND) from e
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()


def get_purchase_by_id(purchase_id: int) -> Purchase | None:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM purchases WHERE id = ?", (purchase_id,))
        row = cursor.fetchone()

        if not row:
            return None

        return Purchase.from_row(row)
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()


def get_purchase_by_note_number(note_number: str) -> Purchase | None:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM purchases WHERE note_number = ?", (note_number,))
        row = cursor.fetchone()

        if not row:
            return None

        return Purchase.from_row(row)
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()


def update_purchase(purchase_id: int, data: dict) -> Purchase | None:
    conn = None

    # Add the updated_at column
    now = int(datetime.now().timestamp())
    data["updated_at"] = now

    columns = [f"{key} = ?" for key in data.keys()]
    values = list(data.values())

    # Add the purchase_id for the WHERE clause
    values.append(purchase_id)

    query = f"""
        UPDATE purchases SET {', '.join(columns)}
        WHERE id = ?
    """

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(query, tuple(values))
        conn.commit()

        if cursor.rowcount == 0:
            return None

        return get_purchase_by_id(purchase_id)
    except sqlite3.IntegrityError as e:
        if "FOREIGN KEY constraint failed" in str(e):
            raise BusinessRuleError(error_messages.PURCHASE_CLIENT_NOT_FOUND)
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()


def deactivate_purchase(purchase_id: int) -> bool:
    """Deactivate a purchase."""
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        now = int(datetime.now().timestamp())

        # disable purchase with the given ID
        cursor.execute(
            """
            UPDATE purchases SET is_active = 0, updated_at = ?
            WHERE id = ? AND is_active = 1
        """,
            (now, purchase_id),
        )

        conn.commit()

        return cursor.rowcount > 0
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()


# Client related functions
def get_purchases_by_client_id(
    client_id: int,
    limit: int | None = None,
    offset: int = 0,
    statuses: List[PurchaseStatus] | None = None,
    is_active: bool | None = None,
) -> List[Purchase]:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Default limit if not provided (-1 means "no limit" in SQLite)
        search_limit = -1 if limit is None else limit

        # Create WHERE clause based on status and is_active
        # The semantics and group meaning of status and is_active being used together
        # should be verified in the service-layer. Here it is considered "as is".
        params = []
        clauses = []

        clauses.append("client_id = ?")
        params.append(client_id)

        if statuses:
            placeholders = ", ".join(["?"] * len(statuses))
            clauses.append(f"status IN ({placeholders})")
            params.extend([s.value for s in statuses])

        if is_active is not None:
            clauses.append("is_active = ?")
            params.append(int(is_active))

        where_clause = f"WHERE {' AND '.join(clauses)}" if clauses else ""

        params.append((search_limit, offset))

        query = f"""
            SELECT * FROM purchases 
            {where_clause} 
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        """

        cursor.execute(query, params)

        rows = cursor.fetchall()

        return [Purchase.from_row(row) for row in rows] if rows else []
    except sqlite3.IntegrityError as e:
        if "FOREIGN KEY constraint failed" in str(e):
            raise BusinessRuleError(error_messages.PURCHASE_CLIENT_NOT_FOUND)
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()


def get_purchases_ids_by_client_id(client_id: int) -> List[int]:
    """Get all purchases ids for a given client."""
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # get all purchases ids for that client
        cursor.execute(
            """
            SELECT id FROM purchases WHERE client_id = ? AND is_active = 1
        """,
            (client_id,),
        )
        purchase_ids = [row[0] for row in cursor.fetchall()]

        return purchase_ids
    except sqlite3.IntegrityError as e:
        if "FOREIGN KEY constraint failed" in str(e):
            raise BusinessRuleError(error_messages.PURCHASE_CLIENT_NOT_FOUND)
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()


def deactivate_purchases_by_client_id(client_id: int) -> bool:
    """Deactivate all purchases for a given client."""
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        now = int(datetime.now().timestamp())

        # disable all purchases related to that client
        cursor.execute(
            """
            UPDATE purchases SET is_active = 0, updated_at = ?
            WHERE client_id = ? AND is_active = 1
        """,
            (now, client_id),
        )

        conn.commit()

        return cursor.rowcount > 0
    except sqlite3.IntegrityError as e:
        if "FOREIGN KEY constraint failed" in str(e):
            raise BusinessRuleError(error_messages.PURCHASE_CLIENT_NOT_FOUND)
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()
