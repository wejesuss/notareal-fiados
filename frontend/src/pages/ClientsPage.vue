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
import { computed, ref } from "vue";
import { useNavigation } from "src/composables/useNavigation";
import { getClients } from "src/services";

const page = ref(1);
const rowsPerPage = 10;

const clients = computed(() => getClients());
const totalPages = computed(() =>
  Math.ceil(clients.value.length / rowsPerPage)
);
const paginatedClients = computed(() => {
  const start = (page.value - 1) * rowsPerPage;
  return clients.value.slice(start, start + rowsPerPage);
});

const { navigateTo } = useNavigation();
</script>

<style lang="css" scoped>
.letter-spaced {
  letter-spacing: 0.06em;
}

.caption-medium {
  font-size: 0.8rem;
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
