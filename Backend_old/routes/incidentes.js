const express = require("express");
const router = express.Router();
const { getDB } = require("../db");

router.post("/crear", async (req, res) => {
  const db = getDB();
  const data = req.body;
  try {
    const result = await db.collection("incidentes").insertOne(data);
    res.status(201).json({ mensaje: "Incidente creado", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "No se pudo crear el incidente" });
  }
});

module.exports = router;

