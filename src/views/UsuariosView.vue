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
                        <input v-model="form.contraseña" placeholder="Contraseña" class="p-2 border rounded col-span-2"
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Plus, Pencil, Trash2, Search } from 'lucide-vue-next'
import Sidebar from '../components/Sidebar.vue'

const usuarios = ref([])
const busqueda = ref('')
const mostrarModal = ref(false)
const usuarioEditando = ref(null)
const form = ref({
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
    rol: '',
    departamento: '',
})

// Cargar usuarios
const obtenerUsuarios = async () => {
    const res = await axios.get('http://localhost:5001/api/usuarios')
    usuarios.value = res.data
}

onMounted(obtenerUsuarios)

// Filtro de búsqueda
const filtrados = computed(() =>
    usuarios.value.filter(u =>
        (u.nombre + ' ' + u.apellido + u.correo)
            .toLowerCase()
            .includes(busqueda.value.toLowerCase())
    )
)

// Modal
const abrirModal = (usuario = null) => {
    usuarioEditando.value = usuario
    form.value = usuario
        ? { ...usuario, contraseña: '' }
        : { nombre: '', apellido: '', correo: '', contraseña: '', rol: '', departamento: '' }
    mostrarModal.value = true
}

const cerrarModal = () => {
    usuarioEditando.value = null
    mostrarModal.value = false
}

// Guardar usuario
const guardarUsuario = async () => {
    if (usuarioEditando.value) {
        await axios.put(`http://localhost:5001/api/usuarios/${usuarioEditando.value._id}`, form.value)
    } else {
        await axios.post('http://localhost:5001/api/usuarios', form.value)
    }
    await obtenerUsuarios()
    cerrarModal()
}

// Eliminar
const eliminarUsuario = async (id) => {
    if (confirm('¿Eliminar este usuario?')) {
        await axios.delete(`http://localhost:5001/api/usuarios/${id}`)
        await obtenerUsuarios()
    }
}
</script>
