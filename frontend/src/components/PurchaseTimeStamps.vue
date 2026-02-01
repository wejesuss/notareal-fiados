<template>
  <div>
    <div class="row items-center">
      <span class="q-mr-xs">Criado Em:</span>
      <span class="text-weight-medium text-blue-grey-6">{{ createdAt }}</span>
    </div>
    <div class="row items-center q-mt-sm">
      <span class="q-mr-xs">Atualizado em:</span>
      <span class="text-weight-medium text-blue-grey-6">{{ updatedAt }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  createdAt: string;
  updatedAt: string;
}>();
</script>
