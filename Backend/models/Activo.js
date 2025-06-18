// Backend/models/Activo.js
const mongoose = require('mongoose');

const ActivoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  marca: String,
  modelo: String,
  numeroSerie: { type: String, unique: true },
  descripcion: String,
  departamentoAsignado: String,
  valor: Number
});

module.exports = mongoose.model('Activo', ActivoSchema);