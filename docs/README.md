# NotaReal Fiados – Visão Geral, Arquitetura e Objetivos

## 🧩 Visão Geral

O **NotaReal Fiados** é um sistema local (para PC, web e dispositivos móveis via PWA) projetado para **gerenciar compras fiadas** em pequenas lojas, mercearias e comércios rurais. O objetivo é **substituir o registro manual em papel** por uma ferramenta **simples, segura e confiável**, mantendo a possibilidade de **impressão e assinatura física** como validação.

O sistema roda em um **servidor local FastAPI** (instalado no computador principal da loja), podendo ser empacotado para desktop via **Tauri**, com interface feita em **Quasar Framework (Vue)**, e acessado no celular via **PWA** – sem necessidade de Internet.

O banco é **SQLite**, leve e portátil, ideal para operação em dispositivos modestos, com opção de **backup automático ou manual** para evitar perdas.

---

## 🎯 Objetivo Principal

> Facilitar o registro, controle e quitação de compras fiadas, permitindo comprovação confiável tanto para o cliente quanto para o vendedor, eliminando a necessidade de anotações manuais em papel, exceto nas etapas de assinatura e impressão de comprovantes.

---

## ⚙️ Funcionalidades-Chave

| Categoria | Descrição |
|----------|-----------|
| **Gerenciamento de Clientes** | Cadastro simples, apelido único, telefone/email e listagem de compras. |
| **Controle de Fiados** | Criar compras fiadas, lançar pagamentos, atualizar saldos e acompanhar status. |
| **Cálculo automático** | Total pago, total devido e status da compra atualizados automaticamente. |
| **Pagamentos com controle de ativação** | Pagamentos podem ser desativados/reativados com regras rígidas (soft delete). |
| **Impressão de comprovantes** *(planejado)* | PDF gerado via servidor local; permite assinatura física. |
| **Histórico completo** | Registra datas, valores e alterações. |
| **Operação 100% offline** | Tudo funciona sem internet. |
| **Backup local** | Exportação manual ou automática do banco de dados. |
| **Facilidade de Uso** | Campos autopreenchíveis e listas prontas de produtos frequentes da loja para a descrição da compra. |

> O backend foi projetado com validações redundantes e coerentes, garantindo consistência mesmo em chamadas internas ou não vindas da API.

---

## 🏗️ Arquitetura Técnica

### 🔧 Back-end (Servidor)
- **FastAPI (Python 3)** como framework web
- Banco **SQLite** sem uso de ORM, para máxima leveza e portabilidade
- Serviços com regras de negócio (purchase, payment, client)
- Schemas Pydantic para validação e resposta
- Recalculo automático de totais de compra via serviço de purchases
- Identificadores únicos para clientes, compras e pagamentos
- Acesso por outros dispositivos via rede local.
- Suporte para exportação e restauração de backups.

### 🎨 Front-end (Web + PWA)
- **Quasar Framework (Vue)**
- Build web + PWA
- Interface moderna, simples e responsiva
- Pode rodar em PCs antigos, celulares e tablets via navegador

### 🖥️ Desktop
- **Tauri**
- Front-end Quasar empacotado como aplicativo leve
- Comunicação local com servidor FastAPI

### 📱 Mobile
- **PWA** (instalável, offline, sem necessidade de compilar para iOS/Android)

---

## 🧠 Escopo Técnico Atual

### Backend – Implementado
- CRUD de Clientes
- CRUD de Compras
- CRUD de Pagamentos
- Soft delete com ativação/restauração
- Validações fortes nas regras de negócio
- Recalculo automático de totais
- Respostas tipadas via response_model
- Logging básico de erros no backend
- Estrutura limpa: router → service → repository → DB

### Backend – Em Progresso / Próximos passos
- Melhorias nos docs internos
- Helper para detectar mudanças relevantes em updates
- Funções auxiliares para reduzir repetição em validações

---

## 📘 Estrutura dos Arquivos de Documentação (em `/docs`)

