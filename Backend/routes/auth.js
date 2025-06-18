// Backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require('../models/Usuario'); // Importamos el modelo de Usuario

router.post("/login", async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ error: "Usuario y contraseña son requeridos." });
  }

  try {
    // 1. Buscar al usuario usando el modelo
    const user = await Usuario.findOne({ usuario: usuario });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // 2. Comparar contraseñas
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // 3. Crear y firmar el Token (JWT)
    const payload = {
      id: user._id,
      usuario: user.usuario,
      rol: user.rol
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'tu_secreto_por_defecto', { expiresIn: '8h' });

    res.status(200).json({
      mensaje: "Login exitoso",
      token,
      usuario: {
          id: user._id,
          nombre: user.nombre,
          rol: user.rol
      }
    });

  } catch (err) {
    console.error("Error en el login:", err);
    res.status(500).json({ error: "Error en el servidor." });
  }
});

module.exports = router;