# Documentação das Rotas da API – NotaReal Fiados

Este documento descreve as rotas principais da API do NotaReal Fiados, incluindo rotas de Clientes, Compras e Pagamentos.  
A API segue o padrão router → service → repository → database, com validações feitas via Pydantic schemas.

---

# 1. Clientes (`/clients`)

## 1.1 Listar clientes
GET `/clients/`

Lista todos os clientes ativos. Por padrão, somente clientes ativos são retornados.

`is_active = false` → retorna todos os clientes (ativos + inativos), desativando o filtro é desativado.

**Query params opcionais:**  
Ver: `ClientListQuerySchema`
- `limit` (int)  
- `offset` (int)
- `is_active` (bool, default: `true`)

**Exemplo de resposta:**  
`ClientListResponseSchema`
```json
{
  "message": "Clientes encontrados.",
  "clients": [
    {
      "id": 1,
      "name": "João da Silva",
      "nickname": "joao",
      "phone": "99999-9999",
      "email": "joao@email.com",
      "is_active": 1,
      "created_at": "2024-01-20T12:00:00",
      "updated_at": "2024-01-22T13:00:00"
    }
  ]
}
```

## 1.2 Criar cliente
POST `/clients/`

Adiciona um cliente ao banco de dados.

**Exemplo de Body:**  
`ClientCreateSchema`
```json
{  
  "name": "Maria Souza",  
  "nickname": "maria",  
  "phone": "99999-1111",  
  "email": "maria@email.com"  
}
```

**Exemplo de resposta:**  
`ClientWithMessageResponseSchema`
```json
{
  "message": "Cliente criado com sucesso.",
  "client": {
    "id": 38,
    "name": "Maria Souza",
    "nickname": "maria",
    "phone": "99999-1111",
    "email": "maria@email.com",
    "is_active": 1,
    "created_at": "2025-12-11T15:28:18",
    "updated_at": "2025-12-11T15:28:18"
  }
}
```

## 1.3 Obter cliente por ID
GET `/clients/{client_id}`

Retorna um cliente único ou erro 404.

**Exemplo de resposta:**  
`ClientResponseSchema`
```json
{
  "id": 38,
  "name": "Maria Souza",
  "nickname": "maria",
  "phone": "99999-1111",
  "email": "maria@email.com",
  "is_active": 1,
  "created_at": "2025-12-11T15:28:18",
  "updated_at": "2025-12-11T15:28:18"
}
```

## 1.4 Atualizar cliente
PUT `/clients/{client_id}`

Só atualiza campos fornecidos.

**Exemplo de Body:**  
`ClientUpdateSchema`
```json
{
  "nickname": "mariasouza"
}
```

**Exemplo de resposta:**  
`ClientWithMessageResponseSchema`
```json
{
  "message": "Cliente atualizado.",
  "client": {
    "id": 38,
    "name": "Maria Souza",
    "nickname": "mariasouza",
    "phone": "99999-1111",
    "email": "maria@email.com",
    "is_active": 1,
    "created_at": "2025-12-11T15:28:18",
    "updated_at": "2025-12-11T15:37:20"
  }
}
```

## 1.5 Desativar cliente
DELETE `/clients/{client_id}`

Marca como inativo (`is_active = 0`).  
Clientes não são removidos definitivamente.  
Desativa todas as `compras` e `pagamentos` relacionados. Totais da `compra` são recalculados (levando em conta que todos os pagamentos foram desativados).

**Exemplo de resposta:**  
`ClientWithMessageResponseSchema`
```json
{
  "message": "Cliente removido com sucesso.",
  "client": null,
}
```

## 1.6 Listar Compras de um cliente
GET `/clients/{client_id}/purchases`

Lista todas as compras (`purchases`) que pertencem a um determinado cliente (`client_id`). Por padrão lista somente compras ativas.

`only_active = false` → retorna todas as compras (ativos + inativos).

**Query params opcionais:**  
- `only_active` (bool, default: `true`)

