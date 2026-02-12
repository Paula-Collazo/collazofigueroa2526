<template>
    <div class="container mt-4">
        <div v-if="vehiculo" class="card shadow">
            <div class="row g-0">
                <div class="col-md-6">
                    <img
                        :src="urlImagen(vehiculo.imagen)"
                        class="img-fluid rounded-start"
                        alt="vehiculo"
                        style="height: 400px; width: 100%; object-fit: cover;"
                    />
                </div>
                <div class="col-md-6">
                    <div class="card-body">
                        <h2 class="card-title">{{ vehiculo.marca }} {{ vehiculo.modelo }}</h2>
                        <p class="text-muted">{{ vehiculo.tipo }}</p>
                        
                        <div class="mb-3">
                            <span 
                                class="badge fs-6"
                                :class="{
                                    'bg-primary': vehiculo.estado === 'disponible',
                                    'bg-warning text-dark': vehiculo.estado === 'reservado',
                                    'bg-danger': vehiculo.estado === 'vendido'
                                }"
                            >{{ vehiculo.estado }}</span>
                        </div>

                        <h4 class="text-success mb-3">{{ vehiculo.precio }} €</h4>

                        <div class="row mb-3">
                            <div class="col-6">
                                <p><strong>Matrícula:</strong> {{ vehiculo.matricula }}</p>
                                <p><strong>Año:</strong> {{ vehiculo.anio }}</p>
                                <p><strong>Kilómetros:</strong> {{ vehiculo.kilometros }} km</p>
                            </div>
                            <div class="col-6">
                                <p><strong>Combustible:</strong> {{ vehiculo.combustible }}</p>
                                <p><strong>Transmisión:</strong> {{ vehiculo.transmision }}</p>
                                <p v-if="vehiculo.potencia_cv"><strong>Potencia:</strong> {{ vehiculo.potencia_cv }} CV</p>
                            </div>
                        </div>

                        <div v-if="vehiculo.descripcion" class="mb-3">
                            <h5>Descripción</h5>
                            <p>{{ vehiculo.descripcion }}</p>
                        </div>

                        <div v-if="vehiculo.ubicacion" class="mb-3">
                            <h5>Ubicación</h5>
                            <p><i class="bi bi-geo-alt"></i> {{ vehiculo.ubicacion.ciudad }}, {{ vehiculo.ubicacion.provincia }}</p>
                        </div>

                        <div v-if="vehiculo.contacto" class="mb-3">
                            <h5>Contacto</h5>
                            <p><strong>Nombre:</strong> {{ vehiculo.contacto.nombre }}</p>
                            <p><strong>Teléfono:</strong> {{ vehiculo.contacto.telefono }}</p>
                            <p><strong>Email:</strong> {{ vehiculo.contacto.email }}</p>
                        </div>

                        <!-- Info de reserva (visible si está reservado) -->
                        <div v-if="vehiculo.reserva?.reservado" class="alert alert-warning">
                            <h5><i class="bi bi-bookmark-fill me-1"></i> Vehículo Reservado</h5>
                            <p class="mb-1"><strong>Por:</strong> {{ vehiculo.reserva.nombre }}</p>
                            <p class="mb-1"><strong>Teléfono:</strong> {{ vehiculo.reserva.telefono }}</p>
                            <p class="mb-1"><strong>Email:</strong> {{ vehiculo.reserva.email }}</p>
                            <p class="mb-0"><strong>Fecha:</strong> {{ new Date(vehiculo.reserva.fecha_reserva).toLocaleDateString() }}</p>
                        </div>

                        <!-- Botones -->
                        <div class="d-flex gap-2 flex-wrap">
                            <button class="btn btn-primary" @click="volver">
                                <i class="bi bi-arrow-left"></i> Volver
                            </button>

                            <!-- Añadir a cesta: solo si NO está reservado ni vendido -->
                            <button 
                                v-if="vehiculo.estado === 'disponible'"
                                class="btn btn-success" 
                                @click="agregarACesta(vehiculo)"
                            >
                                <i class="bi bi-cart3"></i> Añadir a la Cesta
                            </button>

                            <!-- Reservar: solo si está disponible y logueado -->
                            <button 
                                v-if="vehiculo.estado === 'disponible' && isLogueado"
                                class="btn btn-warning" 
                                @click="mostrarModalReserva = true"
                            >
                                <i class="bi bi-bookmark"></i> Reservar
                            </button>

                            <!-- Reservar deshabilitado si no logueado -->
                            <button 
                                v-if="vehiculo.estado === 'disponible' && !isLogueado"
                                class="btn btn-warning disabled"
                                disabled
                            >
                                <i class="bi bi-bookmark"></i> Reservar
                            </button>

                            <!-- Anular reserva: solo admin y si está reservado -->
                            <button 
                                v-if="vehiculo.reserva?.reservado && isAdmin"
                                class="btn btn-danger" 
                                @click="handleAnularReserva"
                            >
                                <i class="bi bi-x-circle"></i> Anular Reserva
                            </button>

                            <button 
                                class="btn btn-dark" 
                                @click="imprimirFichaVehiculo(vehiculo)"
                                title="Imprimir ficha del vehículo"
                            >
                                <i class="bi bi-printer"></i> Imprimir Ficha
                            </button>

                            <!-- Mensaje si vendido -->
                            <span v-if="vehiculo.estado === 'vendido'" class="btn btn-secondary disabled">
                                <i class="bi bi-lock"></i> Vendido
                            </span>

                            <!-- Mensaje si reservado (para no-admin) -->
                            <span v-if="vehiculo.estado === 'reservado' && !isAdmin" class="btn btn-secondary disabled">
                                <i class="bi bi-lock"></i> Reservado - No disponible
                            </span>
                        </div>

                        <!-- Aviso: debes iniciar sesión para reservar -->
                        <div
                            v-if="vehiculo.estado === 'disponible' && !isLogueado"
                            class="alert alert-info mt-3"
                        >
                            <p class="mb-1">Debes iniciar sesión o registrarte para reservar:</p>
                            <a href="/login" class="d-block">Iniciar Sesión</a>
                            <a href="/clientes" class="d-block">Registro</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center mt-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>

        <!-- MODAL DE RESERVA -->
        <div v-if="mostrarModalReserva" class="modal-overlay" @click.self="mostrarModalReserva = false">
            <div class="modal-contenido">
                <h4 class="mb-3">Reservar: {{ vehiculo.marca }} {{ vehiculo.modelo }}</h4>
                <form @submit.prevent="handleReservar">
                    <div class="mb-3">
                        <label class="form-label">Nombre completo</label>
                        <input v-model="formReserva.nombre" type="text" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Teléfono</label>
                        <input v-model="formReserva.telefono" type="tel" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input v-model="formReserva.email" type="email" class="form-control" required />
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-warning" :disabled="reservando">
                            <span v-if="reservando" class="spinner-border spinner-border-sm me-1"></span>
                            Confirmar Reserva
                        </button>
                        <button type="button" class="btn btn-secondary" @click="mostrarModalReserva = false">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getArticuloById, reservarArticulo, anularReserva } from '@/api/articulos.js';
