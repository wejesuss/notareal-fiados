<template>
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
          <q-icon name="add_shopping_cart" size="18px" class="q-mr-sm"></q-icon>
          <span class="text-body2 text-weight-medium">Nova compra</span>
        </q-btn>
      </template>
    </RegistryCard>
  </div>
</template>

<script setup lang="ts">
import type { RegistryCardProps } from "./models";
import { formatCurrency } from "src/utils/formatters/currency";
import { useNavigation } from "src/composables/useNavigation";
import RegistryCard from "./RegistryCard.vue";

interface ClientRecentPurchasesProps {
  newPurchaseRoute: string;
  purchasesRoute: string;
}

const props = defineProps<ClientRecentPurchasesProps>();
const { navigateTo } = useNavigation();

const clientPurchases: RegistryCardProps = {
  id: "purchases",
  title: "Últimas compras",
  titleVariant: "emphasis",
  subtitle: "Últimas 3 compras",
  nameColor: "text-blue-8",
  valueColor: "text-amber-10",
  route: props.purchasesRoute,
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
</script>
