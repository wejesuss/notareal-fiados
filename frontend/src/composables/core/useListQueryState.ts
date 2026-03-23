import { computed, type ComputedRef } from "vue";
import { useRoute, useRouter } from "vue-router";

type QueryTypeMap = {
  number: number;
  string: string;
  boolean: boolean;
  "tri-boolean": boolean | null;
};

type NumberQueryConfig = {
  type: "number";
  default: number;
  /**
   * @param ge - The minimum number `value` can be (greater/equal)
   */
  ge?: number;
  resetPageOnChange: boolean;
};

type StringQueryConfig = {
  type: "string";
  default: string;
  /**
   * Is the param valid?
   * @param value - The value retrieved from the route.query
   * @returns If `value` is a valid string or not.
   * If not this param fallback to `default`
   */
  isValid?: (value: string) => boolean;
  resetPageOnChange: boolean;
};

type BooleanQueryConfig = {
  type: "boolean";
  default: boolean;
  resetPageOnChange: boolean;
};

type TriBooleanQueryConfig = {
  type: "tri-boolean";
  default: boolean | null;
  resetPageOnChange: boolean;
};

type QueryParamConfig =
  | NumberQueryConfig
  | StringQueryConfig
  | BooleanQueryConfig
  | TriBooleanQueryConfig;

export type QuerySchema = Record<string, QueryParamConfig> & {
  page: NumberQueryConfig;
};

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
function parseValue<T extends QueryParamConfig>(
  value: string | null | undefined,
  config: T
): T["default"] {
  if (value === undefined) return config.default;

  switch (config.type) {
    case "number": {
      const parsed = Number(value);
      if (Number.isNaN(parsed)) return config.default;
      if (config.ge !== undefined && parsed < config.ge) {
        return config.default;
      }

      return parsed;
    }

    case "boolean":
      return value === "true";

    case "tri-boolean":
      if (value === "true") return true;
      if (value === "false") return false;
      return null;

    case "string":
      if (!value || (config.isValid && !config.isValid(value))) {
        return config.default;
      }
      return value;

    default:
      return value;
  }
}

function setComputedState<T extends QuerySchema>(
  schema: T,
  route: ReturnType<typeof useRoute>
): ComputedFromSchema<T> {
  const state = {} as ComputedFromSchema<T>;

  Object.keys(schema).forEach((key) => {
    const config = schema[key];
    if (!config) {
      throw new Error(`Query schema does not contain the key: ${key}`);
    }

    state[key as keyof T] = computed(() => {
      const raw = route.query[key];
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
  const state = setComputedState(schema, route);

  function serializeValue<C extends QueryParamConfig>(
    value: QueryTypeMap[C["type"]],
    config: C
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

    if (config.type === "string" && config.isValid) {
      const valid = config.isValid(value as string);
      if (!valid)
        throw new Error(
          "The value provided does not passes validation function"
        );
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
