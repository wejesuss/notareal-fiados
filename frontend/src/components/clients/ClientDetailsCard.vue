<template>
  <q-card v-if="loadState === 'loading'" class="q-my-xl q-pa-md">
    <ContentState
      message="Carregando cliente..."
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
  </q-card>

  <q-card v-else-if="loadState === 'empty'" class="q-my-xl q-pa-md">
    <ContentState message="Cliente indisponível"></ContentState>
  </q-card>

  <q-card v-else>
    <!-- Happy Path -->
    <q-card-section class="row items-center q-gutter-md">
      <div class="text-subtitle1 text-grey-9">Detalhes do cliente</div>
      <q-icon name="person_outline" size="md" color="grey-6"></q-icon>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-py-lg q-px-sm">
      <q-item
        class="client-container-border q-pt-md client-container"
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
              checked-icon="check"
              color="green"
              unchecked-icon="clear"
              :model-value="isActive"
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

          <q-separator class="q-mt-md" />

          <q-card-actions align="center" class="client-action">
            <q-btn
              flat
              role="button"
              tabindex="0"
              color="primary"
              class="full-width"
              :disable="submitting"
              @click="navigateTo(clientEditRoute)"
            >
              <q-icon name="edit" class="q-mr-sm" size="xs" />
              <span class="text-body2 text-weight-medium">Editar cliente</span>
            </q-btn>
          </q-card-actions>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, toRef, watch } from "vue";
import type { ClientUpdate } from "src/models";
import { updateClient } from "src/services";
import { formatDate } from "src/utils/formatters/date";
import {
  useNavigation,
  useClientDetails,
  useActiveToggleConfirmation,
} from "src/composables";
import { ContentState } from "src/components/common";
import { dialogConfig, notifyConfig } from "src/config/clients/dialogs";

interface ClientDetailsCardProps {
  clientId: number;
}
type LoadState = "loading" | "error" | "empty" | "ready";

const props = defineProps<ClientDetailsCardProps>();
const { navigateTo } = useNavigation();
const { loading, error, client } = useClientDetails(toRef(props, "clientId"));
const { submitting, isActive, submitDialog } = useActiveToggleConfirmation(
  toRef(client),
  dialogConfig,
  notifyConfig,
  submit,
);

const emit = defineEmits<{
  (e: "load-error", error: Error): void;
}>();

const clientEditRoute = computed(() => `/clients/${props.clientId}/edit`);
const errorMessage = computed(() => {
  return error.value?.message || "Erro inesperado ao carregar cliente";
});
const loadState = computed<LoadState>(() => {
  if (loading.value) return "loading";
  if (error.value) return "error";
  if (!client.value) return "empty";

  return "ready";
});

watch(error, (err) => {
  if (err) emit("load-error", new Error(errorMessage.value));
});

async function submit(nextValue: boolean) {
  const payload: ClientUpdate = {
    isActive: nextValue,
  };

  const response = await updateClient(props.clientId, payload);

  // Keep local client snapshot in sync after successful update
  client.value = response.client;
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

.client-action {
  padding: 2px 0;
}
</style>
