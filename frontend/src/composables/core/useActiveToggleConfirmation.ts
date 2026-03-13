import { ref, watch, type Ref } from "vue";
import { useQuasar } from "quasar";
import { useDisableConfirmation, type DialogConfig } from "src/composables";

interface ActiveResource {
  isActive: boolean;
}

export interface NotifyConfig {
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

  const { confirmDisable } = useDisableConfirmation();

  async function submitDialog(nextValue: boolean) {
    if (submitting.value || !resource.value) return;
    const previousIsActive = isActive.value;

    if (nextValue === false) {
      const confirmed = await confirmDisable(dialogConfig);
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

      isActive.value = newValue.isActive;
    },
    { immediate: true }
  );

  return { submitting, isActive, submitDialog };
}
