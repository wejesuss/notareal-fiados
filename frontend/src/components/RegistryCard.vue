<template>
  <q-card flat bordered class="registry-card">
    <q-card-section>
      <!-- Title -->
      <div :class="titleClass">{{ title }}</div>

      <!-- Fallback -->
      <div
        v-if="recentRegistries.length === 0"
        class="text-caption text-grey q-mt-md text-weight-bold"
      >
        Nenhum registro recente
      </div>

      <!-- Main value -->
      <div v-else>
        <div
          v-for="registry in recentRegistries"
          :key="registry.id"
          class="row items-center justify-between text-body2 q-mt-md registry-card"
        >
          <!-- Registry name -->
          <div class="registry-name registry-scroll">
            <span
              class="text-weight-bold registry-name-text registry-scroll-inner"
              :class="nameTextColor"
            >
              {{ registry.name }}
            </span>
          </div>

          <!-- Registry value -->
          <div
            class="row items-center text-body2 text-weight-medium q-ml-sm registry-value"
            :class="resolveValueColor(registry.valueColor)"
          >
            <span>
              {{ registry.value }}
            </span>
            <!-- Icon and complement text -->
            <span v-if="registry.valueComplement" class="q-ml-xs">
              <q-icon
                :name="registry.icon ?? iconText"
                :color="registry.iconColor ?? iconTextColor"
                size="xs"
              />
              {{ registry.valueComplement }}
            </span>
          </div>
        </div>
      </div>

      <!-- Secondary info -->
      <div class="text-subtitle2 text-grey q-mt-lg" v-if="subtitle">
        {{ subtitle }}
      </div>
    </q-card-section>

    <q-separator v-if="hasActions" />

    <!-- Action -->
    <q-card-actions
      v-if="$slots.actions || actionLabel"
      :align="actionsAlign"
      class="registry-action"
    >
      <slot name="actions">
        <!-- default behavior (backward compatible) -->
        <div
          role="button"
          tabindex="0"
          @click="navigateTo(route)"
          @keydown.enter="navigateTo(route)"
          @keydown.space.prevent="navigateTo(route)"
        >
          <span class="text-primary text-body2 text-weight-medium">
            {{ actionLabel }}
          </span>
        </div>
      </slot>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import { useNavigation } from "src/composables/useNavigation";
import type { RegistryCardProps } from "./models";

const props = defineProps<RegistryCardProps>();
const slots = useSlots();
const { navigateTo } = useNavigation();

const hasActions = computed(() => {
  return !!slots.actions || !!props.actionLabel;
});
const nameTextColor = computed(() => props.nameColor ?? "text-grey");
const iconText = computed(() => props.icon ?? "circle");
const iconTextColor = computed(() => props.iconColor ?? "amber");
const titleClass = computed(() => {
  switch (props.titleVariant) {
    case "emphasis":
      return "text-h6 text-weight-medium letter-spaced";

    case "muted":
      return "text-body2 text-grey-6";

    default:
      return "text-body2 text-grey-7";
  }
});
const actionsAlign = computed(() => props.actionsAlign ?? "center");

const resolveValueColor = (itemColor?: string) =>
  itemColor ?? props.valueColor ?? "text-grey";
</script>

<style scoped>
.registry-card {
  height: 100%;
  flex-wrap: nowrap;
  align-items: flex-start;
}

.registry-name {
  min-width: 0;
  max-width: 100%;
}

.registry-value {
  justify-content: flex-end;
  min-width: fit-content;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}

.registry-name-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  transition: all 0.3s ease-in;
}

.registry-scroll {
  overflow: hidden;
  position: relative;
}

.registry-scroll-inner {
  align-items: center;
  gap: 4px;
}

@keyframes led-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-100%);
  }
}

.registry-scroll:hover .registry-scroll-inner,
.registry-scroll:focus-within .registry-scroll-inner {
  display: inline-flex;
  animation: led-scroll 6s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .registry-value:hover .registry-scroll-inner {
    animation: none;
  }
}

.registry-action {
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-transform: uppercase;
}

.registry-action:hover,
.registry-action:focus-visible {
  background-color: rgba(0, 0, 0, 0.06);
}
</style>
