<template>
    <v-dialog v-model="localShow" max-width="600" persistent>
        <v-card>
            <v-card-title class="bg-indigo-darken-4 d-flex align-center">
                <h5><v-icon>mdi-account-tie</v-icon>{{ localTitle }}</h5>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text id="body-card" class="">
                <v-row v-if="!localEdit" class="pb-0">
                    <v-col cols="12" md="12" sm="12" class="d-flex justify-end align-center pb-0">
                        <div class="d-flex justify-end align-center">
                            <v-card variant="tonal" color="green">
                                <v-card-text class="pa-2">
                                    <span class="mr-2">Fecha de Registro: </span>
                                    <span>
                                        <strong>
                                            {{ localEdit ? '' : formatedDate(data.nowDate) }}
                                        </strong>
                                    </span>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-col>
                </v-row>
                <v-card-subtitle class="d-flex align-center text-center my-4">
                    <small class="mr-2 font-weight-bold">GENERALES</small>
                    <v-divider/>
                </v-card-subtitle>
                <v-form ref="form">
                    <v-row>
                        <v-col cols="12" md="6" sm="6" class="py-2">
                            <v-text-field v-model="data.dataProveedor.nombre" prepend-inner-icon="mdi-account" density="compact" 
                                variant="outlined" hide-details label="Proveedor" placeholder="ingrese el proveedor" 
                                persistent-placeholder :readonly="readonlyOption()" color="indigo"
                                :rules="data.rules.rule"/>
                        </v-col>
                        <v-col cols="12" md="6" sm="6" class="py-2">
                            <v-select v-model="data.dataProveedor.idTipoProveedor" :items="data.tipoProveedor" prepend-inner-icon="mdi-account-question" 
                                density="compact" variant="outlined" hide-details label="Tipo Proveedor" placeholder="tipo de proveedor"  
                                persistent-placeholder :readonly="readonlyOption()" color="indigo"
                                :rules="data.rules.rule"/>
                        </v-col>
                        <v-col cols="12" md="6" sm="6" class="py-2">
                            <v-text-field v-model="data.dataProveedor.telefono" prepend-inner-icon="mdi-phone" density="compact" 
                                variant="outlined" hide-details label="Teléfono" placeholder="teléfono del proveedor"  
                                persistent-placeholder type="number" :readonly="readonlyOption()" color="indigo"
                                :rules="data.rules.rule"/>
                        </v-col>
                        <v-col cols="12" md="6" sm="6" class="py-2">
                            <v-text-field v-model="data.dataProveedor.departamento" prepend-inner-icon="mdi-home-city" density="compact" 
                                variant="outlined" hide-details label="Departamento" placeholder="ingrese un departamento"  
                                persistent-placeholder :readonly="readonlyOption()" color="indigo"
                                :rules="data.rules.rule"/>
                        </v-col>
                        <v-col cols="12" md="6" sm="6" class="py-2">
                            <v-text-field v-model="data.dataProveedor.municipio" prepend-inner-icon="mdi-map-marker" density="compact" 
                                variant="outlined" hide-details label="Municipio" placeholder="ingrese un municipio"  
                                persistent-placeholder :readonly="readonlyOption()" color="indigo"
                                :rules="data.rules.rule"/>
                        </v-col>
                        <v-col cols="12" md="6" sm="6" class="py-2">
                            <v-textarea v-model="data.dataProveedor.direccion" prepend-inner-icon="mdi-text" density="compact" 
                                variant="outlined" hide-details label="Dirección" placeholder="dirección del proveedor"  
                                persistent-placeholder :rows="2" :readonly="readonlyOption()" color="indigo" />
                        </v-col>
                    </v-row>
                </v-form>

                <transition name="slide-y-transition">
                    <AlertComp
                        :show="data.alert.show" 
                        :type="data.alert.type" 
                        :message="data.alert.message"/>
                </transition>

            </v-card-text>
            <v-divider/>
            <v-card-actions v-if="!localView">
                <v-btn color="grey" variant="tonal" @click="closeDialog()">
                    Cancelar
                </v-btn>
                <v-btn 
                    class="bg-indigo-darken-4 px-8" 
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
    mounted() {
        this.getTipoProveedores()
    },

    components: {
        AlertComp,
        SuccessAlert,
        OverlayComp
    },
    
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
            required: true
        },
        ver: {
            type: Boolean,
            required: false
        }
    },

    setup(props) {
        const store = useStore()
        const localShow = ref(props.show)
        const localEdit = ref(props.editar)
        const localProv = ref(props.prov)
        const localTitle = ref(props.title)
        const localView = ref(props.ver)
        watch(() => props.show, (newValue) => {
            localShow.value = newValue
        })
        watch(() => props.editar, (val) => {
            localEdit.value = val
            if (val === true) {
                data.dataProveedor.nombre = localProv.value.nombre
                data.dataProveedor.usuarioRegistro = localProv.value.usuarioRegistro
                data.dataProveedor.telefono = localProv.value.telefono
                data.dataProveedor.departamento = localProv.value.departamento
                data.dataProveedor.municipio = localProv.value.municipio
                data.dataProveedor.direccion = localProv.value.direccion
                data.dataProveedor.idTipoProveedor = localProv.value.idTipoProveedor
                data.idProv = localProv.value.idProveedor
            }
        })
        watch(() => props.prov, (val) => {
            localProv.value = val
        })
        watch(() => props.title, (val) => {
            localTitle.value = val
        })
        watch(() => props.ver, (val) => {
            localView.value = val
            if (val === true) {
                data.dataProveedor.nombre = localProv.value.nombre
                data.dataProveedor.usuarioRegistro = localProv.value.usuarioRegistro
                data.dataProveedor.telefono = localProv.value.telefono
                data.dataProveedor.departamento = localProv.value.departamento
                data.dataProveedor.municipio = localProv.value.municipio
                data.dataProveedor.direccion = localProv.value.direccion
                data.dataProveedor.idTipoProveedor = localProv.value.idTipoProveedor
                data.idProv = localProv.value.idProveedor
            }
        })

        const data = reactive({
            nowDate: new Date(),
            rules: {
                rule: [v => !!v || 'El campo es obligatorio'],
            },
            dataProveedor: {
                nombre: null,
                idTipoProveedor: null,
                telefono: null,
                departamento: null,
                municipio: null,
                direccion: null,
                usuarioRegistro: null,
            },

            disabledBtn: false,
            
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

            idProv: null,
            tipoProveedor: [],
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
            localProv,
            localView,
            data,
            showAlert,
            showSuccesAlert,
            store
        }
    },

    methods: {
        async handleSave() {
            const valid = await this.$refs.form.validate()
            const usuario = this.store.getNameUser()
            this.data.dataProveedor.usuarioRegistro = String(usuario)
            if (!this.localEdit) {
                if (valid.valid) {

                    this.data.disabledBtn = true
                    this.data.overlay.show = true
                    const result = await this.data.requestHttp.postProveedor(this.data.dataProveedor)
                    this.data.disabledBtn = false
                    this.data.overlay.show = false
                    
                    if (result.code === 200) {
                        this.showSuccesAlert('¡Registro Guardado!', true)
                        setTimeout(() => {
                            this.$emit('closeDialog', false)
                            this.localEdit = false
                        }, 1500);
                    } else {
                        this.showAlert('No se pudo guardar el registro', 'error')
                        return
                    }
                } else {
                    this.showAlert('Complete la información', 'warning')
                    return
                }
            } else {
                if (valid.valid && this.data.idProv) {

                    this.data.disabledBtn = true
                    this.data.overlay.show = true
                    const result = await this.data.requestHttp.putCategorias(this.data.dataProveedor, this.data.idProv)
                    this.data.disabledBtn = false
                    this.data.overlay.show = false

                    if (result.code === 200) {
                        this.showSuccesAlert('¡Registro Editado!', true)
                        setTimeout(() => {
                            this.$emit('closeDialog', false)
                            this.localEdit = false
                        }, 1500);
                    } else {
                        this.showAlert('No se pudo guardar el registro', 'error')
                        return
                    }
                } else {
                    this.showAlert('Complete la información', 'warning')
                    return
                }
            }
        },
         async getTipoProveedores() {
            this.data.tipoProveedor = []
            const result = await this.data.requestHttp.getTipoProveedores()
            result.map(item => {
                this.data.tipoProveedor.push({title: item.nombre, value: item.idTipoProveedor})
            })
        },

        formatedDate(dataString) {
            const value = formatters.formatDate(dataString)
            return value
        },

        closeDialog() {
            this.$emit('closeDialog', false)
            this.data.dataProveedor = {}
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