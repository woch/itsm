// Backend/models/Problema.js
const mongoose = require('mongoose');

const ProblemaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  estado: { type: String, default: 'Abierto' },
  fechaCreacion: { type: Date, default: Date.now },
  incidentesRelacionados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Incidente' }]
});

module.exports = mongoose.model('Problema', ProblemaSchema);