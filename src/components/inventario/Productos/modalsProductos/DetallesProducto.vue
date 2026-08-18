<template>
  <div>
    <v-dialog v-model="localShow" max-width="700" persistent>
      <v-card class="rounded">
        <!-- Encabezado mejorado -->
        <v-card-title class="d-flex align-center justify-center bg-indigo-darken-4 text-white py-2">
          <v-avatar size="40" color="white" class="me-3">
            <v-icon color="primary" size="24">mdi-package-variant</v-icon>
          </v-avatar>
          <h3 class="font-weight-bold">Detalles del Producto</h3>
          <v-spacer />
          <v-btn variant="text" icon size="small" @click="closeDialog">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>

        <!-- Contenido principal -->
        <v-card-text class="px-4 pt-0">
            <!-- Tabs mejorados -->
          <v-tabs v-model="tab" color="primary" align-tabs="center" class="px-4">
            <v-tab :value="1" class="text-capitalize px-4">
              <v-icon size="18" class="me-2">mdi-package</v-icon>
              <span class="font-weight-medium">Producto</span>
            </v-tab>
            <v-tab :value="2" class="text-capitalize px-4">
              <v-icon size="18" class="me-2">mdi-truck</v-icon>
              <span class="font-weight-medium">Proveedores</span>
            </v-tab>
          </v-tabs>

          <v-divider class="my-2" />

          <v-window v-model="tab">
            <!-- Pestaña 1: Detalles del Producto -->
            <v-window-item :value="1">
              <v-container fluid class="pa-0">
                <!-- Información principal en tarjetas -->
                <v-row dense>
                  <!-- Columna izquierda -->
                  <v-col cols="12" md="6">
                    <v-card variant="outlined" class="dashed pa-4 rounded-lg mb-4">
                      <div class="d-flex align-center mb-3">
                        <v-icon color="primary" size="20" class="me-2">mdi-information</v-icon>
                        <h4 class="font-weight-bold text-primary">Información Básica</h4>
                      </div>
                      
                      <v-list density="compact" class="pa-0">
                        <v-list-item class="px-0">
                          <template v-slot:prepend>
                            <v-icon size="18" color="blue-grey" class="me-3">mdi-barcode</v-icon>
                          </template>
                          <v-list-item-title class="text-body-2">Código</v-list-item-title>
                          <v-list-item-subtitle class="text-caption font-weight-medium">{{ fullProductData.codigo || 'N/A' }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-1" />

                        <v-list-item class="px-0">
                          <template v-slot:prepend>
                            <v-icon size="18" color="blue-grey" class="me-3">mdi-tag</v-icon>
                          </template>
                          <v-list-item-title class="text-body-2">Nombre</v-list-item-title>
                          <v-list-item-subtitle class="text-caption font-weight-medium">{{ fullProductData.nombre || 'N/A' }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-1" />

                        <v-list-item class="px-0">
                          <template v-slot:prepend>
                            <v-icon size="18" color="blue-grey" class="me-3">mdi-folder-outline</v-icon>
                          </template>
                          <v-list-item-title class="text-body-2">Sub Categoría</v-list-item-title>
                          <v-list-item-subtitle class="text-caption font-weight-medium">{{ fullProductData.categoria || 'N/A' }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-1" />

                        <v-list-item class="px-0">
                          <template v-slot:prepend>
                            <v-icon size="18" color="blue-grey" class="me-3">mdi-shape-outline</v-icon>
                          </template>
                          <v-list-item-title class="text-body-2">Tipo</v-list-item-title>
                          <v-list-item-subtitle class="text-caption font-weight-medium">{{ fullProductData.tipoProducto || 'N/A' }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-1" />

                        <v-list-item class="px-0">
                          <template v-slot:prepend>
                            <v-icon size="18" color="blue-grey" class="me-3">mdi-account-group-outline</v-icon>
                          </template>
                          <v-list-item-title class="text-body-2">¿Es Mayorista?</v-list-item-title>
                          <v-list-item-subtitle class="text-caption font-weight-medium">{{ fullProductData.esMayorista ? 'Sí' : 'No' }}</v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-card>

                    <!-- Información financiera -->
                    <v-card variant="outlined" class="dashed pa-4 rounded-lg">
                      <div class="d-flex align-center mb-3">
                        <v-icon color="primary" size="20" class="me-2">mdi-currency-usd</v-icon>
                        <h4 class="font-weight-bold text-primary">Información Financiera</h4>
                      </div>
                      
                      <v-row dense>
                        <v-col cols="6" v-if="!fullProductData.esMayorista">
                          <div class="mb-2">
                            <div class="text-caption text-grey">Precio Unitario</div>
                            <div class="text-body-1 font-weight-bold text-success">{{ formateCurrency(fullProductData.precio) }}</div>
                          </div>
                        </v-col>
                        <v-col :cols="fullProductData.esMayorista ? 12 : 6">
                          <div class="mb-2">
                            <div class="text-caption text-grey">Costo Unitario</div>
                            <div class="text-body-1 font-weight-bold text-error">{{ formateCurrency(fullProductData.costo) }}</div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>

                  <!-- Columna derecha -->
                  <v-col cols="12" md="6">
                    <v-card variant="outlined" class="dashed pa-4 rounded-lg mb-4">
                      <div class="d-flex align-center mb-3">
                        <v-icon color="primary" size="20" class="me-2">mdi-warehouse</v-icon>
                        <h4 class="font-weight-bold text-primary">Inventario</h4>
                      </div>
                      
                      <v-row dense>
                        <v-col cols="6">
                          <div class="text-center pa-3 bg-blue-lighten-5 rounded">
                            <v-icon size="24" color="blue" class="mb-1">mdi-package</v-icon>
                            <div class="text-h6 font-weight-bold">{{ fullProductData.cantidadTotal || 0 }}</div>
                            <div class="text-caption text-grey">Stock Actual</div>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="text-center pa-3 bg-orange-lighten-5 rounded">
                            <v-icon size="24" color="orange" class="mb-1">mdi-alert</v-icon>
                            <div class="text-h6 font-weight-bold">{{ fullProductData.cantidadMinima || 0 }}</div>
                            <div class="text-caption text-grey">Stock Mínimo</div>
                          </div>
                        </v-col>
                        <v-col cols="6" class="mt-2">
                          <div class="text-center pa-3 bg-purple-lighten-5 rounded">
                            <v-icon size="24" color="purple" class="mb-1">mdi-cart-arrow-down</v-icon>
                            <div class="text-h6 font-weight-bold">{{ fullProductData.minimoVenta != null ? fullProductData.minimoVenta : 'N/A' }}</div>
                            <div class="text-caption text-grey">Mínimo de Venta</div>
                          </div>
                        </v-col>
                        <v-col cols="6" class="mt-2">
                          <div class="text-center pa-3 bg-teal-lighten-5 rounded">
                            <v-icon size="24" color="teal" class="mb-1">{{ fullProductData.esFacturarSinInventario ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                            <div class="text-h6 font-weight-bold">{{ fullProductData.esFacturarSinInventario ? 'Permitido' : 'No permitido' }}</div>
                            <div class="text-caption text-grey">Facturar Sin Inv.</div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>

                    <!-- Información de registro -->
                    <v-card variant="outlined" class="dashed pa-4 rounded-lg">
                      <div class="d-flex align-center mb-3">
                        <v-icon color="primary" size="20" class="me-2">mdi-history</v-icon>
                        <h4 class="font-weight-bold text-primary">Información de Registro</h4>
                      </div>
                      
                      <v-list density="compact" class="pa-0">
                        <v-list-item class="px-0">
                          <template v-slot:prepend>
                            <v-avatar size="28" color="grey-lighten-3">
                              <v-icon size="16">mdi-account</v-icon>
                            </v-avatar>
                          </template>
                          <v-list-item-title class="text-body-2">Registrado por</v-list-item-title>
                          <v-list-item-subtitle class="text-caption font-weight-medium">{{ fullProductData.usuarioRegistro || 'N/A' }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-2" />

                        <v-list-item class="px-0">
                          <template v-slot:prepend>
                            <v-icon size="18" color="blue-grey" class="me-3">mdi-calendar</v-icon>
                          </template>
                          <v-list-item-title class="text-body-2">Fecha Registro</v-list-item-title>
                          <v-list-item-subtitle class="text-caption font-weight-medium">{{ formateDate(fullProductData.fechaRegistro) || 'N/A' }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-2" />

                        <v-list-item class="px-0">
                          <template v-slot:prepend>
                            <v-chip :color="fullProductData.estado ? 'green' : 'red'" size="small" class="me-3">
                              <v-icon size="14">{{ fullProductData.estado ? 'mdi-check' : 'mdi-close' }}</v-icon>
                            </v-chip>
                          </template>
                          <v-list-item-title class="text-body-2">Estado</v-list-item-title>
                          <v-list-item-subtitle class="text-caption font-weight-medium">{{ fullProductData.estado ? 'Activo' : 'Inactivo' }}</v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Tabla de Precios Mayoristas (Solo si es mayorista) -->
                <v-row dense class="mt-4" v-if="fullProductData.esMayorista">
                  <v-col cols="12">
                    <v-card variant="outlined" class="dashed pa-4 rounded-lg">
                      <div class="d-flex align-center mb-3">
                        <v-icon color="indigo" size="20" class="me-2">mdi-format-list-bulleted-type</v-icon>
                        <h4 class="font-weight-bold text-indigo">Precios Mayoristas Registrados</h4>
                      </div>
                      
                      <v-table density="compact" class="border rounded">
                        <thead>
                          <tr class="bg-indigo-lighten-5">
                            <th class="text-center font-weight-bold text-caption">Cantidad Mínima</th>
                            <th class="text-center font-weight-bold text-caption">Cantidad Máxima</th>
                            <th class="text-center font-weight-bold text-caption">Precio Mayorista</th>
                            <th class="text-center font-weight-bold text-caption">Utilidad (%)</th>
                            <th class="text-center font-weight-bold text-caption">Observaciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(pm, index) in fullProductData.precioMayorista" :key="index">
                            <td class="text-center text-body-2">{{ pm.minimo }}</td>
                            <td class="text-center text-body-2">{{ pm.rangoIndefinido || !pm.maximo || pm.maximo === 0 ? 'A más' : pm.maximo }}</td>
                            <td class="text-center text-body-2 font-weight-bold text-success">{{ formateCurrency(pm.precio) }}</td>
                            <td class="text-center text-body-2 font-weight-bold text-indigo">{{ calcularUtilidad(pm.precio, fullProductData.costo) }}</td>
                            <td class="text-center text-caption text-grey-darken-2">{{ pm.observaciones || '—' }}</td>
                          </tr>
                          <tr v-if="!fullProductData.precioMayorista || fullProductData.precioMayorista.length === 0">
                            <td colspan="5" class="text-center text-grey text-caption py-4">
                              No hay precios mayoristas registrados para este producto.
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>

            <!-- Pestaña 2: Detalles del Proveedor -->
            <v-window-item :value="2">
              <v-container fluid class="pa-0">
                <!-- Proveedor principal destacado -->
                <v-card variant="outlined" class="dashed pa-4 rounded-lg mb-4">
                  <div class="d-flex align-center justify-space-between mb-3">
                    <div class="d-flex align-center">
                      <v-avatar size="40" color="indigo-lighten-5" class="me-3">
                        <v-icon color="indigo" size="22">mdi-star</v-icon>
                      </v-avatar>
                      <div>
                        <h4 class="font-weight-bold text-indigo">Proveedor Principal</h4>
                        <div class="text-caption text-grey">Proveedor predeterminado para este producto</div>
                      </div>
                    </div>
                    <v-chip color="indigo" variant="tonal" prepend-icon="mdi-check-decagram">
                      Predeterminado
                    </v-chip>
                  </div>

                  <div v-if="data.proveedoresProducto && data.proveedoresProducto.filter(p => p.predeterminado).length">
                    <v-list density="comfortable" class="bg-indigo-lighten-5 rounded pa-2">
                      <v-list-item v-for="(prov, index) in data.proveedoresProducto.filter(p => p.predeterminado)" :key="index">
                        <template v-slot:prepend>
                          <v-avatar color="white" size="36" class="me-3">
                            <v-icon color="indigo">mdi-account-tie</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-medium">{{ prov.nombre }}</v-list-item-title>
                        <v-list-item-subtitle>Proveedor principal</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </div>
                  <v-alert v-else type="info" variant="tonal" density="compact" class="mt-2">
                    No hay proveedor principal asignado
                  </v-alert>
                </v-card>

                <!-- Lista de proveedores secundarios -->
                <v-card variant="outlined" class="dashed pa-4 rounded-lg">
                  <div class="d-flex align-center justify-space-between mb-3">
                    <div class="d-flex align-center">
                      <v-avatar size="40" color="blue-grey-lighten-5" class="me-3">
                        <v-icon color="blue-grey" size="22">mdi-account-group</v-icon>
                      </v-avatar>
                      <div>
                        <h4 class="font-weight-bold">Proveedores Secundarios</h4>
                        <div class="text-caption text-grey">Todos los proveedores asociados</div>
                      </div>
                    </div>
                    <v-btn color="indigo-darken-3" variant="elevated" size="small" @click="abrirModalProveedor" prepend-icon="mdi-plus">
                      Agregar
                    </v-btn>
                  </div>

                  <div v-if="data.proveedoresProducto && data.proveedoresProducto.length">
                    <v-list density="comfortable" class="pa-0">
                      <v-list-item v-for="(prov, index) in data.proveedoresProducto" :key="index" 
                        :class="{'bg-grey-lighten-4': prov.predeterminado}">
                        <template v-slot:prepend>
                          <v-avatar :color="prov.predeterminado ? 'indigo-lighten-5' : 'grey-lighten-4'" size="32" class="me-3">
                            <v-icon :color="prov.predeterminado ? 'indigo' : 'grey'" size="18">
                              {{ prov.predeterminado ? 'mdi-star' : 'mdi-account' }}
                            </v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-medium">{{ prov.nombre }}</v-list-item-title>
                        <template v-slot:append>
                          <v-chip v-if="prov.predeterminado" color="indigo" size="small" variant="tonal">
                            Principal
                          </v-chip>
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>
                  <v-alert v-else type="warning" variant="tonal" density="compact" class="mt-2">
                    No hay proveedores asignados a este producto
                  </v-alert>
                </v-card>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card-text>

        <!-- Acciones -->
        <v-divider />
        <v-card-actions >
          <v-spacer />
          <v-btn color="grey-darken-2" variant="tonal" @click="closeDialog" prepend-icon="mdi-close">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- MODAL PARA AGREGAR PROVEEDOR SECUNDARIO -->
    <v-dialog v-model="modalProveedor" max-width="500" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="d-flex align-center bg-indigo-darken-4 text-white py-4">
          <v-avatar size="40" color="white" class="me-3">
            <v-icon color="primary">mdi-account-plus</v-icon>
          </v-avatar>
          <div>
            <h4 class="font-weight-bold">Agregar Proveedor</h4>
            <div class="text-caption font-weight-regular">Asociar un nuevo proveedor al producto</div>
          </div>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form>
            <v-row dense>
              <v-col cols="12">
                <v-autocomplete
                  v-model="data.nuevoProveedor.idProveedor"
                  label="Seleccionar Proveedor"
                  :items="data.proveedores"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-account-search"
                  placeholder="Buscar proveedor..."
                  clearable
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="data.observaciones"
                  label="Observaciones"
                  variant="outlined"
                  density="comfortable"
                  :rows="3"
                  prepend-inner-icon="mdi-text-box-outline"
                  placeholder="Notas o comentarios sobre este proveedor..."
                />
              </v-col>

              <v-col cols="12">
                <v-switch
                  v-model="data.nuevoProveedor.predeterminado"
                  color="indigo"
                  density="compact"
                  label="Establecer como proveedor principal"
                  hide-details
                  class="mt-0"
                />
                <div class="text-caption text-grey ms-8">
                  Este proveedor será el predeterminado para compras
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="grey" variant="outlined" @click="closeModalProveedor" prepend-icon="mdi-close">
            Cancelar
          </v-btn>
          <v-btn color="primary" variant="elevated" @click="postProveedorProducto" prepend-icon="mdi-check">
            Agregar Proveedor
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <OverlayComp :show="data.overlay.show"/>

    <SuccessAlert 
      :success="data.alertSuccess.success" 
      :msg="data.alertSuccess.msg" 
      :show="data.alertSuccess.show" 
    />
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { formatters } from '@/helpers/formatters'
import RequestHttp from '@/services/requestHttp'
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';
import { useStore } from '@/store';
import { httpGet } from '@/scripts/api.js'

export default {
  name: 'ProductDetailsDialog',

  mounted() {
    this.getProveedores()
    // this.getProveedoresProducto()
  },

  props: {
    show: Boolean,
    producto: Object,
  },

  components: {
    SuccessAlert,
    OverlayComp
  },

  setup(props) {
    const tab = ref(1)
    const token = ref(JSON.parse(localStorage.getItem('token')))
    const getProvProduct = async () =>  {
      data.proveedoresProducto = []
      const dataPro = []

      data.overlay.show = true
      const result = await data.requestHttp.getProveedorProductos()
      data.overlay.show = false

      result.map(item => {
        dataPro.push({
          nombre: item.proveedor, 
          idProveedor: item.idProveedor,
          idProducto: item.idProducto,
          predeterminado: item.predeterminado,
          idProveedorProducto: item.idProveedorProducto
        })
      })

      data.proveedoresProducto = dataPro.filter(
        item => item.idProducto === props.producto.idProducto
      )
    }

    const fullProductData = ref({ ...props.producto })
    const localShow = ref(props.show)

    watch(() => props.show, async (val) => {
      localShow.value = val

      if (val) {        
        fullProductData.value = { ...props.producto }
        try {
          const res = await httpGet(`api/producto/${props.producto.idProducto}`)
          if (res) {
            fullProductData.value = { ...props.producto, ...res }
          }
        } catch (e) {
          console.error("Error loading product details:", e)
        }
        getProvProduct()
        tab.value = 1
      }
    })

    const modalProveedor = ref(false)
    const data = reactive({
      proveedores: [],
      proveedoresProducto: [],
      nuevoProveedor: {
        idProveedor: null,
        idProducto: null,
        predeterminado: false,
        usuarioRegistro: null,
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
      observaciones: null,
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

    return {
      tab,
      localShow,
      modalProveedor,
      data,
      token,
      showSuccesAlert,
      fullProductData
    }
  },

  methods: {
    async getProveedores() {
      this.data.proveedores = []
      const result = await this.data.requestHttp.getProveedores()
      result.map(item => {
        this.data.proveedores.push({title: item.nombre, value: item.idProveedor})
      })
    },

    async getProveedoresProducto() {
      this.data.proveedoresProducto = []
      const data = []

      this.data.overlay = true
      const result = await this.data.requestHttp.getProveedorProductos()
      this.data.overlay = false
      
      result.map(item => {
        data.push({
          nombre: item.nombre, 
          idProveedor: item.idProveedor,
          idProducto: item.idProducto,
          idProveedorProducto: item.idProveedorProducto
        })
      })

      this.data.proveedoresProducto = data.filter(item => item.idProducto === this.producto.idProducto)
    },

    async postProveedorProducto() {
      if (!this.data.nuevoProveedor.idProveedor) {
        alert('Elija un proveedor')
        return
      }
      this.data.nuevoProveedor.usuarioRegistro = useStore().getNameUser()
      this.data.nuevoProveedor.idProducto = this.producto.idProducto

      this.data.overlay.show = true
      const result = await this.data.requestHttp.postProveedorProducto(this.data.nuevoProveedor)
      this.data.overlay.show = false
      
      if (result !==  null) {
        this.showSuccesAlert('¡Registro Guardado!', true)
      } else {
        this.showSuccesAlert('¡No se ha podido guardar el registro!', false)
        return
      }

      this.modalProveedor = false
    },



    closeDialog() {
      this.$emit('cerrarDialog', false)
    },

    abrirModalProveedor() {
      this.modalProveedor = true
    },

    closeModalProveedor() {
      this.data.nuevoProveedor.idProveedor = null
      this.data.observaciones = null
      this.data.nuevoProveedor.predeterminado = false
      this.modalProveedor = false
    },

    formateDate(dateString) {
      const value = formatters.formatDate(dateString)
      return value
    },

    formateCurrency(key) {
      const value = formatters.formatCurrency(key)
      return value
    },

    calcularUtilidad(precio, costo) {
      if (!precio || !costo) return '0.00%'
      const p = Number(precio)
      const c = Number(costo)
      if (c === 0) return '0.00%'
      return (((p - c) / c) * 100).toFixed(2) + '%'
    }
  },
}
</script>

<style scoped>
.custom-border{
  border-top-left-radius: 5px !important;
  border-top-right-radius: 5px !important;
}

.custom-margin{
  margin-top: -10px;
}

.dashed {
  border: 1px grey dashed;
}
</style>
