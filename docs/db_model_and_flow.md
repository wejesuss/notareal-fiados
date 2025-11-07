# Modelo do Banco de Dados e Mapa de Telas - NotaReal Fiados (MVP)

## Objetivo deste documento
Este arquivo contém o **modelo de dados atualizado** (SQL `CREATE TABLE`) do banco SQLite do NotaReal Fiados, além do **mapa de telas e fluxo** do programa (MVP). Use este documento como referência para implementar o banco e as telas iniciais.

---

## Modelo de Dados (SQLite)

> Observação: os nomes das colunas e tabelas estão em inglês (código), enquanto os textos e descrições para o usuário estão em português.

### clients
Guarda informações básicas do cliente.

```sql
CREATE TABLE clients (
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

**Descrição dos campos (para o vendedor):**
- `name`: Nome completo do cliente.  
- `nickname`: Apelido ou identificação curta (útil para distinguir nomes iguais).  
- `phone`: Telefone de contato (opcional).  
- `email`: E-mail (opcional).  
- `created_at`: Data de cadastro.  
- `updated_at`: Última atualização do cadastro.  
- `is_active`: 1 = ativo, 0 = inativo (permite "desativar" sem excluir).

---

### purchases
Representa uma compra fiada feita por um cliente.

```sql
CREATE TABLE purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    description TEXT,
    total_value REAL NOT NULL,
    total_paid_value REAL DEFAULT 0.0,
    status TEXT DEFAULT 'pending', -- 'pending', 'partial', 'paid'
    note_number TEXT UNIQUE,
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
- `created_at` e `updated_at`: datas de criação e alteração.

---

### payments
Registra cada pagamento (total ou parcial) referente a uma compra fiada.

```sql
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    note TEXT, -- added method (card, money) on insert
    receipt_number TEXT UNIQUE,
    payment_date INTEGER,

    FOREIGN KEY (purchase_id) REFERENCES purchases (id)
);
```

**Descrição dos campos (para o vendedor):**
- `receipt_number`: Número do recibo de pagamento (ex: REC-001).  
- `amount`: Valor pago nesta transação.  
- `payment_date`: Data e hora do pagamento.  
- `method`: Forma de pagamento (ex: dinheiro, pix, transferência).  
- `note`: Observações adicionais (ex: "parcial com troco").

---

### optional: purchase_items (opcional)
Caso queira detalhar itens por compra.

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

## Índices recomendados
Para performance em buscas e relatórios simples:

```sql
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_purchases_client ON purchases(client_id);
CREATE INDEX idx_payments_purchase ON payments(purchase_id);
```

---

## Regras de consistência (lógica a implementar na aplicação)
1. Ao registrar um pagamento:
   - Inserir linha em `payments`.  
   - Atualizar `purchases.total_paid_value += amount`.  
   - Atualizar `purchases.status`:
     - se `total_paid_value >= total_value` → `paid`
     - se `total_paid_value > 0 and total_paid_value < total_value` → `partial`
     - se `total_paid_value == 0` → `pending`

2. Geração de números:
   - `note_number` para `purchases`: série incremental (ex: `NF-0001`).
   - `receipt_number` para `payments`: série incremental (ex: `REC-0001`).
   - Armazenar o número gerado no registro correspondente.

3. Nunca apagar registros históricos; usar `is_active` para desativar clientes ou marcar compras como canceladas, preservando o histórico.

4. Em importações/restore de backup, garantir que as séries de `note_number` e `receipt_number` não conflitem (usar prefácio com ano/loja se necessário).

---

## Mapa de Telas e Fluxo (MVP)

O fluxo a seguir é otimizado para simplicidade e velocidade de uso pelo vendedor.

```
╔════════════════════════════════════════════════╗
║                🏠 Tela Inicial                  ║
╚════════════════════════════════════════════════╝
      ↓
 ┌───────────────────────────────────────────────┐
 │ [1] Clientes                                  │
 │ [2] Compras Fiadas                            │
 │ [3] Pagamentos                                │
 │ [4] Histórico                                 │
 │ [5] Backup / Restauração                      │
 │ [6] Sair                                      │
 └───────────────────────────────────────────────┘
```

### 1. Clientes
- Funções: adicionar, editar, excluir, buscar por nome/apelido.  
- Campos visíveis: `Nome`, `Apelido`, `Telefone`, `Email`, `Criado em`, `Atualizado em`.

### 2. Compras Fiadas
- Funções: selecionar cliente, descrição, valor total, gerar `note_number`, salvar e imprimir nota.  
- Impressão: nota com campos em português (cliente, descrição, valor, data, assinatura).

### 3. Pagamentos
- Funções: selecionar compra pendente, inserir valor, método, gerar `receipt_number`, salvar e imprimir recibo.  
- Ao registrar pagamento, atualizar `total_paid_value` e `status` da compra.

### 4. Histórico
- Visualização consolidada por cliente com filtro por status (pendente/quitado) e por período.  
- Possibilidade de reimprimir notas ou recibos.

### 5. Backup / Restauração
- Exportar arquivo `.db` ou `.zip` contendo o banco.  
- Restaurar a partir de arquivo selecionado.  
- Opção de enviar backup manualmente por e-mail ou copiar para pendrive.

---

## Exemplos de consultas úteis

- Saldo pendente por cliente:
```sql
SELECT c.id, c.name, SUM(p.total_value) AS total_purchases, SUM(p.total_paid_value) AS total_paid,
       (SUM(p.total_value) - SUM(p.total_paid_value)) AS total_due
FROM clients c
LEFT JOIN purchases p ON p.client_id = c.id
GROUP BY c.id, c.name
ORDER BY total_due DESC;
```

- Lista de compras pendentes:
```sql
SELECT * FROM purchases WHERE status IN ('pending', 'partial') ORDER BY created_at;
```

- Pagamentos de uma compra:
```sql
SELECT * FROM payments WHERE purchase_id = ? ORDER BY payment_date;
```

---

## Observações finais
- Este modelo prioriza **simplicidade operacional** e **facilidade de backup** (arquivo único `.db`).  
- A lógica de negócios (numeração de notas, regras de status, geração de PDFs e impressão) deve ser implementada pela aplicação (server/app) para garantir consistência.

---

### 🔗 Documentos relacionados

- 📘 **[Escopo e visão do projeto](./notareal_fiados_scope.md)**  
  Descreve o propósito, público-alvo e principais funcionalidades do sistema Nota Real Fiados.

- 🗃️ **[Modelo de dados e fluxo de informações](./db_model_and_flow.md)**  
  Mostra como clientes, notas e pagamentos se relacionam no banco de dados e no fluxo do app.

- 🧱 **[Exemplo de arquitetura limpa (FastAPI + SQLite)](./project_clean-code_example.md)**  
  Explica a organização de pastas e o desacoplamento entre API, serviços e repositórios, com código exemplo.
