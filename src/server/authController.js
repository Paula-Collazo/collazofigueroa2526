import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { dni, password } = req.body;
  console.log("Login request received for DNI:", dni);

  try {
    const response = await axios.get(`http://localhost:3000/clientes?dni=${dni}`);
    const user = response.data[0];

    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      {
        dni: user.dni,
        tipo: user.tipo || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, nombre: user.nombre, tipo: user.tipo || "user" });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor", dni });
  }
};

/////////////// MEJOR EN UN FICHERO APARTE authMiddleware.js

// Middleware: verificar JWT
// Se usa en rutas que requieren autenticación
// Verifica el token enviado en el header Authorization

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Authorization: Bearer <token>
  if (!authHeader) return res.status(401).json({ mensaje: "Token no recibido" });

  const token = authHeader.split(" ")[1]; // separar "Bearer" del token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guardar info del usuario en req
    next(); // continuar al controlador
  } catch (err) {
    return res.status(403).json({ mensaje: "Token inválido" });
  }
};


/// TAMBIEN EN EL FICHERO APARTE authMiddleware.js
// Middleware: solo admin
export const soloAdmin = (req, res, next) => {
  if (req.user?.tipo !== "admin") {
    return res.status(403).json({ mensaje: "Acceso solo para administradores" });
  }
  next();
};
