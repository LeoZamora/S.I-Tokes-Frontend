import {useStore} from '@/store'
import {
    createWebHistory,
    createRouter
} from 'vue-router'

const routes = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/components/pages/HomeApp.vue'),
            meta: {
                title: 'Inicio | Inversiones Zafiro'
            }
        }, {
            path: '/empresa/movimientos/conceptos',
            name: 'Conceptos',
            component: () => import('@/views/empresa/movimientos/conceptos.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Conceptos | Inversiones Zafiro'
            }
        }, {
            path: '/empresa/movimientos',
            name: 'Movimientos E.',
            component: () => import('@/views/empresa/movimientos/movimientos.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Movimientos E. | Inversiones Zafiro'
            }
        }, {
            path: '/cierres/cierres',
            name: 'Cierres',
            component: () => import('@/views/empresa/cierres/cierre.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Cierres | Inversiones Zafiro'
            }
        }, {
            path: '/gestion-productos',
            name: 'Productos',
            component: () => import('@/components/inventario/Productos/GestionProducto.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Productos | Inversiones Zafiro'
            }
        }, {
            path: '/facturacion',
            name: 'Facturacion',
            component: () => import('@/components/movimientos/Ventas/FacturacionVentas.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Facturación | Inversiones Zafiro'
            }
        }, {
            path: '/ordenes',
            name: 'Ordenes',
            component: () => import('@/components/movimientos/Compras/FacturacionCompras.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Compras | Inversiones Zafiro'
            }
        }, {
            path: '/proveedores',
            name: 'Proveedores',
            component: () => import('@/components/movimientos/Compras/ProveedoresComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Proveedores | Inversiones Zafiro'
            }
        }, {
            path: '/categorias',
            name: 'Categorias',
            component: () => import('@/components/inventario/Categorias/CategoriasProductos.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Categorías | Inversiones Zafiro'
            }
        }, {
            path: '/clientes',
            name: 'Clientes',
            component: () => import('@/components/clientes/ClientesComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Clientes | Inversiones Zafiro'
            }
        }, {
            path: '/cpc',
            name: 'CPC',
            component: () => import('@/components/clientes/CPComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'CxC | Inversiones Zafiro'
            }
        }, {
            path: '/movimientos-facturacion',
            name: 'Movimientos_Facturacion',
            component: () => import('@/components/inventario/Movimientos/MovimientosComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Movimientos | Inversiones Zafiro'
            }
        }, {
            path: '/usuario',
            name: 'Usuarios',
            component: () => import('@/components/config/UsuariosComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Usuario | Inversiones Zafiro'
            }
        }, {
            path: '/roles-permisos',
            name: 'Roles',
            component: () => import('@/components/config/RolesComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Roles | Inversiones Zafiro'
            }
        }, {
            path: '/rutas',
            name: 'Rutas',
            component: () => import('@/components/rutas/RutasComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Roles | Inversiones Zafiro'
            }
        },
    ],

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

    !isLoggedIn && to.meta.requiredAuth ? next({path: '/'}) : next()
})

export default routes