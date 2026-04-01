import type { Ref } from "vue";
import { ref, watch } from "vue";
import type { Purchase } from "src/models";
import { getPurchaseById } from "src/services";

export function usePurchaseDetails(purchaseId: Ref<number>) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const purchase = ref<Purchase | null>(null);

  async function load() {
    if (!Number.isInteger(purchaseId.value) || purchaseId.value <= 0) {
      error.value = new Error("Identificador da compra inválido!");
      purchase.value = null;
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      purchase.value = await getPurchaseById(purchaseId.value);
    } catch (e) {
      error.value = e as Error;
      purchase.value = null;
    } finally {
      loading.value = false;
    }
  }

  watch(purchaseId, load, { immediate: true });

  return { loading, error, purchase, reload: load };
}
