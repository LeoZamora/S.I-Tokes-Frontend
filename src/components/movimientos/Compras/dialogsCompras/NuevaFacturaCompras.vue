<template>
  <v-dialog v-model="localShow" max-width="900" persistent>
        <v-card class="bg-grey-lighten-4" rounded="lg">
            <!-- Header con gradiente -->
            <v-card-title class="bg-indigo-darken-4 d-flex align-center">
                <v-avatar size="42" color="rgba(255,255,255,0.2)" class="mr-4" variant="flat">
                    <v-icon color="white" size="24">mdi-file-document-outline</v-icon>
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

            <!-- Barra de estado -->
            <div class="d-flex align-center px-3 py-2 bg-grey-lighten-4">
                <v-chip size="small" class="mr-2" color="primary" variant="flat">
                    <v-icon size="16" class="mr-1">mdi-tag-outline</v-icon>
                    <span class="font-weight-bold">
                        Nº Órden: 
                        {{ data.orden.noOrden }}
                    </span>
                </v-chip>

                <v-chip v-if="!localEdit" size="small" class="mr-2" color="grey-darken-1" variant="flat">
                    <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
                    <span>
                        Emisión: 
                        {{ localEdit ? '' : formatedDate(data.nowDate) }}
                    </span>
                </v-chip>
                
                <v-spacer />
                
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
                <v-chip size="small" :color="data.orden.aprobada ? 'green' : 'grey'" variant="tonal" 
                    @click="data.orden.aprobada = !data.orden.aprobada">
                    <template v-slot:default >
                        <v-icon v-if="data.orden.aprobada" size="16" class="mr-1">
                            mdi-check
                        </v-icon>
                        <v-icon size="16" class="mr-1">
                            mdi-clock-outline
                        </v-icon>
                        <span>
                            {{ data.orden.aprobada ? 'Aprobada' : '¿Aprobada?' }}
                        </span>

                        <v-tooltip activator="parent" location="top center">
                            Cambiar a {{ data.orden.aprobada ? 'Aprobada' : 'Pendiente' }}
                        </v-tooltip>
                    </template>
                </v-chip>
            </div>

            <v-divider />

            <v-card-text class="px-4">
                <v-form validate-on="invalid-input" ref="form">
                    <v-row dense>
                        <v-col cols="12" md="6" sm="6">
                          <v-card class="pa-4 border" rounded="lg" elevation="0">
                            <v-row dense>
                                <!-- Sección Generales -->
                                <div class="mb-5">
                                    <div class="d-flex align-center">
                                        <div class="section-icon-container bg-blue-lighten-5 mr-3">
                                            <v-icon color="blue-darken-2" size="28">
                                              mdi-cog-outline
                                            </v-icon>
                                        </div>
                                        <h6 class="text-h6 font-weight-bold text-blue-darken-2">
                                          Información General
                                        </h6>
                                    </div>
                                </div>
                                <v-col cols="12" md="12" sm="12">
                                    <v-text-field 
                                        v-model="data.orden.noOrden" 
                                        prepend-inner-icon="mdi-file-document" 
                                        density="comfortable"
                                        variant="outlined" 
                                        hide-details 
                                        label="Número de Órden"
                                        placeholder="Número de orden"  
                                        persistent-placeholder 
                                        readonly
                                        color="primary"
                                        bg-color="grey-lighten-4"
                                    />
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <v-autocomplete 
                                        v-model="data.orden.idProveedor" 
                                        prepend-inner-icon="mdi-account-tie" 
                                        density="comfortable"
                                        variant="outlined" 
                                        hide-details 
                                        label="Proveedor"
                                        placeholder="Seleccione proveedor"  
                                        persistent-placeholder 
                                        :items="data.proveedores"
                                        clearable
                                        color="primary"
                                    />
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <v-autocomplete 
                                        v-model="data.orden.usuarioRegistro" 
                                        prepend-inner-icon="mdi-account-cog" 
                                        density="comfortable"
                                        variant="outlined" 
                                        hide-details 
                                        label="Empleado"
                                        placeholder="Seleccione empleado"  
                                        persistent-placeholder 
                                        :items="data.empleados"
                                        clearable
                                        color="primary"
                                    />
                                </v-col>
                            </v-row>
                          </v-card>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-card class="px-6 py-4 border" rounded="lg" elevation="0">
                            <!-- Sección Productos -->
                            <div class="mb-5">
                                <div class="d-flex align-center">
                                    <div class="section-icon-container bg-green-lighten-5 mr-3">
                                        <v-icon color="green-darken-2" size="28">mdi-package-variant</v-icon>
                                    </div>
                                    <h6 class="text-h6 font-weight-bold text-green-darken-2">
                                      Productos a Ordenar
                                    </h6>
                                </div>
                            </div>            
                            <!-- Tarjeta de búsqueda de productos -->
                            <v-card class="product-selector" variant="outlined" >
                                <v-card-text>
                                    <v-row align="center" dense>
                                        <v-col cols="12" md="12" sm="12">
                                            <v-autocomplete 
                                                v-model="data.producto.idProducto" 
                                                prepend-inner-icon="mdi-magnify" 
                                                density="compact"
                                                variant="outlined" 
                                                hide-details 
                                                label="Buscar Producto"
                                                placeholder="Escriba para buscar..."  
                                                persistent-placeholder 
                                                :items="data.productos"
                                                clearable
                                                color="green-darken-2"
                                            />
                                        </v-col>
                                        <v-col cols="12" md="12" sm="12">
                                            <v-text-field 
                                                v-model="data.producto.cantidad" 
                                                prepend-inner-icon="mdi-numeric" 
                                                density="compact"
                                                variant="outlined" 
                                                hide-details 
                                                label="Cantidad"
                                                placeholder="Cantidad"  
                                                persistent-placeholder 
                                                type="number"
                                                min="1"
                                                color="green-darken-2"
                                            />
                                        </v-col>

                                        <transition name="slide-y-transition">
                                            <AlertComp
                                                :show="data.alert.show" 
                                                :type="data.alert.type" 
                                                :message="data.alert.message"/>
                                        </transition>

                                        <v-col cols="12" md="12" sm="12" class="d-flex justify-end align-center py-2">
                                            <v-btn 
                                                color="grey" 
                                                variant="flat"
                                                @click="addProducts"
                                                prepend-icon="mdi-plus"
                                                elevation="2"
                                            >
                                                Agregar
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                          </v-card>
                        </v-col>
                    </v-row>
                </v-form>


                <!-- Sección Detalles -->
                <v-card-subtitle class="d-flex align-center text-center mb-2">
                    <v-divider /> 
                        <small class="mx-6 text-grey font-weight-bold">
                            Detalles de Productos
                        </small>
                    <v-divider />
                </v-card-subtitle>

                <!-- Tabla de productos -->
                <v-card class="mb-6" elevation="0" border rounded="lg">
                    <v-data-table class="order-table" density="compact" :headers="data.headers"
                        :items="data.items" :items-per-page="100" height="220px" hide-default-footer
                        hover fixed-header>
                      <template v-slot:bottom>
                        <transition name="slide-y-transition">
                            <AlertComp
                              :show="data.alert.show3" 
                              :type="data.alert.type" 
                              :message="data.alert.message"/>
                        </transition>
                      </template>
                        
                        <template v-slot:item.opc="{ item }">
                          <v-btn 
                              icon 
                              size="small" 
                              color="error" 
                              variant="text"
                              @click="deleteProduct(item)"
                          >
                              <v-icon size="20">mdi-trash-can-outline</v-icon>
                              <v-tooltip activator="parent" location="top">Eliminar</v-tooltip>
                          </v-btn>
                        </template>
                        
                        <template v-slot:item.costoUnitario="{ item }">
                            <div class="font-weight-medium text-body-2">
                                {{ formatedCurrency(item.costoUnitario) }}
                            </div>
                        </template>
                        
                        <template v-slot:item.subTotal="{ item }">
                            <div class="font-weight-bold text-body-2 text-primary">
                                {{ formatedCurrency(item.subTotal) }}
                            </div>
                        </template>
                    </v-data-table>
                </v-card>

                <!-- Observaciones y totales -->
                <v-row dense>
                    <v-col cols="12" md="6" sm="6">
                        <v-card variant="outlined" class="h-100">
                            <v-card-title class="d-flex align-center">
                                <v-icon size="20" class="mr-2">mdi-text-box-outline</v-icon>
                                <span class="text-subtitle-2 font-weight-bold">
                                    Observaciones
                                </span>
                            </v-card-title>
                            <v-card-text class="pa-4">
                                <v-textarea 
                                    v-model="data.orden.observaciones"
                                    variant="plain"
                                    hide-details
                                    placeholder="Ingrese observaciones adicionales sobre la orden..."
                                    rows="4"
                                    auto-grow
                                    class="mt-2"
                                />
                            </v-card-text>
                        </v-card>
                    </v-col>
                    
                    <v-col cols="12" md="6" sm="6">
                        <v-card variant="flat" color="white" class="h-100">
                            <v-card-title class="d-flex align-center">
                                <v-icon size="20" color="grey-darken-2" class="mr-2">
                                  mdi-calculator
                                </v-icon>
                                <span class="text-subtitle-2 font-weight-bold text-grey-darken-2">
                                    Resumen de la Orden
                                </span>
                            </v-card-title>
                            <v-card-text class="pa-4">
                                <div class="summary-item d-flex justify-space-between align-center mb-3">
                                    <span class="text-body-2 text-grey-darken-1">Sub Total:</span>
                                    <span class="text-h6 font-weight-bold text-grey-darken-3">
                                        {{ formatedCurrency(data.factura.subTotal, data.fomates.nio) }}
                                    </span>
                                </div>
                                <v-divider class="my-2" thickness="2" />
                                <div class="summary-item d-flex justify-space-between align-center mb-4">
                                    <span class="text-body-1 font-weight-bold text-grey-darken-2">TOTAL:</span>
                                    <span class="text-h5 font-weight-bold text-primary">
                                        {{ formatedCurrency(data.factura.total, data.fomates.nio) }}
                                    </span>
                                </div>
                                
                                <v-divider v-if="data.usd" class="my-3" />
                                
                                <div v-if="data.usd" class="summary-item d-flex justify-space-between align-center mt-3 pt-3">
                                    <span class="text-body-2 text-grey-darken-1">
                                        <v-icon size="16" class="mr-1">mdi-currency-usd</v-icon>
                                        TOTAL USD:
                                    </span>
                                    <span class="text-h6 font-weight-bold text-green-darken-2">
                                        {{ formatedCurrency(data.factura.usdTotal, data.fomates.usd) }}
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
            <v-divider />
            <v-card-actions>
                <v-btn 
                    color="grey-darken-2" 
                    variant="tonal" 
                    @click="closeDialog()"
                    prepend-icon="mdi-close-circle-outline"
                >
                    Cancelar
                </v-btn>
                <v-btn 
                    class="bg-indigo-darken-4" 
                    @click="guardarFactura()"
                    prepend-icon="mdi-content-save-outline"
                    elevation="2"
                >
                    <span class="text-white font-weight-bold">
                      Guardar
                    </span>
                </v-btn>
            </v-card-actions>
            <!-- Overlay de carga -->
        </v-card>

        <OverlayComp :show="data.overlay.show"/>

        <SuccessAlert 
          :success="data.alertSuccess.success" 
          :msg="data.alertSuccess.msg" 
          :show="data.alertSuccess.show" 
        />
    </v-dialog>
