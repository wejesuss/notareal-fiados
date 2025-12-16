# Fluxo de Telas – NotaReal Fiados (MVP)

## 1. Tela Inicial / Dashboard

**Objetivo:** ponto de entrada rápido

Elementos:
- Atalho: **Clientes**
- Atalho: **Compras**
- Atalho: **Pagamentos**
- Indicadores simples (opcional no início):
  - Total em aberto
  - Total recebido

Navegação:
- → Tela de Clientes
- → Tela de Compras
- → Tela de Pagamentos (geral)

---

## 2. Tela de Clientes

**Objetivo:** gerenciar clientes

Lista:
- Nome
- Apelido
- Status (ativo/inativo)
- Ações:
  - Ver compras
  - Editar
  - Desativar

Ações principais:
- ➕ Criar cliente

Navegação:
- → Tela de Compras do Cliente
- → Tela de Criar/Editar Cliente

---

## 3. Tela de Criar / Editar Cliente

**Objetivo:** cadastro simples

Campos:
- Nome
- Apelido
- Telefone
- Email

Ações:
- Salvar
- Cancelar

Retorno:
- → Tela de Clientes

---

## 4. Tela de Compras do Cliente

**Objetivo:** visão financeira por cliente

Lista de compras:
- Descrição
- Valor total
- Valor pago
- Status (pendente / parcial / quitada)
- Ativo/Inativo

Filtros:
- Somente ativas (default)
- Todas (ativas + inativas)

Ações:
- ➕ Nova compra
- Ver detalhes da compra

Navegação:
- → Tela de Detalhe da Compra

---

## 5. Tela de Compras (Geral)

**Objetivo:** visão global das compras

Lista:
- Cliente
- Descrição
- Status
- Valor total / pago
- Ativa/Inativa

Filtros:
- Todas
- Ativas
- Ativas não quitadas (pendentes + parciais)

Ações:
- Ver detalhe da compra

Navegação:
- → Tela de Detalhe da Compra

---

## 6. Tela de Detalhe da Compra

**Objetivo:** centralizar tudo da compra

Bloco superior:
- Cliente
- Descrição
- Valor total
- Valor pago
- Status
- Nota (note_number)

Ações da compra:
- Editar compra
- Desativar / Restaurar compra

Seção: **Pagamentos da Compra**
- Lista de pagamentos:
  - Valor
  - Método
  - Data
  - Ativo/Inativo

Ações:
- ➕ Novo pagamento
- Editar pagamento
- Desativar / Restaurar pagamento

---

## 7. Tela de Criar / Editar Compra

**Objetivo:** cadastro e ajustes da compra

Campos:
- Descrição
- Valor total
- Nota (opcional)

Opcional (na criação):
- Pagamento inicial

Ações:
- Salvar
- Cancelar

Retorno:
- → Tela de Compras do Cliente ou Detalhe da Compra

---

## 8. Tela de Pagamentos (Geral)

**Objetivo:** visão financeira geral

Lista:
- Cliente
- Compra
- Valor
- Método
- Data
- Ativo/Inativo

Fonte de dados:
- `/purchases/0/payments`

Ações:
- Ver detalhe da compra
- Editar pagamento

---

## 9. Tela de Criar / Editar Pagamento

**Objetivo:** ajustes pontuais

Campos:
- Valor
- Método
- Data
- Descrição
- Recibo (receipt_number)

Ações:
- Salvar
- Cancelar

Retorno:
- → Tela de Detalhe da Compra

---

## 10. Comportamento de Pesquisa

### Compras
- Local: tela de **Lista de Compras**
- Campo único:
  - Buscar por **ID** ou **Número da Nota**
- Comportamento:
  1. Tenta buscar por ID
  2. Se não encontrado, tenta buscar por `note_number`
  3. Se não encontrar, exibe mensagem clara

### Pagamentos (futuro)
- Local: tela de **Pagamentos**
- Campo único:
  - Buscar por **ID** ou **Número do Recibo**

Busca sempre contextual (por recurso), não global.

---

## 11. Visualização de Compras e Pagamentos (Scroll)

- Scroll **unificado da página**
- **Nunca** usar scroll dentro de scroll

### Tela de Detalhe da Compra
Ordem vertical:
1. Resumo da compra (totais, status)
2. Lista de pagamentos relacionados
3. Ações (novo pagamento, editar, desativar)

Se a lista crescer:
- Paginação
- Lazy loading
- Botão “ver mais”

---

## 12. Criação e Edição (Telas vs Modal)

Regra:
- **Criar** → Modal (Dialog)
- **Editar** → Modal (Dialog)
- **Visualizar** → Tela dedicada

Benefícios:
- Menos telas
- Fluxo mais rápido
- Melhor UX em mobile
- Menos navegação

Componentes Quasar:
- `QDialog`
- `QForm`

---

## 13. Estratégia de Dados e Requests

### Princípios
- Dados financeiros
- Multi-dispositivo
- Evitar cache permanente

### Stores (Pinia)
Stores separadas:
- clients
- purchases
- payments

Cada store mantém:
- lista de itens
- timestamp do último fetch

### Fetch Strategy
- Listas:
  - Buscar se store vazia ou cache expirado (30–60s)
- Detalhes:
  - Sempre buscar ao entrar na tela
- Mutação (create/update/delete):
  - Atualiza store local ou invalida cache relacionado

### Sincronia
- Refetch ao entrar na tela
- Pull-to-refresh (mobile)
- Após ações críticas

Sem WebSocket por enquanto.

---

## 14. Observações Importantes

- Sem cache eterno
- Sem LocalStorage para dados financeiros
- Priorizar consistência sobre performance extrema
- Pagamento sempre pertence a uma compra
- Soft delete deve refletir visualmente (cinza / badge)
- Estrutura única para Web, Desktop (Tauri) e PWA

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
