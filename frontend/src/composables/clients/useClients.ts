import { computed, type Ref, ref, watch } from "vue";
import type { Client } from "src/models";
import { getClients } from "src/services/client";

export function useClients(
  page: Ref<number>,
  rowsPerPage: Ref<number>,
  onlyActive: Ref<boolean>
) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const clients = ref<Client[]>([]);
  const total = ref(0);

  let requestId = 0;

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / rowsPerPage.value))
  );

  async function fetchClients() {
    const currentId = ++requestId;

    loading.value = true;
    error.value = null;

    try {
      const offset = (page.value - 1) * rowsPerPage.value;
      const response = await getClients({
        limit: rowsPerPage.value,
        offset,
        onlyActive: onlyActive.value,
      });

      // Ignore outdated response
      if (currentId !== requestId) {
        return;
      }

      clients.value = response.clients;
      total.value = response.total;
    } catch (e) {
      console.error(e);
      error.value = e as Error;
      clients.value = [];
      total.value = 0;
    } finally {
      if (currentId === requestId) {
        loading.value = false;
      }
    }
  }

  watch([page, rowsPerPage, onlyActive], fetchClients, { immediate: true });
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
    totalPages,
    clients,
    total,
    reload: fetchClients,
  };
}