**Exemplo de resposta:**  
`PurchaseListResponseSchema`
```json
{
  // GET '/clients/38/purchases'
  "message": "Compras encontradas.",
  "purchases": []
}
```
```json
{
  // GET '/clients/36/purchases?only_active=false'
  "message": "Compras encontradas.",
  "purchases": [
    {
      "id": 49,
      "client_id": 36,
      "description": "Compra adubo",
      "total_value": 76.9,
      "total_paid_value": 0,
      "status": "pending",
      "note_number": "NF-0072",
      "is_active": 0,
      "created_at": "2025-12-01T16:19:06",
      "updated_at": "2025-12-01T17:12:03"
    },
    {
      "id": 48,
      "client_id": 36,
      "description": "Compra adubo",
      "total_value": 76.9,
      "total_paid_value": 0,
      "status": "pending",
      "note_number": "NF-0071",
      "is_active": 1,
      "created_at": "2025-12-01T16:14:31",
      "updated_at": "2025-12-01T16:21:36"
    }
  ]
}
```

---

# 2. Compras (`/purchases`)

## 2.1 Listar compras
GET `/purchases/`

Lista todas as compras (`purchases`). Por padrão lista todas as compras ativas e inativas, quitadas, parciais e pendentes.

`only_pending = null` → retorna todas as compras (**ativas + inativas**).  
`only_pending = false` → retorna todas as compras **ATIVAS** (quitadas, parciais e pendentes).  
`only_pending = true` → retorna todas as compras **ATIVAS** não quitadas (pendentes e parciais).

> Observação: esta rota utiliza `only_pending`.
> A listagem de compras por cliente (`/clients/{client_id}/purchases`)
> utiliza o parâmetro `only_active`.

**Query params opcionais:**  
Ver: `PurchaseListQuerySchema`
- `limit` (`int`, default: `null`)
- `offset` (`int`, default: `0`)
- `only_pending` (`bool`|`null`, default: `null`)

**Exemplo de resposta:**  
`PurchaseListResponseSchema`
```json
{
  // GET '/purchases?limit=1'
  "message": "Compras encontradas.",
  "purchases": [
    {
      "id": 49,
      "client_id": 36,
      "description": "Compra adubo",
      "total_value": 76.9,
      "total_paid_value": 0,
      "status": "pending",
      "note_number": "NF-0072",
      "is_active": 0,
      "created_at": "2025-12-01T16:19:06",
      "updated_at": "2025-12-01T17:12:03"
    }
  ]
}
```
```json
{
  // GET '/purchases/?limit=1&offset=15&only_pending=false'
  "message": "Compras encontradas.",
  "purchases": [
    {
      "id": 32,
      "client_id": 6,
      "description": "Compra de produtos agrícolas",
      "total_value": 150.75,
      "total_paid_value": 150.75,
      "status": "paid",
      "note_number": null,
      "is_active": 1,
      "created_at": "2025-11-30T12:07:45",
      "updated_at": "2025-11-30T12:07:45"
    }
  ]
}
```

## 2.2 Criar compra
POST `/purchases/{client_id}`

Cria uma nova compra para um cliente.

- Perceba que `note_number` e `receipt_number` ainda são enviados manualmente pela API. No futuro serão campos criados de forma automática.

**Exemplo de Body:**  
`PurchaseCreateSchema`  
- Campos de criação da `compra`
  - `description` (`string`) - Descrição da compra
  - `total_value` (`float`) - Valor total da compra
  - `note_number` (`string`|`null`) - Código único de identificação da compra

- Campos de criação do `pagamento` junto à `compra` (opcionais)
  - `amount` (`float`) - valor pago adiantado
  - `payment_date` (`int`) - timestamp em segundos
  - `method` (`string`) - método de pagamento
  - `payment_description` (`string`) - Descrição do pagamento
  - `receipt_number` (`string`|`null`) - Código único de identificação do pagamento

```json
{
  "description": "Compra de produtos agrícolas",
  "total_value": 150.75,
  "note_number": "NF-0192",
  "amount": 50,
  "payment_date": 1768900000,
  "method": "pix",
  "payment_description": "Pagamento adiantado",
  "receipt_number": "REC-0038"
}
```

