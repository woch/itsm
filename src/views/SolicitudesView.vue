<template>
  <div class="flex">
    <Sidebar />
    <main class="flex-1 p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Solicitudes de Servicio</h2>
      <button @click="abrirModal()" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        <Plus class="w-5 h-5" /> Nueva Solicitud
      </button>
    </div>

    <div class="mb-4 flex items-center gap-2">
      <Search class="w-5 h-5 text-gray-500" />
      <input v-model="busqueda" placeholder="Buscar solicitud..." class="p-2 border rounded w-full max-w-md" />
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white shadow rounded">
        <thead>
          <tr class="bg-gray-100 text-left text-sm font-medium text-gray-700">
            <th class="p-3">Título</th>
            <th class="p-3">Solicitante</th>
            <th class="p-3">Departamento</th>
            <th class="p-3">Prioridad</th>
            <th class="p-3">Estado</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="solicitud in filtradas" :key="solicitud._id" class="border-t">
            <td class="p-3">{{ solicitud.titulo }}</td>
            <td class="p-3">{{ solicitud.solicitante }}</td>
            <td class="p-3">{{ solicitud.departamento }}</td>
            <td class="p-3">{{ solicitud.prioridad }}</td>
            <td class="p-3">{{ solicitud.estado }}</td>
            <td class="p-3 flex gap-2">
              <button @click="abrirModal(solicitud)" class="text-blue-600 hover:text-blue-800">
                <Pencil class="w-5 h-5" />
              </button>
              <button @click="eliminarSolicitud(solicitud._id)" class="text-red-600 hover:text-red-800">
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
        <h3 class="text-lg font-semibold mb-4">{{ solicitudEditando ? 'Editar' : 'Nueva' }} Solicitud</h3>
        <form @submit.prevent="guardarSolicitud" class="grid grid-cols-2 gap-4">
          <input v-model="form.titulo" placeholder="Título" class="p-2 border rounded col-span-2" required />
          <input v-model="form.solicitante" placeholder="Solicitante" class="p-2 border rounded col-span-1" required />
          <input v-model="form.departamento" placeholder="Departamento" class="p-2 border rounded col-span-1" />
          <select v-model="form.prioridad" class="p-2 border rounded col-span-1">
            <option disabled value="">Prioridad</option>
            <option>Baja</option>
            <option>Media</option>
            <option>Alta</option>
          </select>
          <select v-model="form.estado" class="p-2 border rounded col-span-1">
            <option>Pendiente</option>
            <option>En proceso</option>
            <option>Completado</option>
          </select>
          <textarea v-model="form.descripcion" placeholder="Descripción" class="p-2 border rounded col-span-2" rows="4"></textarea>

          <div class="col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" @click="cerrarModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Guardar
            </button>
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

const solicitudes = ref([])
const busqueda = ref('')
const mostrarModal = ref(false)
const solicitudEditando = ref(null)

const form = ref({
  titulo: '',
  descripcion: '',
  solicitante: '',
  departamento: '',
  prioridad: 'Media',
  estado: 'Pendiente'
})

const obtenerSolicitudes = async () => {
  const res = await axios.get('http://localhost:5001/api/solicitudes')
  solicitudes.value = res.data
}

onMounted(obtenerSolicitudes)

const filtradas = computed(() =>
  solicitudes.value.filter(s =>
    (s.titulo + s.solicitante)
      .toLowerCase()
      .includes(busqueda.value.toLowerCase())
  )
)

const abrirModal = (solicitud = null) => {
  solicitudEditando.value = solicitud
  form.value = solicitud
    ? { ...solicitud }
    : { titulo: '', descripcion: '', solicitante: '', departamento: '', prioridad: 'Media', estado: 'Pendiente' }
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  solicitudEditando.value = null
}

const guardarSolicitud = async () => {
  if (solicitudEditando.value) {
    await axios.put(`http://localhost:5001/api/solicitudes/${solicitudEditando.value._id}`, form.value)
  } else {
    await axios.post('http://localhost:5001/api/solicitudes', form.value)
  }
  await obtenerSolicitudes()
  cerrarModal()
}

const eliminarSolicitud = async (id) => {
  if (confirm('¿Eliminar esta solicitud?')) {
    await axios.delete(`http://localhost:5001/api/solicitudes/${id}`)
    await obtenerSolicitudes()
  }
}
</script>
