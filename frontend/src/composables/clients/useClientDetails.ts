import type { Ref } from "vue";
import { watch } from "vue";
import type { Client } from "src/models";
import { getClientById } from "src/services";
import { useResource } from "../core/useResource";

export function useClientDetails(clientId: Ref<number>) {
  const resource = useResource<Client>();

  async function load() {
    if (!Number.isInteger(clientId.value) || clientId.value <= 0) {
      return;
    }

    await resource.load(getClientById, clientId.value);
  }

  watch(clientId, load, { immediate: true });

  return {
    loading: resource.loading,
    error: resource.error,
    client: resource.data,
    reload: load,
  };
}
