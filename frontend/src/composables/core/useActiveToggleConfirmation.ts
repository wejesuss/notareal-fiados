import { ref, watch, type Ref } from "vue";
import { type QDialogOptions, useQuasar } from "quasar";

interface ActiveResource {
  isActive: boolean;
}

interface DialogConfig {
  title: string;
  message: string;
  checkboxLabel: string;
}

interface NotifyConfig {
  disabledMessage: string;
  enabledMessage: string;
  errorMessage: string;
}

export function useActiveToggleConfirmation<T extends ActiveResource>(
  resource: Ref<T | null>,
  dialogConfig: DialogConfig,
  notifyConfig: NotifyConfig,
  submit: (nextValue: boolean) => Promise<void>
) {
  const submitting = ref(false);
  const isActive = ref(false);
  const $q = useQuasar();

  async function confirmDisable(): Promise<boolean> {
    const dialog: QDialogOptions = {
      title: dialogConfig.title,
      message: dialogConfig.message,
      options: {
        model: [""],
        type: "checkbox",
        isValid: (model) => model.includes("opt1"),
        items: [{ label: dialogConfig.checkboxLabel, value: "opt1" }],
      },
      cancel: "Cancelar",
      ok: "Desativar",
      noBackdropDismiss: true,
    };

    return new Promise((resolve) => {
      $q.dialog(dialog)
        .onCancel(() => resolve(false))
        .onOk(() => resolve(true));
    });
  }

  async function submitDialog(nextValue: boolean) {
    if (submitting.value || !resource.value) return;
    const previousIsActive = isActive.value;

    if (nextValue === false) {
      const confirmed = await confirmDisable();
      if (!confirmed) return;
    }

    submitting.value = true;
    isActive.value = nextValue;
    try {
      await submit(nextValue);

      $q.notify({
        type: "positive",
        message: !nextValue
          ? notifyConfig.disabledMessage
          : notifyConfig.enabledMessage,
      });
    } catch (e) {
      console.error(e);
      isActive.value = previousIsActive;

      $q.notify({
        type: "negative",
        message: notifyConfig.errorMessage,
      });
    } finally {
      submitting.value = false;
    }
  }

  watch(
    resource,
    (newValue) => {
      if (!newValue) return;

      submitting.value = false;
      isActive.value = newValue.isActive;
    },
    { immediate: true }
  );

  return { submitting, isActive, submitDialog };
}
