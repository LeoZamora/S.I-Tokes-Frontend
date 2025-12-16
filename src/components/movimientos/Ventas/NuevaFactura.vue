<template>
    <div>
        <v-dialog v-model="localShow" max-width="900" persistent>
            <v-card  elevation="12" class="bg-grey-lighten-4">
                <!-- Header mejorado con gradiente y sombra -->
                <v-card-title class="bg-indigo-darken-4 d-flex align-center py-2 px-3">
                    <v-avatar size="40" color="white" class="mr-4" variant="flat">
                        <v-icon color="primary" size="24">mdi-file-document-outline</v-icon>
                    </v-avatar>
                    <h5 class="text-white font-weight-bold text-h6">
                        {{ localTitle }}
                    </h5>
                    <v-spacer />
                    <v-btn icon size="small" color="white" variant="text" @click="closeDialog()" class="ml-2">
                        <v-icon size="24">mdi-close</v-icon>
                        <v-tooltip activator="parent" location="top" text="Cerrar" />
                    </v-btn>
                </v-card-title>

                <!-- Indicador de estado -->
                <div class="status-bar d-flex align-center px-3 py-2 bg-grey-lighten-4">
                    <v-chip size="small" class="mr-2" color="primary" variant="flat">
                        <v-icon size="16" class="mr-1">mdi-information</v-icon>
                        <span class="font-weight-bold">Nº Factura: {{ data.venta.noVenta }}</span>
                    </v-chip>
                    <v-chip size="small" class="mr-2" color="grey-darken-1" variant="flat">
                        <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
                        <span>
                            Emisión: 
                            {{ localEdit ? formatedDate(data.editVenta.fechaRegistro) : formatedDate(data.emision) }}
                        </span>
                    </v-chip>
                    <v-spacer />
                    <div class="d-flex align-center">
                        <v-chip size="small" :color="data.usd ? 'deep-purple' : 'grey'" variant="tonal"
                            @click="data.usd = !data.usd" class="mr-1">
                            <template v-slot:default>
                                <v-icon v-if="data.usd" size="16" class="mr-1">
                                    mdi-check
                                </v-icon>

                                <v-icon size="16" class="mr-1">
                                    mdi-currency-usd
                                </v-icon>
                                <span>
                                    Dólares
                                </span>

                                <v-tooltip activator="parent" location="top center">
                                    {{ data.usd ? 'Ocultar' : 'Ver en Dólares' }}
                                </v-tooltip>
                            </template>
                        </v-chip>

                        <!-- <v-chip size="small" :color="data.nio ? 'green' : 'grey'" variant="tonal"
                            @click="data.nio = !data.nio">
                            Córdobas
                        </v-chip> -->
                        <v-chip size="small" :color="data.venta.credito ? 'orange' : 'grey'" variant="tonal" 
                            @click="data.venta.credito = !data.venta.credito">
                            <template v-slot:default >
                                <v-icon v-if="data.venta.credito" size="16" class="mr-1">
                                    mdi-check
                                </v-icon>
                                <v-icon size="16" class="mr-1">
                                    mdi-credit-card-outline
                                </v-icon>
                                <span>
                                    Crédito
                                </span>

                                <v-tooltip activator="parent" location="top center">
                                    Cambiar a {{ data.venta.credito ? 'Contado' : 'Crédito' }}
                                </v-tooltip>
                            </template>
                        </v-chip>
                    </div>
                </div>

                <v-card-text class="px-4">
                    <v-form validate-on="invalid-input" ref="form">
                        <v-row dense>
                            <v-col cols="12" md="6" sm="6">
                                <v-card class="pa-4 border" rounded="lg" elevation="0">
                                    <v-row dense>
                                        <!-- Sección Generales -->
                                        <div class="section-header mb-4">
                                            <div class="d-flex align-center">
                                                <div class="section-icon mr-3">
                                                    <v-icon color="primary" size="28">mdi-cog-outline</v-icon>
                                                </div>
                                                <h6 class="text-h6 font-weight-bold text-primary">
                                                    Generales
                                                </h6>
                                                <v-divider class="ml-4" />
                                            </div>
                                        </div>
                                        <v-col cols="12" md="12" sm="12">
                                            <v-text-field 
                                                :rules="data.rules.rule" 
                                                v-model="data.venta.noVenta"
                                                prepend-inner-icon="mdi-shopping" 
                                                density="compact"
                                                variant="outlined"
                                                hide-details
                                                label="Nº Factura"
                                                placeholder="nº factura"
                                                persistent-placeholder
                                                readonly
                                                color="primary"
                                                bg-color="grey-lighten-4"
                                            />
                                        </v-col>
                                        <v-col cols="12" md="12" sm="12">
                                            <v-autocomplete 
                                                :rules="data.rules.rule" 
                                                v-model="data.venta.idTipoVenta"
                                                :items="data.tipoVenta"
                                                prepend-inner-icon="mdi-file-document-check"
                                                density="compact"
                                                variant="outlined"
                                                hide-details
                                                label="Tipo de Venta"
                                                placeholder="Seleccione tipo"
                                                persistent-placeholder
                                                clearable
                                                color="primary"
                                            />
                                        </v-col>
                                        <v-col cols="12" md="12" sm="12">
                                            <v-autocomplete 
                                                :rules="data.rules.rule" 
                                                v-model="data.venta.idCliente"
                                                prepend-inner-icon="mdi-account"
                                                density="compact"
                                                variant="outlined"
                                                hide-details
                                                label="Cliente"
                                                placeholder="Busque un cliente"
                                                persistent-placeholder
                                                :items="data.clientes"
                                                clearable
                                                color="primary"
                                            >
                                                <template v-slot:append-inner>
                                                    <v-btn icon variant="text" size="small" @click="getClientes" class="refresh-btn">
                                                        <v-icon color="primary" size="20">
                                                            mdi-refresh
                                                        </v-icon>
                                                        <v-tooltip activator="parent" location="top">
                                                            Actualizar lista
                                                        </v-tooltip>
                                                    </v-btn>
                                                </template>
                                            </v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" md="12" sm="12">
                                            <v-textarea 
                                                v-model="data.venta.enviarA"
                                                density="compact"
                                                variant="outlined"
                                                label="Dirección de envío"
                                                placeholder="Ingrese dirección completa"
                                                clearable
                                                hide-details
                                                persistent-placeholder
                                                rows="2"
                                                color="primary"
                                                auto-grow
                                            />
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>

                            <v-col cols="12" md="6" sm="6">
                                <v-card class="pa-6 border" rounded="lg" elevation="0">
                                    <!-- Sección Productos -->
                                    <div class="section-header mb-6">
                                        <div class="d-flex align-center">
                                            <div class="section-icon mr-3">
                                                <v-icon color="secondary" size="28">mdi-package-variant</v-icon>
                                            </div>
                                            <h6 class="text-h6 font-weight-bold text-secondary">
                                                Productos
                                            </h6>
                                        </div>
                                    </div>

                                    <!-- Buscador de productos -->
                                    <v-row align="center" class="product-search mb-6">
                                        <v-col cols="12" md="12" sm="12">
                                            <v-autocomplete 
                                                v-model="data.producto.idProducto"
                                                prepend-inner-icon="mdi-magnify"
                                                density="compact"
                                                variant="outlined"
                                                hide-details
                                                clearable
                                                label="Buscar producto"
                                                placeholder="Escriba para buscar..."
                                                persistent-placeholder
                                                :items="data.productos"
                                                color="secondary"
                                            />
                                        </v-col>
                                        <v-col cols="12" md="12" sm="12">
                                            <v-text-field 
                                                v-model="data.producto.cantidad"
                                                prepend-inner-icon="mdi-numeric"
                                                density="compact"
                                                variant="outlined"
                                                hide-details
                                                clearable
                                                label="Cantidad"
                                                placeholder="Cantidad"
                                                persistent-placeholder
                                                type="number"
                                                min="1"
                                                color="secondary"
                                            />
                                        </v-col>

                                        <transition name="slide-y-transition">
                                            <AlertComp
                                                :show="data.alert.show" 
                                                :type="data.alert.type" 
                                                :message="data.alert.message"/>
                                        </transition>

                                        <v-col cols="12" md="12" sm="12" class="d-flex justify-end align-center">
                                            <v-btn 
                                                class="mr-2" 
                                                color="grey-darken-1" 
                                                size="small" 
                                                variant="outlined"
                                                @click="clearProductos()"
                                                prepend-icon="mdi-broom"
                                            >
                                                Limpiar
                                            </v-btn>
                                            <v-btn 
                                                color="secondary" 
                                                size="small" 
                                                variant="flat"
                                                @click="addProducts()"
                                                prepend-icon="mdi-plus"
                                            >
                                                Agregar
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-form>

                    <v-card-subtitle class="d-flex align-center text-center mb-2">
                        <v-divider /> 
                        <small class="mx-6 text-grey font-weight-bold">
                            Detalles de Productos
                        </small>
                        <v-divider />
                    </v-card-subtitle>
                    
                    <!-- Tabla de productos -->
                    <v-card class="mb-6 border" rounded="lg" elevation="0">
                        <v-data-table class="rounded" density="compact" :headers="data.headers"
                            :items="data.items" hide-default-footer :header-props="{ 
                            class: 'font-weight-bold' }" :items-per-page="100"
                            height="250px"
                            fixed-header
                        >
                            <template v-slot:item.opc="{ item }">
                                <v-btn 
                                    icon 
                                    size="small" 
                                    color="error" 
                                    variant="text"
                                    @click="deleteProduct(item)"
                                >
                                    <v-icon size="20">mdi-trash-can-outline</v-icon>
                                    <v-tooltip activator="parent" location="top">
                                        Eliminar
                                    </v-tooltip>
                                </v-btn>
                            </template>
                            <template v-slot:bottom>
                                <transition name="slide-y-transition">
                                    <AlertComp
                                        :show="data.alert.show3" 
                                        :type="data.alert.type" 
                                        :message="data.alert.message"/>
                                </transition>
                            </template>
                            <template v-slot:item.costoUnitario="{ item }">
                                <div class="font-weight-medium text-body-2">
                                    {{ formatedCurrency(item.costoUnitario, data.fornates.nio) }}
                                </div>
                            </template>
                            <template v-slot:item.subTotal="{ item }">
                                <div class="font-weight-bold text-body-2 text-primary">
                                    {{ formatedCurrency(item.subTotal, data.fornates.nio) }}
                                </div>
                            </template>
                        </v-data-table>
                    </v-card>

                    <!-- Resumen y observaciones -->
                    <v-row dense>
                        <v-col cols="12" md="6" sm="6">
                            <v-card variant="outlined" class="h-100">
                                <v-card-text class="pa-4">
                                    <div class="text-subtitle-2 font-weight-bold mb-2 text-grey-darken-2">
                                        <v-icon size="18" class="mr-2">
                                            mdi-text-box-outline
                                        </v-icon>
                                        Observaciones
                                    </div>
                                    <v-textarea 
                                        v-model="data.venta.observaciones"
                                        variant="plain"
                                        :hide-details="true"
                                        placeholder="Ingrese observaciones adicionales..."
                                        rows="4"
                                        auto-grow
                                        class="mt-2"
                                    />
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                            <v-card variant="flat" color="white" class="h-100">
                                <v-card-text class="pa-4">
                                    <div class="text-subtitle-2 font-weight-bold mb-4 text-grey-darken-2">
                                        <v-icon size="18" class="mr-2">
                                            mdi-calculator
                                        </v-icon>
                                        Resumen de Factura
                                    </div>
                                    <div class="amount-row d-flex justify-space-between align-center mb-3">
                                        <span class="text-body-2">Sub Total:</span>
                                        <span class="text-h6 font-weight-bold text-grey-darken-3">
                                            {{ formatedCurrency(data.factura.subTotal, data.fornates.nio) }}
                                        </span>
                                    </div>
                                    <v-divider class="my-2" />
                                    <div class="amount-row d-flex justify-space-between align-center mb-3">
                                        <span class="text-body-2">Total:</span>
                                        <span class="text-h5 font-weight-bold text-primary">
                                            {{ formatedCurrency(data.factura.total, data.fornates.nio) }}
                                        </span>
                                    </div>
                                    <div v-if="data.usd" class="amount-row d-flex justify-space-between align-center mt-4 pt-3 border-t">
                                        <span class="text-body-2 text-grey-darken-1">
                                            <v-icon size="16" class="mr-1">mdi-currency-usd</v-icon>
                                            TOTAL USD:
                                        </span>
                                        <span class="text-h6 font-weight-bold text-green-darken-2">
                                            {{ formatedCurrency(data.factura.usdTotal, data.fornates.usd) }}
                                        </span>
                                    </div>
                                    <transition name="slide-y-transition">
                                        <AlertComp 
                                            :show="data.alert.show2" 
                                            :type="data.alert.type" 
                                            :message="data.alert.message"/>
                                    </transition>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>

                <!-- Footer de acciones -->
                <v-divider thickness="2" />
                <v-card-actions>
                    <v-btn 
                        color="grey" 
                        variant="text" 
                        @click="closeDialog()"
                        prepend-icon="mdi-close-circle-outline"
                        class="px-6"
                    >
                        Cancelar
                    </v-btn>
                    <v-btn 
                        class="bg-indigo-darken-4 px-8" 
                        @click="guardarFactura()"
                        :disabled="data.contDisableBtn"
                        prepend-icon="mdi-content-save-outline"
                        elevation="2"
                    >
                        <template v-if="data.contDisableBtn">
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
    </div>
