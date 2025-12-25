<template>
  <q-card class="q-mb-xl">
    <q-card-section>
      <div class="text-subtitle1">Ações rápidas</div>
    </q-card-section>

    <q-card-section class="q-gutter-y-md">
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="add_shopping_cart"
        label="Nova compra"
        class="full-width letter-spaced q-py-sm"
        @click="navigateTo('/purchases/new')"
      ></q-btn>
      <q-btn
        outline
        rounded
        color="primary"
        icon="person_add"
        label="Novo cliente"
        class="full-width letter-spaced q-py-sm"
        @click="navigateTo('/clients/new')"
      ></q-btn>
      <q-btn
        outline
        rounded
        color="green-6"
        icon="payments"
        label="Registrar pagamento"
        class="full-width letter-spaced q-py-sm"
        @click="navigateTo('/payments/new')"
      ></q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useNavigation } from "src/composables/useNavigation";

const { navigateTo } = useNavigation();
</script>

<style lang="css" scoped>
.letter-spaced {
  letter-spacing: 0.04em;
}
</style>
