<template>
  <div
    class="text-body2 text-center text-weight-medium q-pa-md"
    :class="messageColor"
  >
    <q-spinner v-if="spinner" size="2.5em" :thickness="3" class="q-mr-sm" />
    <span v-if="message">{{ message }}</span>
    <q-icon
      v-if="iconName"
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
interface ContentStateProps {
  message?: string;
  messageColor?: TextColorClass;
  iconName?: string;
  iconColor?: NamedColor;
  spinner?: boolean;
}

withDefaults(defineProps<ContentStateProps>(), {
  messageColor: "text-grey-8",
  iconName: "cloud_off",
  iconColor: "grey-6",
});
</script>
