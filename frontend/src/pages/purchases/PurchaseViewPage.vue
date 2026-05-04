<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-start q-mt-sm q-mb-xl">
      <div class="col">
        <div class="text-h5 q-mb-sm">Visualizar Compra</div>
        <div class="text-caption text-grey-7" v-if="purchase">
          {{ formatDate(purchase.updatedAt) }} ·
          <span class="text-blue-7">{{ purchase.noteNumber }}</span>
        </div>
      </div>
    </div>

    <q-card v-if="loadState === 'loading'" class="q-mb-xl q-pa-md">
      <ContentState
        message="Carregando compra..."
        icon-name="find_in_page"
      ></ContentState>
    </q-card>

    <q-card v-else-if="loadState === 'error'" class="q-my-xl q-pa-md">
      <ContentState
        :message="errorMessage"
        message-color="text-amber-8"
        icon-name="error_outline"
        icon-color="amber-10"
      ></ContentState>
    </q-card>

    <!-- Details card -->
    <PurchaseDetailsCard
      v-else-if="purchase"
      :purchase="purchase"
      :is-active="isActive"
      :submitting="submitting"
      :client-name="client?.name"
      @toggle-is-active="submitDialog"
    />

    <!-- Payments list -->
    <PaymentListCard
      v-if="purchase"
      :loading="paymentsLoading"
      :error="paymentsError"
      :payments="payments"
      @create-payment="openPaymentModal"
      @edit-payment="openPaymentModal"
    ></PaymentListCard>

    <q-dialog :model-value="isPaymentModalOpen" @hide="cancelPaymentModal">
      <q-card class="full-width payment-form-card">
        <q-card-section class="text-h6">{{
          selectedPayment
            ? "Editar Pagamento " + `(${selectedPayment.receiptNumber})`
            : "Novo Pagamento"
        }}</q-card-section>

        <q-separator />

        <q-card-section>
          <q-form class="col q-gutter-xs q-col-gutter-md">
            <q-input
              outlined
              color="secondary"
              :model-value="paymentFormData.description"
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
              :model-value="paymentFormData.amountCents"
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
              :model-value="paymentFormData.paymentDate"
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
                :model-value="paymentFormData.method"
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
                :model-value="paymentFormData.receiptNumber"
                debounce="300"
                :disable="!!selectedPayment?.id"
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
              <q-btn flat label="Cancelar" v-close-popup />
              <q-btn color="primary" type="submit" label="Salvar" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed, ref, toRef, watch } from "vue";
import { useRoute } from "vue-router";
import { updatePurchaseActiveStatus } from "src/services";
import { formatDate } from "src/utils/formatters";
import {
  useActiveToggleConfirmation,
  useClientDetails,
  useNavigation,
  usePurchaseDetails,
  usePurchasePayments,
} from "src/composables";
import type { Payment } from "src/models";
import { type PaymentPayload } from "src/components/types";
import { ContentState } from "src/components/common";
import { PurchaseDetailsCard } from "src/components/purchases";
import { PaymentListCard } from "src/components/payments";
import { dialogConfig, notifyConfig } from "src/config/purchases/dialogs";

const $route = useRoute();
const { notify } = useQuasar();
const { navigateTo } = useNavigation();
const purchaseId = computed(() => {
  const id = Number($route.params.id);
  return Number.isInteger(id) && id > 0 ? id : 0;
});
const { loading, error, purchase } = usePurchaseDetails(toRef(purchaseId));
const clientId = computed(() => purchase.value?.clientId || 0);
const { client } = useClientDetails(toRef(clientId));
const {
  loading: paymentsLoading,
  error: paymentsError,
  payments,
  reload: reloadPayments,
} = usePurchasePayments(toRef(purchaseId));
const { submitting, isActive, submitDialog } = useActiveToggleConfirmation(
  toRef(purchase),
  dialogConfig,
  notifyConfig,
  submit,
);
const selectedPayment = ref<Payment | null>(null);
const isPaymentModalOpen = ref(false);
const paymentFormData = ref<PaymentPayload>({
  description: null,
  amountCents: 0,
  method: "",
  paymentDate: null,
  receiptNumber: "",
});

watch(
  purchaseId,
  async (id) => {
    if (id <= 0) {
      notify({
        type: "negative",
        message: "Identificador da compra inválido!",
      });
      await navigateTo("/purchases");
    }
  },
  { immediate: true },
);

watch(error, async (err) => {
  if (!err) return;

  notify({
    type: err.type === "validation" ? "negative" : "warning",
    message: err.message,
  });

  await navigateTo("/purchases");
});

const loadState = computed(() => {
  if (loading.value) return "loading";
  if (error.value || !purchase.value) return "error";

  return "ready";
});
const errorMessage = computed(
  () => error.value?.message || "Erro inesperado ao carregar compra",
);

async function submit(nextValue: boolean) {
  if (!purchase.value) return;

  try {
    const response = await updatePurchaseActiveStatus(
      purchaseId.value,
      nextValue,
    );

    // Keep local purchase snapshot in sync after successful update
    purchase.value = response.purchase;
    await reloadPayments();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao atualizar compra!";

    notify({
      type: "negative",
      message,
    });
  }
}

function setPaymentFormData(data?: PaymentPayload) {
  const payload = data || {
    description: null,
    amountCents: 0,
    method: "",
    paymentDate: null,
    receiptNumber: "",
  };

  paymentFormData.value = payload;
}

function openPaymentModal(id?: number) {
  if (selectedPayment.value) return;

  if (id) {
    const paymentFound = payments.value.find((p) => p.id === id);
    if (!paymentFound) return;

    selectedPayment.value = paymentFound;
    setPaymentFormData({
      description: paymentFound.description,
      amountCents: paymentFound.amountCents,
      method: paymentFound.method,
      paymentDate: paymentFound.paymentDate,
      receiptNumber: paymentFound.receiptNumber,
    });
  }

  isPaymentModalOpen.value = true;
}

function cancelPaymentModal() {
  selectedPayment.value = null;
  setPaymentFormData();
  isPaymentModalOpen.value = false;
}
</script>

<style scoped>
.payment-form-card {
  max-width: 580px;
}
</style>
