// src/services/apiCambios.js

const API_URL = 'http://localhost:3001/cambios'; // Esta URL también cambiará luego

// Obtener todos los cambios
export async function getCambios() {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
}

// Crear nuevo cambio
export async function crearCambio(cambio) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cambio)
  });
  return response.json();
}