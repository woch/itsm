<template>
  <div class="contenedor">
    <h2>Gestión de Solicitudes</h2>
    <p class="subtitulo">Ingresa una solicitud de soporte o recursos</p>

    <div class="volver">
      <button @click="volverMenu">⬅ Volver al menú principal</button>
    </div>

    <div class="formulario">
      <form @submit.prevent="enviarFormulario">
        <div class="campo">
          <label for="tipo">📌 Tipo de Solicitud</label>
          <select id="tipo" v-model="form.tipo">
            <option value="">Selecciona una opción</option>
            <option value="teclado">Nuevo Teclado</option>
            <option value="acceso">Acceso a sistema</option>
            <option value="otro">Otro</option>
          </select>
          <span v-if="v$.tipo.$error">Selecciona un tipo de solicitud.</span>
        </div>

        <div class="campo">
          <label>📄 Descripción</label>
          <textarea
            v-model="form.descripcion"
            placeholder="Ej: Requiero teclado ergonómico por molestias..."
          ></textarea>
          <span v-if="v$.descripcion.$error">Debe tener mínimo 10 caracteres.</span>
        </div>

        <div class="acciones">
          <button type="submit" :class="['boton', colorBoton]">
            Enviar Solicitud
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
  tipo: '',
  descripcion: '',
  estado: 'pendiente',
  creado_en: new Date().toISOString()
})

const rules = {
  tipo: { required },
  descripcion: { required, minLength: minLength(10) }
}

const v$ = useVuelidate(rules, form)

const colorBoton = computed(() => {
  switch (form.value.tipo) {
    case 'teclado':
      return 'verde'
    case 'acceso':
      return 'azul'
    case 'otro':
      return 'naranja'
    default:
      return 'sin-tipo'
  }
})

const enviarFormulario = async () => {
  const valido = await v$.value.$validate()
  if (!valido) {
    alert('Por favor completa todos los campos correctamente.')
    return
  }

  console.log('Solicitud enviada:', JSON.parse(JSON.stringify(form.value)))
}

const volverMenu = () => {
  router.push('/')
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

textarea,
select {
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

.boton.verde {
  background-color: #22c55e;
}
.boton.verde:hover {
  background-color: #16a34a;
}

.boton.azul {
  background-color: #3b82f6;
}
.boton.azul:hover {
  background-color: #2563eb;
}

.boton.naranja {
  background-color: #f97316;
}
.boton.naranja:hover {
  background-color: #ea580c;
}

.boton.sin-tipo {
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