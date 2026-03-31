import type {
  Payment,
  PaymentListParams,
  PaymentListResponse,
} from "src/models";
import { api } from "src/api/api";
import { sleep } from "src/utils/timing/sleep";

const payments: Payment[] = [
  {
    id: 1,
    purchaseId: 2,
    description: "Pagamento adiantado",
    paymentDate: "2026-02-03T19:36:37.000Z",
    amountCents: 4990,
    method: "Pix",
    receiptNumber: "REC-002-001",
    isActive: true,
    createdAt: "2026-02-03T19:36:37.000Z",
    updatedAt: "2026-02-03T19:36:37.000Z",
    amount: 49.9,
  },
];

export async function getPayments() {
  await sleep(300);
  return payments;
}

export async function getPurchasePayments(
  purchaseId: number,
  params?: PaymentListParams
): Promise<PaymentListResponse> {
  const { data } = await api.get<PaymentListResponse>(
    `/purchases/${purchaseId}/payments`,
    {
      params,
    }
  );

  return data;
}
