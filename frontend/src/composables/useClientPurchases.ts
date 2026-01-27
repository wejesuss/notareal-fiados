import { computed, type Ref, ref, watch } from "vue";
import type { Purchase } from "src/models";
import { getClientPurchases } from "src/services/purchase";

export function useClientPurchases(
  clientId: Ref<number>,
  rowsPerPage: number = 10
) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const purchases = ref<Purchase[]>([]);
  const page = ref(1);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(purchases.value.length / rowsPerPage))
  );
  const paginatedPurchases = computed(() => {
    const start = (page.value - 1) * rowsPerPage;
    return purchases.value.slice(start, start + rowsPerPage);
  });

  async function load() {
    if (!Number.isInteger(clientId.value) || clientId.value <= 0) {
      purchases.value = [];
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      purchases.value = await getClientPurchases(clientId.value);
    } catch (e) {
      console.error(e);
      error.value = e as Error;
      purchases.value = [];
    } finally {
      loading.value = false;
    }
  }

  watch(clientId, load, { immediate: true });
  watch(purchases, () => (page.value = 1));

  return {
    loading,
    error,
    page,
    totalPages,
    purchases,
    paginatedPurchases,
    reload: load,
  };
}
