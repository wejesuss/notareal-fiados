<template>
  <q-card class="full-width payment-form-card">
    <q-card-section class="text-h6">{{ formTitle }}</q-card-section>

    <q-separator />

    <q-card-section>
      <q-form ref="paymentForm" class="col q-gutter-xs q-col-gutter-md">
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
          v-model="displayDate"
          label="Data do pagamento"
          bottom-slots
          :rules="[dateTimeRule]"
          error-message="Data ou Hora inválidos"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer"
              ><q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="datePart" mask="YYYY-MM-DD"></q-date>
              </q-popup-proxy>
            </q-icon>
            <q-icon name="schedule" class="cursor-pointer"
              ><q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  v-model="timePart"
                  format24h
                  mask="HH:mm"
                ></q-time> </q-popup-proxy
            ></q-icon>
          </template>

          <template #hint>
            <div>
              Data e hora do pagamento (deixe em branco se desconhecido).
            </div>
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
import { QForm } from "quasar";

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

const paymentForm = ref<QForm | null>(null);
const displayDate = ref<string | null>(null);
const datePart = ref<string | null>(null);
const timePart = ref<string | null>(null);

watch([datePart, timePart], ([date, time]) => {
  if (date && time) {
    displayDate.value = `${date}T${time}`;
  } else {
    displayDate.value = date || time;
  }
});

watch(displayDate, (date) => {
  if (!date) {
    datePart.value = null;
    timePart.value = null;
  }
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

function dateTimeRule(vl?: string | null) {
  // console.log(typeof vl, vl);
  if (!vl) return true;

  // At least the date part or time part
  const match = vl.match(
    /^((?:\d{4})(?:[-/]\d{2}){2})(T[0-2]\d:[0-5]\d)?$|^([0-2]\d:[0-5]\d)$/g,
  );
  if (!match) {
    // No date no time
    return false;
  }

  const fullDate = match[0].includes("T");
  if (fullDate) {
    const date = new Date(match[0].replaceAll("/", "-"));
    return !Number.isNaN(date.valueOf());
  }

  return true;
}
</script>

<style scoped>
.payment-form-card {
  max-width: 580px;
}
</style>
