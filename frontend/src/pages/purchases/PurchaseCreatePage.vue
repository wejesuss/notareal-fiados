<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl q-mt-sm">
      <div class="text-h5">Nova Compra</div>
    </div>

    <!-- Content -->
    <q-card>
      <q-card-section class="row items-center q-gutter-md">
        <div class="text-subtitle1">Dados da compra</div>
        <q-icon name="post_add" size="md" color="grey-6"></q-icon>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center q-pa-lg">
        <div class="form-container">
          <PurchaseForm :payload="payload" :submitting="submitting">
            <template #default>
              <!-- form subtitle -->
              <div
                class="text-subtitle1 text-weight-medium text-uppercase letter-spaced text-center q-mb-sm"
              >
                Cliente
              </div>

              <ClientLookupField
                v-model="clientId"
                @search-error="console.error"
              ></ClientLookupField>

              <!-- form subtitle -->
              <div
                class="text-subtitle1 text-weight-medium text-uppercase letter-spaced text-center q-mt-md"
              >
                Compra
              </div>
            </template>

            <template #buttons-container>
              <q-btn
                class="q-mr-md q-py-sm"
                color="grey-8"
                outline
                type="button"
                label="Cancelar"
              />
            </template>
          </PurchaseForm>
          <p>description: str</p>
          <p>total_cents: int</p>
          <p>note_number: str | None</p>
          <p># optional payment fields for creation</p>
          <p>amount_cents: int | None</p>
          <p>payment_date: int | None</p>
          <p>method: str | None</p>
          <p>payment_description: str | None</p>
          <p>receipt_number: str | None</p>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ClientLookupField } from "src/components/clients";
import { PurchaseForm } from "src/components/purchases";
import type { PurchasePayload } from "src/components/types";

const $route = useRoute();
const $router = useRouter();
const clientId = computed({
  get() {
    const id = Number($route.query.clientId);
    return Number.isInteger(id) && id > 0 ? id : null;
  },

  set(id) {
    void $router.replace({ query: id ? { clientId: id } : {} });
  },
});
const payload = ref<PurchasePayload>({
  description: "",
  totalCents: 0,
  noteNumber: "",
});
const submitting = ref(false);
</script>

<style scoped>
.form-container {
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
}
</style>
