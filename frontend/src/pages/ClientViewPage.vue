<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl q-mt-sm">
      <div class="text-h5">Visualizar Cliente</div>
    </div>

    <!-- Content -->
    <q-card v-if="loading">Loading...</q-card>

    <q-card v-else>
      <q-card-section class="row items-center q-gutter-md">
        <div class="text-subtitle1 text-grey-9">Detalhes do cliente</div>
        <q-icon name="person_outline" size="md" color="grey-6"></q-icon>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg">
        <q-item class="client-row q-py-md client-container" v-if="client">
          <q-item-section>
            <div class="row items-center justify-between">
              <q-item-label class="text-h6 text-weight-bold">{{
                client.name
              }}</q-item-label>

              <q-toggle
                size="38px"
                name="active-status"
                v-model="isActive"
                checked-icon="check"
                color="green"
                unchecked-icon="clear"
                @update:model-value="submitDialog"
                :disable="submitting"
                ><q-chip
                  class="q-ml-sm"
                  :color="isActive ? 'green-5' : 'grey-7'"
                  text-color="white"
                  :label="isActive ? 'Cliente Ativo' : 'Cliente Inativo'"
                ></q-chip>
              </q-toggle>
            </div>

            <q-item-label
              class="text-caption text-indigo-14 letter-spaced label-spaced text-weight-medium"
              :class="client.nickname ? '' : 'italic-light'"
              >{{ client.nickname ? `(${client.nickname})` : "Sem apelido" }}
            </q-item-label>

            <q-item-label
              caption
              class="text-weight-medium label-spaced"
              :class="client.phone ? '' : 'italic-light'"
            >
              <q-icon name="phone" color="grey-8" size="14px"></q-icon>
              <span class="q-ml-sm contact-label">{{
                client.phone ?? "Sem telefone"
              }}</span>
            </q-item-label>

            <q-item-label
              caption
              class="text-weight-medium label-spaced"
              :class="client.email ? '' : 'italic-light'"
            >
              <q-icon name="mail" color="grey-8" size="14px"></q-icon>
              <span class="q-ml-sm contact-label">{{
                client.email ?? "Sem email"
              }}</span>
            </q-item-label>

            <div
              class="row items-center justify-between label-spaced meta-secondary"
            >
              <q-item-label caption>
                <span class="text-caption">Criado Em: </span>
                <span
                  class="text-weight-bolder letter-spaced"
                  :class="client.createdAt ? '' : 'italic-light'"
                >
                  {{
                    client.createdAt
                      ? formatDate(client.createdAt)
                      : "Sem data de criação"
                  }}</span
                >
              </q-item-label>

              <q-item-label caption>
                <span class="text-caption">Atualizado Em: </span>
                <span
                  class="text-weight-bolder letter-spaced"
                  :class="client.updatedAt ? '' : 'italic-light'"
                >
                  {{
                    client.updatedAt
                      ? formatDate(client.updatedAt)
                      : "Sem data de atualização"
                  }}
                </span>
              </q-item-label>
            </div>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>

    <q-card class="q-my-lg">
      <q-card-section class="row items-center q-gutter-md">
        <div class="text-subtitle1 text-grey-9">Resumo</div>
        <q-icon name="segment" size="md" color="grey-6"></q-icon>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg">
        <q-item class="client-row q-py-md client-container" v-if="summary">
          <q-item-section>
            <q-item-label class="text-h6 text-weight-medium letter-spaced">
              Resumo de compras
            </q-item-label>

            <q-item-label
              class="text-caption letter-spaced label-y-spaced-less text-weight-medium"
            >
              <span>Total de compras: </span>
              <span class="text-blue-10 summary-label">
                {{ summary.totalPurchases }} compras
              </span>
            </q-item-label>

            <q-item-label
              class="text-caption text-weight-medium letter-spaced label-y-spaced-less"
            >
              <span>Total Pago: </span>
              <span class="text-blue-10 summary-label">{{
                formatCurrency(summary.totalPaid)
              }}</span>
            </q-item-label>

            <q-item-label
              class="text-caption text-weight-medium letter-spaced label-y-spaced-less"
            >
              <span>Saldo em aberto: </span>
              <span class="text-blue-10 summary-label">
                {{ formatCurrency(summary.outstandingBalance) }}
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>

        <div
          v-else
          class="text-body2 text-center text-weight-medium text-grey-8 q-pa-md"
        >
          Resumo indisponível
          <q-icon
            name="cloud_off"
            size="md"
            color="grey-6"
            class="q-ml-sm"
          ></q-icon>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import type { Client, ClientSummary, ClientUpdate } from "src/models";
