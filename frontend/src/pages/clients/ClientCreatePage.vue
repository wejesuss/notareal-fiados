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
import { ref } from "vue";
import { useQuasar } from "quasar";
import { createClient } from "src/services";
import { useNavigation } from "src/composables/core/useNavigation";
import type { ClientPayload } from "src/components/types";
import { ClientForm } from "src/components/clients";

const { navigateTo } = useNavigation();
const $q = useQuasar();
const submitting = ref(false);

async function submit(payload: ClientPayload) {
  if (submitting.value) return;

  try {
    submitting.value = true;
    const { client } = await createClient(payload);

    $q.notify({
      type: "positive",
      message: "Cliente criado com sucesso",
    });

    await navigateTo(`/clients/${client.id}`);
  } catch (err) {
    if (err instanceof Error) {
      $q.notify({
        type: "negative",
        message: err.message || "Erro ao criar Cliente",
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
