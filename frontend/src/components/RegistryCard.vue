<template>
  <q-card flat bordered class="registry-card">
    <q-card-section>
      <!-- Title -->
      <div class="text-body2 text-grey-7">{{ title }}</div>

      <!-- Main value -->
      <div
        v-for="registry in recentRegistries"
        :key="registry.id"
        class="row items-center justify-between text-body2 q-mt-md"
      >
        <span :class="valueColor" class="text-weight-bold">{{
          registry.name
        }}</span>
        <span class="text-caption text-h5" :class="valueColor ?? 'text-grey'">
          {{ registry.value }}
        </span>
      </div>

      <!-- Secondary info -->
      <div class="text-subtitle2 text-grey q-mt-lg" v-if="subtitle">
        {{ subtitle }}
      </div>
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
  subtitle?: string;
  route: string;
  actionLabel: string;
  valueColor?: string;
  recentRegistries: Array<{
    id: string | number | symbol;
    name: string;
    value: string | number;
  }>;
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
