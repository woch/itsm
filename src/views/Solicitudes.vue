<template>
  <div class="max-w-md mx-auto p-4 bg-white rounded shadow">
    <h2 class="text-xl font-bold mb-4">Nueva Solicitud de Servicio</h2>
    <form @submit.prevent="crearSolicitud" class="space-y-4">
      <input
        v-model="form.titulo"
        type="text"
        placeholder="Título"
        required
        class="w-full p-2 border rounded"
      />
      <textarea
        v-model="form.descripcion"
        placeholder="Descripción"
        rows="4"
        required
        class="w-full p-2 border rounded"
      ></textarea>
      <input
        v-model="form.solicitante"
        type="text"
        placeholder="Solicitante"
        required
        class="w-full p-2 border rounded"
      />
      <input
        v-model="form.departamento"
        type="text"
        placeholder="Departamento"
        class="w-full p-2 border rounded"
      />
      <select v-model="form.prioridad" class="w-full p-2 border rounded">
        <option disabled value="">Prioridad</option>
        <option>Baja</option>
        <option>Media</option>
        <option>Alta</option>
      </select>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Crear Solicitud
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import axios from 'axios'

const form = reactive({
  titulo: '',
  descripcion: '',
  solicitante: '',
  departamento: '',
  prioridad: 'Media',
})

const crearSolicitud = async () => {
  try {
    await axios.post('http://localhost:5001/api/solicitudes', form)
    alert('Solicitud creada correctamente')
    // Aquí puedes limpiar el formulario o redirigir
    form.titulo = ''
    form.descripcion = ''
    form.solicitante = ''
    form.departamento = ''
    form.prioridad = 'Media'
  } catch (error) {
    alert('Error al crear la solicitud: ' + error.message)
  }
}
</script>
