import { computed, watch, type Ref } from "vue";
import { getPurchasePayments } from "src/services";
import type { PaymentListResponse } from "src/models";
import { useResource } from "src/composables";

export function usePurchasePayments(purchaseId: Ref<number>) {
  const resource = useResource<PaymentListResponse>();
  const payments = computed(() => resource.data.value?.payments ?? []);

  async function load() {
    if (!Number.isInteger(purchaseId.value) || purchaseId.value <= 0) {
      resource.setError("Identificador da compra inválido!", "validation");
      return;
    }

    await resource.load(getPurchasePayments, {
      purchaseId: purchaseId.value,
    });
  }

  watch(purchaseId, load, { immediate: true });

  return {
    loading: resource.loading,
    error: resource.error,
    payments,
    reload: load,
  };
}
