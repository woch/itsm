<script setup>
</script>
<template>
  <div class="min-h-screen flex flex-col bg-gray-100 text-gray-800">
    <AppHeader />
    <main class="flex-grow p-6">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>
