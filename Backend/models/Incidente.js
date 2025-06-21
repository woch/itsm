// Backend/models/Incidente.js
const mongoose = require('mongoose');
const Counter = require('./Counter');

const IncidenteSchema = new mongoose.Schema({
  numeroIncidente: { type: Number, unique: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  prioridad: { type: String, required: true, enum: ['Baja', 'Media', 'Alta'] },
  estado: { type: String, default: 'Abierto' },
  fechaCreacion: { type: Date, default: Date.now },

  // Nuevos campos de usuario
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  usuarioNombre: { type: String, required: true },

  historial: [{
    autor: String,
    idautor: String,
    texto: String,
    fecha: { type: Date, default: Date.now }
  }]
});




// Middleware para autoincrementar 'numeroIncidente' antes de guardar
IncidenteSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'numeroIncidente' },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    this.numeroIncidente = counter.sequence_value;
  }
  next();
});

module.exports = mongoose.model('Incidente', IncidenteSchema);
