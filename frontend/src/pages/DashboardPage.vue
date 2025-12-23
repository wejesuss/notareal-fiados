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
            <div class="row q-col-gutter-md">
              <div
                class="col-12 col-md-4"
                v-for="card in registryCards"
                :key="card.key"
              >
                <RegistryCard v-bind="card"></RegistryCard>
              </div>
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
    title: "Clientes",
    value: activeClients,
    subtitle: "+3 esse mês",
    valueColor: "text-primary",
    route: "/clients",
    actionLabel: "Ver",
  },
  {
    key: "purchases",
    title: "Compras em aberto",
    value: openPurchases.value,
    subtitle: amountFormatted + " em aberto",
    valueColor: openPurchases.value === 0 ? "text-positive" : "text-negative",
    route: "/purchases?only_pending=true",
    actionLabel: "Ver",
  },
  {
    key: "balance",
    title: "Montante em aberto",
    value: amountFormatted,
    subtitle: "4 clientes pendentes",
    valueColor: "text-negative",
    route: "/payments",
    actionLabel: "Novo pagamento",
  },
]);

const systemHealthy = true;
const lastUpdated = "há poucos segundos";
const activeClients = 50;
const openPurchases = computed(() => 30);
const openAmount = 2367.9;
const amountFormatted = Intl.NumberFormat("pt-br", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
}).format(openAmount);
</script>
