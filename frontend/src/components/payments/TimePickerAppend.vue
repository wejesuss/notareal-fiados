<template>
  <FieldHint
    icon="schedule"
    icon-size="sm"
    clickable
    tooltip="Selecionar o horário"
    :tooltip-delay="{ delay: 250 }"
  >
    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
      <q-time
        :model-value="modelValue"
        @update:model-value="onModelChange"
        format24h
        mask="HH:mm"
      >
        <q-btn
          flat
          color="grey"
          label="Limpar"
          class="full-width"
          @click.prevent="onReset"
        />
      </q-time>
    </q-popup-proxy>
  </FieldHint>
</template>

<script setup lang="ts">
import type { QTimeProps } from "quasar";
import FieldHint from "src/components/common/FieldHint.vue";

type UpdateModelFunction = NonNullable<QTimeProps["onUpdate:modelValue"]>;

defineProps<{ modelValue: string | null }>();
const emit = defineEmits<{
  reset: [];
  "update:modelValue": Parameters<UpdateModelFunction>;
}>();

const onReset = () => emit("reset");
const onModelChange: UpdateModelFunction = (...args) =>
  emit("update:modelValue", ...args);
</script>
