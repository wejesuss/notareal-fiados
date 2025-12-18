<template>
    <q-page padding>
        <q-card>
            <q-card-section>
                <div class="text-h6">Dashboard</div>
                <div class="text-subtitle2 text-grey">Welcome. This is your starting point.</div>
            </q-card-section>

            <q-separator></q-separator>

            <q-card-section>
                <p>This page is working.</p>
                <p>Today: {{ today }}</p>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
    const today = new Date().toLocaleDateString()
</script>
