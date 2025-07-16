import { useStore } from '@/store'
import {
    createWebHistory,
    createRouter
} from 'vue-router'

const routes = createRouter({
    history: createWebHistory(),
    routes: [{
        path: '/',
        name: 'Home',
        component: () => import('@/components/pages/HomeApp.vue'),
        meta: {
            title: 'Inicio | Inversiones Molina'
        }
    }, {
        path: '/gestion-productos',
        name: 'Productos',
        component: () => import('@/components/inventario/Productos/GestionProducto.vue'),
        meta: {
            keepAlive: true,
            requiredAuth: true,
            title: 'Productos | Inversiones Molina'
        }
    }, {
        path: '/facturacion',
        name: 'Facturacion',
        component: () => import('@/components/movimientos/Ventas/FacturacionVentas.vue'),
        meta: {
            keepAlive: true,
            requiredAuth: true,
            title: 'Facturación | Inversiones Molina'
        }
    }, {
        path: '/ordenes',
        name: 'Ordenes',
        component: () => import('@/components/movimientos/Compras/FacturacionCompras.vue'),
        meta: {
            keepAlive: true,
            requiredAuth: true,
            title: 'Compras | Inversiones Molina'
        }
    }, {
        path: '/proveedores',
        name: 'Proveedores',
        component: () => import('@/components/movimientos/Compras/ProveedoresComp.vue'),
        meta: {
            keepAlive: true,
            requiredAuth: true,
            title: 'Proveedores | Inversiones Molina'
        }
    }, {
        path: '/categorias',
        name: 'Categorias',
        component: () => import('@/components/inventario/Categorias/CategoriasProductos.vue'),
        meta: {
            keepAlive: true,
            requiredAuth: true,
            title: 'Categorías | Inversiones Molina'
        }
    }, {
        path: '/clientes',
        name: 'Clientes',
        component: () => import('@/components/clientes/ClientesComp.vue'),
        meta: {
            keepAlive: true,
            requiredAuth: true,
            title: 'Clientes | Inversiones Molina'
        }
    }, {
        path: '/cpc',
        name: 'CPC',
        component: () => import('@/components/clientes/CPComp.vue'),
        meta: {
            keepAlive: true,
            requiredAuth: true,
            title: 'CxC | Inversiones Molina'
        }
    }, {
        path: '/movimientos',
        name: 'Movimientos',
        component: () => import('@/components/inventario/Movimientos/MovimientosComp.vue'),
        meta: {
            keepAlive: true,
            requiredAuth: true,
            title: 'Movimientos | Inversiones Molina'
        }
    }, {
        path: '/usuario',
        name: 'Usuarios',
        component: () => import('@/components/config/UsuariosComp.vue'),
        meta: {
            keepAlive: true,
            requiredAuth: true,
            title: 'Usuario | Inversiones Molina'
        }
    }, {
        path: '/roles-permisos',
        name: 'Roles',
        component: () => import('@/components/config/RolesComp.vue'),
        meta: {
            keepAlive: true,
            requiredAuth: true,
            title: 'Roles | Inversiones Molina'
        }
    }, ],

    scrollBehavior(to, from, savePosition) {
        if (savePosition) {
            return savePosition
        } else {
            return {
                top: 0
            }
        }
    }
})

routes.beforeEach((to, from, next) => {
    const store = useStore()
    const isLoggedIn = store.isLoggedIn
    const defaultTitle = 'Inversiones Zafiro'
    if (!isLoggedIn) {
        document.title = defaultTitle
    } else {
        document.title = to.meta.title
    }

    !isLoggedIn && to.meta.requiredAuth ? next({ path: '/' }) : next()
})

export default routes