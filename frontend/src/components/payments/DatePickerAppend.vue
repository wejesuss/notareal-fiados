<template>
  <FieldHint
    icon="event"
    icon-size="sm"
    clickable
    tooltip="Selecionar a data"
    :tooltip-delay="{ delay: 250 }"
  >
    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
      <q-date
        :model-value="modelValue"
        @update:model-value="onModelChange"
        mask="YYYY-MM-DD"
      >
        <q-btn
          flat
          color="grey-7"
          label="Limpar"
          class="full-width"
          @click.prevent="onReset"
        />
      </q-date>
    </q-popup-proxy>
  </FieldHint>
</template>

<script setup lang="ts">
import type { QDateProps } from "quasar";
import FieldHint from "src/components/common/FieldHint.vue";

type UpdateModelFunction = NonNullable<QDateProps["onUpdate:modelValue"]>;

defineProps<{ modelValue: string | null }>();
const emit = defineEmits<{
  reset: [];
  "update:modelValue": Parameters<UpdateModelFunction>;
}>();

const onReset = () => emit("reset");
const onModelChange: UpdateModelFunction = (...args) =>
  emit("update:modelValue", ...args);
</script>
