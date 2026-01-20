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
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useCestaStore } from "../store/cesta.js";
import { watch, toRefs} from "vue";
import logo from '@/assets/Paula.png'; // Importa la imagen
export default {
  data() {
    return {
      cartItems: [],  
      totalPrice: 0,
    };
  },
//otros datos como el cliente, dirección, email, etc.


  mounted() {
    const cartStore = useCestaStore();
    const { items } = toRefs(cartStore); // Obtén los items del carrito desde el store de Pinia
  // Y también la variable totalPrice desde el getter del store
  this.cartItems = items.value;
  this.totalPrice = cartStore.totalPrice;

  
  // Usar un watch para actualizar cartItems cuando cambian
  watch(() => cartStore.items, (newVal) => {
    this.cartItems = newVal;
  }, { deep: true });


},

methods: {
  generarFacturaPDF() {
if (this.cartItems.length === 0) {
  console.error(" No hay productos en el carrito. No se puede generar la factura.");
  return;
}


const doc = new jsPDF();
const cart = this.cartItems;


// Logo en la parte superior izquierda (ajustar la ruta de tu logo)
doc.addImage(logo, 'png', 10, 10, 20, 20); // Ajusta las coordenadas y tamaño

// Título de la factura
doc.setFontSize(18);
doc.text("Factura de Compra", 60, 20); // Alineado a la derecha del logo


// Información del cliente
doc.setFontSize(9);
doc.text(`Razón Social: Regalos Teis`, 110,50);
doc.text(`Dirección: Avenida Galicia 101, Vigo 36216`, 110, 55);
doc.text(`Tlfo: 986 666 333 - Email: regalos@example.com`, 110, 60);

// Crear la tabla con los productos del carrito
const headers = [["ID", "Producto", "Cantidad", "Precio Unitario", "Total"]];
const data = cart.map((item) => [
  item._id,
  item.nombre,
  item.cantidad,
  `${item.precio_unitario.toFixed(2)} €`, // Formatear precio unitario
  `${(item.cantidad * item.precio_unitario).toFixed(2)} €`, // Formatear total
]);

doc.autoTable({
  startY: 80,
  head: headers,
  body: data,
  columnStyles: {
    0: { halign: 'center' }, // ID
    2: { halign: 'center' }, // Cantidad
    3: { halign: 'center' }, // Precio Unitario
    4: { halign: 'center'}, // Total
  },
  theme: 'striped',
});

// Total de la compra falineado a la derechal
const totalText = `Total: ${this.cartItems.reduce((acc, item) => acc + item.precio_unitario * item.cantidad,0).toFixed(2)} €`;


// obtener el ancho de la página
const pageWidth = doc.internal.pageSize.width;

// Calcular la posición para alinear a la derecha
const totalWidth = doc.getTextWidth(totalText);
const positionX = pageWidth - totalWidth - 14; // Resta 14 para sargen desde el borde derecho
doc.setFont('helvetica', 'bold');
doc.setFontSize(12);

//Colocar el texts en la posición calculada
doc.text(totalText, positionX - 9, doc.lastAutoTable.finalY + 10);

// Guardar el archivo POF
doc.save("Factura.pdf");
  }
},


  beforeUnmount() {
  //Eliminar los datos del carrito despues de mostrar la factura
    const cartstore = useCestaStore();
    cartstore.limpiarCart();
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
