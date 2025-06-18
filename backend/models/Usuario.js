import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { 
    type: String,
    enum: ['Administrador', 'Encargado', 'Usuario'],
    default: 'Usuario'
  },
  departamento: { type: String },
  superior: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  creado_en: { type: Date, default: Date.now }
})

export default mongoose.model('Usuario', usuarioSchema)
