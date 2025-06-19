const express = require('express')
const router = express.Router()
const Activo = require('../models/Activo')

// Obtener todos los activos
router.get('/', async (req, res) => {
  try {
    const activos = await Activo.find().sort({ fechaRegistro: -1 })
    res.json(activos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener activos' })
  }
})

// Crear nuevo activo
router.post('/', async (req, res) => {
  try {
    const nuevo = new Activo(req.body)
    await nuevo.save()
    res.json(nuevo)
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el activo' })
  }
})

// Actualizar activo
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Activo.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(actualizado)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el activo' })
  }
})

// Eliminar activo
router.delete('/:id', async (req, res) => {
  try {
    await Activo.findByIdAndDelete(req.params.id)
    res.json({ eliminado: true })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el activo' })
  }
})

module.exports = router
