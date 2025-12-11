import { login, verificarToken, soloAdmin } from "./authController.js";
import express from "express";

const router = express.Router();
console.log("Router auth cargado"); // para depurar

router.post("/login", login);

router.get("/modelos", verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Hola, ${req.user.dni} estás autenticado` });
});

router.get("/clientes", verificarToken, (req, res) => {
  res.json({ message: `Hola, ${req.user.dni} estás autenticado` });
});

router.get("/ventas", verificarToken, (req, res) => {
  res.json({ message: `Hola, ${req.user.dni} estás autenticado` });
});

router.get("/noticias", verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Hola, ${req.user.dni} estás autenticado` });
});

router.get("/citas-taller", verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Hola, ${req.user.dni} estás autenticado` });
});

router.get("/check-admin", verificarToken,(req, res) => {
  res.json({ esAdmin: req.user?.tipo === "admin" });
});

export default router;