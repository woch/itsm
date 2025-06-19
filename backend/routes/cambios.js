const express = require('express')
const router = express.Router()
const Cambio = require('../models/Cambio')

// Obtener todos los cambios
router.get('/', async (req, res) => {
  try {
    const cambios = await Cambio.find().sort({ creadoEn: -1 })
    res.json(cambios)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los cambios' })
  }
})

// Crear un cambio
router.post('/', async (req, res) => {
  try {
    const nuevo = new Cambio(req.body)
    await nuevo.save()
    res.json(nuevo)
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el cambio' })
  }
})

// Actualizar un cambio
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Cambio.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(actualizado)
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el cambio' })
  }
})

// Eliminar un cambio
router.delete('/:id', async (req, res) => {
  try {
    await Cambio.findByIdAndDelete(req.params.id)
    res.json({ eliminado: true })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el cambio' })
  }
})

module.exports = router
