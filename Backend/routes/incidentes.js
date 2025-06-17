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
  const { q } = req.query; // Capturamos el parámetro de búsqueda 'q'
   try {
    let query = {}; 

    if (q) {
      // Verificamos si 'q' es un número
      const numeroBuscado = parseInt(q, 10);
      if (!isNaN(numeroBuscado)) {
        // Si es un número, buscamos por 'numeroIncidente'
        query = { numeroIncidente: numeroBuscado };
      } else {
        // Si NO es un número, buscamos en título y descripción como antes
        query = {
          $or: [
            { titulo: { $regex: q, $options: 'i' } },
            { descripcion: { $regex: q, $options: 'i' } }
          ]
        };
      }
    }

    const incidentes = await db.collection("incidentes").find(query).sort({ fechaCreacion: -1 }).toArray();
    res.status(200).json(incidentes);
  } catch (err) {
    console.error("Error al obtener incidentes:", err);
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

router.get("/:id", async (req, res) => {
    const db = getDB();
    const { id } = req.params;

    // Validación para asegurarse que el ID es válido para MongoDB
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de incidente no válido." });
    }

    try {
        const incidente = await db.collection("incidentes").findOne({ _id: new ObjectId(id) });
        
        if (!incidente) {
            return res.status(404).json({ error: "Incidente no encontrado." });
        }

        res.status(200).json(incidente);
    } catch (err) {
        console.error("Error al obtener el incidente:", err);
        res.status(500).json({ error: "Error al obtener el incidente." });
    }
});

router.post("/:id/respuesta", async (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const { autor, texto } = req.body; // Esperamos el autor y el texto de la respuesta

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de incidente no válido." });
    }

    if (!autor || !texto) {
        return res.status(400).json({ error: "El autor y el texto de la respuesta son requeridos." });
    }

    const nuevaRespuesta = {
        _id: new ObjectId(), // Generamos un ID único para la respuesta
        autor,
        texto,
        fecha: new Date()
    };

    try {
        const result = await db.collection("incidentes").updateOne(
            { _id: new ObjectId(id) },
            { $push: { historial: nuevaRespuesta } } // Añadimos la respuesta al array 'historial'
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Incidente no encontrado." });
        }

        res.status(201).json({ mensaje: "Respuesta añadida con éxito", respuesta: nuevaRespuesta });

    } catch (err) {
        console.error("Error al añadir respuesta:", err);
        res.status(500).json({ error: "No se pudo añadir la respuesta." });
    }
});

router.post("/:id/convertir", async (req, res) => {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de incidente no válido." });
    }

    try {
        // 1. Encontrar el incidente original
        const incidenteOriginal = await db.collection("incidentes").findOne({ _id: new ObjectId(id) });

        if (!incidenteOriginal) {
            return res.status(404).json({ error: "Incidente no encontrado." });
        }
        
        // Evitar convertir un incidente que ya fue cerrado o convertido
        if (incidenteOriginal.estado.startsWith("Cerrado")) {
            return res.status(400).json({ error: "Este incidente ya está cerrado y no puede ser convertido." });
        }

        // 2. Crear el nuevo documento de problema
        const nuevoProblema = {
            titulo: `Problema derivado de Incidente #${incidenteOriginal.numeroIncidente}: ${incidenteOriginal.titulo}`,
            descripcion: incidenteOriginal.descripcion,
            estado: "Abierto", // Estado inicial del problema
            fechaCreacion: new Date(),
            incidentesRelacionados: [incidenteOriginal._id], // Guardamos la referencia al incidente original
            historial: [],
        };
        
        // Insertamos el nuevo problema en la colección 'problemas'
        const problemaCreado = await db.collection("problemas").insertOne(nuevoProblema);


        // 3. Actualizar el incidente original
        const nuevoEstado = "Cerrado (Convertido a Problema)";
        const notaHistorial = {
            _id: new ObjectId(),
            autor: "Sistema",
            texto: `Incidente convertido a Problema con ID: ${problemaCreado.insertedId}.`,
            fecha: new Date()
        };

        await db.collection("incidentes").updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { estado: nuevoEstado },
                $push: { historial: notaHistorial }
            }
        );

        res.status(200).json({ 
            mensaje: "Incidente convertido a problema con éxito.",
            idProblema: problemaCreado.insertedId,
            nuevoEstadoIncidente: nuevoEstado
        });

    } catch (err) {
        console.error("Error al convertir incidente:", err);
        res.status(500).json({ error: "Error interno al convertir el incidente." });
    }
});

module.exports = router;

