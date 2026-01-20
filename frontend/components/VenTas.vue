<template>
    <div class="container-fluid mt-2">
        <div class="row g-4">
            <div 
            v-for="car in vehiculos"
            :key="car._id"
            class="col-12 col-md-6 col-lg-3"
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
                        <span class="badge bg-primary">{{ car.estado }}</span>
                        <button
                            class="btn badge btn-sm btn-success ms-2" 
                            @click.stop="agregarACesta(car)">

                            <i class="bi bi-cart3 me-1"></i> Añadir Cesta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref, onMounted } from "vue";
import { getArticulos } from "@/api/articulos.js";
import { useCestaStore } from "../store/cesta";

const cestaStore = useCestaStore();

const vehiculos = ref([]);

onMounted(async () => {
    vehiculos.value = await getArticulos();
});

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
</script>

<style scoped>
.card-title{
    font-weight: bold;
    text-transform: capitalize;
}
</style>