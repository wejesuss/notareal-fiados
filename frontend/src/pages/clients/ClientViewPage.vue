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
      @load-error="handleClientError"
    ></ClientDetailsCard>

    <ClientSummaryCard v-if="id" :client-id="id"></ClientSummaryCard>
  </q-page>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { useNavigation } from "src/composables/core/useNavigation";
import { ClientDetailsCard, ClientSummaryCard } from "src/components/clients";
import { UIError } from "src/types/errors";

const $route = useRoute();
const { navigateTo } = useNavigation();
const $q = useQuasar();

async function handleClientError(e: UIError) {
  $q.notify({ type: "negative", message: e.message });
  await navigateTo("/clients");
}
const id = computed(() => {
  const clientId = Number($route.params.id);
  return !Number.isInteger(clientId) || clientId <= 0 ? 0 : clientId;
});

watch(id, async (clientId) => {
  if (clientId <= 0) {
    const error = new UIError(
      "Identificador de cliente inválido!",
      "validation",
      null,
    );

    await handleClientError(error);
  }
});
</script>
