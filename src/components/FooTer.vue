<template>
  <footer class="navbar navbar-dark bg-danger position-sticky top-0">
    <div class="container">
      <p class="mb-1 text-white">&copy; {{ new Date().getFullYear() }} MiSitio. Todos los derechos reservados.</p>
      <ul class="list-inline mb-0">
        <li class="list-inline-item"><router-link class="nav-link" to="/AvisoLegal">Aviso Legal</router-link></li>
        <li class="list-inline-item"><router-link class="text-light text-decoration-none" to="/PoliticaPrivacidad">Política de privacidad</router-link></li>
        <li class="list-inline-item"><a href="#" class="text-light text-decoration-none">Contacto</a></li>
      </ul>
    </div>
  </footer>
</template>

<script setup></script>
