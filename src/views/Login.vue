<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4 text-center">Iniciar sesión</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block mb-1">Usuario</label>
          <input v-model="username" type="text" class="w-full p-2 border rounded" />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Contraseña</label>
          <input v-model="password" type="password" class="w-full p-2 border rounded" />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

const login = () => {
  // ⚠️ Simulación de autenticación
  if (username.value && password.value) {
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/')
  } else {
    alert('Por favor ingresa tus credenciales.')
  }
}
</script>
