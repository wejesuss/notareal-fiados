<template>
  <q-page padding class="purchase-details">
    <!-- Header -->
    <div class="row items-start q-mt-sm q-mb-lg">
      <div class="col">
        <div class="text-h5 q-mb-sm">Visualizar Compra</div>
        <div class="text-caption text-grey-7 text-center">
          {{ formatDate(new Date().toISOString()) }} · {{ "NF-002-001" }}
        </div>
      </div>

      <q-btn flat round icon="more_vert" aria-label="Actions">
        <q-menu>
          <q-list dense>
            <q-item clickable>
              <q-item-section>Duplicar</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section class="text-negative">Excluir</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <!-- Summary card -->
    <q-card class="q-mb-lg">
      <q-card-section class="row items-center justify-between">
        <div class="text-subtitle1">Total</div>
        <div class="text-h6 text-weight-bold">{{ formatCurrency(350) }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row purchase-status">
        <div class="col-6">
          <PurchaseStatusChip
            class="q-mt-xs"
            :label="getPurchaseActiveStatusUI(true).label"
            :color="getPurchaseActiveStatusUI(true).color"
            outline
          />
        </div>
        <div class="col-6 purchase-status-end">
          <PurchaseStatusChip
            class="text-body2"
            :label="getPurchaseStatusUI('paid', { titleCase: true }).label"
            :color="getPurchaseStatusUI('paid').color"
          ></PurchaseStatusChip>
        </div>
      </q-card-section>
    </q-card>

    <!-- Payments list -->
    <q-card>
      <q-card-section class="text-subtitle1">Pagamentos</q-card-section>

      <q-separator />

      <q-list>
        <q-item v-for="payment in payments" :key="payment.id" class="q-py-sm">
          <q-item-section>
            <div class="row items-start justify-between">
              <div class="row q-gutter-md">
                <div class="text-body2">{{ payment.description }}</div>
                <div class="text-caption text-grey-7">
                  {{ formatCurrency(payment.amount) }}
                </div>
              </div>
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
import {
  formatCurrency,
  formatDate,
  getPurchaseActiveStatusUI,
  getPurchaseStatusUI,
} from "src/utils/formatters";
import { PurchaseStatusChip } from "src/components/purchases";

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

const payments: Payment[] = [
  {
    id: 1,
    purchaseId: 2,
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
.purchase-details {
  max-width: 720px;
  margin: 0 auto;
}

.purchase-status {
  max-width: 500px;
  margin: 0 auto;
}

.purchase-status-end {
  justify-items: end;
}
</style>
