// frontend/src/composables/useAuth.js (NUEVO ARCHIVO)

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Usamos ref para que los datos del usuario sean reactivos.
// Si cambian (ej: al hacer login/logout), cualquier componente que los use se actualizará.
const user = ref(JSON.parse(localStorage.getItem('user')) || null);

export function useAuth() {
  const router = useRouter();

  // Esta función actualiza el estado cuando el usuario hace login.
  // La llamaremos desde Login.vue.
  const setUser = (userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      user.value = userData;
    } else {
      localStorage.removeItem('user');
      user.value = null;
    }
  };
  
  // Función para manejar el logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    user.value = null; // Limpiamos el usuario reactivo
    // Redirigimos al login
    router.push('/login');
  };

  // ---- Propiedades Computadas ----
  // Estas son "propiedades inteligentes" que se recalculan automáticamente.

  // Una propiedad que nos dice si el usuario está logueado.
  // Es 'true' si el objeto 'user' tiene datos.
  const isAuthenticated = computed(() => !!user.value && !!localStorage.getItem('token'));

  // Una propiedad que nos dice si el usuario es administrador.
  // Es 'true' solo si el usuario está logueado y su rol es 'admin'.
  const isAdmin = computed(() => {
    return isAuthenticated.value && user.value.rol === 'admin';
  });
  
  // Exponemos las funciones y propiedades que los componentes necesitarán.
  return {
    user,
    setUser,
    logout,
    isAuthenticated,
    isAdmin,
  };
}