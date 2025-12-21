<template>
    <v-dialog v-model="localShow" max-width="400" persistent>
        <v-card id="diag-fact">
            <v-card-title class="bg-indigo-darken-4 d-flex align-center">
                <h5>
                    <v-icon>mdi-account-plus</v-icon>
                    {{ localTitle }}
                </h5>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text id="body-card" class="">
                <v-row v-if="!localEdit && !localView" class="pb-0">
                    <v-col cols="12" md="12" sm="12" class="d-flex justify-end align-center pb-0">
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Fecha de Registro: </small>
                            <small><strong>{{ localEdit ? '' : formatedDate(data.nowDate) }}</strong></small>
                        </div>
                    </v-col>
                </v-row>

                <v-card-subtitle class="d-flex align-center text-center my-4">
                    <small class="mr-2 font-weight-bold">GENERALES</small>
                    <v-divider/>
                </v-card-subtitle>

                <v-form ref="form">
                    <v-row>
                        <v-col cols="12" md="12" sm="12" class="py-2">
                            <v-text-field v-model="data.dataCatCliente.nombre" prepend-inner-icon="mdi-account-question" 
                                density="compact" variant="outlined" color="indigo" :rules="data.rules.rule"
                                label="Tipo de Cliente" placeholder="ingrese un tipo" 
                                persistent-placeholder :readonly="readonlyOption()"/>
                        </v-col>
                        <!-- <v-col cols="12" md="12" sm="12" class="py-2">
                            <v-text-field v-model="data.dataCatCliente.usuarioRegistro" prepend-inner-icon="mdi-account-cog" 
                                density="compact" variant="outlined" color="indigo"
                                hide-details label="Usuario de Registro" placeholder="ingrese el usuario" 
                                persistent-placeholder :readonly="readonlyOption()"/>
                        </v-col> -->
                        <v-col cols="12" md="12" sm="12" class="py-2">
                            <v-textarea v-model="data.dataCatCliente.descripcion" prepend-inner-icon="mdi-text" 
                                density="compact" variant="outlined" color="indigo"
                                hide-details label="Descripción" placeholder="..." 
                                persistent-placeholder :rows="2" :readonly="readonlyOption()"/>
                        </v-col>
                    </v-row>
                </v-form>

            </v-card-text>
            <v-divider/>
            <v-card-actions v-if="!localView">
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
import AlertComp from '@/components/reutilizable/AlertComp.vue';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';
import { useStore } from '@/store';

export default {
    props: {
        show: {
            type: Boolean,
            required: true,
            default: true
        },
        editar: {
            type: Boolean,
            required: false
        },
        prov: {
            type: Object,
            required: false
        },
        title: {
            type: String,
            required: true,
            default: 'Nuevo tipo de Cliente'
        },
        ver: {
            type: Boolean,
            required: false
        }
    },

    components: {
        AlertComp,
        SuccessAlert,
        OverlayComp
    },

    setup(props) {
        const store = useStore()
        const localShow = ref(props.show)
        const localEdit = ref(props.editar)
        const localCat = ref(props.prov)
        const localTitle = ref(props.title)
        const localView = ref(props.ver)
        watch(() => props.show, (newValue) => {
            localShow.value = newValue
        })
        watch(() => props.editar, (val) => {
            localEdit.value = val
            if (val === true) {
                data.dataCatCliente.nombre = localCat.value.nombre
                data.dataCatCliente.descripcion = localCat.value.descripcion
                data.dataCatCliente.usuarioRegistro = localCat.value.usuarioRegistro
                data.idCat = localCat.value.idCategoriaCliente
            }
        })
        watch(() => props.prov, (val) => {
            localCat.value = val
        })
        watch(() => props.title, (val) => {
            localTitle.value = val
        })
        watch(() => props.ver, (val) => {
            localView.value = val
            if (val === true) {
                data.dataCatCliente.nombre = localCat.value.nombre
                data.dataCatCliente.descripcion = localCat.value.descripcion
                data.dataCatCliente.usuarioRegistro = localCat.value.usuarioRegistro
                data.idCat = localCat.value.idCategoriaCliente
            }
        })

        const data = reactive({
            nowDate: new Date(),
            rules: {
                rule: [v => !!v || 'El campo es obligatorio']
            },
            dataCatCliente: {
                nombre: null,
                descripcion: null,
                usuarioRegistro: null
            },

            // Overlay
            overlay: {
                show: false
            },

            // ALERT
            alert: {
                show: false,
                type: 'success',
                message: '',
                val: 0,
            },
            // ALERT SUCCESS
            alertSuccess: {
                show: false,
                msg: '',
                success: false,
            },

            disabledBtn: false,
            idCat: null,
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


        function showAlert(message, type) {
            data.alert.show = true
            data.alert.type = type
            data.alert.message = message

            setTimeout(() => {
                data.alert.show = false
                data.alert.val = 0
            }, 3000);
        }

        return {
            localShow,
            localEdit,
            localTitle,
            localCat,
            localView,
            data,
            store,
            showAlert,
            showSuccesAlert,
        }
    },

    methods: {
        async handleSave() {
            const valid = await this.$refs.form.validate()
            if (!valid.valid) return
            const usuario = this.store.getNameUser()
            this.data.dataCatCliente.usuarioRegistro = String(usuario)
            if (!this.localEdit) {

                this.data.disabledBtn = true
                this.data.overlay.show = true
                const result = await this.data.requestHttp.postCategoriaCliente(this.data.dataCatCliente)
                this.data.disabledBtn = false
                this.data.overlay.show = false
    
                if (result !== null) {
                    this.showSuccesAlert('¡Registro Guardado!', true)
                    setTimeout(() => {
                        this.clearData()
                        this.$emit('closeDialog', false)
                        this.localEdit = false
                    }, 1500);
                } else {
                    this.showAlert('No se pudo guardar el registro', 'error')
                    return
                }
            } else {
                // if (!this.data.idCat) {
                //     alert('Elija una categoria')
                //     return
                // }
                this.data.disabledBtn = true
                this.data.overlay.show = true
                const result = await this.data.requestHttp.putCategoriaCliente(this.data.dataCatCliente, this.data.idCat)
                this.data.disabledBtn = false
                this.data.overlay.show = false
                if (result !== null) {
                    this.showSuccesAlert('¡Registro Editado!', true)
                    setTimeout(() => {
                        this.clearData()
                        this.$emit('closeDialog', false)
                        this.localEdit = false
                    }, 1500);
                } else {
                    this.showAlert('No se pudo editar el registro', 'error')
                    return
                }
            }
        },

        clearData() {
            this.data.dataCatCliente.descripcion = null
            this.data.dataCatCliente.nombre = null
            this.data.dataCatCliente.usuarioRegistro = null
        },

        formatedDate(dataString) {
            const value = formatters.formatDate(dataString)
            return value
        },

        closeDialog() {
            this.$emit('closeDialog', false)
            this.data.dataCatCliente = {}
        },

        readonlyOption() {
            if (this.localView) {
                return true
            } else if(this.editar) {
                return false
            } else if(!this.editar && !this.localView) {
                return false
            }
        }
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