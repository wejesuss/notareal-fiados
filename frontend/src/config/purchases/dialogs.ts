import type { DialogConfig, NotifyConfig } from "src/types/dialog";

export const dialogConfig: DialogConfig = {
  title: "Tem certeza que deseja desativar esta compra?",
  message:
    "Esta compra não poderá receber novas operações e todos os pagamentos desta compra serão desativados.",
  checkboxLabel: "Entendo e desejo desativar a compra",
};
export const notifyConfig: NotifyConfig = {
  disabledMessage: "Compra desativada com sucesso.",
  enabledMessage: "Compra ativada. Pagamentos não serão ativados.",
  errorMessage: "Erro ao atualizar status da compra.",
};
