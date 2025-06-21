// Backend/routes/incidentes.js
const express = require("express");
const router = express.Router();
const Incidente = require('../models/Incidente');
const Problema = require('../models/Problema');

// Crear un nuevo incidente
router.post("/crear", async (req, res) => {
  console.log("Datos recibidos para crear un incidente:", req.body);
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

// Listar todos los incidentes de un usuario
router.get("/usuario/:usuarioId", async (req, res) => {
  try {
    const incidentes = await Incidente.find({ usuarioId: req.params.usuarioId }).sort({ fechaCreacion: -1 });
    res.status(200).json(incidentes);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los incidentes del usuario", detalle: err.message });
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


// ✅ Poner rutas específicas antes que las dinámicas
router.get("/resumen-estados", async (req, res) => {
  try {
    const resumen = await Incidente.aggregate([
      {
        $group: {
          _id: "$estado",
          total: { $sum: 1 }
        }
      }
    ]);

    const estados = ['Abierto', 'En proceso', 'Resuelto', 'Cerrado'];
    const data = estados.reduce((acc, estado) => {
      const encontrado = resumen.find(e => e._id === estado);
      acc[estado] = encontrado ? encontrado.total : 0;
      return acc;
    }, {});

    res.status(200).json(data);
  } catch (err) {
    console.error('Error al obtener resumen:', err);
    res.status(500).json({ error: "No se pudo obtener el resumen de estados." });
  }
});

// 🔽 Esta ruta debe ir al final de las rutas GET
router.get("/:id", async (req, res) => {
  try {
    const incidente = await Incidente.findById(req.params.id);
    if (!incidente) return res.status(404).json({ error: "Incidente no encontrado." });
    res.status(200).json(incidente);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el incidente...." });
  }
});



module.exports = router;