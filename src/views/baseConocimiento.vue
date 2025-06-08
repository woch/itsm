<template>
  <div class="contenedor">
    <h2>Base de Conocimiento</h2>
    <p class="subtitulo">Consulta artículos, tutoriales y guías del sistema</p>

    <!-- Botón de regreso -->
    <div class="volver">
      <button @click="volverMenu">⬅ Volver al menú principal</button>
    </div>

    <!-- Artículos simulados -->
    <div class="articulos">
      <div v-for="(articulo, index) in articulos" :key="index" class="tarjeta">
        <h3>{{ articulo.titulo }}</h3>
        <p>{{ articulo.descripcion }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const volverMenu = () => {
  router.push('/') // Ajusta si tu ruta principal es diferente
}

const articulos = [
  {
    titulo: 'Cómo reportar un incidente',
    descripcion: 'Sigue estos pasos para registrar un problema técnico en la plataforma ITSM.'
  },
  {
    titulo: 'Solicitar nuevo equipo',
    descripcion: 'Guía paso a paso para ingresar una solicitud de teclado, monitor, etc.'
  },
  {
    titulo: 'Recuperar acceso a sistemas',
    descripcion: '¿Perdiste tu acceso? Aquí te mostramos cómo recuperar tu cuenta.'
  }
]
</script>

<style scoped>
.contenedor {
  max-width: 700px;
  margin: auto;
  background-color: #f8fafc;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.subtitulo {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}

.volver {
  margin-bottom: 1rem;
  text-align: left;
}

.volver button {
  background-color: #e5e7eb;
  color: #111827;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
}

.volver button:hover {
  background-color: #d1d5db;
}

.articulos {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.tarjeta {
  background-color: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: left;
}

.tarjeta h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #1e293b;
}

.tarjeta p {
  font-size: 0.95rem;
  color: #475569;
  margin-top: 0.5rem;
}
</style>