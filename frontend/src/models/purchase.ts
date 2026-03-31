export type PurchaseStatus = "pending" | "partial" | "paid";

export interface Purchase {
  id: number;
  clientId: number;
  description: string;
  totalCents: number;
  totalPaidCents: number;
  status: PurchaseStatus;
  noteNumber: string; // NF-0001
  isActive: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date

  // computed float by pydantic
  total: number;
  totalPaid: number;
}

export interface PurchaseUpdate {
  clientId?: number;
  description?: string;
  totalCents?: number;
  isActive?: boolean;
}

// API models
export type PurchaseListParams = {
  limit?: number;
  offset?: number;
  isActive?: boolean;
  statuses?: PurchaseStatus[];
};

export type PurchaseWithMessageResponse = {
  message: string;
  purchase: Purchase;
};

export type PurchasesWithMessageResponse = {
  message: string;
  total: number;
  purchases: Purchase[];
};
