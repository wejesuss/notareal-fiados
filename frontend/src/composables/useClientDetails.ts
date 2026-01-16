import type { Ref } from "vue";
import { ref, watch } from "vue";
import type { Client } from "src/models";
import { getClientById } from "src/services";

export function useClientDetails(clientId: Ref<number>) {
  const loading = ref(true);
  const error = ref<Error | null>(null);
  const client = ref<Client | null>(null);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      client.value = await getClientById(clientId.value);
    } catch (e) {
      console.error(e);
      error.value = e as Error;
      client.value = null;
    } finally {
      loading.value = false;
    }
  }

  watch(clientId, load, { immediate: true });

  return { loading, error, client, reload: load };
}
