<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-start q-mt-sm q-mb-xl">
      <div class="col">
        <div class="text-h5 q-mb-sm">Visualizar Compra</div>
        <div class="text-caption text-grey-7" v-if="purchase">
          {{ formatDate(purchase.updatedAt) }} ·
          <span class="text-blue-7">{{ purchase.noteNumber }}</span>
        </div>
      </div>
    </div>

    <q-card v-if="loadState === 'loading'" class="q-mb-xl q-pa-md">
      <ContentState
        message="Carregando compra..."
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

    <!-- Details card -->
    <PurchaseDetailsCard
      v-else-if="purchase"
      :purchase="purchase"
      :is-active="isActive"
      :submitting="submitting"
      :client-name="clientName"
      @toggle-is-active="handleToggle"
    />

    <!-- Payments list -->
    <q-card>
      <q-card-section class="text-subtitle1">Pagamentos</q-card-section>

      <q-separator />

      <q-list>
        <q-item v-for="payment in payments" :key="payment.id" class="q-py-md">
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
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import { useRoute } from "vue-router";
import { updatePurchase } from "src/services";
import type { PurchaseUpdate } from "src/models";
import { formatCurrency, formatDate } from "src/utils/formatters";
import {
  useActiveToggleConfirmation,
  useClientDetails,
  usePurchaseDetails,
} from "src/composables";
import { PurchaseDetailsCard } from "src/components/purchases";
import { ContentState } from "src/components/common";

interface Payment {
  id: number;
  purchaseId: number;
  description: string | null;
  amount: number;
  paymentDate: Date | string | null;
  method: string;
  receiptNumber: string; // REC-0001
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const dialogConfig = {
  title: "Tem certeza que deseja desativar esta compra?",
  message:
    "Esta compra não poderá receber novas operações e todos os pagamentos desta compra serão desativados.",
  checkboxLabel: "Entendo e desejo desativar a compra",
};
const notifyConfig = {
  disabledMessage: "Compra desativada com sucesso.",
  enabledMessage: "Compra ativada. Pagamentos não serão ativados.",
  errorMessage: "Erro ao atualizar status da compra.",
};

const $route = useRoute();
const purchaseId = computed(() => Number($route.params.id));
const clientId = computed(() => purchase.value?.clientId || 0);
const { loading, error, purchase } = usePurchaseDetails(toRef(purchaseId));
const {
  loading: clientLoading,
  error: clientError,
  client,
} = useClientDetails(toRef(clientId));
const { submitting, isActive, submitDialog } = useActiveToggleConfirmation(
  toRef(purchase),
  dialogConfig,
  notifyConfig,
  submit,
);

const loadState = computed(() => {
  if (loading.value) return "loading";
  if (error.value || !purchase.value) return "error";

  return "ready";
});
const clientName = computed(() => {
  if (clientLoading.value || clientError.value) return undefined;

  return client.value?.name;
});
const errorMessage = computed(
  () => error.value?.message || "Erro inesperado ao carregar compra",
);

async function handleToggle(nextValue: boolean) {
  await submitDialog(nextValue);
}

async function submit(nextValue: boolean) {
  if (!purchase.value) return;

  const payload: PurchaseUpdate = {
    ...purchase.value,
    isActive: nextValue,
  };

  const updated = await updatePurchase(purchaseId.value, payload);

  // Keep local purchase snapshot in sync after successful update
  purchase.value = updated;
}

const payments: Payment[] = [
  {
    id: 1,
    purchaseId: purchase.value?.id || 2,
    description: "Pagamento adiantado",
    amount: 50,
    paymentDate: "2026-02-03T19:36:37.000Z",
    method: "Pix",
    receiptNumber: "REC-002-001",
    isActive: true,
    createdAt: "2026-02-03T19:36:37.000Z",
    updatedAt: "2026-02-03T19:36:37.000Z",
  },
];
</script>

<style scoped>
.payment-item {
  padding: 8px 12px;
  border: 1px #26cf4d solid;
  border-radius: 6px;
}

.payment-item-negative {
  border-color: var(--q-negative);
}
</style>
