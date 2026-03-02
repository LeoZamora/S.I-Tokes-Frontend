<template>
    <v-dialog v-model="localShow" max-width="400" persistent>
        <v-card id="diag-fact">
            <v-card-title class="bg-indigo-darken-4 d-flex align-center">
                <h5>
                    <v-icon>mdi-account-plus</v-icon>
                    {{ localTitle }}
                </h5>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="text" @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>

            <v-divider />

            <v-card-text id="body-card" class="">
                <v-row v-if="!localEdit && !localView">
                    <v-col cols="12" md="12" sm="12" class="d-flex justify-end align-center">
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Fecha de Registro: </small>
                            <small>
                                <strong>
                                    {{ localEdit ? '' : formatedDate(data.nowDate) }}
                                    </strong>
                                </small>
                        </div>
                    </v-col>
                </v-row>

                <v-form ref="form">
                    <v-row>
                        <v-col cols="12" md="12" sm="12">
                            <v-autocomplete v-model="data.concepto.idTipoMovimiento" :items="data.tipoMovs"
                                prepend-inner-icon="mdi-file-document" density="compact" variant="outlined"
                                color="indigo" :rules="data.rules.rule" label="Tipo de Movimiento"
                                placeholder="Elija un tipo de movimiento" persistent-placeholder
                                :readonly="readonlyOption()" hide-details/>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-text-field v-model="data.concepto.codigo" prepend-inner-icon="mdi-numeric"
                                density="compact" variant="outlined" color="indigo" :rules="data.rules.rule"
                                label="Código Concepto" placeholder="Ingrese un codigo asignado"
                                persistent-placeholder :readonly="readonlyOption(true)" hide-details/>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-text-field v-model="data.concepto.nombre" prepend-inner-icon="mdi-account-question"
                                density="compact" variant="outlined" color="indigo" :rules="data.rules.rule"
                                label="Nombre de Concepto" placeholder="Ingrese su nombre"
                                persistent-placeholder :readonly="readonlyOption()" hide-details/>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-textarea v-model="data.concepto.descripcion" prepend-inner-icon="mdi-text"
                                density="compact" variant="outlined" color="indigo"
                                label="Descripción" placeholder="..." hide-details
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
        title: {
            type: String,
            required: true,
            default: 'Nuevo Concepto'
        },
        ver: {
            type: Boolean,
            required: false
        },
        idConceptoTipoMov: {
            type: Number,
            required: false,
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
        const localTitle = ref(props.title)
        const localView = ref(props.ver)
        watch(() => props.show, (val) => {
            localShow.value = val
            if (val) {
                getTipoMovimientos()
            }
        })
        watch(() => props.editar, (val) => {
            localEdit.value = val
            if (val) {
                data.concepto.idConceptoTipoMov = props.idConceptoTipoMov
                getConcepto()
            }
        })
        watch(() => props.prov, (val) => {
            concepto.value = val
        })
        watch(() => props.title, (val) => {
            localTitle.value = val
        })
        watch(() => props.ver, (val) => {
            localView.value = val
            if (val) {
                data.concepto.idConceptoTipoMov = props.idConceptoTipoMov
                getConcepto()
            }
        })

        const data = reactive({
            nowDate: new Date(),
            tipoMovs: [],
            rules: {
                rule: [v => !!v || 'El campo es obligatorio']
            },
            concepto: {
                idConceptoTipoMov: null,
                idTipoMovimiento: null,
                codigo: null,
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

        async function getConcepto() {
            data.overlay.show = true
            const result = await data.requestHttp.getConceptosById(data.concepto.idConceptoTipoMov)
            data.overlay.show = false

            if (result.code === 200) {
                data.concepto = result.data
            }
        }

        async function getTipoMovimientos() {
            data.tipoMovs = []

            data.overlay.show = true
            const result = await data.requestHttp.getCombobox('api/tipos-movimiento/combobox')
            data.overlay.show = false

            if (result.code === 200) {
                data.tipoMovs = result.data.map(item => (
                    {title: `${item.codigo}-${item.nombre}`, value: item.id}
                ))
            }
        }

        return {
            localShow,
            localEdit,
            localTitle,
            localView,
            data,
            store,
            showAlert,
            showSuccesAlert,
            getConcepto,
            getTipoMovimientos
        }
    },

    methods: {
        async handleSave() {
            const valid = await this.$refs.form.validate()
            if (!valid.valid) return
            const usuario = this.store.getNameUser()
            this.data.concepto.usuarioRegistro = String(usuario)
            if (!this.localEdit) {
                this.data.disabledBtn = true
                this.data.overlay.show = true

                const result = await this.data.requestHttp.postConceptos({
                    "idTipoMovimiento": this.data.concepto.idTipoMovimiento,
                    "codigo": this.data.concepto.codigo,
                    "nombre": this.data.concepto.nombre,
                    "descripcion": this.data.concepto.descripcion,
                    "usuarioRegistro": this.data.concepto.usuarioRegistro
                })

                this.data.disabledBtn = false
                this.data.overlay.show = false
                if (result.code === 200) {
                    this.showSuccesAlert(`¡${result.data.msg}!`, true)
                    setTimeout(() => {
                        this.clearData()
                        this.closeDialog()
                        this.localEdit = false
                    }, 1500);
                } else {
                    this.showAlert('No se pudo guardar el registro', 'error')
                    return
                }
            } else {
                this.data.disabledBtn = true
                this.data.overlay.show = true

                const result = await this.data.requestHttp.putConceptos({
                    "idTipoMovimiento": this.data.concepto.idTipoMovimiento,
                    "codigo": this.data.concepto.codigo,
                    "nombre": this.data.concepto.nombre,
                    "descripcion": this.data.concepto.descripcion,
                    "usuarioRegistro": this.data.concepto.usuarioRegistro
                }, this.data.concepto.idConceptoTipoMov)

                this.data.disabledBtn = false
                this.data.overlay.show = false
                if (result.code === 200) {
                    this.showSuccesAlert(`¡${result.data.msg}!`, true)
                    setTimeout(() => {
                        this.clearData()
                        this.closeDialog()
                        this.localEdit = false
                    }, 1500);
                } else {
                    this.showAlert('No se pudo editar el registro', 'error')
                    return
                }
            }
        },

        clearData() {
            this.data.concepto.descripcion = null
            this.data.concepto.nombre = null
            this.data.concepto.usuarioRegistro = null
        },

        formatedDate(dataString) {
            const value = formatters.formatDate(dataString)
            return value
        },

        closeDialog() {
            this.$emit('closeDialog', false)
            this.data.concepto = {
                idConceptoTipoMov: null,
                idTipoMovimiento: null,
                codigo: null,
                nombre: null,
                descripcion: null,
                usuarioRegistro: null
            }
        },

        readonlyOption(viewCode = null) {
            if (this.localView) {
                return true
            } else if(this.editar) {
                if (viewCode) {
                    return true
                }
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