<template>
  <q-card class="full-width payment-form-card">
    <q-card-section class="text-h6">{{ formTitle }}</q-card-section>

    <q-separator />

    <q-card-section>
      <q-form class="col q-gutter-xs q-col-gutter-md">
        <q-input
          outlined
          color="secondary"
          v-model="paymentFormData.description"
          debounce="300"
          label="Descrição *"
        >
          <template #append>
            <q-icon name="label_outline" size="xs">
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                :delay="250"
                :hide-delay="150"
                class="tooltip-medium"
                >Descreva o pagamento</q-tooltip
              >
            </q-icon>
          </template>
        </q-input>

        <q-input
          outlined
          color="secondary"
          v-model="paymentFormData.amountCents"
          debounce="300"
          label="Valor (R$)"
        >
          <template #append>
            <q-icon name="attach_money" size="xs">
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                :delay="250"
                :hide-delay="150"
                class="tooltip-medium"
                >Valor pago nesta transação.</q-tooltip
              >
            </q-icon>
          </template>
        </q-input>

        <q-input
          outlined
          color="secondary"
          v-model="paymentFormData.paymentDate"
          debounce="300"
          label="Data do pagamento"
        >
          <template #append>
            <q-icon name="today" size="xs">
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                :delay="250"
                :hide-delay="150"
                class="tooltip-medium"
                >Data e hora do pagamento (deixe em branco se
                desconhecido).</q-tooltip
              >
            </q-icon>
          </template>
        </q-input>

        <div class="row q-col-gutter-md">
          <q-input
            outlined
            color="secondary"
            v-model="paymentFormData.method"
            debounce="300"
            label="Forma de pagamento"
            class="col-12 col-sm-5"
          >
            <template #append>
              <q-icon name="price_check" size="xs">
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :delay="250"
                  :hide-delay="150"
                  class="tooltip-medium"
                  >Forma de pagamento (ex: dinheiro, pix,
                  transferência).</q-tooltip
                >
              </q-icon>
            </template>
          </q-input>

          <q-input
            outlined
            color="secondary"
            v-model="paymentFormData.receiptNumber"
            debounce="300"
            :disable="isEditingPayment"
            label="Número do recibo"
            class="col-12 col-sm-7"
          >
            <template #append>
              <q-icon name="receipt" size="xs">
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :delay="250"
                  :hide-delay="150"
                  class="tooltip-medium"
                  >Identificador único do pagamento (REC-***)</q-tooltip
                >
              </q-icon>
            </template>
          </q-input>
        </div>

        <q-card-actions align="right">
          <slot></slot>
          <q-btn color="primary" type="submit" label="Salvar" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Payment } from "src/models";
import { type PaymentPayload } from "src/components/types";

interface PaymentFormProps {
  payload?: PaymentPayload | null;
  selectedPayment: Payment | null;
}

const props = defineProps<PaymentFormProps>();

const paymentFormData = ref<PaymentPayload>({
  description: props.payload?.description || null,
  amountCents: props.payload?.amountCents || 0,
  method: props.payload?.method || "",
  paymentDate: props.payload?.paymentDate || null,
  receiptNumber: props.payload?.receiptNumber || "",
});

watch(
  () => props.payload,
  (payload) => {
    if (!payload) return;

    paymentFormData.value = { ...payload };
  },
);

const formTitle = props.selectedPayment
  ? "Editar Pagamento " + `(${props.selectedPayment.receiptNumber})`
  : "Novo Pagamento";

const isEditingPayment = !!props.selectedPayment?.id;
</script>

<style scoped>
.payment-form-card {
  max-width: 580px;
}
</style>
