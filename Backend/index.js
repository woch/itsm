require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { conectarMongo } = require("./db");
const incidentesRoutes = require("./routes/incidentes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/incidentes", incidentesRoutes);

const PORT = 3001;

conectarMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  });
});

