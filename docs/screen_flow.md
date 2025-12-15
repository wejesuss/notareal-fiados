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

## Observações Importantes

- Pagamento sempre pertence a uma compra
- Soft delete deve refletir visualmente (cinza / badge)
- Estrutura única para Web, Desktop (Tauri) e PWA
