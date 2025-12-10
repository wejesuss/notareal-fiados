# Organização de pastas para projeto Nota Real Fiados (Python + FastAPI + SQLite)

Este documento descreve como estruturar o backend do projeto **Nota Real Fiados**, usando **FastAPI** com **SQLite**, sem dependência de ORM.
A arquitetura busca **separar responsabilidades** — API, lógica de negócio e persistência de dados — permitindo fácil manutenção e testes isolados.

## Estrutura atual do projeto

```
notareal-fiados/
│
├── app/
│ ├── main.py # Inicializa o FastAPI e registra rotas
│ ├── database.py # Criação e conexão com banco SQLite
│ │
│ ├── routes/ # Rotas da API
│ │ ├── clients.py
│ │ ├── purchases.py
│ │ └── payments.py
│ │
│ ├── models/ # Modelos de dados (sem ORM)
│ │ ├── client.py
│ │ ├── purchase.py
│ │ └── payment.py
│ │
│ ├── repositories/ # Camada de acesso ao banco de dados
│ │ ├── client_repository.py
│ │ ├── purchase_repository.py
│ │ └── payment_repository.py
│ │
│ └── services/ # Lógica de negócio
│ ├── client_service.py
│ ├── purchase_service.py
│ └── payment_service.py
│
├── utils/ # Scripts utilitários
│ ├── backup.py # Backup de dados SQLite
│ ├── printer.py # Impressão de relatórios
│ └── helpers.py # Funções auxiliares genéricas
│
├── data/ # Banco de dados local
│ ├── notareal.db # Banco de dados SQLite
│
├── docs/ # Documentação e diagramas
│ ├── db_model_and_flow.md # Queries e estrutura do banco
│ ├── architecture_backend.md # Organização do código
│ ├── README.md # Documentação principal do projeto
│ └── ChatGPT-fluxograma.png # Lógica simples de fluxo dos dados do sistema
│
├── config.py # Configurações gerais
├── test-db.session.sql # Script de teste de banco
├── requirements.txt # Dependências Python
```

## Como o desacoplamento funciona

1. **FastAPI (app/main.py e app/routes/)**
   - Apenas lida com rotas, requests e responses.
   - Não contém lógica de negócio nem SQL.

2. **Serviços (app/services/)**  
   - Contém a **lógica de negócio**, independente do FastAPI ou do SQLite.
   - Exemplo: calcular desconto, validar regras de negócio.

3. **Repositórios (app/repositories/)**  
   - Apenas **operações de banco de dados** (SELECT, INSERT, UPDATE).
   - Abstrai a camada de persistência.
   - Se amanhã você trocar SQLite por outro banco, só muda aqui.

4. **Modelos (app/models/)**  
   - Estruturas de dados internas (POPOs = Plain Old Python Objects).  
   - Não dependem de ORM nem do FastAPI.

5. **Database** → inicializa e mantém o banco SQLite, com configurações otimizadas.

6. **Utils** → scripts auxiliares (backup, impressão, etc.).

## Exemplo rápido de implementação sem ORM

**models/client.py**
```python
from dataclasses import dataclass
from datetime import datetime

# Store basic information about the client
@dataclass
class Client:
    id: int
    name: str
    nickname: str | None
    phone: str | None
    email: str | None
    created_at: datetime
    updated_at: datetime
    is_active: int
```

**repositories/client_repository.py**
```python
from typing import List
from datetime import datetime
from database import get_connection, sqlite3
from models import Client

def get_clients(limit: int = None, offset: int = 0) -> List[Client]:
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Default limit if not provided (-1 means "no limit" in SQLite)
        search_limit = -1 if limit is None else limit

        cursor.execute("""
            SELECT * FROM clients WHERE is_active = 1 ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        """, (search_limit, offset))

        rows = cursor.fetchall()

        if not rows:
            return []

        return [Client.from_row(row) for row in rows]
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
    finally:
        if conn:
            conn.close()
```

**services/client_service.py**
```python
from typing import List
from models import Client
import repositories.client_repository as client_repository

def get_clients(limit: int = None, offset: int = 0) -> List[Client]:
    clients = client_repository.get_clients(limit, offset)
    if not clients:
        return []
    
    return clients

def get_client_by_id(client_id: int) -> Client | None:
    return client_repository.get_client_by_id(client_id)
```

**routes/clients.py**
```python
from fastapi import APIRouter, HTTPException
from services.client_service import (
    get_client_by_id,
    get_clients
)

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("/")
def list_clients(limit: int = None, offset: int = 0):
    """List all clients."""
 
    clients = get_clients(limit, offset)
    if not clients:
        return {"message": "Clientes não encontrado.", "clients": []}

    clients_data = [c.__dict__ for c in clients]
    return {"message": "Clientes encontrados.", "clients": clients_data}

@router.get("/{client_id}")
def read_client(client_id: int):
    """Get client by ID."""
    client = get_client_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    return client.__dict__
```

## Vantagens dessa abordagem
- Facilita manutenção e testes unitários isolados
- Permite trocar o banco de dados facilmente
- Mantém o código desacoplado do framework
- Evita duplicação de lógica entre rotas e serviços

---

### 🔗 Documentos relacionados

- 📘 **[Escopo e visão do projeto](./README.md)**  
  Descreve o propósito, público-alvo e principais funcionalidades do sistema Nota Real Fiados.

- 🗃️ **[Modelo de dados e fluxo de informações](./db_model_and_flow.md)**  
  Mostra como clientes, notas e pagamentos se relacionam no banco de dados e no fluxo do app.

- 🧱 **[Exemplo de arquitetura limpa (FastAPI + SQLite)](./architecture_backend.md)**  
  Explica a organização de pastas e o desacoplamento entre API, serviços e repositórios, com código exemplo.
