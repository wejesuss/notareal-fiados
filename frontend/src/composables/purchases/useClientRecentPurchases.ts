import { type Ref, ref, watch } from "vue";
import type { Purchase } from "src/models";
import { getClientRecentPurchases } from "src/services/purchase";

export function useClientRecentPurchases(clientId: Ref<number>) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const recentPurchases = ref<Purchase[]>([]);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const response = await getClientRecentPurchases(clientId.value);
      recentPurchases.value = response.purchases;
    } catch (e) {
      error.value = e as Error;
      recentPurchases.value = [];
    } finally {
      loading.value = false;
    }
  }

  watch(clientId, load, { immediate: true });

  return { loading, error, recentPurchases, reload: load };
}
