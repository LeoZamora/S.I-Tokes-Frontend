<template>
  <div>
    <!--WIN1: PRINCIPAL-->
    <v-card v-if="!display.visualizarCuentas">
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
          <v-divider thickness="2" />
          <span
            class="mx-6 text-grey font-weight-bold"
            >Datos Generales</span
          >
        <v-divider thickness="2" />
      </v-card-subtitle>
      <v-row dense class="pa-2">
        <v-col cols="12" sm="8" md="8">
          <div v-for="(param, index) in tbl.params" :key="index" 
            class="d-flex justify-start align-start">
            <div class="mr-4">
              <v-icon :color="param.color" class="mx-2">{{ param.icon }}</v-icon>
              <span>
                {{ param.title }}:
              </span>
            </div>
            <strong v-if="param.value === 1">
              {{ totalCuentasPagadas }}
            </strong>
            <strong v-else-if="param.value === 2">
              {{ totalCuentasPendientes }}
            </strong>
            <strong v-else-if="param.value === 3">
              {{ formatedCurrency(totalFacturado) }}
            </strong>
          </div>
          <!-- <v-card style="border: 1px #e0e0e0 solid">
            <v-card-text class="d-flex flex-column align-center">
              <v-icon color="primary" size="50">mdi-file-document-check</v-icon>
              <div style="font-weight: bold">Total de cuentas pagadas</div>
              <div style="font-weight: bold">{{ totalCuentasPagadas }}</div>
            </v-card-text>
          </v-card> -->
        </v-col>
        <!-- <v-col cols="2">
          <v-card style="border: 1px #e0e0e0 solid">
            <v-card-text class="d-flex flex-column align-center">
              <v-icon color="primary" size="50">mdi-file-document-alert</v-icon>
              <div style="font-weight: bold">Total de cuentas pendientes</div>
              <div style="font-weight: bold">{{ totalCuentasPendientes }}</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="2">
          <v-card style="border: 1px #e0e0e0 solid">
            <v-card-text class="d-flex flex-column align-center">
              <v-icon color="primary" size="50">mdi-cash-clock</v-icon>
              <div style="font-weight: bold">Total saldo pendiente</div>
              <div style="font-weight: bold">{{ formatedCurrency(totalFacturado) }}</div>
            </v-card-text>
          </v-card>
        </v-col> -->
        <v-col cols="12" sm="4" md="4">
          <v-text-field
            v-model="tbl.search"
            label="Búsqueda:"
            prepend-inner-icon="mdi-magnify"
            hint="Buscar texto en la tabla."            
            persistent-hint
            variant="outlined"
            density="compact"
          >
          </v-text-field>
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

      <v-card-text>
        <v-data-table
            :headers="tbl.headers"
            :items="tbl.items"
            :search="tbl.search"
            class="border rounded font"
        >

          <template v-slot:item.opc="{ item }">
            <div>
              <v-tooltip text="Visualizar Cuentas" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                      @click="openVisualizarCuentasDisplay(item)"
                      v-bind="props" icon size="x-small" class="mx-1" variant="tonal">
                    <v-icon color="indigo-darken-4">
                      mdi-eye
                    </v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </template>
          <template v-slot:item.saldoPendienteTotal="{ item }">
            <div>{{ formatedCurrency(item.saldoPendienteTotal) }}</div>
          </template>
          <template v-slot:item.fechaRegistro="{ item }">
            <div>{{ formatedDate(item.fechaRegistro) }}</div>
          </template>
          <!-- <template v-slot:item="{ item }">
            <tr>
              <td class="text-center" style="border: 1px solid #e0e0e0">
                <div class="d-flex justify-center">
                </div>
              </td>
              <td
                  v-for="header in tbl.headers.filter(c => !c.opciones)"
                  :key="header.key"
                  :class="[
                    header.align === 'center' && 'text-center',
                    header.align === 'end' && 'text-right',
                    header.align === 'start' && 'text-left'
                  ]"   
              >
                <span v-if="header.format === 'currency'">
                  {{ formatedCurrency(item[header.key]) }}
                </span>
                <span v-else-if="header.format === 'date'">
                  {{ formatedDate(item[header.key]) }}
                </span>
                <span v-else>
                  {{ `${header.format}${item[header.key]}` }}
                </span>
              </td>
            </tr>
          </template> -->
        </v-data-table>
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
import VisualizarCuentas from "@/views/general/por-cobrar/cuentas-por-cobrar/components/visualizar-cuentas.vue";

export default {
  name: 'cuentas-por-cobrar',
  components: {VisualizarCuentas},

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
        visualizarCuentas: false,
      },

      tbl: {
        search: '',
        items: [],
        headers: [
          {
            title: '',
            key: 'opc',
            align: 'center',
            opciones: true,
            sortable: false,
            width: 1,
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
            width: 1,
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
            width: 1,
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
            width: 1,
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
            width: 1,
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
            width: 1,
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
            width: 1,
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
            width: 1,
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