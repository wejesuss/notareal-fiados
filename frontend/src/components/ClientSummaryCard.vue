<template>
  <q-card v-if="loadState === 'loading'" class="q-my-lg q-pa-md">
    <ContentState
      message="Carregando Resumo..."
      icon-name="manage_search"
    ></ContentState>
  </q-card>

  <q-card v-else-if="loadState === 'error'" class="q-my-lg q-pa-md">
    <ContentState
      :message="errorMessage"
      message-color="text-amber-8"
      icon-name="error_outline"
      icon-color="amber-10"
    ></ContentState>
  </q-card>

  <q-card v-else-if="loadState === 'empty'" class="q-my-lg q-pa-md">
    <ContentState message="Resumo financeiro indisponível"></ContentState>
  </q-card>

  <q-card v-else class="q-my-lg">
    <!-- Happy Path -->
    <q-card-section class="row items-center q-gutter-md">
      <div class="text-subtitle1 text-grey-9">Visão Geral</div>
      <q-icon name="segment" size="md" color="grey-6"></q-icon>
    </q-card-section>

    <q-separator />

    <!-- Financial summary -->
    <q-card-section class="q-pa-lg">
      <div
        class="client-container-border q-pa-md client-container"
        v-if="summary"
      >
        <div>
          <q-item-label class="text-h6 text-weight-medium letter-spaced">
            Resumo financeiro
          </q-item-label>

          <q-item-label
            class="text-caption letter-spaced secondary-label text-weight-medium"
          >
            <span>Total de compras: </span>
            <span class="text-blue-10 client-summary-value">
              {{ summary.totalPurchases }} compras
            </span>
          </q-item-label>

          <q-item-label
            class="text-caption text-weight-medium letter-spaced secondary-label"
          >
            <span>Total Pago: </span>
            <span class="text-blue-10 client-summary-value">{{
              formatCurrency(summary.totalPaid)
            }}</span>
          </q-item-label>

          <q-item-label
            class="text-caption text-weight-medium letter-spaced secondary-label"
          >
            <span>Saldo em aberto: </span>
            <span class="text-blue-10 client-summary-value">
              {{ formatCurrency(summary.outstandingBalance) }}
            </span>
          </q-item-label>
        </div>
      </div>
    </q-card-section>

    <q-separator inset></q-separator>

    <!-- Recent purchases -->
    <q-card-section class="q-pa-lg">
      <ClientRecentPurchases
        :purchases-route="purchasesRoute"
        :new-purchase-route="newPurchaseRoute"
      ></ClientRecentPurchases>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import { formatCurrency } from "src/utils/formatters/currency";
import { useClientSummary } from "src/composables/useClientSummary";
import ContentState from "./ContentState.vue";
import ClientRecentPurchases from "./ClientRecentPurchases.vue";

interface ClientSummaryCardProps {
  clientId: number;
}
type LoadState = "loading" | "error" | "empty" | "ready";

const props = defineProps<ClientSummaryCardProps>();

const { loading, error, summary } = useClientSummary(toRef(props, "clientId"));

const loadState = computed<LoadState>(() => {
  if (loading.value) return "loading";
  if (error.value) return "error";
  if (!summary.value) return "empty";

  return "ready";
});
const errorMessage = computed(() => {
  return error.value?.message || "Erro inesperado ao carregar resumo!";
});

const purchasesRoute = computed(() => `/clients/${props.clientId}/purchases`);
const newPurchaseRoute = computed(
  () => `/clients/${props.clientId}/purchases/new`,
);
</script>

<style scoped>
.secondary-label {
  margin-top: 20px;
}

.secondary-label + .secondary-label {
  margin-top: 16px;
}

.client-summary-value {
  font-size: 0.85rem;
}
</style>
