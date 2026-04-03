import { UIError, type UIErrorType } from "src/types/errors";
import { mapAPIError } from "src/utils/mappers/errors";
import { ref } from "vue";

type GetLoaderParams<L, T> = L extends (params: infer P) => Promise<T>
  ? P
  : unknown;

export function useResource<T>(initial: T | null = null) {
  const loading = ref(false);
  const error = ref<UIError | null>(null);
  const data = ref<T | null>(initial);

  let requestId = 0;

  async function load<L extends CallableFunction>(
    params: GetLoaderParams<L, T>,
    loader: L
  ): Promise<T | undefined> {
    const currentId = ++requestId;

    loading.value = true;
    error.value = null;
    try {
      const result = await loader(params);

      // Ignore outdated result
      if (currentId !== requestId) return;

      data.value = result;
      return result;
    } catch (e) {
      // prevent wrong error catching for outdated result
      if (currentId !== requestId) return;

      error.value = mapAPIError(e);
      data.value = initial;
    } finally {
      if (currentId === requestId) {
        loading.value = false;
      }
    }
  }

  return {
    loading,
    error,
    data,
    load,
  };
}
