import { computed, ref, watch } from "vue";
import type { Client } from "src/models";
import { getClients } from "src/services/client";
import { type ListQueryReturnState } from "src/composables";

export function useClients(schema: ListQueryReturnState) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const clients = ref<Client[]>([]);
  const total = ref(0);

  let requestId = 0;
  let page = Number(schema.state.page?.value);
  let rowsPerPage = Number(schema.state.rowsPerPage?.value);
  let onlyActive = schema.state.onlyActive?.value === "true";

  const totalPages = computed(() => {
    if (!schema.state.rowsPerPage?.value) return 1;
    return Math.max(1, Math.ceil(total.value / rowsPerPage));
  });

  async function fetchClients() {
    const currentId = ++requestId;

    loading.value = true;
    error.value = null;

    try {
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

  watch(
    () => schema.getSnapshot(),
    async () => {
      page = Number(schema.state.page?.value);
      rowsPerPage = Number(schema.state.rowsPerPage?.value);
      onlyActive = schema.state.onlyActive?.value === "true";
      await fetchClients();
    },
    { immediate: true }
  );

  return {
    loading,
    error,
    totalPages,
    clients,
    total,
    reload: fetchClients,
  };
}
