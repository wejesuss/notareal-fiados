import type {
  PaymentListParams,
  PaymentListResponse,
  PaymentWithMessageResponse,
} from "src/models";
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

export async function updatePaymentActiveStatus(
  purchaseId: number,
  id: number,
  isActive: boolean
): Promise<PaymentWithMessageResponse> {
  let response: PaymentWithMessageResponse;

  if (isActive === true) {
    response = (
      await api.put<PaymentWithMessageResponse>(
        `/purchases/${purchaseId}/payments/${id}/activate`
      )
    ).data;
  } else {
    response = (
      await api.delete<PaymentWithMessageResponse>(
        `/purchases/${purchaseId}/payments/${id}`
      )
    ).data;
  }

  return response;
}
