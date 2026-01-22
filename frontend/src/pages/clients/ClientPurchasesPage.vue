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
            v-if="clientName"
            class="text-primary text-subtitle2 letter-spaced q-ml-xs"
            >({{ clientName }})
          </span>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="purchases.length === 0" class="text-center q-py-xl">
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

      <q-list v-else class="q-pb-sm">
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
            <q-item-label class="text-body1 text-weight-medium text-grey-10">
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
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import type { Purchase } from "src/models";
import { getClientById, getClientPurchases } from "src/services";
import { useNavigation } from "src/composables/useNavigation";
import { getPurchaseStatusUI } from "src/utils/formatters/purchaseStatus";
import { formatCurrency } from "src/utils/formatters/currency";

const $route = useRoute();
const $q = useQuasar();
const { navigateTo } = useNavigation();

async function clientNotFoundNotifyAndNavigate(e: Error) {
  $q.notify({ type: "negative", message: e.message });

  await navigateTo("/clients");
}

const id = computed(() => {
  const pathId = Number($route.params.id);
  if (!Number.isInteger(pathId) || pathId <= 0) {
    void clientNotFoundNotifyAndNavigate(
      new Error("Identificador de cliente inválido!"),
    );
    return 0;
  }

  return pathId;
});
const clientName = ref<string | null>(null);

const page = ref(1);
const rowsPerPage = 10;
const purchases = ref<Purchase[]>([]);
const totalPages = computed(() =>
  Math.ceil(purchases.value.length / rowsPerPage),
);
const paginatedPurchases = computed(() => {
  const start = (page.value - 1) * rowsPerPage;
  return purchases.value.slice(start, start + rowsPerPage);
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
    try {
      const [client, clientPurchases] = await Promise.all([
        getClientById(newId),
        getClientPurchases(newId),
      ]);

      clientName.value = client.name;
      purchases.value = clientPurchases;
    } catch (e) {
      await clientNotFoundNotifyAndNavigate(e as Error);
    }
  },
  { immediate: true },
);

watch(
  () => purchases.value.length,
  () => {
    page.value = 1;
  },
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
