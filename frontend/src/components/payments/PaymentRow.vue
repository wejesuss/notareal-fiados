<template>
  <div class="q-pa-sm">
    <q-item
      class="payment-item"
      clickable
      :class="{ 'payment-item-negative': !payment.isActive }"
    >
      <q-item-section>
        <div class="row items-start justify-between">
          <!-- left side -->
          <div class="column justify-center">
            <div class="text-body1 text-weight-medium">
              {{ payment.description || "Pagamento" }}
            </div>

            <div class="text-caption text-grey-7 row items-center q-gutter-xs">
              <span v-if="payment.method">{{ payment.method }}</span>
              <span v-if="payment.method">•</span>
              <span>{{ payment.receiptNumber }}</span>

              <span v-if="payment.paymentDate">•</span>
              <span v-if="payment.paymentDate">{{ paymentDate }}</span>
            </div>
          </div>

          <!-- right side -->
          <div class="text-right column items-end justify-center">
            <div
              class="text-body1"
              :class="
                payment.isActive
                  ? 'amount-color text-weight-bold'
                  : 'text-grey-7 text-weight-medium'
              "
            >
              {{ formatCurrency(payment.amount) }}
            </div>

            <div
              v-if="!payment.isActive"
              class="row items-center q-gutter-xs text-caption text-grey-7 q-mt-xs"
            >
              <span>Desativado</span>
              <!-- inline status -->
              <q-icon
                v-if="!payment.isActive"
                name="money_off"
                size="16px"
                class="text-grey-5"
              />
            </div>
          </div>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup lang="ts">
import { type Payment } from "src/models";
import { formatCurrency, formatDate } from "src/utils/formatters";

const props = defineProps<{
  payment: Payment;
}>();

const paymentDate = formatDate(
  props.payment.paymentDate || "",
  undefined,
  undefined,
  {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short",
  },
);
</script>

<style scoped>
.payment-item {
  padding: 12px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: white;
  transition: all 0.3s ease;
}

.payment-item:active {
  background: #f0f0f0;
}

.payment-item-negative {
  background-color: #f5f5f5;
  border-color: #e5e5e5;
  opacity: 0.9;
}

.amount-color {
  color: #6f8518;
}
</style>
