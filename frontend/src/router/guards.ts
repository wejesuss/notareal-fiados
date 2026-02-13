import type { NavigationGuard } from "vue-router";

export const validateClientID: NavigationGuard = (to) => {
  const id = Number(to.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return "/clients";
  }
};

export const validatePurchaseID: NavigationGuard = (to, from) => {
  console.log(from);

  const id = Number(to.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return "/purchases";
  }
};
