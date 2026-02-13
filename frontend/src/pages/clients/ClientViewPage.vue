<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl q-mt-sm">
      <div class="text-h5">Visualizar Cliente</div>
    </div>

    <!-- Content -->
    <ClientDetailsCard
      v-if="id"
      :client-id="id"
      @load-error="handleClientNotFound"
    ></ClientDetailsCard>

    <ClientSummaryCard v-if="id" :client-id="id"></ClientSummaryCard>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { useNavigation } from "src/composables/core/useNavigation";
import { ClientDetailsCard, ClientSummaryCard } from "src/components/clients";

const $route = useRoute();
const { navigateTo } = useNavigation();
const $q = useQuasar();

async function handleClientNotFound(e: Error) {
  $q.notify({ type: "negative", message: e.message });

  await navigateTo("/clients");
}
const id = computed(() => {
  const pathId = Number($route.params.id);
  if (!Number.isInteger(pathId) || pathId <= 0) {
    void handleClientNotFound(new Error("Identificador de cliente inválido!"));
    return 0;
  }

  return pathId;
});
</script>
