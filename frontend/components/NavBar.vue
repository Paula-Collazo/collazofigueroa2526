<template>
  <nav class="navbar navbar-dark bg-danger sticky-top navbar-expand-lg">

    <div class="container-fluid">
      <!-- Marca o logo -->
      <a class="navbar-brand" href="#"><img src="../assets/Paula.png" alt="logo" width="50"></a>

      <!-- Botón de hamburguesa en pantallas pequeñas -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Links de navegación -->
      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav d-flex justify-content-center w-100">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Inicio</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link class="nav-link" to="/clientes">Clientes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/noticias">Noticias</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link class="nav-link" to="/modelos">Modelos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contacto">Contacto</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link class="nav-link" to="/CitasTaller">Citas Taller</router-link>
          </li>
          <li class="nav-item" >
            <router-link class="nav-link" to="/ventas">Ventas</router-link>
          </li>
        </ul>
        <!-- BUSCADOR alineado a la derecha -->
        <form class="d-flex ms-auto me-2" role="search" @submit.prevent="buscar" v-if="isAdmin">
        <input
        class="form-control form-control-sm me-2 rounded-0"
        type="search"
        placeholder="Buscar..."
        aria-label="Buscar"
        v-model="query"
        style="width: 140px;"
        />
        <button class="btn btn-light btn-sm rounded-0" type="submit">
        <i class="bi bi-search"></i>
        </button>
        </form>

        <!-- CESTA DE LA COMPRA -->
        <router-link
        to="/cesta"
        class="btn btn-primary position-relative ms-3 me-2"
        title="Cesta">

          <i class="bi bi-cart3 fs-4"></i>

        <!-- Badge con número de productos -->
          <span
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
          v-if="cesta.totalItems > 0"
          >
          {{ cesta.totalItems }}
          </span>
        </router-link>


        <!-- Dropdown de acceso/registro -->
        <div class="dropdown ms-auto">
          <button
          class="btn btn-primary dropdown-toggle d-flex align-items-center gap-2"
          style="background-color: #b02a37; border-color: white;"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          >
          <p class=" mb-0 ">{{userName}}</p>
          <i class="bi bi-person fs-4" style="background-color: #b02a37;"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <!-- Mostra “Acceso/Registro” se NON hai usuario logueado -->
            <li v-if="!isLogueado"><router-link class="dropdown-item" to="/login">Acceso</router-link></li>
            <li v-if="!isLogueado"><router-link class="dropdown-item" to="/clientes">Registro</router-link></li>
            <!-- Mostra “Cerrar Sesión” se está logueado -->
            <li v-if="isLogueado">
              <router-link class="dropdown-item" to="/clientes">Perfil</router-link>
              <a class="dropdown-item" href="#" @click.prevent="logout">Cerrar Sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>


import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { esAdmin } from '../api/authApi' 

import { useCestaStore } from '../store/cesta'

const router = useRouter()
const query = ref('') // IMPORTANTE: esto evita el warning
// Función que se llama al hacer submit en el buscador
const cesta = useCestaStore()

function buscar() {
if (!query.value.trim()) return


router.push({
name: 'BusCar',
query: { q: query.value.trim() }
})
query.value = ''// opcional: limpiar input después de enviar
}

 // importamos la función que ya tenemos

const isLogueado = ref(false)
const isAdmin = ref(false)
const isUsuario = ref(false)
const userName = ref('')

// Se ejecuta al montar el componente
onMounted(async () => {
  const token = sessionStorage.getItem('token')
  if (!token) {
    isLogueado.value = false
    isAdmin.value = await esAdmin()
    isUsuario.value = false
    userName.value = ''
    return
  }

  try {
    // Decidir si es admin usando la función del frontend
    isAdmin.value = await esAdmin()
    isUsuario.value = !isAdmin.value
    isLogueado.value = true
    userName.value = sessionStorage.getItem('userName') || ''
  } catch (err) {
    console.error('Error verificando si es admin', err)
    sessionStorage.clear()
    isLogueado.value = false
    isAdmin.value = false
    isUsuario.value = false
    userName.value = ''
  }
})

// Logout
function logout() {
  sessionStorage.clear()
  isLogueado.value = false
  isAdmin.value = false
  isUsuario.value = false
  userName.value = ''
  window.location.href = '/'
}


</script>

<style>

.navbar-dark .nav-link {
  color: rgba(255,255,255,0.9); /* blanco suave */
}

.navbar-dark .nav-link:hover,
.navbar-dark .nav-link:focus {
  color: #fff; /* blanco intenso al pasar el ratón */
}

.navbar.bg-danger {
  background-color:  #b02a37!important; /* #e57373  */
}
</style>
