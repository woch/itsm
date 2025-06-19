// Backend/index.js

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { conectarDB } = require("./db");

// Importar rutas
const incidentesRoutes = require("./routes/incidentes");
const activosRoutes = require("./routes/activos");
const conocimientoRoutes = require("./routes/conocimiento");
const usuariosRoutes = require("./routes/usuarios");
const authRoutes = require("./routes/auth"); // <-- Ahora sí existe este archivo

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/api/incidentes", incidentesRoutes);
app.use("/api/activos", activosRoutes);
app.use("/api/conocimiento", conocimientoRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes); // <-- Y la usamos aquí

const PORT = process.env.PORT || 3001;

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend unificado corriendo en http://localhost:${PORT}`);
  });
});