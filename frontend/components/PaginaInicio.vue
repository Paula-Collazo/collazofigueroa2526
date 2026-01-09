<template>
  <div id="pagina">
    <!-- Video de fondo -->
    <div id="contenedor-video">
      <video id="bg-video" autoplay muted loop playsinline>
        <source src="../assets/coche.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>
    </div>

    <!-- Contenido por encima del vídeo -->
    <div id="contenido">
      <h1>Concesionario Empresa Teis</h1>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Contenedor general */
#pagina {
  position: relative;
  width: 100%;
  height: 100vh; /* ocupa toda la pantalla */
  overflow: hidden;
}

/* Video de fondo */
#contenedor-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

#bg-video {
  width: 100%;
  height: 100%;
  object-fit: cover; /* llena sin deformar */
}

/* Contenido encima */
#contenido {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
  top: 40%;
  transform: translateY(-40%);
  background: rgba(0, 0, 0, 0.4); /* leve fondo para mejor legibilidad */
  padding: 2rem;
  border-radius: 1rem;
  max-width: 600px;
  margin: auto;
}

/* Estilos opcionales */
button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: #ff6600;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

button:hover {
  background-color: #ff8800;
}
</style>