import type { Ref } from "vue";
import { ref, watch } from "vue";
import type { Client } from "src/models";
import { getClientById } from "src/services";
import { useResource } from "../core/useResource";

export function useClientDetails(clientId: Ref<number>) {
  const client = ref<Client | null>(null);
  const resource = useResource<Client>();

  async function load() {
    if (!Number.isInteger(clientId.value) || clientId.value <= 0) {
      resource.setError("Identificador do cliente inválido!", "validation");
      client.value = null;
      return;
    }

    const response = await resource.load(getClientById, clientId.value);
    if (!response) return;

    client.value = response;
  }

  watch(clientId, load, { immediate: true });

  return {
    loading: resource.loading,
    error: resource.error,
    client,
    reload: load,
  };
}
