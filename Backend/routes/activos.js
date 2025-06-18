// routes/activos.js
const { Router } = require('express');
const { getDB } = require('../db');  // Llamamos a la función para obtener la base de datos

const router = Router();

// Ruta para registrar un activo
router.post('/registrar', async (req, res) => {
    const { nombre, tipo, marca, modelo, numeroSerie, descripcion, departamentoAsignado, valor } = req.body;

    try {
        const db = getDB(); // Accedemos a la base de datos
        const activos = db.collection('Activo'); // Seleccionamos la colección 'Activo'

        // Insertamos el activo
        const result = await activos.insertOne({
            nombre,
            tipo,
            marca,
            modelo,
            numeroSerie,
            descripcion,
            departamentoAsignado,
            valor
        });

        res.status(200).json({ message: "Activo registrado correctamente", id: result.insertedId });
    } catch (error) {
        console.error("Error al registrar activo:", error);
        res.status(500).json({ message: "Error al registrar activo", error: error.message });
    }
});

// Ruta para listar todos los activos
router.get('/listar', async (req, res) => {
    try {
        const db = getDB();
        const activos = await db.collection('Activo').find().toArray(); // Obtenemos todos los activos
        res.status(200).json(activos);
    } catch (error) {
        console.error("Error al obtener los activos:", error);
        res.status(500).json({ message: "Error al obtener los activos", error: error.message });
    }
});

module.exports = router;