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

export default router;
