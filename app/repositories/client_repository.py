from typing import List
from datetime import datetime
from database import get_connection, sqlite3
from models import Client
from utils.exceptions import (
    ValidationError, BusinessRuleError, DatabaseError,
    error_messages
)

def get_clients(limit: int = None, offset: int = 0, only_active: bool = True) -> List[Client]:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Default limit if not provided (-1 means "no limit" in SQLite)
        search_limit = -1 if limit is None else limit
        where_clause = ""
        if only_active:
            where_clause = "WHERE is_active = 1"

        cursor.execute(f"""
            SELECT * FROM clients {where_clause} ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        """, (search_limit, offset))

        rows = cursor.fetchall()

        if not rows:
            return []

        return [Client.from_row(row) for row in rows]
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()

def insert_client(data: dict) -> Client:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        now = int(datetime.now().timestamp())

        cursor.execute("""
            INSERT INTO clients (name, nickname, phone, email, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, 1, ?, ?)
        """, (
            data.get("name"),
            data.get("nickname"),
            data.get("phone"),
            data.get("email"),
            now,
            now
        ))

        conn.commit()
        client_id = cursor.lastrowid

        return get_client_by_id(client_id)

    except sqlite3.IntegrityError as e:
        if "UNIQUE constraint failed" in str(e):
            raise BusinessRuleError(error_messages.CLIENT_ALREADY_EXISTS) from e
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()

def get_client_by_id(client_id: int) -> Client | None:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM clients WHERE id = ?", (client_id,))
        row = cursor.fetchone()

        if not row:
            return None

        return Client.from_row(row)
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()

def update_client(client_id: int, data: dict) -> Client | None:
    conn = None

    # columns that are allowed to be updated
    allowed_columns = ["name", "nickname", "phone", "email", "is_active"]

    columns = []
    values = []
    now = int(datetime.now().timestamp())

    # validate data fields
    for key, value in data.items():
        if key in allowed_columns:
            columns.append(f"{key} = ?")
            values.append(value)
    
    if not columns:
        raise ValidationError(error_messages.DATA_FIELDS_EMPTY)

    # Add the updated_at timestamp
    columns.append("updated_at = ?")
    # Add the timestamp for the updated_at column
    values.append(now)
    # Add the client_id for the WHERE clause
    values.append(client_id)

    query = f"""
        UPDATE clients SET {', '.join(columns)} 
        WHERE id = ?
    """

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(query, tuple(values))
        conn.commit()

        if cursor.rowcount == 0:
            return None
        
        return get_client_by_id(client_id)
    except sqlite3.IntegrityError as e:
        if "UNIQUE constraint failed" in str(e):
            raise BusinessRuleError(error_messages.CLIENT_ALREADY_EXISTS) from e
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()

def deactivate_client(client_id: int) -> bool:
    """Deactivate (soft delete) a client."""
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        now = int(datetime.now().timestamp())
        cursor.execute("""
            UPDATE clients SET is_active = 0, updated_at = ? 
            WHERE id = ? AND is_active = 1
        """, (now, client_id))

        conn.commit()

        return cursor.rowcount > 0
    except sqlite3.Error as e:
        raise DatabaseError(error_messages.DATABASE_ERROR) from e
    finally:
        if conn:
            conn.close()
