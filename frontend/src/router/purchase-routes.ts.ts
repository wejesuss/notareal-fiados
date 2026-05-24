import type { RouteRecordRaw } from "vue-router";
import { validatePurchaseID } from "./guards";

export const purchaseRoutes: RouteRecordRaw[] = [
  {
    path: "/purchases/:id",
    component: () => import("pages/purchases/PurchaseViewPage.vue"),
    beforeEnter: validatePurchaseID,
  },
] as const;
