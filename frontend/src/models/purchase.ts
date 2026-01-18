export type PurchaseStatus = "pending" | "partial" | "paid";
export type PurchaseStatusPT = "pendente" | "parcial" | "pago";

export interface Purchase {
  id: number;
  clientId: number;
  description: string;
  totalValue: number;
  totalPaidValue: number;
  // 'pending' (default), 'partial', 'paid'
  status: PurchaseStatus | PurchaseStatusPT;
  noteNumber: string; // NF-0001
  isActive: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
