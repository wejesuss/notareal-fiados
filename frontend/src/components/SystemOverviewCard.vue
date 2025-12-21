<template>
    <q-card>
        <!-- Header / Status -->
        <q-card-section>
            <div class="text-subtitle1">Visão geral</div>
            <div class="q-mt-sm">
                <div class="row items-center q-gutter-sm">
                    <q-icon :name="statusIcon" :color="statusColor" size="sm" />
                    <span class="text-body2">
                        {{ statusLabel }}
                    </span>
                </div>

                <div class="text-caption text-grey q-mt-xs">
                    Última atualização: {{ lastUpdatedLabel }}
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
    /**
     * If system status is up or down
     */
    isHealthy: boolean;
    /**
     * string representing the last update time
     */
    lastUpdated?: string | null;
}

const props = defineProps<Props>();

const statusLabel = computed(() =>
    props.isHealthy ? "Sistema ativo" : "Sistema com problemas"
);
const statusColor = computed(() => (props.isHealthy ? "positive" : "negative"));
const statusIcon = computed(() => (props.isHealthy ? "check_circle" : "error"));

const lastUpdatedLabel = computed(() => props.lastUpdated ?? "—");
</script>
