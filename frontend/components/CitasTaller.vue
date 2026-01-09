<template>
    <div class="container-fluid my-1 p-3 border rounded-3 shadow-sm bg-light">
        <!-- Título principal -->
        <h3 class="text-center mt-2 mb-3 d-flex align-items-center justify-content-center" style="color: #7a0f16;">
            <i class="bi bi-person-gear me-2"></i>Lista de Citas
        </h3>

        <!-- Botón para limpiar formulario -->
        
        <div class="d-flex justify-content-end">
            <button type="button"
                class="btn border border-primary border-2 rounded-0 text-primary shadow-none mt-2 me-2"
                style="--bs-btn-hover-bg: var(--bs-primary-bg-subtle)" @click="limpiarPagina"
                title="Limpiar formulario">
                <i class="bi bi-arrow-counterclockwise"></i>
            </button>
        </div>

        <!-- Formulario para añadir o modificar citas -->
        <form @submit.prevent="guardarCita" class="mb-4">
            <div class="row g-3 align-items-end mb-3 d-flex justify-content-between me-5 ms-5">
                <!-- Campo de matricula -->
                <div class="col-md-3">
                    <label for="matricula" class="form-label">Matricula</label>
                    <input type="text"
                        class="form-control"
                        id="matricula"
                        pattern="[0-9]{4}[A-Za-z]{3}"
                        v-model="nuevaCita.matricula" 
                        required />
                </div>

                <!-- Campo de movil -->
                <div class="col-md-3 me-5">
                    <label for="movil" class="form-label">Movil</label>
                    <input type="text" 
                    class="form-control" 
                    id="movil" 
                    pattern="[0-9]{9}"
                    v-model="nuevaCita.movil" 
                    required>
                    </input>
                </div>

                <!-- Campo de fecha de entrada -->
                <div class="col-md-2 me-5">
                    <label for="fechaCita" class="form-label">Fecha Cita</label>
                    <input type="date" 
                    class="form-control w-auto" 
                    id="fechaCita"
                    v-model="nuevaCita.fechaCita"
                    required />
                </div>
            </div>
            <div class="row g-3 align-items-end d-flex justify-content-between ms-5 me-4">
                <!-- Campo de genero-->
                <div class="col-md-3">
                    <label>Estado cita:</label>
                    <div class="col-md-3  d-flex gap-4">
                        <div>
                            <label for="estadoCita">Pendiente
                                <input type="radio" v-model="nuevaCita.estadoCita" class="form-input"
                                    value="Pendiente" required/></label>
                        </div>
                        <div>
                            <label for="estadoCita">Finalizado
                                <input type="radio" v-model="nuevaCita.estadoCita" class="form-input"
                                    value="Finalizado" required/></label>
                        </div>
                    </div>
                </div>
            <!-- Servicio que necesita-->
                <div class="col-md-3 ms-5 ">
                    <label for="servicioTaller" class="form-label ms-2
                    ">Concesionario </label>
                    <select id="servicioTaller"
                     v-model="nuevaCita.servicioTaller" 
                     class="form-select ms-2"
                     required>
                        <option disabled value="">Selecciona un servicio</option>
                        <option v-for="servicio in listaServicios" :key="servicio"
                            :value="servicio">
                            {{ servicio }}
                        </option>
                    </select>
                </div>
                <!-- Acepta -->
                <div class="col-md-3 ms-5 me-3 form-check">
                    <label for="acepta" class="form-label ms-5">Acepta:</label>
                    <div class="col-md-3 ms-5" >
                        <input type="checkbox" 
                        class="form-check-input align-center ms-0" 
                        id="acepta"
                        v-model="nuevaCita.acepta" />
                    </div>
        </div>
                <!-- Botón de acción: Añadir o Modificar -->
                <div class="flex-grow-1 d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary mt-3">
                        {{ editando ? "Modificar" : "Añadir" }}
                    </button>
                </div>
            </div>
        </form>

        <!-- Tabla que muestra la lista de citas cargados -->
        <table class="table table-bordered table-striped table-hover table-sm align-middle table-responsive">
            <thead class="thead-dark table-primary text-center">
                <tr>
                    <th>id</th>
                    <th>Fecha Cita</th>
                    <th>Matrícula</th>
                    <th>Movil</th>
                    <th>Servicio</th>
                    <th>Estado</th>  
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr class="text-center" v-for="cita in citas" :key="cita.id">
                    <td>{{ cita.id }}</td>
                    <td>{{ formatearFecha(cita.fechaCita) }}</td>
                    <td>{{ cita.matricula }}</td>
                    <td>{{ cita.movil}}</td>
                    <td>{{ cita.servicioTaller}}</td>
                    <td>{{ cita.estadoCita}}</td>
                    <td class="align-middle text-center">
                        <!-- Botón para eliminar una cita -->
                        <button class="btn btn-danger btn-sm border-0 ms-2 me-2 shadow-none rounded-0"
                            @click="borrarCita(cita.id)">
                            <i class="bi bi-trash"></i>
                        </button>

                        <!-- Botón para editar una cita -->
                        <button class="btn btn-warning btn-sm shadow-none rounded-0"
                            @click="editarCita(cita.id)">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import {addCita, updateCita, deleteCita, getCita} from '../api/taller'
