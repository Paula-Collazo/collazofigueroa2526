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
import "jspdf-autotable";
import { useCestaStore } from "../store/cesta.js";
import logo from '@/assets/Paula.png';

export default {
  data() {
    return {
      cartItems: [],  
      totalPrice: 0,
    };
  },

  created() {
    // Obtener items del store
    const cartStore = useCestaStore();
    
    // Si el store tiene items, usarlos
    if (cartStore.items && cartStore.items.length > 0) {
      this.cartItems = [...cartStore.items];
    } else {
      // Si no, intentar obtener de localStorage directamente
      const savedCart = localStorage.getItem('cesta');
      if (savedCart) {
        try {
          this.cartItems = JSON.parse(savedCart);
        } catch (e) {
          console.warn('No se pudo recuperar carrito de localStorage:', e);
          this.cartItems = [];
        }
      }
    }
    
    this.totalPrice = this.cartItems.reduce((total, item) => total + ((item.precio_unitario || item.precio) || 0) * (item.cantidad || 0), 0);
    
    console.log('Items en PaymentSuccess:', this.cartItems);
    console.log('localStorage cesta:', localStorage.getItem('cesta'));
  },

  methods: {
    generarFacturaPDF() {
      if (!this.cartItems || this.cartItems.length === 0) {
        console.error("No hay productos en el carrito. No se puede generar la factura.");
        alert("No hay productos para generar factura");
        return;
      }

      try {
        const doc = new jsPDF();
        const cart = this.cartItems;

        console.log('Generando PDF con items:', cart);

        // Logo en la parte superior izquierda
        try {
          doc.addImage(logo, 'png', 10, 10, 20, 20);
        } catch (e) {
          console.warn('No se pudo agregar imagen:', e);
        }

        // Título de la factura
        doc.setFontSize(18);
        doc.text("Factura de Compra", 60, 20);

        // Información del cliente
        doc.setFontSize(9);
        doc.text(`Razón Social: Regalos Teis`, 110, 50);
        doc.text(`Dirección: Avenida Galicia 101, Vigo 36216`, 110, 55);
        doc.text(`Tlfo: 986 666 333 - Email: regalos@example.com`, 110, 60);

        // Crear tabla manualmente sin usar autoTable
        let yPosition = 80;
        
        // Headers
        const headers = ["ID", "Producto", "Cantidad", "Precio Unitario", "Total"];
        const columnX = [15, 35, 100, 130, 165];
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        
        headers.forEach((header, i) => {
          doc.text(header, columnX[i], yPosition);
        });
        
        yPosition += 10;
        doc.setFont(undefined, 'normal');
        
        // Datos
        cart.forEach((item) => {
          const id = item._id || item.id || '---';
          const nombre = item.nombre || '---';
          const cantidad = item.cantidad || 0;
          const precio = (item.precio_unitario || item.precio) || 0;
          const total = cantidad * precio;
          
          doc.text(String(id).substring(0, 8), columnX[0], yPosition);
          doc.text(String(nombre).substring(0, 20), columnX[1], yPosition);
          doc.text(String(cantidad), columnX[2], yPosition);
          doc.text(`${precio.toFixed(2)} €`, columnX[3], yPosition);
          doc.text(`${total.toFixed(2)} €`, columnX[4], yPosition);
          
          yPosition += 8;
        });

        // Total de la compra
        yPosition += 5;
        const totalAmount = cart.reduce((acc, item) => acc + ((item.precio_unitario || item.precio) || 0) * (item.cantidad || 0), 0);
        const totalText = `Total: ${totalAmount.toFixed(2)} €`;

        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text(totalText, 165, yPosition, { align: 'right' });

        // Guardar el archivo PDF
        const fecha = new Date().toISOString().split('T')[0];
        const hora = new Date().toLocaleTimeString().replace(/:/g, '-');
        doc.save(`Factura_${fecha}_${hora}.pdf`);
        
        console.log('PDF generado exitosamente');
        
      } catch (error) {
        console.error('Error generando PDF completo:', error);
        console.error('Stack:', error.stack);
        alert('Error al generar PDF: ' + error.message);
      }
    }
  },

  beforeUnmount() {
    // Limpiar carrito después de que el usuario haya descargado la factura
    const cartstore = useCestaStore();
    cartstore.clearCesta();
  }

};
</script>

<style scoped>
.card {
  border-radius: 15px;
  background: white;
}

.btn-primary {
  border-radius: 8px;
  padding: 12px 30px;
}
</style>
