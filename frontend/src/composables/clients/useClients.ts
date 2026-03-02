import { ref, watch } from "vue";
import type { Client } from "src/models";
import { getClients } from "src/services/client";
import { type ListQueryReturnState } from "src/composables";

export function useClients(queryState: ListQueryReturnState) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const clients = ref<Client[]>([]);
  const totalPages = ref(1);

  let requestId = 0;

  async function fetchClients() {
    const currentId = ++requestId;

    loading.value = true;
    error.value = null;

    try {
      // Get updated query state
      const { page, rowsPerPage, onlyActive } = queryState.getSnapshot() as {
        page: number;
        rowsPerPage: number;
        onlyActive: boolean;
      };

      const offset = (page - 1) * rowsPerPage;
      const response = await getClients({
        limit: rowsPerPage,
        offset,
        onlyActive: onlyActive,
      });

      // Ignore outdated response
      if (currentId !== requestId) {
        return;
      }

      totalPages.value = response.total;
      if (page && page > response.total && response.total > 0) {
        await queryState.setField("page", response.total);
        loading.value = false;
        return fetchClients();
      }

      clients.value = response.clients;
    } catch (e) {
      console.error(e);
      error.value = e as Error;
      clients.value = [];
      totalPages.value = 1;
    } finally {
      if (currentId === requestId) {
        loading.value = false;
      }
    }
  }

  watch(
    [
      queryState.state.page,
      queryState.state.rowsPerPage,
      queryState.state.onlyActive,
    ],
    async () => {
      await fetchClients();
    },
    { immediate: true }
  );

  return {
    loading,
    error,
    totalPages,
    clients,
    reload: fetchClients,
  };
}