import Swal from "sweetalert2";

const citas = ref([])
const nuevaCita = ref({
    matricula: "",
    movil: "",
    fechaCita: "",
    servicioTaller: "",
    estadoCita: "",
    acepta: false
})
const listaServicios = [
    "revisión",
    "preITV",
    "neumáticos",
    "frenos",
    "cambios de aceite"
]

const editando = ref(false)
const citaEditandoId = ref("")


async function cargarCita() {
    try {
        Swal.fire({
            icon: 'success',
            title: "Listando Citas..",
            showConfirmButton: false,
            timer: 1500
        });
        citas.value = await getCita()
    } catch (error) {
        console.error("Error al cargar las citas", error)
    }
}

onMounted(async () => {
    await cargarCita()
})

async function guardarCita() {
    if (!nuevaCita.value.matricula.trim() || !nuevaCita.value.movil.trim() || !nuevaCita.value.servicioTaller.trim()|| !nuevaCita.value.estadoCita.trim()) {
        alert("Rellena todos los campos")
        return
    }

    if (!nuevaCita.value.acepta) {
      Swal.fire({
        icon: 'warning',
        title: 'Debes aceptar antes de guardar',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (!editando.value) {
    const duplicado = citas.value.find(
      (cita) =>
        cita.movil === nuevaCita.value.movil
    );
    if (duplicado) {
      Swal.fire({
        icon: "error",
        title: "Cliente duplicado ",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
}
    const result = await Swal.fire({
        title: editando.value
            ? "¿Desea modificar este vendedor?"
            : "¿Desea añadir este vendedor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: editando.value ? "Modificar" : "Grabar",
        cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
        return
    }

    if (editando.value) {
        const index = citas.value.findIndex((cita) => cita.id === citaEditandoId.value)
        if (index !== -1) {
            citas.value[index] = { ...nuevaCita.value }
        }
        try {
            await updateCita(citaEditandoId.value, nuevaCita.value)
            Swal.fire({
                icon: "success",
                title: "Cita actualizada",
                showConfirmButton: false,
                timer: 1500,
            });
            limpiarPagina()

        } catch (error) {
            console.error("Ha sucedido un error al actualizar", error)
            Swal.fire({
                icon: "error",
                title: "Error al actualizar la cita",
                text: "Inténtalo más tarde",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    } else {
        const citaNueva = {
            id: String(citas.value.length > 0 ? citas.value.length + 1 : 1),
            matricula: nuevaCita.value.matricula.toUpperCase(),
            movil: nuevaCita.value.movil,
            fechaCita: nuevaCita.value.fechaCita,
            servicioTaller: nuevaCita.value.servicioTaller,
            estadoCita: nuevaCita.value.estadoCita,
            acepta: nuevaCita.value.acepta,
        }

        try {
            await addCita(citaNueva)
            citas.value.push(citaNueva)
            Swal.fire({
                icon: "success",
                title: "Cita añadida",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error("Error al añadir la cita", error)
            Swal.fire({
                icon: "error",
                title: "Error al añadir la cita",
                text: "Inténtalo más tarde",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }
    limpiarPagina()
    
}
async function borrarCita(id) {
    try {
        const result = await Swal.fire({
        title: "¿Está seguro que quiere eliminar esta cita?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar" 
    })
    if (!result.isConfirmed) {
        return
    }
    await deleteCita(id)
    citas.value = citas.value.filter((cita) => cita.id !== id)
    Swal.fire({
                icon: "success",
                title: "Cita eliminada",
                showConfirmButton: false,
                timer: 1500,
            });
    } catch (error) {
        console.error("Error al eliminar la cita", error)
            Swal.fire({
                icon: "error",
                title: "Error al eliminar la cita",
                text: "Inténtalo más tarde",
                showConfirmButton: false,
                timer: 1500,
            });
    }
}

async function editarCita(id) {
    editando.value = true
    nuevaCita.value = {...citas.value.find((cita) => cita.id === id)}
    citaEditandoId.value = id
}


function limpiarPagina() {
        nuevaCita.value = {
        matricula: "",
        movil: "",
        fechaCita: "",
        servicioTaller: "",
        estadoCita: "",
        acepta: false
    };
    editando.value = false;
    citaEditandoId.value = "";
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return "";
  const [year, month, day] = fechaISO.split("-");
  return `${day}-${month}-${year}`;
}



</script>
<style scoped>
.table-primary th {
  background-color:   #f59191 !important;
  color: black !important;
}
</style>