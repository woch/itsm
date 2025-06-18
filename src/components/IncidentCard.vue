<!-- src/components/IncidentCard.vue -->
<template>
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800">Crear Nuevo Incidente</h2>
      <p class="text-gray-500 mt-1">Reporta y da seguimiento a problemas de IT.</p>
    </div>

    <form @submit.prevent="enviarIncidente" class="space-y-6">
      <!-- Campo Título -->
      <div>
        <label for="titulo" class="block text-sm font-semibold text-gray-700 mb-1">
          📝 Título del Incidente
        </label>
        <input 
          type="text" 
          id="titulo" 
          v-model="incidente.titulo"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Ej: La impresora no funciona"
          required 
          minlength="5">
        <p v-if="errores.titulo" class="text-xs text-red-600 mt-1">{{ errores.titulo }}</p>
      </div>

      <!-- Campo Descripción -->
      <div>
        <label for="descripcion" class="block text-sm font-semibold text-gray-700 mb-1">
          📄 Descripción Detallada
        </label>
        <textarea 
          id="descripcion" 
          v-model="incidente.descripcion" 
          rows="4"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Describe el problema con el mayor detalle posible..."
          required 
          minlength="10"></textarea>
        <p v-if="errores.descripcion" class="text-xs text-red-600 mt-1">{{ errores.descripcion }}</p>
      </div>

      <!-- Campo Prioridad -->
      <div>
        <label for="prioridad" class="block text-sm font-semibold text-gray-700 mb-1">
          ⚠️ Prioridad
        </label>
        <select 
          id="prioridad" 
          v-model="incidente.prioridad"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required>
          <option disabled value="">Selecciona una prioridad</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        <p v-if="errores.prioridad" class="text-xs text-red-600 mt-1">{{ errores.prioridad }}</p>
      </div>

      <!-- Botón de Envío -->
      <div class="pt-4">
        <button 
          type="submit"
          class="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-transform transform hover:scale-105 disabled:bg-gray-400"
          :disabled="isSubmitting">
          {{ isSubmitting ? 'Enviando...' : 'Enviar Incidente' }}
        </button>
      </div>
    </form>
    
    <!-- Mensaje de Éxito/Error Global -->
    <p v-if="mensaje" class="mt-4 text-center text-sm" :class="esError ? 'text-red-600' : 'text-green-600'">
      {{ mensaje }}
    </p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import apiClient from '../services/api';

const incidente = ref({
  titulo: '',
  descripcion: '',
  prioridad: '',
});

// Usamos un objeto reactivo para los errores, es más limpio
const errores = reactive({
  titulo: null,
  descripcion: null,
  prioridad: null,
});

const isSubmitting = ref(false);
const mensaje = ref('');
const esError = ref(false);

const emit = defineEmits(['incidenteCreado']);

const validarFormulario = () => {
  let esValido = true;
  errores.titulo = !incidente.value.titulo ? 'El título es requerido.' : null;
  errores.descripcion = !incidente.value.descripcion ? 'La descripción es requerida.' : null;
  errores.prioridad = !incidente.value.prioridad ? 'La prioridad es requerida.' : null;
  
  if (errores.titulo || errores.descripcion || errores.prioridad) {
    esValido = false;
  }
  return esValido;
};

const enviarIncidente = async () => {
  if (!validarFormulario()) {
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
    
    // Notificar al componente padre que se creó el incidente
    emit('incidenteCreado');

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