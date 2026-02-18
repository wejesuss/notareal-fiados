import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export function useClientsQuery(allowedRows: number[] = [10, 20, 50]) {
  const route = useRoute();
  const router = useRouter();

  const page = ref(toPositiveInt(route.query.page, 1));
  const rowsPerPage = ref(parseRows(route.query.rows));
  const onlyActive = ref(parseActive(route.query.active));

  function toPositiveInt(value: unknown, fallback: number): number {
    const v = Number(value);
    return Number.isInteger(v) && v > 0 ? v : fallback;
  }

  function parseRows(value: unknown): number {
    const v = Number(value);
    return allowedRows.includes(v) ? v : allowedRows[0] || 10;
  }

  function parseActive(value: unknown): boolean {
    return value === "false" ? false : true;
  }

  watch(
    [page, rowsPerPage, onlyActive],
    async () => {
      await router.replace({
        query: {
          page: String(page.value),
          rows: String(rowsPerPage.value),
          active: String(onlyActive.value),
        },
      });
    },
    { flush: "post" }
  );

  watch(
    () => route.query,
    (query) => {
      const newPage = toPositiveInt(query.page, 1);
      const newRows = parseRows(query.rows);
      const newActive = parseActive(query.active);

      if (newPage !== page.value) page.value = newPage;
      if (newRows !== rowsPerPage.value) rowsPerPage.value = newRows;
      if (newActive !== onlyActive.value) onlyActive.value = newActive;
    }
  );

  return {
    page,
    rowsPerPage,
    onlyActive,
  };
}
