<template>
  <q-card v-if="loadState === 'loading'" class="q-mb-xl q-pa-md">
    <ContentState
      message="Carregando pagamentos..."
      icon-name="find_in_page"
    ></ContentState>
  </q-card>

  <q-card v-else-if="loadState === 'error'" class="q-my-xl q-pa-md">
    <ContentState
      :message="errorMessage"
      message-color="text-amber-8"
      icon-name="error_outline"
      icon-color="amber-10"
    ></ContentState>
  </q-card>

  <q-card v-else class="q-mb-lg q-pa-xs">
    <q-card-section class="text-subtitle1">
      <span>Pagamentos</span>
      <span class="q-ml-sm"
        >| Ativos: {{ paymentsStatusCount.active }} | Inativos:
        {{ paymentsStatusCount.inactive }}</span
      >
    </q-card-section>

    <q-separator />

    <q-list>
      <PaymentRow
        v-for="payment in payments"
        :key="payment.id"
        :payment="payment"
      ></PaymentRow>
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type UIError } from "src/types/errors";
import { type Payment } from "src/models";
import { ContentState } from "src/components/common";
import { PaymentRow } from "src/components/payments";

const props = defineProps<{
  loading: boolean;
  error: UIError | null;
  payments: Payment[];
}>();

const loadState = computed(() => {
  if (props.loading) return "loading";
  if (props.error) return "error";

  return "ready";
});
const errorMessage = computed(
  () => props.error?.message || "Erro inesperado ao carregar pagamentos",
);
const paymentsStatusCount = computed(() => {
  return props.payments.reduce(
    (count, p) => {
      if (p.isActive) {
        count.active++;
      } else {
        count.inactive++;
      }

      return count;
    },
    { active: 0, inactive: 0 },
  );
});
</script>
