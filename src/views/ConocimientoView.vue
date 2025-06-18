<template>
  <div class="flex">
    <Sidebar />
    <main class="flex-1 p-6 bg-gray-100 min-h-screen">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Base de Conocimiento</h1>
        <button @click="abrirModal()" class="bg-green-600 text-white px-4 py-2 rounded">+ Agregar</button>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div v-for="item in conocimientos" :key="item._id" class="p-4 bg-white shadow rounded relative">
          <h2 class="text-lg font-bold">{{ item.titulo }}</h2>
          <p class="text-sm text-gray-600">{{ item.area }} • {{ formatearFecha(item.creado_en) }}</p>
          <p class="mt-1 text-sm">{{ item.descripcion }}</p>
          <div v-if="item.enlaceVideo" class="mt-2">
            <a :href="item.enlaceVideo" class="text-blue-600 underline" target="_blank">Video</a>
          </div>
          <div v-if="item.documentoPDF">
            <a :href="item.documentoPDF" class="text-blue-600 underline" target="_blank">PDF</a>
          </div>
          <div class="absolute top-2 right-2 space-x-2 text-sm flex">
            <button @click="abrirModal(item)" class="text-blue-500 hover:text-blue-700">
              <Pencil class="w-5 h-5" />
            </button>
            <button @click="eliminar(item._id)" class="text-red-500 hover:text-red-700">
              <Trash2 class="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      <div class="mt-6 flex justify-center space-x-2">
        <button @click="paginaAnterior" :disabled="pagina === 1" class="btn">Anterior</button>
        <button @click="paginaSiguiente" :disabled="!hayMas" class="btn">Siguiente</button>
      </div>

      <ModalConocimiento v-if="mostrarModal" :editar="editando" :data="conocimientoActual" @cerrar="cerrarModal"
        @guardar="guardarArticulo" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Pencil, Trash2 } from 'lucide-vue-next'
import ModalConocimiento from '../components/ModalConocimiento.vue'
import Sidebar from '../components/Sidebar.vue'

const conocimientos = ref([])
const mostrarModal = ref(false)
const editando = ref(false)
const conocimientoActual = ref(null)
const pagina = ref(1)
const limite = 4
const hayMas = ref(false)

const cargar = async () => {
  try {
    const skip = (pagina.value - 1) * limite
    const res = await axios.get(`http://localhost:5001/api/conocimiento?skip=${skip}&limit=${limite}`)
    conocimientos.value = res.data.resultados
    hayMas.value = res.data.total > skip + res.data.resultados.length
  } catch (e) {
    console.error('Error cargando artículos:', e.message)
  }
}

const abrirModal = (item = null) => {
  conocimientoActual.value = item
  editando.value = !!item
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  conocimientoActual.value = null
}

const guardarArticulo = async (datos) => {
  console.log(editando.value, conocimientoActual.value?._id, datos);

  try {
    if (editando.value && conocimientoActual.value?._id) {
      await axios.put(`http://localhost:5001/api/conocimiento/${conocimientoActual.value._id}`, datos)
    } else {
      await axios.post('http://localhost:5001/api/conocimiento', datos)
    }
    cerrarModal()
    cargar()
  } catch (e) {
    console.error('Error guardando:', e.message)
  }
}

const eliminar = async (id) => {
  if (confirm('¿Eliminar este artículo?')) {
    await axios.delete(`http://localhost:5001/api/conocimiento/${id}`)
    cargar()
  }
}

const paginaSiguiente = () => {
  pagina.value++
  cargar()
}

const paginaAnterior = () => {
  if (pagina.value > 1) {
    pagina.value--
    cargar()
  }
}

const formatearFecha = (f) => new Date(f).toLocaleDateString()

onMounted(cargar)


</script>

<style scoped>
.btn {
  background-color: #2563EB;
  /* tailwind's bg-blue-600 */
  color: white;
  padding-left: 1rem;
  /* px-4 = 16px */
  padding-right: 1rem;
  padding-top: 0.5rem;
  /* py-2 = 8px */
  padding-bottom: 0.5rem;
  border-radius: 0.25rem;
  /* 4px */
}

.btn:disabled {
  opacity: 0.5;
}
</style>
