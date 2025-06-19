<!-- frontend/src/views/Incidentes.vue (REEMPLAZA EL CONTENIDO) -->
<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
    
    <!-- Vista para crear un nuevo incidente -->
    <div v-if="viewState === 'FORM'" class="w-full max-w-lg">
      <incident-card @incident-created="handleIncidentCreated" />
    </div>

    <!-- Vista de éxito después de crear el incidente -->
    <div v-else-if="viewState === 'SUCCESS'" class="w-full max-w-lg p-8 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
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
      <router-link to="/" class="inline-block px-6 py-2 mt-6 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Volver al Inicio
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
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
</script>