<template>
    <v-dialog v-model="localShow" max-width="600" persistent>
        <v-card id="diag-fact">
            <v-card-title class="bg-red-darken-4 d-flex align-center">
                <h5><v-icon>mdi-file-document-outline</v-icon>FACTURA</h5>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text id="body-card" >
                <v-card-subtitle class="d-flex align-center text-center mb-4">
                    <small class="font-weight-bold">GENERALES</small>
                    <v-divider/>
                </v-card-subtitle>
                <v-row>
                    <v-col cols="12" md="12" sm="12">
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey"> Nº Factura:</small>
                            <small><strong>{{ data.factura.numFactura }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey"><strong>C$</strong> Córdobas:</small>
                            <small><strong>{{ data.nio ? 'Si' : 'No' }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Dólares:</small>
                            <small><strong>{{ data.usd ? 'Si' : 'No' }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Fecha Registro:</small>
                            <small><strong>{{ formateDate(data.factura.emision) }}</strong></small>
                        </div>
                        <v-card-subtitle class="d-flex align-center text-center my-4">
                            <v-divider/>
                        </v-card-subtitle>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Cliente:</small>
                            <small><strong>{{ data.factura.cliente }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Cédula:</small>
                            <small><strong>{{ data.factura.cedula }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Emp. Registro:</small>
                            <small><strong>{{ data.factura.empleado }}</strong></small>
                        </div>
                    </v-col>
                </v-row>
                <v-card-subtitle class="d-flex align-center text-center my-4">                    
                    <small class="font-weight-bold">DETALLES</small>
                    <v-divider/>
                </v-card-subtitle>
                <v-row>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table class="border rounded font" density="compact" :headers="data.headers">
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
                    <v-col cols="12" md="6" sm="6">
                        <v-textarea density="compact" variant="outlined" hide-details label="Observaciones" placeholder="ingrese algunos detalles de la factura" 
                            persistent-placeholder rows="3"/>                        
                    </v-col>
                    <v-col cols="12" md="6" sm="6" class="d-flex flex-column justify-end align-end">
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
                    Cerrar
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
        },
        factura: {
            type: Object,
            required: false
        }
    },

    setup(props) {
        const localShow = ref(props.show)
        const localIFact = ref(props.factura)
        watch(() => props.show, (newValue) => {
            localShow.value = newValue
        })
        watch(() => props.factura, (val) => {
            localIFact.value = val
            console.log(val);  
        })

        const data = reactive({
            headers: [
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
                usdTotal: 0.00,
                cliente: 'Cliente Prueba',
                cedula: '0010000001011G',
                empleado: 'Empleado Prueba'
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

        formateDate(dateString) {
            const value = formatters.formatDate(dateString)
            return value
        },

        closeDialog() {
            this.$emit('closeDialog', false)
            this.localShow = false
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
.font{
    font-size: 10px !important;
}
</style>