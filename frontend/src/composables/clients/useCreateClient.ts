import { type ClientPayload } from "src/components/types";
import { createClient } from "src/services";
import { type UIError } from "src/types/errors";
import { mapAPIError } from "src/utils/mappers/errors";
import { ref } from "vue";

export function useCreateClient() {
  const submitting = ref(false);
  const error = ref<UIError | null>(null);

  async function create(payload: ClientPayload) {
    if (submitting.value) return;

    submitting.value = true;
    error.value = null;
    try {
      const { client } = await createClient(payload);

      return client;
    } catch (err) {
      error.value = mapAPIError(err);
    } finally {
      submitting.value = false;
    }
  }

  return { submitting, error, create };
}
