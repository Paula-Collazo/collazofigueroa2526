<template>
  <!--Botón centrado-->

  <div
    class="mx-auto mt-2 p-4 pb-5 border rounded-3 shadow-sm min-vh-75" style="background-color: #F4F6F8;">
    <h3 class="text-center mt-2 mb-3 d-flex align-items-center justify-content-center" 
    style="color: #1F2937;">
      <i class="bi bi-person-circle fs-3 me-2"></i>
      Gestión de Clientes
    </h3>
    <!-- Formulario -->
    <form @submit.prevent="guardarCliente" class="mb-4">
      <!-- DNI con validación visual -->
      <div class="mb-3 row align-items-center">
        <!-- Columna DNI -->
        <div class="col-md-4 d-flex align-items-center">
          <label for="dni" class="form-label mb-0 w-25">DNI: </label>
          <div class="flex-grow-1 d-flex">
            <input
              type="text"
              id="dni"
              v-model="nuevoCliente.dni"
              @blur="validarDni"
              class="form-control w-auto"
                :class="[
                { 'is-invalid': !dniValido },
                { 'readonly-input': editando },
              ]"
              :readonly="editando"
              required
            />
			      <button
              type="button"
              class="btn btn-secondary ms-3"
              @click="buscarClientePorDNI(nuevoCliente.dni)"
              :disabled="editando"
              :aria-disabled="String(editando)">
              
              <i class="bi bi-search"></i>
            </button>
            <div v-if="!dniValido" class="invalid-feedback">
              DNI o NIE inválido.
            </div>
          </div>
        </div>

        <div class="col-md-3 d-flex align-items-center justify-content-center">
        <label>Tipo de Cliente:</label>
        <div class="ms-3">
          <label for="radio-empresa">Empresa:</label>
          <input type="radio" id="radio-empresa" value="empresa" name="radio" class="ms-2" v-model="nuevoCliente.tipoCliente" required/>
        </div>

        <div class="ms-3">
          <label for="radio-particular">Particular:</label>
          <input type="radio" id="radio-particular" value="particular" name="radio" class="ms-2" v-model="nuevoCliente.tipoCliente" required/>
        </div>
      </div>

        <!-- Columna Fecha de Alta a la derecha -->
        <div class="col-md-4 d-flex align-items-center justify-content-end ms-4">
        <label for="fecha_alta" class="form-label me-2 mb-0 text-nowrap">
          Fecha de Alta:
        </label>

        <input
          type="date"
          id="fecha_alta"
          v-model="nuevoCliente.fecha_alta"
          @change="onFechaChange"
          class="form-control w-auto me-5"
          required
        />

        <!-- botón limpiar cambios -->
        <button
          type="button"
          class="btn btn-secondary btn-sm d-flex align-items-center justify-content-center  "
          @click="limpiarCampos"
          title="Reiniciar campos"
        >
          <i class="bi bi-arrow-clockwise fs-5"></i>
        </button>
      </div>
      </div>

      <!-- Nombre y Apellidos -->
      <div class="mb-3 row g-3 align-items-center ">
        <!-- Nombre -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="nombre" class="form-label mb-0 text-nowrap w-25"
            >Nombre:</label
          >
          <input
            type="text"
            id="nombre"
            v-model="nuevoCliente.nombre"
            class="form-control flex-grow-1"
            @blur="capitalizarNombre"
            required
          />
        </div>

        <!-- Apellidos -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="apellidos" class="form-label tamano-label mb-0 ms-5 text-nowrap"
            >Apellidos:</label
          >
          <input
            type="text"
            id="apellidos"
            v-model="nuevoCliente.apellidos"
            class="form-control flex-grow-1"
            @blur="capitalizarApellidos"
            required
          />
        </div>
      </div>

      <!-- Email y Móvil -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Email -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="email" class="form-label mb-0 text-nowrap w-25"
            >Email:</label
          >
          <input
            type="email"
            id="email"
            v-model="nuevoCliente.email"
            class="form-control flex-grow-1"
            @blur="validarEmail"
            :class="{ 'is-invalid': !emailValido }"
            required
          />
        </div>

        <!-- Móvil -->
        <div class="col-md-3 d-flex align-items-center ">
          <label for="movil" class="form-label tamano-label ms-5 mb-0 text-nowrap"
            >Móvil:</label
          >
          <input
            type="tel"
            id="movil"
            v-model="nuevoCliente.movil"
            @blur="validarMovil"
            class="form-control flex-grow-1 text-center"
            :class="{ 'is-invalid': !movilValido }"
          />
        </div>
      </div>

      <!-- Dirección, Provincia y Municipio -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Dirección -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="direccion" class="form-label mb-0 w-25 text-nowrap"
            >Dirección:</label
          >
          <input
            type="text"
            id="direccion"
            v-model="nuevoCliente.direccion"
            class="form-control flex-grow-1"
          />
        </div>

        <!-- Provincia -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="provincia" class="form-label tamano-label ms-5 mb-0 text-nowrap"
            >Provincia:</label
          >
          <select
            id="provincia"
            v-model="nuevoCliente.provincia"
            class="form-select flex-grow-1 w-25"
            @change="filtrarMunicipios"
          >
            <option disabled value="">Seleccione provincia</option>
            <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">
              {{ prov.nm }}
            </option>
          </select>
        </div>

        <!-- Municipio -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="municipio" class="form-label me-2 ms-4 mb-0 text-nowrap"
            >Municipio:</label
          >
          <select
            id="municipio"
            v-model="nuevoCliente.municipio"
            class="form-select flex-grow-1 w-auto"
          >
            <option disabled value="">Seleccione municipio</option>
            <option
              v-for="mun in municipiosFiltrados"
              :key="mun.id"
              :value="mun.nm"
            >
              {{ mun.nm }}
            </option>
          </select>
        </div>
      </div>

      <!-- Aviso Legal -->

      <!-- Contraseña -->
      <div class="row mb-3" >
        <div class="row g-2 justify-content-center mt-2">
          <div class="col-md-3 d-flex mt-3 align-items-center">
            <label class="me-2 mb-0 text-nowrap align-middle"
              >Contraseña:</label
            >
            <input
              type="password"
              v-model="nuevoCliente.password"
              class="form-control"
              :disabled="isAdmin"
              required
            />
          </div>

          <!-- Repetir contraseña -->
          <div class="col-md-3 d-flex mt-3 align-items-center ms-5">
            <label class="me-2 mb-0 text-nowrap align-middle"
              >Repetir Contraseña:</label
            >
            <input
              type="password"
              v-model="nuevoCliente.password2"
              class="form-control"
              :disabled="isAdmin"
              required
            />
          </div>
        </div>
      </div>

      <div class="d-flex align-items-center mt-3">
      <div class="flex-grow-1 d-flex justify-content-center">
        <input
          type="checkbox"
          id="avisoLegal"
          v-model="nuevoCliente.lopd"
          class="form-check-input me-2"
          required
        />
        <label for="avisoLegal" class="form-check-label">
          He leído y acepto el
          <a href="/AvisoLegal" target="_blank">Aviso Legal</a>.
        </label>
      </div>
    </div>

      <!-- Botón centrado y checkbox al final -->
      <div class="d-flex justify-content-between mt-3">
        <div class="form-check form-switch ms-3 invisible">
          <input
            type="checkbox"
            v-model="mostrarHistorico"
            class="form-check-input"
            @change="cargarClientes"
          />
          <label for="historico" class="form-check-label ms-2">Histórico</label>
        </div>

        
        <!-- Espacio izquierdo para centrar el botón -->
        <div class="flex-grow-1 d-flex justify-content-center">
          <button type="submit" class="btn btn-primary px-4" :disabled="!nuevoCliente.lopd">
            {{ editando ? "Modificar" : "Guardar" }}
          </button>
          
          <!-- ============================================
          BOTÓN DE IMPRIMIR (COMENTADO)
          ============================================
          <button type="button" class="btn btn-dark ms-2" @click="imprimirDatosCliente">
            <i class="bi bi-printer"></i> Imprimir
          </button>
          ============================================ -->
          
          <!-- ============================================
          BOTÓN DE SUBIR FOTO (COMENTADO)
          ============================================
          <div class="ms-2">
            <label for="inputFoto" class="btn btn-secondary mb-0">
              <i class="bi bi-upload"></i> Subir Foto
            </label>
            <input 
              type="file" 
              id="inputFoto" 
              accept="image/*" 
              class="d-none"
              @change="subirFoto"
            />
          </div>
          ============================================ -->
          
        </div>

        <!-- Checkbox al final -->
        <div class="form-check form-switch ms-3" v-if="isAdmin">
          <input
            type="checkbox"
            id="historico"
            v-model="mostrarHistorico"
            class="form-check-input"
            @change="cargarClientes"
          />
          <label for="historico" class="form-check-label ms-2">Histórico</label>
        </div>
      </div>
    </form>
    <!-- Lista de Clientes -->
    <div class="table-responsive" v-if="isAdmin">
      <h4 class="text-center w-100 ">Listado Clientes</h4>
      <table class="table table-bordered table-striped w-100 aling-middle">
        <thead class="table-primary">
          <tr>
            <th class="text-center">ID</th>
            <th class="text-center">Apellidos</th>
            <th class="text-center">Nombre</th>
            <th class="text-center">Móvil</th>
            <th class="text-center">Municipio</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cliente, index) in clientesPaginados" :key="cliente.id || index">
            <th scope="row" class="text-center py-1">{{ (currentPage - 1 ) * clientesPorPage + index +1 }}</th>
            <td class="py-1">{{ cliente.apellidos }}</td>
            <td class="py-1">{{ cliente.nombre }}</td>
            <td class="text-center py-1">{{ cliente.movil }}</td>
            <td class="text-center py-1">{{ cliente.municipio }}</td>
            <td class="align-middle text-center py-1">
              <button
                @click="eliminarCliente(cliente.movil)"
                class="btn btn-danger btn-sm me-2"
              >
                <i class="bi bi-trash"></i>
              </button>
              <button
                @click="editarCliente(cliente.movil)"
                class="btn btn-warning btn-sm"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                v-if="!cliente.historico"
                @click="activarCliente(cliente)"
                class="btn btn-secondary btn-sm ms-2 border-0 shadow-none rounded-0"
                title="Activar cliente"
              >
                <i class="bi bi-person-check"></i>
              </button>
			  
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- Navegación de página-->
  <div class="d-flex justify-content-center my-3" v-if="isAdmin">
        <button class="btn btn-outline-primary btn-sm me-2 rounded-0 border-1 shadow-none" 
        @click = "beforePagina" :disabled="currentPage <= 1">
          <i class="bi bi-chevron-left "></i>
        </button>
        <span class="mx-3 align-self-center text-muted">Página {{ currentPage  }}</span>
        <button class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none" 
        @click="nextPagina" :disabled="currentPage >= totalPages">
         <i class="bi bi-chevron-right "></i>
        </button>
       </div>
