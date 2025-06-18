// Backend/routes/conocimiento.js (Versión CommonJS corregida)

const express = require('express');
const router = express.Router();
const Conocimiento = require('../models/Conocimiento');

// Crear
router.post('/', async (req, res) => {
    try {
        const nuevo = new Conocimiento(req.body);
        await nuevo.save();
        res.status(201).json(nuevo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Leer todos con paginación
router.get('/', async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const [resultados, total] = await Promise.all([
            Conocimiento.find().sort({ creado_en: -1 }).skip(skip).limit(limit),
            Conocimiento.countDocuments()
        ]);
        res.json({ resultados, total });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Leer uno
router.get('/:id', async (req, res) => {
    try {
        const dato = await Conocimiento.findById(req.params.id);
        if (!dato) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json(dato);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar
router.put('/:id', async (req, res) => {
    try {
        const actualizado = await Conocimiento.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizado) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json(actualizado);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await Conocimiento.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json({ mensaje: 'Eliminado' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// ---- LÍNEA CLAVE FALTANTE ----
// Asegúrate de que esta línea esté al final del archivo
module.exports = router;