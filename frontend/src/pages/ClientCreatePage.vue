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
          <ClientForm submit-label="Salvar" @submit="submit"></ClientForm>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { createClient } from "src/services";
import ClientForm from "src/components/ClientForm.vue";
import { useNavigation } from "src/composables/useNavigation";
import type { ClientPayload } from "src/components/models";

const { navigateTo } = useNavigation();
const $q = useQuasar();

async function submit(payload: ClientPayload) {
  console.log(payload);
  createClient(payload);

  $q.notify({
    type: "positive",
    message: "Cliente criado com sucesso",
  });

  await navigateTo("/clients");
}
</script>

<style scoped lang="css">
.form-container {
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
}
</style>
