export type PurchaseStatus = "pending" | "partial" | "paid";

export interface Purchase {
  id: number;
  clientId: number;
  description: string;
  totalValue: number;
  totalPaidValue: number;
  // 'pending' (default), 'partial', 'paid'
  status: PurchaseStatus;
  noteNumber: string; // NF-0001
  isActive: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface PurchaseUpdate {
  clientId?: number;
  description?: string;
  totalValue?: number;
  isActive?: boolean;
}
