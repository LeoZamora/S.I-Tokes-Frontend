<template>
  <div class="w-100">
    <v-card
      class="border"
      elevation="0"
      rounded="0"
    >
      <!-- Encabezado -->
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div
            class="text-h6 font-weight-bold d-flex align-center"
          >
            <v-icon class="me-2" color="primary"
              >mdi-package-variant</v-icon
            >
            Facturación
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn
          v-if="data.crud.create"
          class="bg-primary rounded-"
          @click="createFactura()"
        >
          <v-icon>mdi-plus</v-icon>
          <v-tooltip
            activator="parent"
            location="left"
            >Nueva Factura</v-tooltip
          >
        </v-btn>
      </template>
      <v-divider thickness="2" />
      <v-row class="pa-2" dense>
        <v-col cols="12" md="12" sm="12">
          <v-row dense>
            <v-col>
              <v-text-field
                v-model="data.search"
                color="primary"
                density="compact"
                variant="outlined"
                append-inner-icon="mdi-magnify"
                label="Buscar en tabla:"
                hide-details
                placeholder="Ingrese un texto a buscar..."
                persistent-placeholder
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="search.desde"
                label="Fecha desde:"
                type="date"
                density="compact"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="search.hasta"
                label="Fecha hasta:"
                type="date"
                density="compact"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="12" sm="12" class="d-flex justify-center align-center">
          <v-row dense>
            <v-col cols="12" md="6" sm="6" class="border-e align-center">
              <div class="mx-2">
                <v-icon>mdi-pound</v-icon>
                <span>
                  Cantidad ventas:
                  <strong>
                    {{
                      data.facturas.length
                    }}
                  </strong>
                </span>
              </div>
              <div class="mx-2">
                <v-icon color="green"
                  >mdi-cash-multiple</v-icon
                >
                <span>
                  Total facturado: 
                  <strong>
                    {{
                      formatedCurrency(totalFacturado)
                    }}
                  </strong>
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="d-flex align-center justify-end">
              <v-btn
                icon
                color="green"
                size="small"
                variant="text"
                class="mr-2 border"
                @click="getVentas()"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                icon
                color="grey"
                size="small"
                variant="text"
                class="border"
                @click="data.search = null"
              >
                <v-icon>mdi-broom</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-card-text class="pt-0 px-0">
        <v-card-subtitle
          class="d-flex align-center text-center mb-2"
        >
          <v-divider thickness="2" />
          <span
            class="mx-6 text-grey font-weight-bold"
            >Registros</span
          >
          <v-divider thickness="2" />
        </v-card-subtitle>
        <v-data-table
          :search="data.search"
          :mobile="isMobile"
          :headers="data.header"
          :items="data.facturas"
          class="border font"
          density="compact"
          :loading="data.loading"
          :row-props="setStyle"
          :header-props="{
            class: 'font-weight-bold'
          }"
          items-per-page="10"
          hover
        >
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
            <v-tooltip
              text="Editar"
              location="top"
            >
              <template
                v-slot:activator="{ props }"
              >
                <v-icon
                  v-if="data.crud.edit"
                  v-bind="props"
                  size="small"
                  color="green"
                  @click="editFactura(item)"
                  class="mr-1"
                >
                  mdi-pencil
                </v-icon>
              </template>
            </v-tooltip>

            <v-tooltip
              text="Eliminar"
              location="top"
            >
              <template
                v-slot:activator="{ props }"
              >
                <v-icon
                  v-if="data.crud.delete"
                  v-bind="props"
                  size="small"
                  color="error"
                  class="mr-1"
                  @click="showAlert(item)"
                >
                  mdi-delete
                </v-icon>
              </template>
            </v-tooltip>

            <v-tooltip text="Ver" location="top">
              <template
                v-slot:activator="{ props }"
              >
                <v-icon
                  v-if="data.crud.view"
                  v-bind="props"
                  size="small"
                  color="indigo-darken-4"
                  @click="viewFactura(item)"
                >
                  mdi-eye
                </v-icon>
              </template>
            </v-tooltip>
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip
              :color="
                item.estado ? 'green' : 'error'
              "
              small
            >
              {{
                item.estado
                  ? 'Activo'
                  : 'Inactivo'
              }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
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
    <AlertComp
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
  onUnmounted
} from 'vue'
import NuevaFactura from './NuevaFactura.vue'
import ViewVenta from './ViewVenta.vue'
import RequestHttp from '@/services/requestHttp'
import AlertComp from '@/components/widgets/AlertComp.vue'
import { useStore } from '@/store'
import {
  getItemsCombobox,
  httpGet,
  httpPost
} from '@/scripts/api.js'
import { useSnackbar } from '@/composables/use-snackbar.js'
import { getIntervaloMesActual } from '@/scripts/utils.js'

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
    AlertComp
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
    onMounted(() => {
      window.addEventListener(
        'resize',
        updateScreen
      )
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
          align: 'center'
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
