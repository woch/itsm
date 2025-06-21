<!-- src/views/DetalleIncidente.vue -->
<template>
  <div class="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
    <div v-if="cargando" class="text-center py-20 text-gray-500">
      Cargando datos del incidente...
    </div>
    
    <div v-else-if="error" class="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-else-if="incidente" class="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
      <!-- Encabezado del Ticket -->
      <div class="bg-gray-800 text-white p-6">
        <div class="flex justify-between items-center">
          <p class="text-sm font-medium text-gray-400">TICKET #{{ incidente.numeroIncidente }}</p>
          <router-link to="/incidentes" class="text-sm text-blue-400 hover:text-blue-300 transition-colors">← Volver al listado</router-link>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold mt-2">{{ incidente.titulo }}</h1>
        <p class="text-xs text-gray-400 mt-2">Creado el {{ new Date(incidente.fechaCreacion).toLocaleString() }}</p>
      </div>

      <div class="p-6">
        <!-- Badges de Estado y Prioridad -->
        <div class="flex flex-wrap gap-4 mb-8">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-600">Estado:</span>
            <span class="px-3 py-1 text-sm font-bold rounded-full" :class="getEstadoClass(incidente.estado)">
              {{ incidente.estado }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-600">Prioridad:</span>
            <span class="px-3 py-1 text-sm font-bold rounded-full" :class="getPrioridadClass(incidente.prioridad)">
              {{ incidente.prioridad }}
            </span>
          </div>
        </div>

        <!-- Descripción -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Descripción del Incidente</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ incidente.descripcion }}</p>
        </div>
        
        <!-- Acciones -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Acciones</h2>
          <button 
            @click="convertirAProblema"
            :disabled="convirtiendo || incidente.estado.startsWith('Cerrado')"
            class="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors shadow-md">
            {{ convirtiendo ? 'Convirtiendo...' : 'Convertir a Problema' }}
          </button>
        </div>

        <!-- Historial y Respuestas -->
        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Historial y Respuestas</h2>
          
          <!-- Formulario para Nueva Respuesta -->
          <form @submit.prevent="enviarRespuesta" class="mb-6">
            <textarea 
              v-model="nuevaRespuestaTexto"
              rows="4" 
              placeholder="Escribe tu comentario o solución aquí..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              required
            ></textarea>
            <div class="flex justify-end mt-3">
              <button 
                type="submit"
                :disabled="enviandoRespuesta"
                class="bg-gray-800 text-white font-bold py-2 px-5 rounded-lg hover:bg-gray-900 disabled:bg-gray-400 transition-colors shadow-md">
                {{ enviandoRespuesta ? 'Enviando...' : 'Enviar Respuesta' }}
              </button>
            </div>
          </form>

          <!-- Lista de Respuestas (Timeline) -->
          <div class="space-y-6">
            <div v-if="!incidente.historial || incidente.historial.length === 0" class="text-center text-gray-500 py-4 border-t">
              No hay respuestas todavía.
            </div>
            <div v-else v-for="item in incidente.historial.slice().reverse()" :key="item._id" class="flex gap-4 border-t pt-4">
              <div class="flex-shrink-0 bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center font-bold text-gray-600">
                {{ item.autor.substring(0, 1) }}
              </div>
              <div>
                <p class="font-semibold text-gray-800">{{ item.autor }}</p>
                <p class="text-sm text-gray-700 mt-1">{{ item.texto }}</p>
                <p class="text-xs text-gray-400 mt-2">{{ new Date(item.fecha).toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
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
  const userData = localStorage.getItem('user')
  try {
    let autor = 'Equipo de Soporte'; // Valor por defecto
    let idautor = null;

    try {
      const user = JSON.parse(userData)
      idautor = user.id
      autor = `${user.nombre} ${user.apellido}`
    } catch (e) {
      console.error('Error al parsear el usuario:', e)
    }


    const response = await apiClient.post(`/incidentes/${incidenteId}/respuesta`, {
      texto: nuevaRespuestaTexto.value,
      // En una app real, el autor vendría del usuario logueado.
      // Por ahora, lo pondremos fijo.
      autor: autor 
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

const getEstadoClass = (estado) => {
  if (estado.startsWith('Cerrado')) return 'bg-gray-200 text-gray-800';
  if (estado === 'En Progreso') return 'bg-blue-100 text-blue-800';
  if (estado === 'Resuelto') return 'bg-purple-100 text-purple-800';
  return 'bg-green-100 text-green-800'; // Abierto
}

onMounted(() => {
  fetchIncidente();
});
</script>