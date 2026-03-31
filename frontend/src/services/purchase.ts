import type {
  Purchase,
  PurchaseUpdate,
  Payment,
  PurchaseWithMessageResponse,
  PurchaseListResponse,
  PurchaseListParams,
} from "src/models";
import { getPayments } from "./payment";
import { api } from "src/api/api";

export async function getPurchaseById(purchaseId: number): Promise<Purchase> {
  const { data } = await api.get<Purchase>(`/purchases/${purchaseId}`);

  return data;
}

export async function updatePurchaseActiveStatus(
  id: number,
  isActive: boolean
): Promise<PurchaseWithMessageResponse> {
  let response: PurchaseWithMessageResponse;

  if (isActive === true) {
    response = (
      await api.put<PurchaseWithMessageResponse>(`/purchases/${id}/activate`)
    ).data;
  } else {
    response = (
      await api.delete<PurchaseWithMessageResponse>(`/purchases/${id}`)
    ).data;
  }

  return response;
}

export async function updatePurchase(
  id: number,
  payload: PurchaseUpdate
): Promise<PurchaseWithMessageResponse> {
  const { data } = await api.put<PurchaseWithMessageResponse>(
    `/purchases/${id}`,
    payload
  );

  return data;
}

// Client related functions
export async function getClientPurchases(
  clientId: number,
  params?: PurchaseListParams
): Promise<PurchaseListResponse> {
  const { data } = await api.get<PurchaseListResponse>(
    `/clients/${clientId}/purchases`,
    {
      params: params,
    }
  );

  return data;
}

// Payment related functions
export async function getPurchasePayments(
  purchaseId: number
): Promise<Payment[]> {
  const payments = await getPayments();
  return payments.filter((p) => p.purchaseId === purchaseId);
}
