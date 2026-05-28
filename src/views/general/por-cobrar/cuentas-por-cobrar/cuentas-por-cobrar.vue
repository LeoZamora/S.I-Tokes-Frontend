<template>
  <div>
    <!--WIN1: PRINCIPAL-->
    <v-card v-if="!display.visualizarCuentas" class="border-t">
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div class="text-h6 font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="primary">mdi-cash-clock</v-icon>
            Cuentas por Cobrar
          </div>
        </div>
      </template>
      <v-card-subtitle
          class="d-flex align-center text-center"
        >
          <v-divider />
          <span class="mx-6 text-grey font-weight-bold">
            Datos Generales
          </span>
        <v-divider thickness="2" />
      </v-card-subtitle>

      <v-row class="px-2" dense>
        <v-col cols="12">
          <v-card elevation="0" class="pa-4">
            <!-- PRIMERA FILA: MÉTRICAS Y BUSCADOR -->
            <v-row dense align="center" class="totalesInfo">
              <!-- MÉTRICAS -->
              <v-col cols="12" md="8">
                <div class="d-flex flex-wrap align-center ga-3">
                  <v-card v-for="(param, index) in tbl.params" :key="index" 
                    variant="flat" class="pa-2" :color="`${param.color}-lighten-5`">
                    <div class="d-flex align-center">
                      <v-avatar size="36" :color="`${param.color}-lighten-4`" class="mr-2">
                        <v-icon :color="param.color" size="small">
                          {{ param.icon }}
                        </v-icon>
                      </v-avatar>
                      <div>
                        <div class="text-caption text-grey">
                          {{ param.title }}
                        </div>
                        <div class="text-body-1 font-weight-bold">
                          <template v-if="param.value === 1">
                            {{ totalCuentasPagadas }}
                          </template>
                          <template v-else-if="param.value === 2">
                            {{ totalCuentasPendientes }}
                          </template>
                          <template v-else-if="param.value === 3">
                            {{ formatedCurrency(totalFacturado) }}
                          </template>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </div>
              </v-col>

              <!-- BUSCADOR -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="tbl.search"
                  label="Buscar"
                  prepend-inner-icon="mdi-magnify"
                  hide-details
                  placeholder="Filtrar datos por cliente"
                  persistent-placeholder
                  :disabled="!tbl.agruparXCliente"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
            </v-row>

            <!-- SEGUNDA FILA: OPCIONES DE VISUALIZACIÓN -->
            <v-row dense class="alternador mt-3" align="center">
              <v-col cols="12">
                <div class="d-flex align-center justify-space-between pa-2 bg-grey-lighten-4 rounded">
                  <div class="d-flex align-center">
                    <v-icon size="small" class="mr-2" color="primary">mdi-view-dashboard</v-icon>
                    <span class="text-subtitle-2">Agrupar por:</span>
                  </div>

                  <v-btn-toggle
                    v-model="tbl.agruparXCliente"
                    color="primary"
                    density="comfortable"
                    mandatory
                    rounded="lg"
                  >
                    <v-btn :value="true" variant="flat">
                      <v-icon start>mdi-account</v-icon>
                      Cliente
                    </v-btn>

                    <v-btn :value="false" variant="flat">
                      <v-icon start>mdi-receipt</v-icon>
                      Venta
                    </v-btn>
                  </v-btn-toggle>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-card-subtitle
          class="d-flex align-center text-center"
        >
          <v-divider thickness="2" />
          <span
            class="mx-6 text-grey font-weight-bold"
            >Detalles de las Cuentas</span
          >
        <v-divider thickness="2" />
      </v-card-subtitle>

      <v-card-text class="pt-0">
        <template v-if="tbl.agruparXCliente">
          <v-data-table
            :headers="tbl.headers"
            :items="tbl.items"
            :search="tbl.search"
            :row-props="setStyle"
            class="border rounded font detalleRegistros"
          >
            <template v-slot:item.opc="{ item }">
              <v-menu :close-on-content-click="false" offset-y>
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" icon variant="text">
                    <v-icon color="grey">
                      mdi-dots-vertical
                    </v-icon>
                  </v-btn>
                </template>
                <v-list nav rounded="lg">
                  <v-list-item-subtitle class="pa-1">
                    Opciones
                  </v-list-item-subtitle>
                  <v-list-item @click="openVisualizarCuentasDisplay(item)"
                    prepend-icon="mdi-eye">
                    <v-list-item-title>Visualizar Cuentas</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <template v-slot:item.saldoPendienteTotal="{ item }">
              <div>{{ formatedCurrency(item.saldoPendienteTotal) }}</div>
            </template>
            <template v-slot:item.fechaRegistro="{ item }">
              <div>{{ formatedDate(item.fechaRegistro) }}</div>
            </template>

            <template v-slot:header.opc="{ }">
              <v-icon class="options">
                mdi-dots-vertical
              </v-icon>
            </template>
          </v-data-table>
        </template>
        <template v-else>
          <tabla-cuentas-por-venta class="border rounded font" />
        </template>
      </v-card-text>
    </v-card>

    <!--WIN2: VISUALIZAR CUENTAS-->
    <visualizar-cuentas
        v-if="display.visualizarCuentas"
        :cxc="visualizarCuentas"
        @close="closeVisualizarCuentasDisplay"
    ></visualizar-cuentas>
  </div>
</template>

<script>
import {httpGet} from "@/scripts/api.js";
import {useLoading} from "@/composables/use-loading.js";
import {useSnackbar} from "@/composables/use-snackbar.js";
import {formatters} from "@/helpers/formatters.js";
import TablaCuentasPorVenta from '@/views/general/por-cobrar/cuentas-por-cobrar/components/tabla-cuentas-por-venta.vue'
import VisualizarCuentas from "@/views/general/por-cobrar/cuentas-por-cobrar/components/visualizar-cuentas.vue";
import { onMounted, nextTick } from "vue";
import tourOptions from "@/helpers/utilFunctions";
import introJs from "intro.js";