import { useCestaStore } from '../store/cesta';
import Swal from 'sweetalert2';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const route = useRoute();
const router = useRouter();
const cestaStore = useCestaStore();
const vehiculo = ref(null);

// Login / Admin check
const isAdmin = ref(sessionStorage.getItem('isAdmin') === 'true');
const isUsuario = ref(sessionStorage.getItem('isUsuario') === 'true');
const isLogueado = ref(isUsuario.value || isAdmin.value);

// Modal reserva
const mostrarModalReserva = ref(false);
const reservando = ref(false);
const formReserva = ref({
    nombre: '',
    telefono: '',
    email: ''
});

onMounted(async () => {
    const id = route.params.id;
    try {
        vehiculo.value = await getArticuloById(id);
    } catch (error) {
        console.error('Error al cargar el vehículo:', error);
        router.push('/ventas');
    }
});

const urlImagen = (ruta) => {
    if (!ruta) return "/no-image.png";
    return `http://localhost:5000${ruta}`;
};

const agregarACesta = (v) => {
    cestaStore.addProducto({
        id: v._id,
        nombre: `${v.marca} ${v.modelo}`,
        precio: v.precio,
        imagen: urlImagen(v.imagen)
    });
    Swal.fire('Añadido', 'Vehículo añadido a la cesta', 'success');
};

