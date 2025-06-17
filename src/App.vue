<template>
  <div class="min-h-screen flex flex-col bg-gray-100 text-gray-800">
    <AppHeader />
    <main class="flex-grow p-6">
      <!-- Esto es donde se renderizarán las rutas -->
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<style>
/* Tu estilo global aquí */
</style>