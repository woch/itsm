const mongoose = require('mongoose')

const activoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true }, // Ej: Computadora, Impresora, POS, etc.
  descripcion: { type: String },
  numeroSerie: { type: String, unique: true },
  estado: {
    type: String,
    enum: ['En uso', 'Disponible', 'En reparación', 'Retirado'],
    default: 'Disponible'
  },
  ubicacion: { type: String },
  responsable: { type: String },
  fechaRegistro: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Activo', activoSchema)
