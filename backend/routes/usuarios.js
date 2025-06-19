// Backend/routes/usuarios.js (Versión CommonJS y CRUD completo)
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs'); // Usamos bcryptjs por consistencia

// GET /api/usuarios - Listar todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-contrasena').populate('superior', 'nombre apellido');
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
});

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', async (req, res) => {
    // Usamos los campos del modelo corregido
    console.log(req.body);
    const { usuario, contrasena, rol, nombre, apellido, departamento } = req.body;

    if (!usuario || !contrasena || !rol || !nombre || !apellido) {
        return res.status(400).json({ error: "Nombre, apellido, usuario, contraseña y rol son requeridos." });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const contrasenaHasheada = await bcrypt.hash(contrasena, salt);

        const nuevoUsuario = new Usuario({
            usuario,
            contrasena: contrasenaHasheada,
            rol,
            nombre,
            apellido,
            departamento
        });

        await nuevoUsuario.save();
        const usuarioCreado = nuevoUsuario.toObject();
        delete usuarioCreado.contrasena; // No devolver la contraseña hasheada

        res.status(201).json({ mensaje: "Usuario creado con éxito", usuario: usuarioCreado });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: "El nombre de usuario ya existe." });
        }
        res.status(500).json({ error: "Error al crear el usuario.", detalle: err.message });
    }
});

// PUT /api/usuarios/:id - Actualizar un usuario
router.put('/:id', async (req, res) => {
    try {
        const datos = { ...req.body };

        // Si se está actualizando la contraseña, hashearla
        if (datos.contrasena) {
            const salt = await bcrypt.genSalt(10);
            datos.contrasena = await bcrypt.hash(datos.contrasena, salt);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, datos, { new: true }).select('-contrasena');
        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(usuarioActualizado);
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar el usuario", detalle: err.message });
    }
});

// DELETE /api/usuarios/:id - Eliminar un usuario
router.delete('/:id', async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar el usuario", detalle: err.message });
    }
});


module.exports = router;