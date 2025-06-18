// Backend/db.js
const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log('✅ Conectado a MongoDB Atlas con Mongoose');
  } catch (error) {
    console.error('❌ Error al conectar con Mongoose:', error.message);
    process.exit(1); // Detener la app si no se puede conectar
  }
};

module.exports = { conectarDB };