import { computed, type Ref, ref } from "vue";
import {
  createPayment,
  updatePayment,
  updatePaymentActiveStatus,
} from "src/services";
import type { Payment } from "src/models";
import type { PaymentModalState, PaymentPayload } from "src/components/types";
import { isShallowEqual } from "src/utils/checkers/isShalowEqual";
import { APIError } from "src/api/errors";

export function usePaymentModal(purchaseId: Ref<number>) {
  const isOpen = ref(false);
  const state = ref<PaymentModalState>({ mode: "create" });
  const formData = computed<PaymentPayload | null>(() => {
    if (state.value.mode === "create") return null;

    return {
      description: state.value.payment.description,
      amountCents: state.value.payment.amountCents,
      method: state.value.payment.method,
      paymentDate: state.value.payment.paymentDate,
      receiptNumber: state.value.payment.receiptNumber,
    };
  });

  function openCreate() {
    if (isOpen.value) return;

    state.value = { mode: "create" };
    isOpen.value = true;
  }

  function openEdit(payment: Payment) {
    if (isOpen.value) return;

    state.value = {
      mode: "edit",
      payment: payment,
      isActive: payment.isActive,
    };

    isOpen.value = true;
  }

  function close() {
    state.value = { mode: "create" };
    isOpen.value = false;
  }

  async function submitPayment(
    payload: PaymentPayload,
    onSuccess: () => Promise<void>,
    onError: (err: APIError) => void | Promise<void>
  ) {
    try {
      const modalState = state.value;
      if (modalState.mode === "create") {
        await createPayment(purchaseId.value, payload);
        await onSuccess();
        close();
      } else {
        const isActiveChanged =
          modalState.payment.isActive !== modalState.isActive;
        if (isActiveChanged) {
          await updatePaymentActiveStatus(
            purchaseId.value,
            modalState.payment.id,
            modalState.isActive
          );
        }

        const isFormDirty =
          formData.value && !isShallowEqual(formData.value, payload);
        if (isFormDirty) {
          await updatePayment(purchaseId.value, modalState.payment.id, payload);
        }

        if (isActiveChanged || isFormDirty) {
          await onSuccess();
          close();
        }
      }
    } catch (err) {
      if (err instanceof APIError) {
        await onError(err);
      }
    }
  }

  return {
    isOpen,
    state,
    formData,
    openCreate,
    openEdit,
    close,
    submitPayment,
  };
}
