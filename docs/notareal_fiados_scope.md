# NotaReal Fiados - Escopo e Objetivos

<br>
> Nome personalizável conforme marca (ex: AgroReal)

## 🧩 Visão Geral

O **NotaReal Fiados** é um sistema local (para PC e dispositivos móveis) projetado para **gerenciar compras fiadas** em pequenas lojas, mercearias e comércios rurais. O objetivo é **substituir o registro manual em papel** por uma ferramenta **simples, segura e confiável**, mantendo a possibilidade de **impressão e assinatura física** como validação.

O sistema funciona **offline**, utilizando um **servidor local** (instalado no computador principal da loja) com possibilidade de **acesso via rede local** por celulares ou outros PCs autorizados. Todos os dados ficam armazenados em um banco **SQLite local**, com opção de **backup automático ou manual** para evitar perdas.

---

## 🎯 Objetivo Principal

> Facilitar o registro, controle e quitação de compras fiadas, permitindo comprovação confiável tanto para o cliente quanto para o vendedor, eliminando a necessidade de anotações manuais em papel, exceto nas etapas de assinatura e impressão de comprovantes.

---

## ⚙️ Funcionalidades-Chave

| Categoria | Descrição |
|------------|------------|
| **Gerenciamento de Clientes** | Cadastro simples com nome, apelido, telefone/email e histórico de compras. Evita duplicidade e confusão de clientes. |
| **Controle de Fiados** | Registrar novas compras, abater valores pagos e visualizar débitos pendentes. |
| **Impressão de Comprovantes** | Gera comprovantes físicos em PDF ou impressora conectada para assinatura manual. |
| **Histórico de Transações** | Armazena todas as movimentações (créditos e débitos) por cliente, com data e hora. |
| **Banco de Dados Local (SQLite)** | Operação 100% offline, sem depender de internet. |
| **Sincronização Local** | Rede local (Wi-Fi/LAN) entre PC e dispositivos para acesso e edição de dados. |
| **Backup Seguro** | Exportação manual ou automática dos dados (arquivo local, e-mail ou drive). |
| **Facilidade de Uso** | Campos autopreenchíveis e listas prontas de produtos frequentes da loja. |

---

## 🧠 Escopo Técnico (Planejado)

| Componente | Tecnologia sugerida | Observações |
|-------------|--------------------|--------------|
| **Servidor Central (PC)** | Python + Flask | Gerencia o banco de dados e comunicação entre dispositivos. |
| **Banco de Dados** | SQLite | Local, leve e portátil, ideal para operação offline. |
| **Interface Desktop** | Python + Toga ou PySide6 | Interface simples e nativa com aparência de aplicativo. |
| **App Mobile** | Kivy/KivyMD | Mesmas funções do desktop, adaptadas para telas menores. |
| **Impressão** | Endpoint Flask ou biblioteca OS | Envia comandos de impressão para o servidor. |
| **Backup** | Exportação automática + envio opcional (Drive ou e-mail) | Evita perda de dados. |

---

## 📢 Limites da Primeira Versão (MVP)

- Sem acesso direto do cliente ao sistema.  
- Assinatura física opcional (ainda dependente da atenção do vendedor).  
- Sem autenticação de usuários por enquanto.  
- Sem sincronização online (apenas backups locais e manuais).  
- Interface simples, sem relatórios financeiros complexos ainda.  

---

## 🧰 Extensões Planejadas (Futuras)

- Autenticação de usuários (PIN ou senha).  
- Geração de relatórios semanais/mensais.  
- Assinatura digital opcional.  
- Sincronização via nuvem.  
- Notificações automáticas sobre débitos pendentes.  
- Interface web simplificada para administração remota.  

---

## 📦 Próximos Passos

1. Definir o design visual e identidade (cores, logo, estilo).
2. Implementar endpoints para impressão.  
3. Desenvolver a interface desktop.
4. Testar funções de backup e impressão.  
5. Planejar e iniciar o desenvolvimento da versão mobile.
6. Reorganizar rotas para coincidir com o modelo de negócios

---

> **Nota:** O NotaReal Fiados tem como prioridade a segurança e a simplicidade operacional, buscando oferecer uma experiência acessível para vendedores de pequeno porte sem exigir conexão constante com a internet.
