<!-- frontend/src/views/Login.vue (REEMPLAZA EL CONTENIDO) -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Iniciar sesión</h2>
      
      <!-- Usamos @submit.prevent para llamar a nuestra función handleLogin -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="usuario" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Usuario</label>
          <input 
            v-model="usuario"
            type="text" 
            id="usuario" 
            class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="ej: jdoe"
          >
        </div>
        <div>
          <label for="contrasena" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
          <input 
            v-model="contrasena"
            type="password" 
            id="contrasena" 
            class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="••••••••"
          >
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </div>
        
        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api'; // Importamos nuestro cliente Axios

const router = useRouter();
const usuario = ref('');
const contrasena = ref('');
const error = ref('');
const isLoading = ref(false);

async function handleLogin() {
  // Validaciones básicas
  if (!usuario.value || !contrasena.value) {
    error.value = 'Por favor, introduce usuario y contraseña.';
    return;
  }
  
  isLoading.value = true;
  error.value = ''; // Limpiamos errores previos

  try {
    // Llamada a la API del backend usando Axios
    const response = await apiClient.post('http://localhost:5001/api/auth/login', {
      usuario: usuario.value,
      contrasena: contrasena.value
    });
    
    // Si el login es exitoso:
    // 1. Guardamos el token que nos dio el backend en el localStorage del navegador.
    localStorage.setItem('token', response.data.token);
    
    // 2. Guardamos la información del usuario también para usarla en la UI.
    localStorage.setItem('user', JSON.stringify(response.data.usuario));

    // 3. Este es el 'flag' que tu router actual usa para saber si estás autenticado.
    localStorage.setItem('isAuthenticated', 'true');
    
    // 4. Redirigimos al usuario a la página principal.
    router.push('/');

  } catch (err) {
    // Si el backend devuelve un error (400, 401, 500), lo capturamos aquí.
    error.value = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
    console.error('Error en el login:', err.response?.data?.error || err.message);
  } finally {
    // Esto se ejecuta siempre, haya habido éxito o error.
    isLoading.value = false;
  }
}
</script>