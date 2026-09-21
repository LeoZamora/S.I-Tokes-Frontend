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
import { KEYUTIL, KJUR, stob64, hextorstr } from 'jsrsasign'

// SIGNATURE VERIFICATION QZ
const qz = window.qz
const certificate = getCertificate()
const privateKey = getPrivateKey()

function getPrivateKey() {
  // TODO: Switch to fetch()/AJAX/etc
  return (`-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDJFamOVMJQ7JeX
MF4sDR8eRdmF2L2Nry7qxmvn/MFPYBiltH090Jx4ZD1l8k1VmdsNSHUJES539jmL
5Xjh0M5DWc5oVYtzzkvDyECSqqOKqw4fyyHE96id5bnKMfuxNQV6naQ+n5DxQnWE
6YRb/GdIxTZSMfr7jgSvskTmg3G924yQ213zdN46Deb6pq/6sk+0ti3DUQ/bFO5J
qkbQQ/5Yjx97jU3IzPk3L+ZPnnwtU54q4T7oDTUp6LghPYUtyhT86kLBnD9GhCVg
RPq9b1Wv2dkUWk4QsOYQRAvuOtmAxZ5699IpGP3dhQ60W9nX+KyEwzmAEdE0t5YX
OJK3HpBLAgMBAAECggEAN3RHZc6fJgURSysWFWzq84TM17otkDjLJgjhckFEqFi2
g2Ayl80DkboHKqm3RQ+gltmwGPeJiqC3PwriGthkQbOvFhvdUOsH/u6nTCtN3ayN
wRvabMDl2eGkKow9PqICKE34ISMNLFOpKCXkECAb9bgZYnKRJjWEulVd5fpC8Fnx
s4yE4qaO6QXHOBnGHUgemlOsAzwQg7eqIKiKP3tqcAGjGsZXXdOA25JINFhlUjky
WgQtcGb5dC57x6gy1dP4lks++VoBGiBycR7hbi7NeS1HY8mFK0xkR2ZUuD6SA3uU
USSxpSoPDui11WVMW8Gqx5vCw0JMxreNCH0kbQbKWQKBgQD1Z5CbNBEx+VcQ+NbG
cVKLHen5hYGXishnoXCto1IAtUdIBSQREARM693DIhVxlYLiNxKhsc57lrj24VG0
BH6jmesjArqubttdWNq4/3LO9cqbrXuxUjpIHT1ftJCpJQLa5fgwExlffKh9f0q6
0qjmkLBmYQP4VEl20MODYeAwMwKBgQDRxDutNVDTh4wwz0Ci7vb+4FIzkBjqdd/f
ioi4z7hV9f/kX+eWrW0G39i7Bn1huTqZBR2UyG/VuXWoGx2FHMMP9ddTS6d20hId
JEx7iCwxvaO5Ybqrt+Pk5QQUOBakVe5LQm8oz/7HofFxLEwZGzk66XMdsk5fXgVo
jdmxJP8niQKBgQCSRqETYf294/nZy/l5X6Lr+XC1oraUNc0uuDQJzAfdFDDg5O+S
nBF0KEOPRImzooLZhCo+51VEpZqqzbN9shAqRFy8CaxsvPdUtNnq25j7c9bI5KeO
Eo1a3tLucRqpN75z7A/71+aP3CYyZ+WLZnX2uNfsrndHVjZT9CwV7AlNsQKBgE0o
/Lai9P9KTfQqWGFWu35Xr4UODUw5XcdRoycwKWNdYOp1qK+RTZiIwKVTJs3Kn9Zn
vlDbRd/9H11d1AcB5HK7gKBAJPKdJVKY5pVOKsuFMXNgkpTVyLuKzmxNkW6TuVrv
rgn6MILoe/KgU8GsdOnJs7GJxDBqWlzySNBThpPZAoGBAKkQBe8tvwMQvZpvnBls
5aeoee20amgDt4D53VLGdCthU5ma1MozgwMDCCjXAKVz8ZTc3xBWXy3wCy8Cfghs
rlQjFq09qFOZ8XWSr6MSPbFPrD/4HcMDtjzijsPVEhMTgvSSzbI+JYIKZzy9d7VL
Brv9JgxYxM9La1513p+goNjb
-----END PRIVATE KEY-----`);
}

function getCertificate() {
  // TODO: Switch to fetch()/AJAX/etc
  return (
    `-----BEGIN CERTIFICATE-----
MIIDCTCCAfGgAwIBAgIUDjBlRcaNMYWf85133oI0z89Omx4wDQYJKoZIhvcNAQEL
BQAwFDESMBAGA1UEAwwJUE9TU3lzdGVtMB4XDTI2MDkyMDA1NDIyOFoXDTM2MDkx
NzA1NDIyOFowFDESMBAGA1UEAwwJUE9TU3lzdGVtMIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEAyRWpjlTCUOyXlzBeLA0fHkXZhdi9ja8u6sZr5/zBT2AY
pbR9PdCceGQ9ZfJNVZnbDUh1CREud/Y5i+V44dDOQ1nOaFWLc85Lw8hAkqqjiqsO
H8shxPeoneW5yjH7sTUFep2kPp+Q8UJ1hOmEW/xnSMU2UjH6+44Er7JE5oNxvduM
kNtd83TeOg3m+qav+rJPtLYtw1EP2xTuSapG0EP+WI8fe41NyMz5Ny/mT558LVOe
KuE+6A01Kei4IT2FLcoU/OpCwZw/RoQlYET6vW9Vr9nZFFpOELDmEEQL7jrZgMWe
evfSKRj93YUOtFvZ1/ishMM5gBHRNLeWFziStx6QSwIDAQABo1MwUTAdBgNVHQ4E
FgQUJ0ygs+OpeeqC4rITNAFe7eL/X0kwHwYDVR0jBBgwFoAUJ0ygs+OpeeqC4rIT
NAFe7eL/X0kwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAXyzg
x7FV2a4EG662YgWXK3AyVo5qeDYkZqnbLuCRTMWcR04xNrCCDK0qzWiMbT3yzkZm
sRQs+IgoPJH04wiopROHh0uCSnECu5ZpjEABsgnG9zhb5cRsikJi+etOxIAsNYni
iGkYfC8HXeEEBCwePCziKw9RSvOzqHJzebVF/M/1QKE4DFBwT0vw+qu7PCG1oGzM
ud629lafLXlZB13dcE+K6BQjPq80Ppj7xeqI7oDmLSVD4bQyezS7RFq6vk9aYvWK
CZJAh4WrbljVZv02AyhchFP6xcdBdZ8WF9G7x1OHFqklIcdOWHsg3iqd8Hu8n/m1
7t3W0yboijqWm6SLsg==
-----END CERTIFICATE-----`);
}

qz.security.setCertificatePromise((resolve) =>  resolve(certificate))
qz.security.setSignatureAlgorithm('SHA512')
qz.security.setSignaturePromise((toSing) => (resolve, reject) => {
    try {
        const pk = KEYUTIL.getKey(privateKey)
        const sig = new KJUR.crypto.Signature({ alg: "SHA512withRSA" })
        sig.init(pk)
        sig.updateString(toSing)
        const signature = stob64(hextorstr(sig.sign()))
        resolve(signature)
    } catch (e) {
        reject(e)
    }
})


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
