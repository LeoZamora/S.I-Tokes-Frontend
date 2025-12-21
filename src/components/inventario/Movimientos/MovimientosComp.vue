<template>
    <div>
        <v-card class="border-t border-b" elevation="0" rounded="0">
            <template v-slot:prepend>
            <div class="d-flex align-center">
                <!-- Título -->
                    <div class="font-weight-bold d-flex align-center">
                        <v-icon class="me-2" color="primary">
                            mdi-sync-circle
                        </v-icon>
                        <span class="text-h6 font-weight-bold">
                            Movimientos
                        </span>
                    </div>
                </div>
            </template>

            <v-divider /> 

            <v-card-text class="px-0">
                <v-container>
                    <v-row dense class="align-center px-2">
                        <v-col cols="12" sm="4" md="4">
                            <v-text-field v-model="data.search" density="compact" label="Buscar" hide-details 
                                placeholder="Buscar textos" persistent-placeholder color="indigo"
                                variant="outlined"/>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                            <v-autocomplete v-model="data.movimiento" :items="data.movimientos" 
                                density="compact" label="Tipos de Movimientos" hide-details variant="outlined"
                                placeholder="movimientos" persistent-placeholder @update:model-value="filterTipoMov()" color="indigo"/>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" class="d-flex justify-end align-center">
                            <v-btn size="small" icon color="green" class="border mx-2" variant="text" @click="getData()">
                                <v-icon>mdi-refresh</v-icon>
                            </v-btn>
                            <v-btn size="small" icon color="grey" variant="text" class="border" @click="clearData()">
                                <v-icon>mdi-broom</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-divider class="my-2"/> 

                    <v-card-subtitle class="d-flex align-center text-center mb-2">
                        <v-divider /> 
                        <span class="mx-6 text-grey font-weight-bold">Registros</span>
                        <v-divider />
                    </v-card-subtitle>

                    <v-data-table :search="data.search" :headers="data.headers" 
                        :items="data.items" class="border font" density="compact"
                        :row-props="setStyle" hover :header-props="{ class: 'font-weight-bold' }" 
                        :loading="data.loading">
                        <template v-slot:loader>
                            <v-progress-linear color="indigo" indeterminate height="2"/>
                        </template>
                        <template v-slot:loading>
                            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>
                        <template v-slot:item.total="{ item }">
                            <div>{{ formatedCurrency(item.total) }}</div>
                        </template>
                        <template v-slot:item.fechaRegistro="{ item }">
                            <div>{{ formatedDate(item.fechaRegistro) }}</div>
                        </template>
                        <template v-slot:item.aprobada="{ item }">
                            <div>{{ item.aprobada ? 'SI' : 'NO' }}</div>
                        </template>
                        <template v-slot:item.opc="{ item }">
                            <v-menu :close-on-content-click="false" location="right center"
                                origin="auto">
                                <template v-slot:activator="{ props }">
                                    <v-tooltip text="Opciones" location="top">
                                        <template v-slot:activator="{ props: tooltipProps }">
                                            <v-btn size="small" icon variant="text" color="grey-darken-1"
                                                v-bind="{ ...props, ...tooltipProps }" class="hover-scale">
                                                <v-icon>mdi-dots-vertical</v-icon>
                                            </v-btn>
                                        </template>
                                    </v-tooltip>
                                </template>

                                <v-list nav rounded="lg" >
                                    <v-list-item-subtitle class="pa-1">
                                        Opciones
                                    </v-list-item-subtitle>

                                    <v-list-item rounded density="compact" prepend-icon="mdi-eye"
                                        color="indigo" @click="viewDialog(item)">
                                        <template v-slot:title>
                                            <v-divider vertical />
                                            Ver Detalles
                                        </template>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </template>
                        <template v-slot:item.estado="{ item }">
                            <v-chip :color="item.estado ? 'green' : 'error'" small>
                                {{ item.estado ? 'Activo' : 'Inactivo' }}
                            </v-chip>
                        </template>
                    </v-data-table>
                </v-container>
            </v-card-text>
        </v-card>


        <v-dialog v-model="data.dialog" max-width="800" persistent>
            <v-card class="rounded bg-grey-lighten-4">
                <!-- Encabezado mejorado -->
                <v-card-title class="d-flex justify-space-between align-center bg-indigo-darken-4 text-white">
                    <div class="d-flex align-center">
                        <v-avatar color="white" class="me-4">
                            <v-icon color="primary" size="28">mdi-file-document-outline</v-icon>
                        </v-avatar>
                        <div>
                            <h3 class="font-weight-bold mb-1">
                                Detalle del Movimiento
                            </h3>
                            <div class="text-caption opacity-80">
                                Información completa del movimiento seleccionado
                            </div>
                        </div>
                    </div>
                    <v-btn icon @click="data.dialog = false" variant="text" color="white" size="small">
                        <v-icon size="24">mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                
                <!-- Contenido principal -->
                <v-card-text class="pa-4">
                    <!-- Tarjeta de información principal -->
                    <v-card elevation="0" rounded="lg" class="font text-center border pa-4 mb-6">
                        <v-row dense>
                            <!-- Número de Movimiento -->
                            <v-col cols="12" md="3" class="border-e">
                                <div class="d-flex align-center mb-1">
                                    <v-icon color="primary" size="20" class="me-2">
                                        mdi-numeric
                                    </v-icon>
                                    <span class="text-caption text-grey-darken-1">
                                        Nº MOVIMIENTO
                                    </span>
                                </div>
                                <div class="text-h6 font-weight-bold text-primary">
                                    {{ selectedItem.noMov || 'N/A' }}
                                </div>
                            </v-col>

                            <!-- Tipo de Movimiento -->
                            <v-col cols="12" md="3" class="border-e">
                                <div class="d-flex align-center mb-1">
                                    <v-icon color="primary" size="20" class="me-2">
                                        mdi-shape
                                    </v-icon>
                                    <span class="text-caption text-grey-darken-1">
                                        TIPO
                                    </span>
                                </div>
                                <v-chip :color="getTipoColor(selectedItem.tipoMov)" size="small" class="font-weight-bold">
                                    {{ selectedItem.tipoMov || 'N/A' }}
                                </v-chip>
                            </v-col>

                            <!-- Cliente/Proveedor -->
                            <v-col cols="12" md="3" class="font border-e">
                                <div class="d-flex align-center mb-1">
                                    <v-icon color="primary" size="20" class="me-2">mdi-account</v-icon>
                                    <span class="text-caption text-grey-darken-1">
                                        CLIENTE/PROVEEDOR
                                    </span>
                                </div>
                                <div class="text-body-1 font-weight-medium">
                                    {{ selectedItem.clienteProveedor || 'N/A' }}
                                </div>
                            </v-col>

                            <!-- Estado -->
                            <v-col cols="12" md="3" class="text-center">
                                <div class="d-flex justify-center align-center mb-1">
                                    <v-icon color="primary" size="20" class="me-2">
                                        mdi-check-circle
                                    </v-icon>
                                    <span class="text-caption text-grey-darken-1">
                                        ESTADO
                                    </span>
                                </div>

                                <v-chip v-if="selectedItem.noVenta !== null" :color="selectedItem.estado ? 'green' : 'red'" variant="flat" size="small" class="font-weight-bold">
                                    <v-icon start size="16">
                                        {{ selectedItem.estado ? 'mdi-check' : 'mdi-close' }}
                                    </v-icon>
                                    {{ selectedItem.estado ? 'Activa' : 'Anulada' }}
                                </v-chip>

                                <v-chip v-else :color="selectedItem.aprobada ? 'green' : 'red'" variant="flat" size="small" class="font-weight-bold">
                                    <v-icon start size="16">{{ selectedItem.aprobada ? 'mdi-check' : 'mdi-close' }}</v-icon>
                                    {{ selectedItem.aprobada ? 'Aprobada' : 'Pendiente' }}
                                </v-chip>
                            </v-col>
                        </v-row>

                        <!-- Segunda línea de información -->
                        <v-row dense class="mt-4">
                            <!-- Fecha -->
                            <v-col cols="12" md="6">
                                <div class="d-flex align-center">
                                    <v-icon color="grey" size="20" class="me-3">mdi-calendar</v-icon>
                                    <div>
                                        <div class="text-caption text-grey-darken-1">
                                            FECHA REGISTRO
                                        </div>
                                        <div class="font-weight-medium">
                                            {{ formatedDate(selectedItem.fechaRegistro) || 'N/A' }}
                                        </div>
                                    </div>
                                </div>
                            </v-col>

                            <!-- Monto Total -->
                            <v-col cols="12" md="6">
                                <div class="d-flex align-center justify-end">
                                    <div class="text-end me-3">
                                        <div class="text-caption text-grey-darken-1">
                                            MONTO TOTAL
                                        </div>
                                        <div class="text-h5 font-weight-bold text-primary">
                                            {{ formatedCurrency(selectedItem.total) }}
                                        </div>
                                    </div>
                                    <v-avatar size="48" color="primary" variant="tonal">
                                        <v-icon color="primary" size="24">mdi-cash</v-icon>
                                    </v-avatar>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card>

                    <!-- Tabla de productos/detalles -->
                    <v-card elevation="0" rounded="lg" class="border mb-6">
                        <v-card-title class="bg-grey-lighten-4 py-3">
                            <v-icon color="primary" class="me-2">mdi-format-list-bulleted</v-icon>
                            <span class="font-weight-medium">
                                Productos del Movimiento
                            </span>
                        </v-card-title>
                        <v-divider />
                        <v-data-table 
                            :headers="data.headersView" 
                            :items="data.itemsView" 
                            hide-default-footer
                            density="compact"
                            height="200"
                            fixed-header
                            class="elevation-0"
                        >
                            <template v-slot:item.costoUnitario="{ item }">
                                <div class="font-weight-medium">
                                    {{ formatedCurrency(item.costoUnitario, data.fomates.nio) }}
                                </div>
                            </template>
                            <template v-slot:item.subTotal="{ item }">
                                <div class="font-weight-bold">
                                    {{ formatedCurrency(item.subTotal, data.fomates.nio) }}
                                </div>
                            </template>
                            <template v-slot:item.cantidad="{ item }">
                                <v-chip size="small" color="blue" variant="tonal">
                                    {{ item.cantidad }}
                                </v-chip>
                            </template>
                        </v-data-table>
                    </v-card>

                    <!-- Sección inferior: Totales y observaciones -->
                    <v-row>
                        <!-- Observaciones -->
                        <v-col cols="12" md="6">
                            <v-card elevation="0" rounded="lg" class="border h-100">
                                <v-card-title class="bg-grey-lighten-4 py-3">
                                    <v-icon color="primary" class="me-2">mdi-text-box-outline</v-icon>
                                    <span class="font-weight-medium">Observaciones</span>
                                </v-card-title>
                                <v-divider />
                                <v-card-text class="pa-4">
                                    <v-textarea 
                                        v-model="data.orden.observaciones" 
                                        variant="plain" 
                                        hide-details 
                                        label="Detalles adicionales"
                                        placeholder="No hay observaciones registradas"
                                        readonly
                                        auto-grow
                                        rows="3"
                                        class="custom-textarea"
                                    />
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <!-- Totales -->
                        <v-col cols="12" md="6">
                            <v-card elevation="0" rounded="lg" class="border h-100">
                                <v-card-title class="bg-grey-lighten-4 py-3">
                                    <v-icon color="primary" class="me-2">
                                        mdi-calculator
                                    </v-icon>
                                    <span class="font-weight-medium">
                                        Resumen Financiero
                                    </span>
                                </v-card-title>
                                <v-divider />
                                <v-card-text class="pa-4">
                                    <v-list density="compact" class="pa-0">
                                        <v-list-item class="px-0">
                                            <template v-slot:prepend>
                                                <div class="text-caption text-grey-darken-1">
                                                    Sub Total:
                                                </div>
                                            </template>
                                            <v-list-item-title class="text-end font-weight-medium">
                                                {{ formatedCurrency(data.factura.subTotal, data.fomates.nio) }}
                                            </v-list-item-title>
                                        </v-list-item>

                                        <v-divider class="my-2" />

                                        <v-list-item class="px-0">
                                            <template v-slot:prepend>
                                                <div class="text-caption text-grey-darken-1">
                                                    Total C$:
                                                </div>
                                            </template>
                                            <v-list-item-title class="text-end text-h6 font-weight-bold text-primary">
                                                {{ formatedCurrency(data.factura.total, data.fomates.nio) }}
                                            </v-list-item-title>
                                        </v-list-item>

                                        <v-divider class="my-2" />

                                        <v-list-item class="px-0">
                                            <template v-slot:prepend>
                                                <div class="text-caption text-grey-darken-1">
                                                    Total USD:
                                                </div>
                                            </template>
                                            <v-list-item-title class="text-end text-h6 font-weight-bold text-green-darken-2">
                                                {{ formatedCurrency(data.factura.usdTotal, data.fomates.usd) }}
                                            </v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
                
                <!-- Acciones -->
                <v-divider />
                <v-card-actions class="pa-2 bg-grey-lighten-4">
                    <v-spacer />
                    <v-btn 
                        color="grey-darken-2" 
                        variant="tonal" 
                        @click="closeDialog()" 
                        prepend-icon="mdi-close"
                    >
                        Cerrar
                    </v-btn>
                </v-card-actions>
                <OverlayComp :show="data.overlay.show"/>
            </v-card>

        </v-dialog>
    </div>
