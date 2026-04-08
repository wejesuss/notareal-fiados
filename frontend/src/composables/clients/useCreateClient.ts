import { type ClientPayload } from "src/components/types";
import { createClient } from "src/services";
import { ref } from "vue";

export function useCreateClient() {
  const submitting = ref(false);
  const error = ref<Error | null>(null);

  async function create(payload: ClientPayload) {
    if (submitting.value) return;

    submitting.value = true;
    error.value = null;
    try {
      const { client } = await createClient(payload);

      return client;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      }
    } finally {
      submitting.value = false;
    }
  }

  return { submitting, error, create };
}
