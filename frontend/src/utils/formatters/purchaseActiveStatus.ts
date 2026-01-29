import type { Purchase } from "src/models";

type PurchaseActiveStatusUI = {
  label: string;
  color: string;
};

const activeStatusLabels = {
  true: "Ativo",
  false: "Inativo",
};
const activeStatusColor = {
  true: "positive",
  false: "grey-7",
};

export function getPurchaseActiveStatusUI(
  isActive: Purchase["isActive"]
): PurchaseActiveStatusUI {
  return {
    label: activeStatusLabels[`${isActive}`],
    color: activeStatusColor[`${isActive}`],
  };
}
