// backend/routes/conocimiento.js
const express = require('express');
const router = express.Router();
const Conocimiento = require('../models/Conocimiento');

// Crear
router.post('/', async (req, res) => {
    console.log(req.body);
    try {
        const nuevo = new Conocimiento(req.body);
        await nuevo.save();
        res.status(201).json(nuevo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Leer todos
// backend/routes/conocimiento.js
router.get('/', async (req, res) => {
    const skip = parseInt(req.query.skip) || 0
    const limit = parseInt(req.query.limit) || 10

    const [resultados, total] = await Promise.all([
        Conocimiento.find().sort({ creado_en: -1 }).skip(skip).limit(limit),
        Conocimiento.countDocuments()
    ])

    res.json({ resultados, total })
})


// Leer uno
router.get('/:id', async (req, res) => {
    const dato = await Conocimiento.findById(req.params.id);
    res.json(dato);
});

// Actualizar
router.put('/:id', async (req, res) => {
    const actualizado = await Conocimiento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
});

// Eliminar
router.delete('/:id', async (req, res) => {
    await Conocimiento.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Eliminado' });
});

module.exports = router;
