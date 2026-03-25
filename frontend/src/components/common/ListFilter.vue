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
type ModelBind<T = unknown> = {
  modelValue: T;
  "onUpdate:modelValue": (value: T) => void;
};

type SelectBind<T = unknown> = ModelBind<T> & {
  [key: string]: unknown; // extra props for q-select component
};

interface ListFilterProps<T = unknown> {
  bind: SelectBind<T>;
  label: string;
  minWidth?: number;
}

const props = defineProps<{
  filters: ListFilterProps[];
}>();
</script>
