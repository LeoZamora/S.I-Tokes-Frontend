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
                title: 'Inicio | DevoDigital'
            } 
        },
        {
            path: '/resumen-inventario',
            name: 'Resumen Inventario',
            component: () => import('@/views/resumen-inventario.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'R. Inventario | DevoDigital'
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/components/login/LoginAuth.vue'),
            meta: {
                title: 'Login | DevoDigital'
            }
        },
        {
            path: '/cuentas-por-cobrar',
            name: 'Cuentas por Cobrar',
            component: () => import('@/views/general/por-cobrar/cuentas-por-cobrar/cuentas-por-cobrar.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'CXC | DevoDigital'
            }
        },
        {
            path: '/empresa/movimientos/conceptos',
            name: 'Conceptos',
            component: () => import('@/views/empresa/movimientos/conceptos.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Conceptos | DevoDigital'
            }
        },
        {
            path: '/empresa/movimientos',
            name: 'Movimientos E.',
            component: () => import('@/views/empresa/movimientos/movimientos.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Movimientos E. | DevoDigital'
            }
        }, {
            path: '/cierres/cierres',
            name: 'Cierres',
            component: () => import('@/views/empresa/cierres/cierre.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Cierres | DevoDigital'
            }
        }, {
            path: '/gestion-productos',
            name: 'Productos',
            component: () => import('@/components/inventario/Productos/GestionProducto.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Productos | DevoDigital'
            }
        }, {
            path: '/facturacion',
            name: 'Facturación',
            component: () => import('@/components/movimientos/Ventas/FacturacionVentas.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Facturación | DevoDigital'
            }
        }, {
            path: '/ordenes',
            name: 'Órdenes de compra',
            // component: () => import('@/components/dev-alert.vue'),
            component: () => import('@/components/movimientos/Compras/FacturacionCompras.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Compras | DevoDigital'
            }
        }, {
            path: '/proveedores',
            name: 'Proveedores',
            component: () => import('@/components/movimientos/Compras/ProveedoresComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Proveedores | DevoDigital'
            }
        }, {
            path: '/categorias',
            name: 'Categorías Productos',
            component: () => import('@/components/inventario/Categorias/CategoriasProductos.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Categorías | DevoDigital'
            }
        }, {
            path: '/clientes',
            name: 'Clientes',
            component: () => import('@/components/clientes/ClientesComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Clientes | DevoDigital'
            }
        }, {
            path: '/cpc',
            name: 'CPC',
            component: () => import('@/components/clientes/CPComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'CxC | DevoDigital'
            }
        }, {
            path: '/movimientos-facturacion',
            name: 'Movimientos',
            component: () => import('@/components/inventario/Movimientos/MovimientosComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Movimientos | DevoDigital'
            }
        }, {
            path: '/usuario',
            name: 'Usuarios',
            component: () => import('@/components/config/UsuariosComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Usuario | DevoDigital'
            }
        }, {
            path: '/roles-permisos',
            name: 'Roles',
            component: () => import('@/components/config/RolesComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Roles | DevoDigital'
            }
        }, {
            path: '/rutas',
            name: 'Rutas',
            component: () => import('@/components/rutas/RutasComp.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'Roles | DevoDigital'
            }
        }, {
            path: '/tipo-ventas',
            name: 'Tipos de Venta',
            // component: () => import('@/components/dev-alert.vue'),
            component: () => import('@/components/movimientos/Ventas/dialogsVentas/TipoVentas.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'T. Ventas | DevoDigital'
            }
        }, {
            path: '/tipo-cliente',
            name: 'Tipos de Cliente',
            // component: () => import('@/views/empresa/cierres/cierre.vue'),
            component: () => import('@/components/dev-alert.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'T. Cliente | DevoDigital'
            }
        }, {
            path: '/tipo-movimiento',
            name: 'Tipos Movimiento',
            // component: () => import('@/components/dev-alert.vue'),
            component: () => import('@/components/inventario/Movimientos/TiposMov.vue'),
            meta: {
                keepAlive: true,
                requiredAuth: true,
                title: 'T. Movimiento | DevoDigital'
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