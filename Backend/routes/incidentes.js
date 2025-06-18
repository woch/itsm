// Backend/routes/incidentes.js
const express = require("express");
const router = express.Router();
const Incidente = require('../models/Incidente');
const Problema = require('../models/Problema');

// Crear un nuevo incidente
router.post("/crear", async (req, res) => {
  try {
    const nuevoIncidente = new Incidente(req.body);
    await nuevoIncidente.save(); // El middleware 'pre' se encargará del autoincremento
    res.status(201).json({ mensaje: "Incidente creado con éxito", id: nuevoIncidente._id, numeroIncidente: nuevoIncidente.numeroIncidente });
  } catch (err) {
    res.status(500).json({ error: "No se pudo crear el incidente", detalle: err.message });
  }
});

// Listar todos los incidentes
router.get("/", async (req, res) => {
  const { q } = req.query;
  try {
    let query = { estado: { $ne: "Cerrado (Convertido a Problema)" } };
    if (q) {
      const isNum = /^\d+$/.test(q);
      if (isNum) {
        query.numeroIncidente = parseInt(q);
      } else {
        query.$or = [
          { titulo: { $regex: q, $options: 'i' } },
          { descripcion: { $regex: q, $options: 'i' } }
        ];
      }
    }
    const incidentes = await Incidente.find(query).sort({ fechaCreacion: -1 });
    res.status(200).json(incidentes);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los incidentes" });
  }
});

// Obtener un solo incidente
router.get("/:id", async (req, res) => {
  try {
    const incidente = await Incidente.findById(req.params.id);
    if (!incidente) return res.status(404).json({ error: "Incidente no encontrado." });
    res.status(200).json(incidente);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el incidente." });
  }
});

// Actualizar un incidente
router.put("/:id", async (req, res) => {
  try {
    const incidente = await Incidente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!incidente) return res.status(404).json({ error: "Incidente no encontrado" });
    res.status(200).json({ mensaje: "Incidente actualizado correctamente" });
  } catch(err) {
    res.status(500).json({ error: "Error al actualizar el incidente" });
  }
});

// Añadir una respuesta
router.post("/:id/respuesta", async (req, res) => {
  try {
    const incidente = await Incidente.findById(req.params.id);
    if (!incidente) return res.status(404).json({ error: "Incidente no encontrado." });
    
    const nuevaRespuesta = { autor: req.body.autor, texto: req.body.texto };
    incidente.historial.push(nuevaRespuesta);
    await incidente.save();
    
    res.status(201).json({ mensaje: "Respuesta añadida con éxito", respuesta: incidente.historial[incidente.historial.length - 1] });
  } catch (err) {
    res.status(500).json({ error: "No se pudo añadir la respuesta." });
  }
});

// Convertir a Problema
router.post("/:id/convertir", async (req, res) => {
    try {
        const incidente = await Incidente.findById(req.params.id);
        if (!incidente) return res.status(404).json({ error: "Incidente no encontrado." });
        if (incidente.estado.startsWith("Cerrado")) return res.status(400).json({ error: "Este incidente ya está cerrado." });

        const nuevoProblema = new Problema({
            titulo: `Problema derivado de Incidente #${incidente.numeroIncidente}: ${incidente.titulo}`,
            descripcion: incidente.descripcion,
            incidentesRelacionados: [incidente._id],
        });
        const problemaCreado = await nuevoProblema.save();

        incidente.estado = "Cerrado (Convertido a Problema)";
        incidente.historial.push({
            autor: "Sistema",
            texto: `Incidente convertido a Problema con ID: ${problemaCreado._id}.`
        });
        await incidente.save();
        
        res.status(200).json({ 
            mensaje: "Incidente convertido a problema con éxito.",
            idProblema: problemaCreado._id,
            nuevoEstadoIncidente: incidente.estado
        });
    } catch (err) {
        res.status(500).json({ error: "Error interno al convertir el incidente.", detalle: err.message });
    }
});

module.exports = router;