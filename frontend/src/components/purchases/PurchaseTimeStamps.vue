<template>
  <div
    :class="{
      'row items-center justify-between q-gutter-x-lg q-col-gutter-y-xs':
        !compact,
    }"
  >
    <div class="row items-center">
      <span class="q-mr-xs" :class="labelStyle">Criado Em:</span>
      <span :class="dateValueStyle">{{ formatDate(createdAt) }}</span>
    </div>

    <div class="row items-center" :class="{ 'q-mt-sm': compact }">
      <span class="q-mr-xs" :class="labelStyle">Atualizado Em:</span>
      <span :class="dateValueStyle">{{ formatDate(updatedAt) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "src/utils/formatters";
import { computed } from "vue";

const props = defineProps<{
  createdAt: string;
  updatedAt: string;
  labelStyle?: string;
  dateStyle?: string;
  compact?: boolean;
}>();

const dateValueStyle = computed(
  () => props.dateStyle || "text-weight-medium text-blue-grey-6",
);
</script>
