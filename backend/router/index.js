import NotFound from "../../frontend/components/NotFound.vue";
import PaginaInicio from "../../frontend/components/PaginaInicio.vue"
import GestionClientes from "../../frontend/components/GestionClientes.vue";
import NotiCias from "../../frontend/components/NotiCias.vue";
import AvisoLegal from "../../frontend/components/AvisoLegal.vue";
import PoliticaPrivacidad from "../../frontend/components/PoliticaPrivacidad.vue";
import ModeLos from "../../frontend/components/ModeLos.vue"; 
import CitasTaller from "../../frontend/components/CitasTaller.vue";
import TablaLogin from "../../frontend/components/TablaLogin.vue";
import VenTas from "../../frontend/components/VenTas.vue";
import { createRouter, createWebHistory } from "vue-router";
import ConTacto from "../../frontend/components/ConTacto.vue";
import BusCar from "../../frontend/components/BusCar.vue";
import CesTa from "../../frontend/components/CesTa.vue";
import PaymentSuccess from "../../frontend/components/PaymentSuccess.vue";
import PaymentCancel from "../../frontend/components/PaymentCancel.vue";


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
    },
    {
        path: '/cesta',
        name: 'CesTa',
        component: CesTa
    },
    {
        path: '/PaymentSuccess',
        name: 'PaymentSuccess',
        component: PaymentSuccess
    },
    {
        path: '/PaymentCancel',
        name: 'PaymentCancel',
        component: PaymentCancel
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