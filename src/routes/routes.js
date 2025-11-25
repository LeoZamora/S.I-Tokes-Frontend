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
                requiredAuth: true,
                title: 'Inicio | I. Zafiro'
            } 
        },
        {
            path: '/resumen-inventario',
            name: 'Resumen Inventario',
            component: () => import('@/views/resumen-inventario.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'R. Inventario | I. Zafiro'
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/components/login/LoginAuth.vue'),
            meta: {
                title: 'Login | I. Zafiro'
            }
        },
        {
            path: '/cuentas-por-cobrar',
            name: 'Cuentas por Cobrar',
            component: () => import('@/views/general/por-cobrar/cuentas-por-cobrar/cuentas-por-cobrar.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'CXC | I. Zafiro'
            }
        },
        {
            path: '/empresa/movimientos/conceptos',
            name: 'Conceptos',
            component: () => import('@/views/empresa/movimientos/conceptos.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Conceptos | I. Zafiro'
            }
        },
        {
            path: '/empresa/movimientos',
            name: 'Movimientos E.',
            component: () => import('@/views/empresa/movimientos/movimientos.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Movimientos E. | I. Zafiro'
            }
        }, {
            path: '/cierres/cierres',
            name: 'Cierres',
            component: () => import('@/views/empresa/cierres/cierre.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Cierres | I. Zafiro'
            }
        }, {
            path: '/gestion-productos',
            name: 'Productos',
            component: () => import('@/components/inventario/Productos/GestionProducto.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Productos | I. Zafiro'
            }
        }, {
            path: '/facturacion',
            name: 'Facturación',
            component: () => import('@/components/movimientos/Ventas/FacturacionVentas.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Facturación | I. Zafiro'
            }
        }, {
            path: '/ordenes',
            name: 'Órdenes de compra',
            // component: () => import('@/components/dev-alert.vue'),
            component: () => import('@/components/movimientos/Compras/FacturacionCompras.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Compras | I. Zafiro'
            }
        }, {
            path: '/proveedores',
            name: 'Proveedores',
            component: () => import('@/components/movimientos/Compras/ProveedoresComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Proveedores | I. Zafiro'
            }
        }, {
            path: '/categorias',
            name: 'Categorías Productos',
            component: () => import('@/components/inventario/Categorias/CategoriasProductos.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Categorías | I. Zafiro'
            }
        }, {
            path: '/clientes',
            name: 'Clientes',
            component: () => import('@/components/clientes/ClientesComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Clientes | I. Zafiro'
            }
        }, {
            path: '/cpc',
            name: 'CPC',
            component: () => import('@/components/clientes/CPComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'CxC | I. Zafiro'
            }
        }, {
            path: '/movimientos-facturacion',
            name: 'Movimientos',
            component: () => import('@/components/inventario/Movimientos/MovimientosComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Movimientos | I. Zafiro'
            }
        }, {
            path: '/usuario',
            name: 'Usuarios',
            component: () => import('@/components/config/UsuariosComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Usuario | I. Zafiro'
            }
        }, {
            path: '/roles-permisos',
            name: 'Roles',
            component: () => import('@/components/config/RolesComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Roles | I. Zafiro'
            }
        }, {
            path: '/rutas',
            name: 'Rutas',
            component: () => import('@/components/rutas/RutasComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Roles | I. Zafiro'
            }
        }, {
            path: '/tipo-ventas',
            name: 'Tipos de Venta',
            // component: () => import('@/components/dev-alert.vue'),
            component: () => import('@/components/movimientos/Ventas/dialogsVentas/TipoVentas.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'T. Ventas | I. Zafiro'
            }
        }, {
            path: '/tipo-cliente',
            name: 'Tipos de Cliente',
            // component: () => import('@/views/empresa/cierres/cierre.vue'),
            component: () => import('@/components/dev-alert.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'T. Cliente | I. Zafiro'
            }
        }, {
            path: '/tipo-movimiento',
            name: 'Tipos Movimiento',
            // component: () => import('@/components/dev-alert.vue'),
            component: () => import('@/components/inventario/Movimientos/TiposMov.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'T. Movimiento | I. Zafiro'
            }
        },
    ],
})

routes.beforeEach((to, from, next) => {

    const defaultTitle = 'Inversiones Zafiro'
    document.title = to.meta.title || defaultTitle

    const authStore = useStore()
    const isAuthenticated = authStore.isLoggedIn
    
    if (to.meta.requiredAuth && !isAuthenticated) {
        return next({ path: '/login' })
    } 

    if (to.path === '/login' && isAuthenticated) {
        return next({ path: '/'})
    }

    !isAuthenticated && to.meta.requiredAuth ? next({path: '/login'}) : next()
})

export default routes