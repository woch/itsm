<template>
  <div class="contenedor">
    <h2>Gestión de Incidentes</h2>
    <p class="subtitulo">Reporta y da seguimiento a problemas de IT</p>

    <!-- Botón para volver al menú -->
    <div class="volver">
      <button @click="volverMenu">⬅ Volver al menú principal</button>
    </div>

    <div class="formulario">
      <form @submit.prevent="enviarFormulario">
        <div class="campo">
          <label>
            📝 Título
            <input v-model="form.titulo" type="text" placeholder="Ej: Error al acceder al portal de pagos" />
          </label>
          <span v-if="v$.titulo.$error">Debe tener mínimo 5 caracteres.</span>
        </div>

        <div class="campo">
          <label>
            📄 Descripción
            <textarea v-model="form.descripcion" placeholder="Ej: La página se queda cargando al intentar acceder..."></textarea>
          </label>
          <span v-if="v$.descripcion.$error">Debe tener mínimo 10 caracteres.</span>
        </div>

        <div class="campo">
          <label>⚠ Prioridad</label>
          <div class="radio-grupo">
            <label class="opcion">
              <input type="radio" value="baja" v-model="form.prioridad" /> Baja
            </label>
            <label class="opcion">
              <input type="radio" value="media" v-model="form.prioridad" /> Media
            </label>
            <label class="opcion">
              <input type="radio" value="alta" v-model="form.prioridad" /> Alta
            </label>
          </div>
          <span v-if="v$.prioridad.$error">Selecciona una prioridad.</span>
        </div>

        <div class="acciones">
          <button type="submit" :class="['boton', colorBoton]">
            Enviar Incidente
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

const router = useRouter()

const form = ref({
  titulo: '',
  descripcion: '',
  prioridad: '',
  estado: 'abierto',
  creado_en: new Date().toISOString(),
  cerrado_en: null
})

const rules = {
  titulo: { required, minLength: minLength(5) },
  descripcion: { required, minLength: minLength(10) },
  prioridad: { required }
}

const v$ = useVuelidate(rules, form)

const colorBoton = computed(() => {
  switch (form.value.prioridad) {
    case 'baja':
      return 'baja'
    case 'media':
      return 'media'
    case 'alta':
      return 'alta'
    default:
      return 'sin-prioridad'
  }
})

const enviarFormulario = async () => {
  const valido = await v$.value.$validate()
  if (!valido) {
    alert('Por favor completa todos los campos correctamente.')
    return
  }

  console.log('Incidente enviado:', JSON.parse(JSON.stringify(form.value)))
}

const volverMenu = () => {
  router.push('/') // Cambia esta ruta si tu menú principal es otra
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