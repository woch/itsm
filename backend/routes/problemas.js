// routes/problemas.js
const express = require('express')
const router = express.Router()
const Problema = require('../models/Problema')

// Obtener todos los problemas
router.get('/', async (req, res) => {
  try {
    const problemas = await Problema.find().populate('incidentesRelacionados')
    res.json(problemas)
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron obtener los problemas' })
  }
})

// Actualizar estado del problema
router.put('/:id', async (req, res) => {
  try {
    const problema = await Problema.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    )
    res.json(problema)
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el problema' })
  }
})

module.exports = router
