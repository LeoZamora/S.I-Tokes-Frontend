<template>
  <div class="w-100">
    <!-- Encabezado idéntico al de la ventana principal -->
    <v-card class="border-t border-b mb-3" elevation="0" rounded="0">
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <v-btn
            class="mr-2"
            variant="text"
            color="indigo"
            @click="closeDialog()"
            icon
            size="small"
          >
            <v-icon>mdi-arrow-left</v-icon>
            <v-tooltip location="top center" activator="parent">
              Volver a Órdenes de Compra
            </v-tooltip>
          </v-btn>
          <div class="text-h6 font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="indigo">
              mdi-cart-arrow-down
            </v-icon>
            {{ localTitle }}
          </div>
        </div>
      </template>

      <template v-slot:append>
        <div class="d-flex align-center">
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            @click="closeDialog()"
            class="rounded font-weight-bold mr-2 text-none"
            size="small"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="indigo-darken-4"
            @click="guardarFactura()"
            variant="tonal"
            prepend-icon="mdi-content-save-outline"
            :disabled="data.disableBtn"
            class="rounded font-weight-bold text-none"
          >
            {{ localEdit ? 'Actualizar Orden' : 'Guardar Compra' }}
          </v-btn>
        </div>
      </template>
    </v-card>

    <div class="px-2 px-md-3">
      <v-form
        validate-on="invalid-input"
        ref="form"
      >
            <!-- 1. Datos Generales de la Compra -->
            <v-card
              class="pa-4 bg-white border mb-3"
              rounded="lg"
              elevation="0"
            >
              <div class="d-flex align-center mb-3">
                <v-icon
                  color="indigo-darken-3"
                  size="20"
                  class="mr-2"
                >
                  mdi-clipboard-text-outline
                </v-icon>
                <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                  Datos Generales
                </span>
              </div>

              <v-row dense>
                <!-- Proveedor -->
                <v-col cols="12" md="4">
                  <label class="text-caption font-weight-bold text-grey-darken-2 d-block mb-1">
                    Proveedor *
                  </label>
                  <v-autocomplete
                    :rules="data.rules.rules"
                    v-model="data.orden.idProveedor"
                    :items="data.proveedores"
                    prepend-inner-icon="mdi-account-tie"
                    density="compact"
                    variant="outlined"
                    hide-details
                    single-line
                    :menu-props="{ closeOnContentClick: true }"
                    placeholder="Seleccione proveedor..."
                    color="indigo"
                    class="fixed-autocomplete"
                    clearable
                  >
                    <template v-slot:prepend-inner>
                      <v-btn
                        icon
                        variant="text"
                        size="x-small"
                        @click.stop="getProveedores"
                        class="mr-1"
                      >
                        <v-icon color="indigo" size="18">mdi-refresh</v-icon>
                        <v-tooltip activator="parent" location="top">
                          Actualizar lista de proveedores
                        </v-tooltip>
                      </v-btn>
                    </template>
                  </v-autocomplete>
                </v-col>

                <!-- Bodega Destino -->
                <v-col cols="12" md="4">
                  <label class="text-caption font-weight-bold text-grey-darken-2 d-block mb-1">
                    Bodega de Destino (Cargar a) *
                  </label>
                  <v-autocomplete
                    :rules="data.rules.rules"
                    v-model="data.orden.idBodega"
                    :items="data.bodegas"
                    prepend-inner-icon="mdi-warehouse"
                    density="compact"
                    variant="outlined"
                    hide-details
                    single-line
                    :menu-props="{ closeOnContentClick: true }"
                    placeholder="Seleccione bodega para recibir..."
                    color="indigo"
                    class="fixed-autocomplete"
                    clearable
                  >
                    <template v-slot:prepend-inner>
                      <v-btn
                        icon
                        variant="text"
                        size="x-small"
                        @click.stop="getBodegas"
                        class="mr-1"
                      >
                        <v-icon color="indigo" size="18">mdi-refresh</v-icon>
                        <v-tooltip activator="parent" location="top">
                          Actualizar lista de bodegas
                        </v-tooltip>
                      </v-btn>
                    </template>
                  </v-autocomplete>
                </v-col>

                <!-- Observaciones -->
                <v-col cols="12" md="4">
                  <label class="text-caption font-weight-bold text-grey-darken-2 d-block mb-1">
                    Observaciones
                  </label>
                  <v-text-field
                    v-model="data.orden.observaciones"
                    variant="outlined"
                    density="compact"
                    hide-details
                    placeholder="Notas u observaciones de la compra..."
                    color="indigo"
                  />
                </v-col>
              </v-row>
            </v-card>

            <!-- 2. Detalle y Adición de Productos -->
            <v-card
              class="pa-4 bg-white border"
              rounded="lg"
              elevation="0"
            >
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center">
                  <v-icon color="indigo-darken-3" size="20" class="mr-2">mdi-cart-outline</v-icon>
                  <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                    Detalle de Productos
                  </span>
                </div>
                <span class="text-caption text-grey font-weight-medium">
                  {{ data.items.length }} {{ data.items.length === 1 ? 'producto' : 'productos' }} agregados
                </span>
              </div>

              <!-- Selector y adición de productos -->
              <div class="bg-grey-lighten-5 pa-3 rounded-lg border mb-3">
                <v-row dense align="center">
                  <!-- Buscador de producto -->
                  <v-col cols="12" md="5">
                    <v-autocomplete
                      v-model="data.producto.idProducto"
                      prepend-inner-icon="mdi-magnify"
                      density="compact"
                      variant="outlined"
                      hide-details
                      :label="!data.orden.idBodega ? 'Seleccione primero una bodega...' : 'Buscar producto por nombre o código...'"
                      :placeholder="!data.orden.idBodega ? 'Seleccione una bodega de destino' : 'Escriba para buscar...'"
                      persistent-placeholder
                      :items="data.productos"
                      :disabled="!data.orden.idBodega"
                      clearable
                      color="indigo"
                      class="fixed-autocomplete"
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" class="py-2">
                          <template v-slot:title>
                            <div class="d-flex align-center justify-space-between">
                              <span class="font-weight-medium text-body-2">
                                {{ item.raw.codigo ? item.raw.codigo + ' - ' : '' }}{{ item.raw.nombre || item.raw.title }}
                              </span>
                              <v-chip
                                size="x-small"
                                :color="item.raw.cantidadTotal > 10 ? 'success' : item.raw.cantidadTotal > 0 ? 'orange-darken-3' : 'error'"
                                variant="flat"
                                class="font-weight-bold ml-2"
                              >
                                Stock: {{ item.raw.cantidadTotal ?? 0 }}
                              </v-chip>
                            </div>
                          </template>
                          <template v-slot:subtitle>
                            <div class="d-flex align-center text-caption text-grey-darken-1 mt-1">
                              <span>Costo Base: <strong>{{ formatedCurrency(item.raw.costo, data.fomates.nio) }}</strong></span>
                            </div>
                          </template>
                        </v-list-item>
                      </template>

                      <template v-slot:selection="{ item }">
                        <div class="d-flex align-center overflow-hidden w-100" style="min-width: 0;">
                          <span class="font-weight-medium text-truncate" style="min-width: 0; flex: 1 1 auto;">
                            {{ item.raw.codigo ? item.raw.codigo + ' - ' : '' }}{{ item.raw.nombre || item.raw.title }}
                          </span>
                        </div>
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <!-- Cantidad -->
                  <v-col cols="12" sm="4" md="2">
                    <v-text-field
                      v-model.number="data.producto.cantidad"
                      prepend-inner-icon="mdi-numeric"
                      density="compact"
                      variant="outlined"
                      hide-details
                      label="Cantidad"
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      color="indigo"
                      bg-color="white"
                      @keyup.enter="addProducts()"
                    />
                  </v-col>

                  <!-- Costo Unitario -->
                  <v-col cols="12" sm="5" md="3">
                    <v-text-field
                      v-model.number="data.producto.costoUnitario"
                      prepend-inner-icon="mdi-cash"
                      prefix="C$"
                      density="compact"
                      variant="outlined"
                      hide-details
                      label="Costo Unitario"
                      type="number"
                      min="0"
                      step="0.01"
                      color="indigo"
                      bg-color="white"
                      @keyup.enter="addProducts()"
                    />
                  </v-col>

                  <!-- Botón Agregar -->
                  <v-col cols="12" sm="3" md="2" class="d-flex align-end">
                    <v-btn
                      color="indigo-darken-3"
                      variant="flat"
                      block
                      size="small"
                      @click="addProducts()"
                      prepend-icon="mdi-plus"
                      class="font-weight-bold text-none"
                      style="height: 40px;"
                    >
                      Agregar
                    </v-btn>
                  </v-col>
                </v-row>

                <transition name="slide-y-transition">
                  <AlertComp
                    :show="data.alert.show"
                    :type="data.alert.type"
                    :message="data.alert.message"
                    class="mt-2"
                  />
                </transition>
              </div>

              <!-- Tabla de Productos en la Orden -->
              <div class="table-container mb-3 border rounded-lg overflow-hidden">
                <v-data-table
                  density="compact"
                  :headers="data.headers"
                  :items="data.items"
                  hide-default-footer
                  :items-per-page="100"
                  height="220px"
                  fixed-header
                  class="product-table"
                >
                  <template v-slot:item.opc="{ item }">
                    <v-btn
                      icon
                      size="x-small"
                      color="error"
                      variant="text"
                      @click="deleteProduct(item)"
                    >
                      <v-icon size="18">mdi-trash-can-outline</v-icon>
                      <v-tooltip activator="parent" location="top">
                        Eliminar
                      </v-tooltip>
                    </v-btn>
                  </template>

                  <template v-slot:item.producto="{ item }">
                    <div class="font-weight-medium text-body-2 text-grey-darken-3">
                      {{ item.codigo ? item.codigo + ' - ' : '' }}{{ item.producto }}
                    </div>
                  </template>

                  <template v-slot:item.cantidad="{ item }">
                    <div class="d-flex align-center justify-center quantity-stepper">
                      <v-btn
                        icon
                        size="x-small"
                        variant="flat"
                        color="grey-lighten-3"
                        class="quantity-btn"
                        :disabled="Number(item.cantidad) <= 0.0001"
                        @click.stop="decrementarCantidad(item)"
                      >
                        <v-icon size="12" color="grey-darken-3">mdi-minus</v-icon>
                        <v-tooltip activator="parent" location="top">Disminuir</v-tooltip>
                      </v-btn>
                      <input
                        type="number"
                        step="0.0001"
                        min="0.0001"
                        :value="item.cantidad"
                        @change="onCantidadInputChange(item, $event)"
                        @click.stop
                        class="quantity-input mx-1 text-center font-weight-bold"
                      />
                      <v-btn
                        icon
                        size="x-small"
                        variant="flat"
                        color="grey-lighten-3"
                        class="quantity-btn"
                        @click.stop="incrementarCantidad(item)"
                      >
                        <v-icon size="12" color="grey-darken-3">mdi-plus</v-icon>
                        <v-tooltip activator="parent" location="top">Aumentar</v-tooltip>
                      </v-btn>
                    </div>
                  </template>

                  <template v-slot:item.costoUnitario="{ item }">
                    <span class="text-body-2 font-weight-medium">
                      {{ formatedCurrency(item.costoUnitario, data.fomates.nio) }}
                    </span>
                  </template>

                  <template v-slot:item.subTotal="{ item }">
                    <span class="font-weight-bold text-body-2 text-indigo-darken-3">
                      {{ formatedCurrency(item.subTotal, data.fomates.nio) }}
                    </span>
                  </template>

                  <template v-slot:no-data>
                    <div class="py-6 text-center text-grey">
                      <v-icon size="32" color="grey-lighten-1" class="mb-1">
                        mdi-cart-off
                      </v-icon>
                      <div class="text-caption">
                        No se han agregado productos a la compra
                      </div>
                    </div>
                  </template>
                </v-data-table>
              </div>

              <!-- Resumen Financiero Completo: Subtotal y Total -->
              <v-row dense justify="end">
                <v-col cols="12" sm="8" md="5">
                  <div class="bg-indigo-lighten-5 pa-3 rounded-lg border border-indigo-lighten-4">
                    <div class="d-flex justify-space-between align-center mb-1">
                      <span class="text-caption text-grey-darken-2 font-weight-medium">Sub Total:</span>
                      <span class="text-body-2 font-weight-bold text-grey-darken-3">
                        {{ formatedCurrency(data.factura.subTotal, data.fomates.nio) }}
                      </span>
                    </div>
                    <v-divider class="my-1 border-indigo-lighten-3" />
                    <div class="d-flex justify-space-between align-center">
                      <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">TOTAL ORDEN:</span>
                      <span class="text-h6 font-weight-black text-indigo-darken-4">
                        {{ formatedCurrency(data.factura.total, data.fomates.nio) }}
                      </span>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <transition name="slide-y-transition">
                <AlertComp
                  :show="data.alert.show2"
                  :type="data.alert.type"
                  :message="data.alert.message"
                  class="mt-2"
                />
              </transition>
            </v-card>

          <!-- Botones Inferiores -->
          <div class="d-flex justify-end align-center mt-3 mb-4">
            <v-btn
              color="grey-darken-1"
              variant="outlined"
              size="small"
              @click="closeDialog()"
              class="rounded font-weight-bold mr-2 text-none px-4"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="indigo-darken-4"
              variant="tonal"
              size="small"
              :disabled="data.disableBtn"
              @click="guardarFactura()"
              prepend-icon="mdi-content-save-outline"
              class="rounded font-weight-bold text-none px-4"
            >
              {{ localEdit ? 'Actualizar Orden' : 'Guardar Compra' }}
            </v-btn>
          </div>
        </v-form>
      </div>

    <OverlayComp :show="data.overlay.show"/>

    <SuccessAlert
      :success="data.alertSuccess.success"
      :msg="data.alertSuccess.msg"
      :show="data.alertSuccess.show"
    />
  </div>
