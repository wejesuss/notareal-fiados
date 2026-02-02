<template>
  <q-item
    clickable
    v-ripple
    :class="{ 'q-mx-md': !isCompact, 'q-px-md': !isCompact }"
    class="purchase-row purchase-container q-my-md q-mx-sm q-pa-sm"
    @click="onOpened()"
  >
    <!-- Main content -->
    <q-item-section>
      <q-item-label class="text-body1 text-weight-medium text-blue-8">
        {{ purchase.description }}
      </q-item-label>

      <q-item-label v-if="isCompact">
        <!-- Status chip inlined for small screens -->
        <PurchaseStatusChip
          class="q-mt-sm"
          :label="purchase.statusUI.label"
          :color="purchase.statusUI.color"
        />
      </q-item-label>

      <q-item-label
        class="text-grey-9 purchase-amount-label text-weight-medium"
      >
        <PurchaseAmounts
          :total="purchase.totalValue"
          :paid="purchase.totalPaidValue"
          :compact="isCompact"
        ></PurchaseAmounts>
      </q-item-label>

      <q-item-label class="text-grey-8 purchase-timestamp-label">
        <PurchaseTimeStamps
          :created-at="purchase.createdAt"
          :updated-at="purchase.updatedAt"
        ></PurchaseTimeStamps>
      </q-item-label>

      <!-- Edit button aligned after content -->
      <div class="row justify-between items-center q-mt-md">
        <q-btn
          outline
          rounded
          padding="4px 12px"
          size="12px"
          color="primary"
          @click.stop.prevent="onEdit()"
        >
          <q-icon name="edit" class="q-mr-sm" size="xs" />
          <span class="caption-medium">Editar</span>
        </q-btn>

        <!-- Active status chip bottom-right -->
        <PurchaseStatusChip
          v-if="isCompact"
          outline
          :color="purchase.activeStatusUI.color"
          :label="purchase.activeStatusUI.label"
        />
      </div>
    </q-item-section>

    <q-item-section v-if="!isCompact" side top class="justify-between">
      <!-- Status chip pinned right for larger screens -->
      <PurchaseStatusChip
        :label="purchase.statusUI.label"
        :color="purchase.statusUI.color"
      />
      <PurchaseStatusChip
        outline
        :label="purchase.activeStatusUI.label"
        :color="purchase.activeStatusUI.color"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuasar } from "quasar";
import type { PurchaseUI } from "../types";
import PurchaseAmounts from "src/components/PurchaseAmounts.vue";
import PurchaseStatusChip from "src/components/PurchaseStatusChip.vue";
import PurchaseTimeStamps from "src/components/PurchaseTimeStamps.vue";

defineProps<{
  purchase: PurchaseUI;
}>();

const emit = defineEmits<{
  open: [];
  edit: [];
}>();

const onEdit = () => emit("edit");
const onOpened = () => emit("open");

const COMPACT_WIDTH = 540;
const $q = useQuasar();
const isCompact = computed(() => $q.screen.width < COMPACT_WIDTH);
</script>

<style lang="css" scoped>
.purchase-container {
  min-height: 10em;
}

@media screen and (max-width: 540px) {
  .purchase-container {
    min-height: 14em;
  }
}

.purchase-row {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;
}

.purchase-row:active {
  background-color: #f0f0f0;
}

.purchase-amount-label {
  margin-top: 16px;
}

.purchase-timestamp-label {
  margin-top: 20px;
}
</style>
