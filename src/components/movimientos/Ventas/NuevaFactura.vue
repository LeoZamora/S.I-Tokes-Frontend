<template>
    <v-dialog v-model="localShow" max-width="800" persistent>
        <v-card id="diag-fact">
            <v-card-title class="bg-red-darken-4 d-flex align-center">
                <h5><v-icon>mdi-file-document-outline</v-icon>{{ localTitle }}</h5>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text id="body-card" class="">
                <v-row class="pb-0">
                    <v-col cols="6" md="4" sm="6" class="d-flex justify-start align-center pb-0">
                        <small class="mr-2">Nº Factura: </small>
                        <strong>{{ data.factura.numFactura }}</strong>
                    </v-col>
                    <v-col cols="6" md="4" sm="3" class="d-flex justify-start align-center pb-0">
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Emision: </small>
                            <small><strong>{{ localEdit ? '' : formatedDate(data.emision) }}</strong></small>
                        </div>
                    </v-col>
                    <v-col cols="12" md="4" sm="3" class="d-flex justify-start align-center pb-0">
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
                    <v-col cols="12" md="4" sm="6">
                        <v-text-field prepend-inner-icon="mdi-account" density="compact" variant="outlined" hide-details label="Cliente" 
                            placeholder="ingrese el nombre del cliente" persistent-placeholder/>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                        <v-text-field prepend-inner-icon="mdi-card-account-details" density="compact" variant="outlined" hide-details 
                            label="Cédula Cliente" placeholder="ingrese su cédula" persistent-placeholder/>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                        <v-text-field prepend-inner-icon="mdi-account-cog" density="compact" variant="outlined" hide-details 
                            label="Empleado" placeholder="empleado de registro" persistent-placeholder/>
                    </v-col>
                </v-row>
                <v-card-subtitle class="d-flex align-center text-center my-4">                    
                    <small class="mx-6 font-weight-bold">PRODUCTOS</small>
                    <v-divider/>
                </v-card-subtitle>
                <v-row>
                    <v-col cols="12" md="4" sm="6">
                        <v-autocomplete v-model="data.producto.categoria" :items="data.tipoProductos" prepend-inner-icon="mdi-tag" density="compact" variant="outlined" hide-details label="Categoría" 
                            placeholder="categoría del producto"  persistent-placeholder/>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                        <v-text-field v-model="data.producto.producto" prepend-inner-icon="mdi-shopping" density="compact" variant="outlined" hide-details 
                            label="Productos" placeholder="productos a agregar" persistent-placeholder/>
                    </v-col>
                    <v-col cols="6" md="4" sm="6">
                        <v-text-field v-model="data.producto.precio" prepend-inner-icon="mdi-cash-multiple" density="compact" variant="outlined" hide-details 
                            label="Precio" placeholder="precio del producto" persistent-placeholder type="number"/>
                    </v-col>
                    <v-col cols="6" md="4" sm="6">
                        <v-text-field v-model="data.producto.cantidad" prepend-inner-icon="mdi-numeric" density="compact" variant="outlined" hide-details 
                            label="Cantidad" placeholder="cantidad de productos" persistent-placeholder type="number"/>
                    </v-col>
                    <v-col cols="6" md="4" sm="6">
                        <v-text-field v-model="data.producto.dscto" prepend-inner-icon="mdi-percent" density="compact" variant="outlined" hide-details 
                            label="Descuento" placeholder="descuento del producto" persistent-placeholder type="number"/>
                    </v-col>
                    <v-col cols="6" md="4" sm="6" class="d-flex justify-end align-center py-0">
                        <v-btn icon class="border mr-2" color="grey" size="small" variant="text" @click="clearProductos()">
                            <v-icon>mdi-broom</v-icon>
                            <v-tooltip activator="parent" location="bottom">Limpiar</v-tooltip>
                        </v-btn>

                        <v-btn icon color="red-darken-4" size="small" variant="tonal" @click="agregarProducto()">
                            <v-icon>mdi-plus</v-icon>
                            <v-tooltip activator="parent" location="bottom">Agregar Producto</v-tooltip>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table class="border rounded font" density="compact" :headers="data.headers" :items="data.factura.productos">
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
                            <template v-slot:item.subtotal="{ item }">
                                <div>{{ formatedCurrency(item.subTotal) }}</div>
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
                            <strong>{{ formatedCurrency(data.factura.subTotal, data.fornates.nio) }}</strong>
                        </div>
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Iva: </small>
                            <strong>{{ formatedCurrency(data.factura.iva, data.fornates.nio) }}</strong>
                        </div>
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">TOTAL: </small>
                            <strong>{{ formatedCurrency(data.factura.total, data.fornates.nio) }}</strong>
                        </div>
                        <div v-if="data.usd" class="d-flex justify-end align-center">
                            <small class="mr-2">TOTAL $: </small>
                            <strong>{{ formatedCurrency(data.factura.usdTotal, data.fornates.usd) }}</strong>
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
import { utilsFunctions } from '@/helpers/utilFunctions';
import { reactive, ref, watch } from 'vue';

