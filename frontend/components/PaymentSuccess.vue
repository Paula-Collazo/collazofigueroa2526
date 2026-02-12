<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg border-0">
          <div class="card-body text-center p-5">
            <h2 class="mb-4">¡Pago Completado! 🎉</h2>

            <p class="text-muted mb-4">
              Gracias por tu compra. Te hemos enviado un correo con los detalles.
            </p>

            <div class="mb-4">
              <p class="fw-bold">Descargue su factura en formato PDF:</p>
              <button class="btn btn-primary btn-lg mt-2" @click="generarFacturaPDF">
                📄 Descargar Factura
              </button>
            </div>

            <router-link to="/modelos" class="text-decoration-none">
              ← Volver a la tienda
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jsPDF } from "jspdf";
import { useCestaStore } from "../store/cesta.js";
import logo from "@/assets/Paula.png";
import { addFactura, obtenerFacturaPorDni } from "../api/facturas.js";
import { setCochesToVendido } from "../api/articulos.js";
import { esAdmin } from "../api/authApi.js";
import { ref } from "vue";




export default {
  data() {
    return {
      cartItems: [],
      totalPrice: 0,
      numeroFactura: "",
      ultimaFactura: null,
      cargando: false,
      montoDescuento: 0,
      gastosEnvio: 0,
      subtotal: 0
    };
  },

  async mounted() {
  try {
    const user = await esAdmin();
    const dniUsuario = user?.dni;

    if (dniUsuario) {
      console.log(dniUsuario);

      const facturas = await obtenerFacturaPorDni(dniUsuario);
    

      if (facturas && facturas.length > 0) {
        this.ultimaFactura = facturas[facturas.length - 1];
          console.log(this.ultimaFactura.productos.map(item => item.productoId));

        await setCochesToVendido(
          this.ultimaFactura.productos.map(item => item.productoId)
        );
      }
    }
  } catch (error) {
    console.error('Error al cargar la última factura:', error);
  } finally {
    this.cargando = false;
  }
},


  created() {
     const yaGuardada = sessionStorage.getItem("facturaGuardada");
    const cartStore = useCestaStore();
    this.numeroFactura = `FAC-${Date.now()}`
    // Obtener carrito
    if (cartStore.items && cartStore.items.length > 0) {
      this.cartItems = [...cartStore.items];
    } else {
      const savedCart = localStorage.getItem("cesta");
      if (savedCart) {
        try {
          this.cartItems = JSON.parse(savedCart);
          
        } catch {
          this.cartItems = [];
        }
      }
    }

    // Obtener descuento, gastos de envio y subtotal desde localStorage
    this.montoDescuento = parseFloat(localStorage.getItem('montoDescuento') || '0');
    this.gastosEnvio = parseFloat(localStorage.getItem('gastosEnvio') || '0');
    this.subtotal = parseFloat(localStorage.getItem('subtotal') || '0');
    this.totalPrice = parseFloat(localStorage.getItem('precioFinal') || '0');

    // Si no hay precio final guardado, calcularlo
    if (this.totalPrice === 0) {
      this.totalPrice = this.cartItems.reduce(
        (total, item) =>
          total +
          ((item.precio_unitario || item.precio) || 0) *
            (item.cantidad || 0),
        0
      );
    }

    // Si no hay subtotal, usar el total de items
    if (this.subtotal === 0) {
      this.subtotal = this.cartItems.reduce(
        (total, item) =>
          total +
          ((item.precio_unitario || item.precio) || 0) *
            (item.cantidad || 0),
        0
      );
    }

    this.numeroFactura = `FAC-${Date.now()}`;

    // GUARDAR FACTURA AL ENTRAR
    if(this.cartItems.length>0 && !yaGuardada){
    this.guardarFactura();
       sessionStorage.setItem("facturaGuardada", "true");

    }
  },

  methods: {
    async guardarFactura() {

      try {
        const factura = {
          numeroFactura: this.numeroFactura,
          productos: this.cartItems.map((item) => ({
            productoId: item._id || item.id,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario || item.precio,
            fecha: new Date(),
            cliente: sessionStorage.getItem("dni")
          })),
          total: this.totalPrice,
          dni: sessionStorage.getItem("dni")
        };

        await addFactura(factura);
        console.log("✅ Factura guardada en MongoDB");
      } catch (error) {
        console.error("❌ Error guardando factura:", error);
      }
    },

    generarFacturaPDF() {
      if (!this.cartItems.length) {
        alert("No hay productos para generar factura");
        return;
      }

      const doc = new jsPDF();

      try {
        doc.addImage(logo, "png", 10, 10, 20, 20);
      } catch {}

      doc.setFontSize(18);
      doc.text("Factura de Compra", 60, 20);

      doc.setFontSize(9);
      doc.text("Razón Social: Regalos Teis", 110, 50);
      doc.text("Dirección: Avenida Galicia 101, Vigo 36216", 110, 55);
      doc.text(
        "Tlfo: 986 666 333 - Email: regalos@example.com",
        110,
        60
      );
      doc.setFontSize(11);
      doc.text(`Número de factura: ${this.numeroFactura}`, 60, 28);
      doc.text(
        `Fecha: ${new Date().toLocaleDateString()}`,
        60,
        36
      );
      doc.text(
        `Cliente: ${sessionStorage.getItem("dni") || "Desconocido"}`,
        60,
        44
      );

      let y = 80;
      const cols = [15, 35, 100, 130, 165];
      const headers = ["ID", "Producto", "Cantidad", "Precio", "Total"];

      doc.setFont(undefined, "bold");
      headers.forEach((h, i) => doc.text(h, cols[i], y));
      y += 10;
      doc.setFont(undefined, "normal");

      this.cartItems.forEach((item) => {
        const precio = item.precio_unitario || item.precio;
        const total = precio * item.cantidad;

        doc.text(String(item._id || item.id).substring(0, 8), cols[0], y);
        doc.text(item.nombre, cols[1], y);
        doc.text(String(item.cantidad), cols[2], y);
        doc.text(`${precio.toFixed(2)} EUR`, cols[3], y);
        doc.text(`${total.toFixed(2)} EUR`, cols[4], y);
        y += 8;
      });

      y += 10;
      doc.setFont(undefined, "normal");
      doc.setFontSize(10);

      // Mostrar subtotal
      doc.text(`Subtotal:`, 130, y);
      doc.text(`${this.subtotal.toFixed(2)} EUR`, 195, y, { align: "right" });
      y += 8;

      // Mostrar descuento si existe
      if (this.montoDescuento > 0) {
        doc.setTextColor(46, 204, 113); // Verde
        doc.text(`Descuento (10%):`, 130, y);
        doc.text(`-${this.montoDescuento.toFixed(2)} EUR`, 195, y, { align: "right" });
        doc.setTextColor(0, 0, 0); // Volver a negro
        y += 8;
      }

      // Mostrar gastos de envio si existen
      if (this.gastosEnvio > 0) {
        doc.setTextColor(230, 126, 34); // Naranja
        doc.text(`Gastos de envio:`, 130, y);
        doc.text(`+${this.gastosEnvio.toFixed(2)} EUR`, 195, y, { align: "right" });
        doc.setTextColor(0, 0, 0); // Volver a negro
        y += 8;
      }

      // Linea separadora
      doc.setLineWidth(0.5);
      doc.line(130, y, 195, y);
      y += 8;

      // Total final
      doc.setFont(undefined, "bold");
      doc.setFontSize(12);
      doc.text(`TOTAL:`, 130, y);
      doc.text(
        `${this.totalPrice.toFixed(2)} EUR`,
        195,
        y,
        { align: "right" }
      );

      const fecha = new Date().toISOString().split("T")[0];
      doc.save(`Factura_${fecha}.pdf`);
    },
  },

  beforeUnmount() {
    const cartStore = useCestaStore();
    cartStore.clearCesta();
  },
};
</script>

<style scoped>
.card {
  border-radius: 15px;
}

.btn-primary {
  border-radius: 8px;
  padding: 12px 30px;
}
</style>
