<template>
  <q-card>
    <q-card-section class="row items-center q-gutter-md">
      <div class="text-subtitle1 text-grey-9">Detalhes do cliente</div>
      <q-icon name="person_outline" size="md" color="grey-6"></q-icon>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-py-lg q-px-sm">
      <q-item
        class="client-container-border q-py-md client-container"
        v-if="client"
      >
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
                :label="isActive ? 'Ativo' : 'Inativo'"
              ></q-chip>
            </q-toggle>
          </div>

          <q-item-label
            class="text-caption text-indigo-14 letter-spaced label-spaced text-weight-medium"
            :class="client.nickname ? '' : 'client-field-empty'"
            >{{ client.nickname ? `(${client.nickname})` : "Sem apelido" }}
          </q-item-label>

          <q-item-label
            caption
            class="text-weight-medium label-spaced"
            :class="client.phone ? '' : 'client-field-empty'"
          >
            <q-icon name="phone" color="grey-8" size="14px"></q-icon>
            <span class="q-ml-sm client-contact-label">{{
              client.phone ?? "Sem telefone"
            }}</span>
          </q-item-label>

          <q-item-label
            caption
            class="text-weight-medium label-spaced"
            :class="client.email ? '' : 'client-field-empty'"
          >
            <q-icon name="mail" color="grey-8" size="14px"></q-icon>
            <span class="q-ml-sm client-contact-label">{{
              client.email ?? "Sem email"
            }}</span>
          </q-item-label>

          <div
            class="row items-center justify-between label-spaced client-meta-secondary"
          >
            <q-item-label caption>
              <span class="text-caption">Criado Em: </span>
              <span
                class="text-weight-bolder letter-spaced"
                :class="client.createdAt ? '' : 'client-field-empty'"
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
                :class="client.updatedAt ? '' : 'client-field-empty'"
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
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import type { Client, ClientUpdate } from "src/models";
import { updateClient, getClientById } from "src/services";
import { formatDate } from "src/utils/formatters/date";

const $q = useQuasar();

interface ClientDetailsCardProps {
  id: number;
}

const props = defineProps<ClientDetailsCardProps>();
const emit = defineEmits(["exception"]);
const client = ref<Client | null>(null);
const isActive = ref(false);
const submitting = ref(false);

async function loadClient(id: number) {
  try {
    client.value = await getClientById(id);
    isActive.value = client.value.isActive;
  } catch (e) {
    emit("exception", e);
  }
}

watch(
  () => props.id,
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

    await updateClient(props.id, payload);

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
  margin-top: 16px;
}

.label-spaced + .label-spaced {
  margin-top: 20px;
}

.client-contact-label {
  font-size: 0.8rem;
}

.client-field-empty {
  font-style: italic;
  font-weight: 400;
}

.client-meta-secondary {
  opacity: 0.75;
}
</style>
