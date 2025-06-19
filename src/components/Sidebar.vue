<template>

  <aside class="bg-white w-64 h-screen shadow-md p-4">  
    <nav class="space-y-2">  
      <RouterLink  
        v-for="item in menu"  
        :key="item.label"  
        :to="item.route"  
        class="flex items-center gap-3 p-2 rounded hover:bg-blue-100 transition-colors text-gray-700"  
        active-class="bg-blue-200 font-semibold"  
      >  
        <component :is="item.icon" class="w-5 h-5" />  
        <span>{{ item.label }}</span>  
      </RouterLink>  
    </nav>  
  </aside>  
</template>  <script setup>  
import {  
  Bug,  
  ClipboardList,  
  AlertTriangle,  
  GitPullRequest,  
  BookOpen,  
  Server,  
  TrendingUp,  
  BarChart,  
  Users  
} from 'lucide-vue-next'  
  /*

    { label: 'Gestión de Niveles de Servicio', icon: TrendingUp, route: '/niveles-servicio' },  
  { label: 'Reportes', icon: BarChart, route: '/reportes' },  

  */
const menu = [  
  { label: 'Incidentes', icon: Bug, route: '/admin/incidentes' },  
  { label: 'Solicitudes de Servicio', icon: ClipboardList, route: '/admin/solicitudes' },  
  { label: 'Problemas', icon: AlertTriangle, route: '/problemas' },  
  { label: 'Gestión de Cambios', icon: GitPullRequest, route: '/admin/cambios' },  
  { label: 'Base de Conocimiento', icon: BookOpen, route: '/admin/conocimiento' },  
  { label: 'Gestión de Activos IT', icon: Server, route: '/activos' },  
  { label: 'Usuarios', icon: Users, route: '/admin/usuarios' }  
]  
</script>
