# Documentação Frontend

## Ainda em desenvolvimento

Esta documentação é um esboço, verifique os arquivos de docs em [`/docs/backend`](../backend/), lá você encontrará arquivos de tela e fluxo de dados, incluindo wireframes de telas a serem desenvolvidas no frontend (`Quasar`).


## Lógica de Erros frontend

| State                                                | Meaning             |
| ---------------------------------------------------- | ------------------- |
| `loading = true`                                     | request in progress |
| `loading = false && data !== null`                   | success             |
| `loading = false && data === null && error !== null` | failure             |
| `loading = false && data === null && error === null` | empty               |
