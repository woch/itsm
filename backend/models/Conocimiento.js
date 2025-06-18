import mongoose from 'mongoose'

const conocimientoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  enlaceVideo: { type: String },
  documentoPDF: { type: String },
  area: { 
    type: String, 
    required: true,
    enum: ['Caja Registradora', 'POS', 'Computadora', 'Acceso', 'Internet', 'Otros']
  },
  creado_en: { type: Date, default: Date.now }
})

export default mongoose.model('Conocimiento', conocimientoSchema)
