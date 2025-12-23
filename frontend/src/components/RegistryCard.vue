<template>
  <q-card class="registry-card">
    <q-card-section>
      <!-- Title -->
      <div class="text-body2 text-grey-7">{{ title }}</div>

      <!-- Main value -->
      <div class="text-h5 q-mt-xs" :class="valueColor">{{ value }}</div>

      <!-- Secondary info -->
      <div class="text-caption text-grey q-mt-xs">{{ subtitle }}</div>
    </q-card-section>

    <q-separator />

    <!-- Action -->
    <q-card-actions align="center">
      <q-btn
        flat
        dense
        color="primary"
        :label="actionLabel"
        @click.stop="navigateTo"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  valueColor?: string;
  route: string;
  actionLabel: string;
}

const props = defineProps<Props>();
const router = useRouter();

async function navigateTo() {
  await router.push({ path: props.route });
}
</script>

<style scoped>
.registry-card {
  height: 100%;
}
</style>
