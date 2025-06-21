<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <main class="p-6">
      <h2 class="text-xl font-semibold mb-4">Bienvenido {{ nombreCompleto }}</h2>
      <p class="mb-4">
        ¿En qué podemos ayudarte hoy? Aquí tienes algunas opciones para comenzar:
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RouterLink to="/incidentes"
          class="p-6 bg-white rounded shadow hover:shadow-md transition block hover:border-blue-500 border border-transparent flex flex-col items-center text-center space-y-3">
          <MailWarning class="w-16 h-16 text-blue-600" />
          <h3 class="font-bold text-lg mb-2">Incidentes</h3>
          <p>Registra y da seguimiento a incidentes técnicos.</p>
        </RouterLink>

        <RouterLink to="/solicitudes"
          class="p-6 bg-white rounded shadow hover:shadow-md transition block hover:border-blue-500 border border-transparent flex flex-col items-center text-center space-y-3">
          <HandHelping class="w-16 h-16 text-blue-600" />
          <h3 class="font-bold text-lg mb-2">Solicitudes</h3>
          <p>Ingresa peticiones de servicios y equipo para tu departamento.</p>
        </RouterLink>

        <RouterLink to="/conocimiento"
          class="p-6 bg-white rounded shadow hover:shadow-md transition block hover:border-blue-500 border border-transparent flex flex-col items-center text-center space-y-3">
          <FileVideo class="w-16 h-16 text-blue-600" />
          <h3 class="font-bold text-lg">Base de conocimiento</h3>
          <p>¿Quieres saber más del sistema? Tenemos manuales y tutoriales para ti</p>
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MailWarning, HandHelping, FileVideo } from 'lucide-vue-next'

// Router para posibles redirecciones
const router = useRouter()

// Logout por si lo necesitas en algún botón
const logout = () => {
  localStorage.removeItem('isAuthenticated')
  router.push('/login')
}

// Estado reactivo del usuario
const user = ref({})

// Leer usuario desde localStorage
try {
  const data = localStorage.getItem('user')
  if (data) {
    user.value = JSON.parse(data)
    console.log('Usuario autenticado:', user.value)
  } else {
    console.warn('No se encontró el usuario en localStorage')
  }
} catch (error) {
  console.error('Error al leer el usuario de localStorage:', error)
}

// Computar el nombre completo
const nombreCompleto = computed(() =>
  `${user.value.nombre || ''} ${user.value.apellido || ''}`.trim()
)
</script>

<style scoped>
/* Tailwind se encarga del diseño, puedes añadir estilos personalizados aquí si lo deseas */
</style>
