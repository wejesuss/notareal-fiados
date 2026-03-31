export interface Payment {
  id: number;
  purchaseId: number;
  description: string | null;
  amountCents: number;
  paymentDate: string | null; // ISO date
  method: string;
  receiptNumber: string; // REC-0001
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // computed float by pydantic
  amount: number;
}

// API models
export type PaymentListParams = {
  limit?: number;
  offset?: number;
};

export type PaymentListResponse = {
  message: string;
  payments: Payment[];
};
