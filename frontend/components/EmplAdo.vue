<template>
    <div class="container-fluid my-4 p-4 border rounded-4 shadow-lg bg-white">
        <h4 class="text-center mb-4 fw-semibold border-bottom pb-2 mt-2" style="color: #1F2937;">
            <i class="bi bi-person-badge me-2"></i>Registro de Empleados
        </h4>

        <form @submit.prevent="guardarEmpleado" class="mb-2 mt-1">
            <!-- FILA: Nombre, Apellidos -->
            <div class="row g-3 align-items-center mt-1">
                <div class="col-12 col-md-4 d-flex align-items-center">
                    <label for="nombre" class="form-label mb-0 me-3 text-nowrap">Nombre:</label>
                    <input type="text" id="nombre" v-model="empleado.nombre"
                        class="form-control rounded-0 shadow-none border" required />
                </div>
                <div class="col-12 col-md-4 d-flex align-items-center">
                    <label for="apellidos" class="form-label mb-0 me-3 text-nowrap">Apellidos:</label>
                    <input type="text" id="apellidos" v-model="empleado.apellidos"
                        class="form-control rounded-0 shadow-none border" required />
                </div>
                <div class="col-12 col-md-4 d-flex align-items-center">
                    <label for="dni" class="form-label mb-0 me-3 text-nowrap">DNI:</label>
                    <input type="text" id="dni" v-model="empleado.dni"
                        class="form-control rounded-0 shadow-none border" required />
                </div>
            </div>

            <!-- FILA: Email, Teléfono, Puesto -->
            <div class="row g-3 align-items-center mt-2">
                <div class="col-12 col-md-4 d-flex align-items-center">
                    <label for="email" class="form-label mb-0 me-3 text-nowrap">Email:</label>
                    <input type="email" id="email" v-model="empleado.email"
                        class="form-control rounded-0 shadow-none border" required />
                </div>
                <div class="col-12 col-md-4 d-flex align-items-center">
                    <label for="telefono" class="form-label mb-0 me-3 text-nowrap">Teléfono:</label>
                    <input type="tel" id="telefono" v-model="empleado.telefono"
                        class="form-control rounded-0 shadow-none border" required />
                </div>
                <div class="col-12 col-md-4 d-flex align-items-center">
                    <label for="puesto" class="form-label mb-0 me-3 text-nowrap">Puesto:</label>
                    <select id="puesto" v-model="empleado.puesto"
                        class="form-select rounded-0 shadow-none border" required>
                        <option disabled value="">Seleccione</option>
                        <option>Comercial</option>
                        <option>Mecánico</option>
                        <option>Administración</option>
                        <option>Gerente</option>
                        <option>Recepcionista</option>
                    </select>
                </div>
            </div>

            <!-- FILA: Fecha alta, Salario -->
            <div class="row g-3 align-items-center mt-2">
                <div class="col-12 col-md-4 d-flex align-items-center">
                    <label for="fechaAlta" class="form-label mb-0 me-3 text-nowrap">Fecha Alta:</label>
                    <input type="date" id="fechaAlta" v-model="empleado.fechaAlta"
                        class="form-control rounded-0 shadow-none border" required />
                </div>
                <div class="col-12 col-md-4 d-flex align-items-center">
                    <label for="salario" class="form-label mb-0 me-3 text-nowrap">Salario (€):</label>
                    <input type="number" id="salario" v-model="empleado.salario"
                        class="form-control rounded-0 shadow-none border text-end" required />
                </div>
            </div>

            <!-- FILA: Imagen del empleado -->
            <div class="row g-3 align-items-center mt-3">
                <div class="col-12 col-md-6 d-flex align-items-center">
                    <label for="foto" class="form-label mb-0 me-2 text-nowrap">Foto del Empleado:</label>
                    <input type="file" id="foto" accept="image/*" @change="onFileChange"
                        class="form-control-file col-md-10 border rounded-0 shadow-none" />
                </div>
                <div v-if="previewUrl" class="col-12 col-md-3">
                    <img :src="previewUrl" alt="Preview" class="img-thumbnail" style="max-height: 120px;" />
                </div>
            </div>

            <!-- Botones -->
            <div class="d-flex align-items-center justify-content-center gap-3 mt-4">
                <button class="btn btn-primary rounded border shadow-none px-4" type="submit">
                    <i class="bi bi-save me-1"></i> Guardar
                </button>
                <button class="btn btn-secondary rounded border shadow-none px-4" type="button" @click="limpiarFormulario">
                    <i class="bi bi-eraser me-1"></i> Limpiar
                </button>
            </div>
        </form>

        <!-- Tabla de empleados -->
        <div class="table-responsive mt-4">
            <h4 class="text-center mb-1" style="color: #1F2937;">Listado de Empleados</h4>
            <table class="table table-bordered table-striped table-sm table-hover align-middle table-primary">
                <thead>
                    <tr class="table-primary text-center">
                        <th>Foto</th>
                        <th>Nombre</th>
                        <th>DNI</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Puesto</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="emp in empleados" :key="emp._id" class="text-center">
                        <td>
                            <img v-if="emp.imagen" :src="urlImagen(emp.imagen)" alt="foto"
                                style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;" />
                            <i v-else class="bi bi-person-circle fs-4"></i>
                        </td>
                        <td>{{ emp.nombre }} {{ emp.apellidos }}</td>
                        <td>{{ emp.dni }}</td>
                        <td>{{ emp.email }}</td>
                        <td>{{ emp.telefono }}</td>
                        <td>{{ emp.puesto }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref, onMounted } from "vue";
import axios from "axios";

const API_URL = "http://localhost:5000/api/empleados";

const empleados = ref([]);

const empleado = ref({
    nombre: "",
    apellidos: "",
    dni: "",
    email: "",
    telefono: "",
    puesto: "",
    fechaAlta: "",
    salario: "",
});

const archivo = ref(null);
const previewUrl = ref(null);

onMounted(async () => {
    cargarEmpleados();
});

const cargarEmpleados = async () => {
    try {
        const res = await axios.get(API_URL);
        empleados.value = res.data;
    } catch (err) {
        console.error("Error al cargar empleados:", err);
    }
};

const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        archivo.value = file;
        previewUrl.value = URL.createObjectURL(file);
    }
};

const urlImagen = (ruta) => {
    if (!ruta) return "";
    return `http://localhost:5000${ruta}`;
};

const guardarEmpleado = async () => {
    if (!empleado.value.nombre || !empleado.value.apellidos || !empleado.value.email) {
        Swal.fire({ icon: "error", title: "Campos obligatorios", text: "Nombre, apellidos y email son obligatorios." });
        return;
    }

    try {
        const formData = new FormData();
        if (archivo.value) {
            formData.append("imagen", archivo.value);
        }
        formData.append("empleado", JSON.stringify(empleado.value));

        const res = await axios.post(API_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data && res.data._id) {
            Swal.fire({ icon: "success", title: "Empleado guardado", timer: 2000, showConfirmButton: false });
            cargarEmpleados();
            limpiarFormulario();
        }
    } catch (err) {
        console.error("Error al guardar empleado:", err);
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar el empleado." });
    }
};

const limpiarFormulario = () => {
    Object.assign(empleado.value, {
        nombre: "",
        apellidos: "",
        dni: "",
        email: "",
        telefono: "",
        puesto: "",
        fechaAlta: "",
        salario: "",
    });
    archivo.value = null;
    previewUrl.value = null;
};
</script>

<style scoped>
.table-primary th {
    background-color: #2563EB !important;
    color: white !important;
}
</style>
