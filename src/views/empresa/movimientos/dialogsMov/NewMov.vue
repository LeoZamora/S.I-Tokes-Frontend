<template>
    <v-dialog v-model="localShow" max-width="600" persistent>
        <v-card id="diag-fact">
            <v-card-title class="bg-indigo-darken-4 d-flex align-center">
                <h5><v-icon>mdi-bank-transfer</v-icon>{{ localTitle }}</h5>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text id="body-card" class="">
                <v-row dense class="pb-0">
                    <v-col cols="12" md="12" sm="12" class="d-flex justify-end align-center pb-0">
                        <div v-if="!localEdit" class="d-flex justify-end align-center">
                            <small class="mr-2">Fecha de Registro: </small>
                            <small><strong>{{ localEdit ? '' : formatedDate(data.nowDate) }}</strong></small>
                        </div>
                    </v-col>
                </v-row>
                <v-card-subtitle class="d-flex align-center text-center my-2">
                    <small class="mr-2 font-weight-bold">GENERALES</small>
                    <v-divider/>
                </v-card-subtitle>
                <v-form ref="form">
                    <v-row dense>
                        <v-col cols="12" md="6" sm="6">
                            <v-autocomplete v-model="data.movimiento.idTipoMovimiento" prepend-inner-icon="mdi-transfer" 
                                density="compact" :items="data.tiposMov" variant="outlined" :hide-details="data.hide ? true : false" 
                                label="Tipo de Movimiento" placeholder="ingrese el tipo de movimiento" @update:model-value="getConcepto"
                                persistent-placeholder :rules="data.rules.rule" :readonly="readonlyOption()" />
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-autocomplete v-model="data.movimiento.idConceptoTipoMov" prepend-inner-icon="mdi-file-document-edit-outline" 
                                density="compact" :items="data.conceptos" variant="outlined" :hide-details="data.hide ? true : false" 
                                label="Concepto del Movimiento" placeholder="ingrese el concepto"
                                persistent-placeholder :rules="data.rules.rule" :readonly="readonlyOption()" />
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-autocomplete v-model="data.movimiento.idModalidad" prepend-inner-icon="mdi-format-list-bulleted" 
                                density="compact" :items="data.modalidades" variant="outlined" :hide-details="data.hide ? true : false" 
                                label="Modalidad" placeholder="ingrese una modalidad" persistent-placeholder :rules="data.rules.rule" 
                                :readonly="readonlyOption()" />
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-text-field v-model="data.movimiento.numReferencia" prepend-inner-icon="mdi-pound-box-outline" density="compact"
                                variant="outlined" :hide-details="data.hide ? true : false" label="No. Referencia" placeholder="ingrese el número de referencía"
                                persistent-placeholder :rules="data.rules.rule" :readonly="readonlyOption()" />
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-text-field v-model="data.movimiento.monto" prepend-inner-icon="mdi-currency-usd" density="compact"
                                variant="outlined" :hide-details="data.hide ? true : false" label="Monto" placeholder="ingrese el monto"
                                persistent-placeholder :rules="data.rules.rule" :readonly="readonlyOption()" type="number" />
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-text-field v-model="data.movimiento.fechaMovimiento" prepend-inner-icon="mdi-calendar" density="compact"
                                variant="outlined" :hide-details="data.hide ? true : false" label="Fecha de Movimiento" placeholder="ingrese la fecha de movimiento"
                                persistent-placeholder :rules="data.rules.rule" :readonly="readonlyOption()" type="date" />
                        </v-col>

                        <v-col cols="12" md="12" sm="12">
                            <v-textarea v-model="data.movimiento.observaciones" prepend-inner-icon="mdi-text-box-outline" density="compact" rows="2"
                                variant="outlined" :hide-details="data.hide ? true : false" label="Observaciones" placeholder="ingrese el una categoría"
                                persistent-placeholder :rules="data.rules.rule" :readonly="readonlyOption()" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider/>
            <v-card-actions v-if="!localView">
                <v-btn color="grey" variant="outlined" @click="closeDialog()">
                    Cancelar
                </v-btn>
                <v-btn class="bg-primary" @click="handleSave()">
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { formatters } from '@/helpers/formatters';
import { utilsFunctions } from '@/helpers/utilFunctions';
import endPoints from '@/services/endPoints';
import RequestHttp from '@/services/requestHttp';
import { reactive, ref, watch } from 'vue';