</template>

<script>
import { formatters } from '@/helpers/formatters'
import RequestHttp from '@/services/requestHttp'
import { useStore } from '@/store'
import { reactive, ref, watch } from 'vue'
import AlertComp from '@/components/reutilizable/AlertComp.vue';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';

export default {
  async mounted() {
    await this.getCodigoRecomendado()
    this.getEmpleados()
    this.getProductos()
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
    orden: {
      type: Object,
      required: false
    },
    title: {
      type: String,
      required: true,
      default: 'NUEVA ORDEN DE COMPRA'
    }
  },

  components: {
    AlertComp,
    SuccessAlert,
    OverlayComp
  },

  setup(props) {
    const store = useStore()
    const getProveedores = async () => {
      data.proveedores = []
      const result =
        await data.requestHttp.getProveedores()
      result.map((item) => {
        data.proveedores.push({
          title: item.nombre,
          value: item.idProveedor
        })
      })
    }

    function calcularTotals() {
      let subTotal = 0
      data.factura.subTotal = 0
      data.factura.total = 0
      data.factura.usdTotal = 0

      data.items.forEach((item) => {
        subTotal += item.subTotal
      })

      data.factura.subTotal = subTotal
      data.factura.total = data.factura.subTotal
      data.factura.usdTotal = data.factura.total / 36.4263
    }

    const localShow = ref(props.show)
    const localEdit = ref(props.editar)
    const localOrden = ref(props.orden)
    const localTitle = ref(props.orden)
    async function getCodigoRecomendado() {
      data.orden.noOrden = null
      const result =
        await data.requestHttp.getCodigo()
      data.loading = false
      data.orden.noOrden = String(result.code)
    }

    watch(
      () => props.show,
      (newValue) => {
        localShow.value = newValue
        if (newValue) {
          data.orden.usuarioRegistro = JSON.parse(
            localStorage.getItem('token')
          ).usuario
          getCodigoRecomendado()
          getProveedores()
        }
      }
    )
    watch(
      () => props.editar,
      async (val) => {
        localEdit.value = val
        if (val === true) {
          try {
            data.overlay.show = true
            const result = await data.requestHttp.getByIdCompra(localOrden.value.idCompra)
            
            data.idOrden = result.idCompra
            data.orden.idProveedor = result.idProveedor
            data.orden.noOrden = result.noOrden
            data.orden.aprobada = result.aprobada
            data.orden.observaciones = result.observaciones
            data.orden.usuarioRegistro = result.usuarioRegistro
            data.producto.idCompra = localOrden.value.idCompra
            const promises =
              result.detalleCompras.map(
                async (item) => {
                  const product =
                    await data.requestHttp.getByIdProducto(
                      item.idProducto
                    )
                  data.items.push({
                    idCompra: item.idCompra,
                    idProducto: item.idProducto,
                    cantidad: item.cantidad,
                    costoUnitario:
                      item.costoUnitario,
                    observaciones:
                      item.observaciones,
                    subTotal:
                      item.cantidad *
                      item.costoUnitario,
                    producto: product.nombre
                  })
                }
              )
  
            await Promise.all(promises)
            data.overlay.show = false
            calcularTotals()
          } catch (error) {
            showAlert(2, 'No se pudo cargar la factura', 'error')
          }
        }
      }
    )
    watch(
      () => props.orden,
      (val) => {
        localOrden.value = val
      }
    )
    watch(
      () => props.title,
      (val) => {
        localTitle.value = val
      }
    )

    const data = reactive({
      loading: {
        costoProducto: false,
      },
      headers: [
        {
          title: '',
          key: 'opc',
          align: 'center'
        },
        {
          title: 'Producto',
          key: 'producto',
          align: 'center'
        },
        {
          title: 'Cantidad',
          key: 'cantidad',
          align: 'center'
        },
        {
          title: 'Precio Unit.',
          key: 'costoUnitario',
          align: 'center'
        },
        {
          title: 'SubTotal',
          key: 'subTotal',
          align: 'center'
        }
      ],
      rules: {
        rules: [
          (v) => !!v || 'Este campo obligatorio'
        ]
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

      disableBtn: false,
      items: [],
      proveedores: [],
      empleados: [],
      productos: [],
      producto: {
        idCompra: 0,
        idProducto: null,
        cantidad: 0,
        costoUnitario: 0,
        observaciones: null
      },
      factura: {
        subTotal: 0.0,
        total: 0.0,
        usdTotal: 0.0
      },
      orden: {
        noOrden: null,
        idProveedor: null,
        aprobada: false,
        observaciones: null,
        usuarioRegistro: null,
        detalle: []
      },

      radioBtn: [
        {
          label: 'Al recibir productos',
          value: 'recibir'
        },
        {
          label: 'Inmediatamente',
          value: 'inmediato'
        }
      ],
      idOrden: null,
      nio: true,
      usd: false,
      impt: false,
      nowDate: new Date(),
      fomates: {
        nio: 'NIO',
        usd: 'USD'
      },
      requestHttp: new RequestHttp()
    })

    async function handleChangeProducto() {
      const product = await data.requestHttp.getByIdProducto(data.producto.idProducto)
      data.producto.costoUnitario = product.costo
    }

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

    watch(
      () => data.producto.idProducto,
      async (val) => {
        if (val !== null) {
          await handleChangeProducto()
        } else {
          data.producto.costoUnitario = 0
        }
      }
    )

    return {
      localShow,
      localEdit,
      localTitle,
      localOrden,
      data,
      store,
      getCodigoRecomendado,
      showAlert,
      showSuccesAlert,
      calcularTotals
    }
  },

  data(){
    return {
      loading: {
        costoProducto: false,
      }
    }
  },

  methods: {
    async getEmpleados() {
      this.data.empleados = []
      this.data.loading = true
      const result = await this.data.requestHttp.getUsuarios()
      this.data.loading = false
      
      if (result.code === 200) {
        result.data.map((item) => {
          this.data.empleados.push({
            title: item.username,
            value: item.username
          })
        })
      }

    },

    async getProductos() {
      this.data.productos = []
      this.data.loading = true
      const result = await this.data.requestHttp.getProductos(null)
      this.data.loading = false

      if (result.code === 200) {
        result.data.map((item) => {
          this.data.productos.push({
            title: item.nombre,
            value: item.idProducto
          })
        })
      } else {
        throw new Error('Error en la solicitud')
      }
    },

    async addProducts() {
      if (
        !this.data.producto.idProducto ||
        !this.data.producto.cantidad
      ) {
        this.showAlert(1, 'Complete la información del producto', 'warning')
        return
      }
      this.data.producto.cantidad = Number(
        this.data.producto.cantidad
      )
      const product =
        await this.data.requestHttp.getByIdProducto(
          this.data.producto.idProducto
        )
      this.data.items.push({
        ...this.data.producto,
        producto: product.nombre,
        costoUnitario:
          this.data.producto.costoUnitario,
        subTotal:
          this.data.producto.cantidad *
          this.data.producto.costoUnitario
      })
      this.calcularTotals()
      this.data.producto.idProducto = null
      this.data.producto.cantidad = 0
      this.data.producto.observaciones = null
    },

    async guardarFactura() {
      this.$refs.form.validate()
      const token = this.store.getInfoUser()
      this.data.orden.usuarioRegistro = token.usuario

      if (this.data.items.length === 0) {
        this.showAlert(3, 'Agregue productos a la factura', 'warning')
        return
      }

      if (!this.localEdit) {
        if (
          !this.data.orden.noOrden ||
          !this.data.orden.idProveedor ||
          !this.data.orden.usuarioRegistro
        ) {
          this.showAlert(2, 'Complete la información de venta', 'warning')
          return
        } else {
          this.data.orden.detalle = []
          this.data.items.forEach((item) => {
            this.data.orden.detalle.push({
              idCompra: item.idCompra,
              idProducto: item.idProducto,
              cantidad: item.cantidad,
              costoUnitario: item.costoUnitario,
              observaciones: ''
            })
          })

          this.data.disableBtn = true
          this.data.overlay.show = true
          const result = await this.data.requestHttp.postCompra(this.data.orden)
          this.data.disableBtn = false
          this.data.overlay.show = false

          if (result.code === 200 || result.code === 201) {
            this.showSuccesAlert('¡Órden registrada!', true)
            setTimeout(() => {
              this.closeDialog()
            }, 1500);
          } else {
            this.showSuccesAlert(`¡Órden no registrada. Verifique los datos!`, false)
            return
          }
        }
      } else {
        if (
          !this.data.orden.noOrden ||
          !this.data.orden.idProveedor ||
          !this.data.orden.usuarioRegistro
        ) {
          this.showAlert(2, 'Complete la información de venta', 'warning')
          return
        } else {
          this.data.orden.detalle = []
          this.data.items.forEach((item) => {
            this.data.orden.detalle.push({
              idCompra: item.idCompra,
              idProducto: item.idProducto,
              cantidad: item.cantidad,
              costoUnitario: item.costoUnitario,
              observaciones: ''
            })
          })

          this.data.disableBtn = true
          this.data.overlay.show = true
          const result = await this.data.requestHttp.putCompra(
              this.data.orden,
              this.data.idOrden
            )
          this.data.disableBtn = false
          this.data.overlay.show = false
          if (result !== null) {
            this.showSuccesAlert('¡Órden editada!', true)
            setTimeout(() => {
              this.closeDialog()
            }, 1500);
          } else {
            this.showSuccesAlert(`¡Órden no editada. Verifique los datos!`, false)
            return
          }
        }
      }
      this.$emit('refreshTable')
    },

    formatedCurrency(key, currency) {
      return formatters.formatCurrency(
        key,
        currency
      )
    },

    formatedDate(dataString) {
      return formatters.formatDate(dataString)
    },

    closeDialog() {
      this.$emit('closeDialog', false)
      this.data.factura.subTotal = 0
      this.data.factura.total = 0
      this.data.factura.usdTotal = 0
      this.data.orden.aprobada = false
      this.data.orden.detalle = []
      this.data.items = []
      this.data.orden.idProveedor = null
      this.data.orden.noOrden = null
      this.data.orden.observaciones = null
      this.data.orden.usuarioRegistro = null
    },

    deleteProduct(itemSelected) {
      let i =
        this.data.items.indexOf(itemSelected)
      if (i !== -1) {
        this.data.items.splice(i, 1)
      }
      this.calcularTotals()
    }
  }
}
</script>

<style scoped>
.font{
    font-size: 12px !important;
    color: black;
    font-weight: 500;
}

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


.section-header {
    position: relative;
}

.section-icon-container {
    border-radius: 12px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-selector {
    border-radius: 12px;
    border: 2px dashed #e0e0e0;
}

.order-table {
    border-radius: 8px;
    overflow: hidden;
}

.order-table :deep(.v-data-table-header) {
    background-color: #f5f7fa;
}

.order-table :deep(th) {
    font-weight: 600 !important;
    color: #37474f !important;
    text-transform: uppercase;
    font-size: 0.75rem !important;
    letter-spacing: 0.5px;
}

.summary-item {
    padding: 10px 0;
}

.h-100 {
    height: 100%;
}

.v-chip {
    transition: all 0.3s ease;
}

.v-chip:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.bg-blue-lighten-5 {
    background-color: #e3f2fd;
}

.bg-green-lighten-5 {
    background-color: #e8f5e9;
}

.bg-amber-lighten-5 {
    background-color: #fff8e1;
}

.v-text-field :deep(.v-field__prepend-inner) {
    padding-top: 0 !important;
}
</style>
