<template>
  <div v-if="loadState === 'loading'" class="q-my-md q-pa-sm">
    <ContentState
      message="Carregando últimas compras..."
      icon-name="shopping_bag"
      icon-color="blue-grey-6"
    ></ContentState>
  </div>

  <div v-else-if="loadState === 'error'" class="q-my-md q-pa-sm">
    <ContentState
      :message="errorMessage"
      message-color="text-amber-8"
      icon-name="error_outline"
      icon-color="amber-10"
    ></ContentState>
  </div>

  <div v-else-if="loadState === 'empty'" class="q-my-md q-pa-sm">
    <ContentState
      message="Nenhuma compra encontrada..."
      icon-name="no_backpack"
    ></ContentState>
    <div class="text-center q-mt-md">
      <q-btn
        flat
        padding="12px md"
        color="primary"
        @click="navigateTo(newPurchaseRoute)"
        class="full-width"
      >
        <q-icon name="add_shopping_cart" size="20px" class="q-mr-sm"></q-icon>
        <span class="text-body2 text-weight-medium">Nova compra</span>
      </q-btn>
    </div>
  </div>

  <div v-else>
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
          <q-icon name="add_shopping_cart" size="18px" class="q-mr-sm"></q-icon>
          <span class="text-body2 text-weight-medium">Nova compra</span>
        </q-btn>
      </template>
    </RegistryCard>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import type { RecentRegistry, RegistryCardProps } from "./models";
import { formatCurrency } from "src/utils/formatters/currency";
import { getPurchaseStatusUI } from "src/utils/formatters/purchaseStatus";
import { useNavigation, useClientRecentPurchases } from "src/composables";
import RegistryCard from "./RegistryCard.vue";
import ContentState from "./ContentState.vue";

interface ClientRecentPurchasesProps {
  clientId: number;
}

const fetchLimit = 3;
const props = defineProps<ClientRecentPurchasesProps>();
const { navigateTo } = useNavigation();
const { loading, error, recentPurchases } = useClientRecentPurchases(
  toRef(props, "clientId"),
  fetchLimit,
);

type LoadState = "loading" | "error" | "empty" | "ready";
const loadState = computed<LoadState>(() => {
  if (loading.value) return "loading";
  if (error.value) return "error";
  if (recentPurchases.value.length === 0) return "empty";

  return "ready";
});
const errorMessage = computed(() => {
  return error.value?.message || "Erro inesperado ao listar compras!";
});
const purchasesRoute = computed(() => `/clients/${props.clientId}/purchases`);
const newPurchaseRoute = computed(
  () => `/clients/${props.clientId}/purchases/new`,
);

const recentRegistries = computed<RecentRegistry[]>(() =>
  recentPurchases.value.map((p) => {
    const paid = p.status === "paid";
    const { label, color } = getPurchaseStatusUI(p.status);

    return {
      id: p.id,
      name: p.description,
      value: formatCurrency(p.totalValue),
      valueComplement: label,
      ...(paid && {
        iconColor: color,
        valueColor: `text-${color}`,
      }),
    };
  }),
);

const clientPurchases = computed<RegistryCardProps>(() => ({
  id: "purchases",
  title: "Últimas compras",
  titleVariant: "emphasis",
  subtitle:
    recentPurchases.value.length === 0 ? "" : `Últimas ${fetchLimit} compras`,
  nameColor: "text-blue-8",
  valueColor: "text-amber-10",
  route: purchasesRoute.value,
  actionLabel: "Ver compras",
  recentRegistries: recentRegistries.value,
}));
</script>
