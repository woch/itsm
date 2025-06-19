<!-- frontend/src/App.vue -->
<template>
  <div class="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- El encabezado solo se muestra si el usuario está autenticado -->
    <app-header v-if="isAuthenticated" />

    <main class="flex-grow container mx-auto p-4">
      <router-view />
    </main>
    
    <!-- Puedes añadir un pie de página si lo deseas -->
    <!-- <app-footer v-if="isAuthenticated" /> -->
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
// import AppFooter from './components/AppFooter.vue'; // Si tienes un footer
import { useAuth } from './composables/useAuth';

// Obtenemos el estado de autenticación para decidir si mostramos el header
const { isAuthenticated } = useAuth();
</script>

<style>
/* Tu estilo global aquí */
</style>