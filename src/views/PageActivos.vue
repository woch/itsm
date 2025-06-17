<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 flex items-center justify-center py-12 px-4">
    <div class="bg-white rounded-2xl shadow-xl p-10 w-full max-w-5xl">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Registrar Activo</h2>
      <p class="text-center text-sm text-gray-500 mb-8">Completa la información del activo para agregarlo al inventario</p>
      
      <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Juan Ana"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Computadora">Computadora</option>
            <option value="Licencia">Licencia</option>
            <option value="Monitor">Monitor</option>
            <option value="Teclado">Teclado</option>
            <option value="Mouse">Mouse</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Dell"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
          <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Inspiron 5000"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
          <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. SN123456"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Laptop personal"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Departamento Asignado</label>
          <select class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Marketing">Marketing</option>
            <option value="Ventas">Ventas</option>
            <option value="IT">IT</option>
            <option value="Recursos Humanos">Recursos Humanos</option>
            <option value="Finanzas">Finanzas</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Valor</label>
          <input type="number" step="0.01" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. 1500"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sistema Operativo</label>
          <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Windows 10"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">MAC / IMEI</label>
          <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. 00:1A:2B:3C:4D:5E"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Inventario</label>
          <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Almacén A"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
          <textarea rows="2" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Funciona correctamente"></textarea>
        </div>

        <div class="md:col-span-2 flex justify-end gap-4 mt-4">
          <button type="button" class="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition">Cancelar</button>
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">Guardar Activo</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Solo visual (frontend) por ahora
</script>