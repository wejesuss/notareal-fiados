import { computed, ref, watch } from "vue";
import type { ClientListParams, ClientListResponse } from "src/models";
import { getClients } from "src/services/client";
import { type useClientsQueryState, useResource } from "src/composables";

type ClientsQuerySchema = ReturnType<typeof useClientsQueryState>["schema"];

export function useClients(queryState: ClientsQuerySchema) {
  const resource = useResource<ClientListResponse>();
  const totalPages = ref(1);
  const clients = computed(() => resource.data.value?.clients ?? []);

  async function fetchClients() {
    // Get updated query state
    const { page, rowsPerPage, onlyActive } = queryState.getSnapshot();
    const offset = (page - 1) * rowsPerPage;
    const params: ClientListParams = {
      limit: rowsPerPage,
      offset,
      onlyActive: onlyActive,
    };

    const response = await resource.load(getClients, params);

    // outdated response was ignored (race condition)
    if (!response) {
      return;
    }

    totalPages.value = Math.max(1, Math.ceil(response.total / rowsPerPage));
    if (page > totalPages.value) {
      await queryState.setField("page", totalPages.value);
      return;
    }
  }

  watch(
    [
      queryState.state.page,
      queryState.state.rowsPerPage,
      queryState.state.onlyActive,
    ],
    fetchClients,
    { immediate: true }
  );

  return {
    loading: resource.loading,
    error: resource.error,
    totalPages,
    clients,
    reload: fetchClients,
  };
}
