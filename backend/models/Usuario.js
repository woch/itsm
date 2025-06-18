// Backend/models/Usuario.js (Versión CommonJS)
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  // He cambiado 'correo' por 'usuario' para que sea consistente con tu login
  // y he quitado el campo 'correo' para evitar redundancia. Si necesitas ambos, me dices.
  usuario: { type: String, required: true, unique: true }, 
  contrasena: { type: String, required: true }, // Estandarizado a 'contrasena' sin 'ñ'
  rol: { 
    type: String,
    enum: ['admin', 'it', 'usuario'], // Roles en minúscula para consistencia
    default: 'usuario'
  },
  departamento: { type: String },
  superior: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  creado_en: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
