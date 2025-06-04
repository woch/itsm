<template>
  <div class="flex">
    <Sidebar />

    <main class="flex-1 p-6 bg-gray-100 min-h-screen">
      <h2 class="text-2xl font-bold mb-4">Bienvenido al Dashboard</h2>
      <p>Selecciona una opción del menú lateral para comenzar.</p>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
</script>
