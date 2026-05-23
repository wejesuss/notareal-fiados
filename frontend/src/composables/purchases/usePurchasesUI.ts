import { computed, type Ref } from "vue";
import type { Purchase } from "src/models";
import {
  getPurchaseActiveStatusUI,
  getPurchaseStatusUI,
} from "src/utils/formatters";

export function usePurchasesUI(paginatedPurchases: Ref<Purchase[]>) {
  const purchasesWithUI = computed(() =>
    paginatedPurchases.value.map((p) => ({
      ...p,
      statusUI: getPurchaseStatusUI(p.status, { titleCase: true }),
      activeStatusUI: getPurchaseActiveStatusUI(p.isActive),
    }))
  );

  return { purchasesWithUI };
}
