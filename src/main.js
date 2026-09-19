import { createApp } from 'vue'
import { createPinia } from 'pinia'
import routes from './routes/routes.js'
import App from './App.vue'
import VueECharts from 'vue-echarts'
import 'echarts'

import { createVuetify } from 'vuetify/lib/framework.mjs'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import Axios from 'axios'
import 'intro.js/minified/introjs.min.css';

//Axios.defaults.baseURL = 'http://localhost:5091/'
Axios.defaults.baseURL = 'https://inversiones-zafiro.com/devodigital/'

Axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken') || localStorage.getItem('raw_token') || localStorage.getItem('token')
        if (token) {
            let bearerToken = token
            if (typeof token === 'string' && token.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(token)
                    bearerToken = parsed.token || parsed.authToken || parsed.raw_token || null
                } catch (e) {
                    bearerToken = null
                }
            }
            if (bearerToken) {
                config.headers.Authorization = `Bearer ${bearerToken}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.component('v-chart', VueECharts)

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi'
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: '#0F52BA',
                    accent: '#0d6efd',
                    secondary: '#8A8D93',
                    success: '#2E7D32',
                    info: '#16B1FF',
                    warning: '#FFB400',
                    error: '#FF4C51',
                    yellow: '#FBC02D'
                }
            },
            dark: {
                dark: true,
                colors: {
                    primary: '#9155FD',
                    accent: '#0d6efd',
                    secondary: '#8A8D93',
                    success: '#56CA00',
                    info: '#16B1FF',
                    warning: '#FFB400',
                    error: '#FF4C51'
                }
            }
        }
    }
})

app.use(vuetify).use(routes);

app.mount('#app')
