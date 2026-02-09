<template>
  <q-card v-if="loadState === 'loading'" class="q-mt-xl q-pa-md">
    <ContentState
      message="Carregando compra..."
      icon-name="find_in_page"
    ></ContentState>
  </q-card>

  <q-page v-else-if="purchase" padding class="purchase-details">
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
          <div class="text-orange-14">
            <div class="text-h6 text-weight-bold">
              {{ purchase.description }}
            </div>
          </div>

          <div
            class="row items-center justify-between q-mt-md q-mb-lg text-grey-8"
          >
            <div class="text-subtitle2">Número da Nota:</div>
            <div class="text-subtitle1 text-weight-bold">
              {{ purchase.noteNumber }}
            </div>
          </div>

          <div class="row items-center justify-between text-blue-8">
            <div class="text-subtitle2">Total</div>
            <div class="text-h6 text-weight-bold">
              {{ formatCurrency(purchase.totalValue) }}
            </div>
          </div>

          <div class="row items-center justify-between q-mt-md text-orange-10">
            <div class="text-subtitle2">Pago</div>
            <div class="text-h6 text-weight-bold">
              {{ formatCurrency(purchase.totalPaidValue) }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row purchase-status">
        <div class="col-6">
          <PurchaseStatusChip
            class="q-mt-xs"
            :label="getPurchaseActiveStatusUI(purchase.isActive).label"
            :color="getPurchaseActiveStatusUI(purchase.isActive).color"
            outline
          />
        </div>
        <div class="col-6 purchase-status-end">
          <PurchaseStatusChip
            class="text-body2"
            :label="
              getPurchaseStatusUI(purchase.status, { titleCase: true }).label
            "
            :color="getPurchaseStatusUI(purchase.status).color"
          ></PurchaseStatusChip>
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
import { computed, toRef } from "vue";
import { useRoute } from "vue-router";
import {
  formatCurrency,
  formatDate,
  getPurchaseActiveStatusUI,
  getPurchaseStatusUI,
} from "src/utils/formatters";
import { usePurchaseDetails } from "src/composables";
import { PurchaseStatusChip } from "src/components/purchases";
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

const $route = useRoute();
const purchaseId = computed(() => Number($route.params.id));
const { loading, error, purchase } = usePurchaseDetails(toRef(purchaseId));

const loadState = computed(() => {
  if (loading.value) return "loading";
  if (error.value || !purchase.value) return "error";

  return "ready";
});

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
@media screen and (min-width: 720px) {
  .purchase-details {
    max-width: 800px;
    margin: 0 auto;
  }
}

.inset-card {
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 16px;
}

.inset-card:active {
  background-color: #f0f0f0;
  transition: 0.3s all;
}

.inset-card-inactive {
  border-color: var(--q-negative);
  background-color: #f5f5f5;
}

.purchase-status {
  max-width: 500px;
  margin: 0 auto;
}

.purchase-status *:last-child {
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
