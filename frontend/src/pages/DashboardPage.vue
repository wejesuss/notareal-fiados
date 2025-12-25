<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Painel</div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-4">
        <system-overview-card
          :is-healthy="systemHealthy"
          :last-updated="lastUpdated"
          :active-clients="activeClients"
          :open-purchases="openPurchases"
          :open-amount="openAmount"
        />
      </div>

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-subtitle1">Registros</div>
          </q-card-section>

          <q-card-section>
            <div v-for="(card, index) in registryCards" :key="card.id">
              <RegistryCard v-bind="card"></RegistryCard>
              <q-separator
                v-if="index < registryCards.length - 1"
                spaced="14px"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <ActionsCard></ActionsCard>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SystemOverviewCard from "src/components/SystemOverviewCard.vue";
import RegistryCard from "src/components/RegistryCard.vue";
import ActionsCard from "src/components/ActionsCard.vue";
import type { RegistryCardProps } from "src/components/models";

const registryCards = computed<RegistryCardProps[]>(() => [
  {
    id: "clients",
    title: "Últimos clientes",
    subtitle: "+3 esse mês",
    nameColor: "text-primary",
    valueColor: "text-primary",
    route: "/clients",
    actionLabel: "Ver todos",
    recentRegistries: [
      {
        id: 1,
        name: "João Silva",
        value: "Há 2h",
      },
      {
        id: 2,
        name: "Maria Costa",
        value: "Ontem",
      },
    ],
  },
  {
    id: "purchases",
    title: "Últimas compras",
    subtitle: amountFormatted.value + " em aberto",
    nameColor: "text-primary",
    valueColor: openPurchases.value === 0 ? "text-positive" : "text-grey-7",
    route: "/purchases",
    actionLabel: "Ver compras",
    recentRegistries: [
      {
        id: 1,
        name: "Maria Costa",
        value: "R$ 200",
        valueComplement: "pendente",
      },
      {
        id: 2,
        name: "João Silva",
        value: "R$ 80",
        valueComplement: "parcial",
      },
    ],
  },
  {
    id: "balance",
    title: "Últimos pagamentos",
    subtitle: "4 clientes pendentes",
    nameColor: "text-primary",
    valueColor: "text-negative",
    route: "/payments",
    actionLabel: "Ver pagamentos",
    icon: "horizontal_rule",
    iconColor: "red",
    recentRegistries: [
      {
        id: 1,
        name: "Maria Costa",
        value: "R$ 50",
        valueComplement: "hoje",
      },
      {
        id: 2,
        name: "Maria Costa",
        value: "R$ 20",
      },
    ],
  },
]);

const systemHealthy = true;
const lastUpdated = "há poucos segundos";
const activeClients = 50;
const openPurchases = computed(() => 30);
const openAmount = 2367.9;
const amountFormatted = computed(() => {
  return Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(openAmount);
});
</script>
