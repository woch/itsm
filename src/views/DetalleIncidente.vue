<!-- src/views/DetalleIncidente.vue -->
<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div v-if="cargando" class="text-center py-20">
      <p>Cargando datos del incidente...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-else-if="incidente" class="bg-white shadow-xl rounded-lg p-6">
      <!-- Encabezado -->
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">{{ incidente.titulo }}</h1>
          <p class="text-sm text-gray-500">
            Ticket #{{ incidente.numeroIncidente }} - Creado el {{ new Date(incidente.fechaCreacion).toLocaleString() }}
          </p>
        </div>
        <router-link to="/incidentes" class="text-blue-600 hover:underline">← Volver al listado</router-link>
      </div>

      <!-- Datos Principales en Tarjetas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-gray-100 p-4 rounded-lg">
          <h3 class="font-semibold text-gray-600 text-sm">Estado</h3>
          <p class="text-lg font-bold">{{ incidente.estado }}</p>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg">
          <h3 class="font-semibold text-gray-600 text-sm">Prioridad</h3>
          <p class="text-lg font-bold" :class="getPrioridadClass(incidente.prioridad)">{{ incidente.prioridad }}</p>
        </div>
      </div>

      <!-- Descripción -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Descripción del Incidente</h2>
        <p class="text-gray-600 whitespace-pre-wrap">{{ incidente.descripcion }}</p>
      </div>

      <!-- Siguientes pasos aquí: Historial y Formulario de Respuesta -->
      <div class="border-t pt-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Historial y Respuestas</h2>
        <p class="text-gray-500">Próximamente aquí...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '../services/api';

const route = useRoute();
const incidente = ref(null);
const cargando = ref(true);
const error = ref(null);

const fetchIncidente = async () => {
  const incidenteId = route.params.id;
  cargando.value = true;
  error.value = null;
  try {
    const response = await apiClient.get(`/incidentes/${incidenteId}`);
    incidente.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.error || 'No se pudo cargar el incidente.';
  } finally {
    cargando.value = false;
  }
};

const getPrioridadClass = (prioridad) => {
  switch (prioridad) {
    case 'Alta': return 'text-red-600';
    case 'Media': return 'text-yellow-600';
    case 'Baja': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

onMounted(() => {
  fetchIncidente();
});
</script>