<template>
  <q-card flat bordered class="registry-card">
    <q-card-section>
      <!-- Title -->
      <div class="text-body2 text-grey-7">{{ title }}</div>

      <!-- Main value -->
      <div
        v-if="recentRegistries.length === 0"
        class="text-caption text-grey q-mt-md text-weight-bold"
      >
        Nenhum registro recente
      </div>

      <div
        v-else
        v-for="registry in recentRegistries"
        :key="registry.id"
        class="row items-center justify-between text-body2 q-mt-md"
      >
        <span class="text-weight-bold" :class="valueColor">
          {{ registry.name }}
        </span>
        <span class="text-body2 text-weight-medium" :class="valueTextColor">
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
        class="full-width"
        color="primary"
        :label="actionLabel"
        @click.stop="navigateTo"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
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

const valueTextColor = computed(() => props.valueColor ?? "text-grey");
</script>

<style scoped>
.registry-card {
  height: 100%;
}
</style>
