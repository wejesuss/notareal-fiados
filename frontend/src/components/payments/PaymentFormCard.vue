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
            v-model="paymentFormData.amountCents"
            debounce="300"
            label="Valor (R$)"
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
              v-model="datePart"
              label="Data do pagamento"
              readonly
            >
              <template #append>
                <FieldHint
                  icon="event"
                  icon-size="sm"
                  clickable
                  tooltip="Selecionar a data"
                  :tooltip-delay="{ delay: 250 }"
                >
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="datePart" mask="YYYY-MM-DD">
                      <q-btn
                        flat
                        color="grey-7"
                        label="Limpar"
                        class="full-width"
                        @click="resetDateTime"
                      />
                    </q-date>
                  </q-popup-proxy>
                </FieldHint>
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
                <FieldHint
                  icon="schedule"
                  icon-size="sm"
                  clickable
                  tooltip="Selecionar o horário"
                  :tooltip-delay="{ delay: 250 }"
                >
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="timePart" format24h mask="HH:mm">
                      <q-btn
                        flat
                        color="grey"
                        label="Limpar"
                        class="full-width"
                        @click="resetDateTime"
                      />
                    </q-time>
                  </q-popup-proxy>
                </FieldHint>
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

        <q-card-actions align="right">
          <slot></slot>
          <q-btn color="primary" type="submit" label="Salvar" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { QForm } from "quasar";
import type { Payment } from "src/models";
import { type PaymentPayload } from "src/components/types";
import { formatDateTime } from "src/utils/formatters";
import { FieldHint } from "src/components/common";

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

const paymentForm = ref<QForm | null>(null);
const datePart = ref<string | null>(null);
const timePart = ref<string | null>(null);

const paymentDate = computed(() => {
  if (!datePart.value) return null;

  const time = timePart.value || "00:00";
  return new Date(`${datePart.value}T${time}:00`);
});
console.log(paymentDate.value);

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
</style>
