import { ref, watch, type Ref } from "vue";
import type { ClientSummary } from "src/models";
import { getClientSummary } from "src/services";

export function useClientSummary(clientId: Ref<number>) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const summary = ref<ClientSummary | null>(null);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      summary.value = await getClientSummary(clientId.value);
    } catch (e) {
      console.error(e);
      error.value = e as Error;
      summary.value = null;
    } finally {
      loading.value = false;
    }
  }

  watch(clientId, load, { immediate: true });

  return { loading, error, summary, reload: load };
}
