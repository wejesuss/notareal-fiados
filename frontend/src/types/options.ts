interface Option<T = unknown> {
  label: string;
  value: T;
}

export type Options<T = unknown> = readonly Option<T>[];
