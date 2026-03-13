<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl q-mt-sm">
      <div class="text-h5">Editar Cliente</div>
    </div>

    <!-- Content -->
    <q-card v-if="loading">Loading...</q-card>

    <q-card v-else>
      <q-card-section class="row items-center q-gutter-md">
        <div class="text-subtitle1">Dados do cliente</div>
        <q-icon name="people_outline" size="md" color="grey-6"></q-icon>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center q-pa-lg">
        <div class="form-container">
          <ClientForm
            :payload="clientFormPayload"
            submit-label="Salvar"
            @submit="submit"
          >
            <q-toggle
              v-model="isActive"
              checked-icon="check"
              color="blue"
              :label="isActive ? 'Cliente Ativo' : 'Cliente Inativo'"
              unchecked-icon="clear"
            />
          </ClientForm>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { updateClient } from "src/services";
import { useNavigation } from "src/composables/core/useNavigation";
import type { ClientPayload } from "src/components/types";
import { ClientForm } from "src/components/clients";
import type { APIError } from "src/api/errors";
import { useClientDetails } from "src/composables";

const $route = useRoute();
const { navigateTo } = useNavigation();
const $q = useQuasar();

const id = computed(() => Number($route.params.id));
const { loading, error, client } = useClientDetails(id);
const isActive = ref(false);

const clientFormPayload = computed((): ClientPayload => {
  return {
    name: client.value?.name || "",
    email: client.value?.email || null,
    nickname: client.value?.nickname || null,
    phone: client.value?.phone || null,
  };
});

async function handleClientNotFound(e: Error) {
  $q.notify({
    type: "negative",
    message: e.message || "Cliente não encontrado",
  });
  await navigateTo("/clients");
}

watch(
  client,
  (newClient) => {
    if (!newClient) return;

    isActive.value = newClient.isActive;
  },
  { immediate: true },
);

watch(error, async (err) => {
  if (!err) return;

  await handleClientNotFound(err);
});

async function submit(payload: ClientPayload) {
  try {
    await updateClient(id.value, {
      ...payload,
      isActive: isActive.value,
    });

    $q.notify({
      type: "positive",
      message: "Cliente atualizado com sucesso",
    });

    await navigateTo(`/clients/${id.value}`);
  } catch (error) {
    $q.notify({
      type: "negative",
      message: (error as APIError).message ?? "Erro ao atualizar Cliente",
    });
  }
}
</script>

<style scoped lang="css">
.form-container {
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
}
</style>
