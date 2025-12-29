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
          <q-form
            @submit.prevent="submit"
            class="col q-gutter-xs q-col-gutter-md"
          >
            <q-input
              outlined
              color="secondary"
              v-model="form.name"
              label="Nome"
            >
              <template #append>
                <q-icon name="person" size="xs">
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :delay="250"
                    >Como deseja identificar o cliente</q-tooltip
                  >
                </q-icon>
              </template>
            </q-input>

            <q-input
              outlined
              color="secondary"
              v-model="form.nickname"
              label="Apelido"
            >
              <template #append>
                <q-icon name="person_search" size="xs">
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :delay="250"
                  >
                    Cada cliente deve ter um apelido único para facilitar a
                    busca
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>

            <q-input
              outlined
              color="secondary"
              v-model="form.phone"
              label="Telefone"
              type="tel"
            >
              <template #append>
                <q-icon name="phone" size="xs">
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :delay="250"
                    >Número para contato rápido ou WhatsApp</q-tooltip
                  >
                </q-icon>
              </template>
            </q-input>

            <q-input
              outlined
              color="secondary"
              v-model="form.email"
              label="Email"
              type="email"
            >
              <template #append>
                <q-icon name="mail" size="xs">
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :delay="250"
                    >Email para identificação do cliente</q-tooltip
                  >
                </q-icon>
              </template>
            </q-input>

            <q-btn
              class="q-my-md q-mt-lg q-py-sm"
              color="secondary"
              icon="person_add"
              label="Salvar"
              type="submit"
            />
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ClientCreate } from "src/models";

const form = ref<ClientCreate>({
  name: "",
});

function submit() {
  console.log(form.value);
}
</script>

<style scoped lang="css">
.form-container {
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
}
</style>
