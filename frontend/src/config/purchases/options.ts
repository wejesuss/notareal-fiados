import type { Options } from "src/types/options";
import type { PurchaseStatusOptions } from "src/types/purchases";

export const rowsOptions: Options<number> = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
];
export const statusOptions: Options<PurchaseStatusOptions> = [
  { label: "Todas", value: "all" },
  { label: "Em aberto", value: "open" },
  { label: "Pendentes", value: "pending" },
  { label: "Parciais", value: "partial" },
  { label: "Pagas", value: "paid" },
  { label: "Inativas", value: "inactive" },
];
