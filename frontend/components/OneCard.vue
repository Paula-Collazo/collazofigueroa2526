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
                            <span class="badge bg-primary fs-6">{{ vehiculo.estado }}</span>
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

                        <div class="d-flex gap-2">
                            <button class="btn btn-primary" @click="volver">
                                <i class="bi bi-arrow-left"></i> Volver
                            </button>
                            <button class="btn btn-success" @click="agregarACesta(vehiculo)">
                                <i class="bi bi-cart3"></i> Añadir a la Cesta
                            </button>
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
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getArticuloById } from '@/api/articulos.js';
import { useCestaStore } from '../store/cesta';

const route = useRoute();
const router = useRouter();
const cestaStore = useCestaStore();
const vehiculo = ref(null);

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

const agregarACesta = (vehiculo) => {
    cestaStore.addProducto({
        id: vehiculo._id,
        nombre: `${vehiculo.marca} ${vehiculo.modelo}`,
        precio: vehiculo.precio,
        imagen: urlImagen(vehiculo.imagen)
    });
};

const volver = () => {
    router.push('/ventas');
};
</script>

<style scoped>
.card-title {
    font-weight: bold;
    text-transform: capitalize;
}
</style>

