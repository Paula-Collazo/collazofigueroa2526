<template>
    <div class="container-fluid mt-2">
        <!-- Filtro por marca -->
        <div class="d-flex align-items-center justify-content-end gap-2 mb-3">
            <input
                type="text"
                v-model="filtroMarca"
                class="form-control rounded-0 shadow-none border"
                placeholder="Filtrar por marca..."
                style="width: 200px;"
            />
            <button class="btn btn-info text-white" @click="filtroMarca = ''">
                <i class="bi bi-x-circle me-1"></i> Limpiar
            </button>
        </div>
        <div class="row g-4">
            <div 
            v-for="car in vehiculosFiltrados"
            :key="car._id"
            class="col-12 col-md-6 col-lg-3"
            v-on:click="locate(car._id) "
            >
                <div class="card h-80 shadow-sm">
                    <img
                        :src="urlImagen(car.imagen)"
                        class="card-img-top"
                        alt="vehiculo"
                        style="height: 200px; object-fit: cover;"
                    ></img>

                    <div class="card-body">
                        <h5 class="card-title">{{ car.marca }} {{ car.modelo }}</h5>
                        <p class="card-text">
                            <strong>Año:</strong>{{ car.anio }}<br>
                            <strong>Km:</strong>{{ car.kilometros }}<br>
                            <strong>Precio:</strong>{{ car.precio }}<br>
                        </p>   
                    </div>

                    <div class="card-footer text-end bg-white">
                        <span 
                            class="badge"
                            :class="{
                                'bg-primary': car.estado === 'disponible',
                                'bg-warning text-dark': car.estado === 'reservado',
                                'bg-danger': car.estado === 'vendido'
                            }"
                        >{{ car.estado }}</span>
                        <button
                            v-if="car.estado === 'disponible'"
                            class="btn badge btn-sm btn-success ms-2" 
                            @click.stop="agregarACesta(car)">

                            <i class="bi bi-cart3 me-1"></i> Añadir Cesta
                        </button>
                        <span v-else class="badge bg-secondary ms-2">
                            <i class="bi bi-lock me-1"></i> No disponible
                        </span>
                        <button
                            class="btn badge btn-sm btn-info ms-2"
                            @click.stop="imprimirFichaVehiculo(car)"
                            title="Imprimir ficha del vehículo">
                            <i class="bi bi-printer me-1"></i> Imprimir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getArticulos } from "@/api/articulos.js";
import { useCestaStore } from "../store/cesta";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const router = useRouter();
const cestaStore = useCestaStore();

const vehiculos = ref([]);
const filtroMarca = ref('');

const vehiculosFiltrados = computed(() => {
    const marca = filtroMarca.value.trim().toLowerCase();
    if (!marca) return vehiculos.value;
    return vehiculos.value.filter(car =>
        car.marca.toLowerCase().includes(marca)
    );
});

onMounted(async () => {
    vehiculos.value = await getArticulos();
});

function locate(id){
    router.push(`/ventas/${id}`);
}

const urlImagen = (ruta) => {
    if (!ruta) return "/no-image.png";
    return `http://localhost:5000${ruta}`
};

// Añadir vehículo a la cesta de la compra el id, marca, modelo, precio e imagen
const agregarACesta = (vehiculo) => {
    cestaStore.addProducto({
    id: vehiculo._id,
    nombre: `${vehiculo.marca} ${vehiculo.modelo}`,
    precio: vehiculo.precio,
    imagen: urlImagen (vehiculo.imagen)
    })
}

/**
 * FUNCIÓN: imprimirFichaVehiculo
 * 
 * PROPÓSITO: Generar e imprimir un PDF con la ficha completa de un vehículo individual.
 * Esta función muestra TODOS los datos del vehículo en formato tabla vertical (Campo - Valor).
 * 
 * PARÁMETRO: vehiculo - Es el objeto que contiene toda la información del vehículo seleccionado
 * 
 * CÓMO FUNCIONA (paso a paso):
 * 
 * 1. CREAR EL DOCUMENTO PDF
 *    - Se crea un documento PDF en blanco, tamaño A4 vertical (formato estándar)
 * 
 * 2. AÑADIR EL TÍTULO Y MATRÍCULA
 *    - En la parte superior del PDF ponemos un título grande: "Ficha del Vehículo"
 *    - Debajo mostramos la matrícula del vehículo para identificarlo rápidamente
 * 
 * 3. PREPARAR LOS DATOS EN FORMATO TABLA
 *    - Creamos un array (lista) donde cada elemento es una fila con dos valores:
 *      ["Nombre del campo", "Valor del campo"]
 *    - Por ejemplo: ["Marca", "Toyota"], ["Modelo", "Corolla"], etc.
 *    - Incluimos TODOS los datos: tipo, marca, modelo, año, kilómetros, precio,
 *      combustible, transmisión, potencia, estado, ubicación, contacto, fecha y descripción
 * 
 * 4. GENERAR LA TABLA EN EL PDF
 *    - Usamos doc.autoTable() que es una herramienta que dibuja automáticamente
 *      una tabla bonita con bordes, colores y formato profesional
 *    - Le pasamos:
 *      * head: La cabecera de la tabla ("Campo" y "Valor")
 *      * body: Todas las filas con los datos del vehículo
 *      * startY: Dónde empezar a dibujar la tabla en el PDF (30mm desde arriba)
 *      * styles: Estilos de la tabla (tamaño de letra, color, etc.)
 * 
 * 5. DESCARGAR EL PDF
 *    - Generamos un nombre único para el archivo usando la matrícula y la fecha actual
 *    - Formato del nombre: ficha_MATRICULA_FECHA.pdf
 *    - El navegador descarga automáticamente el archivo
 */
