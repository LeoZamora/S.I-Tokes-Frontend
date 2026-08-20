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
      component: () =>
        import('@/components/pages/HomeApp.vue'),
      meta: {
        protected: true,
        requiredAuth: true,
        title: 'Inicio | DevoDigital'
      }
    },
    {
      path: '/resumen-inventario',
      name: 'Resumen Inventario',
      component: () =>
        import('@/views/resumen-inventario.vue'),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'R. Inventario | DevoDigital'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () =>
        import(
          '@/components/login/LoginAuth.vue'
        ),
      meta: {
        title: 'Login | DevoDigital'
      }
    },
    {
      path: '/cuentas-por-cobrar',
      name: 'Cuentas por Cobrar',
      component: () =>
        import(
          '@/views/general/por-cobrar/cuentas-por-cobrar/cuentas-por-cobrar.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'CXC | DevoDigital'
      }
    },
    {
      path: '/empresa/movimientos/conceptos',
      name: 'Conceptos',
      component: () =>
        import(
          '@/views/empresa/movimientos/conceptos.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Conceptos | DevoDigital'
      }
    },
    {
      path: '/empresa/movimientos',
      name: 'Movimientos E.',
      component: () =>
        import(
          '@/views/empresa/movimientos/movimientos.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Movimientos E. | DevoDigital'
      }
    },
    {
      path: '/cierres/cierres',
      name: 'Cierres',
      component: () =>
        import(
          '@/views/empresa/cierres/cierre.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Cierres | DevoDigital'
      }
    },
    {
      path: '/cierres/detalle-ventas',
      name: 'Detalle de Ventas',
      component: () =>
        import(
          '@/views/empresa/cierres/detalle-venta/detalle-venta.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'D. Venta | DevoDigital'
      }
    },
    {
      path: '/gestion-productos',
      name: 'Productos',
      component: () =>
        import(
          '@/components/inventario/Productos/GestionProducto.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Productos | DevoDigital'
      }
    },
    {
      path: '/facturacion',
      name: 'Facturación',
      component: () =>
        import(
          '@/components/movimientos/Ventas/FacturacionVentas.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Facturación | DevoDigital'
      }
    },
    {
      path: '/pedidos',
      name: 'Pedidos',
      component: () =>
        import(
          '@/components/movimientos/Ventas/PedidosComp.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Pedidos | DevoDigital'
      }
    },
    {
      path: '/ordenes',
      name: 'Órdenes de compra',
      component: () =>
        import(
          '@/components/movimientos/Compras/FacturacionCompras.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Compras | DevoDigital'
      }
    },
    {
      path: '/proveedores',
      name: 'Proveedores',
      component: () =>
        import(
          '@/components/movimientos/Compras/ProveedoresComp.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Proveedores | DevoDigital'
      }
    },
    {
      path: '/categorias',
      name: 'Categorías Productos',
      component: () =>
        import(
          '@/components/inventario/Categorias/CategoriasProductos.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Categorías | DevoDigital'
      }
    },
    {
      path: '/clientes',
      name: 'Clientes',
      component: () =>
        import(
          '@/components/clientes/ClientesComp.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Clientes | DevoDigital'
      }
    },
    {
      path: '/movimientos-facturacion',
      name: 'Movimientos',
      component: () =>
        import(
          '@/components/inventario/Movimientos/MovimientosComp.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Movimientos | DevoDigital'
      }
    },
    {
      path: '/usuario',
      name: 'Usuarios',
      component: () =>
        import(
          '@/components/config/UsuariosComp.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Usuario | DevoDigital'
      }
    },
    {
      path: '/roles-permisos',
      name: 'Roles',
      component: () =>
        import(
          '@/components/config/RolesComp.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Roles | DevoDigital'
      }
    },
    {
      path: '/rutas',
      name: 'Rutas',
      component: () =>
        import(
          '@/components/rutas/RutasComp.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Rutas | DevoDigital'
      }
    },
    {
      path: '/bodegas',
      name: 'Bodegas',
      component: () =>
        import(
          '@/views/inventario/bodegas.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Bodegas | I. Zafiro'
      }
    },
    {
      path: '/tipo-ventas',
      name: 'Tipos de Venta',
      component: () =>
        import(
          '@/components/movimientos/Ventas/dialogsVentas/TipoVentas.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'T. Ventas | DevoDigital'
      }
    },
    {
      path: '/clientes/tipos-cliente',
      name: 'Tipos de cliente',
      component: () =>
        import(
          '@/components/clientes/TiposClienteComp.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Tipos de Cliente | DevoDigital'
      }
    },
    {
      path: '/tipo-movimiento',
      name: 'Tipos Movimiento',
      component: () =>
        import(
          '@/components/inventario/Movimientos/TiposMov.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'T. Movimiento | DevoDigital'
      }
    },
    {
      path: '/caja/cierre',
      name: 'Cierre',
      component: () =>
        import(
          '@/views/caja/cierre.vue'
        ),
      meta: {
        protected: true,
        keepAlive: true,
        requiredAuth: true,
        title: 'Cierre de Caja | DevoDigital'
      }
    }
  ]
})

routes.beforeEach((to, from, next) => {

    const defaultTitle = 'DevoDigital'
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