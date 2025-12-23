<template>
    <q-page padding>
        <div class="text-h5 q-mb-md">
            Painel
        </div>

        <div class="row q-col-gutter-md">
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
            <div v-for="(card, index) in registryCards" :key="card.key">
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
                <q-card>
                    <q-card-section>
                        <div class="text-subtitle1">Ações</div>
                        <div class="text-caption text-grey">
                            Atalhos rápidos
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import SystemOverviewCard from "src/components/SystemOverviewCard.vue";
import RegistryCard from "src/components/RegistryCard.vue";
import { computed } from "vue";

const registryCards = computed(() => [
  {
    key: "clients",
    title: "Últimos clientes",
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
    subtitle: "+3 esse mês",
    valueColor: "text-primary",
    route: "/clients",
    actionLabel: "Ver todos",
  },
  {
    key: "purchases",
    title: "Últimas compras",
    recentRegistries: [
      {
        id: 1,
        name: "Maria Costa",
        value: "R$ 200 - pendente",
      },
      {
        id: 2,
        name: "João Silva",
        value: "R$ 80 - parcial",
      },
    ],
    subtitle: amountFormatted.value + " em aberto",
    valueColor: openPurchases.value === 0 ? "text-positive" : "text-grey-7",
    route: "/purchases",
    actionLabel: "Ver compras",
  },
  {
    key: "balance",
    title: "Últimos pagamentos",
    recentRegistries: [
      {
        id: 1,
        name: "Maria Costa",
        value: "R$ 50 - hoje",
      },
    ],
    subtitle: "4 clientes pendentes",
    valueColor: "text-negative",
    route: "/payments",
    actionLabel: "Ver pagamentos",
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
