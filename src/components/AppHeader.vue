<template>
  <header class="w-full bg-blue-600 text-white shadow-md">
    <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
      <!-- Título de la Plataforma -->
      <router-link to="/" class="text-xl font-bold hover:text-blue-200 transition-colors">
        Plataforma ITSM - Retail
      </router-link>

      <!-- Botones de Navegación y Sesión -->
      <div class="flex items-center space-x-4">
        
        <!-- Botón de Administración: se muestra SÓLO si el usuario es admin -->
        <router-link
          v-if="isAdmin"
          to="/admin/incidentes"
          class="px-4 py-2 text-sm font-medium bg-white text-blue-600 rounded-md hover:bg-gray-200 transition-colors"
        >
          Administración
        </router-link>

        <!-- Botón de Cerrar Sesión: se muestra si el usuario está autenticado -->
        <button
          v-if="isAuthenticated"
          @click="handleLogout"
          class="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuth } from '../composables/useAuth';

// Usamos nuestro composable para obtener el estado y las funciones
const { isAuthenticated, isAdmin, logout } = useAuth();

const handleLogout = () => {
  // Simplemente llamamos a la función logout de nuestro helper
  logout();
};
</script>

