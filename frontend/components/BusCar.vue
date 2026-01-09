<template>
    <div class="container mt-4">
        <h5 class="text-center bg-primary-subtle ms-1 py-1"><i class="bi bi-car-front me-2"></i>Buscando: "{{ termino }}"</h5>
    <hr>

    <!-- CLIENTES -->
    <div v-if="clientes.length">
        <h6 class="fw-bold">Clientes</h6>
        <ul>
         <li v-for="c in clientes" :key="c.id">
            {{ c.nombre }}
            <span v-html="resaltar(c.apellidos, termino)"></span>
            -
            <small class="text-muted" v-html="resaltar (c.email, termino)"></small>
        </li>
    </ul>
</div>


<!-- NOTICIAS -->
    <div v-if="noticias.length" class="mt-4">
        <h6 class="fw-bold">Noticias</h6>
        <ul>
        <li v-for="n in noticias" :key="n.id">
            <span v-html="resaltar (n.titulo, termino)"></span>
        </li>
        </ul>
    </div>

    <!-- SIN RESULTADOS -->
        <div v-if="!clientes.length && !noticias.length" class="mt-3">
            <p>No se encontraron resultados.</p>
        </div>
    </div>

    <!-- ARTÍCULOS-->
    <div v-if="articulos.length" class="mt-4">
        <h6 class="fw-bold">Artículos</h6>
        <ul>
            <li v-for="a in articulos" :key="a.id">
                <span v-html="resaltar(a.marca + 1 + a.modelo, termino)"></span>
                    <small v-html="resaltar(a.descripcion, termino)"></small>
            </li>
        </ul>
    </div>

</template>
<script setup>
    //IMPORTANTE HACEMOS USO DE USEROUTE PARA ACCEDER A LOS PARAMETROS DE LA RUTA Y LAS BUSQUEDAS DESDE EL FRONTEND
    //EN UN PROYECTO PROFESIONAL ESTO SE HARÍA DESDE EL BACKEND CON UNA CONSULTA A LA BASE DE DATOS
    //PERO PARA SIMPLIFICAR EL PROCESO Y DADO QUE ESTAMOS USANDO JSON-SERVER, LO HACEMOS ASÍ

    import { ref, onMounted, watch } from 'vue'
    import { useRoute } from 'vue-router' // Importa useRoute para acceder a los parámetros de la ruta no vale router-link sino useRoute
    
    const route = useRoute()
    const termino = ref(route.query.q?.toLowerCase() || "")
    
    const clientes = ref([])
    const noticias = ref([])

    const articulos = ref([])
   
    async function buscar() {
    const q = termino.value.trim().toLowerCase()
    if (!q) return

    // Búsqueda en MongoDB (artículos)
    try {
        const res = await fetch(
            `http://localhost:5000/api/articulos/buscar?q=${encodeURIComponent(q)}`
    )
    if (res.ok) {
        articulos.value = await res.json()
    }
    const resClientes = await fetch("http://localhost:3000/clientes")
        const listaClientes = await resClientes.json()

        const resNoticias = await fetch("http://localhost:3000/noticias")
        const listaNoticias = await resNoticias.json()

        clientes.value = listaClientes.filter(c =>
            (c.apellidos && c.apellidos.toLowerCase().includes (q)) ||
            (c.email && c.email.toLowerCase().includes (q))
        )

        noticias.value = listaNoticias.filter(n =>
            n.titulo && n.titulo.toLowerCase().includes(q)
        )
    } catch (e) {
    console.warn("MongoDB artículos no disponible")
    }


    
        // const q = termino.value.trim().toLowerCase()
        // if (!q) return

        
}

    onMounted (() => {
         termino.value = route.query.q?.toLowerCase() || ''
        if (termino.value) buscar()
    })
   
    // Vigila cambios en el query 'q' para actualizar resultados y volver a buscar
    watch(() => route.query.q, (nuevo) => {
        termino.value = nuevo.toLowerCase()
        buscar()
    })

    // FUNCION PARA RESALTAR TEXTO
    function resaltar (texto, termino) {
        if (!texto) return ""
        const regex = new RegExp(`(${termino})`, "gi")
        return texto.replace(regex, "<mark>$1</mark>")
    }
</script>