const volver = () => {
    router.push('/ventas');
};

// Reservar vehículo
const handleReservar = async () => {
    reservando.value = true;
    try {
        const res = await reservarArticulo(vehiculo.value._id, formReserva.value);
        vehiculo.value = res.coche;
        mostrarModalReserva.value = false;
        Swal.fire('Reservado', 'El vehículo ha sido reservado correctamente', 'success');
    } catch (err) {
        const msg = err.response?.data?.error || 'Error al reservar';
        Swal.fire('Error', msg, 'error');
    } finally {
        reservando.value = false;
    }
};

// Anular reserva (admin)
const handleAnularReserva = async () => {
    const confirm = await Swal.fire({
        title: '¿Anular reserva?',
        text: 'El vehículo volverá a estar disponible',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, anular',
        cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
        const res = await anularReserva(vehiculo.value._id);
        vehiculo.value = res.coche;
        Swal.fire('Anulada', 'La reserva ha sido anulada', 'success');
    } catch (err) {
        const msg = err.response?.data?.error || 'Error al anular reserva';
        Swal.fire('Error', msg, 'error');
    }
};

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
 *    - Usamos autoTable() que es una herramienta que dibuja automáticamente
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

    // PASO 2: Diseño Premium - Cabecera compacta
    doc.setFillColor(20, 33, 61);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 23, 210, 5, 'F');

    // Título principal compacto
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHA DEL VEHICULO', 105, 12, { align: 'center' });

    // Subtítulo marca y modelo
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text(`${vehiculo.marca || ''} ${vehiculo.modelo || ''}`.toUpperCase(), 105, 19, { align: 'center' });

    // Badge de matrícula compacto
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(80, 24, 50, 5, 1, 1, 'F');
    doc.setTextColor(20, 33, 61);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(vehiculo.matricula || 'SIN MATRICULA', 105, 27.5, { align: 'center' });

    doc.setTextColor(44, 62, 80);

    // PASO 3: Organizar datos en secciones compactas
    let yPos = 34;

    // Combinar Información Principal + Especificaciones
    doc.setFillColor(236, 240, 241);
    doc.rect(15, yPos, 180, 6, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('INFORMACION DEL VEHICULO', 20, yPos + 4);
    yPos += 7;

    const seccion1 = [
        ['Tipo', vehiculo.tipo || '-'],
        ['Marca', vehiculo.marca || '-'],
        ['Modelo', vehiculo.modelo || '-'],
        ['Año', vehiculo.anio ? String(vehiculo.anio) : '-'],
        ['Estado', vehiculo.estado?.toUpperCase() || '-'],
        ['Kilometros', vehiculo.kilometros ? `${vehiculo.kilometros.toLocaleString('es-ES')} km` : '-'],
        ['Combustible', vehiculo.combustible || '-'],
        ['Transmision', vehiculo.transmision || '-'],
        ['Potencia', vehiculo.potencia_cv ? `${vehiculo.potencia_cv} CV` : '-']
    ];

    const seccion2Data = [
        ['Precio', vehiculo.precio ? `${vehiculo.precio.toLocaleString('es-ES')} €` : '-']
    ];

    const seccion3Data = [
        ['Provincia', vehiculo.ubicacion?.provincia || '-'],
        ['Ciudad', vehiculo.ubicacion?.ciudad || '-'],
        ['Nombre', vehiculo.contacto?.nombre || '-'],
        ['Telefono', vehiculo.contacto?.telefono || '-'],
        ['Email', vehiculo.contacto?.email || '-']
    ];

    const seccion4Data = [
        ['Fecha publicacion', vehiculo.fecha_publicacion ? new Date(vehiculo.fecha_publicacion).toLocaleDateString('es-ES') : '-'],
        ['Descripcion', vehiculo.descripcion || 'Sin descripcion adicional']
    ];

    // PASO 4: Renderizar todas las secciones de forma compacta
    const estiloSeccion = {
        startY: yPos,
        theme: 'plain',
        styles: {
            fontSize: 8,
            cellPadding: 2,
            textColor: [44, 62, 80],
            lineColor: [189, 195, 199],
            lineWidth: 0.1
        },
        columnStyles: {
            0: { 
                cellWidth: 45,
                fontStyle: 'bold',
                textColor: [52, 73, 94]
            },
            1: { 
                cellWidth: 135,
                textColor: [44, 62, 80]
            }
        },
        margin: { left: 15, right: 15 },
        didParseCell: function(data) {
            if (data.row.index % 2 === 0) {
                data.cell.styles.fillColor = [255, 255, 255];
            } else {
                data.cell.styles.fillColor = [249, 250, 251];
            }
        }
    };

    // Renderizar Sección 1 (Info + Especificaciones)
    autoTable(doc, { ...estiloSeccion, body: seccion1 });

    // Sección PRECIO (destacada)
    yPos = doc.lastAutoTable.finalY + 3;
    doc.setFillColor(46, 204, 113);
    doc.rect(15, yPos, 180, 6, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('PRECIO', 20, yPos + 4);
    yPos += 7;

    autoTable(doc, { 
        ...estiloSeccion, 
        startY: yPos, 
        body: seccion2Data,
        columnStyles: {
            0: { 
                cellWidth: 45,
                fontStyle: 'bold',
                textColor: [46, 204, 113]
            },
            1: { 
                cellWidth: 135,
                fontStyle: 'bold',
                fontSize: 10,
                textColor: [46, 204, 113]
            }
        }
    });

    // Sección UBICACIÓN Y CONTACTO combinada
    yPos = doc.lastAutoTable.finalY + 3;
    doc.setFillColor(236, 240, 241);
    doc.rect(15, yPos, 180, 6, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('UBICACION Y CONTACTO', 20, yPos + 4);
    yPos += 7;

    autoTable(doc, { ...estiloSeccion, startY: yPos, body: seccion3Data });

    // Sección DETALLES ADICIONALES
    yPos = doc.lastAutoTable.finalY + 3;
    doc.setFillColor(236, 240, 241);
    doc.rect(15, yPos, 180, 6, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('DETALLES ADICIONALES', 20, yPos + 4);
    yPos += 7;

    autoTable(doc, { ...estiloSeccion, startY: yPos, body: seccion4Data });

    // PASO 5: Pie de página compacto
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Barra inferior compacta
        doc.setFillColor(20, 33, 61);
        doc.rect(0, 290, 210, 7, 'F');
        
        // Información del pie en blanco
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        
        const fechaGeneracion = new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        doc.text(`Generado: ${fechaGeneracion}`, 20, 294.5);
        doc.text(`Pagina ${i}/${pageCount}`, 175, 294.5);
        
        // Línea decorativa dorada encima del pie
        doc.setDrawColor(241, 196, 15);
        doc.setLineWidth(0.5);
        doc.line(15, 288, 195, 288);
    }

    // PASO 6: Generamos el nombre del archivo y descargamos el PDF
    const fecha = new Date().toISOString().split('T')[0]; // Fecha actual en formato AAAA-MM-DD
    const matriculaLimpia = (vehiculo.matricula || 'SIN-MATRICULA').replace(/\s+/g, '_'); // Quitamos espacios
    const nombreArchivo = `ficha_${matriculaLimpia}_${fecha}.pdf`;

    // Guardamos/descargamos el PDF con el nombre generado
    doc.save(nombreArchivo);
};
</script>

<style scoped>
.card-title {
    font-weight: bold;
    text-transform: capitalize;
}

/* Modal overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
}

.modal-contenido {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 450px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
</style>

