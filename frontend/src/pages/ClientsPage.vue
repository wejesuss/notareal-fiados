<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">Clientes</div>

      <q-btn
        color="primary"
        icon="person_add"
        label="Novo cliente"
        @click="navigateTo('/clients/new')"
      />
    </div>

    <!-- Content -->
    <q-card>
      <q-card-section>
        <div class="text-subtitle1">Lista de clientes</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div
          v-for="client in clients"
          :key="client.id"
          class="row items-center justify-between q-py-sm"
        >
          <div>
            <div class="text-body1">
              {{ client.name }}
              <span
                v-if="client.nickname"
                class="q-ml-md text-caption text-indigo-14 letter-spaced"
                >({{ client.nickname }})</span
              >
            </div>
            <div class="text-caption text-grey-7 row">
              <span>{{ client.email ?? "Sem email" }}</span>
              <span class="q-ml-md">{{ client.phone ?? "Sem telefone" }}</span>
            </div>
          </div>

          <q-chip
            :color="client.isActive ? 'positive' : 'grey-7'"
            text-color="white"
          >
            {{ client.isActive ? "Ativo" : "Inativo" }}
          </q-chip>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useNavigation } from "src/composables/useNavigation";
import { getClients } from "src/services";

const clients = computed(() => getClients());

const { navigateTo } = useNavigation();
</script>

<style lang="css" scoped>
.letter-spaced {
  letter-spacing: 0.06em;
}
</style>
