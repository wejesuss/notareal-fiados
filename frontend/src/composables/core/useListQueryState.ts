import { computed, type ComputedRef } from "vue";
import { type LocationQuery, useRoute, useRouter } from "vue-router";

type QueryTypeMap = {
  number: number;
  string: string;
  boolean: boolean;
  "tri-boolean": boolean | null;
};

type QueryParamType = keyof QueryTypeMap;
type QueryStateTypes = number | string | boolean | null;

type QueryParamConfig = {
  default: QueryStateTypes;
  type: QueryParamType;
  resetPageOnChange: boolean;
};

type QuerySchema = Record<string, QueryParamConfig>;

type SnapshotFromSchema<T extends QuerySchema> = {
  [K in keyof T]: QueryTypeMap[T[K]["type"]];
};
type ComputedFromSchema<T extends QuerySchema> = {
  [K in keyof T]: ComputedRef<QueryTypeMap[T[K]["type"]]>;
};

export type ListQueryReturnState = ReturnType<typeof useListQueryState>;

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

function setComputedState<T extends QuerySchema>(
  schema: T,
  query: LocationQuery
): ComputedFromSchema<T> {
  const state = {} as ComputedFromSchema<T>;

  Object.keys(schema).forEach((key) => {
    const config = schema[key];
    if (!config) {
      throw new Error(`Query schema does not contain the key: ${key}`);
    }

    state[key as keyof T] = computed(() => {
      const raw = query[key];
      if (Array.isArray(raw)) {
        return parseValue(raw[0], config) as QueryTypeMap[T[keyof T]["type"]];
      }

      return parseValue(raw, config) as QueryTypeMap[T[keyof T]["type"]];
    });
  });

  return state;
}

export function useListQueryState<T extends QuerySchema>(schema: T) {
  const route = useRoute();
  const router = useRouter();

  if (!schema.page) {
    throw new Error("Missing 'page' field inside 'schema'");
  }

  /**
   * @constant `state` - The property where query state is preserved and computed
   */
  const state = setComputedState(schema, route.query);

  function serializeValue<K extends keyof T>(
    value: QueryTypeMap[T[K]["type"]],
    config: QueryParamConfig
  ) {
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
  async function setField<K extends keyof T>(
    key: K,
    value: QueryTypeMap[T[K]["type"]]
  ) {
    const newQuery = { ...route.query };
    const config = schema[key];
    const keyStr = String(key);

    if (!config) {
      throw new Error(`Query schema does not contain the key: ${keyStr}`);
    }

    const serialized = serializeValue(value, config);
    if (serialized === undefined) {
      delete newQuery[keyStr];
    } else {
      newQuery[keyStr] = serialized;
    }

    if (config.resetPageOnChange && key !== "page") {
      delete newQuery["page"];
    }

    return await router.replace({ query: newQuery });
  }

  function getSnapshot(): SnapshotFromSchema<T> {
    const snapshot = {} as SnapshotFromSchema<T>;

    (Object.keys(state) as Array<keyof T>).forEach((key) => {
      snapshot[key] = state[key].value;
    });

    return snapshot;
  }

  return {
    state,
    setField,
    getSnapshot,
  };
}
