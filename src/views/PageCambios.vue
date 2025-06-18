<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 flex items-center justify-center py-12 px-4">
    <div class="bg-white rounded-2xl shadow-xl p-10 w-full max-w-4xl">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Registrar Cambio</h2>
      <p class="text-center text-sm text-gray-500 mb-8">Completa la información del cambio que deseas registrar</p>
      
      <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha del Cambio</label>
          <input type="date" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Número de Versión</label>
          <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Motivo del Cambio</label>
          <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
          <textarea rows="3" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
        
        <div class="md:col-span-2 flex justify-end gap-4">
          <button type="button" class="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition">Cancelar</button>
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">Guardar Cambio</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Solo estructura visual por ahora
</script>