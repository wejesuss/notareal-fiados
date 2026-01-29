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
      <q-card-section>
        <div
          class="text-subtitle1 row items-center q-gutter-x-sm q-col-gutter-y-xs"
        >
          <span>Lista de compras</span>
          <span
            v-if="clientDisplayName"
            class="text-primary text-subtitle2 letter-spaced client-name"
            >({{ clientDisplayName }})
          </span>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Load state -->
      <q-card-section v-if="loadState === 'loading'">
        <ContentState
          message="Carregando compras..."
          icon-name="shopping_cart"
        />
      </q-card-section>

      <!-- Error state -->
      <q-card-section v-else-if="loadState === 'error'">
        <ContentState
          :message="error?.message || 'Erro ao carregar compras'"
          icon-name="error_outline"
          icon-color="amber-10"
        />
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
          <q-item
            v-for="purchase in purchasesWithUI"
            :key="purchase.id"
            clickable
            v-ripple
            :class="{ 'q-mx-md': !isCompact, 'q-px-md': !isCompact }"
            class="purchase-row purchase-container q-my-md q-mx-sm q-pa-sm"
            @click="navigateTo(`/purchases/${purchase.id}`)"
          >
            <!-- Main content -->
            <q-item-section>
              <q-item-label class="text-body1 text-weight-medium text-blue-8">
                {{ purchase.description }}
              </q-item-label>

              <q-item-label v-if="isCompact">
                <!-- Status chip inlined for small screens -->
                <PurchaseStatusChip
                  class="q-mt-sm"
                  :label="purchase.statusUI.label"
                  :color="purchase.statusUI.color"
                />
              </q-item-label>

              <q-item-label
                class="text-grey-9 purchase-amount-label caption-medium text-weight-medium"
              >
                <PurchaseAmounts
                  :total="purchase.totalValue"
                  :paid="purchase.totalPaidValue"
                  :compact="isCompact"
                ></PurchaseAmounts>
              </q-item-label>

              <!-- Edit button aligned after content -->
              <div class="row justify-between items-center q-mt-md">
                <q-btn
                  outline
                  rounded
                  padding="4px 12px"
                  size="12px"
                  color="primary"
                  @click.stop.prevent="
                    navigateTo(`/purchases/${purchase.id}/edit`)
                  "
                >
                  <q-icon name="edit" class="q-mr-sm" size="xs" />
                  <span class="caption-medium">Editar</span>
                </q-btn>

                <!-- Active status chip bottom-right -->
                <PurchaseStatusChip
                  v-if="isCompact"
                  outline
                  :color="purchase.activeStatusUI.color"
                  :label="purchase.activeStatusUI.label"
                />
              </div>
            </q-item-section>

            <q-item-section v-if="!isCompact" side top class="justify-between">
              <!-- Status chip pinned right for larger screens -->
              <PurchaseStatusChip
                :label="purchase.statusUI.label"
                :color="purchase.statusUI.color"
              />
              <PurchaseStatusChip
                outline
                :label="purchase.activeStatusUI.label"
                :color="purchase.activeStatusUI.color"
              />
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

        <div v-if="page === totalPages" class="text-center q-pb-sm">
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
} from "src/composables";
import {
  getPurchaseStatusUI,
  getPurchaseActiveStatusUI,
} from "src/utils/formatters";
import ContentState from "src/components/ContentState.vue";
import PurchaseAmounts from "src/components/PurchaseAmounts.vue";
import PurchaseStatusChip from "src/components/PurchaseStatusChip.vue";

type LoadState = "loading" | "error" | "empty" | "ready";

const $route = useRoute();
const $q = useQuasar();
const { navigateTo } = useNavigation();
const clientId = computed(() => Number($route.params.id));

const { client, error: clientError } = useClientDetails(toRef(clientId));
const { loading, error, purchases, paginatedPurchases, page, totalPages } =
  useClientPurchases(toRef(clientId));

const COMPACT_WIDTH = 540;
const isCompact = computed(() => $q.screen.width < COMPACT_WIDTH);
const loadState = computed<LoadState>(() => {
  if (loading.value) return "loading";
  if (clientError.value || error.value) return "error";
  if (purchases.value.length === 0) return "empty";
  return "ready";
});

async function handleClientNotFound(e: Error, route = "/clients") {
  $q.notify({ type: "negative", message: e.message });

  await navigateTo(route);
}

const clientDisplayName = computed(() => {
  return client.value
    ? [client.value.name, client.value.nickname].filter(Boolean).join(" - ")
    : null;
});
const purchasesWithUI = computed(() =>
  paginatedPurchases.value.map((p) => ({
    ...p,
    statusUI: getPurchaseStatusUI(p.status, { titleCase: true }),
    activeStatusUI: getPurchaseActiveStatusUI(p.isActive),
  })),
);

watch(
  clientError,
  async (err) => {
    if (!err) return;
    await handleClientNotFound(
      new Error(err.message || "Erro ao carregar cliente!"),
    );
  },
  { once: true },
);
</script>

<style lang="css" scoped>
.purchase-container {
  min-height: 10em;
}

@media screen and (max-width: 540px) {
  .purchase-container {
    min-height: 14em;
  }
}

.client-name {
  min-width: 0;
}

.purchase-row {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;
}

.purchase-row:active {
  background-color: #f0f0f0;
}

.purchase-amount-label {
  margin-top: 16px;
}

.caption-medium {
  font-size: 0.8rem;
}
</style>
