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
import type { ClientUpdate } from "src/models";
import type { ClientPayload } from "src/components/types";
import { updateClient } from "src/services";
import { ClientForm } from "src/components/clients";
import {
  useNavigation,
  useClientDetails,
  useDisableConfirmation,
} from "src/composables";
import { dialogConfig } from "src/config/clientDialogs";
import { ContentState } from "src/components/common";
import { isShallowEqual } from "src/utils/checkers/isShalowEqual";

const $route = useRoute();
const { navigateTo } = useNavigation();
const $q = useQuasar();

const id = computed(() => Number($route.params.id));
const { loading, error, client } = useClientDetails(id);
const { confirmDisable } = useDisableConfirmation();
const isActive = ref(false);
const submitting = ref(false);

const clientFormPayload = computed((): ClientPayload => {
  return {
    name: client.value?.name || "",
    email: client.value?.email || null,
    nickname: client.value?.nickname || null,
    phone: client.value?.phone || null,
  };
});

async function handleClientLoadError(e: Error) {
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

  await handleClientLoadError(err);
});

async function toggleIsActive(nextValue: boolean) {
  // Show dialog to confirm client deactivation
  if (nextValue === false) {
    const confirmed = await confirmDisable(dialogConfig);
    if (!confirmed) return;
  }

  isActive.value = nextValue;
}

function isFormDirty(formData: ClientPayload) {
  if (!client.value) return false;

  const original: ClientPayload = clientFormPayload.value;

  return !isShallowEqual(original, formData);
}

async function submit(formData: ClientPayload) {
  if (submitting.value) return;

  try {
    submitting.value = true;

    const isActiveChanged = client.value?.isActive !== isActive.value;

    if (!isActiveChanged && !isFormDirty(formData)) {
      $q.notify({
        type: "info",
        message: "Nenhuma alteração para salvar",
      });

      return;
    }

    const payload: ClientUpdate = {
      ...formData,
      ...(isActiveChanged && {
        isActive: isActive.value,
      }),
    };

    await updateClient(id.value, payload);

    $q.notify({
      type: "positive",
      message: "Cliente atualizado com sucesso",
    });

    await navigateTo(`/clients/${id.value}`);
  } catch (err) {
    if (err instanceof Error) {
      $q.notify({
        type: "negative",
        message: err.message || "Erro ao atualizar Cliente",
      });
    }
  } finally {
    submitting.value = false;
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
