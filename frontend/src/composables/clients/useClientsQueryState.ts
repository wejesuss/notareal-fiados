import { computed } from "vue";
import { useBind, useListQueryState, type QuerySchema } from "src/composables";
import { activeOptions, rowsOptions } from "src/config/clients/options";

export function useClientsQueryState() {
  const clientsQuery = {
    page: { default: 1, type: "number", ge: 1, resetPageOnChange: false },
    rowsPerPage: { default: 10, type: "number", resetPageOnChange: true },
    onlyActive: { default: true, type: "boolean", resetPageOnChange: true },
  } satisfies QuerySchema;

  const schema = useListQueryState(clientsQuery);
  const { bind, bindSelect } = useBind();

  const page = computed(() => ({
    stateValue: schema.state.page.value,
    bind: bind("page", schema),
  }));
  const rowsPerPage = computed(() => ({
    stateValue: schema.state.rowsPerPage.value,
    bind: bindSelect("rowsPerPage", schema, rowsOptions),
  }));
  const onlyActive = computed(() => ({
    stateValue: schema.state.onlyActive.value,
    bind: bindSelect("onlyActive", schema, activeOptions),
  }));

  return {
    schema,
    page,
    rowsPerPage,
    onlyActive,
  };
}
