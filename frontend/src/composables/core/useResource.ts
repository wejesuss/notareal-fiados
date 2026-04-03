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

  /**
   * Sets a new UIError and resets the current data state.
   *
   * This should be used when you need to:
   * - Validate something **before** a fetch request
   * - Force the composable into an error state
   * - Keep `error` and `data` in sync
   *
   * Behavior:
   * - Accepts either a string or an Error-like object
   * - Normalizes the input into a proper Error instance
   * - Updates `error` with a UIError
   * - Resets `data` back to its initial value
   *
   * @param err The error to set (string message or Error-like object)
   * @param type The UI error type (used for display/handling)
   */
  function setError(err: string | Error, type: UIErrorType): void {
    const normalizedError = typeof err === "string" ? new Error(err) : err;

    error.value = new UIError(normalizedError.message, type, normalizedError);
    data.value = initial;
  }

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
    setError,
    load,
  };
}