export default {
    mounted() {
        this.getData()
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
        mov: {
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
        const token = ref(JSON.parse(localStorage.getItem('token')))
        const localShow = ref(props.show)
        const localEdit = ref(props.editar)
        const localMov = ref(props.mov)
        const localTitle = ref(props.title)
        const localView = ref(props.ver)

        async function getConcepto() {
            data.conceptos = []
            if (!data.movimiento.idTipoMovimiento) return

            const result = await data.requestHttp.getConceptoMov(data.movimiento.idTipoMovimiento)
            result.map(item => {
              data.conceptos.push({title: item.nombre, value: item.id})
            })
        }

        watch(() => props.show, (newValue) => {
            localShow.value = newValue
        })
        watch(() => props.editar, async (val) => {
            localEdit.value = val
            if (val === true) {
                data.movimiento = localMov.value
                await getConcepto()
                const date = new Date(data.movimiento.fechaMovimiento)
                const year = date.getFullYear()
                const mm = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                data.movimiento.fechaMovimiento = `${year}-${mm}-${day}`
                data.idMovimiento = localMov.value.idMovimiento
            }
        })
        watch(() => props.mov, (val) => {
            localMov.value = val
        })
        watch(() => props.title, (val) => {
            localTitle.value = val
        })
        watch(() => props.ver, (val) => {
            localView.value = val
            if (val === true) {
                data.movimiento = localMov.value
                const date = new Date(data.movimiento.fechaMovimiento)
                const year = date.getFullYear()
                const mm = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                data.movimiento.fechaMovimiento = `${year}-${mm}-${day}`
            }
        })

        const data = reactive({
            nowDate: new Date(),
            rules: {
                rule: [v => !!v || 'El campo es obligatorio']
            },
            tiposMov: [],
            conceptos: [],
            modalidades: [],
            movimiento: {
                idTipoMovimiento: null,
                idConceptoTipoMov: null,
                idModalidad: null,
                numReferencia: null,
                monto: null,
                fechaMovimiento: null,
                observaciones: null,
                usuarioRegistro: null
            },
            idMovimiento: null,
            hide: true,
            requestHttp: new RequestHttp()
        })

        return {
            localShow,
            localEdit,
            localTitle,
            localMov,
            localView,
            data,
            token,
            getConcepto
        }
    },

    methods: {
        async getTipoMov() {
            this.data.tiposMov = []
            const result = await this.data.requestHttp.getCombobox(endPoints.getTipoMov)
            if (result.code === 200) {
                result.data.map(item => {
                  this.data.tiposMov.push({title: item.nombre, value: item.id})  
                })
            }
        },

        async getModalidad() {
            this.data.modalidades = []
            const result = await this.data.requestHttp.getCombobox(endPoints.getModalidades)
            if (result.code === 200) {
                result.data.map(item => {
                  this.data.tiposMov.push({title: item.nombre, value: item.id})  
                })
            }
        },

        async getData() {
            await Promise.all([
                this.getTipoMov(),
                this.getModalidad()
            ])
        },

        async handleSave() {
            this.$refs.form.validate()
            this.data.movimiento.usuarioRegistro = this.token.usuario
            const valid = utilsFunctions.objectValidate(this.data.movimiento)
            if (!this.localEdit) {
                if (!valid) {
                    this.data.hide = false
                    setTimeout(() => {
                        this.data.hide = true
                    }, 3000)
                    alert('Complete la informacion de la orden')
                    return
                }
                const result = await this.data.requestHttp.postMov(this.data.movimiento)
    
                if (result !== null) {
                    alert('Registro Guardado')
                    this.$emit('closeDialog', false)
                    this.localEdit = false
                } else {
                    alert('No se pudo guardar el registro')
                }
            } else {
                const result = await this.data.requestHttp.putMov(this.data.movimiento, this.data.idMovimiento)
                if (result !== null) {
                    alert('Registro Editado')
                    this.$emit('closeDialog', false)
                    this.localEdit = false
                } else {
                    alert('No se pudo editar el registro')
                }
            }
        },

        formatedDate(dataString) {
            const value = formatters.formatDate(dataString)
            return value
        },

        closeDialog() {
            this.$emit('closeDialog', false)
            this.data.movimiento = {}
            this.localEdit = false
            this.localView = false
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