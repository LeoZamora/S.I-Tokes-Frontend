import { createApp } from 'vue'
import { createPinia } from 'pinia'
import routes from './routes/routes.js'
import App from './App.vue'

import { createVuetify } from 'vuetify/lib/framework.mjs'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import Axios from 'axios'

Axios.defaults.baseURL = 'http://165.98.133.202:55478/'

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi'
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            dark: "dark",
            light: {
                primary: '#0F52BA',
                accent: '#B5B1B0',
                secondary: '#8A8D93',
                success: '#2E7D32',
                info: '#16B1FF',
                warning: '#FFB400',
                error: '#FF4C51',
            },
        }
    }
})

app.use(vuetify).use(routes);

app.mount('#app')