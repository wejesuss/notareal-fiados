<template>
  <q-form
    ref="formRef"
    @submit.prevent="submit"
    class="col q-gutter-xs q-col-gutter-md"
  >
    <q-input
      outlined
      color="secondary"
      v-model="formData.name"
      label="Nome *"
      lazy-rules
      :rules="[required]"
    >
      <template #append>
        <q-icon name="person" size="xs">
          <q-tooltip anchor="top middle" self="bottom middle" :delay="250"
            >Como deseja identificar o cliente</q-tooltip
          >
        </q-icon>
      </template>
    </q-input>

    <q-input
      outlined
      color="secondary"
      v-model="formData.nickname"
      label="Apelido"
      lazy-rules
      :rules="[nicknameRule]"
    >
      <template #append>
        <q-icon name="person_search" size="xs">
          <q-tooltip anchor="top middle" self="bottom middle" :delay="250">
            Cada cliente pode ter um apelido único, curto e sem espaços para
            facilitar a busca (ex: joaozinho).
          </q-tooltip>
        </q-icon>
      </template>
    </q-input>

    <q-input
      outlined
      color="secondary"
      v-model="formData.phone"
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
          <q-tooltip anchor="top middle" self="bottom middle" :delay="250"
            >Número para contato rápido ou WhatsApp</q-tooltip
          >
        </q-icon>
      </template>
    </q-input>

    <q-input
      outlined
      color="secondary"
      v-model="formData.email"
      label="Email"
      type="email"
      lazy-rules
      :rules="[emailRule]"
    >
      <template #append>
        <q-icon name="mail" size="xs">
          <q-tooltip anchor="top middle" self="bottom middle" :delay="250"
            >Email para identificação do cliente</q-tooltip
          >
        </q-icon>
      </template>
    </q-input>

    <q-btn
      class="q-my-md q-mt-lg q-py-sm"
      color="secondary"
      type="submit"
      :icon="submitIcon || 'person_add'"
      :label="submitLabel"
      :disable="!isFormValid"
    />
  </q-form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { ClientCreate } from "src/models";
import { QForm } from "quasar";

interface ClientFormProps {
  payload?: ClientCreate;
  submitLabel: string;
  submitIcon?: string;
}

const emit = defineEmits(["submit"]);
const props = defineProps<ClientFormProps>();

const formRef = ref<QForm | null>(null);
const formData = ref<ClientCreate>(props.payload || { name: "" });

const isFormValid = computed(() => !!formData.value.name);

const required = (val: string) => !!val?.trim() || "Nome é obrigatório";

const nicknameRule = (val?: string) => {
  if (!val) return true;

  const trimmed = val.trim();

  if (trimmed.length < 3) {
    return "Se fornecido, apelido deve ter ao menos 3 caracteres";
  }

  if (/\s/.test(trimmed)) {
    return "Apelido deve ser um identificador único, sem espaços.";
  }

  return true;
};

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

  const payload = {
    ...formData.value,
    name: formData.value.name.trim().replace(/\s+/g, " "),
    nickname: formData.value.nickname?.trim() ?? null,
  };

  emit("submit", payload);
}
</script>