</template>

<script>
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';
import RequestHttp from '@/services/requestHttp';
import { formatters } from '@/helpers/formatters';
import { reactive, ref } from 'vue';

export default {
    mounted() {
        this.getData()
    },

    components: {
        OverlayComp
    },

    setup() {
        const getTipoColor = (tipo) => {
            const colors = {
                'VENTA': 'green',
                'COMPRA': 'blue',
                'AJUSTE': 'orange',
                'TRANSFERENCIA': 'purple',
                'DEVOLUCION': 'red'
            }
            return colors[tipo] || 'grey'
        }

        const calcularTotals = () => {
            let subtotal = 0
            data.factura.subTotal = 0.00
            data.factura.total = 0.00
            data.factura.usdTotal = 0.00
            data.itemsView.forEach(item => {
                item.subTotal = item.costoUnitario * item.cantidad
                subtotal += item.subTotal

            })
            data.factura.subTotal = subtotal
            data.factura.total = data.factura.subTotal
            data.factura.usdTotal = data.factura.total / 36.6243
        }
        const getCliente = async (id) => {
            const result = await data.requestHttp.getByIdCliente(id)
            return result.codigo
        }
        const getVenta = async (id) => {
            data.itemsView = []
            data.overlay.show = true
            const result = await data.requestHttp.getByIdVenta(id)

            if (result.code === 200) {
                data.venta.credito = result.data.credito
                data.venta.enviarA = result.data.enviarA
                data.venta.idCliente = result.data.idCliente
                data.venta.noVenta = result.data.noVenta
                data.venta.cliente = await getCliente(result.data.idCliente)
                data.venta.observaciones = result.data.observaciones
                data.venta.usuarioRegistro = result.data.usuarioRegistro
                data.venta.estado = result.data.estado
                data.venta.fechaRegistro = result.data.fechaRegistro
                data.venta.idVenta = result.data.idVenta
                data.venta.idClienteNavigation = result.data.idClienteNavigation
    
                if (result.data.detalleCxcs?.length > 0) {
                    result.data.detalleCxcs.map(item => {
                        data.venta.detalleCxcs.push(item)
                    })
                }

                const promises = result.data.detalleVenta.map(async (item) => {
                    const product = await data.requestHttp.getByIdProducto(item.idProducto)
    
                    data.itemsView.push({
                        idDetalleVenta: item.idDetalleVenta,
                        idVenta: item.idVenta,
                        idProducto: item.idProducto,
                        cantidad: item.cantidad,
                        costoUnitario: item.precioUnitario,
                        observaciones: item.observaciones,
                        idProductoNavigation: item.idProductoNavigation,
                        idVentaNavigation: item.idVentaNavigation,
                        producto: product.nombre,
                        subTotal: item.cantidad * item.precioUnitario
                    })
                })
                await Promise.all(promises)
                calcularTotals()   
            }

            data.overlay.show = false

        }

        const getCompra = async (id) => {
            data.overlay.show = true
            const result = await data.requestHttp.getByIdCompra(id)
            const proveedor = await data.requestHttp.getByIdProveedor(result.idProveedor)
            data.overlay.show = false

            data.itemsView = []
            data.orden.idOrden = result.idCompra
            data.orden.idProveedor = result.idProveedor
            data.orden.noOrden = result.noOrden
            data.orden.aprobada = result.aprobada
            data.orden.observaciones = result.observaciones
            data.orden.usuarioRegistro = result.usuarioRegistro
            data.orden.fechaRegistro = result.fechaRegistro
            data.orden.estado = result.estado
            data.orden.proveedor = proveedor.nombre
            await Promise.all(result.detalleCompras.map(async (item) => {
                const product = await data.requestHttp.getByIdProducto(item.idProducto)
                data.itemsView.push({
                    idCompra: item.idCompra,
                    idProducto: item.idProducto, 
                    cantidad: item.cantidad,
                    costoUnitario: item.costoUnitario,
                    observaciones: item.observaciones,
                    subTotal: item.cantidad * item.costoUnitario,
                    producto: product.nombre
                })
            }))
            calcularTotals()
        }

        const filterTipoMov = async () => {
            data.items = data.itemsBack.filter(item => item.tipoMov === data.movimiento)
        }

        const data = reactive({
            headers: [
                {title: '', key: 'opc', align: 'center',
                    headerProps: {
                        class: 'pa-0'
                    },
                    cellProps: {
                        class: 'pa-0'
                    }
                },
                {title: 'Nº Mov', key: 'noMov', align: 'center'},
                {title: 'Tipo Mov', key: 'tipoMov', align: 'center'},
                {title: 'Cliente-Proveedor', key: 'clienteProveedor', align: 'center'},
                {title: 'Vendedor', key: 'usuarioRegistro', align: 'center'},
                {title: 'Monto', key: 'total', align: 'center'},
                {title: 'FechaRegistro', key: 'fechaRegistro', align: 'center'},
                {title: 'Observaciones', key: 'observaciones', align: 'center'},
                {title: 'Estado', key: 'estado', align: 'center'},
            ],
            headersView: [
                {title: 'Producto', key: 'producto', align: 'center'},
                {title: 'Cantidad', key: 'cantidad', align: 'center'},
                {title: 'costoUnitario Unit.', key: 'costoUnitario', align: 'center'},
                {title: 'SubTotal', key: 'subTotal', align: 'center'},
            ],
            itemsBack: [],
            items: [],
            venta: {
                noVenta: null,
                idCliente: null,
                credito: false,
                cliente: null,
                observaciones: null,
                enviarA: null,
                usuarioRegistro: null,
                detalleVenta: [],
                idVenta: null,
                fechaRegistro: null,
                estado: false,
                idClienteNavigation: null,
                detalleCxcs: [],
            },
            orden: {
                idOrden: null,
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
            itemsView: [],
            factura: {
                subTotal: 0.00,
                total: 0.00,
                usdTotal: 0.00,
            },
            movimientos: [
                {title: 'Venta', value: 'Venta'},
                {title: 'Compra', value: 'Compra'},
            ],
            nio: true,
            usd: false,
            idOrden: null,
            fomates: {
                nio: 'NIO', 
                usd: 'USD'
            },
            // Overlay
            overlay: {
                show: false
            },
            loading: false,
            movimiento: null,
            producto: null,
            dialog: false,
            search: null,
            requestHttp: new RequestHttp()
        })
        const selectedItem = ref({});

        return {
            data,
            selectedItem,
            getCompra,
            getVenta,
            filterTipoMov,
            getTipoColor
        }
    },

    methods: {
        setStyle({index}) {
            return {
            class: index % 2 === 0 ? 'bg-white' : 'bg-indigo-lighten-5',
            }
        },

        async getOrdenes() {            
            this.data.loading = true
            this.data.overlay.show = true
            const result = await this.data.requestHttp.getCompras()
            this.data.loading = false
            if (result !== null) {
                result.map(item => {
                    this.data.items.push({
                        ...item,
                        clienteProveedor: item.proveedor,
                        tipoMov: 'Compra',
                        noMov: item.noOrden
                    })
                })
            }
            this.data.overlay.show = false
        },

        async getVentas() {    
            this.data.overlay.show = true
            const result = await this.data.requestHttp.getVentas()
            
            if (result !== null) {
                result.map(item => {
                    this.data.items.push({
                        ...item,
                        clienteProveedor: item.cliente,
                        tipoMov: 'Venta',
                        noMov: item.noVenta
                    })
                })
            }

            this.data.overlay.show = false
        },

        async getData () {
            this.data.items = []
            this.data.loading = true
            await Promise.all([
                this.getVentas(),
                this.getOrdenes()
            ])
            this.data.itemsBack = this.data.items
            this.data.loading = false
        },

        formatedCurrency(key, currency) {
            const value = formatters.formatCurrency(key, currency)
            return value
        },
        
        formatedDate(dataString) {
            const value = formatters.formatDate(dataString)
            return value
        },

        viewDialog(item) {
            if (item.tipoMov === 'Venta') {
                this.getVenta(item.idVenta)
            } else {
                this.getCompra(item.idCompra)
            }
            this.selectedItem = { ...item }
            this.data.dialog = true
        },

        clearData() {
            this.data.movimiento = null
            this.data.search = null
            this.getData()
        },

        closeDialog() {
            this.data.dialog = false
            this.data.itemsView = []
            this.data.factura.subTotal = 0.00
            this.data.factura.total = 0.00
            this.data.factura.usdTotal = 0.00
        }
    }

}
</script>

<style scoped>
.dashed {
    border: 1px grey dashed;
}

.font {
    font-size: 12px !important;
}
</style>