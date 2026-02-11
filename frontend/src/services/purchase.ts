import type { Purchase, PurchaseUpdate } from "src/models";
import { sleep } from "src/utils/timing/sleep";

const purchases: Purchase[] = [
  {
    id: 1,
    clientId: 2,
    description:
      "Compra de produtos agrícolas e vitaminas e outras coisinhas mais",
    totalValue: 350,
    totalPaidValue: 0,
    status: "pending",
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
    noteNumber: "NF-002-002",
    isActive: true,
    createdAt: "2025-12-19T10:36:31.000Z",
    updatedAt: "2025-12-19T10:36:31.000Z",
  },
  {
    id: 3,
    clientId: 1,
    description: "Compra de adubo",
    totalValue: 99.75,
    totalPaidValue: 29,
    status: "partial",
    noteNumber: "NF-001-003",
    isActive: false,
    createdAt: "2026-02-10T10:36:31.000Z",
    updatedAt: "2026-02-10T10:36:31.000Z",
  },
];

export async function getPurchaseById(purchaseId: number): Promise<Purchase> {
  await sleep(300);
  const found = purchases.find((p) => p.id === purchaseId);

  if (!found) throw new Error("Compra não encontrada!");

  return { ...found };
}

export async function updatePurchase(
  id: number,
  payload: PurchaseUpdate
): Promise<Purchase> {
  await sleep(300);

  const index = purchases.findIndex((purchase) => purchase.id === id);
  if (index === -1) {
    throw new Error(`Compra de id ${id} não encontrado!`);
  }

  const purchase = purchases[index];
  if (!purchase) {
    throw new Error(`Compra de id ${id} não encontrado!`);
  }

  const updatedPurchase: Purchase = {
    ...purchase,
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  purchases[index] = updatedPurchase;

  return updatedPurchase;
}

// Client related functions
export async function getClientPurchases(
  clientId: number
): Promise<Purchase[]> {
  await sleep(400);
  return purchases.filter((p) => p.clientId === clientId);
}

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