import { updateClient, getClientById, getClientSummary } from "src/services";
import { useNavigation } from "src/composables/useNavigation";
import { formatCurrency } from "src/utils/formatters/currency";

const $route = useRoute();
const { navigateTo } = useNavigation();
const $q = useQuasar();

const client = ref<Client | null>(null);
const summary = ref<ClientSummary | null>(null);
const isActive = ref(false);
const loading = ref(true);
const submitting = ref(false);

const id = computed(() => Number($route.params.id));

function formatDate(value?: string, timeZone?: string) {
  if (!value) return "—";
  if (!timeZone) timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Date(value).toLocaleString("pt-BR", {
    timeZone,
  });
}

async function clientNotFoundNotifyAndNavigate() {
  $q.notify({ type: "negative", message: "Cliente não encontrado" });
  await navigateTo("/clients");
}

async function loadClient(id: number) {
  loading.value = true;

  if (!Number.isInteger(id) || id <= 0) {
    await clientNotFoundNotifyAndNavigate();
    return;
  }

  try {
    client.value = await getClientById(id);
    isActive.value = client.value.isActive;
    await loadClientSummary(id);
  } catch {
    await clientNotFoundNotifyAndNavigate();
  } finally {
    loading.value = false;
  }
}

async function loadClientSummary(clientId: number) {
  try {
    summary.value = await getClientSummary(clientId);
  } catch (e) {
    console.error(e);
    summary.value = null;
  }
}

watch(
  () => id.value,
  async (newId) => {
    await loadClient(newId);
  },
  { immediate: true }
);

function cancelSubmit(error?: Error) {
  isActive.value = !isActive.value;
  if (error) {
    $q.notify({
      type: "negative",
      message: error.message,
    });
  }
}

async function submitDialog() {
  if (submitting.value || !client.value) return;
  submitting.value = true;

  try {
    if (isActive.value === false) {
      $q.dialog({
        title: "Tem certeza que deseja desativar este cliente?",
        message: `Este cliente não poderá ser usado para novas operações e todas as suas compras e pagamentos serão desativadas.`,
        options: {
          model: [""],
          type: "checkbox",
          isValid: (model) => model.includes("opt1"),
          items: [
            { label: "Entendo e desejo desativar o cliente", value: "opt1" },
          ],
        },
        cancel: "Cancelar",
        ok: "Desativar",
        noBackdropDismiss: true,
      })
        .onCancel(cancelSubmit)
        .onOk(() => void submit());
    } else {
      await submit();
    }
  } finally {
    submitting.value = false;
  }
}

async function submit() {
  try {
    const payload: ClientUpdate = {
      ...client.value,
      isActive: isActive.value,
    };
    console.log(payload);

    await updateClient(id.value, payload);

    const message = !isActive.value
      ? "Cliente desativado com sucesso"
      : "Cliente ativado. Compras e pagamentos não serão ativadas.";
    $q.notify({
      type: "positive",
      message,
    });
  } catch (e) {
    cancelSubmit(new Error("Erro ao desativar cliente"));
    console.error(e);
  }
}
</script>

<style scoped>
.label-spaced {
  margin-top: 20px;
}

.label-y-spaced-less {
  margin-top: 20px;
}

.label-y-spaced-less + .label-y-spaced-less {
  margin-top: 16px;
}

.row + .label-spaced {
  margin-top: 16px;
}

.letter-spaced {
  letter-spacing: 0.06em;
}

.client-container {
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
}

.client-row {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;
}

.client-row:active {
  background-color: #f0f0f0;
}

.meta-secondary {
  opacity: 0.75;
}

.contact-label {
  font-size: 0.8rem;
}

.summary-label {
  font-size: 0.85rem;
}

.italic-light {
  font-style: italic;
  font-weight: 400;
}
</style>
