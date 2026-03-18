import { computed } from "vue";
import { useListQueryState, type QuerySchema } from "src/composables";

interface OptionType<T = unknown> {
  label: string;
  value: T;
}

type OptionsType<T = unknown> = OptionType<T>[];

export function useClientsQueryState() {
  const rowsOptions: OptionsType<number> = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];
  const activeOptions: OptionsType<boolean> = [
    { label: "Todos", value: false },
    { label: "Somente Ativos", value: true },
  ];

  const clientsQuery = {
    page: { default: 1, type: "number", resetPageOnChange: false },
    rowsPerPage: { default: 10, type: "number", resetPageOnChange: true },
    onlyActive: { default: true, type: "boolean", resetPageOnChange: true },
  } satisfies QuerySchema;

  const schema = useListQueryState(clientsQuery);

  const page = computed(() => ({
    value: schema.state.page.value,
    pagination: bind("page"),
  }));
  const rowsPerPage = computed(() => ({
    value: schema.state.rowsPerPage.value,
    select: bindSelect("rowsPerPage", rowsOptions),
  }));
  const onlyActive = computed(() => ({
    value: schema.state.onlyActive.value,
    select: bindSelect("onlyActive", activeOptions),
  }));

  /**
   * This functions makes it easy to configure q-select or any input-like
   * components from vue/quasar that has a `v-model` configuration
   * It returns an object you can `bind` using `v-bind` directive.
   * This makes the query configuration easy and automatic
   *
   * @param key Name of the query field
   * @returns Model value with setted listener for any q-input or form-like field
   */
  function bind<K extends keyof typeof clientsQuery>(key: K) {
    const model = schema.state[key].value;
    return {
      modelValue: model,
      "onUpdate:modelValue": (value: typeof model) =>
        schema.setField(key, value),
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
  function bindSelect<K extends keyof typeof clientsQuery, T = unknown>(
    key: K,
    options?: OptionsType<T>
  ) {
    return {
      ...bind(key),
      emitValue: true,
      mapOptions: true,
      ...(options && { options }),
    };
  }

  return {
    schema,
    page,
    rowsPerPage,
    onlyActive,
  };
}
