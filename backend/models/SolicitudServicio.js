const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  solicitante: { type: String, required: true },
  departamento: { type: String },
  estado: {
    type: String,
    enum: ['Pendiente', 'En proceso', 'Completado'],
    default: 'Pendiente'
  },
  prioridad: {
    type: String,
    enum: ['Baja', 'Media', 'Alta'],
    default: 'Media'
  },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SolicitudServicio', solicitudSchema);
