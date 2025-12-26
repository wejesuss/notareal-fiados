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

      <q-list bordered separator class="q-pb-sm">
        <q-item
          v-for="client in clients"
          :key="client.id"
          clickable
          v-ripple
          class="client-row q-my-md q-pa-sm q-mx-md q-py-md"
          @click="navigateTo(`/clients/${client.id}`)"
        >
          <q-item-section>
            <q-item-label class="text-body1 text-weight-medium text-grey-10">
              {{ client.name }}
              <span
                v-if="client.nickname"
                class="q-ml-sm text-caption text-indigo-14 letter-spaced"
                >({{ client.nickname }})
              </span>
            </q-item-label>

            <q-item-label
              caption
              class="row q-col-gutter-sm client-contact-label"
            >
              <span>{{ client.email ?? "Sem email" }}</span>
              <span>{{ client.phone ?? "Sem telefone" }}</span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-chip
              :color="client.isActive ? 'positive' : 'grey-7'"
              text-color="white"
            >
              {{ client.isActive ? "Ativo" : "Inativo" }}
            </q-chip>
          </q-item-section>
        </q-item>
      </q-list>
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

.client-row {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;
}

.client-row:active {
  background-color: #f0f0f0;
}

.client-contact-label {
  margin-top: 2px;
}
</style>
