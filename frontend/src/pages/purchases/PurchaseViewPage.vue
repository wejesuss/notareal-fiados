<template>
  <q-card v-if="loadState === 'loading'" class="q-mt-xl q-pa-md">
    <ContentState
      message="Carregando compra..."
      icon-name="find_in_page"
    ></ContentState>
  </q-card>

  <q-page v-else-if="purchase" padding>
    <!-- Header -->
    <div class="row items-start q-mt-sm q-mb-xl">
      <div class="col">
        <div class="text-h5 q-mb-sm">Visualizar Compra</div>
        <div class="text-caption text-grey-7">
          {{ formatDate(purchase.updatedAt) }} ·
          <span class="text-blue-7">{{ purchase.noteNumber }}</span>
        </div>
      </div>
    </div>

    <!-- Details card -->
    <q-card class="q-mb-lg">
      <!-- Happy Path -->
      <q-card-section class="row items-center q-gutter-md">
        <div class="text-subtitle1 text-grey-9">Detalhes da compra</div>
        <q-icon name="shopping_bag" size="md" color="grey-6"></q-icon>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="inset-card">
          <div class="text-blue-8">
            <div class="text-h6">
              {{ purchase.description }}
            </div>
          </div>

          <div
            class="row items-center justify-between q-mt-md q-mb-lg q-gutter-x-lg"
          >
            <div class="text-subtitle2 text-grey-8" v-if="clientName">
              Nome do cliente:
              <span class="text-subtitle1 text-weight-bold">
                {{ clientName }}
              </span>
            </div>

            <div class="text-subtitle2 text-grey-7">
              Número da Nota:
              <span class="text-subtitle1 text-weight-medium text-grey-6">
                {{ purchase.noteNumber }}
              </span>
            </div>
          </div>

          <div class="purchase-totals">
            <div class="row items-center justify-between text-grey-9">
              <div class="text-subtitle1">Total</div>
              <div class="text-h6 text-weight-bold text-blue-grey-7">
                {{ formatCurrency(purchase.totalValue) }}
              </div>
            </div>

            <div class="row items-center justify-between q-mt-md">
              <div class="text-subtitle1 text-grey-9">Pago</div>
              <div
                class="text-h6 text-weight-bold"
                :class="purchaseStatusUI.textColor"
              >
                {{ formatCurrency(purchase.totalPaidValue) }}
              </div>
            </div>
          </div>

          <div
            class="row items-center justify-between q-mt-lg text-grey-7 q-gutter-x-lg"
          >
            <div class="text-subtitle2">
              Criado Em:
              <span class="text-subtitle1 text-weight-bold">
                {{ formatDate(purchase.createdAt) }}
              </span>
            </div>

            <div class="text-subtitle2">
              Atualizado Em:
              <span class="text-subtitle1 text-weight-bold">
                {{ formatDate(purchase.updatedAt) }}
              </span>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row items-center purchase-status">
        <div class="col-6">
          <PurchaseStatusChip
            class="text-body2"
            :label="purchaseStatusUI.label"
            :color="purchaseStatusUI.color"
          ></PurchaseStatusChip>
        </div>
        <div class="col-6">
          <div>
            <q-toggle
              name="active-status"
              checked-icon="check"
              :color="purchaseActiveStatusUI.color"
              unchecked-icon="clear"
              :model-value="isActive"
              @update:model-value="submitDialog"
              :disable="submitting"
            >
              <PurchaseStatusChip
                style="margin-top: 4px"
                :label="purchaseActiveStatusUI.label"
                :color="purchaseActiveStatusUI.color"
                outline
              />
            </q-toggle>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Payments list -->
    <q-card>
      <q-card-section class="text-subtitle1">Pagamentos</q-card-section>

      <q-separator />

      <q-list>
        <q-item v-for="payment in payments" :key="payment.id" class="q-py-md">
          <q-item-section
            class="bordered"
            :class="{ 'bordered-negative': !payment.isActive }"
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
import { computed, ref, toRef, watch } from "vue";
import { useRoute } from "vue-router";
import { updatePurchase } from "src/services";
import type { PurchaseUpdate } from "src/models";
import {
  formatCurrency,
  formatDate,
  getPurchaseActiveStatusUI,
  getPurchaseStatusUI,
} from "src/utils/formatters";
import {
  useActiveToggleConfirmation,
  useClientDetails,
  usePurchaseDetails,
} from "src/composables";
import { PurchaseStatusChip } from "src/components/purchases";
import { ContentState } from "src/components/common";
import type {
  PurchaseActiveStatusUI,
  PurchaseStatusUI,
} from "src/components/types";

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
const clientName = ref(client.value?.name);
const purchaseStatusUI = computed<PurchaseStatusUI>(() => {
  if (!purchase.value) return { color: "", label: "", textColor: "" };

  return getPurchaseStatusUI(purchase.value?.status, { titleCase: true });
});
const purchaseActiveStatusUI = computed<PurchaseActiveStatusUI>(() => {
  if (!purchase.value) return { color: "", label: "", textColor: "" };

  return getPurchaseActiveStatusUI(purchase.value?.isActive);
});

watch(
  () => client.value,
  () => {
    if (clientLoading.value || clientError.value) return;

    clientName.value = client.value?.name;
  },
);

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
.inset-card {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 16px;

  max-width: var(--inset-card-width);
  margin: 0 auto;
}

.inset-card:active {
  background-color: #efefef;
  transition: 0.3s all;
}

.inset-card-inactive {
  border-color: var(--q-negative);
}

.purchase-totals {
  border-top: 1px solid #bbbbbb;
  border-bottom: 1px solid #bbbbbb;
  padding: 8px 4px;
}

.purchase-status {
  max-width: calc(var(--inset-card-width) - var(--purchase-status-offset));
  margin: 0 auto;
}

@media (max-width: 550px) {
  .purchase-status {
    max-width: 100%;
  }
}

.purchase-status .col-6:last-child {
  justify-items: end;
}

.bordered {
  padding: 8px 12px;
  border: 1px #26cf4d solid;
  border-radius: 6px;
}

.bordered-negative {
  border-color: var(--q-negative);
}
</style>
