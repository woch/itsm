<template>
  <footer class="bg-gray-200 text-center text-sm text-gray-600 p-4 mt-auto">
    © {{ year }} Plataforma ITSM - Retail. Todos los derechos reservados.
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
