import mongoose from "mongoose";

//TODO hacer que guarde el dni del cliente que hace la compra 

const FacturaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    default: Date.now
  },
  productos: [
    {
      productoId: String,
      nombre: String,
      cantidad: Number,
      precio_unitario: Number
    }
  ],
  total: {
    type: Number,
    required: true
  }
});

export default mongoose.model("Factura", FacturaSchema);
