<template>
  <div id="noticias" class="container py-4 d-flex flex-column gap-4">
    <h3 class="text-center mt-2 mb-3 d-flex align-items-center justify-content-center" style="color: #7a0f16;">
      <i class="bi bi-newspaper fs-3 me-2"></i>
      Noticias
    </h3>

    <div v-if="isAdmin">
    <!-- Formulario -->
      <div id="titulo-noticias" class="d-flex align-items-center gap-3">
        <label for="titulo" class="fw-bold mb-0">Título:</label>
        <input type="text" maxlength="128" id="titulo" class="form-control" v-model="nuevoTitulo" />
      </div>

      <div id="contenido-noticias" class="d-flex flex-column">
        <label for="contenido" class="fw-bold mb-2">Contenido:</label>
        <textarea id="contenido" maxlength="256" class="form-control" rows="5" v-model="nuevoContenido"></textarea>
      </div>

      <div class="text-center">
        <button type="button" class="btn btn-primary px-4" @click="grabarNoticia">Publicar</button>
      </div>
    </div>

    <!-- Tabla de noticias -->
    <table class="table table-borderless mt-3 table-striped">
      <tbody>
        <template v-for="noticia in noticias" :key="noticia.id">
          <tr>
            <td>
              <div class="d-flex justify-content-between align-items-center">
                <strong class="text" style="color: #7a0f16;">{{ noticia.titulo }}</strong>
                <small class="text-muted">{{ noticia.fecha }}</small>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <span>
                {{ isExpanded[noticia.id] ? noticia.contenido : noticia.contenido.slice(0, 200) + '...' }}
              </span>
              <div class="float-end">
                <a href="#" @click.prevent="toggleExpand(noticia.id)" class="text-decoration-none me-3">
                  {{ isExpanded[noticia.id] ? 'Mostrar menos...' : 'Seguir leyendo...' }}
                </a>
                <button @click="eliminarNoticia(noticia.id)" class="btn btn-danger btn-sm me-2">
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
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { getNoticias, addNoticia, deleteNoticia } from "@/api/noticias.js";
import { esAdmin } from "../api/authApi";

 


const noticias = ref([]);
const isExpanded = ref({});
const nuevoTitulo = ref("");
const nuevoContenido = ref("");
let isAdmin = ref(false);


onMounted(async () => {
isAdmin.value = await esAdmin();
  const lista = await getNoticias();
  // Ordenar de más nueva a más vieja
  noticias.value = lista.sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );
});

const toggleExpand = (id) => {
  isExpanded.value[id] = !isExpanded.value[id];
};

const grabarNoticia = async () => {
  if (!nuevoTitulo.value.trim() || !nuevoContenido.value.trim()) {
    Swal.fire({ icon: "error", title: "Completa título y contenido" });
    return;
  }

  const nuevaNoticia = {
    titulo: nuevoTitulo.value,
    contenido: nuevoContenido.value,
    fecha: new Date().toISOString().split("T")[0],
  };

  try {
    const guardada = await addNoticia(nuevaNoticia);
    noticias.value.unshift(guardada);

    nuevoTitulo.value = "";
    nuevoContenido.value = "";

    Swal.fire({
      icon: "success",
      title: "Noticia grabada exitosamente",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error(error);
    Swal.fire({ icon: "error", title: "Error al grabar la noticia" });
  }
};

const eliminarNoticia = async (id) => {
  const result = await Swal.fire({
    title: "¿Desea eliminar la noticia?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await deleteNoticia(id);
      noticias.value = noticias.value.filter(n => n.id !== id);
      if (id in isExpanded.value) delete isExpanded.value[id];
      Swal.fire({ icon: "success", title: "Noticia eliminada", timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error al eliminar la noticia" });
    }
  }
};
</script>


<style scoped></style>

