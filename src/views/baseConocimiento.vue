<template>
  <div class="contenedor">
    <h2 class="text-2xl font-bold">Base de Conocimiento</h2>
    <p class="subtitulo">Consulta artículos, tutoriales y guías del sistema</p>

    <!-- Botón de regreso -->
    <div class="volver">
      <button @click="volverMenu">⬅ Volver al menú principal</button>
    </div>

    <!-- Lista de artículos -->
    <div class="articulos">
      <div
        v-for="(articulo, index) in articulos"
        :key="index"
        class="tarjeta cursor-pointer hover:shadow-md transition"
        @click="abrirModal(articulo)"
      >
        <h3>{{ articulo.titulo }}</h3>
        <p>{{ articulo.descripcion }}</p>
      </div>
    </div>

    <!-- Modal de detalle -->
    <div v-if="modalAbierto" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-md shadow-md w-full max-w-lg relative">
        <button class="absolute top-2 right-2 text-gray-500 hover:text-black" @click="cerrarModal">✖</button>
        <h3 class="text-xl font-bold mb-2">{{ seleccionado.titulo }}</h3>
        <p class="text-gray-700 mb-4">{{ seleccionado.descripcion }}</p>

        <div class="flex flex-wrap gap-3">
          <a
            v-if="seleccionado.enlaceVideo"
            :href="seleccionado.enlaceVideo"
            target="_blank"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ver video
          </a>
          <a
            v-if="seleccionado.documentoPDF"
            :href="seleccionado.documentoPDF"
            target="_blank"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Ver PDF
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const router = useRouter()

const volverMenu = () => {
  router.push('/')
}

const articulos = ref([])
const modalAbierto = ref(false)
const seleccionado = ref({})

// Obtener desde backend
const obtenerArticulos = async () => {
  try {
    const res = await axios.get('http://localhost:5001/api/conocimiento')
    articulos.value = res.data.resultados || res.data // según cómo devuelva tu backend
  } catch (err) {
    console.error('Error al obtener artículos:', err.message)
  }
}

const abrirModal = (articulo) => {
  seleccionado.value = articulo
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  seleccionado.value = {}
}

onMounted(obtenerArticulos)
</script>

<style scoped>
.contenedor {
  max-width: 800px;
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

.articulos {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.tarjeta {
  background-color: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: left;
}

.tarjeta h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #1e293b;
}

.tarjeta p {
  font-size: 0.95rem;
  color: #475569;
  margin-top: 0.5rem;
}
</style>
