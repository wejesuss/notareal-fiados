<template>
  <!-- Details card -->
  <q-card class="q-mb-lg">
    <!-- Happy Path -->
    <q-card-section class="row items-center q-gutter-md">
      <div class="text-subtitle1 text-grey-9">Detalhes da compra</div>
      <q-icon name="shopping_bag" size="md" color="grey-6"></q-icon>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="purchase-container purchase-container-inactive">
        <div class="text-blue-8">
          <div class="text-h6">
            {{ purchase.description }}
          </div>
        </div>

        <div
          class="row items-center justify-between q-mt-md q-mb-lg q-gutter-x-lg"
        >
          <div class="text-subtitle2 text-grey-8" v-if="clientName">
            Nome do cliente:
            <span class="text-subtitle1 text-weight-bold">
              {{ clientName }}
            </span>
          </div>

          <div class="text-subtitle2 text-grey-7">
            Número da Nota:
            <span class="text-subtitle1 text-weight-medium text-grey-6">
              {{ purchase.noteNumber }}
            </span>
          </div>
        </div>

        <div class="purchase-totals">
          <div class="row items-center justify-between text-grey-9">
            <div class="text-subtitle1">Total</div>
            <div class="text-h6 text-weight-bold text-blue-grey-7">
              {{ formatCurrency(purchase.totalValue) }}
            </div>
          </div>

          <div class="row items-center justify-between q-mt-md">
            <div class="text-subtitle1 text-grey-9">Pago</div>
            <div
              class="text-h6 text-weight-bold"
              :class="purchaseStatusUI.textColor"
            >
              {{ formatCurrency(purchase.totalPaidValue) }}
            </div>
          </div>
        </div>

        <div
          class="row items-center justify-between q-mt-md text-grey-7 q-gutter-x-lg"
        >
          <div class="text-subtitle2">
            Criado Em:
            <span class="text-subtitle1 text-weight-bold">
              {{ formatDate(purchase.createdAt) }}
            </span>
          </div>

          <div class="text-subtitle2">
            Atualizado Em:
            <span class="text-subtitle1 text-weight-bold">
              {{ formatDate(purchase.updatedAt) }}
            </span>
          </div>
        </div>

        <q-separator class="q-mt-md" />

        <q-card-actions align="center" class="purchase-action">
          <q-btn
            flat
            role="button"
            tabindex="0"
            color="primary"
            class="full-width"
            :disable="submitting"
            @click="navigateTo(purchaseEditRoute)"
          >
            <q-icon name="edit" class="q-mr-sm" size="xs" />
            <span class="text-body2 text-weight-medium">Editar compra</span>
          </q-btn>
        </q-card-actions>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="row items-center purchase-status">
      <div class="col-6">
        <PurchaseStatusChip
          class="text-body2"
          :label="purchaseStatusUI.label"
          :color="purchaseStatusUI.color"
        ></PurchaseStatusChip>
      </div>
      <div class="col-6">
        <div>
          <q-toggle
            name="active-status"
            checked-icon="check"
            :color="purchaseActiveStatusUI.color"
            unchecked-icon="clear"
            :model-value="isActive"
            @update:model-value="onToggleIsActive"
            :disable="submitting"
          >
            <PurchaseStatusChip
              style="margin-top: 4px"
              :label="purchaseActiveStatusUI.label"
              :color="purchaseActiveStatusUI.color"
              outline
            />
          </q-toggle>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Purchase } from "src/models";
import {
  formatCurrency,
  formatDate,
  getPurchaseActiveStatusUI,
  getPurchaseStatusUI,
} from "src/utils/formatters";
import { useNavigation } from "src/composables";
import { PurchaseStatusChip } from "src/components/purchases";

const props = defineProps<{
  purchase: Purchase;
  isActive: boolean;
  submitting: boolean;
  clientName: string | undefined;
}>();
const emit = defineEmits<{
  toggleIsActive: [nextValue: boolean];
}>();

const { navigateTo } = useNavigation();
const purchaseId = computed(() => props.purchase.id);
const purchaseStatusUI = computed(() => {
  if (!props.purchase) return { color: "", label: "", textColor: "" };

  return getPurchaseStatusUI(props.purchase.status, { titleCase: true });
});
const purchaseActiveStatusUI = computed(() => {
  if (!props.purchase) return { color: "", label: "", textColor: "" };

  return getPurchaseActiveStatusUI(props.purchase.isActive);
});
const purchaseEditRoute = computed(() => `/purchases/${purchaseId.value}/edit`);

function onToggleIsActive(nextValue: boolean) {
  emit("toggleIsActive", nextValue);
}
</script>

<style scoped>
.purchase-container {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 16px;

  max-width: 650px;
  margin: 0 auto;
}

.purchase-container:active {
  background-color: #efefef;
  transition: 0.3s all;
}

.purchase-totals {
  padding: 8px 4px;
}

.purchase-totals > :first-child {
  padding-bottom: 12px;
  border-bottom: 1px solid #bbbbbb;
}

.purchase-action {
  padding: 2px 0;
}

.purchase-status {
  max-width: 500px;
  margin: 0 auto;
}

@media (max-width: 550px) {
  .purchase-status {
    max-width: 100%;
  }
}

.purchase-status .col-6:last-child {
  justify-items: end;
}
</style>
