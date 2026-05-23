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