</template>

<script setup>
import provmuniData from "@/data/provmuni.json";
import { ref, onMounted, computed } from "vue";
import {
  getClientes,
  deleteCliente,
  addCliente,
  updateCliente,
  getClientePorDni
} from "@/api/clientes.js";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";
import { esAdmin } from "../api/authApi";
//import { ref } from 'vue';

//SCRIPT CRUD


const nuevoCliente = ref({
  dni: "",
  nombre: "",
  apellidos: "",
  email: "",
  movil: "",
  direccion: "",
  provincia: "",
  municipio: "",
  fecha_alta: "",
  historico: true,
  lopd: false, // aceptación del aviso legal (L.O.P.D.)
  tipoCliente: "",
  tipo: "user",
  password: "",
  password2: ""
});

// Validación contraseña
const passwordValido = ref(true);



const editando = ref(false);
const clienteEditandoId = ref(null);
const mostrarHistorico = ref(false);
const clientes = ref([]);
const numClientes = ref(0);
const currentPage = ref(1);
const clientesPorPage = 10;
let totalPages = 0;
const isAdmin = ref(false);
const isLogueado = ref(false);

/// zona CargarClientes

// Zona Cargar clientes Al Montar el componente
onMounted(async () => {
  const response = await esAdmin()
  isAdmin.value = response.esAdmin
  const token = sessionStorage.getItem('token')
  if (!token) {
    isLogueado.value = false;
  } else {
    isLogueado.value = true;
  }
  console.log(isAdmin.value)
  if (isAdmin.value) await cargarClientes()
  if (isLogueado.value == true) {
    const cliente = await getClientePorDni(sessionStorage.getItem('dni'))
    nuevoCliente.value = {
        dni: cliente.dni,
        nombre: cliente.nombre,
        apellidos: cliente.apellidos,
        email: cliente.email,
        movil: cliente.movil,
        direccion: cliente.direccion,
        provincia: cliente.provincia,
        municipio: cliente.municipio,
        fecha_alta: cliente.fecha_alta,
        historico: cliente.historico,
        lopd: cliente.lopd,
        tipoCliente: cliente.tipoCliente,
        tipo: cliente.tipo
    };
    editando.value = true
    clienteEditandoId.value = cliente.id
  }
  totalPages = Math.ceil(numClientes.value / clientesPorPage); 
  currentPage.value = 1;
});

