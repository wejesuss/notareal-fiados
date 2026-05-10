export interface Payment {
  id: number;
  purchaseId: number;
  description: string | null;
  amountCents: number;
  paymentDate: number | null;
  method: string;
  receiptNumber: string; // REC-0001
  isActive: boolean;
  createdAt: number;
  updatedAt: number;

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
