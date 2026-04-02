import { ref } from "vue";

export function useResource<T, P>(initial: T | null = null) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<T | null>(initial);

  let requestId = 0;

  async function load(
    params: P,
    loader: (params?: P) => Promise<T>
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

      error.value = e as Error;
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
