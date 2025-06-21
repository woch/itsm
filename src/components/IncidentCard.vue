<!-- src/components/IncidentCard.vue -->
<template>
  <div class="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">
      Crear Nuevo Incidente
    </h2>
    <p class="text-center text-gray-600 dark:text-gray-400">
      Reporta y da seguimiento a problemas de IT.
    </p>
    <form @submit.prevent="submitForm" class="space-y-4">

      <!-- Campo oculto para ID -->
      <input type="hidden" v-model="incidente.usuarioId" />

      <!-- Campo de nombre solo lectura -->
      <div>
        <label class="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">👤 Usuario</label>
        <input type="text" :value="incidente.usuarioNombre" disabled
          class="w-full px-3 py-2 mt-1 border border-gray-300 bg-gray-100 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-not-allowed" />
      </div>


      <div>
        <label for="titulo" class="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">📝 Título del
          Incidente</label>
        <input v-model="incidente.titulo" type="text" id="titulo"
          class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required>
        <p v-if="errores.titulo" class="mt-1 text-xs text-red-500">{{ errores.titulo }}</p>
      </div>
      <div>
        <label for="descripcion" class="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">📄
          Descripción Detallada</label>
        <textarea v-model="incidente.descripcion" id="descripcion" rows="4"
          class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required></textarea>
        <p v-if="errores.descripcion" class="mt-1 text-xs text-red-500">{{ errores.descripcion }}</p>
      </div>
      <div>
        <label for="prioridad" class="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">⚠️
          Prioridad</label>
        <select v-model="incidente.prioridad" id="prioridad"
          class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required>
          <option value="" disabled>Selecciona una prioridad</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        <p v-if="errores.prioridad" class="mt-1 text-xs text-red-500">{{ errores.prioridad }}</p>
      </div>
      <div>
        <button type="submit" :disabled="isSubmitting"
          class="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
          {{ isSubmitting ? 'Enviando...' : 'Enviar Incidente' }}
        </button>
      </div>
      <p v-if="mensaje" class="mt-2 text-sm text-center text-green-600 dark:text-green-400">{{ mensaje }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import apiClient from '../services/api';
import { onMounted } from 'vue'

// 'defineEmits' le dice a Vue que este componente puede "emitir" un evento llamado 'incident-created'
const emit = defineEmits(['incident-created']);

const incidente = reactive({
  titulo: '',
  descripcion: '',
  prioridad: 'Media', // Valor por defecto
});

const errores = reactive({
  titulo: '',
  descripcion: '',
  prioridad: '',
});



onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    try {
      const user = JSON.parse(userData)
      incidente.usuarioId = user.id
      incidente.usuarioNombre = `${user.nombre} ${user.apellido}`
    } catch (e) {
      console.error('Error al parsear el usuario:', e)
    }
  }
})


const isSubmitting = ref(false);
const mensaje = ref('');

const validateForm = () => {
  let isValid = true;
  errores.titulo = '';
  errores.descripcion = '';
  errores.prioridad = '';

  if (!incidente.titulo) {
    errores.titulo = 'El título es requerido.';
    isValid = false;
  }
  if (!incidente.descripcion) {
    errores.descripcion = 'La descripción es requerida.';
    isValid = false;
  }
  if (!incidente.prioridad) {
    errores.prioridad = 'La prioridad es requerida.';
    isValid = false;
  }
  return isValid;
}

async function submitForm() {
  if (!validateForm()) return;

  isSubmitting.value = true;
  mensaje.value = '';

  try {
    const response = await apiClient.post('/incidentes/crear', incidente);

    // Si la creación es exitosa, emitimos el evento con los datos del nuevo incidente
    // El componente padre (Incidentes.vue) escuchará este evento.
    emit('incident-created', response.data);

  } catch (error) {
    mensaje.value = 'Error al crear el incidente. Inténtalo de nuevo.';
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.contenedor {
  max-width: 600px;
  margin: auto;
  background-color: #f8fafc;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.subtitulo {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}

.formulario {
  text-align: left;
}

.campo {
  margin-bottom: 1.2rem;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  margin-top: 0.3rem;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.radio-grupo {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.radio-grupo .opcion {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 500;
  color: #111827;
  /* letras siempre negras */
}

.acciones {
  margin-top: 2rem;
  text-align: center;
}

.boton {
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.boton.baja {
  background-color: #3b82f6;
}

.boton.baja:hover {
  background-color: #2563eb;
}

.boton.media {
  background-color: #f59e0b;
}

.boton.media:hover {
  background-color: #d97706;
}

.boton.alta {
  background-color: #ef4444;
}

.boton.alta:hover {
  background-color: #dc2626;
}

.boton.sin-prioridad {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

span {
  color: red;
  font-size: 0.85rem;
}

.volver {
  margin-bottom: 1rem;
  text-align: left;
}

.volver button {
  background-color: #e5e7eb;
  color: #111827;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
}

.volver button:hover {
  background-color: #d1d5db;
}
</style>