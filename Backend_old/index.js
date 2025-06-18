import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Incidentes from '../views/Incidentes.vue'
import Solicitudes from '../views/Solicitudes.vue'
import BaseConocimiento from '../views/baseConocimiento.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import PageCambios from '../views/PageCambios.vue'      // ✅ Vista de Cambios
import PageActivos from '../views/PageActivos.vue'      // ✅ Vista de Activos (nueva línea)

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/incidentes', component: Incidentes, meta: { requiresAuth: true } },
  { path: '/solicitudes', component: Solicitudes, meta: { requiresAuth: true } },
  { path: '/conocimiento', component: BaseConocimiento, meta: { requiresAuth: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/cambios', component: PageCambios, meta: { requiresAuth: true } },
  { path: '/activos', component: PageActivos, meta: { requiresAuth: true } },  // ✅ Nueva ruta
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true'
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router