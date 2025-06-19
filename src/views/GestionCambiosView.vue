<template>
    <div class="flex">
        <Sidebar />
        <main class="flex-1 p-6 bg-gray-100 min-h-screen">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">Gestión de Cambios</h2>
                <button @click="abrirModal()"
                    class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <Plus class="w-5 h-5" /> Nuevo Cambio
                </button>
            </div>

            <div class="mb-4 flex items-center gap-2">
                <Search class="w-5 h-5 text-gray-500" />
                <input v-model="busqueda" placeholder="Buscar..." class="p-2 border rounded w-full max-w-md" />
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white shadow rounded">
                    <thead>
                        <tr class="bg-gray-100 text-left text-sm font-medium text-gray-700">
                            <th class="p-3">Título</th>
                            <th class="p-3">Tipo</th>
                            <th class="p-3">Responsable</th>
                            <th class="p-3">Estado</th>
                            <th class="p-3">Fecha Propuesta</th>
                            <th class="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cambio in filtrados" :key="cambio._id" class="border-t">
                            <td class="p-3">{{ cambio.titulo }}</td>
                            <td class="p-3">{{ cambio.tipoCambio }}</td>
                            <td class="p-3">{{ cambio.responsable }}</td>
                            <td class="p-3">{{ cambio.estado }}</td>
                            <td class="p-3">{{ formatFecha(cambio.fechaPropuesta) }}</td>
                            <td class="p-3 flex gap-2">
                                <button @click="abrirModal(cambio)" class="text-blue-600 hover:text-blue-800">
                                    <Pencil class="w-5 h-5" />
                                </button>
                                <button @click="eliminarCambio(cambio._id)" class="text-red-600 hover:text-red-800">
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
                    <button @click="cerrarModal"
                        class="absolute top-2 right-2 text-gray-500 hover:text-black">✖</button>
                    <h3 class="text-lg font-semibold mb-4">{{ cambioEditando ? 'Editar' : 'Nuevo' }} Cambio</h3>
                    <form @submit.prevent="guardarCambio" class="grid grid-cols-2 gap-4">
                        <input v-model="form.titulo" placeholder="Título" class="p-2 border rounded col-span-2"
                            required />
                        <textarea v-model="form.descripcion" placeholder="Descripción"
                            class="p-2 border rounded col-span-2" rows="3" required />
                        <select v-model="form.tipoCambio" class="p-2 border rounded col-span-1" required>
                            <option disabled value="">Tipo de Cambio</option>
                            <option>Normal</option>
                            <option>Urgente</option>
                            <option>Estándar</option>
                        </select>
                        <input v-model="form.responsable" placeholder="Responsable"
                            class="p-2 border rounded col-span-1" required />
                        <input type="date" v-model="form.fechaPropuesta" class="p-2 border rounded col-span-1"
                            required />
                        <select v-model="form.estado" class="p-2 border rounded col-span-1">
                            <option>Propuesto</option>
                            <option>Aprobado</option>
                            <option>Rechazado</option>
                            <option>Implementado</option>
                        </select>

                        <div class="col-span-2 flex justify-end gap-2 mt-2">
                            <button type="button" @click="cerrarModal"
                                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
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

const cambios = ref([])
const busqueda = ref('')
const mostrarModal = ref(false)
const cambioEditando = ref(null)

const form = ref({
    titulo: '',
    descripcion: '',
    tipoCambio: '',
    responsable: '',
    fechaPropuesta: '',
    estado: 'Propuesto'
})

const obtenerCambios = async () => {
    const res = await axios.get('http://localhost:5001/api/cambios')
    cambios.value = res.data
}

onMounted(obtenerCambios)

const filtrados = computed(() =>
    cambios.value.filter(c =>
        (c.titulo + c.responsable)
            .toLowerCase()
            .includes(busqueda.value.toLowerCase())
    )
)

const abrirModal = (cambio = null) => {
    cambioEditando.value = cambio
    form.value = cambio
        ? { ...cambio, fechaPropuesta: cambio.fechaPropuesta?.split('T')[0] }
        : { titulo: '', descripcion: '', tipoCambio: '', responsable: '', fechaPropuesta: '', estado: 'Propuesto' }
    mostrarModal.value = true
}

const cerrarModal = () => {
    mostrarModal.value = false
    cambioEditando.value = null
}

const guardarCambio = async () => {
    if (cambioEditando.value) {
        await axios.put(`http://localhost:5001/api/cambios/${cambioEditando.value._id}`, form.value)
    } else {
        await axios.post('http://localhost:5001/api/cambios', form.value)
    }
    await obtenerCambios()
    cerrarModal()
}

const eliminarCambio = async (id) => {
    if (confirm('¿Eliminar este cambio?')) {
        await axios.delete(`http://localhost:5001/api/cambios/${id}`)
        await obtenerCambios()
    }
}

const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-HN')
}
</script>
