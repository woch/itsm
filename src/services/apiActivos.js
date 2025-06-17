// src/services/apiActivos.js

const API_URL = 'http://localhost:3001/activos'; // Esta URL cambiará cuando Alberto suba el backend

// Obtener todos los activos
export async function getActivos() {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
}

// Crear nuevo activo
export async function crearActivo(activo) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activo)
  });
  return response.json();
}