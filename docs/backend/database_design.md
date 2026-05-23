# Modelo do Banco de Dados e Mapa de Telas - NotaReal Fiados (MVP)

## Objetivo deste documento
Este arquivo contém o **modelo de dados atualizado** (SQL `CREATE TABLE`) do banco SQLite do NotaReal Fiados. Também apresenta um **resumo do fluxo de informações** entre clientes, compras e pagamentos.

---

## Modelo de Dados (SQLite) — `app/database.py`

> O banco de dados SQLite é criado automaticamente no diretório `data/` com o nome `notareal.db`.
A inicialização ocorre via `init_database()` no startup do app FastAPI.

> Observação: os nomes das colunas e tabelas estão em inglês (código), enquanto os textos e descrições para o usuário estão em português.

### 🧍 clients
Guarda informações básicas do cliente.

```sql
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
```

**Descrição dos campos:**
- `name`: Nome completo do cliente.  
- `nickname`: Apelido ou identificação curta (útil para distinguir nomes iguais).  
- `phone`: Telefone de contato (opcional).  
- `email`: E-mail (opcional).  
- `created_at`: Data de cadastro em segundos.
- `updated_at`: Última atualização do cadastro em segundos.
- `is_active`: 1 = ativo, 0 = inativo (permite "desativar" sem excluir).

| Campo | Tipo | Descrição |
|-------|------|------------|
| `id` | INTEGER (PK) | Identificador único |
| `name` | TEXT | Nome completo |
| `nickname` | TEXT (UNIQUE) | Nome abreviado ou apelido |
| `phone` | TEXT | Telefone |
| `email` | TEXT | E-mail |
| `is_active` | INTEGER | (1=ativo, 0=inativo) |
| `created_at` | INTEGER (timestamp) | Data de criação em segundos. |
| `updated_at` | INTEGER (timestamp) | Data de atualização em segundos. |

---

### 🧾 purchases
Representa uma compra fiada feita por um cliente.

```sql
CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    description TEXT,
    total_value REAL NOT NULL,
    total_paid_value REAL DEFAULT 0.0,
    status TEXT DEFAULT 'pending',
    note_number TEXT UNIQUE,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER,

    FOREIGN KEY (client_id) REFERENCES clients (id)
);
```

**Descrição dos campos (para o vendedor):**
- `note_number`: Número da nota de compra (ex: NF-001).  
- `description`: Texto livre descrevendo os itens ou observações.  
- `total_value`: Valor total da compra.  
- `total_paid_value`: Soma acumulada dos pagamentos realizados até o momento.  
- `status`: Estado da dívida (`pending`, `partial`, `paid`).  
- `created_at` e `updated_at`: Datas de criação e atualização em segundos.

| Campo | Tipo | Descrição |
|--------|------|------------|
| `id` | INTEGER (PK) | Identificador único |
| `client_id` | INTEGER (FK → clients.id) | Chave estrangeira para o cliente
| `description` | TEXT | Descrição da compra |
| `total_value` | REAL | Valor total |
| `total_paid_value` | REAL | Valor total pago |
| `status` | TEXT | Estado da compra (`pending`, `partial`, `paid`). |
| `note_number` | TEXT (UNIQUE) | Número único da nota (ex: `NF-001`) |
| `is_active` | INTEGER | (1=ativo, 0=inativo) |
| `created_at` | INTEGER | Data de criação em segundos. |
| `updated_at` | INTEGER | Data de atualização em segundos. |

---

### 💰 payments
Registra cada pagamento (total ou parcial) referente a uma compra fiada.

```sql
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_date INTEGER, -- can be NULL
    method TEXT,
    description TEXT,
    receipt_number TEXT UNIQUE,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER,

    FOREIGN KEY (purchase_id) REFERENCES purchases (id)
);
```

**Descrição dos campos (para o vendedor):**
- `receipt_number`: Número do recibo de pagamento (ex: REC-001).  
- `amount`: Valor pago nesta transação.  
- `payment_date`: Data e hora do pagamento (pode ser desconhecido para compras passadas).
- `method`: Forma de pagamento (ex: dinheiro, pix, transferência).  
- `description`: Observações adicionais (ex: "parcial com troco").
- `created_at` e `updated_at`: Datas de criação e atualização em segundos.

| Campo | Tipo | Descrição |
|--------|------|------------|
| `id` | INTEGER (PK) | Identificador único |
| `purchase_id` | INTEGER (FK → purchases.id) | Chave estrangeira para a compra |
| `amount` | REAL | Valor pago |
| `payment_date` | INTEGER | Data do pagamento (timestamp em segundos) |
| `method` | TEXT | Forma de pagamento (ex: `pix`) |
| `description` | TEXT | Observações adicionais |
| `receipt_number` | TEXT (UNIQUE) | Número único do recibo (ex: `REC-001-001`) |
| `is_active` | INTEGER | (1=ativo, 0=inativo) |
| `created_at` | INTEGER | Data de criação em segundos. |
| `updated_at` | INTEGER | Data de atualização em segundos. |

