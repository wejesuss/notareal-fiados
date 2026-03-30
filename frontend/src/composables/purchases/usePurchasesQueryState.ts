import { computed } from "vue";
import { useBind } from "../core/useBind";
import { type PurchaseStatusOptions } from "src/types/purchases";
import { type QuerySchema, useListQueryState } from "../core/useListQueryState";
import { rowsOptions, statusOptions } from "src/config/purchases/options";

function isStatusValid(value: string): boolean {
  const keys = ["all", "open", "pending", "partial", "paid", "inactive"];

  return keys.includes(value);
}

export function usePurchasesQueryState() {
  const purchasesQuery = {
    page: { default: 1, type: "number", ge: 1, resetPageOnChange: false },
    rowsPerPage: { default: 10, type: "number", resetPageOnChange: true },
    status: {
      default: "all",
      type: "string",
      resetPageOnChange: true,
      isValid: isStatusValid,
    },
  } satisfies QuerySchema;

  const schema = useListQueryState(purchasesQuery);
  const { bind, bindSelect } = useBind();

  const page = computed(() => ({
    stateValue: schema.state.page.value,
    bind: bind("page", schema),
  }));
  const rowsPerPage = computed(() => ({
    stateValue: schema.state.rowsPerPage.value,
    bind: bindSelect("rowsPerPage", schema, rowsOptions),
  }));
  const status = computed(() => ({
    stateValue: schema.state.status.value as PurchaseStatusOptions,
    bind: bindSelect("status", schema, statusOptions),
  }));

  return {
    schema,
    page,
    rowsPerPage,
    status,
  };
}