///avanzar y retroceder
 
// Métodos de paginación
const beforePagina = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPagina = () => {
  totalPages = Math.ceil(numClientes.value / clientesPorPage);
  //redondear hacia arriba para mostrar la última página aunque no esté completa
  if (currentPage.value < totalPages) {
    currentPage.value++;
  }
};

// Propiedad computada para obtener los clientes en la página actual
// computed crea una propiedad reactiva que se actualiza automáticamente
// cuando cambian las dependencias (currentPage o clientes) 
// es decir paso pagina o vuelvo atrás cargando los clientes de esa página
// slice extrae una sección del array clientes
// start es el índice inicial y end el índice final (no incluido)

const clientesPaginados = computed(() => {
  const start = (currentPage.value - 1) * clientesPorPage;
  const end = start + clientesPorPage;
  return clientes.value.slice(start, end);
});


const cargarClientes = async() => {

      clientes.value = await getClientes(mostrarHistorico.value)
        numClientes.value = clientes.value.length;  // Actualiza el nº total de clientes
        currentPage.value = 1;  // Reiniciar a la 1era página al cargar
      Swal.fire({
        icon: 'success',
        title: "Listando Clientes...",
        showConfirmButton: false,
        timer: 1500
        });
    }
const guardarCliente = async () => {
  
    validarDni();
    validarEmail();
    validarMovil();

    if (!dniValido.value || !emailValido.value || !movilValido.value) {
      Swal.fire({
        icon: "error",
        title: "Hay campos inválidos",
        text: "Corrija DNI, móvil o email antes de guardar",
        showConfirmButton: true,
      });
      return; // Salir de la función si hay errores
    }

    // Antes de guardar, el usuario debe haber aceptado el Aviso Legal
    if (!nuevoCliente.value.lopd) {
      Swal.fire({
        icon: 'warning',
        title: 'Debes aceptar el Aviso Legal antes de guardar',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

  // Validar contraseña: mínimo 6 caracteres y que coincidan
  if (!editando.value) { // solo validar en creación (opcional)
    const pw = nuevoCliente.value.password || "";
    const pw2 = nuevoCliente.value.password2 || "";
    if (pw.length < 6 || pw !== pw2) {
      passwordValido.value = false;
      Swal.fire({
        icon: "error",
        title: "Contraseñas inválidas",
        text: "La contraseña debe tener al menos 6 caracteres y coincidir en ambos campos.",
      });
      return;
    } else {
      passwordValido.value = true;
    }
  }

  // Asegurar que antes de guardar la fecha de alta esté en formato dd/mm/yyyy
  if (nuevoCliente.value.fecha_alta.includes("/")){
    nuevoCliente.value.fecha_alta = nuevoCliente.value.fecha_alta
    ? formatearFechaParaInput(nuevoCliente.value.fecha_alta)
    : nuevoCliente.value.fecha_alta;
  }
  // Validar duplicados solo si estás creando (no si editando)
  if (!editando.value) {
    const duplicado = clientes.value.find(
      (cliente) =>
        cliente.dni === nuevoCliente.value.dni ||
        cliente.movil === nuevoCliente.value.movil ||
        cliente.email === nuevoCliente.value.email
    );
    if (duplicado) {
      Swal.fire({
        icon: "error",
        title: "DNI, móvil o email duplicados",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
  }

  // Confirmación antes de guardar
  const result = await Swal.fire({
    title: editando.value
      ? "¿Desea modificar este cliente?"
      : "¿Desea grabar este cliente?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: editando.value ? "Modificar" : "Grabar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    // Hashear contraseña antes de guardar
    if (nuevoCliente.value.password) {
      const salt = bcrypt.genSaltSync(10);
      nuevoCliente.value.password = bcrypt.hashSync(nuevoCliente.value.password, salt);
      // Limpiar password2 después de hashear
      delete nuevoCliente.value.password2;
    }

    if (editando.value) {
      // Modificar cliente (PUT)
      const clienteActualizado = await updateCliente(
        clienteEditandoId.value,
        nuevoCliente.value
      );
      // Actualiza el cliente en la lista local
      const index = clientes.value.findIndex(
        (c) => c.id === clienteEditandoId.value
      );
      if (index !== -1) clientes.value[index] = clienteActualizado;
      Swal.fire({
        icon: "success",
        title: "Cliente modificado",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      // Agregar cliente (POST)
      const clienteAgregado = await addCliente(nuevoCliente.value);
      clientes.value.push(clienteAgregado);
      Swal.fire({
        icon: "success",
        title: "Cliente agregado",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    // Reset formulario y estado
    // nuevoCliente.value = {
    //   dni: '',
    //   nombre: '',
    //   apellidos: '',
    //   email: '',
    //   movil: '',
    //   direccion: '',
    //   provincia: '',
    //   municipio: '',
    //   fecha_alta: '',
    //   historico: true
    // };
    if (!editando.value) {
      limpiarCampos()
    } else {
      nuevoCliente.value.password = "";
    }
    editando.value = false;
    clienteEditandoId.value = null;

    // Reset validaciones si tienes (dniValido, movilValido, etc)
    dniValido.value = true;
    movilValido.value = true;
    emailValido.value = true;

    // Refrescar lista completa (opcional)
    clientes.value = await getClientes();
  } catch (error) {
    console.error("Error al guardar cliente:", error);
    Swal.fire({
      icon: "error",
      title: "Error al guardar cliente",
      text: "Inténtelo de nuevo o contacte con el administrador.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

/* ============================================
   FUNCIÓN IMPRIMIR DATOS DEL CLIENTE (COMENTADA)
   ============================================
   
// Función para imprimir los datos del cliente actual en PDF
const imprimirDatosCliente = () => {
  // Importar jsPDF: import { jsPDF } from "jspdf"
  const doc = new jsPDF();
  
  // Título del documento
  doc.setFontSize(18);
  doc.text("Ficha de Cliente", 105, 20, { align: "center" });
  
  // Línea decorativa
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);
  
  // Datos del cliente
  doc.setFontSize(12);
  let y = 40;
  
  doc.text(`DNI: ${nuevoCliente.value.dni || 'N/A'}`, 20, y);
  y += 10;
  doc.text(`Nombre: ${nuevoCliente.value.nombre || 'N/A'}`, 20, y);
  y += 10;
  doc.text(`Apellidos: ${nuevoCliente.value.apellidos || 'N/A'}`, 20, y);
  y += 10;
  doc.text(`Email: ${nuevoCliente.value.email || 'N/A'}`, 20, y);
  y += 10;
  doc.text(`Móvil: ${nuevoCliente.value.movil || 'N/A'}`, 20, y);
  y += 10;
  doc.text(`Dirección: ${nuevoCliente.value.direccion || 'N/A'}`, 20, y);
  y += 10;
  doc.text(`Provincia: ${nuevoCliente.value.provincia || 'N/A'}`, 20, y);
  y += 10;
  doc.text(`Municipio: ${nuevoCliente.value.municipio || 'N/A'}`, 20, y);
  y += 10;
  doc.text(`Tipo de Cliente: ${nuevoCliente.value.tipoCliente || 'N/A'}`, 20, y);
  y += 10;
  doc.text(`Fecha de Alta: ${nuevoCliente.value.fecha_alta || 'N/A'}`, 20, y);
  
  // Guardar PDF
  const fecha = new Date().toISOString().split("T")[0];
  doc.save(`cliente_${nuevoCliente.value.dni || 'sin_dni'}_${fecha}.pdf`);
};

============================================ */

/* ============================================
   FUNCIÓN SUBIR FOTO DEL CLIENTE (COMENTADA)
   ============================================

// Variable reactiva para almacenar la foto
// const fotoCliente = ref(null);
// const previewFoto = ref('');

// Función para manejar la subida de foto
const subirFoto = (event) => {
  const archivo = event.target.files[0];
  
  // Validar que sea una imagen
  if (!archivo || !archivo.type.startsWith('image/')) {
    Swal.fire({
      icon: 'error',
      title: 'Archivo no válido',
      text: 'Por favor, seleccione una imagen válida (JPG, PNG, GIF)',
      showConfirmButton: true
    });
    return;
  }
  
  // Validar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB en bytes
  if (archivo.size > maxSize) {
    Swal.fire({
      icon: 'error',
      title: 'Archivo demasiado grande',
      text: 'El tamaño máximo permitido es 5MB',
      showConfirmButton: true
    });
    return;
  }
  
  // Guardar el archivo
  fotoCliente.value = archivo;
  
  // Crear preview de la imagen
  const reader = new FileReader();
  reader.onload = (e) => {
    previewFoto.value = e.target.result;
  };
  reader.readAsDataURL(archivo);
  
  Swal.fire({
    icon: 'success',
    title: 'Foto cargada correctamente',
    showConfirmButton: false,
    timer: 1500
  });
};

============================================ */

// Funcion Eliminar Cliente con patch (histórico a false)
const eliminarCliente = async (movil) => {
  // Refrescar lista desde la API
  clientes.value = await getClientes();
  // Buscar cliente completo (que incluye el ID)
  const clienteAEliminar = clientes.value.find(
    (cliente) => cliente.movil === movil
  );

  if (!clienteAEliminar) {
    Swal.fire({
      icon: "error",
      title: "Cliente no encontrado",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  // Pedir confirmación antes de eliminar
  const result = await Swal.fire({
    title: `¿Eliminar al cliente ${clienteAEliminar.nombre} ${clienteAEliminar.apellidos}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  // Si no confirma, salir
  if (!result.isConfirmed) return;

  // Si confirma, eliminar cliente usando la API y movil como ID
  await deleteCliente(clienteAEliminar.id);
  // Refrescar la lista desde la "API"
  clientes.value = await getClientes();

  Swal.fire({
    icon: "success",
    title: "Cliente eliminado",
    showConfirmButton: false,
    timer: 1500,
  });
};

// Función Editar Cliente (carga datos en el formulario)
const editarCliente = (movil) => {
  const cliente = clientes.value.find((c) => c.movil === movil);
  if (!cliente) {
    Swal.fire({
      icon: "error",
      title: "Cliente no encontrado",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  // Detectar si fecha ya está en ISO o no, y convertir solo si es necesario
  let fechaFormateada = cliente.fecha_alta;
  if (fechaFormateada && fechaFormateada.includes("/")) {
    fechaFormateada = formatearFechaParaInput(fechaFormateada);
  }
  nuevoCliente.value = { ...cliente, fecha_alta: fechaFormateada };
  editando.value = true;
  filtrarMunicipios();
  nuevoCliente.value.municipio = cliente.municipio;
  nuevoCliente.value.password = "";
  clienteEditandoId.value = cliente.id;
};

// Función para activar cliente (poner historico en true)
const activarCliente = async (cliente) => {
  const confirmacion = await Swal.fire({
    title: `¿Activar cliente ${cliente.nombre} ${cliente.apellidos}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Activar",
    cancelButtonText: "Cancelar",
  });

  if (!confirmacion.isConfirmed) return;

  try {
    // Crear una copia del cliente con historico en true
    const clienteActivado = { ...cliente, historico: true };

    // Llamar a la API para actualizar
    const actualizado = await updateCliente(cliente.id, clienteActivado);

    // Actualizar la lista local (opcional, también puedes volver a cargar todo)
    const index = clientes.value.findIndex((c) => c.id === cliente.id);
    if (index !== -1) {
      clientes.value[index] = actualizado;
    }

    Swal.fire({
      icon: "success",
      title: "Cliente reactivado",
      showConfirmButton: false,
      timer: 1500,
    });

    // Recargar lista actualizada
    await cargarClientes();
  } catch (error) {
    console.error("Error al reactivar cliente:", error);
    Swal.fire({
      icon: "error",
      title: "Error al activar cliente",
      text: "Por favor, intenta de nuevo.",
      timer: 1500,
    });
  }
};
//SCRIPT AUXILIARES

// Estado de validez del DNI/NIE si la estructura de datos es más compleja se usa reactive
const dniValido = ref(true); // Por defecto es válido y no muestra error al iniciar

// Función para validar DNI y NIE
const validarDniNie = (valor) => {
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

  valor = valor.toUpperCase();

  if (dniRegex.test(valor)) {
    const numero = parseInt(valor.slice(0, 8), 10);
    const letra = valor.charAt(8);
    return letra === letras[numero % 23]; //sale con true si es válido
  } else if (nieRegex.test(valor)) {
    const nie = valor.replace("X", "0").replace("Y", "1").replace("Z", "2");
    const numero = parseInt(nie.slice(0, 8), 10);
    const letra = valor.charAt(8);
    return letra === letras[numero % 23]; //sale con true si es válido
  }
  return false;
};

// Validar al salir del campo
const validarDni = () => {
  nuevoCliente.value.dni = nuevoCliente.value.dni.trim().toUpperCase();
  dniValido.value = validarDniNie(nuevoCliente.value.dni);
};

// control email

const emailValido = ref(true);
const validarEmail = () => {
  const email = nuevoCliente.value.email.trim();

  if (email === "") {
    emailValido.value = true; // Vacío = válido (opcional)
    return true;
  }

  // Expresión simple para email válido
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  emailValido.value = regex.test(email);
};

// Control móvil
const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;

const validarMovil = () => {
  const movil = nuevoCliente.value.movil.trim();

  if (movil === "") {
    movilValido.value = true; // Vacío = válido (opcional)
    return true;
  }

  if (movil.charAt(0) === "6" || movil.charAt(0) === "7") {
    movilValido.value = movilRegex.test(movil);
    return movilValido.value;
  } else {
    movilValido.value = false;
    return false;
  }
};

// Provincias y municipios

const provincias = ref(provmuniData.provincias); // Array de provincias
const municipios = ref(provmuniData.municipios); // Array de municipios para filtrarlos
const municipiosFiltrados = ref([]); // vacío pero contendrá los municipios filtrados

const filtrarMunicipios = () => {
  // nombre de la provincia elegida en el <select>
  const nombreProv = nuevoCliente.value.provincia;

  // 1️⃣ buscar en provincias el objeto con ese nombre
  const prov = provincias.value.find((p) => p.nm === nombreProv);
  if (!prov) {
    municipiosFiltrados.value = [];
    return;
  }

  // 2️⃣ los dos primeros dígitos del id de la provincia
  const codigoProv = prov.id.slice(0, 2);

  // 3️⃣ filtrar los municipios cuyo id empiece por esos dos dígitos
  municipiosFiltrados.value = municipios.value.filter((m) =>
    m.id.startsWith(codigoProv)
  );

  // 4️⃣ opcional: resetear el municipio si ya no corresponde
  nuevoCliente.value.municipio = "";
};

// // conversor fecha
// const formatearFechaParaInput = (fecha) => {
//   if (!fecha) return '';
//   const partes = fecha.split('/');
//   if (partes.length !== 3) return '';
//   // partes = [dd, mm, yyyy]
//   return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
// }

// Función única: capitaliza y asigna en el mismo paso
const capitalizarTexto = (campo) => {
  const texto = nuevoCliente.value[campo] ?? "";
  nuevoCliente.value[campo] = texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => {
      if (!palabra) return "";
      return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
    })
    .join(" ");
};

/// formatear

function formatearFechaParaInput(fecha) {
  if (!fecha) return "";

  // Manejar formato con barras dd/mm/yyyy o dd/mm/yyyy hh:mm
  if (fecha.includes("/")) {
    // Puede venir como "dd/mm/yyyy" o "dd/mm/yyyy HH:MM"
    const [datePart, timePart] = fecha.split(" ");
    const [dd, mm, yyyy] = datePart.split("/");
    const time = timePart ? timePart : "00:00";
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}T${time}`;
  }

  // Si ya viene con guiones
  if (fecha.includes("-")) {
    // Si ya tiene la T (formato datetime-local esperado)
    if (fecha.includes("T")) {
      // Asegurar formato YYYY-MM-DDTHH:MM (recortar si tiene segundos o zona)
      return fecha.length >= 16 ? fecha.slice(0, 16) : `${fecha}T00:00`;
    }

    // Si viene como "yyyy-mm-dd HH:MM"
    if (fecha.includes(" ")) {
      return fecha.replace(" ", "T").slice(0, 16);
    }

    // yyyy-mm-dd (solo fecha) -> añadir hora 00:00
    const partes = fecha.split("-");
    if (partes.length === 3) return `${fecha}T00:00`;
  }

  return "";
}



const buscarClientePorDNI = async (dni) => {
  if (!dni || dni.trim() === "") {
    Swal.fire({
      icon: "warning",
      title: "Debe introducir un DNI antes de buscar.",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  try {
    const cliente = await getClientePorDni(dni.trim().toUpperCase());

    if (!cliente) {
      Swal.fire({
        icon: "info",
        title: "Cliente no encontrado",
        text: "No existe ningún cliente con ese DNI.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

  // ✅ Cargar los datos en el formulario
  nuevoCliente.value = { ...cliente };
  // Mantener la fecha en almacenamiento (dd/mm/yyyy) y preparar el input (yyyy-mm-dd)
  nuevoCliente.value.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);

    // Actualiza lista de municipios si cambia la provincia
    filtrarMunicipios();
    //opcional
    editando.value = true;
    clienteEditandoId.value = cliente.id;

    Swal.fire({
      icon: "success",
      title: "Cliente encontrado y cargado",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error buscando cliente por DNI:", error);
    Swal.fire({
      icon: "error",
      title: "Error al buscar cliente",
      text: "Verifique la conexión o contacte con el administrador.",
      timer: 2000,
      showConfirmButton: false,
    });
  }
};


// 🔹 Esta función se ejecutará al hacer clic en el icono azul:
const limpiarCampos = () => {
  nuevoCliente.value = {
    dni: "",
    nombre: "",
    apellidos: "",
    email: "",
    movil: "",
    direccion: "",
    provincia: "",
    municipio: "",
    fecha_alta: "",
    historico: true,
    lopd: false,
    tipoCliente: "",
    password: "",
    password2: ""
  }
}

// Añadimos limpieza de passwords si se usa sin reescribir todo
const validarPassword = () => {
  const pw = nuevoCliente.value.password || "";
  const pw2 = nuevoCliente.value.password2 || "";
  passwordValido.value = pw.length >= 6 && pw === pw2;
};

</script>

<style scoped>
.is-invalid {
  border-color: #D1D5DB !important;
  background-color: #FCE7E7;
}

.invalid-feedback {
  display: block;
}

.tamano-label{
  width: 90px;
  min-width: 90px;
}

.table-primary th {
  background-color:   #2563EB !important;
  color: white !important;
}

/* Visual for readonly/locked inputs when editing a cliente */
.readonly-input {
  background-color: #F4F6F8 !important;
  cursor: not-allowed;
  color: #495057; /* slightly muted text color */
}
</style>
