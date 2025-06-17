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
        <router-link to="/incidentes" class="text-blue-600 hover:underline flex-shrink-0 ml-4">← Volver al listado</router-link>
      </div>

      <!-- Datos Principales -->
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

      <!-- =============================================== -->
      <!-- NUEVO: Sección de Acciones -->
      <!-- =============================================== -->
      <div class="border-t pt-4 mt-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Acciones</h3>
          <button 
            @click="convertirAProblema"
            :disabled="convirtiendo || incidente.estado.startsWith('Cerrado')"
            class="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors">
            {{ convirtiendo ? 'Convirtiendo...' : 'Convertir a Problema' }}
          </button>
          <p v-if="incidente.estado.startsWith('Cerrado')" class="text-xs text-gray-500 mt-1">
            Esta acción no está disponible para incidentes cerrados.
          </p>
      </div>

      <!-- =============================================== -->
      <!-- Sección de Historial y Respuestas -->
      <!-- =============================================== -->
      <div class="border-t pt-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Historial y Respuestas</h2>

        <!-- Lista de Respuestas -->
        <div class="space-y-4 mb-6">
          <div v-if="!incidente.historial || incidente.historial.length === 0" class="text-center text-gray-500 py-4">
            No hay respuestas todavía.
          </div>
          <div v-else v-for="item in incidente.historial" :key="item._id" class="bg-gray-50 p-4 rounded-lg border">
            <p class="text-gray-800">{{ item.texto }}</p>
            <p class="text-right text-xs text-gray-500 mt-2">
              - <span class="font-semibold">{{ item.autor }}</span> el {{ new Date(item.fecha).toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- Formulario para Nueva Respuesta -->
        <form @submit.prevent="enviarRespuesta">
          <h3 class="font-semibold text-gray-700 mb-2">Añadir una nueva respuesta</h3>
          <textarea 
            v-model="nuevaRespuestaTexto"
            rows="4" 
            placeholder="Escribe tu comentario o solución aquí..."
            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
          <div class="flex justify-end mt-2">
            <button 
              type="submit"
              :disabled="enviandoRespuesta"
              class="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
              {{ enviandoRespuesta ? 'Enviando...' : 'Enviar Respuesta' }}
            </button>
          </div>
        </form>
      </div>
      <!-- Fin de la sección de Historial -->

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

// --- NUEVAS VARIABLES REACTIVAS ---
const nuevaRespuestaTexto = ref('');
const enviandoRespuesta = ref(false);
const convirtiendo = ref(false);

const fetchIncidente = async () => {
  // ... (esta función no cambia)
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

// --- NUEVA FUNCIÓN ---
const enviarRespuesta = async () => {
  if (!nuevaRespuestaTexto.value.trim()) {
    alert('La respuesta no puede estar vacía.');
    return;
  }

  enviandoRespuesta.value = true;
  const incidenteId = route.params.id;
  
  try {
    const response = await apiClient.post(`/incidentes/${incidenteId}/respuesta`, {
      texto: nuevaRespuestaTexto.value,
      // En una app real, el autor vendría del usuario logueado.
      // Por ahora, lo pondremos fijo.
      autor: 'Equipo de Soporte' 
    });

    // Añadimos la nueva respuesta al historial local para una actualización instantánea
    incidente.value.historial.push(response.data.respuesta);
    
    // Limpiamos el textarea
    nuevaRespuestaTexto.value = '';

  } catch (err) {
    alert('Error al enviar la respuesta. Inténtalo de nuevo.');
    console.error(err);
  } finally {
    enviandoRespuesta.value = false;
  }
};

const convertirAProblema = async () => {
    if (!confirm('¿Estás seguro de que quieres convertir este incidente en un problema? Esta acción no se puede deshacer.')) {
        return;
    }

    convirtiendo.value = true;
    const incidenteId = route.params.id;

    try {
        const response = await apiClient.post(`/incidentes/${incidenteId}/convertir`);
        
        // Actualizamos el estado en el frontend para reflejar el cambio al instante
        incidente.value.estado = response.data.nuevoEstadoIncidente;
        
        alert(`¡Éxito! El incidente fue convertido al problema con ID: ${response.data.idProblema}`);

        // Opcional: recargar los datos para obtener la nueva nota del historial
        await fetchIncidente(); 
        
    } catch (err) {
        alert(err.response?.data?.error || 'Ocurrió un error al convertir el incidente.');
        console.error(err);
    } finally {
        convirtiendo.value = false;
    }
};


const getPrioridadClass = (prioridad) => {
  // ... (esta función no cambia)
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