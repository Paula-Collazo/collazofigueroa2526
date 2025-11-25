import NotFound from "../components/NotFound.vue";
import PaginaInicio from "../components/PaginaInicio.vue"
import GestionClientes from "../components/GestionClientes.vue";
import NotiCias from "../components/NotiCias.vue";
import AvisoLegal from "../components/AvisoLegal.vue";
import PoliticaPrivacidad from "../components/PoliticaPrivacidad.vue";
import ModeLos from "../components/ModeLos.vue"; 
import CitasTaller from "../components/CitasTaller.vue";
import TablaLogin from "../components/TablaLogin.vue";
import { createRouter, createWebHistory } from "vue-router";


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
    }
    

]
const router = createRouter({
    history: createWebHistory(),
    routes
  })
  
  export default router