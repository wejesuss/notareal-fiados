import type { DialogConfig, NotifyConfig } from "src/types/dialog";

export const dialogConfig: DialogConfig = {
  title: "Tem certeza que deseja desativar este cliente?",
  message: `Este cliente não poderá ser usado para novas operações e todas as suas compras e pagamentos serão desativadas.`,
  checkboxLabel: "Entendo e desejo desativar o cliente",
};
export const notifyConfig: NotifyConfig = {
  disabledMessage: "Cliente desativado com sucesso.",
  enabledMessage: "Cliente ativado. Compras e pagamentos não serão ativadas.",
  errorMessage: "Erro ao atualizar status do cliente.",
};