</template>

<script>
import { formatters } from '@/helpers/formatters';
import RequestHttp from '@/services/requestHttp';
import { reactive, ref, watch } from 'vue';
import { httpGet } from '@/scripts/api.js'
import { useStore } from '@/store';
import AlertComp from '@/components/reutilizable/AlertComp.vue';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';

export default {
    mounted() {
        this.getClientes()
        this.getProductos()
        this.getEmpleados()
        this.getTipoVentas()
    },

//   beforeRouteEnter(to, from, next) {
//     next(vm => {
//       vm.getClientes()
//       vm.getProductos()
//       vm.getTipoVentas()
//     })
//   },

    props: {
        show: {
            type: Boolean,
            required: true,
        },
        editar: {
            type: Boolean,
            required: false
        },
        idFact: {
            type: Number,
            required: false
        },
        title: {
            type: String,
            required: true,
            default: 'Nueva Factura'
        }
    },

    components: {
        AlertComp,
        SuccessAlert,
        OverlayComp
    },

    setup(props) {
        const data = reactive({
            rules: {
                rule: [v => !!v || 'El campo es obligatorio']
            },

            headers: [
                {title: '', key: 'opc', align: 'center'},
                {title: 'Producto', key: 'producto', align: 'center'},
                {title: 'Cantidad', key: 'cantidad', align: 'center'},
                {title: 'costoUnitario Unit.', key: 'costoUnitario', align: 'center'},
                {title: 'SubTotal', key: 'subTotal', align: 'center'},
            ],

            productos: [],
            empleados: [],
            tipoVenta: [],
            items: [],
            clientes: [],
            producto: {
                idVenta: 0,
                idProducto: null, 
                cantidad: 0,
                costoUnitario: null,
                observaciones: null,
            },
            tipoProductos: [
                {title: 'Camisas', key: 'Camisas'},
                {title: 'Pantalones', key: 'pantalones'},
            ],
            factura: {
                subTotal: 0.00,
                total: 0.00,
                usdTotal: 0.00
            },
            venta: {
                noVenta: null,
                idTipoVenta: null,
                idCliente: null,
                credito: false,
                observaciones: null,
                enviarA: null,
                usuarioRegistro: null,
                detalleVenta: []
            },
            editVenta: {
                idVenta: null,
                fechaRegistro: null,
                estado: false,
                idClienteNavigation: null,
                detalleCxcs: [],
            },

            // ALERT
            alert: {
                show: false,
                show2: false,
                show3: false,
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

            // Overlay
            overlay: {
                show: false
            },

            contDisableBtn: false,
            hide: true,
            idVenta: null,
            emision: new Date(),
            nio: true,
            usd: false,
            fornates: {
                nio: 'NIO', 
                usd: 'USD'
            },
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

        function showAlert(val, message, type) {
            if (val === 1) {
                data.alert.show = true
            } else if(val === 2) {
                data.alert.show2 = true
            } else if(val === 3) {
                data.alert.show3 = true
            }
            data.alert.type = type
            data.alert.message = message

            setTimeout(() => {
                data.alert.show = false
                data.alert.show2 = false
                data.alert.show3 = false
                data.alert.val = 0
            }, 3000);
        }

        const getVenta = async (id) => {
            return await data.requestHttp.getByIdVenta(id)
        }

        const calcularFactura = () => {
            let subtotal = 0
            data.factura.subTotal = 0.00
            data.factura.total = 0.00
            data.factura.usdTotal = 0.00
            data.items.forEach(item => {
                item.subTotal = item.costoUnitario * item.cantidad
                subtotal += item.subTotal
            })
            data.factura.subTotal = subtotal
            data.factura.total = data.factura.subTotal
            data.factura.usdTotal = data.factura.total / 36.6243
        }
        const localShow = ref(props.show)
        const localEdit = ref(props.editar)
        const localFact = ref(props.idFact)
        const localTitle = ref(props.title)
        watch(() => props.show, async (newValue) => {
            localShow.value = newValue
            if (newValue) {
                data.venta.usuarioRegistro = useStore().getNameUser()
                if (!props.editar) {
                    var cod = await httpGet('api/venta/no-factura')
                    data.venta.noVenta = String(cod)
                }
            }
        })
        watch(() => props.idFact, async (val) => {
            localFact.value = val
        })
        watch(() => props.editar, async (val) => {
            localEdit.value = val
            if (val) {
                try {
                    data.overlay.show = true
                    const result = await getVenta(props.idFact)
                    if (result.code === 200) {
                        data.venta = result.data
                        data.editVenta.estado = result.data.estado
                        data.editVenta.fechaRegistro = result.data.fechaRegistro
                        data.editVenta.idVenta = result.data.idVenta
    
                        data.editVenta.idClienteNavigation = result.data.idClienteNavigation
                        result.data.detalleCxcs.map(item => {
                            data.editVenta.detalleCxcs.push(item)
                        })
                        const promises = result.data.detalleVenta.map(async (item) => {
                            const product = await data.requestHttp.getByIdProducto(item.idProducto)
                            data.items.push({
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
                        data.overlay.show = false
                        calcularFactura()
                    }

                } catch (error) {
                    showAlert(2, 'No se pudo cargar la factura', 'error')
                }
            
            }
        })        
        watch(() => props.title, (val) => {
            localTitle.value = val
        })

        return {
            localShow,
            localEdit,
            localFact,
            localTitle,
            data,
            showAlert,
            showSuccesAlert
        }
    },

    methods: {
        probarBtn() {
            this.data.alertSuccess.show = true
            this.data.alertSuccess.msg = '¡Funciona!'
            this.data.alertSuccess.success = true
            setTimeout(() => {
                this.data.alertSuccess.show = false
                this.data.alertSuccess.msg = ''
            }, 1500);

            setTimeout(() => {
                this.data.alertSuccess.show = true
                this.data.alertSuccess.msg = '¡No funciona!'
                this.data.alertSuccess.success = false
            }, 1500);

            setTimeout(() => {
                this.data.alertSuccess.show = false
                this.data.alertSuccess.msg = ''
            }, 3000);
        },

        async getClientes() {
            this.data.clientes = []
            this.data.loading = true
            const result = await this.data.requestHttp.getClientes()
            this.data.loading = false
            result.map(item => {
                this.data.clientes.push({title: item.nombre, value: item.idCliente})
            })
        },

        async getTipoVentas() {
            this.data.tipoVenta = []
            this.data.loading = true

            const result = await this.data.requestHttp.getTipoVentas()

            this.data.loading = false

            if (result.code === 200) {
                result.data.map(item => {
                    this.data.tipoVenta.push({title: item.nombre, value: item.id})
                })
            }

        },

        async getEmpleados() {
            this.data.empleados = []
            this.data.loading = true
            const result = await this.data.requestHttp.getUsuarios()
            this.data.loading = false
            result.map(item => {
                this.data.empleados.push({title: item.username, value: item.username})
            })
        },

        async getProductos() {
            this.data.productos = []
            this.data.loading = true
            const result = await this.data.requestHttp.getProductos(null)
            this.data.loading = false

            if (result.code === 200) {
                result.data.map(item => {
                  this.data.productos.push({title: item.nombre, value: item.idProducto})
                })
            }
        },

        async addProducts() {
            if (!this.data.producto.idProducto || !this.data.producto.cantidad) {
                this.showAlert(1, 'Complete la información del producto', 'warning')
                return
            }

            this.data.producto.cantidad = Number(this.data.producto.cantidad)

            const product = await this.data.requestHttp.getByIdProducto(this.data.producto.idProducto)

            this.data.items.push({
                ...this.data.producto,
                producto: product.nombre,
                costoUnitario: product.precio,
                subTotal:  this.data.producto.cantidad * product.costoUnitario
            })
            this.calcularFactura()
            this.data.producto.idProducto = null
            this.data.producto.cantidad = 0
            this.data.producto.observaciones = null
        },
        
        deleteProduct(itemSelected) {
            let i = this.data.items.indexOf(itemSelected)
            if (i !== -1) {
              this.data.items.splice(i, 1);
            }
            this.calcularFactura()
        },

        async guardarFactura() {
            this.$refs.form.validate()
            this.data.venta.detalleVenta = []

            if (this.data.items.length === 0) {
                this.showAlert(3, 'Agregue productos a la factura', 'warning')
                return
            }

            if (!this.localEdit) {
                if (!this.data.venta.noVenta ||
                    !this.data.venta.idCliente ||
                    !this.data.venta.usuarioRegistro
                ) {
                    this.data.hide = false
                    setTimeout(() => {
                        this.data.hide = true
                    }, 1500)
                    this.showAlert(2, 'Complete la información de venta', 'warning')
                    return
                } else {
                    this.data.items.forEach(item => {
                        this.data.venta.detalleVenta.push({
                            "idVenta": item.idVenta,
                            "idProducto": item.idProducto,
                            "cantidad": item.cantidad,
                            "precioUnitario": item.costoUnitario,
                            "observaciones": item.observaciones
                        })
                    })

                    this.data.contDisableBtn = true
                    const result = await this.data.requestHttp.postVenta(this.data.venta)
                    console.log(result);
                    
                    this.data.contDisableBtn = false
                    if (result.code === 200) {
                        this.showSuccesAlert('¡Venta registrada!', true)
                        this.closeDialog()
                    } else if(result.data.code === 400.1) {
                        this.showSuccesAlert(`¡${result.data.msg}!`, false)
                        return
                    } else {
                        this.showSuccesAlert(`¡Venta no registrada. Verifique los datos!`, false)
                        return
                    }
                    
                }
            } else {
                if (!this.data.venta.noVenta ||
                    !this.data.venta.idCliente ||
                    !this.data.venta.usuarioRegistro
                ) {
                    this.showAlert(2, 'Complete la información de venta', 'warning')
                    return
                } else {
                    this.data.items.forEach(item => {
                        this.data.venta.detalleVenta.push({
                            "idVenta": item.idVenta,
                            "idProducto": item.idProducto,
                            "cantidad": item.cantidad,
                            "precioUnitario": item.costoUnitario,
                            "observaciones": item.observaciones
                        })
                    })

                    this.data.contDisableBtn = true
                    const result = await this.data.requestHttp.putVenta(
                        this.data.venta, 
                        this.data.editVenta.idVenta
                    )
                    this.data.contDisableBtn = false

                    if (result.code === 200) {
                        this.showSuccesAlert('¡Factura editada!')
                        this.closeDialog()
                    } else {
                        this.showSuccesAlert('¡No se pudo editar la factura!', false)
                        return
                    }
                }
            }
            this.$emit('refreshTable')
        },

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
            this.data.items = []
            this.data.factura.subTotal = 0.00
            this.data.factura.total = 0.00
            this.data.factura.usdTotal = 0.00
            this.data.venta = {
              usuarioRegistro: 'Roberto'
            }
            this.data.editVenta = {}

            this.clearProductos()
        },

        clearProductos() {
            this.data.producto.cantidad = 0.00
            this.data.producto.idProducto = null
        },

        calcularFactura() {
            let subtotal = 0
            this.data.factura.subTotal = 0.00
            this.data.factura.total = 0.00
            this.data.factura.usdTotal = 0.00
            this.data.items.forEach(item => {
                item.subTotal = item.costoUnitario * item.cantidad
                subtotal += item.subTotal

            })
            this.data.factura.subTotal = subtotal
            this.data.factura.total = this.data.factura.subTotal
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
    font-weight: bold !important;
}



/* ================== */

.bg-gradient-primary {
    background: linear-gradient(135deg, #303f9f 0%, #5c6bc0 100%);
}

.status-bar {
    border-bottom: 1px solid rgba(0,0,0,0.08);
}

.section-header {
    position: relative;
}

.section-header .section-icon {
    background: rgba(33, 150, 243, 0.1);
    border-radius: 12px;
    padding: 8px;
}

.product-search {
    border-radius: 12px;
    border: 2px dashed #e0e0e0;
}

.product-table {
    border-radius: 8px;
}

.product-table :deep(.v-data-table-header) {
    background-color: #f5f7fa;
}

.product-table :deep(th) {
    font-weight: 600 !important;
    color: #37474f !important;
    text-transform: uppercase;
    font-size: 0.75rem !important;
    letter-spacing: 0.5px;
}

.amount-row {
    padding: 8px 0;
}

.border-t {
    border-top: 1px solid rgba(0,0,0,0.12);
}

.h-100 {
    height: 100%;
}

.refresh-btn:hover {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
}

.v-chip-group :deep(.v-chip) {
    border-radius: 20px;
    padding: 4px 12px;
}
</style>