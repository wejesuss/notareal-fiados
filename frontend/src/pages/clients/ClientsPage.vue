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

      <q-card-section v-if="clients.length === 0" class="text-center q-py-xl">
        <q-icon name="people_outline" size="48px" color="grey-6"></q-icon>

        <div class="text-subtitle1 q-mt-md">Nenhum cliente ainda</div>
        <div
          class="text-caption caption-medium letter-spaced text-grey-7 q-mt-xs"
        >
          Comece cadastrando seu primeiro cliente
        </div>

        <q-btn
          class="q-mt-md"
          color="primary"
          icon="person_add"
          label="Novo cliente"
          @click="navigateTo('/clients/new')"
        ></q-btn>
      </q-card-section>

      <q-list v-else class="q-pb-sm">
        <q-item
          v-for="client in paginatedClients"
          :key="client.id"
          clickable
          v-ripple
          class="client-row q-my-md q-pa-sm q-mx-md q-py-md"
          @click="navigateTo(`/clients/${client.id}`)"
        >
          <!-- Main content -->
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

            <!-- Edit button aligned after content -->
            <div class="q-mt-md">
              <q-btn
                outline
                rounded
                padding="4px 12px"
                size="12px"
                color="primary"
                @click.stop.prevent="navigateTo(`/clients/${client.id}/edit`)"
              >
                <q-icon name="edit" class="q-mr-sm" size="xs" />
                <span class="caption-medium">Editar</span>
              </q-btn>
            </div>
          </q-item-section>

          <!-- Status chip pinned right -->
          <q-item-section side top>
            <q-chip
              :color="client.isActive ? 'positive' : 'grey-7'"
              text-color="white"
            >
              {{ client.isActive ? "Ativo" : "Inativo" }}
            </q-chip>
          </q-item-section>
        </q-item>
      </q-list>

      <q-pagination
        v-model="page"
        :max="totalPages"
        direction-links
        boundary-links
        class="q-mt-md q-pb-md justify-center"
        v-if="totalPages > 1"
      >
      </q-pagination>

      <div v-else class="text-center q-pb-sm">
        <span class="text-caption text-grey-7 letter-spaced"
          >Todos os registros exibidos</span
        >
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useNavigation } from "src/composables/core/useNavigation";
import { getClients } from "src/services";
import type { Client } from "src/models";

const page = ref(1);
const rowsPerPage = 10;

const clients = ref<Client[]>([]);
watch(
  () => rowsPerPage,
  async () => {
    clients.value = await getClients({ onlyActive: false });
  },
  { immediate: true },
);
const totalPages = computed(() =>
  Math.ceil(clients.value.length / rowsPerPage),
);
const paginatedClients = computed(() => {
  const start = (page.value - 1) * rowsPerPage;
  return clients.value.slice(start, start + rowsPerPage);
});

watch(
  () => clients.value.length,
  () => {
    page.value = 1;
  },
);
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
