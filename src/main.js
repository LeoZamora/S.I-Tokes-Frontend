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
