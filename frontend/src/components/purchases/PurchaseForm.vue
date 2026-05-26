<template>
  <q-form
    ref="formRef"
    @submit.prevent="submit"
    class="col q-gutter-xs q-col-gutter-md"
  >
    <slot></slot>

    <q-input
      outlined
      color="secondary"
      v-model="formData.description"
      label="Descrição *"
      lazy-rules
      :rules="[required]"
    >
      <template #append>
        <q-icon name="description" size="xs">
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            class="tooltip-medium"
            :delay="250"
            >Como deseja identificar a compra</q-tooltip
          >
        </q-icon>
      </template>
    </q-input>

    <div class="q-my-md">
      <slot name="buttons-container"></slot>

      <q-btn
        class="q-py-sm"
        color="secondary"
        type="submit"
        :icon="submitIcon || 'add_circle'"
        label="Salvar"
        :disable="!isFormValid || submitting"
        :loading="submitting"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { QForm } from "quasar";
import type { PurchasePayload } from "../types";

interface PurchaseFormProps {
  payload?: PurchasePayload;
  submitIcon?: string;
  submitting: boolean;
}

const emit = defineEmits<{
  submit: [payload: PurchasePayload];
}>();
const props = defineProps<PurchaseFormProps>();

const formRef = ref<QForm | null>(null);
const formData = ref<PurchasePayload>({
  clientId: props.payload?.clientId || 0,
  description: props.payload?.description || "",
  totalCents: props.payload?.totalCents || 0,
  noteNumber: props.payload?.noteNumber || "",
  ...(props.payload?.initialPayment && {
    initialPayment: props.payload.initialPayment,
  }),
});

watch(
  () => props.payload,
  (payload: PurchasePayload | undefined) => {
    if (!payload) return;
    formData.value = { ...payload };
  },
  { immediate: true },
);

const isFormValid = computed(() => !!formData.value.description);

const required = (val: string) => !!val?.trim() || "Descrição é obrigatória";

async function submit() {
  if (!formRef.value) return;

  const valid = await formRef.value.validate(false);
  if (!valid) return;

  const payload: PurchasePayload = {
    clientId: formData.value.clientId,
    description: formData.value.description.trim().replace(/\s+/g, " "),
    totalCents: formData.value.totalCents,
    noteNumber: formData.value.noteNumber,
    ...(formData.value.initialPayment && {
      initialPayment: formData.value.initialPayment,
    }),
  };

  emit("submit", payload);
}
</script>