---

### optional: purchase_items (opcional)
Caso queira detalhar itens por compra.  
Esta tabela não está implementada atualmente no projeto.

```sql
CREATE TABLE purchase_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_id INTEGER NOT NULL,
    product_name TEXT,
    quantity REAL DEFAULT 1,
    unit_price REAL DEFAULT 0.0,
    subtotal REAL GENERATED ALWAYS AS (quantity * unit_price) VIRTUAL,
    FOREIGN KEY (purchase_id) REFERENCES purchases (id)
);
```

> Observação: `purchase_items` é opcional. Para o MVP, pode-se usar apenas o campo `description` em `purchases`.

---

### Índices
Para performance em buscas e relatórios simples:

- `idx_clients_name` — busca por nome
- `idx_clients_nickname` — busca por apelido
- `idx_purchases_client` — compras por cliente
- `idx_payments_purchase` — pagamentos por compra

---

```sql
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name)
CREATE INDEX IF NOT EXISTS idx_clients_nickname ON clients(nickname)
CREATE INDEX IF NOT EXISTS idx_purchases_client ON purchases(client_id)
CREATE INDEX IF NOT EXISTS idx_payments_purchase ON payments(purchase_id)
```

---

### Configurações de Banco (PRAGMA)

Executadas a cada conexão via `get_connection()`:

| PRAGMA | Valor | Função |
|--------|--------|--------|
| `foreign_keys` | `ON` | Mantém integridade referencial |
| `journal_mode` | `WAL` | Melhora performance e segurança |
| `synchronous` | `NORMAL` | Balanceia segurança e velocidade |
| `cache_size` | `-4000` | ~4 MB de cache em memória |
| `temp_store` | `MEMORY` | Usa memória RAM p/ tabelas temporárias |
| `mmap_size` | `50000000` | Mapeia até 50 MB em RAM p/ leitura |
| `busy_timeout` | `5000` | Espera até 5s se o BD estiver ocupado |

---

## Regras de consistência (lógica da aplicação)

### Fluxo Relacional entre Entidades
```ruby
Cliente (clients)
      │
      └── 1:N
             └── Compras (purchases)
                       │
                       └── 1:N
                              └── Pagamentos (payments)
```

Resumo:
 - Um cliente pode ter várias compras fiadas.
 - Uma compra pode ter vários pagamentos.
 - Total pago e status da compra são recalculados após cada pagamento, ativação ou desativação.

### Regras de Negócio Baseadas no Banco
Estas regras são implementadas no service de purchase/payment, não no banco:

1. Ao registrar um pagamento:
   - Inserir linha em `payments`.  
   - Atualizar `purchases.total_paid_value += amount`.  
   - Atualizar `purchases.status`:
     - se `total_paid_value >= total_value` → `paid`
     - se `total_paid_value > 0 and total_paid_value < total_value` → `partial`
     - se `total_paid_value == 0` → `pending`

2. Geração de números:
   - `note_number` para `purchases`: série incremental (ex: `NF-0001`).
   - `receipt_number` para `payments`: série incremental com id da compra (ex: `REC-0001-0001`).
   - Armazenar o número gerado no registro correspondente.

3. Nunca apagar registros históricos; usar `is_active` para desativar clientes ou marcar compras como canceladas, preservando o histórico.

4. Em importações/restore de backup, garantir que as séries de `note_number` e `receipt_number` não conflitem (usar prefácio com ano/loja se necessário).

---

## Exemplos de consultas úteis

- Saldo pendente por cliente:
```sql
SELECT
    c.id,
    c.name,
    SUM(p.total_value) AS total_purchases,
    SUM(p.total_paid_value) AS total_paid,
    (SUM(p.total_value) - SUM(p.total_paid_value)) AS total_due
FROM clients c
LEFT JOIN purchases p ON p.client_id = c.id
GROUP BY c.id, c.name
ORDER BY total_due DESC;
```

- Lista de compras pendentes:
```sql
SELECT * FROM purchases
WHERE status IN ('pending', 'partial')
ORDER BY created_at DESC;
```

- Pagamentos de uma compra:
```sql
SELECT * FROM payments
WHERE purchase_id = ?
ORDER BY payment_date DESC;
```

---

## Observações finais
- Este modelo prioriza **simplicidade operacional** e **facilidade de backup** (arquivo único `.db`).  
- A lógica de negócios (numeração de notas, regras de status, geração de PDFs e impressão) deve ser implementada pela aplicação (server/app) para garantir consistência.

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
