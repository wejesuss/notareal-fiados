<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn 
          flat 
          dense 
          round 
          icon="menu" aria-label="Menu" 
          @click="toggleDrawer" />

        <q-space />
        <q-toolbar-title> NotaReal Fiados </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <!-- DRAWER / MENU -->
     <q-drawer 
        v-model="leftDrawerOpen"
        show-if-above
        bordered
     >
        <q-list>
          <q-item clickable v-ripple to="/">
            <q-item-section avatar>
              <q-icon name="dashboard"></q-icon>
            </q-item-section>
            <q-item-section>
              Painel
            </q-item-section>
          </q-item>
          
          <q-item clickable v-ripple to="/clients">
            <q-item-section avatar>
              <q-icon name="people"></q-icon>
            </q-item-section>
            <q-item-section>
              Clientes
            </q-item-section>
          </q-item>
          
          <q-item clickable v-ripple to="/purchases">
            <q-item-section avatar>
              <q-icon name="receipt_long"></q-icon>
            </q-item-section>
            <q-item-section>
              Compras
            </q-item-section>
          </q-item>

        </q-list>
     </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
