<!-- src/components/IncidentCard.vue -->
<template>
  <div class="p-8 bg-white shadow-lg rounded-lg max-w-2xl mx-auto text-gray-800">
    <h2 class="text-2xl font-bold mb-4">Gestión de Incidentes</h2>
    <p class="mb-6">Reporta y da seguimiento a problemas de IT.</p>

    <form @submit.prevent="enviarIncidente">
      <div class="mb-4">
        <label for="titulo" class="block text-sm font-medium text-gray-700">📝 Título</label>
        <input type="text" id="titulo" v-model="incidente.titulo"
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required minlength="5">
        <p v-if="!incidente.titulo" class="text-xs text-red-500 mt-1">El título es requerido.</p>
      </div>

      <div class="mb-4">
        <label for="descripcion" class="block text-sm font-medium text-gray-700">📄 Descripción</label>
        <textarea id="descripcion" v-model="incidente.descripcion" rows="4"
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required minlength="10"></textarea>
        <p v-if="!incidente.descripcion" class="text-xs text-red-500 mt-1">La descripción es requerida.</p>
      </div>

      <div class="mb-6">
        <label for="prioridad" class="block text-sm font-medium text-gray-700">⚠ Prioridad</label>
        <select id="prioridad" v-model="incidente.prioridad"
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required>
          <option disabled value="">Selecciona una prioridad</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        <p v-if="!incidente.prioridad" class="text-xs text-red-500 mt-1">La prioridad es requerida.</p>
      </div>

      <div class="flex justify-end">
        <button type="submit"
          class="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :disabled="isSubmitting">
          {{ isSubmitting ? 'Enviando...' : 'Enviar Incidente' }}
        </button>
      </div>
    </form>
    
    <p v-if="mensaje" class="mt-4 text-center" :class="esError ? 'text-red-500' : 'text-green-500'">
      {{ mensaje }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from '../services/api'; // Asegúrate que la ruta es correcta

const incidente = ref({
  titulo: '',
  descripcion: '',
  prioridad: '',
});

const isSubmitting = ref(false);
const mensaje = ref('');
const esError = ref(false);

const enviarIncidente = async () => {
  if (!incidente.value.titulo || !incidente.value.descripcion || !incidente.value.prioridad) {
    mensaje.value = 'Por favor, completa todos los campos.';
    esError.value = true;
    return;
  }

  isSubmitting.value = true;
  mensaje.value = '';
  esError.value = false;

  try {
    const response = await apiClient.post('/incidentes/crear', incidente.value);
    mensaje.value = `${response.data.mensaje}. Número de Incidente: ${response.data.numeroIncidente}`;
    esError.value = false;
    // Limpiar formulario
    incidente.value = { titulo: '', descripcion: '', prioridad: '' };
  } catch (error) {
    mensaje.value = error.response?.data?.error || 'Ocurrió un error al enviar el incidente.';
    esError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};
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
  color: #111827; /* letras siempre negras */
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