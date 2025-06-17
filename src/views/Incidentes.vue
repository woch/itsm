<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Gestión de Incidentes</h1>
      <button @click="mostrarFormulario = !mostrarFormulario"
        class="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
        {{ mostrarFormulario ? 'Ver Listado' : 'Nuevo Incidente' }}
      </button>
    </div>

    <!-- Formulario de creación (componente) -->
    <div v-if="mostrarFormulario" class="mb-8">
      <IncidentCard />
    </div>

    <!-- Listado de Incidentes -->
    <div v-else>
      <div v-if="cargando" class="text-center">Cargando incidentes...</div>
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
      
      <div v-else-if="incidentes.length === 0" class="text-center text-gray-500">
        No hay incidentes registrados.
      </div>

      <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                N°
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Título
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Prioridad
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
               Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="incidente in incidentes" :key="incidente._id">
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {{ incidente.numeroIncidente }}
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {{ incidente.titulo }}
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <span :class="getPrioridadClass(incidente.prioridad)" class="px-2 py-1 font-semibold leading-tight rounded-full text-xs">
                  {{ incidente.prioridad }}
                </span>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                 {{ incidente.estado }}
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {{ new Date(incidente.fechaCreacion).toLocaleDateString() }}
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <select v-model="incidente.estado" @change="actualizarEstado(incidente._id, $event.target.value)" class="text-xs p-1 rounded border">
                  <option value="Abierto">Abierto</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Resuelto">Resuelto</option>
                  <option value="Cerrado">Cerrado</option>
                </select>
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
import IncidentCard from '../components/IncidentCard.vue'; // Importamos el componente

const incidentes = ref([]);
const cargando = ref(true);
const error = ref(null);
const mostrarFormulario = ref(false);

const fetchIncidentes = async () => {
  cargando.value = true;
  error.value = null;
  try {
    const response = await apiClient.get('/incidentes');
    incidentes.value = response.data;
  } catch (err) {
    error.value = 'No se pudieron cargar los incidentes.';
    console.error(err);
  } finally {
    cargando.value = false;
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

const actualizarEstado = async (id, nuevoEstado) => {
  try {
    await apiClient.put(`/incidentes/${id}`, { estado: nuevoEstado });
    // Opcional: mostrar una notificación de éxito
    console.log(`Incidente ${id} actualizado a ${nuevoEstado}`);
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    // Revertir el cambio en la UI si falla la API
    fetchIncidentes(); 
  }
};

onMounted(() => {
  fetchIncidentes();
});
</script>