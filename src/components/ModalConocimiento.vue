<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-md w-full max-w-lg shadow-xl relative">
      <h2 class="text-xl font-bold mb-4">{{ editar ? 'Editar' : 'Agregar' }} artículo</h2>
      <form @submit.prevent="guardar">
        <input v-model="form.titulo" placeholder="Título" class="input mb-2" required />
        <textarea v-model="form.descripcion" placeholder="Descripción" class="input mb-2" required></textarea>
        <input v-model="form.enlaceVideo" placeholder="Enlace de video (opcional)" class="input mb-2" />
        <input v-model="form.documentoPDF" placeholder="Enlace a PDF (opcional)" class="input mb-2" />
        <label class="block mb-2 font-medium">Área informativa</label>
        <select v-model="form.area" class="w-full p-2 border rounded">
          <option disabled value="">Seleccione un área</option>
          <option>Caja Registradora</option>
          <option>POS</option>
          <option>Computadora</option>
          <option>Acceso</option>
          <option>Internet</option>
          <option>Otros</option>
        </select>


        <div class="flex justify-between top-space-x-2 mt-4">
          <button type="button" @click="$emit('cerrar')" class="text-gray-600">Cancelar</button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
            {{ editar ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  editar: Boolean,
  data: Object,
})

const emit = defineEmits(['guardar', 'cerrar'])

const form = ref({
  titulo: '',
  descripcion: '',
  enlaceVideo: '',
  documentoPDF: '',
  area: ''
});

watch(
  () => props.data,
  () => {
    if (props.editar && props.data) {
      form.value = { ...props.data }
    } else {
      form.value = { titulo: '', descripcion: '', enlaceVideo: '', documentoPDF: '', area: '' }
    }
  },
  { immediate: true }
)

const guardar = () => {
  if (!form.value.titulo || !form.value.descripcion || !form.value.area) return
  emit('guardar', { ...form.value })
}
</script>

<style scoped>
.input {
  width: 100%;
  border-width: 1px;
  border-style: solid;
  border-color: #D1D5DB;
  /* equivale a tailwind's gray-300 */
  padding: 0.5rem;
  /* 8px */
  border-radius: 0.25rem;
  /* 4px */
}
</style>
