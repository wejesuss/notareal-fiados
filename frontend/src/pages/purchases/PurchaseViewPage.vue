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
      @hide="closePaymentModal"
    >
      <PaymentFormCard
        :payload="paymentFormData"
        :mode="paymentModalState.mode"
        @submit="onPaymentSubmit"
      >
        <q-toggle
          v-if="paymentModalState.mode === 'edit'"
          v-model="paymentModalState.isActive"
          checked-icon="check"
          color="green"
          :label="
            paymentModalState.isActive ? 'Pagamento Ativo' : 'Pagamento Inativo'
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
  createPayment,
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

type PaymentModalState =
  | { mode: "create" }
  | { mode: "edit"; payment: Payment; isActive: boolean };

const isPaymentModalOpen = ref(false);
const paymentModalState = ref<PaymentModalState>({ mode: "create" });
const paymentFormData = computed<PaymentPayload | null>(() => {
  if (paymentModalState.value.mode === "create") return null;

  return {
    description: paymentModalState.value.payment.description,
    amountCents: paymentModalState.value.payment.amountCents,
    method: paymentModalState.value.payment.method,
    paymentDate: paymentModalState.value.payment.paymentDate,
    receiptNumber: paymentModalState.value.payment.receiptNumber,
  };
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

function openPaymentModal(id?: number) {
  if (isPaymentModalOpen.value) return;

  if (id) {
    const paymentFound = payments.value.find((p) => p.id === id);
    if (!paymentFound) return;

    paymentModalState.value = {
      mode: "edit",
      payment: paymentFound,
      isActive: paymentFound.isActive,
    };
  } else {
    paymentModalState.value = { mode: "create" };
  }

  isPaymentModalOpen.value = true;
}

function closePaymentModal() {
  paymentModalState.value = { mode: "create" };
  isPaymentModalOpen.value = false;
}

async function onPaymentSubmit(payload: PaymentPayload) {
  try {
    const modalState = paymentModalState.value;
    if (modalState.mode === "create") {
      await createPayment(purchaseId.value, payload);
      await Promise.allSettled([reloadPurchase(), reloadPayments()]);
      closePaymentModal();
    } else {
      const isActiveChanged =
        modalState.payment.isActive !== modalState.isActive;
      if (isActiveChanged) {
        await updatePaymentActiveStatus(
          purchaseId.value,
          modalState.payment.id,
          modalState.isActive,
        );
      }

      const isFormDirty =
        paymentFormData.value &&
        !isShallowEqual(paymentFormData.value, payload);
      if (isFormDirty) {
        await updatePayment(purchaseId.value, modalState.payment.id, payload);
      }

      if (isActiveChanged || isFormDirty) {
        await Promise.allSettled([reloadPurchase(), reloadPayments()]);
        closePaymentModal();
      }
    }
  } catch (err) {
    if (err instanceof APIError) {
      notify({ type: "negative", message: err.message });
    }
  }
}
</script>