**Exemplo de resposta:**  
`PurchaseWithMessageResponseSchema`
```json
{
  // POST 'purchases/37'
  "message": "Compra criada com sucesso.",
  "purchase": {
    "id": 52,
    "client_id": 37,
    "description": "Compra de produtos agrícolas",
    "total_value": 150.75,
    "total_paid_value": 50,
    "status": "partial",
    "note_number": "NF-0192",
    "is_active": 1,
    "created_at": "2025-12-12T09:19:00",
    "updated_at": "2025-12-12T09:19:00"
  }
}
```

## 2.3 Obter compra por ID
GET `/purchases/{purchase_id}`

Retorna uma compra específica ou erro 404.

**Exemplo de resposta:**  
`PurchaseResponseSchema`
```json
{
  "id": 50,
  "client_id": 36,
  "description": "Compra de ferramentas",
  "total_value": 150.5,
  "total_paid_value": 0,
  "status": "pending",
  "note_number": "NF-0190",
  "is_active": 1,
  "created_at": "2025-12-01T16:25:00",
  "updated_at": "2025-12-01T16:25:00"
}
```

## 2.4 Obter compra por Número de Nota
GET `/purchases/by-note/{note_number}`

Retorna uma compra específica, buscando pelo campo `note_number` ou erro 404.

**Exemplo de resposta:**  
`PurchaseResponseSchema`
```json
{
  // GET '/purchases/by-note/NF-0190'
  "id": 50,
  "client_id": 36,
  "description": "Compra de ferramentas",
  "total_value": 150.5,
  "total_paid_value": 0,
  "status": "pending",
  "note_number": "NF-0190",
  "is_active": 1,
  "created_at": "2025-12-01T16:25:00",
  "updated_at": "2025-12-01T16:25:00"
}
```

## 2.5 Atualizar compra
PUT `/purchases/{purchase_id}`

Atualiza uma compra existente. Apenas campos fornecidos são atualizados. Totais são recalculados (**não recalcula pagamentos inativos**).

**Exemplo de Body:**  
`PurchaseUpdateSchema`
```json
{
  "description": "Compra de produtos agrícolas",
  "total_value": 190.75,
  "client_id": 1
}
```

**Exemplo de resposta:**  
`PurchaseWithMessageResponseSchema`
```json
{
  "message": "Compra atualizada.",
  "purchase": {
    "id": 28,
    "client_id": 1,
    "description": "Compra de produtos agrícolas",
    "total_value": 190.75,
    "total_paid_value": 30,
    "status": "partial",
    "note_number": "NF-0091",
    "is_active": 1,
    "created_at": "2025-11-30T12:29:20",
    "updated_at": "2025-12-12T09:40:59"
  }
}
```

## 2.6 Desativar compra
DELETE `/purchases/{purchase_id}`

Desativa uma compra (soft delete). Desativa também os pagamentos relacionados. Totais são recalculados (levando em conta que todos os pagamentos foram desativados).

**Exemplo de resposta:**  
`PurchaseWithMessageResponseSchema`
```json
{
  "message": "Compra desativada com sucesso.",
  "purchase": {
    "id": 40,
    "client_id": 9,
    "description": "Compra de sabonete",
    "total_value": 90.75,
    "total_paid_value": 0,
    "status": "pending",
    "note_number": null,
    "is_active": 0,
    "created_at": "2025-11-30T12:36:10",
    "updated_at": "2025-12-12T09:53:14"
  }
}
```

## 2.7 Restaurar compra
PUT `/purchases/{purchase_id}/restore`

Restaura uma compra desativada, **NÃO** reativa pagamentos relacionados. Pagamentos devem ser reativados à parte. Totais são recalculados.

