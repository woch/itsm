<template>
  <header class="bg-blue-600 text-white p-4 shadow">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold">Plataforma ITSM - Retail</h1>
      <nav class="space-x-4">
        <RouterLink v-if="isLoggedIn"  to="/dashboard" class="hover:underline text-white-300">Administración</RouterLink>
        
        <button
          v-if="isLoggedIn"
          @click="logout"
          class="hover:underline text-red-300"
        >
          Cerrar sesión
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)

// Observar el estado de localStorage
watchEffect(() => {
  isLoggedIn.value = localStorage.getItem('isAuthenticated') === 'true'
})

function logout() {
  localStorage.removeItem('isAuthenticated')
  isLoggedIn.value = false
  router.push('/login')
}
</script>
