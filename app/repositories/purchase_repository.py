from typing import List
from datetime import datetime
from database import get_connection, sqlite3
from models.purchase import Purchase

def get_purchases(limit: int = None, offset: int = 0, only_pending: bool = True) -> List[Purchase]:
    conn = get_connection()
    cursor = conn.cursor()

    # Default limit if not provided (-1 means "no limit" in SQLite)
    search_limit = -1 if limit is None else limit
    
    where_clause = "WHERE 1"
    if only_pending:
        where_clause = "WHERE status IN ('pending', 'partial')"

    cursor.execute(f"""
        SELECT * FROM purchases {where_clause} ORDER BY created_at
        LIMIT ? OFFSET ?
    """, (search_limit, offset))

    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return []

    return [Purchase.from_row(row) for row in rows]

def insert_purchase(data: dict) -> Purchase:
    try:
        conn = get_connection()
        cursor = conn.cursor()

        now = int(datetime.now().timestamp())

        cursor.execute("""INSERT INTO purchases (
                client_id,
                description,
                total_value,
                total_paid_value,
                status,
                note_number,
                created_at,
                updated_at
            ) VALUES (?,?,?,?,?,?,?,?);
        """, (
            int(data.get("client_id")),
            data.get("description"),
            data.get("total_value"),
            data.get("total_paid_value"),
            data.get("status"),
            data.get("note_number"),
            now,
            now
        ))

        conn.commit()
        purchase_id = cursor.lastrowid

        return get_purchase_by_id(purchase_id)

    except sqlite3.IntegrityError as e:
        if "UNIQUE constraint failed" in str(e):
            raise ValueError("Uma compra com esse número de nota já existe.")
        elif "FOREIGN KEY constraint failed" in str(e):
            raise ValueError("Um cliente com esse id não existe.")
        else:
            raise ValueError("Erro inesperado do banco.") from e
    finally:
        conn.close()

def get_purchase_by_id(purchase_id: int) -> Purchase | None:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM purchases WHERE id = ?", (purchase_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    return Purchase.from_row(row)

def update_purchase(purchase_id: int, data: dict) -> Purchase | None:
    conn = get_connection()
    cursor = conn.cursor()

    # columns that are allowed to be updated
    allowed_columns = ["client_id", "description", "total_value", "total_paid_value", "status"]

    columns = []
    values = []
    now = int(datetime.now().timestamp())

    # validate data fields
    for key, value in data.items():
        if key in allowed_columns:
            columns.append(f"{key} = ?")
            values.append(value)
    
    if not columns:
        raise ValueError("Nenhum campo válido fornecido para a atualização da compra.")

    # Add the updated_at column
    columns.append("updated_at = ?")
    # Add the timestamp for the updated_at column
    values.append(now)
    # Add the purchase_id for the WHERE clause
    values.append(purchase_id)

    query = f"""
        UPDATE purchases SET {', '.join(columns)} 
        WHERE id = ?
    """

    try:
        cursor.execute(query, tuple(values))
        conn.commit()

        if cursor.rowcount == 0:
            return None
        
        return get_purchase_by_id(purchase_id)
    except sqlite3.IntegrityError as e:
        if "UNIQUE constraint failed" in str(e):
            raise ValueError("Uma compra com esse número de nota já existe.")
        elif "FOREIGN KEY constraint failed" in str(e):
            raise ValueError("Um cliente com esse id não existe.")
        else:
            raise ValueError("Erro inesperado do banco.")
    finally:
        conn.close()

def delete_purchase(purchase_id: int) -> bool:
    """Delete a purchase"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            DELETE FROM purchases WHERE id = ?
        """, (purchase_id,))

        conn.commit()

        return cursor.rowcount > 0
    except sqlite3.Error as e:
        raise ValueError("Erro inesperado do banco.") from e
    finally:
        conn.close()
