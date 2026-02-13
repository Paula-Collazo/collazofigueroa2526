// server/empleadoRoutes.js //TODO METERLO EN SERVER
import express from "express";
import multer from "multer";
import path from "path";
import Empleado from "../modelos/Empleado.js";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurarse de que la carpeta uploads exista
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const router = express.Router();
console.log("Router empleados cargado");

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Obtener todos los empleados
router.get("/", async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener empleados" });
  }
});

// Obtener empleado por ID
router.get("/:id", async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) return res.status(404).json({ error: "Empleado no encontrado" });
    res.json(empleado);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener empleado" });
  }
});

// Crear empleado con imagen
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    if (!req.body.empleado) {
      return res.status(400).json({ error: "Campo 'empleado' vacío" });
    }

    let datos;
    try {
      datos = JSON.parse(req.body.empleado);
    } catch (e) {
      return res.status(400).json({ error: "JSON inválido en 'empleado'" });
    }

    if (req.file) {
      datos.imagen = `/uploads/${req.file.filename}`;
    }

    const empleado = new Empleado(datos);
    const guardado = await empleado.save();
    res.json(guardado);
  } catch (err) {
    console.error("Error guardando empleado:", err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar empleado
router.put("/:id", upload.single("imagen"), async (req, res) => {
  try {
    let datos;
    if (req.body.empleado) {
      datos = JSON.parse(req.body.empleado);
    } else {
      datos = req.body;
    }

    if (req.file) {
      datos.imagen = `/uploads/${req.file.filename}`;
    }

    const actualizado = await Empleado.findByIdAndUpdate(req.params.id, datos, { new: true });
    if (!actualizado) return res.status(404).json({ error: "Empleado no encontrado" });
    res.json(actualizado);
  } catch (err) {
    console.error("Error actualizando empleado:", err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar empleado
router.delete("/:id", async (req, res) => {
  try {
    const eliminado = await Empleado.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Empleado no encontrado" });
    res.json({ mensaje: "Empleado eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar empleado" });
  }
});

export default router;
