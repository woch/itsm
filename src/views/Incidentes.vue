<!-- src/views/Incidentes.vue (versión sin @apply) -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Gestión de Incidentes</h1>
      <button @click="mostrarFormulario = !mostrarFormulario"
        class="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
        {{ mostrarFormulario ? 'Ver Listado' : 'Nuevo Incidente' }}
      </button>
    </div>

    <div v-if="mostrarFormulario" class="mb-8">
      <IncidentCard @incidenteCreado="handleIncidenteCreado" />
    </div>

    <div v-else>
      <div class="mb-4">
        <input 
          type="text" 
          v-model="terminoBusqueda"
          @input="buscarIncidentes"
          placeholder="Buscar por Número de Ticket, título o descripción..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div v-if="cargando" class="text-center py-10">Cargando incidentes...</div>
      <div v-else-if="error" class="text-center text-red-500 py-10">{{ error }}</div>
      
      <div v-else-if="incidentes.length === 0" class="text-center text-gray-500 py-10 bg-white rounded-lg shadow">
        No hay incidentes que coincidan con la búsqueda.
      </div>

      <div v-else class="bg-white shadow-md rounded-lg overflow-x-auto">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <!-- Clases aplicadas directamente aquí -->
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">N°</th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Título</th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prioridad</th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha Creación</th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="incidente in incidentes" :key="incidente._id" class="hover:bg-gray-50">
              <!-- Clases aplicadas directamente aquí -->
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 font-medium">{{ incidente.numeroIncidente }}</td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900">{{ incidente.titulo }}</td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900">
                <select v-model="incidente.prioridad" @change="actualizarIncidente(incidente._id, { prioridad: $event.target.value })" 
                  :class="getPrioridadClass(incidente.prioridad)"
                  class="w-full p-1 rounded border-none font-semibold text-xs text-center appearance-none">
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900">
                 <select v-model="incidente.estado" @change="actualizarIncidente(incidente._id, { estado: $event.target.value })" class="w-full text-xs p-1 rounded border">
                    <option value="Abierto">Abierto</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Resuelto">Resuelto</option>
                    <option value="Cerrado">Cerrado</option>
                </select>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900">{{ new Date(incidente.fechaCreacion).toLocaleDateString() }}</td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900">
                <button class="text-blue-600 hover:text-blue-900 text-sm">Ver Detalles</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';
import IncidentCard from '../components/IncidentCard.vue';

// El script se mantiene exactamente igual, no hay que cambiar nada aquí.
const incidentes = ref([]);
const cargando = ref(true);
const error = ref(null);
const mostrarFormulario = ref(false);
const terminoBusqueda = ref('');

const fetchIncidentes = async () => {
  cargando.value = true;
  error.value = null;
  try {
    const params = { q: terminoBusqueda.value };
    const response = await apiClient.get('/incidentes', { params });
    incidentes.value = response.data;
  } catch (err) {
    error.value = 'No se pudieron cargar los incidentes.';
  } finally {
    cargando.value = false;
  }
};

let searchTimeout;
const buscarIncidentes = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        fetchIncidentes();
    }, 300);
}

const handleIncidenteCreado = () => {
  mostrarFormulario.value = false;
  terminoBusqueda.value = ''; // Limpiamos la búsqueda
  fetchIncidentes();
}

const actualizarIncidente = async (id, updates) => {
  try {
    await apiClient.put(`/incidentes/${id}`, updates);
  } catch (err) {
    console.error("Error al actualizar incidente:", err);
    fetchIncidentes(); 
  }
};

const getPrioridadClass = (prioridad) => {
  switch (prioridad) {
    case 'Alta': return 'bg-red-200 text-red-900';
    case 'Media': return 'bg-yellow-200 text-yellow-900';
    case 'Baja': return 'bg-green-200 text-green-900';
    default: return 'bg-gray-200 text-gray-900';
  }
};

onMounted(() => {
  fetchIncidentes();
});
</script>

<!-- La etiqueta <style> ha sido eliminada por completo -->