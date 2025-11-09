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
            <router-link class="nav-link" to="/#">Contacto</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';

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
  background-color: #b02a37 !important;
}
</style>
