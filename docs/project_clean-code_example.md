# Organização de pastas para projeto Python com FastAPI e SQLite (sem ORM)

## Estrutura sugerida de pastas

```
my_project/
│
├── app/
│   ├── __init__.py
│   ├── main.py              # Inicializa FastAPI, registra rotas
│   ├── api/                 # Rotas da API
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── endpoints.py # Ex: rotas de usuários, produtos etc.
│   │   │   └── dependencies.py  # Dependências do FastAPI
│   │   └── v2/
│   ├── core/                # Configurações gerais
│   │   ├── __init__.py
│   │   ├── config.py        # Configs, por ex. caminho do SQLite
│   │   └── settings.py
│   ├── services/            # Lógica de negócio pura
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   └── product_service.py
│   ├── repositories/        # Acesso ao banco de dados
│   │   ├── __init__.py
│   │   ├── user_repository.py
│   │   └── product_repository.py
│   └── models/              # Modelos de dados internos (POPOs, não dependem de FastAPI)
│       ├── __init__.py
│       ├── user.py
│       └── product.py
│
├── tests/                   # Testes unitários e de integração
│   ├── __init__.py
│   └── test_user.py
│
├── requirements.txt
└── README.md
```

## Como o desacoplamento funciona

1. **FastAPI (app/main.py e app/api/)**  
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

5. **Dependências (app/api/v1/dependencies.py)**  
   - Injetar serviços ou conexões com banco nas rotas do FastAPI.

## Exemplo rápido de implementação sem ORM

**models/user.py**
```python
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    email: str
```

**repositories/user_repository.py**
```python
import sqlite3
from app.models.user import User

DB_PATH = "database.db"

def get_connection():
    return sqlite3.connect(DB_PATH)

def get_user_by_id(user_id: int) -> User | None:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email FROM users WHERE id=?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return User(*row)
    return None
```

**services/user_service.py**
```python
from app.repositories.user_repository import get_user_by_id

def fetch_user(user_id: int):
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")
    # Lógica de negócio adicional aqui
    return user
```

**api/v1/endpoints.py**
```python
from fastapi import APIRouter, HTTPException
from app.services.user_service import fetch_user

router = APIRouter()

@router.get("/users/{user_id}")
def get_user(user_id: int):
    try:
        user = fetch_user(user_id)
        return user.__dict__  # Retorna como JSON simples
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
```

## Vantagens dessa abordagem

- FastAPI não “vaza” para o banco de dados.
- Serviços e repositórios podem ser **testados isoladamente**.
- Facilita trocar SQLite por outro banco sem mudar a API.
- Evita acoplamento direto de frameworks.

