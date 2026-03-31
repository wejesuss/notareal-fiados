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
      @toggle-is-active="submitDialog"
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
import { computed, ref, toRef, watch } from "vue";
import { useRoute } from "vue-router";
import { getPurchasePayments, updatePurchaseActiveStatus } from "src/services";
import type { Payment } from "src/models";
import { formatCurrency, formatDate } from "src/utils/formatters";
import {
  useActiveToggleConfirmation,
  useClientDetails,
  usePurchaseDetails,
} from "src/composables";
import { PurchaseDetailsCard } from "src/components/purchases";
import { ContentState } from "src/components/common";
import { dialogConfig, notifyConfig } from "src/config/purchases/dialogs";

const $route = useRoute();
const purchaseId = computed(() => Number($route.params.id));
const { loading, error, purchase } = usePurchaseDetails(toRef(purchaseId));
const clientId = computed(() => purchase.value?.clientId || 0);
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
const payments = ref<Payment[]>([]);
watch(
  purchaseId,
  async (newPurchaseId) => {
    payments.value = await getPurchasePayments(newPurchaseId);
  },
  { immediate: true },
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

async function submit(nextValue: boolean) {
  if (!purchase.value) return;

  const response = await updatePurchaseActiveStatus(
    purchaseId.value,
    nextValue,
  );

  // Keep local purchase snapshot in sync after successful update
  purchase.value = response.purchase;
}
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
