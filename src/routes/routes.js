import {
    createWebHistory,
    createRouter
} from 'vue-router'

const routes = createRouter({
    history: createWebHistory(),
    routes: [{
        path: '/',
        name: 'Home',
        component: () => import('@/components/pages/HomeApp.vue')
    }, {
        path: '/gestion-inventario',
        name: 'Productos',
        component: () => import('@/components/inventario/GestionProducto.vue'),
        meta: {
            keepAlive: true
        }
    }],

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

export default routes