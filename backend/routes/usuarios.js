import express from 'express'
import Usuario from '../models/Usuario.js'
import bcrypt from 'bcrypt'

const router = express.Router()

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  const usuarios = await Usuario.find().populate('superior', 'nombre apellido correo')
  res.json(usuarios)
})

// Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.contraseña, 10)
    const nuevoUsuario = new Usuario({ ...req.body, contraseña: hashedPassword })
    await nuevoUsuario.save()
    res.json(nuevoUsuario)
  } catch (err) {
    res.status(500).json({ error: 'No se pudo crear el usuario' })
  }
})

// Actualizar usuario
router.put('/:id', async (req, res) => {
  const datos = { ...req.body }
  if (req.body.contraseña) {
    datos.contraseña = await bcrypt.hash(req.body.contraseña, 10)
  }
  const actualizado = await Usuario.findByIdAndUpdate(req.params.id, datos, { new: true })
  res.json(actualizado)
})

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id)
  res.json({ eliminado: true })
})

export default router
