<template>
    <q-page padding>
        <div class="text-h5 q-mb-md">
            Painel
        </div>

        <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
        <system-overview-card
          :is-healthy="systemHealthy"
          :last-updated="lastUpdated"
          :active-clients="activeClients"
          :open-purchases="openPurchases"
          :open-amount="openAmount"
        />
            </div>

            <div class="col-12 col-md-4">
                <q-card>
                    <q-card-section>
                        <div class="text-subtitle1">Registros</div>
                        <div class="text-caption text-grey">
                            Em desenvolvimento
                        </div>
                    </q-card-section>
                </q-card>
            </div>

            <div class="col-12 col-md-4">
                <q-card>
                    <q-card-section>
                        <div class="text-subtitle1">Ações</div>
                        <div class="text-caption text-grey">
                            Atalhos rápidos
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import SystemOverviewCard from "src/components/SystemOverviewCard.vue";

const systemHealthy = true;
const lastUpdated = "há poucos segundos";
const activeClients = 50;
const openPurchases = 30;
const openAmount = 2367.9;
</script>
