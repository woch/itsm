<template>
  <div class="flex">
    <Sidebar />

    <main class="flex-1 p-6 bg-gray-100 min-h-screen">
      <h2 class="text-2xl font-bold mb-6">Bienvenido al Dashboard</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
          <h3 class="text-lg font-semibold text-gray-700">Abiertos</h3>
          <p class="text-3xl font-bold text-blue-600">{{ resumen.Abierto }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-yellow-500">
          <h3 class="text-lg font-semibold text-gray-700">En Proceso</h3>
          <p class="text-3xl font-bold text-yellow-600">{{ resumen['En proceso'] }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-green-500">
          <h3 class="text-lg font-semibold text-gray-700">Resueltos</h3>
          <p class="text-3xl font-bold text-green-600">{{ resumen.Resuelto }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-gray-500">
          <h3 class="text-lg font-semibold text-gray-700">Cerrados</h3>
          <p class="text-3xl font-bold text-gray-600">{{ resumen.Cerrado }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import apiClient from '../services/api' // tu instancia de Axios

const resumen = ref({
  Abierto: 0,
  'En proceso': 0,
  Resuelto: 0,
  Cerrado: 0
})

const obtenerResumen = async () => {
  try {
    const response = await apiClient.get('/incidentes/resumen-estados')
    resumen.value = response.data
  } catch (error) {
    console.error('Error al obtener el resumen:', error)
  }
}

onMounted(obtenerResumen)
</script>
