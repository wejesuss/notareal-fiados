<template>
  <div
    class="text-body2 text-center text-weight-medium q-pa-md"
    :class="messageColor"
  >
    {{ message }}
    <q-icon
      :name="iconName"
      size="md"
      :color="iconColor"
      class="q-ml-sm"
    ></q-icon>
  </div>
</template>

<script lang="ts" setup>
import type { NamedColor } from "quasar";

type TextColorClass = `text-${string}`;
interface EmptyStateProps {
  message: string;
  messageColor?: TextColorClass;
  iconName?: string;
  iconColor?: NamedColor;
}

withDefaults(defineProps<EmptyStateProps>(), {
  messageColor: "text-grey-8",
  iconName: "cloud_off",
  iconColor: "grey-6",
});
</script>
