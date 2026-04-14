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

    <q-card class="q-mt-xl">
      <ContentState
        v-if="loadState === 'loading'"
        message="Carregando clientes..."
        icon-name="person_search"
        class="q-pa-lg"
      ></ContentState>

      <template v-else-if="loadState === 'error'">
        <ContentState
          :message="errorMessage"
          message-color="text-amber-8"
          icon-name="error_outline"
          icon-color="amber-10"
        ></ContentState>
        <div class="q-mt-sm q-pb-md text-center">
          <q-btn rounded outline color="grey-8" @click="reload">
            Tentar de novo
          </q-btn>
        </div>
      </template>

      <!-- Content -->
      <template v-else>
        <q-card-section
          class="row items-center justify-between q-col-gutter-y-md"
        >
          <div class="text-subtitle1">Lista de clientes</div>
          <ListFilter :filters="clientFilters"></ListFilter>
        </q-card-section>

        <q-separator />

        <q-card-section
          v-if="loadState === 'empty'"
          class="text-center q-py-xl"
        >
          <q-icon name="people_outline" size="48px" color="grey-6"></q-icon>

          <div class="text-subtitle1 q-mt-md">
            {{ emptyMessage }}
          </div>
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
            v-for="client in clients"
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
          v-bind="page.bind"
          :max="totalPages"
          direction-links
          boundary-links
          class="q-mt-md q-pb-md justify-center"
          v-if="totalPages > 1"
        >
        </q-pagination>

        <div v-if="page.stateValue === totalPages" class="text-center q-pb-sm">
          <span class="text-caption text-grey-7 letter-spaced"
            >Todos os registros exibidos</span
          >
        </div>
      </template>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {
  useNavigation,
  useClients,
  useClientsQueryState,
} from "src/composables";
import { computed } from "vue";
import { ContentState, ListFilter } from "src/components/common";

type LoadState = "loading" | "error" | "empty" | "ready";

const { navigateTo } = useNavigation();
const { schema, page, rowsPerPage, onlyActive } = useClientsQueryState();
const { loading, error, clients, totalPages, reload } = useClients(schema);

const loadState = computed<LoadState>(() => {
  if (loading.value) return "loading";
  if (error.value) return "error";
  if (clients.value.length === 0) return "empty";

  return "ready";
});

const clientFilters = computed(() => [
  { bind: onlyActive.value.bind, label: "Filtro" },
  { bind: rowsPerPage.value.bind, label: "Por página", minWidth: 120 },
]);

const errorMessage = computed(() => {
  if (!error.value) return "Erro ao carregar clientes";
  return error.value.message;
});
const emptyMessage = computed(() => {
  const isFiltered = onlyActive.value.stateValue === true;
  return isFiltered
    ? "Nenhum cliente ativo encontrado"
    : "Nenhum cliente cadastrado ainda";
});
</script>

<style lang="css" scoped>
.letter-spaced {
  letter-spacing: 0.06em;
}

.client-row {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;

  max-width: 560px;
  margin-inline: auto;
  width: 100%;
}

.client-row:active {
  background-color: #f0f0f0;
}

.client-contact-label {
  margin-top: 2px;
}
</style>
