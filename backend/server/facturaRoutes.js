import express from "express";
import Factura from "../modelos/Factura.js";

const router = express.Router();

// CREAR FACTURA
router.post("/", async (req, res) => {
  try {
    console.log("📥 Factura recibida:", req.body);

    const factura = new Factura(req.body);
    await factura.save();

    res.status(201).json(factura);
  } catch (error) {
    console.error("❌ Error al guardar factura:", error);
    res.status(500).json({ error: "Error al guardar factura" });
  }
});

router.get("/:dni", async (req, res) => {
  try{
  
  const dni = req.params.dni;
  console.log(dni);
  
  const facturas=  await Factura.find({dni})
  console.log(facturas);
    
  if ( !facturas || facturas.length === 0) {
      res.status(404).json({ error: "No se encontro ninguna factura" })
  }

  return res.status(200).json(facturas)

  } catch (error){
     res.status(500).json({ error: "Error al obtener factura" });
  }
})

export default router;
