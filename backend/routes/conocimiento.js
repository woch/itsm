import express from 'express'
import Conocimiento from '../models/Conocimiento.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const skip = parseInt(req.query.skip) || 0
  const limit = parseInt(req.query.limit) || 10
  const [resultados, total] = await Promise.all([
    Conocimiento.find().sort({ creado_en: -1 }).skip(skip).limit(limit),
    Conocimiento.countDocuments()
  ])
  res.json({ resultados, total })
})

router.post('/', async (req, res) => {
  const nuevo = new Conocimiento(req.body)
  await nuevo.save()
  res.json(nuevo)
})

router.put('/:id', async (req, res) => {
  const actualizado = await Conocimiento.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(actualizado)
})

router.delete('/:id', async (req, res) => {
  await Conocimiento.findByIdAndDelete(req.params.id)
  res.json({ eliminado: true })
})

export default router