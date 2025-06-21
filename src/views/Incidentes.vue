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
  <div v-if="modalVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
      <button @click="cerrarModal"
        class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-bold text-xl"
        aria-label="Cerrar modal">
        &times;
      </button>

      <h3 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        #{{ incidenteSeleccionado.numeroIncidente }} - {{ incidenteSeleccionado.titulo }}
      </h3>

      <p class="mb-2 text-gray-700 dark:text-gray-300"><strong>Descripción:</strong> {{
        incidenteSeleccionado.descripcion }}</p>

      <p class="mb-2 text-gray-700 dark:text-gray-300"><strong>Prioridad:</strong> {{ incidenteSeleccionado.prioridad }}
      </p>

      <p class="mb-2 text-gray-700 dark:text-gray-300"><strong>Estado:</strong> {{ incidenteSeleccionado.estado }}</p>

      <p class="mb-2 text-gray-700 dark:text-gray-300"><strong>Fecha de creación:</strong> {{ new
        Date(incidenteSeleccionado.fechaCreacion).toLocaleString() }}</p>

      <!-- Historial, si quieres mostrarlo -->
      <div v-if="incidenteSeleccionado.historial && incidenteSeleccionado.historial.length > 0" class="mt-4">
        <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">Historial</h4>
        <ul class="max-h-48 overflow-y-auto text-gray-700 dark:text-gray-300 text-sm space-y-1">
          <li v-for="(item, index) in incidenteSeleccionado.historial" :key="index">
            <span class="font-semibold">{{ item.autor }}:</span> {{ item.texto }} <em>({{ new
              Date(item.fecha).toLocaleString() }})</em>
          </li>
        </ul>
      </div>
    </div>
  </div>


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