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

    <q-card v-if="loadState === 'loading'" class="q-my-xl q-pa-md">
      <ContentState
        message="Carregando clientes..."
        icon-name="person_search"
      ></ContentState>
    </q-card>

    <q-card v-else-if="loadState === 'error'" class="q-my-xl q-pa-md">
      <ContentState
        :message="errorMessage"
        message-color="text-amber-8"
        icon-name="error_outline"
        icon-color="amber-10"
      ></ContentState>
      <div class="q-mt-sm text-center">
        <q-btn rounded outline color="grey-8" @click="reload">
          Tentar de novo
        </q-btn>
      </div>
    </q-card>

    <!-- Content -->
    <q-card v-else>
      <q-card-section class="row items-center justify-between">
        <div class="text-subtitle1">Lista de clientes</div>
        <div class="row items-center q-gutter-sm q-gutter-x-md">
          <q-select
            :model-value="schema.state.onlyActive.value"
            @update:model-value="
              (vl: boolean) => schema.setField('onlyActive', vl)
            "
            :options="activeOptions"
            label="Filtro"
            dense
            outlined
            emit-value
            map-options
            style="min-width: 160px"
          ></q-select>

          <q-select
            :model-value="schema.state.rowsPerPage.value"
            @update:model-value="
              (vl: number) => schema.setField('rowsPerPage', vl)
            "
            :options="rowsOptions"
            label="Por página"
            dense
            outlined
            emit-value
            map-options
            style="min-width: 120px"
          ></q-select>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="loadState === 'empty'" class="text-center q-py-xl">
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
        :model-value="schema.state.page.value"
        @update:model-value="(vl: number) => schema.setField('page', vl)"
        :max="totalPages"
        direction-links
        boundary-links
        class="q-mt-md q-pb-md justify-center"
        v-if="totalPages > 1"
      >
      </q-pagination>

      <div
        v-if="schema.state.page.value == totalPages"
        class="text-center q-pb-sm"
      >
        <span class="text-caption text-grey-7 letter-spaced"
          >Todos os registros exibidos</span
        >
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useNavigation, useClients, useListQueryState } from "src/composables";
import { computed } from "vue";
import { ContentState } from "src/components/common";

type LoadState = "loading" | "error" | "empty" | "ready";

const { navigateTo } = useNavigation();

const activeOptions = [
  { label: "Todos", value: false },
  { label: "Somente Ativos", value: true },
];
const rowsOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
];

const schema = useListQueryState({
  page: { default: 1, type: "number", resetPageOnChange: false },
  rowsPerPage: { default: 10, type: "number", resetPageOnChange: true },
  onlyActive: { default: true, type: "boolean", resetPageOnChange: true },
});

const { loading, error, clients, totalPages, reload } = useClients(schema);

const loadState = computed<LoadState>(() => {
  if (loading.value) return "loading";
  if (error.value) return "error";
  if (clients.value.length === 0) return "empty";

  return "ready";
});

const errorMessage = computed(
  () => error.value?.message || "Erro ao carregar clientes",
);
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
