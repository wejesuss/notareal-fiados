import type {
  Purchase,
  PurchaseUpdate,
  Payment,
  PurchaseWithMessageResponse,
  PurchaseListResponse,
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
