import type { PaymentListParams, PaymentListResponse } from "src/models";
import { api } from "src/api/api";

export async function getPayments(): Promise<PaymentListResponse> {
  // Zero (0) means from all purchases
  const purchaseId = 0;

  return await getPurchasePayments({ purchaseId });
}

export async function getPurchasePayments({
  purchaseId,
  params,
}: {
  purchaseId: number;
  params?: PaymentListParams;
}): Promise<PaymentListResponse> {
  const { data } = await api.get<PaymentListResponse>(
    `/purchases/${purchaseId}/payments`,
    {
      params,
    }
  );

  return data;
}
