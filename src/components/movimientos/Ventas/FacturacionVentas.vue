<template>
  <div class="w-100">
    <v-card
      class="border-t border-b"
      elevation="0"
      rounded="0"
    >
      <!-- Encabezado -->
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div class="text-h6 font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="primary">
              mdi-package-variant
            </v-icon>
            Facturación
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn v-if="hasAccessToFunct('32')" class="nuevaVenta rounded" @click="createFactura()"
          color="indigo-darken-4" prepend-icon="mdi-plus" variant="tonal">
          Nueva Venta
        </v-btn>
      </template>
      <v-divider />
    <!-- FILTROS PRINCIPALES -->
      <v-card class="pa-2 mb-2" elevation="0">
        <div class="d-flex align-center">
          <v-icon color="primary" class="mr-2">
            mdi-filter
          </v-icon>
          <span class="text-subtitle- font-weight-medium">
            Filtros de búsqueda
          </span>
        </div>
        
        <v-row dense align="center" class="headInfo">
          <v-col cols="12" md="6" sm="6">
            <v-row dense>
              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  v-model="search.desde"
                  label="Fecha inicial"
                  type="date"
                  density="compact"
                  variant="outlined"
                  hide-details
                  prepend-inner-icon="mdi-calendar-arrow-left"
                />
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  v-model="search.hasta"
                  label="Fecha final"
                  type="date"
                  density="compact"
                  variant="outlined"
                  hide-details
                  prepend-inner-icon="mdi-calendar-arrow-right"
                />

              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="6" sm="6">
          <!-- RESÚMENES Y ACCIONES -->
            <v-card variant="flat" class="px-4 py-2" color="grey-lighten-4">
              <v-row dense align="center">
                <!-- MÉTRICAS -->
                <v-col cols="10" md="10" sm="10">
                  <div class="d-flex flex-wrap align-center ga-4">
                    <!-- Resumen de ventas -->
                    <div class="d-flex align-center">
                      <v-avatar size="40" color="blue-lighten-5" class="mr-3">
                        <v-icon color="blue">mdi-chart-box</v-icon>
                      </v-avatar>
                      <div>
                        <div class="text-caption text-grey">Total Ventas</div>
                        <div class="text-h6 font-weight-bold">{{ data.facturas.length }}</div>
                      </div>
                    </div>
                    
                    <v-divider vertical />
                    
                    <!-- Total facturado -->
                    <div class="d-flex align-center">
                      <v-avatar size="40" color="green-lighten-5" class="mr-3">
                        <v-icon color="green">mdi-cash-multiple</v-icon>
                      </v-avatar>
                      <div>
                        <div class="text-caption text-grey">
                          Total Facturado
                        </div>
                        <div class="font-weight-bold text-green">
                          {{ formatedCurrency(totalFacturado) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </v-col>
                
                <!-- ACCIONES -->
                <v-col cols="2" md="2" sm="2">
                  <div class="d-flex justify-end">
                    <v-btn icon size="small" @click="getVentas()">
                      <v-icon color="grey">
                        mdi-refresh
                      </v-icon>
                      <v-tooltip activator="parent" location="top center">
                        Actualizar
                      </v-tooltip>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
        

      <v-card-text class="pt-0 px-0">
        <!-- :mobile="isMobile" -->
        <v-data-table :search="data.search" :headers="data.header" :items="data.facturas"
          class="font detalleVentas border-t" density="compact" :loading="data.loading" :row-props="setStyle"
          :header-props="{ class: 'font-weight-bold' }" items-per-page="10" hover>
          <template v-slot:top>
            <v-row dense class="px-4 py-2">
              <v-col cols="12" md="8" sm="8">
                <div class="d-flex align-center">
                  <div class="text-h6 font-weight-bold d-flex align-center
                    text-grey">
                    <v-icon class="me-2" color="grey">
                      mdi-file-document-multiple
                    </v-icon>
                    Ventas
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4" sm="4">
                <v-text-field
                  v-model="data.search"
                  color="primary"
                  density="compact"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  label="Buscar ventas"
                  hide-details
                  placeholder="Cliente, número, producto..."
                  clearable
                  persistent-placeholder
                  @click:clear="data.search = ''"
                />
              </v-col>
            </v-row>
            <v-divider />
          </template>

          <template v-slot:header.opc="{ }">
            <v-icon class="options">
              mdi-dots-vertical
            </v-icon>
          </template>

          <template v-slot:header.rutaCliente>
            <div>Ruta</div>
            <v-autocomplete
              v-model="search.idRuta"
              variant="outlined"
              density="compact"
              :items="cmb.rutas"
              hide-details
              clearable
            >
            </v-autocomplete>
          </template>

          <template v-slot:header.cliente>
            <div>Cliente</div>
            <v-autocomplete
              v-model="search.idCliente"
              variant="outlined"
              density="compact"
              :items="cmb.clientes"
              hide-details
              clearable
            >
            </v-autocomplete>
          </template>

          <template v-slot:loader>
            <v-progress-linear
              color="indigo"
              indeterminate
              height="2"
            />
          </template>

          <template v-slot:loading>
            <v-skeleton-loader
              type="table-row@10"
            ></v-skeleton-loader>
          </template>

          <template v-slot:item.total="{ item }">
            <div>
              {{ formatedCurrency(item.total) }}
            </div>
          </template>

          <template v-slot:item.estadoMensaje="{ item }">
            <v-btn icon size="small" variant="flat" class="border">
              <v-icon :color="setIcon(item.estadoMensaje).color ?  setIcon(item.estadoMensaje).color : 'grey'">
                {{ setIcon(item.estadoMensaje).icon }}
              </v-icon>
              <v-tooltip activator="parent" location="top center">
                {{ setIcon(item.estadoMensaje).msg }}
              </v-tooltip>
            </v-btn>
          </template>

          <template
            v-slot:item.fechaRegistro="{ item }"
          >
            <div>
              {{
                formatedDate(item.fechaRegistro)
              }}
            </div>
          </template>
          <template
            v-slot:item.credito="{ item }"
          >
            <v-chip
              :color="
                item.credito
                  ? 'error'
                  : 'indigo-darken-4'
              "
              :text="
                item.credito
                  ? 'Crédito'
                  : 'Contado'
              "
            />
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
                <v-list-item v-if="hasAccessToFunct('33') && item.estado" rounded density="compact" prepend-icon="mdi-pencil"
                  color="indigo" @click="editFactura(item)">
                  <template v-slot:title>
                      <v-divider vertical />
                      Editar
                  </template>
                </v-list-item>

                <v-list-item rounded density="compact" prepend-icon="mdi-eye"
                  color="indigo" @click="viewFactura(item)">
                  <template v-slot:title>
                      <v-divider vertical />
                      Ver Factura
                  </template>
                </v-list-item>

                <v-list-item v-if="hasAccessToFunct('33') && item.estado" rounded density="compact" prepend-icon="mdi-cancel"
                  color="indigo" @click="showAnular(item)">
                  <template v-slot:title>
                      <v-divider vertical />
                      Anular Factura
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip :color="item.estado ? 'green' : 'error'" small>
              {{
                item.estado
                  ? 'Activo'
                  : 'Anulada'
              }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="data.showAlertAnular" max-width="400px" persistent>
      <v-card elevation="10" rounded>
          <v-card-title class="bg-indigo-darken-4 d-flex justify-space-between 
              align-center px-6">
              Anular Factura
          </v-card-title>

          <v-card-text class="d-flex justify-center align-center">
            <span>
              ¿Desea anular esta factura?
            </span>
          </v-card-text>

          <v-card-actions class="justify-end px-6 pb-4">
              <v-btn color="grey" variant="tonal" @click="closeAnular()">
                  Cerrar
              </v-btn>
              <v-btn class="bg-indigo-darken-4" @click="anularFactura()">
                  Guardar
              </v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="data.showNotify" max-width="300px" persistent>
      <v-card elevation="10" rounded>
          <v-card-text v-if="data.showMsg" class="d-flex flex-column justify-center align-center">
            <v-progress-circular color="indigo-darken-4" size="50" indeterminate/>
            <strong class="mt-2">
              {{ data.msgAnular }}
            </strong>
          </v-card-text>

          <v-card-text v-else class="d-flex flex-column justify-center align-center">
            <v-icon :color="data.facturaAnulada ? 'green' : 'error'" size="50">
              {{ data.facturaAnulada ? 'mdi-check-circle-outline' : 'mdi-cancel' }}
            </v-icon>
            <strong class="mt-2">
              {{ data.msgAnular }}
            </strong>
          </v-card-text>
      </v-card>
    </v-dialog>

    <NuevaFactura
      :show="data.editFactura.show"
      :editar="data.editFactura.editar"
      :idFact="data.idVenta"
      @closeDialog="closeDialog"
      :title="data.editFactura.title"
      @refreshTable="getVentas"
    />
    <ViewVenta
      :show="data.viewFactura.show"
      :factura="data.viewFactura.item"
      @closeDialog="closeDialog"
    />
    <AlertaAction
      :show="data.viewAlert"
      @deleteItem="deleteAction"
    />
  </div>
</template>

<script>
import { formatters } from '@/helpers/formatters.js'
import {
  reactive,
  computed,
  ref,
  onMounted,
  onUnmounted,
  nextTick
} from 'vue'
import NuevaFactura from './NuevaFactura.vue'
import ViewVenta from './ViewVenta.vue'
import RequestHttp from '@/services/requestHttp'
import AlertaAction from '@/components/widgets/AlertaAction.vue'
import { useStore } from '@/store'
import {
  getItemsCombobox,
  httpGet,
  httpPost
} from '@/scripts/api.js'
import { useSnackbar } from '@/composables/use-snackbar.js'
import { getIntervaloMesActual } from '@/scripts/utils.js'
import { hasAccessToFunct } from '@/scripts/Seguridad.js'
import introJs from 'intro.js'
import tourOptions from '@/helpers/utilFunctions'

export default {
  beforeRouteEnter(from, to, next) {
    next(vm => {
      vm.getVentas()
      vm.loadCmbClientes()
      vm.loadCmbRutas()
      vm.verifyDataSecurity()
    })
  },

  components: {
    NuevaFactura,
    ViewVenta,
    AlertaAction
  },

  computed: {
    totalFacturado() {
      return this.data.facturas.reduce(
        (acc, factura) => {
          acc += factura.total
          return acc
        },
        0
      )
    },
  },

  data() {
    return {
      snackbar: useSnackbar(),

      cmb: {
        clientes: [],
        rutas: []
      },

      search: {
        desde: getIntervaloMesActual().fechaDesde,
        hasta: getIntervaloMesActual().fechaHasta,
        idCliente: null,
        idRuta: null
      }
    }
  },

  setup() {
    const store = useStore()
    const screenWidth = ref(window.innerWidth)
    const isMobile = computed(
      () => screenWidth.value <= 850
    )
    const updateScreen = () => {
      screenWidth.value = window.innerWidth
    }

    onMounted(async () => {
      window.addEventListener(
        'resize',
        updateScreen
      )

      await nextTick()

      const introKey = 'tutorialVenta'
      if (localStorage.getItem(introKey)) return
      
      const el = document.querySelector('.headInfo')
      const el2 = document.querySelector('.detalleVentas')
      const el3 = document.querySelector('.options')
      const el4 = document.querySelector('.nuevaVenta')

      if (!el || !el2 || !el3 || !el4) return
      
      var steps = [{
          title: 'Bienvenido',
          intro: 'Tenemos nuevas cosas para ti!!'
        }, {
          title: 'Nuevo diseño de encabezados',
          element: el,
          intro: 'Hemos mejorado la visulización de los detalles del módulo de ventas.'
        }, {
          title: 'Detalles de Ventas',
          element: el2,
          intro: 'Aqui puedes podrás ver todas las facturas registradas, y sus detalles.'
        }, {
          title: 'Opciones',
          element: el3,
          intro: 'Al dar click en los tres puntitos, podrás visualizar las diferentes opciones para realizar en base a tus permisos.'
        }, {
          title: 'Registrar una nueva venta',
          element: el4,
          intro: 'Para registrar una nueva venta haz click en el botón "Nueva Venta"'
        },
      ]

      tourOptions.steps = steps
      introJs.tour().setOptions(tourOptions).onComplete(() => {
        localStorage.setItem(introKey, 'true')
      }).onExit(() => {
        localStorage.setItem(introKey, 'true')
      }).start()
    })

    onUnmounted(() => {
      window.addEventListener(
        'resize',
        updateScreen
      )
    })

    const dateHastaFormatted = ref(null)
    const dateDesdeFormatted = ref(null)
    const dateHasta = computed(() => {
      return dateHastaFormatted.value
        ? new Date(
            dateHastaFormatted.value
          ).toLocaleDateString()
        : null
    })

    const dateDesde = computed(() => {
      return dateDesdeFormatted.value
        ? new Date(
            dateDesdeFormatted.value
          ).toLocaleDateString()
        : null
    })
    const data = reactive({
      header: [
        {
          title: '',
          key: 'opc',
          align: 'center',
          headerProps: {
            class: 'pa-0'
          },
          cellProps: {
            class: 'pa-0'
          }
        },
        {
          title: 'Nº Factura',
          key: 'noVenta',
          sortable: false,
          align: 'center',
          headerProps: {
            class: 'pa-1'
          },
          cellProps: {
            class: 'pa-1'
          }
        },
        {
          title: 'Tipo Venta',
          key: 'tipoVenta',
          sortable: false,
          align: 'center',
          headerProps: {
            class: 'pa-1'
          },
          cellProps: {
            class: 'pa-1'
          }
        },
        {
          title: 'Ruta',
          key: 'rutaCliente',
          align: 'center',
          sortable: false,
          cellProps: {
            class: 'pa-1'
          },
          headerProps: {
            class: 'pa-1',
            style: {
              width: '300px'
            }
          }
        },
        {
          title: 'Cliente',
          key: 'cliente',
          align: 'center',
          sortable: false,
          cellProps: {
            class: 'pa-1'
          },
          headerProps: {
            class: 'pa-1',
            style: {
              width: '300px'
            }
          }
        },

        {
          title: 'Total',
          key: 'total',
          align: 'center'
        } /*
        {
          title: 'Dirección',
          key: 'enviarA',
          align: 'center'
        },*/,

        {
          title: 'Observaciones',
          key: 'observaciones',
          align: 'center'
        },
        {
          title: 'Ubicación POS',
          key: 'ubicacion',
          align: 'center',
          sortable: false,
          cellProps: {
            class: 'pa-1'
          },
          headerProps: {
            class: 'pa-1',
            style: {
              width: '200px'
            }
          }
        },
        {
          title: 'Estado Mensaje',
          key: 'estadoMensaje',
          align: 'center',
          sortable: false,
          cellProps: {
            class: 'pa-1'
          },
          headerProps: {
            class: 'pa-1',
            style: {
              width: '1px'
            }
          }
        },
        {
          title: 'Fecha Registro',
          key: 'fechaRegistro',
          align: 'center'
        },
        {
          title: 'Usuario Registro',
          key: 'usuarioRegistro',
          align: 'center'
        },
        {
          title: 'Condición',
          key: 'credito',
          align: 'center'
        },
        {
          title: 'Estado',
          key: 'estado',
          align: 'center'
        }
      ],
      facturas: [],
      visibleDialog: false,

      options: [
        {
          title: 'Ventas',
          icon: 'mdi-account',
          value: 'Ventas',
          wind: 1
        },
        {
          title: 'Detalle de Venta',
          icon: 'mdi-account',
          value: 'Detalle de Venta',
          wind: 2
        }
      ],
      selectedOptions: ['Ventas'],
      drawer: true,

      editFactura: {
        show: false,
        item: {},
        editar: false,
        title: ''
      },
      viewFactura: {
        show: false,
        item: {}
      },
      crud: {
        create: false,
        view: false,
        edit: false,
        delete: false
      },

      // ANULAR FACTURA
      itemSelected: null,
      showAlertAnular: false,
      showNotify: false, 
      showMsg: false,
      msgAnular: null,
      facturaAnulada: false,

      loading: false,
      search: null,
      viewAlert: false,
      selectedItem: null,
      idVenta: null,
      menuDesde: false,
      menuHasta: false,
      requestHttp: new RequestHttp()
    })

    return {
      data,
      dateDesde,
      dateDesdeFormatted,
      dateHasta,
      dateHastaFormatted,
      isMobile,
      store
    }
  },

  methods: {
    hasAccessToFunct,
    
    setIcon(estado) { 
      if (estado === 'No Enviado') {
        return {
          color: 'red',
          icon: 'mdi-check',
          msg: 'No enviado'
        } 
      }

      if (estado === 'Enviado') {
        
        return {
          color: 'grey',
          icon:  'mdi-check',
          msg: 'Enviado'
        } 
      }

      if (estado === 'Entregado') {
        return {
          color: 'grey',
          icon:  'mdi-check-all',
          msg: 'Entregado'
        } 
      }

      if (estado == 'Leído') {
        return {
          color: 'primary',
          icon:  'mdi-check-all',
          msg: 'Leído'
        } 
      }
    },

    async loadCmbClientes() {
      const clientes = await getItemsCombobox(
        'api/cliente/combobox'
      )
      this.cmb.clientes = clientes
    },

    async loadCmbRutas() {
      const rutas = await getItemsCombobox(
        'api/rutas/combobox'
      )
      this.cmb.rutas = rutas
    },

    setStyle({ index }) {
      return {
        class:
          index % 2 === 0
            ? 'bg-white'
            : 'bg-indigo-lighten-5'
      }
    },

    verifyDataSecurity() {
      const token = this.store.getInfoUser()
      const permisos = token.permisos.split(',')
      permisos.map((item) => {
        switch (item) {
          case '31':
            this.data.crud.view = true
            break
          case '32':
            this.data.crud.create = true
            break
          case '33':
            this.data.crud.edit = true
            break
          case '34':
            this.data.crud.delete = true
            break
        }
      })
    },

    async getVentas() {
      this.data.facturas = []
      this.data.loading = true
      const result = await httpPost(
        'api/venta/lista',
        this.search
      )

      this.data.facturas = result.data
      this.data.loading = false
    },

    formatedCurrency(key) {
      const value = formatters.formatCurrency(key)
      return value
    },

    formatedDate(dataString) {
      const value =
        formatters.formatDate(dataString)
      return value
    },

    getStatusColor(status) {
      const statusColors = {
        Activo: 'success',
        Inactivo: 'warning',
        Descontinuado: 'error'
      }
      return statusColors[status] || 'grey'
    },

    createFactura() {
      this.data.editFactura.title = ''
      this.data.editFactura.show = true
      this.data.editFactura.editar = false
      this.data.editFactura.title =
        'NUEVA FACTURA'
    },

    viewFactura(item) {
      this.data.viewFactura.show = true
      this.data.viewFactura.item = item
    },

    editFactura(item) {
      this.data.editFactura.show = true
      this.data.editFactura.editar = true
      this.data.idVenta = item.idVenta
      this.data.editFactura.title =
        'EDITAR FACTURA'
    },

    deleteAction(val) {
      if (val === true) {
        this.deleteItem()
      }
      this.data.viewAlert = false
    },

    showAnular(item) {
      this.data.itemSelected = item
      this.data.showAlertAnular = true
    },

    async anularFactura() {
      try {
        this.data.showAlertAnular = false
        this.data.showNotify = true
        this.data.showMsg = true
        this.data.msgAnular = 'Anulando factura...'
        const result = await this.data.requestHttp.anularVenta(this.data.itemSelected.idVenta)

        if (result.code === 200) {
          this.data.showMsg = false
          this.data.facturaAnulada = true
          this.data.msgAnular = 'Factura Anulada'
          setTimeout(() => {
            this.data.showNotify = false
          }, 1500)
        } else {
          this.data.showMsg = false
          this.data.facturaAnulada = false
          this.data.msgAnular = 'No se pudo anular la factura'
          setTimeout(() => {
            this.data.showNotify = false
          }, 1500)
        }
      } catch (error) {
        this.data.showMsg = false
        this.data.facturaAnulada = false
        this.data.msgAnular = 'Error al anular la factura'
        setTimeout(() => {
          this.data.showNotify = false
        }, 1500) 
      }

      this.getVentas()
    },

    closeAnular() {
      this.data.itemSelected = null
      this.data.showAlertAnular = false
    },

    showAlert(item) {
      this.data.viewAlert = true
      this.data.selectedItem = item
    },

    async deleteItem() {
      const result =
        await this.data.requestHttp.deleteVenta(
          this.data.selectedItem.idVenta
        )
      if (result !== null) {
        alert('Venta Eliminada')
        this.getVentas()
      } else {
        alert('No se pudo eliminar el registro')
      }
    },

    closeDialog(val) {
      this.data.viewFactura.show = val
      this.data.editFactura.show = val
      this.data.editFactura.editar = val
      this.data.editFactura.show = val
      this.data.editFactura.title = ''
    }
  },

  watch: {
    search: {
      handler(){
        this.getVentas()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.font {
  font-size: 12px !important;
  color: black;
  font-weight: 500;
}
</style>
