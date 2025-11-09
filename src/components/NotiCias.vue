<template>
  <div id="noticias" class="container py-4 d-flex flex-column gap-4">

    <h3 class="text-center mt-2 mb-3 d-flex align-items-center justify-content-center" 
    style="color: #7a0f16;">
      <i class="bi bi-newspaper fs-3 me-2"></i>
      Noticias
    </h3>

    <!-- Título -->
    <div id="titulo-noticias" class="d-flex align-items-center gap-3">
      <label for="titulo" class="fw-bold mb-0">Título:</label>
      <input
        type="text"
        maxlength="128"
        id="titulo"
        class="form-control"
        v-model="nuevoTitulo"
      />
    </div>

    <!-- Contenido -->
    <div id="contenido-noticias" class="d-flex flex-column">
      <label for="contenido" class="fw-bold mb-2">Contenido:</label>
      <textarea
        id="contenido"
        maxlength="256"
        class="form-control"
        rows="5"
        v-model="nuevoContenido"
      ></textarea>
    </div>

    <!-- Botón grabar -->
    <div class="text-center">
      <button
        type="button"
        id="boton-grabar"
        class="btn btn-primary px-4"
        @click="grabarNoticia"
      >
        Publicar
      </button>
    </div>

    <!-- Tabla sin bordes -->
    <table class="table table-borderless mt-3 table-striped">
      <tbody>
        <template v-for="noticia in noticias" :key="noticia.id">
          <!-- Fila 1: título y fecha -->
          <tr>
            <td>
              <div class="d-flex justify-content-between align-items-center">
                <strong class="text-primary">{{ noticia.titulo }}</strong>
                <small class="text-muted">{{ noticia.fecha }}</small>
              </div>
            </td>
          </tr>

          <!-- Fila 2: contenido -->
          <tr>
            <td>
              <span>
                {{ isExpanded[noticia.id]
                    ? noticia.contenido
                    : noticia.contenido.slice(0, 200) + '...' }}
              </span>
              <div class="float-end">
              <a
                href="#"
                @click.prevent="toggleExpand(noticia.id)"
                class="text-decoration-none me-3"
              >
                {{ isExpanded[noticia.id] ? 'Mostrar menos...' : 'Seguir leyendo...' }}
              </a>
              <button
                @click="eliminarNoticia(noticia.id)"
                class="btn btn-danger btn-sm me-2"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from "vue"
import db from "@/data/db.json"
import Swal from "sweetalert2";
import axios from "axios";

// Lista de noticias (cargadas desde el JSON)
const noticias = ref(db.noticias)

// Control del texto expandido
const isExpanded = ref({})

// Campos del formulario
const nuevoTitulo = ref("")
const nuevoContenido = ref("")

function toggleExpand(id) {
  isExpanded.value[id] = !isExpanded.value[id]
}

// Función para grabar una nueva noticia
async function grabarNoticia() {
  if (!nuevoTitulo.value.trim() || !nuevoContenido.value.trim()) {
    alert("Por favor, completa el título y el contenido antes de grabar.")
    return
  }

  const nuevaNoticia = {
    id: String(
      noticias.value.length > 0
        ? Math.max(...noticias.value.map((n) => n.id)) + 1
        : 1),
    titulo: nuevoTitulo.value,
    contenido: nuevoContenido.value,
    fecha: new Date().toLocaleDateString("es-ES")
  }

  try{
     await axios.post("http://localhost:3000/noticias", nuevaNoticia).then(res => res.data);
    noticias.value.push(nuevaNoticia)

  }catch(error){
    console.error("Fallo al guardar en la base de datos", error)
  }
 
  nuevoTitulo.value = ""
  nuevoContenido.value = ""

  Swal.fire({
        icon: 'success',
        title: "Noticia grabada exitosamente",
        showConfirmButton: false,
        timer: 1500
        });
}

async function eliminarNoticia(id) {
  const result = await Swal.fire({
    title: "¿Desea eliminar la noticia?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  });



  try{
    await axios.delete(`http://localhost:3000/noticias/${id}`)
    noticias.value = noticias.value.filter((n) => n.id !== id);
    if(id in isExpanded.value) delete isExpanded.value[id];
  }catch(error){
    console.error("Fallo al eliminar de la base de datos", error);
  }
 
}


</script>

<style scoped></style>

