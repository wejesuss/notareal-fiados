import type { Payment } from "src/models";

export type PaymentModalState =
  | { mode: "create" }
  | { mode: "edit"; payment: Payment; isActive: boolean };
