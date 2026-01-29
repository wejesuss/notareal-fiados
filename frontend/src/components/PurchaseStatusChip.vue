<template>
  <div class="q-mt-sm">
    <q-chip :outline="outline" :color="color" text-color="white">
      {{ label }}
    </q-chip>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  color: string;
  outline?: boolean;
}>();
</script>
