# Organização de pastas para projeto Nota Real Fiados (Python + FastAPI + SQLite)

Este documento descreve a organização atual do backend do projeto **NotaReal Fiados**, usando **FastAPI** com **SQLite**, sem dependência de ORM. A arquitetura busca **separar responsabilidades** em camadas claras: **router → service → repository → database** = API, lógica de negócio e persistência de dados — permitindo fácil manutenção e testes isolados com modelos simples (dataclasses) e validação/serialização via Pydantic.

## Estrutura atual do projeto

Para gerar a listagem mais atualizada do projetos:
```bash
tree -I "__pycache__|__init__.py|.vscode|*.pyc|pythonvenv|.git|.gitignore|*.db|*.sql|exported_file.md|export_files_content.py"
```

```
notareal-fiados/
├── app/                              ← Código-fonte principal do backend
│   ├── database.py                   ← Inicializa conexão SQLite (WAL, pragmas, conexão única)
│   ├── main.py                       ← Cria FastAPI, registra rotas e middlewares
│   ├── models/                       ← Modelos internos (POPOs)
│   │   ├── client.py                 ← Modelo Client (id, nome, contato)
│   │   ├── payment.py                ← Modelo Payment (valor, método, data, ativo)
│   │   └── purchase.py               ← Modelo Purchase (total, status, pagos)
│   ├── repositories/                 ← Acesso ao banco (SQL puro)
│   │   ├── client_repository.py      ← CRUD de clientes em SQLite
│   │   ├── payment_repository.py     ← CRUD de pagamentos em SQLite
│   │   └── purchase_repository.py    ← CRUD de compras em SQLite
│   ├── routes/                       ← Endpoints FastAPI (sem lógica de negócio)
│   │   ├── clients.py                ← Rotas /clients
│   │   ├── payments.py               ← Rotas /purchases/{id}/payments
│   │   └── purchases.py              ← Rotas /purchases
│   ├── schemas/                      ← Schemas Pydantic (entrada/saída)
│   │   ├── client.py                 ← Schemas de cliente
│   │   ├── mixins.py                 ← Schemas compartilhados (ex.: validadores)
│   │   ├── payment.py                ← Schemas de pagamento
│   │   └── purchase.py               ← Schemas de compra
│   ├── services/                     ← Regra de negócio (coração do sistema)
│   │   ├── client_service.py         ← Lógica de clientes
│   │   ├── payment_service.py        ← Lógica de pagamentos (ativar, desativar, validar)
│   │   └── purchase_service.py       ← Lógica de compras (recalculo e vínculos)
│   └── utils/                        ← Funções auxiliares
│       ├── api_seed.py               ← Gera dados de exemplo para testes
│       ├── backup.py                 ← Futuro Backup/restore do banco SQLite
│       ├── helpers.py                ← Utilidades diversas
│       ├── printer.py                ← Futuro módulo de geração/print de PDFs
│       └── exceptions/               ← Sistema centralizado de erros
│           ├── error_messages.py     ← Mensagens de erro padronizadas
│           ├── exceptions.py         ← Exceções de validação e regra de negócio
│           └── http_exceptions.py    ← Converte exceções para HTTPException
├── config.py                         ← Configurações gerais (em construção como paths e flags)
├── data/                             ← Banco SQLite e arquivos persistentes
│   └── notareal.db                   ← Base de dados principal
├── docs/                             ← Documentação completa do backend
│   ├── architecture_backend.md       ← Arquitetura, camadas e responsabilidades
│   ├── database_design.md          ← Modelo do banco + fluxo de dados
│   ├── README.md                     ← Documentação geral
│   ├── routes_documentation.md       ← Manual de rotas (em construção)
│   └── ChatGPT-fluxograma.png        ← Fluxograma simplificado do sistema
└── requirements.txt                  ← Dependências Python
```

## Como o desacoplamento funciona

1. **FastAPI (app/main.py e app/routes/)**
   - Apenas lida com rotas, requests e responses.
   - Cada arquivo define um conjunto de endpoints REST.
   - Recebem parâmetros, validam tipos via Pydantic e chamam apenas os services.
   - Não contém lógica de negócio nem SQL.
   - Não conhecem detalhes do banco de dados.

2. **Serviços (app/services/)**  
   - Contém a **lógica de negócio**, independente do FastAPI ou do SQLite.
   - Controlam os modelos **clientes**, **compras** e **pagamentos**.
   - Exemplo: validar regras de negócio, ativação/desativação, validações internas e recalculo automático.
   - Podem ser usados tanto pela API quanto internamente sem FastAPI.
   - Decidem quando chamar `recalculate_purchase_totals`.

3. **Repositórios (app/repositories/)**  
   - Apenas **operações de banco de dados** (SELECT, INSERT, UPDATE) sem regras de negócio.
   - Abstrai a camada de persistência.
   - Permite trocar SQLite por outro banco, só muda aqui.

4. **Modelos (app/models/)**  
   - Estruturas de dados internas (POPOs = Plain Old Python Objects).  
   - Carregam dados vindos do banco e garantem consistência entre camadas.
   - Não dependem de ORM nem do FastAPI.

