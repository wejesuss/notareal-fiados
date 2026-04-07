import { computed, type Ref, watch } from "vue";
import type { PurchaseListResponse } from "src/models";
import { getClientPurchases } from "src/services/purchase";
import { useResource } from "../core/useResource";

export function useClientRecentPurchases(clientId: Ref<number>) {
  const resource = useResource<PurchaseListResponse>();
  const recentPurchases = computed(() => resource.data.value?.purchases ?? []);

  async function load() {
    if (!Number.isInteger(clientId.value) || clientId.value <= 0) {
      resource.setError("Identificador do cliente inválido!", "validation");
      return;
    }

    await resource.load(getClientPurchases, {
      clientId: clientId.value,
      params: {
        limit: 3,
        isActive: true,
      },
    });
  }

  watch(clientId, load, { immediate: true });

  return {
    loading: resource.loading,
    error: resource.error,
    recentPurchases,
    reload: load,
  };
}
