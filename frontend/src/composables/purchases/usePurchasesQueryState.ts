import { computed } from "vue";
import { type PurchaseStatusOptions } from "src/types/purchases";
import { type QuerySchema, useListQueryState } from "../core/useListQueryState";

export function usePurchasesQueryState() {
  const purchasesQuery = {
    page: { default: 1, type: "number", ge: 1, resetPageOnChange: false },
    rowsPerPage: { default: 10, type: "number", resetPageOnChange: true },
    status: { default: "all", type: "string", resetPageOnChange: true },
  } satisfies QuerySchema;

  const schema = useListQueryState(purchasesQuery);

  const page = computed(() => schema.state.page.value);
  const rowsPerPage = computed(() => schema.state.rowsPerPage.value);
  const status = computed(
    () => schema.state.status.value as PurchaseStatusOptions
  );

  return {
    schema,
    page,
    rowsPerPage,
    status,
  };
}
