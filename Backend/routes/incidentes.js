const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const { ObjectId } = require('mongodb');

// --- FUNCIÓN HELPER PARA EL AUTOINCREMENTO ---
async function getNextSequenceValue(sequenceName) {
  const db = getDB();
  const sequenceDocument = await db.collection("counters").findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { returnDocument: "after", upsert: true } // upsert: true crea el doc si no existe
  );
  return sequenceDocument.sequence_value;
}

router.post("/crear", async (req, res) => {
  const db = getDB();
  const data = req.body;

  // Validaciones básicas
  if (!data.titulo || !data.descripcion || !data.prioridad) {
    return res.status(400).json({ error: "Título, descripción y prioridad son requeridos." });
  }

  try {
    // Generar el nuevo número de incidente
    const numeroIncidente = await getNextSequenceValue("numeroIncidente");

    const nuevoIncidente = {
      ...data,
      numeroIncidente: numeroIncidente, // Añadimos el número de incidente
      estado: "Abierto", // Estado inicial por defecto
      fechaCreacion: new Date(),
      historial: [], // Para futuras respuestas o cambios de estado
    };

    const result = await db.collection("incidentes").insertOne(nuevoIncidente);
    res.status(201).json({ mensaje: "Incidente creado con éxito", id: result.insertedId, numeroIncidente });
  } catch (err) {
    console.error("Error al crear incidente:", err);
    res.status(500).json({ error: "No se pudo crear el incidente" });
  }
});

// --- AÑADIMOS LAS NUEVAS RUTAS QUE NECESITAREMOS ---

// GET /incidentes - Listar todos los incidentes
router.get("/", async (req, res) => {
  const db = getDB();
  try {
    const incidentes = await db.collection("incidentes").find().sort({ fechaCreacion: -1 }).toArray();
    res.status(200).json(incidentes);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los incidentes" });
  }
});

// PUT /incidentes/:id - Actualizar un incidente (estado, prioridad, etc.)
router.put("/:id", async (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const updates = req.body; // Ej: { estado: "En Progreso" }

    try {
        const result = await db.collection("incidentes").updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Incidente no encontrado" });
        }
        res.status(200).json({ mensaje: "Incidente actualizado correctamente" });

    } catch(err) {
        res.status(500).json({ error: "Error al actualizar el incidente" });
    }
});

module.exports = router;

