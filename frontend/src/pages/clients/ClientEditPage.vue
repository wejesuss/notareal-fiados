<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl q-mt-sm">
      <div class="text-h5">Editar Cliente</div>
    </div>

    <!-- Content -->
    <q-card v-if="loading" class="q-my-xl q-pa-md">
      <ContentState
        message="Carregando cliente..."
        icon-name="person_search"
        spinner
      ></ContentState>
    </q-card>

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
            :submitting="submitting"
          >
            <q-toggle
              :model-value="isActive"
              @update:model-value="toggleIsActive"
              checked-icon="check"
              color="blue"
              :label="isActive ? 'Cliente Ativo' : 'Cliente Inativo'"
              unchecked-icon="clear"
            />

            <template #buttons-container>
              <q-btn
                class="q-mr-md q-py-sm"
                color="grey-8"
                outline
                type="button"
                label="Cancelar"
                @click="navigateTo(`/clients/${id}`)"
                :disable="submitting"
              />
            </template>
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
import type { ClientPayload } from "src/components/types";
import { ClientForm } from "src/components/clients";
import {
  useNavigation,
  useClientDetails,
  useDisableConfirmation,
  useUpdateClient,
} from "src/composables";
import { dialogConfig } from "src/config/clients/dialogs";
import { ContentState } from "src/components/common";

const $route = useRoute();
const { navigateTo } = useNavigation();
const $q = useQuasar();

const id = computed(() => {
  const value = Number($route.params.id);
  return Number.isInteger(value) && value > 0 ? value : 0;
});
const { loading, error, client } = useClientDetails(id);
const { confirmDisable } = useDisableConfirmation();
const { submitting, update } = useUpdateClient();
const isActive = ref(false);

const clientFormPayload = computed((): ClientPayload => {
  return {
    name: client.value?.name || "",
    email: client.value?.email || null,
    nickname: client.value?.nickname || null,
    phone: client.value?.phone || null,
  };
});

async function handleClientError(message: string) {
  $q.notify({
    type: "negative",
    message,
  });
  await navigateTo("/clients");
}

watch(
  id,
  async (clientId) => {
    if (clientId <= 0) {
      await handleClientError("Identificador do cliente inválido!");
    }
  },
  { immediate: true },
);

watch(
  () => client.value?.isActive,
  (clientIsActive) => {
    if (clientIsActive !== undefined) {
      isActive.value = clientIsActive;
    }
  },
  { immediate: true },
);

watch(error, async (err) => {
  if (!err) return;

  await handleClientError(err.message || "Cliente não encontrado");
});

async function toggleIsActive(nextValue: boolean) {
  // Show dialog to confirm client deactivation
  if (nextValue === false) {
    const confirmed = await confirmDisable(dialogConfig);
    if (!confirmed) return;
  }

  isActive.value = nextValue;
}

async function submit(formData: ClientPayload) {
  if (!client.value) return;

  const response = await update(
    id.value,
    { data: clientFormPayload.value, isActive: client.value.isActive },
    { data: formData, isActive: isActive.value },
  );

  if (!response) return;

  if (response.skipped) {
    $q.notify({
      type: "info",
      message: "Nenhuma alteração para salvar",
      color: "light-blue-8",
    });

    return;
  }

  if (response.error) {
    $q.notify({
      type: response.error.type === "validation" ? "negative" : "warning",
      message: response.error.message || "Erro ao atualizar Cliente",
    });

    return;
  }

  $q.notify({
    type: "positive",
    message: "Cliente atualizado com sucesso",
  });

  await navigateTo(`/clients/${id.value}`);
}
</script>

<style scoped lang="css">
.form-container {
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
}
</style>
