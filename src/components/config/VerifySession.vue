<template>
    <div>
        <LoaderComp v-show="loader.show" :data="loader.msg"/>
        <v-dialog v-model="internalShow" max-width="420" persistent>
            <v-card class="type-font" rounded="lg" elevation="6">
                <v-card-title class="d-flex text-h6 font-weight-bold">
                    <span>
                        Sesión expirada
                    </span>
                    <v-spacer />
                    <img src="/32px.png" style="width: 80px"/>
                </v-card-title>
                <v-card-text class="d-flex flex-column text-center text-body-2 text-medium-emphasis">
                    <span>
                        Su sesión ha caducado.  
                    </span>
                    <span>
                        ¿Desea restablecerla para continuar trabajando?
                    </span>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <v-btn variant="text" color="grey-darken-1" @click="logout">
                        <template v-slot:prepend>
                            <v-icon start size="18">mdi-logout</v-icon>
                        </template>
                        Cerrar sesión
                    </v-btn>

                    <v-btn variant="flat" color="indigo-darken-4" @click="login.show = true"> 
                        <template v-slot:prepend>
                            <v-icon start size="18">mdi-refresh</v-icon>
                        </template>
                        Restablecer
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="login.show" width="400">
            <v-card class="type-font" elevation="0" rounded="lg">
                <template v-slot:append>
                    <v-btn icon size="small" variant="text" @click="login.show = false">
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </template>
                <v-card-title class="text-center">
                    <strong>INICIO DE SESION</strong>
                </v-card-title>
                <v-card-text class="pa-4">    
                    <v-form id="form-login" v-model="data.valid" ref="form" lazy-validation>
                        <v-row>
                            <v-col cols="12" md="12" sm="12">
                                <v-text-field color="primary" v-model="data.data.usuario" placeholder="Ingrese su usuario"
                                    :rules="data.rules.userRules" @input="clearError" variant="outlined"
                                    prepend-inner-icon="mdi-account-outline" aria-describedby="input-username-messages" 
                                    autocomplete="username" persistent-placeholder label="Usuario"
                                    hide-details density="comfortable" clearable/>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-text-field
                                    color="primary" v-model="data.data.password" placeholder="Ingrese su contraseña"
                                    @keydown.enter="authLogin" label="Contraseña" 
                                    autocomplete="current-password" @click:append-inner="passVisible"
                                    :append-inner-icon="data.showPass ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" prepend-inner-icon="mdi-lock-outline"
                                    @input="clearError" hide-details density="comfortable"
                                    variant="outlined" :type="data.showPass ? 'text': 'password'"
                                    :rules="data.rules.passRules" persistent-placeholder/>
                            </v-col>
                        </v-row>
                        <v-fade-transition>
                            <v-alert density="compact" v-if="data.error" type="warning" variant="tonal">
                                {{ data.errorMsg }}
                            </v-alert>
                        </v-fade-transition>

                        <span v-show="data.count">Intentos restantes: {{ 5 - data.count }}</span>
                        <div v-if="data.count === 5" class="w-100 d-flex justify-space-between align-center">
                            <span>Volver a intentar en: </span>
                            <strong class="ml-1">{{ cronometro }}</strong>
                        </div>

                        <v-card-actions class="d-flex justify-center mt-10">
                            <v-btn :disabled="data.loading" size="large" elevation="4"
                                @click="authLogin()" class="bg-indigo-darken-4" block>
                                <template v-if="data.loading">
                                    <v-progress-circular color="blue-lighten-3" indeterminate
                                        :size="24" />
                                </template>
                                <template v-else>
                                    Acceder
                                </template>
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="data.snackbar" :timeout="3000" color="green"
            rounded="pill" absolute variant="elevated">
            <template v-slot:text>
                <h3>
                    Sesión Iniciada
                </h3>
            </template>
            <template v-slot:actions>
                <v-icon size="large" class="mr-2" color="white">
                    mdi-check-circle
                </v-icon>
            </template>
        </v-snackbar>

    </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useStore } from '@/store.js';
import LoaderComp from '../widgets/LoaderComp.vue';
import JWTDecoder from '@/helpers/decoderJWT';
import RequestHttp from '@/services/requestHttp';

