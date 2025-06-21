<template>
  <header class="bg-blue-600 text-white p-4 shadow">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-semibold">Plataforma ITSM - Retail</h1>

      <div class="flex items-center space-x-6" v-if="isLoggedIn">
        <!-- Botón Home -->
        <RouterLink to="/" class="flex items-center space-x-1 hover:underline text-white" title="Inicio">
          <HomeIcon class="w-5 h-5" />
          <span>Home</span>
        </RouterLink>

        <!-- Botón Administración solo si es admin -->
        <RouterLink v-if="user?.rol === 'admin'" to="/dashboard"
          class="flex items-center space-x-1 hover:underline text-white">
          <Settings class="w-5 h-5" />
          <span>Administración</span>
        </RouterLink>

        <!-- Perfil con Dropdown -->
        <div class="relative group">
          <button class="flex items-center space-x-2 hover:underline">
            <UserRound class="w-6 h-6 text-white" />
            <span>{{ user?.nombre || 'Usuario' }}</span>
          </button>

          <!-- Dropdown -->
          <div
            class="absolute right-0 w-48 bg-white text-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-10">
            <ul class="py-2">
              <li>
                <RouterLink to="/perfil" class="block px-4 py-2 hover:bg-gray-100">Perfil</RouterLink>
              </li>
              <li>
                <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, UserRound, Home as HomeIcon } from 'lucide-vue-next'

const router = useRouter()
const isLoggedIn = ref(false)
const user = ref(null)

watchEffect(() => {
  isLoggedIn.value = localStorage.getItem('isAuthenticated') === 'true'

  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
    } catch (e) {
      console.error('Error parsing user:', e)
    }
  }
})

function logout() {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  router.push('/login')
}
</script>

<style scoped>
/* Asegura que el dropdown aparezca al hacer hover */
.group:hover .group-hover\:opacity-100 {
  opacity: 1 !important;
}
</style>
