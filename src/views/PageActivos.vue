<template>
  <div class="flex">
    <Sidebar />
    <main class="flex-1 p-6 bg-gray-100 min-h-screen">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Gestión de Activos</h2>
        <button @click="abrirModal()"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Plus class="w-5 h-5" /> Nuevo Activo
        </button>
      </div>

      <div class="mb-4 flex items-center gap-2">
        <Search class="w-5 h-5 text-gray-500" />
        <input v-model="busqueda" placeholder="Buscar activo..." class="p-2 border rounded w-full max-w-md" />
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white shadow rounded">
          <thead>
            <tr class="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <th class="p-3">Nombre</th>
              <th class="p-3">Tipo</th>
              <th class="p-3">Serie</th>
              <th class="p-3">Estado</th>
              <th class="p-3">Ubicación</th>
              <th class="p-3">Responsable</th>
              <th class="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activo in filtrados" :key="activo._id" class="border-t">
              <td class="p-3">{{ activo.nombre }}</td>
              <td class="p-3">{{ activo.tipo }}</td>
              <td class="p-3">{{ activo.numeroSerie }}</td>
              <td class="p-3">{{ activo.estado }}</td>
              <td class="p-3">{{ activo.ubicacion }}</td>
              <td class="p-3">{{ activo.responsable }}</td>
              <td class="p-3 flex gap-2">
                <button @click="abrirModal(activo)" class="text-blue-600 hover:text-blue-800">
                  <Pencil class="w-5 h-5" />
                </button>
                <button @click="eliminarActivo(activo._id)" class="text-red-600 hover:text-red-800">
                  <Trash2 class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div v-if="mostrarModal" class="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded shadow-md w-full max-w-xl relative">
          <button @click="cerrarModal" class="absolute top-2 right-2 text-gray-500 hover:text-black">✖</button>
          <h3 class="text-lg font-semibold mb-4">{{ activoEditando ? 'Editar' : 'Nuevo' }} Activo</h3>
          <form @submit.prevent="guardarActivo" class="grid grid-cols-2 gap-4">
            <input v-model="form.nombre" placeholder="Nombre del activo" class="p-2 border rounded col-span-2"
              required />
            <input v-model="form.tipo" placeholder="Tipo" class="p-2 border rounded col-span-1" required />
            <input v-model="form.numeroSerie" placeholder="Número de serie" class="p-2 border rounded col-span-1" />
            <input v-model="form.ubicacion" placeholder="Ubicación" class="p-2 border rounded col-span-1" />
            <input v-model="form.responsable" placeholder="Responsable" class="p-2 border rounded col-span-1" />
            <select v-model="form.estado" class="p-2 border rounded col-span-2">
              <option>Disponible</option>
              <option>En uso</option>
              <option>En reparación</option>
              <option>Retirado</option>
            </select>

            <div class="col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" @click="cerrarModal"
                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Plus, Pencil, Trash2, Search } from 'lucide-vue-next'
import Sidebar from '../components/Sidebar.vue'

const activos = ref([])
const busqueda = ref('')
const mostrarModal = ref(false)
const activoEditando = ref(null)

const form = ref({
  nombre: '',
  tipo: '',
  numeroSerie: '',
  ubicacion: '',
  responsable: '',
  estado: 'Disponible'
})

const obtenerActivos = async () => {
  const res = await axios.get('http://localhost:5001/api/activos')
  activos.value = res.data
}

onMounted(obtenerActivos)

const filtrados = computed(() =>
  activos.value.filter(a =>
    (a.nombre + a.tipo + a.numeroSerie)
      .toLowerCase()
      .includes(busqueda.value.toLowerCase())
  )
)

const abrirModal = (activo = null) => {
  activoEditando.value = activo
  form.value = activo
    ? { ...activo }
    : { nombre: '', tipo: '', numeroSerie: '', ubicacion: '', responsable: '', estado: 'Disponible' }
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  activoEditando.value = null
}

const guardarActivo = async () => {
  if (activoEditando.value) {
    await axios.put(`http://localhost:5001/api/activos/${activoEditando.value._id}`, form.value)
  } else {
    await axios.post('http://localhost:5001/api/activos', form.value)
  }
  await obtenerActivos()
  cerrarModal()
}

const eliminarActivo = async (id) => {
  if (confirm('¿Eliminar este activo?')) {
    await axios.delete(`http://localhost:5001/api/activos/${id}`)
    await obtenerActivos()
  }
}
</script>
