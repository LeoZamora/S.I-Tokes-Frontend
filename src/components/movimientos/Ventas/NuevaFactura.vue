<template>
    <v-dialog v-model="localShow" max-width="800">
        <v-card id="diag-fact">
            <v-card-title class="bg-red-darken-4 d-flex align-center">
                <h5><v-icon>mdi-file-document-outline</v-icon> NUEVA FACTURA</h5>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text id="body-card">
                <v-row class="pb-0">
                    <v-col cols="12" md="6" sm="6" class="d-flex justify-start align-center pb-0">
                        <small class="mr-2">Nº Factura: </small>
                        <strong>{{ data.factura.numFactura }}</strong>
                    </v-col>
                    <v-col cols="12" md="3" sm="3" class="d-flex justify-start align-center pb-0">
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Emision: </small>
                            <strong>{{ data.factura.emision }}</strong>
                        </div>
                    </v-col>
                    <v-col cols="12" md="3" sm="3" class="d-flex justify-start align-center pb-0">
                        <div class="d-flex align-center">
                            <v-checkbox v-model="data.nio" color="indigo" density="compact" class="label" hide-details>
                                <template v-slot:label>
                                    <span id="checkLabel">Córdobas</span>
                                </template>
                            </v-checkbox>
                            <v-checkbox v-model="data.usd" color="indigo" density="compact" class="label" hide-details>
                                <template v-slot:label>
                                    <span id="checkLabel">Dólares</span>
                                </template>
                            </v-checkbox>
                        </div>
                    </v-col>
                </v-row>
                <v-card-subtitle class="d-flex align-center text-center my-4">
                    <small class="mx-6 font-weight-bold">GENERALES</small>
                    <v-divider/>
                </v-card-subtitle>
                <v-row>
                    <v-col cols="6" md="4" sm="6">
                        <v-text-field density="compact" variant="outlined" hide-details label="Cliente" placeholder="ingrese el nombre del client" 
                            persistent-placeholder/>
                    </v-col>
                    <v-col cols="6" md="4" sm="6">
                        <v-text-field density="compact" variant="outlined" hide-details label="Cédula Cliente" placeholder="ingrese su cédula" 
                            persistent-placeholder/>
                    </v-col>
                    <v-col cols="6" md="4" sm="6">
                        <v-text-field density="compact" variant="outlined" hide-details label="Empleado" placeholder="empleado de registro" 
                            persistent-placeholder/>
                    </v-col>
                </v-row>
                <v-card-subtitle class="d-flex align-center text-center my-4">                    
                    <small class="mx-6 font-weight-bold">PRODUCTOS</small>
                    <v-divider/>
                </v-card-subtitle>
                <v-row>
                    <v-col cols="6" md="4" sm="6">
                        <v-autocomplete density="compact" variant="outlined" hide-details label="Categoría" placeholder="categoría del producto" 
                            persistent-placeholder/>
                    </v-col>
                    <v-col cols="6" md="4" sm="6">
                        <v-autocomplete density="compact" variant="outlined" hide-details label="Productos" placeholder="productos a agregar" 
                            persistent-placeholder/>
                    </v-col>
                    <v-col cols="12" md="4" sm="12" class="d-flex justify-end align-center py-0">
                        <v-btn icon color="red-darken-4" size="small" variant="tonal">
                            <v-icon>mdi-plus</v-icon>
                            <v-tooltip activator="parent" location="bottom">Agregar Producto</v-tooltip>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table class="border rounded" density="compact" :headers="data.headers">
                            <template v-slot:item.opc>
                                <v-tooltip text="Eliminar" location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" color="error" class="mr-1">mdi-delete</v-icon>
                                    </template>
                                </v-tooltip>
                            </template>
                            <template v-slot:item.precio="{ item }">
                                <div>{{ formatedCurrency(item.precio) }}</div>
                            </template>
                        </v-data-table>
                    </v-col>
                    <v-col cols="6" md="6" sm="6">
                        <v-textarea density="compact" variant="outlined" hide-details label="Observaciones" placeholder="ingrese algunos detalles de la factura" 
                            persistent-placeholder rows="3"/>                        
                    </v-col>
                    <v-divider vertical/>
                    <v-col cols="6" md="6" sm="6" class="d-flex flex-column justify-end align-end">
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Sub Total: </small>
                            <strong>{{ formatedCurrency(data.factura.subTotal, data.fomates.nio) }}</strong>
                        </div>
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Iva: </small>
                            <strong>{{ formatedCurrency(data.factura.iva, data.fomates.nio) }}</strong>
                        </div>
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">TOTAL: </small>
                            <strong>{{ formatedCurrency(data.factura.total, data.fomates.nio) }}</strong>
                        </div>
                        <div v-if="data.usd" class="d-flex justify-end align-center">
                            <small class="mr-2">TOTAL $: </small>
                            <strong>{{ formatedCurrency(data.factura.usdTotal, data.fomates.usd) }}</strong>
                        </div>
                    </v-col>
                </v-row>

            </v-card-text>

            <v-divider/>
            <v-card-actions>
                <v-btn color="grey" variant="outlined" @click="closeDialog()">
                    Cancelar
                </v-btn>
                <v-btn class="bg-red-darken-4">
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { formatters } from '@/helpers/formatters';
import { reactive, ref, watch } from 'vue';

export default {
    props: {
        show: {
            type: Boolean,
            required: true,
            default: true
        }
    },

    setup(props) {
        const localShow = ref(props.show)

        watch(() => props.show, (newValue) => {
            localShow.value = newValue
        })

        const data = reactive({
            headers: [
                {title: '', key: 'opc', align: 'center'},
                {title: 'Código', key: 'codigo', align: 'center'},
                {title: 'Producto', key: 'producto', align: 'center'},
                {title: 'Cantidad', key: 'codigo', align: 'center'},
                {title: 'Precio Unit.', key: 'precio', align: 'center'},
                {title: 'Dscto. %.', key: 'dscto', align: 'center'},
                {title: 'SubTotal', key: 'subtotal', align: 'center'},
            ],
            factura: {
                numFactura: "001",
                emision: '01/01/2025',
                subTotal: 0.00,
                iva: 0.00,
                total: 0.00,
                usdTotal: 0.00
            },
            nio: true,
            usd: false,
            fomates: {
                nio: 'NIO', 
                usd: 'USD'
            }
        })

        return {
            localShow,
            data
        }
    },

    methods: {
        formatedCurrency(key, currency) {
            const value = formatters.formatCurrency(key, currency)
            return value
        },

        closeDialog() {
            this.$emit('closeDialog', false)
            this.data.factura = {}
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

