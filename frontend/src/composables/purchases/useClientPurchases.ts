import { computed, type Ref, ref, watch } from "vue";
import type { PurchaseListResponse, PurchaseStatus } from "src/models";
import { getClientPurchases } from "src/services/purchase";
import type { PurchaseStatusOptions } from "src/types/purchases";
import { type usePurchasesQueryState } from "./usePurchasesQueryState";
import { useResource } from "../core/useResource";

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
  const resource = useResource<PurchaseListResponse>();
  const totalPages = ref(1);
  const purchases = computed(() => resource.data.value?.purchases ?? []);

  async function fetchPurchases() {
    if (!Number.isInteger(clientId.value) || clientId.value <= 0) {
      resource.setError("Identificador do cliente inválido!", "validation");
      return;
    }

    const { page, rowsPerPage, status } = queryState.getSnapshot();

    const offset = (page - 1) * rowsPerPage;
    const mappedStatus = mapPurchaseStatus(status);
    const params = {
      limit: rowsPerPage,
      offset,
      ...(mappedStatus.isActive !== undefined && {
        isActive: mappedStatus.isActive,
      }),
      ...(mappedStatus.statuses !== undefined && {
        statuses: mappedStatus.statuses,
      }),
    };

    const response = await resource.load(getClientPurchases, {
      clientId: clientId.value,
      params,
    });

    // Ignore outdated response
    if (!response) return;

    totalPages.value = Math.max(1, Math.ceil(response.total / rowsPerPage));
    if (page > totalPages.value) {
      await queryState.setField("page", totalPages.value);
      return;
    }
  }

  watch(
    [
      clientId,
      queryState.state.page,
      queryState.state.rowsPerPage,
      queryState.state.status,
    ],
    fetchPurchases,
    { immediate: true }
  );

  return {
    loading: resource.loading,
    error: resource.error,
    totalPages,
    purchases,
    reload: fetchPurchases,
  };
}
