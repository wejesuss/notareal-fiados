import { type Ref, ref, watch } from "vue";
import type { Purchase, PurchaseStatus } from "src/models";
import { getClientPurchases } from "src/services/purchase";
import type { ListQueryReturnState } from "../core/useListQueryState";
import type { PurchaseStatusOptions } from "src/types/purchases";

type StatusObject = {
  statuses?: PurchaseStatus[];
  isActive?: boolean;
};

function mapPurchaseStatus(status: PurchaseStatusOptions): StatusObject {
  const mapper: Record<PurchaseStatusOptions, StatusObject> = {
    all: {},
    open: { statuses: ["partial", "pending"], isActive: true },
    pending: { statuses: ["pending"], isActive: true },
    partial: { statuses: ["partial"], isActive: true },
    paid: { statuses: ["paid"], isActive: true },
    inactive: { isActive: false },
  };

  const mapped = mapper[status];
  if (!mapped) return mapper.all;

  return mapped;
}

export function useClientPurchases(
  clientId: Ref<number>,
  queryState: ListQueryReturnState
) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const purchases = ref<Purchase[]>([]);
  const totalPages = ref(1);

  async function fetchPurchases() {
    if (!Number.isInteger(clientId.value) || clientId.value <= 0) {
      purchases.value = [];
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const { page, rowsPerPage, status } = queryState.getSnapshot() as {
        page: number;
        rowsPerPage: number;
        status: PurchaseStatusOptions;
      };

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

  return {
    loading,
    error,
    totalPages,
    purchases,
    reload: fetchPurchases,
  };
}
