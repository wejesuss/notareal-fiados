import type { Options } from "src/types/options";
import type {
  ListQueryReturnState,
  QuerySchema,
  QueryTypeMap,
} from "./useListQueryState";

export function useBind() {
  /**
   * This functions makes it easy to configure q-select or any input-like
   * components from vue/quasar that has a `v-model` configuration
   * It returns an object you can `bind` using `v-bind` directive.
   * This makes the query configuration easy and automatic
   *
   * @param key Name of the query field
   * @returns Model value with setted listener for any q-input or form-like field
   */
  function bind<U extends QuerySchema, K extends keyof U>(
    key: K,
    schema: ListQueryReturnState<U>
  ) {
    type Value = QueryTypeMap[U[K]["type"]];

    const model = schema.state[key].value;

    const onModelUpdate = (value: Value) => {
      void schema.setField(key, value);
      return;
    };

    return {
      modelValue: model,
      "onUpdate:modelValue": onModelUpdate,
    };
  }

  /**
   * This functions makes it easy to configure q-select components
   * from vue/quasar.
   * It returns an object you can `bind` using `v-bind` directive.
   * This makes the query configuration easy and automatic
   *
   * @param key Name of the query field
   * @param options Optional options Array to map label/value into q-select component.
   * Must be set manually on the q-select input if not set here
   * @returns Model value with setted listener for any q-input or form-like field.
   * Also this function sets the `emitValue` and `mapOptions` properties as `true`
   */
  function bindSelect<U extends QuerySchema, K extends keyof U>(
    key: K,
    schema: ListQueryReturnState<U>,
    options?: Options<QueryTypeMap[U[K]["type"]]>
  ) {
    return {
      ...bind<U, K>(key, schema),
      emitValue: true,
      mapOptions: true,
      ...(options && { options }),
    };
  }

  return { bind, bindSelect };
}
