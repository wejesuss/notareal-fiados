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

  <q-card v-else-if="loadState === 'empty'" class="q-my-xl q-pa-md">
    <ContentState
      message="Nenhum pagamento registrado ainda..."
      icon-name="receipt_long"
    ></ContentState>
    <div class="text-center q-mt-md">
      <q-btn
        flat
        color="primary"
        icon="wallet"
        label="Novo Pagamento"
        class="full-width"
        @click="emit('create-payment')"
      />
    </div>
  </q-card>

  <q-card v-else class="q-mb-lg q-pa-xs">
    <q-card-section class="row items-center justify-between q-gutter-y-sm">
      <div class="text-subtitle1">
        <span>Pagamentos</span>
        <span class="q-ml-sm"
          >| Ativos: {{ paymentsStatusCount.active }} | Inativos:
          {{ paymentsStatusCount.inactive }}</span
        >
      </div>

      <q-btn
        color="primary"
        icon="wallet"
        label="Novo Pagamento"
        @click="emit('create-payment')"
      />
    </q-card-section>

    <q-separator />

    <q-list>
      <PaymentRow
        v-for="payment in payments"
        :key="payment.id"
        :payment="payment"
        @click="handleRowClick"
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
const emit = defineEmits<{
  (e: "create-payment"): void;
  (e: "edit-payment", data: { purchaseId: number; id: number }): void;
}>();

const loadState = computed(() => {
  if (props.loading) return "loading";
  if (props.error) return "error";
  if (props.payments.length === 0) return "empty";

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

function handleRowClick(data: { purchaseId: number; id: number }) {
  emit("edit-payment", data);
}
</script>
