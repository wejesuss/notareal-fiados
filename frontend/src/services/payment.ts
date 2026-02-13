import type { Payment } from "src/models";
import { sleep } from "src/utils/timing/sleep";

const payments: Payment[] = [
  {
    id: 1,
    purchaseId: 2,
    description: "Pagamento adiantado",
    amount: 49.9,
    paymentDate: "2026-02-03T19:36:37.000Z",
    method: "Pix",
    receiptNumber: "REC-002-001",
    isActive: true,
    createdAt: "2026-02-03T19:36:37.000Z",
    updatedAt: "2026-02-03T19:36:37.000Z",
  },
];

export async function getPayments() {
  await sleep(300);
  return payments;
}
