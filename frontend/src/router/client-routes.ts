import type { RouteRecordRaw } from "vue-router";
import { validateClientID } from "./guards";

export const clientRoutes: RouteRecordRaw[] = [
  {
    path: "/clients",
    component: () => import("pages/clients/ClientsPage.vue"),
  },
  {
    path: "/clients/new",
    component: () => import("pages/clients/ClientCreatePage.vue"),
  },
  {
    path: "/clients/:id",
    component: () => import("pages/clients/ClientViewPage.vue"),
    beforeEnter: validateClientID,
  },
  {
    path: "/clients/:id/edit",
    component: () => import("pages/clients/ClientEditPage.vue"),
    beforeEnter: validateClientID,
  },
  {
    path: "/clients/:id/purchases",
    component: () => import("pages/clients/ClientPurchasesPage.vue"),
    beforeEnter: validateClientID,
  },
] as const;
