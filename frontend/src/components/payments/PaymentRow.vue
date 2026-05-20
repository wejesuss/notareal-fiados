<template>
  <div class="q-pa-sm">
    <q-item
      class="payment-item"
      clickable
      @click="() => emit('click', payment.id)"
      :class="{ 'payment-item-negative': !payment.isActive }"
    >
      <q-item-section>
        <div class="payment-grid">
          <!-- left side -->
          <div class="column justify-center q-col-gutter-y-xs">
            <div class="payment-description text-body1 text-weight-medium">
              <span>
                {{ payment.description || "Pagamento" }}
              </span>

              <q-tooltip
                v-if="payment.description"
                :hide-delay="1000"
                :delay="200"
                class="tooltip-medium"
              >
                {{ payment.description }}
              </q-tooltip>
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
                  ? 'amount-active'
                  : 'text-grey-6 text-weight-medium'
              "
            >
              {{ formatCurrency(payment.amount) }}
            </div>

            <div
              v-if="!payment.isActive"
              class="row items-center text-caption text-grey-6 q-mt-xs"
            >
              <span>Desativado</span>
              <q-icon name="money_off" size="14px" class="text-grey-5" />
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
const emit = defineEmits<{
  (e: "click", id: number): void;
}>();

const paymentDate = formatDate(
  props.payment.paymentDate,
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
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: white;
  transition: all 0.3s ease;

  max-width: 720px;
  margin: 0 auto;
}

.payment-item:active {
  background: #f2f2f2;
}

.payment-item-negative {
  background-color: #f7f7f7;
  border-color: #e5e5e5;
}

.payment-item-negative .payment-description {
  opacity: 0.72;
}

.payment-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
}

.payment-description {
  max-width: 100%;
  width: max-content;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.amount-active {
  color: #6f8518;
  font-weight: bold;
}
</style>
