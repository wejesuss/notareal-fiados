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
        <div class="text-subtitle1">Dados do cliente</div>
        <q-icon name="person_outline" size="md" color="grey-6"></q-icon>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg">
        <q-item class="client-row q-py-md client-container" v-if="client">
          <q-item-section>
            <div class="row items-center justify-between">
              <q-item-label class="text-body1 text-weight-medium text-grey-10">
                {{ client.name }}
              </q-item-label>

              <q-toggle
                name="active-status"
                v-model="isActive"
                checked-icon="check"
                color="blue"
                unchecked-icon="clear"
                @update:model-value="submitDialog"
                :disable="submitting"
                ><q-chip
                  :color="isActive ? 'green-5' : 'grey-7'"
                  text-color="white"
                  :label="isActive ? 'Cliente Ativo' : 'Cliente Inativo'"
                ></q-chip>
              </q-toggle>
            </div>

            <q-item-label
              class="text-caption text-indigo-14 letter-spaced label-spaced"
              >{{ client.nickname ?? "Sem apelido" }}
            </q-item-label>

            <q-item-label caption class="label-spaced">
              <span>{{ client.phone ?? "Sem telefone" }}</span>
            </q-item-label>

            <q-item-label caption class="label-spaced">
              <span>{{ client.email ?? "Sem email" }}</span>
            </q-item-label>

            <div class="row items-center justify-between label-spaced">
              <q-item-label caption>
                <span
                  >Criado em:
                  {{
                    client.createdAt
                      ? formatDate(client.createdAt)
                      : "Sem data de criação"
                  }}</span
                >
              </q-item-label>

              <q-item-label caption>
                <span
                  >Atualizado Em:
                  {{
                    client.updatedAt
                      ? formatDate(client.updatedAt)
                      : "Sem data de atualização"
                  }}</span
                >
              </q-item-label>
            </div>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import type { Client, ClientUpdate } from "src/models";
import { updateClient, getClientById } from "src/services";
import { useNavigation } from "src/composables/useNavigation";

const $route = useRoute();
const { navigateTo } = useNavigation();
const $q = useQuasar();

const client = ref<Client | null>(null);
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
  } catch {
    await clientNotFoundNotifyAndNavigate();
  } finally {
    loading.value = false;
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

    $q.notify({
      type: "positive",
      message: "Cliente atualizado com sucesso",
    });
  } catch (e) {
    cancelSubmit(new Error("Erro ao desativar cliente"));
    console.error(e);
  }
}
</script>

<style scoped>
.label-spaced {
  margin-top: 18px;
}

.row + .label-spaced {
  margin-top: 12px;
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
</style>
