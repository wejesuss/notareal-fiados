import { watch, type Ref } from "vue";
import type { ClientSummary } from "src/models";
import { getClientSummary } from "src/services";
import { useResource } from "../core/useResource";

export function useClientSummary(clientId: Ref<number>) {
  const resource = useResource<ClientSummary>();

  async function load() {
    await resource.load(getClientSummary, clientId.value);
  }

  watch(clientId, load, { immediate: true });

  return {
    loading: resource.loading,
    error: resource.error,
    summary: resource.data,
    reload: load,
  };
}
