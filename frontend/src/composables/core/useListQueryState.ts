import { computed, type ComputedRef } from "vue";
import { useRoute, useRouter } from "vue-router";

type QueryParamType = "number" | "string" | "boolean" | "tri-boolean";
type QueryStateTypes = number | string | boolean | null;

type QueryParamConfig = {
  default: QueryStateTypes;
  type: QueryParamType;
  resetPageOnChange: boolean;
};

type QuerySchema = Record<string, QueryParamConfig>;

export function useListQueryState(schema: QuerySchema) {
  const route = useRoute();
  const router = useRouter();

  if (!schema.page) {
    throw new Error("Missing 'page' field inside 'schema'");
  }

  /**
   *
   * @param value The value to be parsed and normalized
   * @param config Config object to interpret the type of `value` and default value fallback  if `value` is `undefined`
   * @returns The `value` normalized as number | string | boolean | null or type of `value`
   */
  function parseValue(
    value: string | null | undefined,
    config: QueryParamConfig
  ): QueryStateTypes {
    if (value === undefined) return config.default;

    switch (config.type) {
      case "number": {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? config.default : parsed;
      }

      case "boolean":
        return value === "true";

      case "tri-boolean":
        if (value === "true") return true;
        if (value === "false") return false;
        return null;

      default:
        return value;
    }
  }

  /**
   * @constant `state` - The property where query state is preserved and computed
   */
  const state = Object.keys(schema).reduce(
    (acc, key) => {
      const config = schema[key];
      if (!config) {
        throw new Error(`Objeto de configuração não possui essa chave: ${key}`);
      }

      acc[key] = computed(() => {
        const raw = route.query[key];
        if (Array.isArray(raw)) {
          return parseValue(raw[0], config);
        }

        return parseValue(raw, config);
      });

      return acc;
    },
    {} as Record<string, ComputedRef<QueryStateTypes>>
  );

  function serializeValue(value: QueryStateTypes, config: QueryParamConfig) {
    if (value === null || value === config.default || value === undefined) {
      return undefined;
    }

    return String(value);
  }

  /**
   *
   * @param key key name from schema/query to update
   * @param value The new value you want to update route query
   *
   * If `value` is undefined|null *key/value* pair is removed from route
   */
  async function setField(key: string, value: QueryStateTypes) {
    const newQuery = { ...route.query };
    const config = schema[key];

    if (!config) {
      throw new Error(`Objeto de configuração não possui essa chave: ${key}`);
    }

    const serialized = serializeValue(value, config);
    if (serialized === undefined) {
      delete newQuery[key];
    } else {
      newQuery[key] = serialized;
    }

    if (config.resetPageOnChange && key !== "page") {
      delete newQuery["page"];
    }

    return await router.replace({ query: newQuery });
  }

  function getSnapshot() {
    const snapshot: Record<string, unknown> = {};

    for (const key in state) {
      snapshot[key] = state[key]?.value;
    }

    return snapshot;
  }

  return {
    state,
    setField,
    getSnapshot,
  };
}
