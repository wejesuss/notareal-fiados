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

    <q-dialog
      :maximized="$q.screen.width < 480"
      :model-value="isPaymentModalOpen"
      @hide="cancelPaymentModal"
    >
      <PaymentFormCard
        :payload="paymentFormData"
        :payment-id="selectedPayment?.id ?? null"
        @submit="onPaymentSubmit"
      >
        <q-toggle
          v-model="selectedPaymentIsActive"
          checked-icon="check"
          color="green"
          :label="
            selectedPaymentIsActive ? 'Pagamento Ativo' : 'Pagamento Inativo'
          "
          unchecked-icon="clear"
          :class="$q.screen.width < 480 ? 'full-width' : 'q-mr-lg'"
        />
        <q-btn flat label="Cancelar" v-close-popup />
      </PaymentFormCard>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed, ref, toRef, watch } from "vue";
import { useRoute } from "vue-router";
import {
  updatePurchaseActiveStatus,
  updatePayment,
  updatePaymentActiveStatus,
} from "src/services";
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
import { PaymentFormCard, PaymentListCard } from "src/components/payments";
import { dialogConfig, notifyConfig } from "src/config/purchases/dialogs";
import { isShallowEqual } from "src/utils/checkers/isShalowEqual";
import { APIError } from "src/api/errors";

const $route = useRoute();
const { notify } = useQuasar();
const { navigateTo } = useNavigation();
const purchaseId = computed(() => {
  const id = Number($route.params.id);
  return Number.isInteger(id) && id > 0 ? id : 0;
});
const {
  loading,
  error,
  purchase,
  reload: reloadPurchase,
} = usePurchaseDetails(toRef(purchaseId));
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
const paymentFormData = computed<PaymentPayload | null>(() => {
  if (!selectedPayment.value) return null;

  return {
    description: selectedPayment.value.description,
    amountCents: selectedPayment.value.amountCents,
    method: selectedPayment.value.method,
    paymentDate: selectedPayment.value.paymentDate,
    receiptNumber: selectedPayment.value.receiptNumber,
  };
});
const selectedPaymentIsActive = ref<boolean>(false);

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

function openPaymentModal(id?: number) {
  if (selectedPayment.value) return;

  if (id) {
    const paymentFound = payments.value.find((p) => p.id === id);
    if (!paymentFound) return;

    selectedPayment.value = paymentFound;
    selectedPaymentIsActive.value = paymentFound.isActive;
  }

  isPaymentModalOpen.value = true;
}

function cancelPaymentModal() {
  selectedPayment.value = null;
  selectedPaymentIsActive.value = false;
  isPaymentModalOpen.value = false;
}

async function onPaymentSubmit(id: number | null, payload: PaymentPayload) {
  try {
    if (!id) {
      // create payment
      return;
    }

    if (!selectedPayment.value || !paymentFormData.value) return;

    const isActiveChanged =
      selectedPayment.value.isActive !== selectedPaymentIsActive.value;
    if (isActiveChanged) {
      await updatePaymentActiveStatus(
        purchaseId.value,
        id,
        selectedPaymentIsActive.value,
      );
    }

    const isFormDirty = !isShallowEqual(paymentFormData.value, payload);
    if (isFormDirty) {
      await updatePayment(purchaseId.value, id, payload);
    }

    if (isActiveChanged || isFormDirty) {
      await Promise.allSettled([reloadPurchase(), reloadPayments()]);
    }
  } catch (err) {
    if (err instanceof APIError) {
      notify({ type: "negative", message: err.message });
    }
  }
}
</script>
