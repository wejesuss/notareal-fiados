<template>
  <div class="row items-center q-gutter-sm q-gutter-x-md">
    <q-select
      v-for="filter in props.filters"
      :key="filter.label"
      v-bind="filter.bind"
      :label="filter.label"
      dense
      outlined
      :style="{ minWidth: `${filter.minWidth || 160}px` }"
    ></q-select>
  </div>
</template>

<script lang="ts" setup>
import type { QSelectProps } from "quasar";

type SelectBind<T> = {
  modelValue: T;
  "onUpdate:modelValue": (value: T) => void;
} & Partial<QSelectProps>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ListFilterProps<T = any> {
  bind: SelectBind<T>;
  label: string;
  minWidth?: number;
}

const props = defineProps<{
  filters: ListFilterProps[];
}>();
</script>
