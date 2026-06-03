import type { RouteRecordRaw } from "vue-router";
import { validatePurchaseID } from "./guards";

export const purchaseRoutes: RouteRecordRaw[] = [
  {
    path: "/purchases/new",
    component: () => import("pages/purchases/PurchaseCreatePage.vue"),
    meta: {
      preserveScroll: true,
    },
  },
  {
    path: "/purchases/:id",
    component: () => import("pages/purchases/PurchaseViewPage.vue"),
    beforeEnter: validatePurchaseID,
  },
] as const;
