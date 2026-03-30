import type { Options } from "src/types/options";

export const rowsOptions: Options<number> = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
];
export const activeOptions: Options<boolean> = [
  { label: "Todos", value: false },
  { label: "Somente Ativos", value: true },
];