</template>

<script>
import { formatters } from '@/helpers/formatters'
import RequestHttp from '@/services/requestHttp'
import { useStore } from '@/store'
import { reactive, ref, watch } from 'vue'
import AlertComp from '@/components/reutilizable/AlertComp.vue'
import SuccessAlert from '@/components/widgets/SuccessAlert.vue'
import OverlayComp from '@/components/reutilizable/OverlayComp.vue'

export default {
  async mounted() {
    await this.getProveedores()
    await this.getProductos()
    await this.getBodegas()
    if (this.editar && this.orden?.idCompra) {
      await this.loadOrdenData(this.orden.idCompra)
    }
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

  setup(props, { emit }) {
    const store = useStore()
    const requestHttp = new RequestHttp()

    const localShow = ref(props.show)
    const localEdit = ref(props.editar)
    const localOrden = ref(props.orden)
    const localTitle = ref(props.title)

    const data = reactive({
      headers: [
        { title: '', key: 'opc', align: 'center', width: '45px', sortable: false },
        { title: 'Producto', key: 'producto', align: 'start' },
        { title: 'Cantidad', key: 'cantidad', align: 'center', width: '130px' },
        { title: 'Costo Unitario', key: 'costoUnitario', align: 'end', width: '140px' },
        { title: 'SubTotal', key: 'subTotal', align: 'end', width: '140px' }
      ],
      rules: {
        rules: [
          (v) => !!v || 'Este campo es obligatorio'
        ]
      },
      alert: {
        show: false,
        show2: false,
        show3: false,
        type: 'success',
        message: ''
      },
      alertSuccess: {
        show: false,
        msg: '',
        success: false
      },
      overlay: {
        show: false
      },
      disableBtn: false,
      items: [],
      proveedores: [],
      bodegas: [],
      productos: [],
      producto: {
        idCompra: 0,
        idProducto: null,
        cantidad: 1,
        costoUnitario: 0,
        observaciones: null
      },
      factura: {
        subTotal: 0.0,
        totalImpuestos: 0.0,
        total: 0.0,
        usdTotal: 0.0
      },
      orden: {
        idCompra: 0,
        idProveedor: null,
        idBodega: null,
        aprobada: true,
        observaciones: null,
        detalle: []
      },
      fomates: {
        nio: 'NIO',
        usd: 'USD'
      }
    })

    const getProveedores = async () => {
      data.proveedores = []
      const result = await requestHttp.getProveedores()
      if (Array.isArray(result)) {
        result.forEach((item) => {
          data.proveedores.push({
            title: item.nombre,
            value: item.idProveedor
          })
        })
      }
    }

    const getBodegas = async () => {
      data.bodegas = []
      const result = await requestHttp.getBodegasCombobox('SUC')
      if (result && result.code === 200 && Array.isArray(result.data)) {
        result.data.forEach((item) => {
          data.bodegas.push({
            title: item.codigo ? `[${item.codigo}] ${item.nombre}` : item.nombre,
            value: item.idBodega || item.id,
            idBodega: item.idBodega || item.id,
            codigo: item.codigo,
            nombre: item.nombre,
            sucursalNombre: item.sucursalNombre
          })
        })

        if (!localEdit.value && !data.orden.idBodega && result.data.length > 0) {
          data.orden.idBodega = result.data[0].idBodega || result.data[0].id
        }
      }
    }

    const getProductos = async () => {
      data.productos = []
      if (!data.orden.idBodega) {
        return
      }
      const result = await requestHttp.getProductosPorBodega(data.orden.idBodega, false)
      if (result && result.code === 200 && Array.isArray(result.data)) {
        data.productos = result.data.map((item) => ({
          title: item.nombre,
          nombre: item.nombre,
          codigo: item.codigo,
          value: item.idProducto,
          idProducto: item.idProducto,
          costo: item.costo,
          precio: item.precio,
          cantidadTotal: item.cantidadTotal ?? 0
        }))
      }
    }

    const calcularTotals = () => {
      let subTotal = 0
      data.factura.subTotal = 0
      data.factura.totalImpuestos = 0
      data.factura.total = 0
      data.factura.usdTotal = 0

      data.items.forEach((item) => {
        const costo = Number(item.costoUnitario || 0)
        const cant = Number(item.cantidad || 0)
        const sub = Number((costo * cant).toFixed(2))

        item.subTotal = sub
        subTotal += sub
      })

      data.factura.subTotal = Number(subTotal.toFixed(2))
      data.factura.totalImpuestos = 0
      data.factura.total = Number(subTotal.toFixed(2))
      data.factura.usdTotal = Number((data.factura.total / 36.6243).toFixed(2))
    }

    const handleChangeProducto = async () => {
      if (!data.producto.idProducto) {
        data.producto.costoUnitario = 0
        return
      }
      const prodInList = data.productos.find((p) => p.idProducto === data.producto.idProducto)
      let baseCost = 0
      if (prodInList && prodInList.costo !== undefined && prodInList.costo !== null) {
        baseCost = Number(prodInList.costo || 0)
      } else {
        const product = await requestHttp.getByIdProducto(data.producto.idProducto)
        baseCost = Number(product?.costo || 0)
      }
      data.producto.costoUnitario = baseCost
    }

    const incrementarCantidad = (item) => {
      item.cantidad = Number((Number(item.cantidad || 0) + 1).toFixed(4))
      calcularItem(item)
    }

    const decrementarCantidad = (item) => {
      if (Number(item.cantidad) > 1) {
        item.cantidad = Number((Number(item.cantidad) - 1).toFixed(4))
      } else {
        item.cantidad = 0.0001
      }
      calcularItem(item)
    }

    const onCantidadInputChange = (item, event) => {
      const val = parseFloat(event.target.value)
      if (!isNaN(val) && val > 0) {
        item.cantidad = val
      } else {
        item.cantidad = 1
      }
      calcularItem(item)
    }

    const calcularItem = (item) => {
      const costo = Number(item.costoUnitario || 0)
      const cant = Number(item.cantidad || 0)
      item.subTotal = Number((costo * cant).toFixed(2))
      calcularTotals()
    }

    const showAlert = (val, message, type) => {
      if (val === 1) data.alert.show = true
      else if (val === 2) data.alert.show2 = true
      else if (val === 3) data.alert.show3 = true

      data.alert.type = type
      data.alert.message = message

      setTimeout(() => {
        data.alert.show = false
        data.alert.show2 = false
        data.alert.show3 = false
      }, 3000)
    }

    const showSuccesAlert = (msg, success = true) => {
      data.alertSuccess.msg = msg
      data.alertSuccess.show = true
      data.alertSuccess.success = success
      setTimeout(() => {
        data.alertSuccess.show = false
        data.alertSuccess.msg = ''
      }, 1500)
    }

    const loadOrdenData = async (compraId) => {
      if (!compraId) return
      try {
        data.overlay.show = true
        const result = await requestHttp.getByIdCompra(compraId)

        data.orden.idCompra = result.idCompra
        data.orden.idProveedor = result.idProveedor
        data.orden.idBodega = result.idBodega || null
        data.orden.aprobada = result.aprobada
        data.orden.observaciones = result.observaciones

        data.items = []
        const promises = (result.detalleCompras || []).map(async (item) => {
          const product = await requestHttp.getByIdProducto(item.idProducto)
          const sub = Number((Number(item.cantidad || 0) * Number(item.costoUnitario || 0)).toFixed(2))
          data.items.push({
            idCompra: item.idCompra,
            idProducto: item.idProducto,
            codigo: product.codigo,
            cantidad: item.cantidad,
            costoUnitario: item.costoUnitario,
            observaciones: item.observaciones,
            subTotal: sub,
            producto: product.nombre
          })
        })

        await Promise.all(promises)
        data.overlay.show = false
        calcularTotals()
      } catch (error) {
        data.overlay.show = false
        showAlert(2, 'No se pudo cargar la orden de compra', 'error')
      }
    }

    watch(
      () => props.show,
      (newValue) => {
        localShow.value = newValue
        if (newValue) {
          getProveedores()
          getBodegas()
          getProductos()
          if (props.editar && props.orden?.idCompra) {
            loadOrdenData(props.orden.idCompra)
          }
        }
      }
    )

    watch(
      () => props.title,
      (val) => {
        localTitle.value = val
      }
    )

    watch(
      () => props.editar,
      async (val) => {
        localEdit.value = val
        if (val && props.orden?.idCompra) {
          await loadOrdenData(props.orden.idCompra)
        }
      }
    )

    watch(
      () => props.orden,
      async (val) => {
        localOrden.value = val
        if (props.editar && val?.idCompra) {
          await loadOrdenData(val.idCompra)
        }
      }
    )

    watch(
      () => data.orden.idBodega,
      async (newBodega, oldBodega) => {
        if (newBodega) {
          await getProductos()
          if (oldBodega && newBodega !== oldBodega) {
            data.producto.idProducto = null
            data.producto.costoUnitario = 0
          }
        } else {
          data.productos = []
          data.producto.idProducto = null
          data.producto.costoUnitario = 0
        }
      }
    )

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

    watch(
      () => data.items,
      () => {
        calcularTotals()
      },
      { deep: true }
    )

    return {
      localShow,
      localEdit,
      localTitle,
      localOrden,
      data,
      store,
      getProveedores,
      getBodegas,
      getProductos,
      showAlert,
      showSuccesAlert,
      calcularTotals,
      incrementarCantidad,
      decrementarCantidad,
      onCantidadInputChange,
      loadOrdenData,
      emit
    }
  },

  methods: {
    async addProducts() {
      if (
        !this.data.producto.idProducto ||
        !this.data.producto.cantidad ||
        this.data.producto.cantidad <= 0
      ) {
        this.showAlert(1, 'Seleccione un producto e ingrese una cantidad válida', 'warning')
        return
      }

      let product = this.data.productos.find(
        (p) => p.idProducto === this.data.producto.idProducto
      )

      if (!product) {
        product = await new RequestHttp().getByIdProducto(
          this.data.producto.idProducto
        )
      }

      const costoUnit = Number(this.data.producto.costoUnitario || 0)
      const cant = Number(this.data.producto.cantidad || 0)
      const sub = Number((costoUnit * cant).toFixed(2))

      // Si el producto ya está en la lista, sumar cantidad
      const indexExistente = this.data.items.findIndex(
        (i) => i.idProducto === this.data.producto.idProducto
      )

      if (indexExistente !== -1) {
        const itemExistente = this.data.items[indexExistente]
        itemExistente.cantidad = Number((Number(itemExistente.cantidad) + cant).toFixed(4))
        itemExistente.costoUnitario = costoUnit
        itemExistente.subTotal = Number((itemExistente.cantidad * costoUnit).toFixed(2))
      } else {
        this.data.items.push({
          idCompra: this.data.producto.idCompra || 0,
          idProducto: this.data.producto.idProducto,
          codigo: product.codigo,
          cantidad: cant,
          costoUnitario: costoUnit,
          subTotal: sub,
          producto: product.nombre || product.title,
          observaciones: this.data.producto.observaciones || ''
        })
      }

      this.calcularTotals()
      this.data.producto.idProducto = null
      this.data.producto.cantidad = 1
      this.data.producto.costoUnitario = 0
      this.data.producto.observaciones = null
    },

    async guardarFactura() {
      if (this.$refs.form) {
        const { valid } = await this.$refs.form.validate()
        if (!valid) return
      }

      if (this.data.items.length === 0) {
        this.showAlert(2, 'Agregue al menos un producto a la compra', 'warning')
        return
      }

      if (!this.data.orden.idProveedor || !this.data.orden.idBodega) {
        this.showAlert(2, 'Complete el Proveedor y la Bodega de Destino', 'warning')
        return
      }

      const requestPayload = {
        idProveedor: this.data.orden.idProveedor,
        idBodega: this.data.orden.idBodega,
        aprobada: this.data.orden.aprobada,
        observaciones: this.data.orden.observaciones || '',
        detalle: this.data.items.map((item) => ({
          idProducto: item.idProducto,
          cantidad: Number(item.cantidad),
          costoUnitario: Number(item.costoUnitario),
          observaciones: item.observaciones || ''
        }))
      }

      const requestHttp = new RequestHttp()
      this.data.disableBtn = true
      this.data.overlay.show = true

      try {
        if (!this.localEdit) {
          const result = await requestHttp.postCompra(requestPayload)
          this.data.disableBtn = false
          this.data.overlay.show = false

          if (result.code === 200 || result.code === 201) {
            this.showSuccesAlert('¡Orden de compra registrada y cargada a inventario!', true)
            setTimeout(() => {
              this.closeDialog()
              this.$emit('refreshTable')
            }, 1200)
          } else {
            this.showSuccesAlert(result.data?.msg || result.data || 'Error al registrar la compra', false)
          }
        } else {
          const result = await requestHttp.putCompra(requestPayload, this.data.orden.idCompra)
          this.data.disableBtn = false
          this.data.overlay.show = false

          if (result !== null) {
            this.showSuccesAlert('¡Orden de compra actualizada!', true)
            setTimeout(() => {
              this.closeDialog()
              this.$emit('refreshTable')
            }, 1200)
          } else {
            this.showSuccesAlert('Error al actualizar la orden', false)
          }
        }
      } catch (error) {
        this.data.disableBtn = false
        this.data.overlay.show = false
        this.showAlert(2, 'Ocurrió un error al procesar la solicitud', 'error')
      }
    },

    formatedCurrency(key, currency) {
      return formatters.formatCurrency(key, currency)
    },

    closeDialog() {
      this.$emit('closeDialog', false)
      this.localShow = false
      this.localEdit = false
      this.data.factura.subTotal = 0
      this.data.factura.totalImpuestos = 0
      this.data.factura.total = 0
      this.data.factura.usdTotal = 0
      this.data.orden.idCompra = 0
      this.data.orden.idProveedor = null
      this.data.orden.idBodega = null
      this.data.orden.aprobada = true
      this.data.orden.observaciones = null
      this.data.items = []
      this.data.producto.idProducto = null
      this.data.producto.cantidad = 1
      this.data.producto.costoUnitario = 0
      this.data.producto.costoIngresado = 0
    },

    deleteProduct(itemSelected) {
      const i = this.data.items.indexOf(itemSelected)
      if (i !== -1) {
        this.data.items.splice(i, 1)
      }
      this.calcularTotals()
    }
  }
}
</script>

<style scoped>
.quantity-stepper {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 6px;
  padding: 2px 3px;
  border: 1px solid #e2e8f0;
}

.quantity-btn {
  width: 22px !important;
  height: 22px !important;
  min-width: 22px !important;
  border-radius: 4px;
}

.quantity-input {
  width: 60px;
  height: 24px;
  border: 1px solid transparent;
  background: #ffffff;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;
  -moz-appearance: textfield;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input:focus {
  border-color: #3949ab;
  box-shadow: 0 0 0 2px rgba(57, 73, 171, 0.15);
}

.table-container {
  background-color: #ffffff;
}

.product-table :deep(.v-data-table-header) {
  background-color: #f8fafc;
}

.product-table :deep(th) {
  font-weight: 700 !important;
  color: #475569 !important;
  font-size: 0.75rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.fixed-autocomplete) {
  max-height: 40px !important;
}

:deep(.fixed-autocomplete .v-field) {
  height: 40px !important;
  max-height: 40px !important;
  min-height: 40px !important;
  align-items: center !important;
}

:deep(.fixed-autocomplete .v-field__field) {
  height: 40px !important;
  max-height: 40px !important;
  overflow: hidden !important;
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
}

:deep(.fixed-autocomplete .v-field__input) {
  height: 40px !important;
  max-height: 40px !important;
  min-height: 40px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  display: flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}

:deep(.fixed-autocomplete .v-field__input input) {
  min-width: 0 !important;
  flex: 0 1 auto !important;
  height: 100% !important;
}
</style>