export default {
    props: {
        show: {
            type: Boolean,
            required: true
        }
    },

    components: {
        LoaderComp,
    },

    data() {
        return {
            showDialog: this.show,
            loader: {
                show: false,
                msg: ''
            },
            login: {
                show: false
            }
        }
    },

    emits: ['update:show', 'logout', 'reset'],
    computed: {
        internalShow: {
            get() {
                return this.show
            },
            set(value) {
                this.$emit('update:show', value)
            }
        }
    },

    setup() {
        const store = useStore()
        const tiempo = ref(15000)
        const cronometro = ref('15')
        let interval = null

        const timer = () => {
            if (interval) clearInterval(interval);

            tiempo.value = 5 * 60 * 1000
            actualizarTimer()

            interval = setInterval(() => {
                let minutos = Math.floor(tiempo.value / 60000);
                let segundos = Math.floor((tiempo.value % 60000) / 1000);

                cronometro.value = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

                if (tiempo.value <= 0) {
                    clearInterval(interval);
                    cronometro.value = "00:00";
                }

                    tiempo.value -= 1000;
            }, 1000); // Ejecutar cada segundo
        }

        const actualizarTimer = () => {
            let minutos = Math.floor(tiempo.value / 60000);
            let segundos = Math.floor((tiempo.value % 60000) / 1000);
            cronometro.value = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        }
        const data = reactive({
            rules: {
                userRules: [v => !!v || 'El campo es obligatorio'], 
                passRules: [v => !!v || 'El campo es obligatorio']
            },
            data: {
                usuario: '',
                password: ''
            },
            msgLoader: '',
            errorMsg: '',
            loading: false,
            snackbar: false,
            valid: false,
            showPass: false,
            changePass: false,
            isNewPass: true,
            isVisible: false,
            count: 0,

            disableBtn: false,
            error: false,
            requestHttp: new RequestHttp,
        })

        return {
            data,
            store,
            cronometro,
            timer,
            tiempo,
        }
    },

    methods: {
        async delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        },

        passVisible() {
            this.data.showPass = !this.data.showPass;
        },

        clearError() {
            this.data.errorMsg = '';
        },

        closeUserConfig(val) {
            this.data.changePass = val
            this.data.isNewPass = false
        },

        async logout() {
            this.loader.show = true
            this.$emit('logout', false)
            this.loader.msg = 'Cerrando Sesion'
            await this.delay(1000)
            this.loader.show = false
        },

        async authLogin(){
            const valid = await this.$refs.form.validate();

            if(!valid.valid){
                this.data.errorMsg = 'Todos los campos son obligatorios';
                this.data.error = true
                setTimeout(() => {
                    this.data.error = false
                }, 1500)
                return;
            }

            const lastRoute = sessionStorage.getItem('lastRoute')
            try {
                this.data.loading = true
                this.data.msgLoader = 'Iniciando Sesion...'
                const result = await this.data.requestHttp.postLogin(this.data.data)

                if(result.token) {
                    await this.delay(1500)
                    let jwtHandler = new JWTDecoder(result.token)
                    const decode = jwtHandler.decodeToken()
                    this.store.login(decode)
                    this.store.sendExp(decode.exp)
                    this.store.sendNameUser(this.data.data.usuario)
                    this.$router.push({ path: '/' })
                    this.$router.go(0)

                    if (!lastRoute) {
                        this.$router.push({ path: '/' })
                    } else {
                        this.$router.push({ name: lastRoute })
                    }

                    this.data.loading = false
                    this.login.show = false
                    await this.delay(500)
                    this.$emit('reset', false)
                    this.data.snackbar = true
                    this.data.data = {}
                } else if (result.code == 404 || result.code == 400) {
                    this.data.count += 1;
                    if (this.data.count === 5) {
                        this.data.disableBtn = true
                        this.data.error = true

                        setTimeout(() => {
                            this.data.disableBtn = false
                            this.data.error = false
                            this.data.count = 0
                        }, 300000)
                        this.timer()
                        this.data.errorMsg = 'Acceso Bloqueado';
                        return
                    } else {
                        this.data.error = true
                        setTimeout(() => {
                            this.data.error = false
                        }, 1500)
                        this.data.errorMsg = result.msg;
                        this.data.loading = false;
                    }
                } else {
                    this.data.error = true
                    setTimeout(() => {
                        this.data.error = false
                    }, 1500)
                    this.data.errorMsg = 'No se pude acceder al sistema.';
                    this.data.loading = false;
                }
            
            } catch (error) {
                this.$emit('login', this.data.isVisible);
                this.data.errorMsg = 'Credenciales incorrectas';
                this.data.loading = false;
            }
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.type-font {
    font-family: Poppins,serif !important;
}

:deep() .v-card-item {
    padding: 0px !important;
}
</style>