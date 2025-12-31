<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl q-mt-sm">
      <div class="text-h5">Editar Cliente</div>
    </div>

    <!-- Content -->
    <q-card v-if="loading">Loading...</q-card>

    <q-card v-else>
      <q-card-section class="row items-center q-gutter-md">
        <div class="text-subtitle1">Dados do cliente</div>
        <q-icon name="people_outline" size="md" color="grey-6"></q-icon>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center q-pa-lg">
        <div class="form-container">
          <ClientForm
            :payload="clientNormalized"
            submit-label="Salvar"
            @submit="submit"
          ></ClientForm>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import type { Client, ClientCreate } from "src/models";
import { updateClient, getClientById } from "src/services";
import ClientForm from "src/components/ClientForm.vue";
import { useNavigation } from "src/composables/useNavigation";

const $route = useRoute();
const { navigateTo } = useNavigation();
const $q = useQuasar();

const id = computed(() => Number($route.params.id));
const client = ref<Client | null>(null);
const loading = ref(true);
const clientNormalized = computed((): ClientCreate => {
  return {
    name: client.value?.name || "",
    email: client.value?.email || null,
    nickname: client.value?.nickname || null,
    phone: client.value?.phone || null,
  };
});

async function fetchClient(id: number): Promise<Client> {
  console.log("Fetching client from API...");
  return await getClientById(id);
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
    client.value = await fetchClient(id);
  } catch (e) {
    console.log(e);
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

async function submit(payload: ClientCreate) {
  console.log(payload);
  await updateClient(id.value, payload);

  $q.notify({
    type: "positive",
    message: "Cliente atualizado com sucesso",
  });

  await navigateTo("/clients/");
}
</script>

<style scoped lang="css">
.form-container {
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
}
</style>