export default {
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        editar: {
            type: Boolean,
            required: false
        },
        factura: {
            type: Object,
            required: false
        },
        title: {
            type: String,
            required: true,
            default: 'Nueva Factura'
        }
    },

    setup(props) {
        const localShow = ref(props.show)
        const localEdit = ref(props.editar)
        const localFact = ref(props.factura)
        const localTitle = ref(props.factura)
        watch(() => props.show, (newValue) => {
            localShow.value = newValue
        })
        watch(() => props.editar, (val) => {
            localEdit.value = val
        })
        watch(() => props.factura, (val) => {
            localFact.value = val
        })
        watch(() => props.title, (val) => {
            localTitle.value = val
        })

        const data = reactive({
            headers: [
                {title: '', key: 'opc', align: 'center'},
                {title: 'Código', key: 'codigo', align: 'center'},
                {title: 'Categoría', key: 'categoria', align: 'center'},
                {title: 'Producto', key: 'producto', align: 'center'},
                {title: 'Cantidad', key: 'cantidad', align: 'center'},
                {title: 'Precio Unit.', key: 'precio', align: 'center'},
                {title: 'Dscto. %.', key: 'dscto', align: 'center'},
                {title: 'SubTotal', key: 'subtotal', align: 'center'},
            ],
            producto: {
                categoria: null,
                codigo: 'Axxx',
                producto: null,
                cantidad: 0,
                precio: 0.00,
                dscto: 0.00,
                subTotal: 0.00
            },
            tipoProductos: [
                {title: 'Camisas', key: 'Camisas'},
                {title: 'Pantalones', key: 'pantalones'},
            ],
            factura: {
                numFactura: '001',
                cliente: null,
                cedula: null,
                empleadoRegistro: null,
                productos: [{
                    codigo: 'A001',
                    producto: 'Camisa',
                    cantidad: 2,
                    precio: 300,
                    dscto: 0.00,
                    subTotal: 0
                }, {
                    codigo: 'A002',
                    producto: 'Pantalon',
                    cantidad: 2,
                    precio: 400,
                    dscto: 0.00,
                    subTotal: 0
                }],
                subTotal: 0.00,
                iva: 0.00,
                total: 0.00,
                usdTotal: 0.00
            },
            emision: new Date(),
            nio: true,
            usd: false,
            fornates: {
                nio: 'NIO', 
                usd: 'USD'
            }
        })

        return {
            localShow,
            localEdit,
            localFact,
            localTitle,
            data
        }
    },

    methods: {
        formatedCurrency(key, currency) {
            const value = formatters.formatCurrency(key, currency)
            return value
        },

        formatedDate(dataString) {
            const value = formatters.formatDate(dataString)
            return value
        },

        closeDialog() {
            this.$emit('closeDialog', false)
            this.data.factura.cliente = null
            this.data.factura.cedula = null
            this.data.factura.empleadoRegistro = null
            this.data.factura.productos = []
            this.data.factura.subTotal = 0.00
            this.data.factura.iva = 0.00
            this.data.factura.total = 0.00
            this.data.factura.usdTotal = 0.00
            this.clearProductos()
        },

        agregarProducto() {
            const go = this
            var desc = 0
            const dataValid = utilsFunctions.objectValidate(this.data.producto)
            if (!dataValid) {
                console.log('Ingrese todos los campos', dataValid);
                return
            } else {
                this.data.factura.productos.push({
                    codigo: this.data.producto.codigo,
                    categoria: this.data.producto.categoria,
                    producto: this.data.producto.producto,
                    cantidad: this.data.producto.cantidad,
                    precio: this.data.producto.precio,
                    dscto: this.data.producto.dscto,                    
                })
                this.calcularFactura()
            }
        },

        clearProductos() {
            this.data.producto.cantidad = 0.00
            this.data.producto.categoria = null
            this.data.producto.precio = 0.00
            this.data.producto.subTotal = 0.00
            this.data.producto.dscto = 0.00
            this.data.producto.producto = null
        },

        calcularFactura() {
            let subtotal = 0
            let desc = 0
            this.data.factura.subTotal = 0.00
            this.data.factura.iva = 0.00
            this.data.factura.total = 0.00
            this.data.factura.usdTotal = 0.00
            this.data.factura.productos.forEach(item => {
                if (item.dscto !== 0.00) {
                    desc = item.dscto/100
                    item.subTotal = (item.precio * item.cantidad) - ((item.precio * item.cantidad)*desc)
                    subtotal += item.subTotal
                } else {
                    item.subTotal = item.precio * item.cantidad
                    subtotal += item.subTotal
                }

            })
            this.data.factura.subTotal = subtotal
            this.data.factura.iva = subtotal * 0.15
            this.data.factura.total = this.data.factura.subTotal + this.data.factura.iva
            this.data.factura.usdTotal = this.data.factura.total / 36.6243
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
    font-size: 12px !important;
}
</style>

