<template>
  <q-card flat bordered class="registry-card">
    <q-card-section>
      <!-- Title -->
      <div class="text-body2 text-grey-7">{{ title }}</div>

      <!-- Fallback -->
      <div
        v-if="recentRegistries.length === 0"
        class="text-caption text-grey q-mt-md text-weight-bold"
      >
        Nenhum registro recente
      </div>

      <!-- Main value -->
      <div
        v-else
        v-for="registry in recentRegistries"
        :key="registry.id"
        class="row items-center justify-between text-body2 q-mt-md"
      >
        <!-- Registry name -->
        <span class="text-weight-bold" :class="nameTextColor">
          {{ registry.name }}
        </span>

        <!-- Registry value -->
        <div
          class="row items-center text-body2 text-weight-medium"
          :class="resolveValueColor(registry.valueColor)"
        >
          {{ registry.value }}
          <!-- Icon and complement text -->
          <div v-if="registry.valueComplement" class="q-ml-sm">
            <q-icon
              :name="iconText"
              :color="iconTextColor"
              size="xs"
              class="q-mr-sm"
            />{{ registry.valueComplement }}
          </div>
        </div>
      </div>

      <!-- Secondary info -->
      <div class="text-subtitle2 text-grey q-mt-lg" v-if="subtitle">
        {{ subtitle }}
      </div>
    </q-card-section>

    <q-separator />

    <!-- Action -->
    <q-card-actions
      class="registry-action"
      align="center"
      role="button"
      tabindex="0"
      @click="navigateTo"
      @keydown.enter="navigateTo"
      @keydown.space.prevent="navigateTo"
    >
      <span class="text-primary text-center text-body2 text-weight-medium">
        {{ actionLabel }}
      </span>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { RegistryCardProps } from "./models";

const props = defineProps<RegistryCardProps>();
const router = useRouter();

async function navigateTo() {
  await router.push({ path: props.route });
}

const nameTextColor = computed(() => props.nameColor ?? "text-grey");
const iconText = computed(() => props.icon ?? "circle");
const iconTextColor = computed(() => props.iconColor ?? "amber");

const resolveValueColor = (itemColor?: string) =>
  itemColor ?? props.valueColor ?? "text-grey";
</script>

<style scoped>
.registry-card {
  height: 100%;
}

.registry-action {
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-transform: uppercase;
}

.registry-action:hover,
.registry-action:focus-visible {
  background-color: rgba(0, 0, 0, 0.06);
}
</style>
