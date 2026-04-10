import { ref } from "vue";
import type { ClientUpdate } from "src/models";
import type { ClientPayload } from "src/components/types";
import { updateClient } from "src/services";
import { isShallowEqual } from "src/utils/checkers/isShalowEqual";
import { mapAPIError } from "src/utils/mappers/errors";

export function useUpdateClient() {
  const submitting = ref(false);

  async function update(
    id: number,
    current: {
      data: ClientPayload;
      isActive: boolean;
    },
    next: {
      data: ClientPayload;
      isActive: boolean;
    }
  ) {
    if (!Number.isInteger(id) || id <= 0) return;
    if (submitting.value) return;

    try {
      submitting.value = true;

      const isActiveChanged = current.isActive !== next.isActive;
      const isFormDirty = !isShallowEqual(current.data, next.data);
      const hasChanges = isActiveChanged || isFormDirty;

      if (!hasChanges) {
        return {
          data: null,
          error: null,
          skipped: true,
        };
      }

      const payload: ClientUpdate = {
        ...next.data,
        ...(isActiveChanged && {
          isActive: next.isActive,
        }),
      };

      const response = await updateClient(id, payload);

      return {
        data: response.client,
        error: null,
        skipped: false,
      };
    } catch (err) {
      const error = mapAPIError(err);

      return {
        data: null,
        error: error,
        skipped: false,
      };
    } finally {
      submitting.value = false;
    }
  }

  return {
    submitting,
    update,
  };
}
