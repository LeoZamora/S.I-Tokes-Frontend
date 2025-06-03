<template>
    <v-dialog v-model="localShow" max-width="600" persistent>
        <v-card id="diag-fact">
            <v-card-title class="bg-red-darken-4 d-flex align-center">
                <h5><v-icon>mdi-file-document-outline</v-icon>ÓRDEN</h5>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text id="body-card" >
                <v-card-subtitle class="d-flex align-center mb-2">
                    <small class="font-weight-bold">GENERALES</small>
                    <v-spacer />
                    <v-chip size="small" :color="data.orden.estado ? 'green' : 'errror'" :text="data.orden.estado ? 'Activa' : 'Inactiva'" />
                </v-card-subtitle>
                <v-row>
                    <v-col cols="12" md="12" sm="12">
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey"> Nº orden:</small>
                            <small><strong>{{ data.orden.noOrden }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Aprobada:</small>
                            <small><strong>{{ data.orden.aprobada ? 'SI' : 'NO' }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Fecha Registro:</small>
                            <small><strong>{{ formateDate(data.orden.fechaRegistro) }}</strong></small>
                        </div>
                        <v-card-subtitle class="d-flex align-center text-center my-2">
                            <v-divider/>
                        </v-card-subtitle>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Proveedor:</small>
                            <small><strong>{{ data.orden.proveedor }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Emp. Registro:</small>
                            <small><strong>{{ data.orden.usuarioRegistro }}</strong></small>
                        </div>
                    </v-col>
                </v-row>
                <v-card-subtitle class="d-flex align-center text-center my-4">                    
                    <small class="font-weight-bold">DETALLES</small>
                    <v-divider/>
                </v-card-subtitle>
                <v-row>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table hide-default-footer class="border rounded font" density="compact" :headers="data.headers" :items="data.items">
                            <template v-slot:item.costoUnitario="{ item }">
                                <div>{{ formatedCurrency(item.costoUnitario, data.fomates.nio) }}</div>
                            </template>
                            <template v-slot:item.subTotal="{ item }">
                                <div>{{ formatedCurrency(item.subTotal, data.fomates.nio) }}</div>
                            </template>
                        </v-data-table>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-textarea v-model="data.orden.observaciones" density="compact" variant="outlined" hide-details label="Observaciones" placeholder="ingrese algunos detalles de la orden" 
                            persistent-placeholder rows="2" readonly/>
                    </v-col>
                    <v-col cols="12" md="6" sm="6" class="d-flex flex-column justify-end align-end">
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Sub Total: </small>
                            <strong>{{ formatedCurrency(data.factura.subTotal, data.fomates.nio) }}</strong>
                        </div>
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Total: </small>
                            <strong>{{ formatedCurrency(data.factura.total, data.fomates.nio) }}</strong>
                        </div>
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Total $: </small>
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
import RequestHttp from '@/services/requestHttp';
import { reactive, ref, watch } from 'vue';

export default {
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        orden: {
            type: Object,
            required: false
        }
    },

    setup(props) {
        const localShow = ref(props.show)
        const localOrden = ref(props.orden)
        
        watch(() => props.show, async (newValue) => {
            localShow.value = newValue
            if (newValue) {
                const result = await data.requestHttp.getByIdCompra(localOrden.value.idCompra)
                const proveedor = await data.requestHttp.getByIdProveedor(result.idProveedor)
                
                console.log(result);
                data.items = []
                data.idOrden = result.idCompra
                data.orden.idProveedor = result.idProveedor
                data.orden.noOrden = result.noOrden
                data.orden.aprobada = result.aprobada
                data.orden.observaciones = result.observaciones
                data.orden.usuarioRegistro = result.usuarioRegistro
                data.orden.fechaRegistro = result.fechaRegistro
                data.orden.estado = result.estado
                data.orden.proveedor = proveedor.nombre
                result.detalleCompras.map(async (item) => {
                    const product = await data.requestHttp.getByIdProducto(item.idProducto)
                    data.items.push({
                        idCompra: item.idCompra,
                        idProducto: item.idProducto, 
                        cantidad: item.cantidad,
                        costoUnitario: item.costoUnitario,
                        observaciones: item.observaciones,
                        subTotal: item.cantidad * item.costoUnitario,
                        producto: product.nombre
                    })
                    calcularTotals()
                })
            }
        })
        const  calcularTotals = () => {
            let subTotal = 0
            data.factura.subTotal = 0
            data.factura.total = 0
            data.factura.usdTotal = 0

            data.items.forEach(item => {
                subTotal += item.subTotal
            })

            data.factura.subTotal = subTotal
            data.factura.total = data.factura.subTotal
            data.factura.usdTotal = data.factura.total/36.4263
        }
        watch(() => props.orden, (val) => {
            localOrden.value = val
        })

        const data = reactive({
            headers: [
                {title: 'Producto', key: 'producto', align: 'center'},
                {title: 'Cantidad', key: 'cantidad', align: 'center'},
                {title: 'Precio Unit.', key: 'costoUnitario', align: 'center'},
                {title: 'SubTotal', key: 'subTotal', align: 'center'},
            ],
            items: [],
            orden: {
                noOrden: null,
                idProveedor: null,
                proveedor: null,
                aprobada: false,
                observaciones: null,
                usuarioRegistro: null,
                fechaRegistro: null,
                estado: null,
                detalle: []
            },
            factura: {
                subTotal: 0.00,
                total: 0.00,
                usdTotal: 0.00
            },
            nio: true,
            usd: false,
            idOrden: null,
            fomates: {
                nio: 'NIO', 
                usd: 'USD'
            },
            requestHttp: new RequestHttp()
        })

        return {
            localShow,
            localOrden,
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