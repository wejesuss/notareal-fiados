import sqlite3
from pathlib import Path

DB_PATH = Path("data") / "agroreal.db"
DB_PATH.parent.mkdir(exist_ok=True)

def init_database():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            nickname TEXT UNIQUE,
            phone TEXT,
            email TEXT,
            is_active INTEGER DEFAULT 1,
            created_at INTEGER,
            updated_at INTEGER
        );
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            description TEXT,
            total_value REAL NOT NULL,
            total_paid_value REAL DEFAULT 0.0,
            status TEXT DEFAULT 'pending',
            note_number TEXT UNIQUE,
            created_at INTEGER,
            updated_at INTEGER,

            FOREIGN KEY (client_id) REFERENCES clients (id)
        );
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            purchase_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            note TEXT, -- added method (card, money) on insert
            receipt_number TEXT UNIQUE,
            payment_date INTEGER,

            FOREIGN KEY (purchase_id) REFERENCES purchases (id)
        );
    """)

    cursor.execute("""CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name)""")
    cursor.execute("""CREATE INDEX IF NOT EXISTS idx_clients_nickname ON clients(nickname)""")
    cursor.execute("""CREATE INDEX IF NOT EXISTS idx_purchases_client ON purchases(client_id)""")
    cursor.execute("""CREATE INDEX IF NOT EXISTS idx_payments_purchase ON payments(purchase_id)""")

    conn.commit()
    # cursor.close()
    conn.close()

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    # PRAGMAs for otimization
    # 🔒 1. Reference integrity
    conn.execute("PRAGMA foreign_keys = ON;")
    print("Setting database PRAGMA foreign_keys = ON")

    # ⚡ 2. Enable WAL mode (Write-Ahead Logging)
    conn.execute("PRAGMA journal_mode = WAL;")
    print("Setting database PRAGMA journal_mode = Write-Ahead Logging")

    # 💾 3. Adjust disk synchronization (security x speed)
    conn.execute("PRAGMA synchronous = NORMAL;")
    print("Setting database PRAGMA synchronous = NORMAL")

    # 🚀 4. Optimize cache in memory
    conn.execute("PRAGMA cache_size = -4000;")  # negative value = KB → 4 MB
    print("Setting database PRAGMA cache_size = 4MB")

    # ⚙️ 5. Use temp_store in memory (reduce I/O)
    conn.execute("PRAGMA temp_store = MEMORY;")
    print("Setting database PRAGMA temp_store = MEMORY")

    # 🔁 6. Use memory mapping with LRU (read database from RAM)
    conn.execute("PRAGMA mmap_size = 50000000;")  # up to ~50 MB of memory mapping
    print("Setting database PRAGMA mmap_size = 50MB")

    # 🧮 7. Change wait timestamps if database is busy
    conn.execute("PRAGMA busy_timeout = 5000;")  # wait until 5s if database is busy
    print("Setting database PRAGMA busy_timeout = 5 seconds")

    return conn