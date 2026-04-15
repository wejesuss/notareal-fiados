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
    ></PaymentListCard>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed, toRef, watch } from "vue";
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
</script>
