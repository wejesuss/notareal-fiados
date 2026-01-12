<template>
  <q-card v-if="loading" class="q-my-lg">Loading...</q-card>

  <q-card v-else class="q-my-lg">
    <q-card-section class="row items-center q-gutter-md">
      <div class="text-subtitle1 text-grey-9">Visão Geral</div>
      <q-icon name="segment" size="md" color="grey-6"></q-icon>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-lg">
      <q-item
        class="client-container-border q-py-md client-container"
        v-if="summary"
      >
        <q-item-section>
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
        </q-item-section>
      </q-item>

      <div
        v-else
        class="text-body2 text-center text-weight-medium text-grey-8 q-pa-md"
      >
        Resumo financeiro indisponível
        <q-icon
          name="cloud_off"
          size="md"
          color="grey-6"
          class="q-ml-sm"
        ></q-icon>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ClientSummary } from "src/models";
import { getClientSummary } from "src/services";
import { formatCurrency } from "src/utils/formatters/currency";

interface ClientSummaryCardProps {
  clientId: number;
}

const props = defineProps<ClientSummaryCardProps>();
const loading = ref(true);
const summary = ref<ClientSummary | null>(null);

async function loadSummary(id: number) {
  loading.value = true;

  try {
    summary.value = await getClientSummary(id);
  } catch (e) {
    console.error(e);
    summary.value = null;
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.clientId,
  async (newId) => {
    await loadSummary(newId);
  },
  { immediate: true }
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
