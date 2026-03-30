<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg q-mt-md">
      <div class="text-h5">Compras</div>

      <q-btn
        color="primary"
        icon="person_add"
        label="Nova compra"
        @click="navigateTo('/purchases/new')"
      />
    </div>

    <!-- Content -->
    <q-card>
      <q-card-section
        class="row items-center justify-between q-col-gutter-y-md"
      >
        <div
          class="text-subtitle1 row items-center q-gutter-x-sm q-col-gutter-y-xs"
        >
          <span>Lista de compras</span>
          <router-link
            v-if="clientDisplayName"
            :to="clientLink"
            class="client-link"
          >
            <span class="text-primary text-subtitle2 letter-spaced client-name">
              ({{ clientDisplayName }})
            </span>
          </router-link>
          <span
            v-else-if="loadState === 'client-error'"
            class="text-grey text-subtitle2 client-name"
            >(Erro ao carregar Cliente)
          </span>
        </div>

        <!-- Filtering components (select inputs) -->
        <ListFilter :filters="purchasesFilters"></ListFilter>
      </q-card-section>

      <q-separator />

      <!-- Load state -->
      <q-card-section v-if="loadState === 'loading'">
        <ContentState
          message="Carregando compras..."
          icon-name="shopping_cart"
        />
      </q-card-section>

      <!-- Error states - This catches 'client-error' and 'error' together -->
      <q-card-section
        v-else-if="loadState === 'client-error' || loadState === 'error'"
      >
        <ContentState
          :message="errorMessage"
          icon-name="error_outline"
          icon-color="amber-10"
        />

        <div class="q-mt-sm text-center">
          <q-btn rounded outline color="grey-8" @click="reload">
            Tentar de novo
          </q-btn>
        </div>
      </q-card-section>

      <!-- Empty state -->
      <q-card-section
        v-else-if="loadState === 'empty'"
        class="text-center q-py-xl"
      >
        <q-icon name="shopping_cart" size="48px" color="grey-6"></q-icon>

        <div class="text-subtitle1 q-mt-md">Nenhuma compra ainda</div>
        <div
          class="text-caption caption-medium letter-spaced text-grey-7 q-mt-xs"
        >
          Comece cadastrando sua primeira compra
        </div>

        <q-btn
          class="q-mt-md"
          color="primary"
          icon="add_shopping_cart"
          label="Nova compra"
          @click="navigateTo('/purchases/new')"
        ></q-btn>
      </q-card-section>

      <!-- Happy path -->
      <div v-else>
        <q-list class="q-pb-sm">
          <PurchaseRow
            v-for="purchase in purchasesWithUI"
            :purchase="purchase"
            :key="purchase.id"
            @open="navigateTo(`/purchases/${purchase.id}`)"
            @edit="navigateTo(`/purchases/${purchase.id}/edit`)"
          >
          </PurchaseRow>
        </q-list>

        <q-pagination
          v-model="page.stateValue"
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
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, toRef, watch } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import {
  useNavigation,
  useClientDetails,
  useClientPurchases,
  usePurchasesUI,
  usePurchasesQueryState,
} from "src/composables";
import { ContentState, ListFilter } from "src/components/common";
import { PurchaseRow } from "src/components/purchases";
import { APIError } from "src/api/errors";

type LoadState = "loading" | "client-error" | "error" | "empty" | "ready";

const $route = useRoute();
const $q = useQuasar();
const { navigateTo } = useNavigation();
const clientId = computed(() => Number($route.params.id));

const {
  client,
  error: clientError,
  reload: reloadClient,
} = useClientDetails(toRef(clientId));

const { schema, page, rowsPerPage, status } = usePurchasesQueryState();
const {
  loading,
  error,
  purchases,
  totalPages,
  reload: reloadPurchases,
} = useClientPurchases(toRef(clientId), schema);

const { purchasesWithUI } = usePurchasesUI(purchases);

const loadState = computed<LoadState>(() => {
  // loading is always false after successful fetching or error
  if (clientError.value) return "client-error";
  if (loading.value) return "loading";
  if (error.value) return "error";
  // purchases is set as empty on error, so check is made after error check
  if (purchases.value.length === 0) return "empty";
  return "ready";
});

async function handleClientNotFound(e: Error) {
  $q.notify({ type: "negative", message: e.message });

  await navigateTo("/clients");
}

const clientDisplayName = computed(() => {
  if (!client.value) return null;

  const { name, nickname } = client.value;
  return [name, nickname].filter(Boolean).join(" - ");
});
const clientLink = computed(() => `/clients/${clientId.value}`);

const purchasesFilters = computed(() => [
  {
    bind: status.value.bind,
    label: "Filtro",
  },
  {
    bind: rowsPerPage.value.bind,
    label: "Por página",
    minWidth: 120,
  },
]);

const errorMessage = computed(
  () =>
    clientError.value?.message ||
    error.value?.message ||
    "Erro ao carregar cliente com compras",
);

const reload = async () => {
  if (clientError.value) await reloadClient();
  if (error.value) await reloadPurchases();
};

watch(
  clientError,
  async (err) => {
    if (!err) return;
    if (err instanceof APIError && err.status === 404) {
      await handleClientNotFound(err);
    }
  },
  { once: true },
);
</script>

<style lang="css" scoped>
.client-name {
  min-width: 0;
}

.client-link {
  text-decoration: none;
}

.client-link:hover {
  text-decoration: underline;
}
</style>
