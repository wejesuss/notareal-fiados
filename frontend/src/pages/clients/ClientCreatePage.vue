<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl q-mt-sm">
      <div class="text-h5">Novo Cliente</div>
    </div>

    <!-- Content -->
    <q-card>
      <q-card-section class="row items-center q-gutter-md">
        <div class="text-subtitle1">Dados do cliente</div>
        <q-icon name="people_outline" size="md" color="grey-6"></q-icon>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center q-pa-lg">
        <div class="form-container">
          <ClientForm
            submit-label="Salvar"
            @submit="submit"
            :submitting="submitting"
          >
            <template #buttons-container>
              <q-btn
                class="q-mr-md q-py-sm"
                color="grey-8"
                outline
                type="button"
                label="Cancelar"
                @click="navigateTo('/clients')"
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
import { useQuasar } from "quasar";
import { useNavigation } from "src/composables/core/useNavigation";
import type { ClientPayload } from "src/components/types";
import { ClientForm } from "src/components/clients";
import { useCreateClient } from "src/composables";

const { navigateTo } = useNavigation();
const { notify } = useQuasar();
const { submitting, error, create } = useCreateClient();

async function submit(payload: ClientPayload) {
  const response = await create(payload);

  if (!response) {
    notify({
      type: "negative",
      message: error.value?.message || "Erro ao criar Cliente",
    });
    return;
  }

  notify({
    type: "positive",
    message: "Cliente criado com sucesso",
  });
}
</script>

<style scoped lang="css">
.form-container {
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
}
</style>
