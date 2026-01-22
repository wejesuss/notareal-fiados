import type { PurchaseStatus } from "src/models";

type PurchaseStatusUI = {
  label: string;
  color: string;
};
type PurchaseStatusMap = Record<PurchaseStatus, string>;

const statusLabels: PurchaseStatusMap = {
  pending: "pendente",
  partial: "parcial",
  paid: "pago",
};
const statusColor: PurchaseStatusMap = {
  pending: "red-7",
  partial: "amber",
  paid: "positive",
};

export function formatStatus(
  status: PurchaseStatus,
  options?: { titleCase?: boolean }
): string {
  const label = statusLabels[status];
  if (options?.titleCase) {
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  return label;
}

export function getPurchaseStatusUI(
  status: PurchaseStatus,
  options?: { titleCase?: boolean }
): PurchaseStatusUI {
  return {
    label: formatStatus(status, options),
    color: statusColor[status],
  };
}