**Exemplo de resposta:**  
`PurchaseWithMessageResponseSchema`
```json
{
  "message": "Compra restaurada.",
  "purchase": {
    "id": 40,
    "client_id": 9,
    "description": "Compra sabonete",
    "total_value": 90.75,
    "total_paid_value": 0,
    "status": "pending",
    "note_number": null,
    "is_active": 1,
    "created_at": "2025-11-30T12:36:10",
    "updated_at": "2025-12-12T09:58:27"
  }
}
```

---

# 3. Pagamentos (`/purchases/{purchase_id}/payments`)

## 3.1 Listar pagamentos
GET `/purchases/{purchase_id}/payments/`

Lista todos os `pagamentos` relacionados a uma `compra` específica.

Não há filtro por ativos/inativos - **sempre retorna ambos.**

⚠️ **Atalho especial**  
Como alternativa, `purchase_id = 0` → **retorna todos os `pagamentos` ativos de todas as `compras`.**

**Query params opcionais:**  
Ver: `PaymentListQuerySchema`  
- `limit` (`int`|`null`, default: `null`)
- `offset` (`int`, default: `0`)

**Exemplo de resposta:**  
`PaymentListResponseSchema`
```json
{
  // GET '/purchases/39/payments/?offset=0'
  "message": "Pagamentos encontrados.",
  "payments": [
    {
      "id": 19,
      "purchase_id": 39,
      "amount": 30,
      "payment_date": "2025-11-30T13:38:53",
      "method": "cartão de débito",
      "description": "Pagamento adiantado",
      "receipt_number": "REC-09301",
      "is_active": 1,
      "created_at": "2025-11-30T12:32:12",
      "updated_at": "2025-11-30T12:32:12"
    }
  ]
}
```
```json
{
  // GET '/purchases/0/payments/?limit=1&offset=0'
  "message": "Pagamentos encontrados.",
  "payments": [
    {
      "id": 28,
      "purchase_id": 52,
      "amount": 50,
      "payment_date": "2026-01-20T06:06:40",
      "method": "pix",
      "description": "Pagamento adiantado",
      "receipt_number": "REC-0038",
      "is_active": 1,
      "created_at": "2025-12-12T09:19:00",
      "updated_at": "2025-12-12T09:19:00"
    }
  ]
}
```

## 3.2 Criar pagamento
POST `/purchases/{purchase_id}/payments/`

Cria um novo pagamento para uma `compra` existente.
Ao criar um pagamento, o sistema **recalcula automaticamente** os totais da `compra` relacionada.

- Perceba que `receipt_number` ainda é enviado manualmente pela API. No futuro será um campo criado de forma automática.

**Exemplo de Body:**  
`PaymentCreateSchema`

- `amount` (`float`) - valor pago adiantado
- `method` (`string`) - método de pagamento
- `payment_date` (`int`|`null`) - timestamp em segundos
- `description` (`string`|`null`) - Descrição do pagamento
- `receipt_number` (`string`|`null`) - Código único de identificação do pagamento

```json
{
  "amount": 60,
  "payment_date": 1764793214,
  "method": "pix",
  "description": "Pagamento adicional",
  "receipt_number": "REC-0035"
}
```

**Exemplo de resposta:**  
`PaymentWithMessageResponseSchema`
```json
{
  "message": "Pagamento criado com sucesso.",
  "payment": {
    "id": 29,
    "purchase_id": 35,
    "amount": 60,
    "payment_date": "2025-12-03T17:20:14",
    "method": "pix",
    "description": "Pagamento adicional",
    "receipt_number": "REC-0035",
    "is_active": 1,
    "created_at": "2025-12-14T14:48:09",
    "updated_at": "2025-12-14T14:48:09"
  }
}
```

## 3.3 Atualizar pagamento
PUT `/purchases/{purchase_id}/payments/{payment_id}`

Atualiza campos permitidos de um pagamento:

- `amount`
- `method`
- `description`
- `payment_date`

Caso algum desses campos altere o valor total pago, os totais da compra são **recalculados automaticamente.**

**Exemplo de Body:**  
`PaymentUpdateSchema`
```json
{
  "amount": 50,
  "description": "Pagamento adicional corrigido"
}
```

