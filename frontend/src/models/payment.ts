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

export interface PaymentUpdate {
  description?: string | null;
  amountCents?: number;
  paymentDate?: number | null;
  method?: string;
}

// API models
export type PaymentListParams = {
  limit?: number;
  offset?: number;
};

export type PaymentWithMessageResponse = {
  message: string;
  payment: Payment;
};

export type PaymentListResponse = {
  message: string;
  payments: Payment[];
};
