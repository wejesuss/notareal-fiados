<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl q-mt-sm">
      <div class="text-h5">Visualizar Cliente</div>
    </div>

    <!-- Content -->
    <ClientDetailsCard
      :client-id="id"
      @exception="clientNotFoundNotifyAndNavigate"
    ></ClientDetailsCard>

    <ClientSummaryCard :client-id="id"></ClientSummaryCard>

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
import { computed } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { useNavigation } from "src/composables/useNavigation";
import ClientDetailsCard from "src/components/ClientDetailsCard.vue";
import ClientSummaryCard from "src/components/ClientSummaryCard.vue";

const $route = useRoute();
const { navigateTo } = useNavigation();
const $q = useQuasar();

async function clientNotFoundNotifyAndNavigate() {
  $q.notify({ type: "negative", message: "Cliente não encontrado" });
  await navigateTo("/clients");
}
const id = computed(() => {
  const pathId = Number($route.params.id);
  if (!Number.isInteger(pathId) || pathId <= 0) {
    void clientNotFoundNotifyAndNavigate();
    return 0;
  }

  return pathId;
});
</script>
