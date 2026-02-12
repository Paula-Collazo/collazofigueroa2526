<template>
  <div class="d-flex flex-column justify-content-center align-items-center vh-75 mt-5 position-relative">
    <div class="text-center mb-4">
      <h5 class="fw-bold text-uppercase  position-relative d-inline-block" style="color: #1F2937;">
        <i class="bi bi-people-fill me-2 fs-3"></i>
        Iniciar sesión
        <span class="underline-effect"></span>
      </h5>
    </div>

    <div class="border p-4 shadow-sm rounded w-100" style="max-width: 400px;">
      <form @submit.prevent="iniciarSesion">
        <div class="mb-3">
          <label for="dni" class="form-label fw-bold">DNI:</label>
          <input type="text" id="dni" autocomplete="off" @blur="capitalizarTexto" class="form-control text-center" v-model="dni" required />
        </div>

        <div class="mb-3">
          <label for="pass" class="form-label fw-bold">Contraseña:</label>
          <input type="password" id="pass" autocomplete="new-password" class="form-control" v-model="pass" required />
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-primary w-50">Iniciar sesión</button>
        </div>
      </form>
    </div>

    <!-- Cuadro de credenciales de prueba -->
    <div class="mt-4 p-3 bg-light border rounded shadow-sm text-center" style="font-size: 0.85rem; max-width: 400px;">
      <p class="mb-1 fw-bold text-primary"><i class="bi bi-info-circle me-1"></i>Credenciales de prueba:</p>
      <p class="mb-1"><strong>DNI Admin:</strong> 55555555K</p>
      <p class="mb-1"><strong>Password:</strong> abc123</p>
      <hr class="my-2">
      <p class="mb-1"><strong>DNI Admin:</strong> Y1234567X</p>
      <p class="mb-0"><strong>Password:</strong> abc123</p>
    </div>
  </div>
</template>

<script>
// DEBE QUEDAR CLARO QUE ESTA É UNHA SIMULACIÓN DE LOGIN PARA FINS DIDÁCTICOS CON JSON-SERVER
// EN NINGÚN CASO DEBE USARSE ESTA IMPLEMENTACIÓN EN PRODUCCIÓN
// PARA UNHA APLICACIÓN REAL, O LOGIN DEBE XESTIONARSE NO LADO DO SERVIDOR CON HTTPS Y JWT SEGURO

import Swal from 'sweetalert2';
import { loginUsuario } from "@/api/authApi.js";
import * as jwtDecode from 'jwt-decode';  // Importación de la librería jwt-decode de forma antigua
// de importación por eso el "* as" no funciona con "import jwtDecode from 'jwt-decode';"
// npm install jwt-decode  o  npm install jwt-decode@3.1.2

export default {
  name: "TablaLogin",
  data() {
    return {
      dni: "",
      pass: "",
    };
  },
  
methods: {
    async iniciarSesion() {
      try {

        this.dni = this.dni.toUpperCase().trim();
        this.pass = this.pass.trim(); 
        if (this.dni === "" || this.pass === "") {
          Swal.fire({
            title: "Campos vacíos",
            text: "Por favor, complete ambos campos.",
            icon: "warning",
            confirmButtonText: "Aceptar"
          });
          return;
        }

        const data = await loginUsuario(this.dni, this.pass);
       
        const decoded = jwtDecode.default(data.token);
      
        // Guardar token y datos del usuario en sessionStorage o sessionStorage
        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('isLogueado', 'true')
        sessionStorage.setItem('isAdmin', decoded.tipo === 'admin' ? 'true' : 'false')
        sessionStorage.setItem('isUsuario', decoded.tipo !== 'admin' ? 'true' : 'false')
        sessionStorage.setItem('userName', data.nombre)
        sessionStorage.setItem('dni', this.dni)

        // Redirigir al inicio y recargar para que Navbar se actualice
        this.$router.push({ name: 'Inicio' }).then(() => window.location.reload())
 
        Swal.fire({
          title: "Bienvenido",
          text: `Hola ${data.nombre}`,
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        // Redirigir a la página de inicio y recargar con $router
        // $router se usa para evitar problemas de historial en SPA
        // window.location.reload() recarga la página para reflejar el estado autenticado


      } catch (error) {
        console.error("Error en iniciarSesion:", error);
        Swal.fire({
          title: "Error de autenticación",
          text: "Error usuario o contraseña. Verifica tus credenciales.",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
      }
    },
  }
};
</script>
<style>
.form-label {
  background-color: transparent !important;
  margin-bottom: 0.5rem;
}
</style>