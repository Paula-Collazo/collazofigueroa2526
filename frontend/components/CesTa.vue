<template>
    <div class="container mt-4">
        <h2>Mi Cesta</h2>

    <div v-if="cesta.items.length == 0" class="alert alert-info">
    La cesta está vacía.
    </div>

<div v-else>
    <table class="table table-primary">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Precios</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in cesta.items" key="item.id">
                <td>{{item.nombre }}</td>
                <td>{{item.precio }} €</td>
                <td>
                    <button class="btn btn-se btn-outline-secondary me-1" @click="decrementar (item.id)">-</button>
                    {{item.cantidad }}
                    <button class="btn btn-sm btn-outline-secondary ms-1" @click="incrementar(item.id)">+</button>
                </td>
                <td>{{item.precio * item.cantidad }} €</td>
                <td>
                    <button class="btn btn-sm btn-danger" @click="removeProducto (item.id)">Eliminar</button>
                </td>
            </tr>
        </tbody>
    </table>

   <div class="row mt-3">
    <!-- COLUMNA IZQUIERDA -->
        <div class="col-md-6">
            <label for="descuento">Introduce tu código de descuento</label>
            <input
                type="text"
                id="descuento"
                class="form-control w-50"
                placeholder="Código de descuento"
                v-model="codigoDescuento"
                @change="calcularPrecioFinal"
            >
        </div>

        <!-- COLUMNA DERECHA -->
        <div
            v-if="!isUsuario && !isAdmin"
            class="col-md-6 text-end"
        >
            <p class="mb-1">Debes iniciar sesión o registrarte para comprar:</p>
            <a href="/login" class="d-block">Iniciar Sesión</a>
            <a href="/clientes" class="d-block">Registro</a>
        </div>
    </div>


    <!-- Mensajes de descuento y gastos de envío -->
    <div class="mt-3">
        <div v-if="montoDescuento > 0" class="alert alert-success py-2">
            <i class="bi bi-tag-fill me-2"></i>
            <strong>Descuento aplicado:</strong> -{{ montoDescuento.toFixed(2) }}€
        </div>
        <div v-if="gastosEnvio > 0" class="alert alert-warning py-2">
            <i class="bi bi-truck me-2"></i>
            <strong>Gastos de envío:</strong> +{{ gastosEnvio.toFixed(2) }}€
        </div>
    </div>

    <div class="d-flex justify-content-between align-items-center at-3">
        <h5>
            Total: {{ precioFinal.toFixed(2) }}€
        </h5>
        <button class="btn btn-success" @click="iniciarPago":disabled="!isUsuario && !isAdmin">Iniciar Pago</button>
    </div>
    <!-- <div class="text-end mt-3">
        <h4>Total: {{ formatoPrecio (totalPrice) }}</h4>
        <button class="btn btn-success" @click="finalizarPago" :disabled="cartItems.length === 0">
        Finalizar Compra
        </button>
    </div> -->
  </div>
</div>
</template>

<script setup>

import {useCestaStore} from '@/store/cesta.js'
import axios from 'axios'    
import Swal from 'sweetalert2'
import { ref } from 'vue'


const cesta = useCestaStore()

const incrementar = (id) => {
    cesta.incrementar(id)
    calcularPrecioFinal()
}

const decrementar = (id) => {
    cesta.decrementar(id)
    calcularPrecioFinal()
}

const removeProducto = (id) => {
    cesta.removeProducto(id)
    calcularPrecioFinal()
}
const codigoDescuento = ref('')
const precioFinal = ref(0)
const montoDescuento = ref(0) // Dinero descontado
const gastosEnvio = ref(0) // Dinero añadido por envío
const isUsuario = ref(
    sessionStorage.getItem('isUsuario') === 'true'
)
const isAdmin = ref(
    sessionStorage.getItem('isAdmin') === 'true'
)

const calcularPrecioFinal = () => {
    // Reiniciar valores
    montoDescuento.value = 0
    gastosEnvio.value = 0
    
    // Calcular descuento si se aplica el código
    if (codigoDescuento.value === "DESCUENTO") {
        montoDescuento.value = cesta.totalPrecio * 0.1 // 10% de descuento
        precioFinal.value = cesta.totalPrecio * 0.9
    } else {
        precioFinal.value = cesta.totalPrecio
    }

    // Calcular gastos de envío si el total es menor de 50€
    if (precioFinal.value < 50) {
        gastosEnvio.value = precioFinal.value * 0.05 // 5% de gastos de envío
        precioFinal.value = precioFinal.value * 1.05
    }
}

calcularPrecioFinal()

const mostrarAlerta = (titulo, mensaje, tipo = 'info') => {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: tipo,
        confirmButtonText: 'OK'
    })
}

// const mostrarAlertaCesta = (titulo, mensaje, tipo = 'info', ruta = '/') => {
//   Swal.fire({
//     title: titulo,
//     text: mensaje,
//     icon: tipo,
//     confirmButtonText: 'Ir a iniciar sesión/Registro',
//   }).then((result) => {
//     if (result.isConfirmed) {
//       window.location.href = ruta
//     }
//   })
// }

// Iniciar pago con Stripe usando axios
const iniciarPago = async () => {
    // if (!isUsuario.value && !isAdmin.value) {
    //     mostrarAlertaCesta('Error', 'Debes iniciar sesión para realizar el pago', 'error', '/login')
    //     return
    //}
    if (!cesta.items.length) {
        mostrarAlerta('Aviso', 'La cesta está vacía', 'warning')
        return
    }

    try {
    // IMPORTANTE: Guardar el carrito en localStorage ANTES de hacer cualquier redireccionamiento
    localStorage.setItem('cesta', JSON.stringify(cesta.items))
    
    // Guardar información de descuento y gastos de envío para la factura
    localStorage.setItem('montoDescuento', montoDescuento.value.toString())
    localStorage.setItem('gastosEnvio', gastosEnvio.value.toString())
    localStorage.setItem('precioFinal', precioFinal.value.toString())
    localStorage.setItem('subtotal', cesta.totalPrecio.toString())
    
    // Preparar items para Stripe con descuento aplicado proporcionalmente
    let itemsParaStripe = []
    
    if (montoDescuento.value > 0) {
        // Aplicar descuento proporcionalmente a cada producto
        const factorDescuento = 1 - (montoDescuento.value / cesta.totalPrecio)
        itemsParaStripe = cesta.items.map(item => ({
            ...item,
            nombre: item.nombre + ' (10% dto)',
            precio: item.precio * factorDescuento
        }))
    } else {
        itemsParaStripe = [...cesta.items]
    }
    
    // Añadir gastos de envío como item adicional si existen
    if (gastosEnvio.value > 0) {
        itemsParaStripe.push({
            nombre: 'Gastos de envio',
            precio: gastosEnvio.value,
            cantidad: 1
        })
    }
    
    // Crear la sesión de pago en el backend
    const response = await axios.post('http://localhost:5000/crear-checkout-session', {
        items: itemsParaStripe,
        amount: precioFinal.value
    })

    const session = response.data

    if (!session.url) {
        console.error('No se recibió URL de Stripe.')
        mostrarAlerta('Error', 'No se pudo iniciar el pago', 'error')
        return
    }

    // Redirigir directamente al checkout de Stripe
    window.location.href = session.url

    } catch (error) {
        console.error('Error en iniciarPago:', error)
    mostrarAlerta ('Error', 'No se pudo iniciar el pago', 'error')
    }
}

</script>
<style scoped>
.table-primary th {
  background-color: #2563EB !important;
  color: white !important;
}
</style>
