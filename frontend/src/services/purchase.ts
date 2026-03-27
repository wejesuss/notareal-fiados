import type {
  Purchase,
  PurchaseUpdate,
  Payment,
  PurchasesWithMessageResponse,
  PurchaseListParams,
} from "src/models";
import { sleep } from "src/utils/timing/sleep";
import { getPayments } from "./payment";
import { api } from "src/api/api";

const purchases: Purchase[] = [
  {
    id: 1,
    clientId: 2,
    description:
      "Compra de produtos agrícolas e vitaminas e outras coisinhas mais",
    totalCents: 350,
    totalPaidCents: 0,
    total: 350,
    totalPaid: 0,
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
    totalCents: 4990,
    totalPaidCents: 4990,
    total: 49.9,
    totalPaid: 49.9,
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
    totalCents: 9975,
    totalPaidCents: 2900,
    total: 99.75,
    totalPaid: 29,
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
  clientId: number,
  params?: PurchaseListParams
): Promise<PurchasesWithMessageResponse> {
  const { data } = await api.get<PurchasesWithMessageResponse>(
    `/clients/${clientId}/purchases`,
    {
      params: params,
    }
  );

  return data;
}

export async function getClientRecentPurchases(
  clientId: number,
  onlyActive: boolean = true
): Promise<PurchasesWithMessageResponse> {
  // TEMP: temporary convert onlyActive -> isActive
  const { data } = await api.get<PurchasesWithMessageResponse>(
    `/clients/${clientId}/purchases`,
    {
      params: { limit: 3, isActive: onlyActive ? true : null },
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
