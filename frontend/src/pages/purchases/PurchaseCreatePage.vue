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
          <PurchaseForm :submitting="false">
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
import { PurchaseForm } from "src/components/purchases";
</script>

<style scoped>
.form-container {
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
}
</style>