const imprimirFichaVehiculo = (vehiculo) => {
    // PASO 1: Creamos un documento PDF en blanco, tamaño A4 vertical
    const doc = new jsPDF();

    // PASO 2: Añadimos el título principal en la parte superior del PDF
    doc.setFontSize(18); // Tamaño grande para el título
    doc.setFont(undefined, 'bold'); // Letra en negrita
    doc.text("Ficha del Vehículo", 105, 15, { align: 'center' }); // Centrado horizontalmente

    // Añadimos la matrícula justo debajo del título
    doc.setFontSize(14);
    doc.text(`Matrícula: ${vehiculo.matricula || 'Sin matrícula'}`, 105, 23, { align: 'center' });

    // PASO 3: Preparamos todos los datos del vehículo en formato tabla
    // Cada fila es un array de 2 elementos: ["Nombre del campo", "Valor"]
    const datosVehiculo = [
        ['Tipo de vehículo', vehiculo.tipo || '-'],
        ['Marca', vehiculo.marca || '-'],
        ['Modelo', vehiculo.modelo || '-'],
        ['Año', vehiculo.anio ? String(vehiculo.anio) : '-'],
        ['Kilómetros', vehiculo.kilometros ? `${vehiculo.kilometros.toLocaleString('es-ES')} km` : '-'],
        ['Precio', vehiculo.precio ? `${vehiculo.precio.toLocaleString('es-ES')} €` : '-'],
        ['Combustible', vehiculo.combustible || '-'],
        ['Transmisión', vehiculo.transmision || '-'],
        ['Potencia', vehiculo.potencia_cv ? `${vehiculo.potencia_cv} CV` : '-'],
        ['Estado', vehiculo.estado || '-'],
        ['Provincia', vehiculo.ubicacion?.provincia || '-'],
        ['Ciudad', vehiculo.ubicacion?.ciudad || '-'],
        ['Contacto - Nombre', vehiculo.contacto?.nombre || '-'],
        ['Contacto - Teléfono', vehiculo.contacto?.telefono || '-'],
        ['Contacto - Email', vehiculo.contacto?.email || '-'],
        ['Fecha de publicación', vehiculo.fecha_publicacion ? new Date(vehiculo.fecha_publicacion).toLocaleDateString('es-ES') : '-'],
        ['Descripción', vehiculo.descripcion || 'Sin descripción']
    ];

    // PASO 4: Generamos la tabla automáticamente en el PDF
    // autoTable es una función que dibuja tablas profesionales sin tener que hacerlo manualmente
    // IMPORTANTE: Se llama como autoTable(doc, opciones) pasando el documento como primer parámetro
    autoTable(doc, {
        head: [['Campo', 'Valor']], // Cabecera de la tabla (primera fila en negrita)
        body: datosVehiculo, // Todas las filas con los datos del vehículo
        startY: 30, // Empezamos a dibujar la tabla 30mm desde arriba (para dejar espacio al título)
        styles: { 
            fontSize: 10, // Tamaño de letra medio
            cellPadding: 3, // Espacio dentro de cada celda para que no quede apretado
        },
        headStyles: { 
            fillColor: [37, 99, 235], // Color azul para la cabecera (RGB)
            textColor: [255, 255, 255], // Texto blanco en la cabecera
            fontStyle: 'bold' // Letra en negrita
        },
        columnStyles: {
            0: { cellWidth: 60, fontStyle: 'bold' }, // Primera columna (Campo): 60mm de ancho, negrita
            1: { cellWidth: 120 } // Segunda columna (Valor): 120mm de ancho
        },
        alternateRowStyles: { 
            fillColor: [245, 247, 250] // Color gris claro en filas alternas para mejor lectura
        }
    });

    // PASO 5: Generamos el nombre del archivo y descargamos el PDF
    const fecha = new Date().toISOString().split('T')[0]; // Fecha actual en formato AAAA-MM-DD
    const matriculaLimpia = (vehiculo.matricula || 'SIN-MATRICULA').replace(/\s+/g, '_'); // Quitamos espacios
    const nombreArchivo = `ficha_${matriculaLimpia}_${fecha}.pdf`;

    // Guardamos/descargamos el PDF con el nombre generado
    doc.save(nombreArchivo);
};
</script>

<style scoped>
.card-title{
    font-weight: bold;
    text-transform: capitalize;
}
</style>