export default {
  name: 'cuentas-por-cobrar',
  components: {VisualizarCuentas, TablaCuentasPorVenta},


  setup() {
    onMounted(async () => {
      await nextTick()

      const introKey = 'tutorialPorCobrar'
      if (localStorage.getItem(introKey)) return

      const el = document.querySelector('.totalesInfo')
      const el2 = document.querySelector('.alternador')
      const el3 = document.querySelector('.detalleRegistros')
      const el4 = document.querySelector('.options')

      if (!el || !el2 || !el3 || !el4) return

      var steps = [{
          title: 'Bienvenido',
          intro: 'Tenemos nuevas cosas para ti!!'
        }, {
          title: 'Nuevo diseño de encabezados',
          element: el,
          intro: 'Hemos mejorado la visulización de los totales, como el total de cuentas pagados, pendientes y el total de salfo pendiente'
        }, {
          title: 'Opciones de registros',
          element: el2,
          intro: 'Aqui podrás alternar entre los detalles de clientes y el de ventas'
        }, {
          title: 'Detalles de Registros',
          element: el3,
          intro: 'De acuerdo a la opción seleccionada, aqui podras ver los registros correpondientes'
        }, {
          title: 'Opciones',
          element: el4,
          intro: 'Te mostraremos las direferentes opciones a seleccionar al dar click en los tres puntitos de cada registro'
        },
      ]

      tourOptions.steps = steps
      introJs.tour().setOptions(tourOptions).onComplete(() => {
        localStorage.setItem(introKey, 'true')
      }).onExit(() => {
        localStorage.setItem(introKey, 'true')
      }).start()
    })
  },

  computed: {
    totalFacturado() {
      return this.tbl.items.reduce(
        (acc, cuenta) => {
          acc += cuenta.saldoPendienteTotal
          return acc
        },
        0
      )
    },
    totalCuentasPendientes() {
      return this.tbl.items.reduce(
        (acc, cuenta) => {
          acc += cuenta.nCreditosPendientes
          return acc
        },
        0
      )
    },
    totalCuentasPagadas() {
      return this.tbl.items.reduce(
        (acc, cuenta) => {
          acc += cuenta.nCreditosPagados
          return acc
        },
        0
      )
    },
  },

  data(){
    return {
      display: {
        visualizarCuentas: 0,
      },

      tbl: {
        agruparXCliente: true,
        search: '',
        items: [],
        headers: [
          {
            title: '',
            key: 'opc',
            align: 'center',
            opciones: true,
            sortable: false,
            headerProps: {
              class: 'pa-0',
            },
            cellProps: {
              class: 'pa-0',
            }
          },
          {
            title: 'Cliente',
            key: 'cliente',
            format: '',
            align: 'center',
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Ruta de Cliente',
            key: 'rutaCliente',
            align: 'center',
            format: '',
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'N° Créditos Pagados',
            key: 'nCreditosPagados',
            format: '',
            align: 'center',
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'N° Créditos Pendientes',
            key: 'nCreditosPendientes',
            format: '',
            align: 'center',
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Saldo Pendiente Total',
            key: 'saldoPendienteTotal',
            format: 'currency',
            align: 'center',
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Fecha Registro',
            key: 'fechaRegistro',
            format: 'date',
            align: 'center',
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Usuario Registro',
            key: 'usuarioRegistro',
            format: '',
            align: 'center',
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
        ],
        params: [
          { title: 'Total de cuentas pagadas', icon: 'mdi-file-document-check', color: 'green', value: 1 },
          { title: 'Total de cuentas pendientes', icon: 'mdi-file-document-alert', color: 'orange', value: 2 },
          { title: 'Total saldo pendiente', icon: 'mdi-cash-clock', color: 'blue', value: 3 },
        ]
      },

      visualizarCuentas: {
        idCxc: 0,
      },

      snackbar: useSnackbar(),
      loading: useLoading()
    }
  },

  methods: {
    setStyle({ index }) {
      return {
        class:
          index % 2 === 0
            ? 'bg-white'
            : 'bg-indigo-lighten-5'
      }
    },

    async loadTblCxc(){
      this.loading.load(true)
      try{
        const cxc = await httpGet('api/cuentas-cobrar')
        this.tbl.items = cxc

        this.loading.load(false)
      } catch (e) {
        this.handleException(e)
      }
    },

    //FORMATERS
    formatedDate(dateString) {
      const value = formatters.formatDate(dateString)
      return value
    },

    formatedCurrency(key) {
      const value = formatters.formatCurrency(key)
      return value
    },

    //HANDLERS
    handleException(ex) {
      this.loading.load(false)
      if (ex.status == 401) {
        //void
      } else if (ex.status == 403) {
        this.notify.notify(
            'error',
            'No tiene los permisos necesarios.',
        )
      } else {
        ex.data ?
            this.notify.notify(
                'error',
                ex.data.msg,
            ) :
            console.log(ex)
      }
    },

    //DISPLAY
    //DISPLAY
    openVisualizarCuentasDisplay(item){
      this.visualizarCuentas = item
      this.display.visualizarCuentas = true
    },

    async closeVisualizarCuentasDisplay(){
      await this.loadTblCxc()
      this.display.visualizarCuentas = false
    },
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.loadTblCxc()
    })
  },

  mounted() {
    this.loadTblCxc()
  },
}
</script>

<style scoped>
.font {
  font-size: 12px !important;
  font-weight: 500;
}
</style>