<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleDrawer"
        />

        <q-space />
        <q-toolbar-title style="min-width: fit-content">
          NotaReal Fiados
        </q-toolbar-title>
        <q-space />

        <!-- global search input -->
        <q-input
          dense
          filled
          color="primary"
          bg-color="white"
          v-model.trim="searchInput"
          placeholder="Buscar recurso"
          style="width: 220px"
          input-class="input-text-darkblue"
        >
          <template #append>
            <q-icon size="sm" name="manage_search"></q-icon>
          </template>
        </q-input>
      </q-toolbar>
    </q-header>

    <!-- DRAWER / MENU -->
    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="dashboard"></q-icon>
          </q-item-section>
          <q-item-section> Painel </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/clients">
          <q-item-section avatar>
            <q-icon name="people"></q-icon>
          </q-item-section>
          <q-item-section> Clientes </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/purchases">
          <q-item-section avatar>
            <q-icon name="receipt_long"></q-icon>
          </q-item-section>
          <q-item-section> Compras </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/payments/all">
          <q-item-section avatar>
            <q-icon name="payments"></q-icon>
          </q-item-section>
          <q-item-section> Pagamentos (Geral) </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";

const searchInput = ref("");
const leftDrawerOpen = ref(false);

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style lang="css">
.input-text-darkblue {
  color: #002f54;
}
</style>
