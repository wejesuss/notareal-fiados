<template>
  <q-item class="q-py-md">
    <q-item-section
      class="payment-item"
      :class="{ 'payment-item-negative': !payment.isActive }"
    >
      <div class="row items-start justify-between">
        <div class="row q-gutter-md">
          <div class="text-body2">{{ payment.description }}</div>
          <div class="text-caption text-grey-7">
            {{ formatCurrency(payment.amount) }}
          </div>
        </div>
        <div class="text-caption">{{ payment.method }}</div>
        <div class="text-body2 text-weight-medium">
          {{ payment.receiptNumber }}
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { type Payment } from "src/models";
import { formatCurrency } from "src/utils/formatters";

defineProps<{
  payment: Payment;
}>();
</script>

<style>
.payment-item {
  padding: 8px 12px;
  border: 1px #26cf4d solid;
  border-radius: 6px;
}

.payment-item-negative {
  border-color: var(--q-negative);
}
</style>
