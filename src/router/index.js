import NotFound from "../components/NotFound.vue";
import PaginaInicio from "../components/PaginaInicio.vue"
import GestionClientes from "../components/GestionClientes.vue";
import NotiCias from "../components/NotiCias.vue";
import AvisoLegal from "../components/AvisoLegal.vue";
import PoliticaPrivacidad from "../components/PoliticaPrivacidad.vue";
import ModeLos from "../components/ModeLos.vue"; 
import CitasTaller from "../components/CitasTaller.vue";
import TablaLogin from "../components/TablaLogin.vue";
import VenTas from "../components/VenTas.vue";
import { createRouter, createWebHistory } from "vue-router";
import ConTacto from "../components/ConTacto.vue";


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