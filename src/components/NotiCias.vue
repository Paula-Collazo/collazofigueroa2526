<template>
  <div id="noticias" class="container py-4 d-flex flex-column gap-4">

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
        Grabar
      </button>
    </div>

    <!-- Tabla sin bordes -->
    <table class="table table-borderless mt-4">
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
              <a
                href="#"
                @click.prevent="toggleExpand(noticia.id)"
                class="float-end text-decoration-none"
              >
                {{ isExpanded[noticia.id] ? 'Mostrar menos...' : 'Seguir leyendo...' }}
              </a>
            </td>
          </tr>

          <!-- Fila 3: espacio -->
          <tr><td class="py-2"></td></tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from "vue"
import db from "@/data/db.json"

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
function grabarNoticia() {
  if (!nuevoTitulo.value.trim() || !nuevoContenido.value.trim()) {
    alert("Por favor, completa el título y el contenido antes de grabar.")
    return
  }

  const nuevaNoticia = {
    id: noticias.value.length + 1,
    titulo: nuevoTitulo.value,
    contenido: nuevoContenido.value,
    fecha: new Date().toLocaleDateString("es-ES")
  }

  noticias.value.push(nuevaNoticia)

  nuevoTitulo.value = ""
  nuevoContenido.value = ""

  alert("✅ Noticia grabada correctamente")
}
</script>

<style scoped></style>