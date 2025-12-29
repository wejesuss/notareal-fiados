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
            ref="formRef"
            @submit.prevent="submit"
            class="col q-gutter-xs q-col-gutter-md"
          >
            <q-input
              outlined
              color="secondary"
              v-model="form.name"
              label="Nome *"
              lazy-rules
              :rules="[required]"
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
              lazy-rules
              :rules="[nicknameRule]"
            >
              <template #append>
                <q-icon name="person_search" size="xs">
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :delay="250"
                  >
                    Cada cliente pode ter um apelido único para facilitar a
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
              lazy-rules
              mask="####################"
              unmasked-value
              :rules="[phoneRule]"
              hint="Opcional • BR ou EUA"
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
              lazy-rules
              :rules="[emailRule]"
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
              :disable="!isFormValid"
            />
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { ClientCreate } from "src/models";
import { QForm, useQuasar } from "quasar";
import { createClient } from "src/services";
import { useNavigation } from "src/composables/useNavigation";

const { navigateTo } = useNavigation();
const $q = useQuasar();

const formRef = ref<QForm | null>(null);
const isFormValid = computed(() => !!form.value.name);

const form = ref<ClientCreate>({
  name: "",
});

const required = (val: string) => !!val?.trim() || "Nome é obrigatório";

const nicknameRule = (val?: string) =>
  !val ||
  val.trim().length >= 3 ||
  "Se fornecido, apelido deve ter ao menos 3 caracteres";

const phoneRule = (val?: string) => {
  if (!val) return true; // optional

  const cleaned = val.replace(/\D/g, "");

  if (cleaned.length < 8 || cleaned.length > 15) {
    return "Telefone inválido";
  }

  return true;
};

const emailRule = (val?: string) =>
  !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "Email inválido";

async function submit() {
  if (!formRef.value) return;

  const valid = await formRef.value.validate(false);
  if (!valid) return;

  createClient(form.value);

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
