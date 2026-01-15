<template>
  <q-card v-if="loading" class="q-my-lg">Loading...</q-card>

  <q-card v-else class="q-my-lg">
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

    <q-separator inset></q-separator>

    <!-- Recent purchases -->
    <q-card-section class="q-pa-lg">
      <div>
        <RegistryCard
          class="client-container-border client-container"
          v-bind="clientPurchases"
          actions-align="around"
        >
          <template #actions>
            <q-btn
              flat
              padding="4px md"
              class="q-mb-xs"
              color="primary"
              @click="navigateTo(clientPurchases.route)"
            >
              <q-icon name="shopping_cart" size="18px" class="q-mr-sm"></q-icon>
              <span class="text-body2 text-weight-medium">Ver compras</span>
            </q-btn>
            <q-btn
              flat
              padding="4px md"
              color="primary"
              @click="navigateTo(newPurchaseRoute)"
            >
              <q-icon
                name="add_shopping_cart"
                size="18px"
                class="q-mr-sm"
              ></q-icon>
              <span class="text-body2 text-weight-medium">Nova compra</span>
            </q-btn>
          </template>
        </RegistryCard>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { ClientSummary } from "src/models";
import { getClientSummary } from "src/services";
import { formatCurrency } from "src/utils/formatters/currency";
import RegistryCard from "./RegistryCard.vue";
import type { RegistryCardProps } from "./models";
import { useNavigation } from "src/composables/useNavigation";

interface ClientSummaryCardProps {
  clientId: number;
}

const { navigateTo } = useNavigation();

const props = defineProps<ClientSummaryCardProps>();
const loading = ref(true);
const summary = ref<ClientSummary | null>(null);

const newPurchaseRoute = computed(
  () => `/clients/${props.clientId}/purchases/new`
);
const clientPurchases: RegistryCardProps = {
  id: "purchases",
  title: "Últimas compras",
  titleVariant: "emphasis",
  subtitle: "Últimas 3 compras",
  nameColor: "text-blue-8",
  valueColor: "text-amber-10",
  route: `/clients/${props.clientId}/purchases`,
  actionLabel: "Ver compras",
  recentRegistries: [
    {
      id: 1,
      name: "Compra de produtos agrícolas e vitaminas",
      value: formatCurrency(350),
      valueComplement: "parcial",
    },
    {
      id: 2,
      name: "Compra de sementes",
      value: formatCurrency(49.9),
      valueComplement: "pago",
      valueColor: "text-secondary",
    },
  ],
};

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
