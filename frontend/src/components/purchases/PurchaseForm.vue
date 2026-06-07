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

    <q-input
      outlined
      color="secondary"
      v-model="totalInput"
      label="Total da compra (R$) *"
      lazy-rules
      :rules="[totalRule]"
      inputmode="numeric"
    >
      <template #append>
        <q-icon name="attach_money" size="xs">
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            class="tooltip-medium"
            :delay="250"
            >O valor total da compra</q-tooltip
          >
        </q-icon>
      </template>
    </q-input>

    <q-input
      outlined
      color="secondary"
      v-model="formData.noteNumber"
      label="Número da Nota"
      lazy-rules
    >
      <template #append>
        <q-icon name="receipt" size="xs">
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            class="tooltip-medium"
            :delay="250"
            >Código único da compra</q-tooltip
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
import { computed, ref } from "vue";
import { QForm } from "quasar";
import type { PurchasePayload } from "../types";
import { formatCurrency, parseCurrencyToCents } from "src/utils/formatters";

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
  description: props.payload?.description || "",
  totalCents: props.payload?.totalCents || 0,
  noteNumber: props.payload?.noteNumber || "",
  ...(props.payload?.initialPayment && {
    initialPayment: structuredClone(props.payload.initialPayment),
  }),
});

const isFormValid = computed(
  () => !!formData.value.description.trim() && formData.value.totalCents > 0,
);
const totalInput = computed({
  get() {
    return formatCurrency(formData.value.totalCents / 100);
  },

  set(vl: string) {
    formData.value.totalCents = parseCurrencyToCents(vl);
  },
});

const required = (val: string) => !!val?.trim() || "Descrição é obrigatória";
const totalRule = () =>
  formData.value.totalCents > 0 || "Valor deve ser maior que zero";

async function submit() {
  if (!formRef.value) return;

  const valid = await formRef.value.validate(false);
  if (!valid) return;

  const payload: PurchasePayload = {
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