Esses são os arquivos de documentação

1. `README.md` ← **este arquivo**
2. `architecture_backend.md`
3. `database_design.md`
4. `routes_documentation.md`

[Ao final](#-documentos-relacionados) você verá links de navegação para cada um deles.

---

## 📦 Limites da Primeira Versão (MVP)

- Sem login/autenticação no momento.
- Apenas uso local (sem cloud).
- Relatórios simples.
- Configurações básicas.
- Impressão local apenas (ainda dependente da atenção do vendedor).
- Não há acesso do cliente (somente do comerciante). A aplicação não tem o objetivo de oferecer portal do cliente.

---

## 🧰 Extensões Planejadas (Futuro)

- Login com PIN/senha
- Relatórios gráficos
- Painel de estatísticas
- Sincronização via nuvem opcional
- Impressão de notas e recibos em PDF ou por impressora conectada.
- Assinatura digital
- Modo multiusuário (papéis/permissões)

---

## 🔧 Itens Técnicos Importantes a Implementar

- [X] Aplicar `response_model` em todas as rotas
- [X] Remover retornos diretos com `__dict__`
- [X] Documentação manual com exemplos de uso no **`/docs`**
- [ ] Consolidar helpers para validações internas
- [ ] Centralizar regras duplicadas nos services
- [ ] Criar script CLI para backup/restore

---

## 🚀 Próximos Passos Recomendados

1. **Finalizar documentação `/docs`** (agora revisada).
2. Criar páginas de **GUI** no Quasar (clientes, compras, pagamentos).
3. Criar layout base (header, sidebar, tabelas simples).
4. Implementar testes básicos nos endpoints principais.
5. Criar fluxo completo visual de:
   - criar cliente
   - criar compra
   - adicionar pagamento
   - ver totais recalculados
6. Integrar front + backend.
7. Criar build desktop com Tauri.
8. Implementar endpoints para impressão.
9. Testar funções de backup e impressão.

---

## Mapa de Telas e Fluxo (MVP)

Veja os arquivos **[Fluxo de telas e navegação](./backend/screen_flow.md)** e **[Wireframes iniciais da interface](./backend/wireframe.md)** para mais informações.  

> Este é um modelo planejado para o futuro.

---

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

## 🔗 Documentos Relacionados

- 📘 **[Escopo e visão do projeto](./README.md)** → `README.md`

  Descreve o propósito, público-alvo e principais funcionalidades do sistema Nota Real Fiados.
- 🗃️ **[Modelo de dados e fluxo de informações](./backend/database_design.md)** → `database_design.md`

  Mostra como clientes, notas e pagamentos se relacionam no banco de dados e no fluxo do app.
- 🧱 **[Exemplo de arquitetura limpa](./backend/architecture_backend.md)** → `architecture_backend.md`

  Explica a organização de pastas e o desacoplamento entre API, serviços e repositórios, com código exemplo.
- 📚 **[Documentação das rotas](./backend/routes_documentation.md)** → `routes_documentation.md`
  
  Demonstra como funcionam as rotas da API do sistema, com exemplos reais de uso.

- 🧭 **[Fluxo de telas e navegação](./backend/screen_flow.md)** → `screen_flow.md`

  Descreve o fluxo geral de telas do sistema, decisões de navegação, estratégias de busca (ID, nota, recibo),
  e considerações sobre cache, sincronização de dados e experiência multi-dispositivo.

- 🖼️ **[Wireframes iniciais da interface](./backend/wireframe.md)** → `wireframe.md`

  Apresenta wireframes textuais das principais telas (dashboard, clientes, compras e pagamentos),
  incluindo modais de criação/edição, ações de ativação/desativação e organização visual dos dados.

---

> **Nota:** O NotaReal Fiados tem como prioridade a segurança e a simplicidade operacional, é feito para funcionar em qualquer loja pequena sem internet, oferecendo uma solução moderna para o tradicional “caderninho de fiado”.
