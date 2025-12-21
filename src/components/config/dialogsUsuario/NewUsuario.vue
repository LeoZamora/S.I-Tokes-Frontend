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
                            <v-text-field v-model="data.usuario.username" prepend-inner-icon="mdi-account" density="compact" 
                                variant="outlined" label="Usuario" placeholder="ingrese el Usuario" 
                                persistent-placeholder color="indigo" :rules="data.rules.rule"/>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="py-2">
                            <v-select v-model="data.usuario.idrol" :items="data.roles" prepend-inner-icon="mdi-account-question" density="compact" 
                                variant="outlined" label="Rol" placeholder="roles" persistent-placeholder
                                color="indigo" :rules="data.rules.rule"/>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="py-2">
                            <v-text-field v-model="data.usuario.password" :append-inner-icon="data.showPass ? 'mdi-eye' : 'mdi-eye-off'" 
                                density="compact" @click:append-inner="data.showPass = !data.showPass"
                                variant="outlined" label="Contraseña" placeholder="ingrese una contraseña"  
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
import { utilsFunctions } from '@/helpers/utilFunctions';
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
                data.usuario.usuarioRegistro = store.getNameUser()
            }
            
        })

        const data = reactive({
            rules: {
                rule: [v => !!v || 'Campos Obligatorios']
            },
            nowDate: new Date(),
            usuario: {
                idrol: null,
                username: null,
                password: null,
                usuarioRegistro: null,
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
                const result = await this.data.requestHttp.postUsuario(this.data.usuario)
                this.data.disabledBtn = false
                this.data.overlay.show = false

                if (result.code === 200) {
                    this.showSuccesAlert('Usuario Guardado!', true)
                    setTimeout(() => {
                        this.$emit('closeDialog', false)
                        this.localShow = false
                    }, 1500);
                } else {
                    this.showSuccesAlert('No se pudo guardar el usuario', false)
                    return
                }
            }
        },
        
        async getRoles() {
            const result = await this.data.requestHttp.getRoles()
            if (result !== null) {
                result.map(item => {
                    this.data.roles.push({title: item.nombre, value: item.idrol})
                })
            }
        },        

        formatedDate(dataString) {
            const value = formatters.formatDate(dataString)
            return value
        },

        closeDialog() {
            this.$emit('closeDialog', false)
            this.data.usuario = {}
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