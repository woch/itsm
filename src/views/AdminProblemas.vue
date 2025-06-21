<template>
    <div class="flex">
        <Sidebar />
        <main class="flex-1 p-6 bg-gray-100 min-h-screen">
            <h2 class="text-2xl font-bold mb-4">Lista de Problemas</h2>

            <div class="grid gap-4 md:grid-cols-2">
                <div v-for="problema in problemas" :key="problema._id"
                    class="p-4 bg-white shadow rounded hover:bg-gray-50 cursor-pointer" @click="abrirModal(problema)">
                    <h3 class="text-lg font-semibold">{{ problema.titulo }}</h3>
                    <p class="text-sm text-gray-600">{{ problema.descripcion }}</p>
                    <p class="text-sm mt-1">Estado: <strong>{{ problema.estado }}</strong></p>
                    <p class="text-xs text-gray-500">Incidentes relacionados: {{ problema.incidentesRelacionados.length
                        }}</p>
                </div>
            </div>

            <!-- Modal -->
            <div v-if="modalVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                    <button class="absolute top-2 right-3 text-2xl font-bold text-gray-700"
                        @click="cerrarModal">&times;</button>
                    <h3 class="text-xl font-semibold mb-4">Editar Estado</h3>
                    <p><strong>Título:</strong> {{ problemaSeleccionado.titulo }}</p>
                    <p class="mb-2"><strong>Descripción:</strong> {{ problemaSeleccionado.descripcion }}</p>

                    <label for="estado" class="block font-medium mb-1 mt-4">Estado</label>
                    <select v-model="nuevoEstado" id="estado" class="w-full p-2 border border-gray-300 rounded">
                        <option value="Abierto">Abierto</option>
                        <option value="Investigando">Investigando</option>
                        <option value="Resuelto">Resuelto</option>
                        <option value="Cerrado">Cerrado</option>
                    </select>

                    <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                        @click="guardarEstado">
                        Guardar
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '../services/api'
import Sidebar from '../components/Sidebar.vue'

const problemas = ref([])
const modalVisible = ref(false)
const problemaSeleccionado = ref({})
const nuevoEstado = ref('')

const obtenerProblemas = async () => {
    try {
        const response = await apiClient.get('/problemas')
        problemas.value = response.data
    } catch (err) {
        console.error('Error al cargar problemas:', err)
    }
}

const abrirModal = (problema) => {
    problemaSeleccionado.value = problema
    nuevoEstado.value = problema.estado
    modalVisible.value = true
}

const cerrarModal = () => {
    modalVisible.value = false
}

const guardarEstado = async () => {
    try {
        const id = problemaSeleccionado.value._id
        const response = await apiClient.put(`/problemas/${id}`, { estado: nuevoEstado.value })

        // Actualizar en la lista local
        const index = problemas.value.findIndex(p => p._id === id)
        if (index !== -1) {
            problemas.value[index].estado = response.data.estado
        }

        cerrarModal()
    } catch (err) {
        console.error('Error al guardar el estado:', err)
    }
}

onMounted(() => {
    obtenerProblemas()
})
</script>
