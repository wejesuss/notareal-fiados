<template>
  <q-card>
    <!-- Header / Status -->
    <q-card-section>
      <div class="text-subtitle1">Visão geral</div>
      <div class="q-mt-sm">
        <div class="row items-center q-gutter-sm">
          <q-icon :name="statusIcon" :color="statusColor" size="sm" />
          <span class="text-body2">
            {{ statusLabel }}
          </span>
        </div>

        <div class="text-caption text-grey-7 q-mt-xs">
          Última atualização: {{ lastUpdatedLabel }}
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <!-- Metrics -->
    <q-card-section>
      <div class="row q-col-gutter-md text-center">
        <div class="col">
          <div class="text-body2 text-grey-7 q-mb-xs">
            Clientes ativos
            <q-icon name="help_outline" size="xs" class="q-ml-xs">
              <q-tooltip class="text-caption">
                Total de clientes ativos no sistema
              </q-tooltip>
            </q-icon>
          </div>
          <div class="text-h6" :class="clientsColor">
            {{ props.activeClients }}
            <q-icon
              name="open_in_new"
              size="xs"
              class="cursor-pointer q-ml-sm"
              @click="navigateTo('/clients')"
            >
              <q-tooltip class="text-caption">Ver clientes ativos</q-tooltip>
            </q-icon>
          </div>
        </div>
        <div class="col">
          <div class="text-body2 text-grey-7 q-mb-xs">
            Compras em aberto
            <q-icon name="help_outline" size="xs" class="q-ml-xs">
              <q-tooltip class="text-caption">
                Compras que ainda não foram totalmente pagas
              </q-tooltip>
            </q-icon>
          </div>
          <div class="text-h6" :class="purchasesColor">
            {{ props.openPurchases }}
            <q-icon
              name="open_in_new"
              size="xs"
              class="cursor-pointer q-ml-sm"
              @click="navigateTo('/purchases?only_pending=true')"
            >
              <q-tooltip class="text-caption">Ver compras em aberto</q-tooltip>
            </q-icon>
          </div>
        </div>
        <div class="col">
          <div class="text-body2 text-grey-7 text-weight-bold q-mb-xs">
            R$ em aberto
            <q-icon name="help_outline" size="xs" class="q-ml-xs">
              <q-tooltip class="text-caption">
                Valor total considerando compras em aberto
              </q-tooltip>
            </q-icon>
          </div>
          <div class="text-h6" :class="amountColor">
            {{ openAmount }}
            <q-icon
              name="open_in_new"
              size="xs"
              class="cursor-pointer q-ml-sm"
              @click="navigateTo('/purchases?only_pending=true')"
            >
              <q-tooltip class="text-caption">Ver compras em aberto</q-tooltip>
            </q-icon>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

interface Props {
  /**
   * If system status is up or down
   */
  isHealthy: boolean;
  /**
   * string representing the last update time
   */
  lastUpdated?: string | null;
  /**
   * Number of `clients` currently active
   */
  activeClients: number;
  /**
   * Number of `purchases` not entirely paid (`pending` or `partial`)
   */
  openPurchases: number;
  /**
   * Total amount to receive considering not paid `purchases`
   */
  openAmount: number;
}

const props = defineProps<Props>();
const router = useRouter();

// methods
async function navigateTo(path: string) {
  await router.push({ path });
}

// header
const statusLabel = computed(() =>
  props.isHealthy ? "Sistema ativo" : "Sistema com problemas"
);
const statusColor = computed(() => (props.isHealthy ? "positive" : "negative"));
const statusIcon = computed(() => (props.isHealthy ? "check_circle" : "error"));

const lastUpdatedLabel = computed(() => props.lastUpdated ?? "—");

// metrics
const openAmount = computed(() => {
  const amount = props.openAmount;
  if (typeof amount === "number") {
    return Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  return amount;
});

const clientsColor = computed(() => {
  if (props.activeClients === 0) return "text-grey";
  return "text-primary";
});
const purchasesColor = computed(() => {
  if (props.openPurchases === 0) return "text-positive";
  if (props.openPurchases <= 20) return "text-yellow-10";
  return "text-negative";
});
const amountColor = computed(() => {
  if (props.openAmount < 1000) return "text-positive";
  if (props.openAmount < 5000) return "text-yellow-10";
  return "text-negative";
});
</script>
