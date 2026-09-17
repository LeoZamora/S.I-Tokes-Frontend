<template>
    <v-dialog v-model="localShow" max-width="400" persistent>
        <v-card id="diag-fact">
            <v-card-title class="bg-indigo-darken-4 d-flex align-center">
                <h5>
                    <v-icon>
                        mdi-account-outline
                    </v-icon>
                    Crear Usuario
                </h5>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text id="body-card" class="">
                <v-row class="pb-0">
                    <v-col cols="12" md="12" sm="12" class="d-flex justify-end align-center pb-0">
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Fecha de Registro: </small>
                            <small>
                                <strong>
                                    {{ formatedDate(data.nowDate) }}
                                </strong>
                            </small>
                        </div>
                    </v-col>
                </v-row>
                <v-card-subtitle class="d-flex align-center text-center my-4">
                    <small class="mr-2 font-weight-bold">GENERALES</small>
                    <v-divider/>
                </v-card-subtitle>
                <v-form ref="form">
                    <v-row dense>
                        <v-col cols="12" md="12" sm="12" class="py-2">
                            <v-text-field v-model="data.usuario.nombre" prepend-inner-icon="mdi-account-details" density="compact" 
                                variant="outlined" label="Nombre Completo" placeholder="Ingrese el nombre completo" 
                                persistent-placeholder color="indigo" :rules="data.rules.rule"/>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="py-2">
                            <v-text-field v-model="data.usuario.username" prepend-inner-icon="mdi-account" density="compact" 
                                variant="outlined" label="Usuario" placeholder="Ingrese el usuario" 
                                persistent-placeholder color="indigo" :rules="data.rules.rule"/>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="py-2">
                            <v-select v-model="data.usuario.idrol" :items="data.roles" prepend-inner-icon="mdi-account-cog" density="compact" 
                                variant="outlined" label="Rol" placeholder="Seleccione un rol" persistent-placeholder
                                color="indigo" :rules="data.rules.rule"/>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="py-2">
                            <v-text-field v-model="data.usuario.password" :append-inner-icon="data.showPass ? 'mdi-eye' : 'mdi-eye-off'" 
                                density="compact" @click:append-inner="data.showPass = !data.showPass"
                                variant="outlined" label="Contraseña" placeholder="Ingrese una contraseña"  
                                persistent-placeholder :type="data.showPass ? 'text' : 'password'"
                                color="indigo" :rules="data.rules.rule"/>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider/>
            <v-card-actions>
                <v-btn color="grey" variant="tonal" @click="closeDialog()">
                    Cancelar
                </v-btn>
                <v-btn 
                    class="bg-indigo-darken-4" 
                    @click="handleSave()"
                    :disabled="data.disabledBtn"
                    prepend-icon="mdi-content-save-outline"
                    elevation="2"
                >
                    <template v-if="data.disabledBtn">
                        <v-progress-circular 
                            color="white" 
                            indeterminate
                            :size="24" 
                            :width="3"
                            class="mr-2"
                        />
                        <span class="text-white">
                            Guardando...
                        </span>
                    </template>
                    <template v-else>
                        <span class="text-white font-weight-bold">
                            Guardar
                        </span>
                    </template>
                </v-btn>
            </v-card-actions>

            <OverlayComp :show="data.overlay.show"/> 
        </v-card>

        <SuccessAlert 
            :success="data.alertSuccess.success" 
            :msg="data.alertSuccess.msg" 
            :show="data.alertSuccess.show" 
        />
    </v-dialog>
</template>

<script>
import { formatters } from '@/helpers/formatters';
import RequestHttp from '@/services/requestHttp';
import { reactive, ref, watch } from 'vue';
import { useStore } from '@/store';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';

export default {
    mounted() {
        this.getRoles()
    },
    
    props: {
        show: {
            type: Boolean,
            required: true,
            default: true
        }
    },

    components: {
        SuccessAlert,
        OverlayComp
    },  

    setup(props) {
        const store = useStore()
        const localShow = ref(props.show)
       
        watch(() => props.show, (newValue) => {
            localShow.value = newValue
            if (newValue) {
                data.nowDate = new Date()
                data.usuario = {
                    idrol: null,
                    nombre: null,
                    username: null,
                    password: null,
                    usuarioRegistro: store.getNameUser(),
                }
            }
        })

        const data = reactive({
            rules: {
                rule: [v => !!v || 'Campos Obligatorios']
            },
            nowDate: new Date(),
            usuario: {
                idrol: null,
                nombre: null,
                username: null,
                password: null,
                usuarioRegistro: store.getNameUser(),
            },
            disabledBtn: false,
            roles: [],
            // Overlay
            overlay: {
                show: false
            },
            // ALERT SUCCESS
            alertSuccess: {
                show: false,
                msg: '',
                success: false,
            },
            showPass: false,
            requestHttp: new RequestHttp()
        })

        function showSuccesAlert(msg, success = true) {
            data.alertSuccess.msg = msg
            data.alertSuccess.show = true
            data.alertSuccess.success = success
            setTimeout(() => {
                data.alertSuccess.show = false
                data.alertSuccess.msg = ''
            }, 1500);
        }

        return {
            store,
            localShow,
            data,
            showSuccesAlert
        }
    },

    methods: {
        async handleSave() {
            const valid = await this.$refs.form.validate();
            if (!valid.valid) return

            if (valid.valid) {
                this.data.disabledBtn = true
                this.data.overlay.show = true
                if (!this.data.usuario.usuarioRegistro) {
                    this.data.usuario.usuarioRegistro = this.store.getNameUser()
                }
                const result = await this.data.requestHttp.postUsuario(this.data.usuario)
                this.data.disabledBtn = false
                this.data.overlay.show = false

                if (result.code === 200) {
                    this.showSuccesAlert('Usuario Guardado!', true)
                    setTimeout(() => {
                        this.closeDialog()
                    }, 1500);
                } else {
                    const errorMsg = result.data || 'No se pudo guardar el usuario'
                    this.showSuccesAlert(typeof errorMsg === 'string' ? errorMsg : 'No se pudo guardar el usuario', false)
                    return
                }
            }
        },
        
        async getRoles() {
            this.data.roles = []
            const result = await this.data.requestHttp.getRoles()
            if (result !== null) {
                result.map(item => {
                    const label = item.codigo ? `[${item.codigo}] ${item.nombre}` : item.nombre
                    this.data.roles.push({title: label, value: item.idRol ?? item.idrol})
                })
            }
        },        

        formatedDate(dataString) {
            const value = formatters.formatDate(dataString)
            return value
        },

        closeDialog() {
            this.$emit('closeDialog', false)
            this.localShow = false
            this.data.usuario = {
                idrol: null,
                nombre: null,
                username: null,
                password: null,
                usuarioRegistro: this.store.getNameUser(),
            }
            if (this.$refs.form) {
                this.$refs.form.resetValidation()
            }
        },
    },
}
</script>

<style scoped>
.v-card-item{
    padding: 8px 12px !important;
}

#diag-fact{
    position: relative;
}

#body-card{
    z-index: 2;
}

#checkLabel{
    font-size: 12px !important;
}

</style>