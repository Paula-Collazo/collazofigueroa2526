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
          <li class="nav-item">
            <router-link class="nav-link" to="/clientes">Clientes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/noticias">Noticias</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/modelos">Modelos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contacto">Contacto</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/CitasTaller">Citas Taller</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/ventas">Ventas</router-link>
          </li>
        </ul>
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
              <a class="dropdown-item" href="#" @click.prevent="logout">Cerrar Sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';

import { ref, onMounted } from 'vue'

// Estado do login
const isLogueado = ref(false)
const userName = ref('')

// Cando o componente se monta, le localStorage (para cando montes a autenticación)
onMounted(() => {
  isLogueado.value = localStorage.getItem('isLogueado') === 'true'
  userName.value = localStorage.getItem('userName') || ''
})

// Logout
function logout() {
  // Borra datos de sesión do localStorage
  localStorage.removeItem('isLogueado')
  localStorage.removeItem('userName')
  localStorage.removeItem('isAdmin')
  localStorage.removeItem('isUsuario')

  // Actualiza estado
  isLogueado.value = false
  userName.value = ''

  // Redirixe ao inicio recargando a páxina
  window.location.href = '/'
}

// No necesita lógica
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
