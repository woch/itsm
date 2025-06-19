<template>
    <div class="flex">
        <Sidebar />
        <main class="flex-1 p-6 bg-gray-100 min-h-screen">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">Usuarios</h2>
                <button @click="abrirModal()"
                    class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <Plus class="w-5 h-5" /> Nuevo Usuario
                </button>
            </div>

            <div class="mb-4 flex items-center gap-2">
                <Search class="w-5 h-5 text-gray-500" />
                <input v-model="busqueda" placeholder="Buscar usuario..." class="p-2 border rounded w-full max-w-md" />
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white shadow rounded">
                    <thead>
                        <tr class="bg-gray-100 text-left text-sm font-medium text-gray-700">
                            <th class="p-3">Nombre</th>
                            <th class="p-3">Correo</th>
                            <th class="p-3">Rol</th>
                            <th class="p-3">Departamento</th>
                            <th class="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="usuario in filtrados" :key="usuario._id" class="border-t">
                            <td class="p-3">{{ usuario.nombre }} {{ usuario.apellido }}</td>
                            <td class="p-3">{{ usuario.correo }}</td>
                            <td class="p-3">{{ usuario.rol }}</td>
                            <td class="p-3">{{ usuario.departamento }}</td>
                            <td class="p-3 flex gap-2">
                                <button @click="abrirModal(usuario)" class="text-blue-600 hover:text-blue-800">
                                    <Pencil class="w-5 h-5" />
                                </button>
                                <button @click="eliminarUsuario(usuario._id)" class="text-red-600 hover:text-red-800">
                                    <Trash2 class="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal -->
            <div v-if="mostrarModal" class="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                <div class="bg-white p-6 rounded shadow-md w-full max-w-xl relative">
                    <h3 class="text-lg font-semibold mb-4">{{ usuarioEditando ? 'Editar' : 'Nuevo' }} Usuario</h3>
                    <form @submit.prevent="guardarUsuario" class="grid grid-cols-2 gap-4">
                        <input v-model="form.nombre" placeholder="Nombre" class="p-2 border rounded col-span-1"
                            required />
                        <input v-model="form.apellido" placeholder="Apellido" class="p-2 border rounded col-span-1"
                            required />
                        <input v-model="form.correo" placeholder="Correo" class="p-2 border rounded col-span-2" required
                            type="email" />
                        <input v-model="form.contrasena" placeholder="Contraseña" class="p-2 border rounded col-span-2"
                            :required="!usuarioEditando" type="password" />
                        <select v-model="form.rol" class="p-2 border rounded col-span-1" required>
                            <option disabled value="">Rol</option>
                            <option>Administrador</option>
                            <option>Encargado</option>
                            <option>Usuario</option>
                        </select>
                        <input v-model="form.departamento" placeholder="Departamento"
                            class="p-2 border rounded col-span-1" />
                        <div class="col-span-2 flex justify-end gap-2 mt-2">
                            <button type="button" @click="cerrarModal"
                                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </main>
    </div>
</template>

// En tu componente de Vue
<script setup>
import { ref, computed, onMounted } from 'vue'
// IMPORTANTE: Asegúrate de estar usando tu 'apiClient' configurado, no axios directamente
// para que herede la baseURL y los interceptores.
import apiClient from '../services/api' // Asumiendo que está en src/services/api.js
import { Plus, Pencil, Trash2, Search } from 'lucide-vue-next'
import Sidebar from '../components/Sidebar.vue'

const usuarios = ref([])
const busqueda = ref('')
const mostrarModal = ref(false)
const usuarioEditando = ref(null)

// El 'form' representa lo que el usuario ve en el modal.
const form = ref({
    nombre: '',
    apellido: '',
    correo: '',       // El usuario ve y edita 'correo'
    contrasena: '', // El usuario ve y edita 'contrasena' (con ñ)
    rol: '',
    departamento: '',
})

// Cargar usuarios
const obtenerUsuarios = async () => {
    try {
        // Usamos apiClient para no repetir la URL completa
        const res = await apiClient.get('/usuarios')
        // El backend devuelve 'usuario' pero la tabla muestra 'correo'. Mapeamos.
        usuarios.value = res.data.map(u => ({ ...u, correo: u.usuario }));
    } catch (error) {
        console.error("Error al obtener usuarios:", error)
    }
}

onMounted(obtenerUsuarios)

// Filtro de búsqueda (sin cambios)
const filtrados = computed(() =>
    usuarios.value.filter(u =>
        (u.nombre + ' ' + u.apellido + u.correo)
            .toLowerCase()
            .includes(busqueda.value.toLowerCase())
    )
)

// Modal (adaptamos para el mapeo)
const abrirModal = (usuario = null) => {
    usuarioEditando.value = usuario
    form.value = usuario
        ? { ...usuario, contraseña: '' } // El usuario que llega ya tiene 'correo'
        : { nombre: '', apellido: '', correo: '', contrasena: '', rol: '', departamento: '' }
    mostrarModal.value = true
}

const cerrarModal = () => {
    usuarioEditando.value = null
    mostrarModal.value = false
}

// --- SECCIÓN CORREGIDA ---
// Guardar usuario
const guardarUsuario = async () => {
    // 1. Mapear los roles del frontend a los del backend
    const rolesMap = {
        'Administrador': 'admin',
        'Encargado': 'it', // Asumiendo que 'Encargado' equivale a 'it'
        'Usuario': 'usuario'
    };

    // 2. Construir el objeto de datos que se enviará al backend
    const payload = {
        nombre: form.value.nombre,
        apellido: form.value.apellido,
        usuario: form.value.correo,      // Se envía 'correo' del form como 'usuario'
        contrasena: form.value.contrasena, // Se envía 'contraseña' del form como 'contrasena'
        rol: rolesMap[form.value.rol] || 'usuario', // Mapeamos el rol, con 'usuario' como default
        departamento: form.value.departamento
    };

    // Si no se está editando, la contraseña es obligatoria en el payload
    if (usuarioEditando.value && !payload.contrasena) {
        delete payload.contrasena; // No enviar contraseña vacía al editar
    }

    try {
        if (usuarioEditando.value) {
            // Actualizar usuario
            await apiClient.put(`/usuarios/${usuarioEditando.value._id}`, payload)
        } else {
            // Crear nuevo usuario
            await apiClient.post('/usuarios', payload)
        }
        await obtenerUsuarios() // Recargar la lista de usuarios
        cerrarModal() // Cerrar el modal
    } catch (error) {
        // Mostrar el mensaje de error específico del backend
        alert(error.response?.data?.error || 'Ocurrió un error al guardar el usuario.')
        console.error("Error al guardar usuario:", error.response)
    }
}


// Eliminar (sin cambios, pero usando apiClient)
const eliminarUsuario = async (id) => {
    if (confirm('¿Eliminar este usuario?')) {
        await apiClient.delete(`/usuarios/${id}`)
        await obtenerUsuarios()
    }
}
</script>