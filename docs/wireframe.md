# Wireframe – Clientes

## Tela: Lista de Clientes
- Barra superior
  - Campo de busca (nome / apelido)
  - Filtro: Ativos | Inativos | Todos
  - Botão: Novo Cliente

- Lista
  - Nome
  - Apelido
  - Status (Ativo / Inativo)
  - Ação: Ver detalhes

## Tela: Detalhe do Cliente
- Informações do cliente
- Status visível (Ativo / Inativo)
- Botões:
  - Editar
  - Desativar / Ativar

## Compras do Cliente
- Lista de compras vinculadas
- Filtro: Ativas / Todas
- Ação: Ver compra

Cliente inativo:
- Tela em modo leitura
- Botão disponível apenas para restaurar

---

# Wireframe – Compras

## Tela: Lista de Compras (Dashboard)
- Barra superior
  - Busca (cliente / nota)
  - Filtro:
    - Todas
    - Apenas ativas
    - Apenas pendentes

- Lista
  - Cliente
  - Descrição
  - Total
  - Pago
  - Status
  - Ação: Ver compra

## Tela: Detalhe da Compra
- Informações principais
  - Cliente
  - Nota
  - Status
  - Totais

- Botões:
  - Editar compra
  - Desativar / Restaurar

## Pagamentos (integrado)
- Lista de pagamentos
- Scroll unificado com a página
- Botão: Novo pagamento

Compra desativada:
- Bloqueia edição
- Permite apenas restauração

---

# Wireframe – Pagamentos

## Contexto
Pagamentos nunca existem isolados.
Sempre pertencem a uma compra.

## Listagem (dentro da compra)
- Lista simples
  - Valor
  - Data
  - Método
  - Status
  - Ações:
    - Editar
    - Desativar / Restaurar

## Criar / Editar Pagamento
- Modal ou Drawer
  - Valor
  - Método
  - Data
  - Descrição
  - Número do recibo

Ao salvar:
- Recalcula totais da compra
- Atualiza status automaticamente

Pagamento desativado:
- Visível
- Não entra nos cálculos