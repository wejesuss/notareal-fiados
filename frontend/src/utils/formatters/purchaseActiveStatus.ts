import type { PurchaseActiveStatusUI } from "src/components/types";

const toActiveStatusLabel = (isActive: boolean) => {
  return isActive ? "Ativo" : "Inativo";
};
const toActiveStatusColor = (isActive: boolean) => {
  return isActive ? "positive" : "grey-7";
};

export function getPurchaseActiveStatusUI(
  isActive: boolean
): PurchaseActiveStatusUI {
  const color = toActiveStatusColor(isActive);
  return {
    label: toActiveStatusLabel(isActive),
    color: color,
    textColor: `text-${color}`,
  };
}
