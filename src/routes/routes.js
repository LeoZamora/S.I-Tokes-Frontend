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
            title: 'Inicio | T O K E S'
        }
    }, {
        path: '/gestion-productos',
        name: 'Productos',
        component: () => import('@/components/inventario/GestionProducto.vue'),
        meta: {
            keepAlive: true,
            requiredAuth: true,
            title: 'Productos | T O K E S'
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

routes.beforeEach((to, from, next) => {
    const store = useStore()
    const isLoggedIn = store.isLoggedIn
    const defaultTitle = 'T O K E S'
    if (!isLoggedIn) {
        document.title = defaultTitle
    } else {
        document.title = to.meta.title
    }

    !isLoggedIn && to.meta.requiredAuth ? next({ path: '/' }) : next()
})

export default routes