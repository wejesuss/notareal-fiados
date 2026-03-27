import { type Ref, ref, watch } from "vue";
import type { Purchase, PurchaseStatus } from "src/models";
import { getClientPurchases } from "src/services/purchase";
import type { PurchaseStatusOptions } from "src/types/purchases";
import { type usePurchasesQueryState } from "../purchases/usePurchasesQueryState";

type PurchasesQuerySchema = ReturnType<typeof usePurchasesQueryState>["schema"];

type StatusObject = {
  statuses?: PurchaseStatus[];
  isActive?: boolean;
};

function mapPurchaseStatus(status: string): StatusObject {
  const mapper: Record<PurchaseStatusOptions, StatusObject> = {
    all: {},
    open: { statuses: ["partial", "pending"], isActive: true },
    pending: { statuses: ["pending"], isActive: true },
    partial: { statuses: ["partial"], isActive: true },
    paid: { statuses: ["paid"], isActive: true },
    inactive: { isActive: false },
  };

  const mapped = mapper[status as PurchaseStatusOptions];
  if (!mapped) return mapper.all;

  return mapped;
}

export function useClientPurchases(
  clientId: Ref<number>,
  queryState: PurchasesQuerySchema
) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const purchases = ref<Purchase[]>([]);
  const totalPages = ref(1);

  async function fetchPurchases() {
    if (!Number.isInteger(clientId.value) || clientId.value <= 0) {
      error.value = new Error("Identificador do cliente inválido!");
      purchases.value = [];
      totalPages.value = 1;
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const { page, rowsPerPage, status } = queryState.getSnapshot();

      const offset = (page - 1) * rowsPerPage;
      const mappedStatus = mapPurchaseStatus(status);

      const response = await getClientPurchases(clientId.value, {
        limit: rowsPerPage,
        offset,
        ...(mappedStatus.isActive !== undefined && {
          isActive: mappedStatus.isActive,
        }),
        ...(mappedStatus.statuses !== undefined && {
          statuses: mappedStatus.statuses,
        }),
      });

      totalPages.value = Math.max(1, Math.ceil(response.total / rowsPerPage));
      if (page && page > totalPages.value && totalPages.value > 0) {
        await queryState.setField("page", totalPages.value);
        return;
      }

      purchases.value = response.purchases;
    } catch (e) {
      console.error(e);
      error.value = e as Error;
      purchases.value = [];
      totalPages.value = 1;
    } finally {
      loading.value = false;
    }
  }

  watch(clientId, fetchPurchases, { immediate: true });
  watch(
    [
      queryState.state.page,
      queryState.state.rowsPerPage,
      queryState.state.status,
    ],
    async () => {
      await fetchPurchases();
    },
    { immediate: true }
  );

  return {
    loading,
    error,
    totalPages,
    purchases,
    reload: fetchPurchases,
  };
}
