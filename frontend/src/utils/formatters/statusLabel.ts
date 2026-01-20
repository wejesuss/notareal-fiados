import type { PurchaseStatus } from "src/models";

const statusLabels: Record<PurchaseStatus, string> = {
  pending: "pendente",
  partial: "parcial",
  paid: "pago",
} as const;

export function formatStatus(
  status: PurchaseStatus,
  options?: { titleCase: boolean }
): string {
  const label = statusLabels[status];
  if (options?.titleCase) {
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  return label;
}
