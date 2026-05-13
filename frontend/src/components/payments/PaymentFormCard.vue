<template>
  <q-card class="full-width payment-form-card">
    <q-card-section class="text-h6">{{ formTitle }}</q-card-section>

    <q-separator />

    <q-card-section>
      <q-form ref="paymentForm" class="payment-form">
        <div>
          <q-input
            outlined
            color="secondary"
            v-model="paymentFormData.description"
            debounce="300"
            label="Descrição *"
          >
            <template #append>
              <FieldHint
                icon="label_outline"
                tooltip="Descreva o pagamento"
              ></FieldHint>
            </template>
          </q-input>
        </div>

        <div>
          <q-input
            outlined
            color="secondary"
            v-model="amountInput"
            label="Valor (R$)"
            inputmode="numeric"
          >
            <template #append>
              <FieldHint
                icon="attach_money"
                tooltip="Valor pago nesta transação"
              ></FieldHint>
            </template>
          </q-input>
        </div>

        <div class="payment-meta-grid">
          <div>
            <q-input
              outlined
              color="secondary"
              v-model="displayDate"
              label="Data do pagamento"
              readonly
            >
              <template #append>
                <DatePickerAppend
                  v-model="datePart"
                  @reset="resetDateTime"
                ></DatePickerAppend>
              </template>
            </q-input>
          </div>

          <div>
            <q-input
              outlined
              color="secondary"
              v-model="timePart"
              label="Horário do pagamento"
              readonly
            >
              <template #append>
                <TimePickerAppend
                  v-model="timePart"
                  @reset="resetDateTime"
                ></TimePickerAppend>
              </template>
            </q-input>
          </div>
        </div>
        <div class="text-caption text-grey hint-text">
          Data e hora do pagamento (deixe em branco se desconhecido).
        </div>

        <div class="payment-meta-grid">
          <div>
            <q-input
              outlined
              color="secondary"
              v-model="paymentFormData.method"
              debounce="300"
              label="Forma de pagamento"
            >
              <template #append>
                <FieldHint
                  icon="price_check"
                  tooltip="Forma de pagamento (ex: dinheiro, pix, transferência)"
                >
                </FieldHint>
              </template>
            </q-input>
          </div>

          <div>
            <q-input
              outlined
              color="secondary"
              v-model="paymentFormData.receiptNumber"
              debounce="300"
              :disable="isEditingPayment"
              label="Número do recibo"
            >
              <template #append>
                <FieldHint
                  icon="receipt"
                  tooltip="Identificador único do pagamento (REC-***)"
                >
                </FieldHint>
              </template>
            </q-input>
          </div>
        </div>

        <div class="actions-container row items-center justify-between q-mt-xs">
          <q-toggle
            v-model="isActive"
            checked-icon="check"
            color="green"
            :label="isActive ? 'Pagamento Ativo' : 'Pagamento Inativo'"
            unchecked-icon="clear"
          />

          <q-card-actions align="right">
            <slot></slot>
            <q-btn color="primary" type="submit" label="Salvar" />
          </q-card-actions>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { QForm } from "quasar";
import type { Payment } from "src/models";
import { type PaymentPayload } from "src/components/types";
import { FieldHint } from "src/components/common";
import { DatePickerAppend, TimePickerAppend } from "src/components/payments";
import {
  formatDateTime,
  formatCurrency,
  parseCurrencyToCents,
} from "src/utils/formatters";

interface PaymentFormProps {
  payload?: PaymentPayload | null;
  selectedPayment: Payment | null;
}

const props = defineProps<PaymentFormProps>();

const paymentFormData = ref<PaymentPayload>({
  description: null,
  amountCents: 0,
  method: "",
  paymentDate: null,
  receiptNumber: "",
});

const isActive = ref(false);
const paymentForm = ref<QForm | null>(null);
const datePart = ref<string | null>(null);
const timePart = ref<string | null>(null);

const paymentDate = computed(() => {
  if (!datePart.value) return null;

  const time = timePart.value || "00:00";
  return new Date(`${datePart.value}T${time}:00`);
});
console.log(paymentDate.value);
const displayDate = computed(() => {
  if (!datePart.value) return null;

  const [year, month, day] = datePart.value.split("-");

  return `${day}/${month}/${year}`;
});

const amountInput = computed({
  get() {
    return formatCurrency(paymentFormData.value.amountCents / 100);
  },

  set(vl: string) {
    paymentFormData.value.amountCents = parseCurrencyToCents(vl);
  },
});

watch(
  () => props.payload,
  (payload) => {
    if (!payload) return;

    paymentFormData.value = { ...payload };
    if (payload.paymentDate) {
      const [date, time] = formatDateTime(payload.paymentDate);

      datePart.value = date;
      timePart.value = time;
    }
  },
  { immediate: true },
);

const formTitle = props.selectedPayment
  ? "Editar Pagamento " + `(${props.selectedPayment.receiptNumber})`
  : "Novo Pagamento";

const isEditingPayment = !!props.selectedPayment?.id;

function resetDateTime() {
  datePart.value = null;
  timePart.value = null;
}
</script>

<style scoped>
.payment-form-card {
  max-width: 580px;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 20px 16px;
}

.payment-form > * {
  margin-left: 4px;
}

.payment-meta-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.hint-text {
  margin-top: -12px;
  margin-left: 12px;
}

@media (min-width: 560px) {
  .payment-meta-grid {
    grid-template-columns: minmax(220px, 1fr) 1fr;
  }
}

@media (max-width: 450px) {
  .actions-container {
    flex-direction: column;
  }
}
</style>
