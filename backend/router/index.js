import NotFound from "../../src/components/NotFound.vue";
import PaginaInicio from "../../src/components/PaginaInicio.vue"
import GestionClientes from "../../src/components/GestionClientes.vue";
import NotiCias from "../../src/components/NotiCias.vue";
import AvisoLegal from "../../src/components/AvisoLegal.vue";
import PoliticaPrivacidad from "../../src/components/PoliticaPrivacidad.vue";
import ModeLos from "../../src/components/ModeLos.vue"; 
import CitasTaller from "../../src/components/CitasTaller.vue";
import TablaLogin from "../../src/components/TablaLogin.vue";
import VenTas from "../../src/components/VenTas.vue";
import { createRouter, createWebHistory } from "vue-router";
import ConTacto from "../../src/components/ConTacto.vue";
import BusCar from "../../src/components/BusCar.vue";


const routes = [
    {
        path: '/',
        name: 'Inicio',
        component : PaginaInicio
    },
    {
        path: '/clientes',
        name: 'GestionClientes',
        component: GestionClientes
    }, 
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },
    {
        path: '/noticias',
        name: 'NotiCias',
        component: NotiCias
    },
    {
        path: '/AvisoLegal',
        name: 'AvisoLegal',
        component: AvisoLegal
    },
    {
        path: '/PoliticaPrivacidad',
        name: 'PoliticaPrivacidad',
        component: PoliticaPrivacidad
    },
    {
        path: '/modelos',
        name: 'ModeLos',
        component: ModeLos
    },
    {
        path: '/CitasTaller',
        name: 'CitasTaller',
        component: CitasTaller
    },
    {
        path: '/login',
        name: 'login',
        component: TablaLogin
    },
    {
        path: '/ventas',
        name: 'VenTas',
        component: VenTas
    },
    {
        path: '/contacto',
        name: 'Contacto',
        component: ConTacto
    }, 
    {
        path: "/buscar",
        name: "BusCar",
        component: BusCar
    }
    

]
const router = createRouter({
    history: createWebHistory(),
    routes
  })

router.beforeEach(async (to, from, next) => {
    const token = sessionStorage.getItem("token");

    // Si la ruta requiere ser admin
    if (to.meta.requiresAdmin) {

        // Si no hay token → al login
        if (!token) return next({ name: "Login" });

        // Consultar al backend si es admin
        const admin = await esAdmin();

        if (!admin) {
            return next({ name: "Inicio" }); // acceso denegado
        }
    }

    next();
});
  
  export default router