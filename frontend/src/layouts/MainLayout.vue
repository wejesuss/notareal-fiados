<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> AgroReal </q-toolbar-title>

        <div class="row items-center q-gutter-sm">
          <q-btn flat to="/" label="Dashboard" />
        </div>

        <q-space />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>
