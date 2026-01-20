import type { Purchase } from "src/models";
import { sleep } from "src/utils/timing/sleep";

const purchases: Purchase[] = [
  {
    id: 1,
    clientId: 2,
    description: "Compra de produtos agrícolas e vitaminas",
    totalValue: 350,
    totalPaidValue: 0,
    status: "partial",
    noteNumber: "NF-002-001",
    isActive: true,
    createdAt: "2025-12-19T10:36:31.000Z",
    updatedAt: "2025-12-19T10:36:31.000Z",
  },
  {
    id: 2,
    clientId: 2,
    description: "Compra de sementes",
    totalValue: 49.9,
    totalPaidValue: 49.9,
    status: "paid",
    noteNumber: "NF-002-001",
    isActive: true,
    createdAt: "2025-12-19T10:36:31.000Z",
    updatedAt: "2025-12-19T10:36:31.000Z",
  },
];

export async function getClientRecentPurchases(
  clientId: number,
  limit: number = 3
): Promise<Purchase[]> {
  await sleep(400);

  return purchases
    .filter((p) => {
      return p.clientId === clientId;
    })
    .slice(0, limit);
}
