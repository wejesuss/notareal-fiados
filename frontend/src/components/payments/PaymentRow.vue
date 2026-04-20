<template>
  <q-item class="q-py-md">
    <q-item-section
      class="payment-item"
      :class="{ 'payment-item-negative': !payment.isActive }"
    >
      <div class="row items-start justify-between">
        <!-- left side -->
        <div>
          <div class="text-body2 text-weight-medium">
            {{ payment.description || "Pagamento" }}
          </div>
          <div class="text-caption text-grey-7">
            {{ payment.method }} • {{ payment.receiptNumber }}
          </div>
        </div>

        <!-- right side -->
        <div class="text-right">
          <div
            v-if="!payment.isActive"
            class="text-caption text-negative q-mb-xs"
          >
            Desativado
            <q-icon
              v-if="!payment.isActive"
              name="money_off"
              size="18px"
              class="q-ml-sm text-grey-6"
            />
          </div>

          <div class="text-body1 text-weight-bold">
            {{ formatCurrency(payment.amount) }}
          </div>
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

<style scoped>
.payment-item {
  padding: 8px 12px;
  border: 1px solid #b0b0b0;
  border-radius: 12px;
  background-color: #fefefe;
}

.payment-item:not(.payment-item-negative):hover {
  background-color: #dcdcdc;
  transition: 0.4s all;
}

.payment-item-negative {
  background-color: #f5f5f5;
  border-color: #e0e0e0;
  opacity: 0.7;
}
</style>
