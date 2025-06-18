// backend/models/Conocimiento.js
const mongoose = require('mongoose');

const ConocimientoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  enlaceVideo: { type: String },
  documentoPDF: { type: String },
  area: { type: String },
  creado_en: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conocimiento', ConocimientoSchema);
