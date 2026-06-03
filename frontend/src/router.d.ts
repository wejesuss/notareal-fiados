import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    preserveScroll?: boolean;
  }
}
