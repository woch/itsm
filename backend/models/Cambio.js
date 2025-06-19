const mongoose = require('mongoose')

const cambioSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipoCambio: {
    type: String,
    enum: ['Normal', 'Urgente', 'Estándar'],
    required: true
  },
  fechaPropuesta: { type: Date, required: true },
  responsable: { type: String, required: true },
  impacto: { type: String },
  estado: {
    type: String,
    enum: ['Propuesto', 'Aprobado', 'Rechazado', 'Implementado'],
    default: 'Propuesto'
  },
  creadoEn: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Cambio', cambioSchema)
