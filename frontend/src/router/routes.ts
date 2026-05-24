import type { RouteRecordRaw } from "vue-router";
import { clientRoutes } from "./client-routes";
import { purchaseRoutes } from "./purchase-routes.ts";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/DashboardPage.vue"),
      },
      ...clientRoutes,
      ...purchaseRoutes,
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
