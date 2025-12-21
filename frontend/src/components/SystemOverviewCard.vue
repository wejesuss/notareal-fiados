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

        <div class="text-caption text-grey q-mt-xs">
          Última atualização: {{ lastUpdatedLabel }}
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <!-- Metrics -->
    <q-card-section>
      <div class="row q-col-gutter-md text-center">
        <div class="col">
          <div class="text-caption text-grey">Clientes ativos</div>
          <div class="text-h6 text-primary">
            {{ props.activeClients }}
          </div>
        </div>
        <div class="col">
          <div class="text-caption text-grey">Compras em aberto</div>
          <div class="text-h6 text-yellow-10">
            {{ props.openPurchases }}
          </div>
        </div>
        <div class="col">
          <div class="text-caption text-grey">R$ em aberto</div>
          <div class="text-h6 text-negative">
            {{ openAmount }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

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
</script>
