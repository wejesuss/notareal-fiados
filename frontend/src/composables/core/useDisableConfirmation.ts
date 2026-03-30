import { type QDialogOptions, useQuasar } from "quasar";
import type { DialogConfig } from "src/types/dialog";

export function useDisableConfirmation() {
  const $q = useQuasar();

  async function confirmDisable(config: DialogConfig): Promise<boolean> {
    const dialog: QDialogOptions = {
      title: config.title,
      message: config.message,
      options: {
        model: [""],
        type: "checkbox",
        isValid: (model) => model.includes("opt1"),
        items: [{ label: config.checkboxLabel, value: "opt1" }],
      },
      cancel: config.cancelLabel ?? "Cancelar",
      ok: config.confirmLabel ?? "Desativar",
      noBackdropDismiss: true,
    };

    return new Promise((resolve) => {
      $q.dialog(dialog)
        .onCancel(() => resolve(false))
        .onOk(() => resolve(true));
    });
  }

  return { confirmDisable };
}
