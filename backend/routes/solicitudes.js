// routes/solicitudes.js
const express = require('express');
const Solicitud = require('../models/SolicitudServicio');

const router = express.Router();

// Listar solicitudes
router.get('/', async (req, res) => {
  const datos = await Solicitud.find().sort({ fechaCreacion: -1 });
  res.json(datos);
});

// Crear solicitud
router.post('/', async (req, res) => {
  const nueva = new Solicitud(req.body);
  await nueva.save();
  res.json(nueva);
});

// Actualizar solicitud
router.put('/:id', async (req, res) => {
  const actualizada = await Solicitud.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizada);
});

// Eliminar solicitud
router.delete('/:id', async (req, res) => {
  await Solicitud.findByIdAndDelete(req.params.id);
  res.json({ eliminado: true });
});

module.exports = router; // ✅ esto es clave
