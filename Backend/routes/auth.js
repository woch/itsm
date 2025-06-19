// Backend/routes/auth.js (Versión corregida para autenticar por 'usuario')

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require('../models/Usuario'); // Importamos el modelo de Usuario

// La ruta sigue siendo POST /api/auth/login
router.post("/login", async (req, res) => {
  // 1. Extraemos los datos del cuerpo de la petición.
  // El frontend enviará un campo 'usuario', que en nuestro caso es el correo.
  const { usuario, contrasena } = req.body;

  // 2. Verificamos que ambos campos fueron enviados
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: "El correo y la contraseña son requeridos." });
  }

  try {
    // 3. Buscamos al usuario en la BD usando el campo 'usuario' (que contiene el correo).
    // El método .findOne() buscará un documento donde el campo 'usuario' coincida.
    const user = await Usuario.findOne({ usuario: usuario }); // <-- La lógica clave está aquí
    
    // Si no se encuentra un usuario con ese correo, devolvemos error.
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // 4. Comparamos la contraseña enviada con la hasheada en la BD.
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    // Si no coinciden, devolvemos error.
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // --- Si las credenciales son correctas ---

    // 5. Creamos el payload para el JWT.
    const payload = {
      id: user._id,
      usuario: user.usuario, // Este es el correo/login
      rol: user.rol,
      nombre: user.nombre
    };

    // 6. Firmamos el token.
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 7. Enviamos la respuesta exitosa.
    res.status(200).json({
      mensaje: "Login exitoso",
      token: token,
      usuario: {
          id: user._id,
          nombre: user.nombre,
          apellido: user.apellido,
          usuario: user.usuario, // Devolvemos el correo/login
          rol: user.rol
      }
    });

  } catch (err) {
    console.error("Error en el proceso de login:", err);
    res.status(500).json({ error: "Error interno en el servidor." });
  }
});

module.exports = router;