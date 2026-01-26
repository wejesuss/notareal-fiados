import { type Ref, ref, watch } from "vue";
import type { Purchase } from "src/models";
import { getClientPurchases } from "src/services/purchase";

export function useClientPurchases(clientId: Ref<number>) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const purchases = ref<Purchase[]>([]);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      purchases.value = await getClientPurchases(clientId.value);
    } catch (e) {
      error.value = e as Error;
      purchases.value = [];
    } finally {
      loading.value = false;
    }
  }

  watch(clientId, load, { immediate: true });

  return { loading, error, purchases, reload: load };
}
