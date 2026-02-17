import { computed, type Ref, ref, watch } from "vue";
import type { Client } from "src/models";
import { getClients } from "src/services/client";

export function useClients(rowsPerPage: Ref<number>, onlyActive: Ref<boolean>) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const clients = ref<Client[]>([]);
  const page = ref(1);
  const total = ref(0);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / rowsPerPage.value))
  );

  async function fetchClients() {
    loading.value = true;
    error.value = null;

    try {
      const offset = (page.value - 1) * rowsPerPage.value;
      const response = await getClients({
        limit: rowsPerPage.value,
        offset,
        onlyActive: onlyActive.value,
      });

      clients.value = response.clients;
      total.value = response.total;
    } catch (e) {
      console.error(e);
      error.value = e as Error;
      clients.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  watch(page, fetchClients, { immediate: true });
  watch([rowsPerPage, onlyActive], async () => {
    if (page.value !== 1) {
      page.value = 1;
    } else {
      await fetchClients();
    }
  });

  return {
    loading,
    error,
    page,
    totalPages,
    clients,
    reload: fetchClients,
  };
}