**Exemplo de resposta:**  
`PaymentWithMessageResponseSchema`
```json
{
  "message": "Pagamento atualizado com sucesso.",
  "payment": {
    "id": 29,
    "purchase_id": 35,
    "amount": 50,
    "payment_date": "2025-12-03T17:20:14",
    "method": "pix",
    "description": "Pagamento primário corrigido",
    "receipt_number": "REC-0035",
    "is_active": 1,
    "created_at": "2025-12-14T14:48:09",
    "updated_at": "2025-12-14T15:05:03"
  }
}
```

## 3.4 Desativar pagamento
DELETE `/purchases/{purchase_id}/payments/{payment_id}`

Desativa (soft delete) o pagamento.
Após a desativação:

- `is_active` é ajustado para `0`
- Os totais da `compra` associada são `recalculados`, removendo o valor do pagamento desativado

**Exemplo de resposta:**  
`PaymentWithMessageResponseSchema`
```json
{
  "message": "Pagamento desativado com sucesso.",
  "payment": {
    "id": 29,
    "purchase_id": 35,
    "amount": 50,
    "payment_date": "2025-12-03T17:20:14",
    "method": "pix",
    "description": "Pagamento primário corrigido",
    "receipt_number": "REC-0035",
    "is_active": 0,
    "created_at": "2025-12-14T14:48:09",
    "updated_at": "2025-12-14T15:10:47"
  }
}
```

## 3.5 Restaurar pagamento
PUT `/purchases/{purchase_id}/payments/{payment_id}/restore`

Restaura um pagamento desativado.
Após a restauração:

- `is_active` volta para `1`
- Os totais da `compra` são `recalculados`, reincorporando este pagamento

**Exemplo de resposta:**  
`PaymentWithMessageResponseSchema`
```json
{
  "message": "Pagamento restaurado.",
  "payment": {
    "id": 29,
    "purchase_id": 35,
    "amount": 50,
    "payment_date": "2025-12-03T17:20:14",
    "method": "pix",
    "description": "Pagamento primário corrigido",
    "receipt_number": "REC-0035",
    "is_active": 1,
    "created_at": "2025-12-14T14:48:09",
    "updated_at": "2025-12-14T15:13:09"
  }
}
```

---

# 4. Respostas de Erro
Exemplos:
- Cliente não encontrado.
- Compra não encontrada.
- Pagamento não encontrado.
- Pagamento já desativado.
- Pagamento não pertence à compra especificada.
- Campos fornecidos são inválidos.

---

# 5. Convenções da API
- IDs numéricos
- Datas como timestamp interno (em segundos)
- Soft delete em clientes, compras e pagamentos
- Pagamentos sempre são gerenciados pelas rotas de compra.

> Datas são recebidas pela API como timestamp (segundos),
> mas retornadas nas respostas em formato ISO 8601.

---

# 6. Status HTTP

| Ação | Status |
| Criado/Sucesso | 200 |
| Erro de validação | 400 |
| Não encontrado | 404 |
| Lógica de aplicação violada | 409 |
| Regras violadas | 422 |
| Erro inesperado | 500 |

> Observação: por simplicidade, a API retorna `200 OK` também em operações de criação.

---

# 7. Estrutura geral das respostas (conceitual)

```json
{
  "message": "Texto informativo",
  "data": {}
}
```

> O campo `data` representa genericamente o recurso retornado.  
> Na prática, a API retorna `client`, `purchase` ou `payment`.  
> Ou ainda seus plurais `clients`, `purchases` ou `payments`.

Respostas de erros seguem o padrão:
```json
{
  // FastAPI + Pydantic (HTTP 422)
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
```
ou
```json
{
  // Erros de validação internos (HTTP 400-500)
  "detail": "Texto informativo"
}
```

---

# 8. Observações finais
- Rotas estáveis
- Services centralizam regras de negócio

---

## 🔗 Documentos Relacionados

- 📘 **[Escopo e visão do projeto](./README.md)** → `README.md`

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
