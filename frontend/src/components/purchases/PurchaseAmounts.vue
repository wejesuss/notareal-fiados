<template>
  <!-- Purchase amounts -->
  <div v-if="!compact">
    <div class="row items-center text-body2">
      <span class="q-mr-xs">Total da compra:</span>
      <span class="text-weight-bold text-blue-grey-7">{{
        formatCurrency(total)
      }}</span>
    </div>
    <div class="row items-center text-body2 q-mt-md">
      <span class="q-mr-xs">Valor Pago:</span>
      <span class="text-weight-bold text-blue-grey-7">{{
        formatCurrency(paid)
      }}</span>
    </div>
  </div>

  <div v-else>
    <!-- small screens rendering fallback -->
    <div class="row items-center text-body2">
      <span class="q-mr-xs">Pago:</span>
      <span class="text-weight-bold text-blue-grey-7"
        >{{ formatCurrency(total) }} / {{ formatCurrency(paid) }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "src/utils/formatters";

type PurchaseAmountsProps = {
  total: number;
  paid: number;
  compact: boolean;
};

defineProps<PurchaseAmountsProps>();
</script>
