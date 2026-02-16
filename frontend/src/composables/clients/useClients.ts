import { computed, onMounted, ref, watch } from "vue";
import type { Client } from "src/models";
import { getClients } from "src/services/client";

export function useClients(onlyActive: boolean, rowsPerPage: number = 10) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const clients = ref<Client[]>([]);
  const page = ref(1);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(clients.value.length / rowsPerPage))
  );
  const paginatedClients = computed(() => {
    const start = (page.value - 1) * rowsPerPage;
    return clients.value.slice(start, start + rowsPerPage);
  });

  async function fetchClients() {
    loading.value = true;
    error.value = null;
    try {
      clients.value = await getClients({ onlyActive });
    } catch (e) {
      console.error(e);
      error.value = e as Error;
      clients.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(fetchClients);
  watch(clients, () => (page.value = 1));

  return {
    loading,
    error,
    page,
    totalPages,
    clients,
    paginatedClients,
    reload: fetchClients,
  };
}
