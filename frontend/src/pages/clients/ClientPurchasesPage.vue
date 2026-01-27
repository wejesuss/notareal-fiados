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
        <div class="text-subtitle1">
          Lista de compras
          <span
            v-if="clientDisplayName"
            class="text-primary text-subtitle2 letter-spaced q-ml-xs"
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
            class="purchase-row purchase-container q-my-md q-mx-md q-pa-md"
            @click="navigateTo(`/purchases/${purchase.id}`)"
          >
            <!-- Main content -->
            <q-item-section>
              <q-item-label class="text-body1 text-weight-medium text-blue-8">
                {{ purchase.description }}
              </q-item-label>

              <q-item-label
                class="q-col-gutter-md text-grey-9 purchase-amount-label caption-medium text-weight-medium"
              >
                <div class="row items-center text-body2">
                  <span class="q-mr-xs">Total da compra:</span>
                  <span class="text-weight-bold text-blue-grey-7">{{
                    formatCurrency(purchase.totalValue)
                  }}</span>
                </div>
                <div class="row items-center text-body2">
                  <span class="q-mr-xs">Valor Pago:</span>
                  <span class="text-weight-bold text-blue-grey-7">{{
                    formatCurrency(purchase.totalPaidValue)
                  }}</span>
                </div>
              </q-item-label>

              <!-- Edit button aligned after content -->
              <div class="q-mt-md">
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
              </div>
            </q-item-section>

            <!-- Status chip pinned right -->
            <q-item-section side top class="justify-between">
              <q-chip :color="purchase.statusUI.color" text-color="white">
                {{ purchase.statusUI.label }}
              </q-chip>
              <q-chip
                outline
                :color="purchase.isActive ? 'positive' : 'grey-7'"
                text-color="white"
              >
                {{ purchase.isActive ? "Ativo" : "Inativo" }}
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
import { computed, ref, toRef, watch } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { getClientById } from "src/services";
import { useNavigation } from "src/composables/useNavigation";
import { getPurchaseStatusUI } from "src/utils/formatters/purchaseStatus";
import { formatCurrency } from "src/utils/formatters/currency";
import { useClientPurchases } from "src/composables/useClientPurchases";
import ContentState from "src/components/ContentState.vue";

const $route = useRoute();
const $q = useQuasar();
const { navigateTo } = useNavigation();
const id = computed(() => Number($route.params.id));
const clientDisplayName = ref<string | null>(null);

const { loading, error, purchases, paginatedPurchases, page, totalPages } =
  useClientPurchases(toRef(id));

async function clientNotFoundNotifyAndNavigate(e: Error, route = "/clients") {
  $q.notify({ type: "negative", message: e.message });

  await navigateTo(route);
}

type LoadState = "loading" | "error" | "empty" | "ready";
const loadState = computed<LoadState>(() => {
  if (loading.value) return "loading";
  if (error.value) return "error";
  if (purchases.value.length === 0) return "empty";
  return "ready";
});

const purchasesWithUI = computed(() =>
  paginatedPurchases.value.map((p) => ({
    ...p,
    statusUI: getPurchaseStatusUI(p.status, { titleCase: true }),
  })),
);

watch(
  () => id.value,
  async (newId) => {
    if (!Number.isInteger(newId) || newId <= 0) {
      void clientNotFoundNotifyAndNavigate(
        new Error("Identificador de cliente inválido!"),
      );

      return;
    }

    try {
      const client = await getClientById(newId);

      clientDisplayName.value = [client.name, client.nickname]
        .filter(Boolean)
        .join(" - ");
    } catch (e) {
      await clientNotFoundNotifyAndNavigate(e as Error);
    }
  },
  { immediate: true },
);
</script>

<style lang="css" scoped>
.purchase-container {
  min-height: 10em;
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
  margin-top: 2px;
}

.caption-medium {
  font-size: 0.8rem;
}
</style>