5. **Schemas (app/schemas/)**
   - Validam entrada da API e padronizam saída com `response_model`.
   - Garantem que a API sempre retorna formatos consistentes e seguros.
   - Podem ter exemplos e descrições para melhorar a documentação automática.

6. **Database (app/database.py)**  
   - Inicializa e mantém o banco SQLite com configurações otimizadas.
   - Garante que cada operação tenha a sua própria conexão controlada.

7. **Utils (app/utils/)**  
   - Funções auxiliares (backup, helpers, printer).
   - Exceções customizadas que padronizam erros em toda aplicação (Ver **app/utils/exceptions/**).
   - Não têm dependência direta das regras de negócio.

8. **Main (app/main.py)**
   - Monta o FastAPI, registra rotas e middlewares.
   - Não contém lógica de domínio nem SQL.


> Resultado: cada parte do sistema tem uma única responsabilidade.
>  - As rotas chamam services;  
>  - Services chamam repositories;  
>  - Repositories falam com o banco;  
>  - Schemas controlam entrada e saída;  
>  - Models carregam dados internos;  
>  - Utils ajudam tudo isso a funcionar de forma limpa.


## Exemplo rápido de implementação sem ORM

A seguir está um exemplo resumido mostrando como modelos, repositórios, serviços e rotas se conectam sem o uso de ORM, usando apenas objetos Python simples e SQL manual.

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
from app.database import get_connection
from app.models.client import Client

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
```

**services/client_service.py**
```python
from typing import List
from app.models import Client
import app.repositories.client_repository as client_repository
from app.utils.exceptions import (
    NotFoundError,
    error_messages
)

def get_clients(limit: int = None, offset: int = 0, only_active: bool = True) -> List[Client]:
    clients = client_repository.get_clients(limit, offset, only_active)
    if not clients:
        return []
    
    return clients

def get_client_by_id(client_id: int) -> Client | None:
    client = client_repository.get_client_by_id(client_id)
    if not client:
        raise NotFoundError(error_messages.CLIENT_NOT_FOUND)

    return client
```

**routes/clients.py**
```python
from fastapi import APIRouter, HTTPException, Depends
from app.services.client_service import (
    get_client_by_id,
    get_clients
)
from app.utils.exceptions import handle_service_exceptions
from app.schemas.client import (
    ClientListResponseSchema,
    ClientListQuerySchema,
    ClientResponseSchema
)

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("/", response_model=ClientListResponseSchema)
@handle_service_exceptions
def list_clients(params: ClientListQuerySchema = Depends()):
    """List all clients."""

    limit = params.limit
    offset = params.offset
    only_active = params.only_active
 
    clients = get_clients(limit, offset, only_active)
    return {"message": "Clientes encontrados.", "clients": clients}

@router.get("/{client_id}", response_model=ClientResponseSchema)
@handle_service_exceptions
def read_client(client_id: int):
    """Get client by ID."""
    client = get_client_by_id(client_id)
    return client
```

## Vantagens dessa abordagem
- Facilita manutenção e testes isolados.
- Permite trocar o banco de dados facilmente.
- Mantém camadas bem separadas (rotas → serviços → repositórios → banco).
- Evita duplicação de lógica e regras inconsistentes.
- Centraliza regras de negócio nos serviços.
- Repositórios continuam simples e previsíveis (SQL direto).
- Modelos internos são independentes de frameworks.
- Schemas Pydantic garantem API estável e validada.
- Facilita evolução do projeto (PWA, desktop, mobile).
- Reduz risco de erros silenciosos no backend.

---

## 🔗 Documentos Relacionados

- 📘 **[Escopo e visão do projeto](../README.md)** → `README.md`

  Descreve o propósito, público-alvo e principais funcionalidades do sistema Nota Real Fiados.
- 🗃️ **[Modelo de dados e fluxo de informações](./database_design.md)** → `database_design.md`

  Mostra como clientes, notas e pagamentos se relacionam no banco de dados e no fluxo do app.
- 🧱 **[Exemplo de arquitetura limpa](./architecture_backend.md)** → `architecture_backend.md`

  Explica a organização de pastas e o desacoplamento entre API, serviços e repositórios, com código exemplo.
- 📚 **[Documentação das rotas](./routes_documentation.md)** → `routes_documentation.md`
  
  Demonstra como funcionam as rotas da API do sistema, com exemplos reais de uso.

- 🧭 **[Fluxo de telas e navegação](./screen_flow.md)** → `screen_flow.md`

  Descreve o fluxo geral de telas do sistema, decisões de navegação, estratégias de busca (ID, nota, recibo),
  e considerações sobre cache, sincronização de dados e experiência multi-dispositivo.

- 🖼️ **[Wireframes iniciais da interface](./wireframe.md)** → `wireframe.md`

  Apresenta wireframes textuais das principais telas (dashboard, clientes, compras e pagamentos),
  incluindo modais de criação/edição, ações de ativação/desativação e organização visual dos dados.
