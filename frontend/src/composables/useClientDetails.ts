import type { Ref } from "vue";
import { ref } from "vue";
import type { Client } from "src/models";
import { getClientById } from "src/services";

export function useClientDetails(clientId: Ref<number>) {
  const loading = ref(true);
  const error = ref<Error | null>(null);
  const client = ref<Client | null>(null);
  const isActive = ref(false);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      client.value = await getClientById(clientId.value);
      isActive.value = !!client.value?.isActive;
    } catch (e) {
      console.error(e);
      error.value = e as Error;
      client.value = null;
      isActive.value = false;
    } finally {
      loading.value = false;
    }
  }

  return { loading, error, client, isActive, reload: load };
}
