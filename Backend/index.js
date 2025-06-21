// Backend/index.js

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { conectarDB } = require("./db");

// Importar rutas
const incidentesRoutes = require("./routes/incidentes");
const problemasRoutes = require("./routes/problemas");
const activosRoutes = require('./routes/activos')
const conocimientoRoutes = require("./routes/conocimiento");
const usuariosRoutes = require("./routes/usuarios"); // Asegúrate de que esta línea esté presente
const solicitudRoutes = require("./routes/solicitudes");
const cambiosRoutes = require('./routes/cambios')
const authRoutes = require("./routes/auth"); // <-- Ahora sí existe este archivo

// const authRoutes = require("./routes/auth"); // La dejaremos comentada por ahora

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/api/incidentes", incidentesRoutes);
app.use("/api/problemas", problemasRoutes);
app.use('/api/activos', activosRoutes)
app.use("/api/conocimiento", conocimientoRoutes);
app.use("/api/usuarios", usuariosRoutes); // Y que esta línea también
app.use('/api/solicitudes', solicitudRoutes)
app.use('/api/cambios', cambiosRoutes)

app.use("/api/auth", authRoutes); // 

const PORT = process.env.PORT || 3001;

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend unificado corriendo en http://localhost:${PORT}`);
  });
});



