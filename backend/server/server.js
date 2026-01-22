import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
// a diferencia de json-server, aquí necesita configurar las rutas y controladores manualmente
// json-server crea automáticamente las rutas basadas en el archivo JSON, mongoose requiere definir esquemas y modelos
// MONGOSEE NO SABE NADA DE RUTAS CONTROLADRES Y MODELOS, HAY QUE CREARLOS MANUALMENTE
import authRouter from "./authRouter.js"
import articulosRoutes from "./articulosRoutes.js"; // ruta al router backend
import contactoRoutes from "./contactoRoutes.js"
import Stripe from "stripe";
import facturaRoutes from "./facturaRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from environment or default to 5000
// const MONGODB_URI = process.env.MONGODB_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Middleware
// app.use(cors()); //si no funciona lo siguiente
// app.use(express.json());

// Configuración de CORS
// Permite peticiones desde tu frontend Vite
app.use((cors({
  origin: "http://localhost:5173", // Cambia si tu frontend usa otro puerto
  credentials: true
})))

// Middleware para parsear JSON
app.use(express.json());

// Carpeta de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas de autenticación
app.use('/api/auth', authRouter);

// Rutas DE MONGOOSE, JSON SERVER NO ES NECESARIO LAS RUTAS LAS CREA AUTOMATICAMENTE
// json-server es un backend ya construido.
// Express es un backend que TÚ construyes.
// Por eso json-server no requiere rutas y Express sí.
app.use("/api/articulos", articulosRoutes);

// Verificar variable
//console.log("MONGODB_URI =", process.env.MONGODB_URI);

app.use("/api/facturas", facturaRoutes);

// Rutas de contacto
app.use("/api/contacto", contactoRoutes);


// Configuración de CORS modificado para correo

const corsOptions = {
  origin: "http://localhost:5173", // tu frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

// Configuración de Stripe carga de la clave secreta const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ruta crear sescion checkout
app.post("/crear-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.nombre,
      },
    unit_amount: Math.round(item.precio * 100), // convertir a centimos
  },
    quantity: item.cantidad,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: "payment",
    success_url: 'http://localhost:5173/PaymentSuccess', //crear estos componentes en frontend
    cancel_url: 'http://localhost:5173/PaymentCancel', //crear estos componentes en frontend
  });

res.json({ url: session.url });
}
  catch (error) {
  console.error("Error creating checkout session:", error);
  res.status(500).json({ error: "Internal Server Error"});
  }
});

// // Ruta para manejar peticiones de IA
// app.post("/ia", async (req, res) => {
//   try {
//   const { message } = req.body;
// }
// } catch
// )

/// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB a la base de datos BBDD"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

//Iniciar el servidor Express en el puerto especificado
app.listen(PORT, () => {
  console.log(`Server Express está corriendo en el puerto: ${PORT}`);
});