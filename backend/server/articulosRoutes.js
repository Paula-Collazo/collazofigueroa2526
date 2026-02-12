// server/articulosRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import Articulo from  "../modelos/Articulo.js";
import { fileURLToPath } from "url";
import fs from 'fs';

// inicializar configuración de multer para manejo de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurarse de que la carpeta uploads exista
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Carpeta uploads creada automáticamente');
}

// Crear el router
const router = express.Router();
console.log("Router articulos cargado"); // para depurar



// Configuración de almacenamiento de multer en la carpeta uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); // ruta absoluta a server/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Inicializar multer
const upload = multer({ storage: storage });

// AHORA VIENEN LAS RUTAS USANDO EL router DE EXPRESS
// Obtener todos los artículo
router.get("/", async (req, res) => {
  const articulos = await Articulo.find();
  res.json(articulos);
});

// Guardar artículo con imagen
router.post("/", upload.single('imagen'), async (req, res) => {
  try {
    if (!req.body.vehiculo) {
      console.error("No se recibió el campo 'vehiculo'");
      return res.status(400).json({ error: "Campo 'vehiculo' vacío" });
    }

    let datos;
    try {
      datos = JSON.parse(req.body.vehiculo);
    } catch (e) {
      console.error("Error parseando JSON:", e.message);
      return res.status(400).json({ error: "JSON inválido en 'vehiculo'", detalle: e.message });
    }

    if (req.file) {
      datos.imagen = `/uploads/${req.file.filename}`;
    }

    const articulo = new Articulo(datos);
    const guardado = await articulo.save();
    res.json(guardado);

  } catch (err) {
    console.error("Error guardando artículo:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

router.get("/buscar", async (req, res) => {
  const {q} = req.query;

  if (!q) return res.json([]);

  const regex = new RegExp(q, "i");
// supongamos solo la marca modelo y descripción
  try {
    const articulos = await Articulo.find({
      $or: [
      { marca: regex },
      { modelo: regex },
      { descripcion: regex }
      ]
      });

    res.json(articulos);
  } catch (err) {
    res.status(500).json({ error: "Error en la búsqueda" });
  }
});

router.put("/vendido", async (req, res) => {
  try{
    const { ids } = req.body;

    if(!ids || !Array.isArray(ids) || ids.length === 0){
        return res.status(400).json({ error: "Se requiero un array de IDs "});
    }

    // // Actualizar todos los vehiculos con los IDs proporcionados 
    const resultado = await Articulo.updateMany( //actualiza y no para con el primero que cumple la condición si no que actualiza todos los que cumplen la condición
     {_id: { $in: ids }}, //_id (es cel id del articulo actuaL funciona como un for each) $in si el id esta dentro del array de ids
   { $set: { estado:"vendido"}} //si esta le cambio el estado a vendido
    )
//     let resultado = [];
// for (const id of ids) {
//   resultado.push( await Articulo.updateOne({_id:id}, {estado:"vendido"}))
// }
    res.json({
      mensaje: `${resultado} vehículo(s) marcado(s) como vendido(s)`,
      modificados: resultado
    });
  } catch (err) {
    console.error("Error al actualizar el estado del vehículo", err);
    res.status(500).json({ error: "Error al actualizar el estado del vehículo"});
    
  }
});

router.get("/:id", async (req, res) => {
  try{
    
    const id = req.params.id;
    
    const coche=  await Articulo.findById({id})

      
    if (!coche) {
        res.status(404).json({ error: "No se encontro ningun coche" })
    }
  
    return res.status(200).json(coche)
  
    } catch (error){
       res.status(500).json({ error: "Error al obtener coche" });
    }
});




// otras rutas PUT, DELETE, GET /:id igual

export default router;