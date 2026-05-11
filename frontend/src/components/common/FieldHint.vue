<template>
  <q-icon
    :name="icon"
    :size="iconSize ?? 'xs'"
    :class="{ 'cursor-pointer': clickable }"
  >
    <q-tooltip
      anchor="top middle"
      self="bottom middle"
      :delay="tooltipDelay.delay"
      :hide-delay="tooltipDelay.hideDelay ?? 0"
      class="tooltip-medium"
      >{{ tooltip }}
    </q-tooltip>

    <slot></slot>
  </q-icon>
</template>

<script setup lang="ts">
interface FieldHint {
  icon: string;
  iconSize?: string;
  tooltip: string;
  tooltipDelay?: { delay: number; hideDelay?: number };
  clickable?: boolean;
}

withDefaults(defineProps<FieldHint>(), {
  clickable: false,
  tooltipDelay: () => ({ delay: 250, hideDelay: 150 }),
});
</script>
