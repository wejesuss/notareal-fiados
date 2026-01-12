<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl q-mt-sm">
      <div class="text-h5">Visualizar Cliente</div>
    </div>

    <!-- Content -->
    <q-card v-if="loading">Loading...</q-card>

    <ClientDetailsCard
      :client-id="id"
      @exception="clientNotFoundNotifyAndNavigate"
    ></ClientDetailsCard>

    <q-card class="q-my-lg">
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

    <q-card class="q-my-md q-py-sm">
      <q-card-section class="row justify-around q-gutter-sm">
        <q-btn
          outline
          rounded
          color="primary"
          icon="shopping_cart"
          label="Ver compras"
          @click="navigateTo(`/clients/${id}/purchases`)"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import type { ClientSummary } from "src/models";
import { getClientSummary } from "src/services";
import { useNavigation } from "src/composables/useNavigation";
import { formatCurrency } from "src/utils/formatters/currency";
import ClientDetailsCard from "src/components/ClientDetailsCard.vue";

const $route = useRoute();
const { navigateTo } = useNavigation();
const $q = useQuasar();

const summary = ref<ClientSummary | null>(null);
const loading = ref(true);

const id = computed(() => Number($route.params.id));

async function clientNotFoundNotifyAndNavigate() {
  $q.notify({ type: "negative", message: "Cliente não encontrado" });
  await navigateTo("/clients");
}

async function loadClient(id: number) {
  loading.value = true;

  if (!Number.isInteger(id) || id <= 0) {
    await clientNotFoundNotifyAndNavigate();
    return;
  }

  try {
    await loadClientSummary(id);
  } catch {
    await clientNotFoundNotifyAndNavigate();
  } finally {
    loading.value = false;
  }
}

async function loadClientSummary(clientId: number) {
  try {
    summary.value = await getClientSummary(clientId);
  } catch (e) {
    console.error(e);
    summary.value = null;
  }
}

watch(
  () => id.value,
  async (newId) => {
    await loadClient(newId);
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
