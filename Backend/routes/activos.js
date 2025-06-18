// Backend/routes/activos.js
const express = require('express');
const router = express.Router();
const Activo = require('../models/Activo');

// Registrar un activo
router.post('/registrar', async (req, res) => {
    try {
        const nuevoActivo = new Activo(req.body);
        await nuevoActivo.save();
        res.status(201).json({ message: "Activo registrado correctamente", id: nuevoActivo._id });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar activo", error: error.message });
    }
});

// Listar todos los activos
router.get('/listar', async (req, res) => {
    try {
        const activos = await Activo.find();
        res.status(200).json(activos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los activos", error: error.message });
    }
});

module.exports = router;