import { type Ref, ref, watch } from "vue";
import type { Purchase } from "src/models";
import { getClientRecentPurchases } from "src/services/purchase";

export function useClientRecentPurchases(
  clientId: Ref<number>,
  limit: number = 3
) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const recentPurchases = ref<Purchase[]>([]);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      recentPurchases.value = await getClientRecentPurchases(
        clientId.value,
        limit
      );
    } catch (e) {
      console.error(e);
      error.value = e as Error;
      recentPurchases.value = [];
    } finally {
      loading.value = false;
    }
  }

  watch(clientId, load, { immediate: true });

  return { loading, error, recentPurchases, reload: load };
}
