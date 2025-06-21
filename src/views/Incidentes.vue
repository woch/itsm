<!-- frontend/src/views/Incidentes.vue (REEMPLAZA EL CONTENIDO) -->
<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">


    <div class="grid grid-cols-2 gap-4">

      <div class="bg-white p-4 shadow rounded">
        <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Mis incidentes
        </h2>

        <ul class="mt-4 divide-y divide-gray-200">
          <li v-for="incidente in incidentesUsuario" :key="incidente._id"
            class="py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2"
            @click="abrirModal(incidente)">
            <div class="text-sm font-semibold text-gray-800 dark:text-white">
              #{{ incidente.numeroIncidente }} - {{ incidente.titulo }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">
              Estado: <span class="font-medium">{{ incidente.estado }}</span> |
              Prioridad: <span class="font-medium">{{ incidente.prioridad }}</span> |
              Fecha: {{ new Date(incidente.fechaCreacion).toLocaleDateString() }}
            </div>
          </li>
        </ul>

        <p v-if="incidentesUsuario.length === 0" class="text-center text-sm text-gray-500 mt-4">
          No has creado ningún incidente aún.
        </p>



      </div>



      <div class="bg-white p-4 shadow rounded">
        <!-- Columna derecha -->

        <!-- Vista para crear un nuevo incidente -->
        <div v-if="viewState === 'FORM'" class="w-full max-w-lg">
          <incident-card @incident-created="handleIncidentCreated" />
        </div>

        <!-- Vista de éxito después de crear el incidente -->
        <div v-else-if="viewState === 'SUCCESS'"
          class="w-full max-w-lg p-8 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 class="text-2xl font-bold text-green-600 dark:text-green-400">¡Incidente Creado!</h2>
          <p class="mt-4 text-gray-700 dark:text-gray-300">
            Tu solicitud ha sido registrada correctamente.
          </p>
          <p class="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            Tu número de ticket es: <span class="text-blue-500">#{{ createdIncidentNumber }}</span>
          </p>
          <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Recibirás notificaciones sobre el estado de tu ticket.
          </p>
          <router-link to="/"
            class="inline-block px-6 py-2 mt-6 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Volver al Inicio
          </router-link>
        </div>
      </div>
    </div>






  </div>

  <!-- Modal -->
  <div v-if="modalVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative border border-gray-200 dark:border-gray-700 transition-transform transform-gpu">
      <!-- Botón cerrar -->
      <button @click="cerrarModal"
        class="absolute top-4 right-4 text-gray-500 hover:text-red-600 dark:hover:text-red-400 text-2xl font-bold"
        aria-label="Cerrar modal">
        &times;
      </button>

      <!-- Título -->
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        #{{ incidenteSeleccionado.numeroIncidente }} - {{ incidenteSeleccionado.titulo }}
      </h3>

      <!-- Detalles del incidente -->
      <div class="space-y-3 mt-4 text-gray-700 dark:text-gray-300">
        <p><strong class="text-gray-800 dark:text-gray-100">Descripción:</strong> {{ incidenteSeleccionado.descripcion
          }}</p>

        <p>
          <strong class="text-gray-800 dark:text-gray-100">Prioridad:</strong>
          <span :class="{
            'bg-green-100 text-green-800': incidenteSeleccionado.prioridad === 'Baja',
            'bg-yellow-100 text-yellow-800': incidenteSeleccionado.prioridad === 'Media',
            'bg-red-100 text-red-800': incidenteSeleccionado.prioridad === 'Alta'
          }" class="inline-block px-2 py-0.5 rounded text-sm font-medium">
            {{ incidenteSeleccionado.prioridad }}
          </span>
        </p>

        <p>
          <strong class="text-gray-800 dark:text-gray-100">Estado:</strong>
          <span class="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm font-medium">
            {{ incidenteSeleccionado.estado }}
          </span>
        </p>

        <p><strong class="text-gray-800 dark:text-gray-100">Fecha de creación:</strong> {{ new
          Date(incidenteSeleccionado.fechaCreacion).toLocaleString() }}</p>
      </div>

      <!-- Historial -->
      <div v-if="incidenteSeleccionado.historial?.length" class="mt-6">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">🕒 Historial de Respuestas</h4>
        <div class="max-h-56 overflow-y-auto pr-2">
          <ul class="space-y-3 text-sm">
            <li v-for="(item, index) in incidenteSeleccionado.historial" :key="index"
              class="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
              <p class="mb-1"><strong>{{ item.autor }}</strong> <span class="text-xs text-gray-500">({{ new
                Date(item.fecha).toLocaleString() }})</span></p>
              <p>{{ item.texto }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Fin del modal -->




</template>

<script setup>
import { ref, onMounted } from 'vue'
import IncidentCard from '../components/IncidentCard.vue'; // Asegúrate que esta ruta es correcta

// Estado para controlar qué vista mostrar: 'FORM' o 'SUCCESS'
const viewState = ref('FORM');

const createdIncidentNumber = ref(null);

// Esta función se ejecuta cuando IncidentCard emite el evento 'incident-created'
function handleIncidentCreated(data) {
  // Guardamos el número del incidente que nos llegó desde el componente hijo
  createdIncidentNumber.value = data.numeroIncidente;

  // Cambiamos la vista para mostrar el mensaje de éxito
  viewState.value = 'SUCCESS';
}



import apiClient from '../services/api' // Asegúrate de tener esta instancia configurada

const usuarioId = ref(null)
const incidentesUsuario = ref([])

const incidenteSeleccionado = ref(null)  // Aquí guardaremos el incidente para el modal
const modalVisible = ref(false)

onMounted(async () => {
  const userData = localStorage.getItem('user')
  if (userData) {
    try {
      const user = JSON.parse(userData)
      console.log('User:', user)
      usuarioId.value = user._id || user.id || null

      if (!usuarioId.value) {
        console.error('No se encontró un ID válido en user')
        return
      }

      const response = await apiClient.get(`/incidentes/usuario/${usuarioId.value}`)
      incidentesUsuario.value = response.data
    } catch (e) {
      console.error('Error parseando usuario o cargando incidentes:', e)
    }
  }
})

// Función para abrir modal con el incidente clicado
function abrirModal(incidente) {
  incidenteSeleccionado.value = incidente
  modalVisible.value = true
}

// Función para cerrar modal
function cerrarModal() {
  modalVisible.value = false
  incidenteSeleccionado.value = null
}




</script>