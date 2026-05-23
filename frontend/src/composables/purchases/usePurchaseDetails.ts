import { watch, type Ref } from "vue";
import type { Purchase } from "src/models";
import { getPurchaseById } from "src/services";
import { useResource } from "../core/useResource";

export function usePurchaseDetails(purchaseId: Ref<number>) {
  const resource = useResource<Purchase>();

  async function load() {
    if (!Number.isInteger(purchaseId.value) || purchaseId.value <= 0) {
      return;
    }

    await resource.load(getPurchaseById, purchaseId.value);
  }

  watch(purchaseId, load, { immediate: true });

  return {
    loading: resource.loading,
    error: resource.error,
    purchase: resource.data,
    reload: load,
  };
}
