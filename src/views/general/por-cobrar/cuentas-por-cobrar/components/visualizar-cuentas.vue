<template>
  <div>
    <!--WIN1: PRINCIPAL-->
    <v-card class="border">
      <template v-slot:prepend>
        <v-btn
            @click="close"
            color="grey"
            variant="tonal"
            class="mr-2"
            size="small"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
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
        <v-col cols="12" md="8" sm="8">
          <div class="d-flex flex-wrap align-center ga-3">
            <v-card v-for="(param, index) in tbl.params" :key="index" 
              variant="flat" class="pa-2" :color="`${param.color}-lighten-5`">
              <div class="d-flex align-center">
                <v-avatar size="36" :color="`${param.color}-lighten-4`" class="mr-2">
                  <v-icon :color="param.color" size="small">
                    {{ param.icon }}
                  </v-icon>
                </v-avatar>
                <div class="mr-4">
                  <span>
                    {{ param.title }}:
                  </span>
                </div>
                <div style="font-size: 10px !important;" class="text-body-3 font-weight-bold">
                  <strong v-if="param.value === 1">
                    {{ cxc.cliente }}
                  </strong>
                  <strong v-else-if="param.value === 2">
                    {{ cxc.nCreditosPagados }}
                  </strong>
                  <strong v-else-if="param.value === 3">
                    {{ cxc.nCreditosPendientes }}
                  </strong>
                </div>
              </div>
            </v-card>
          </div>
        </v-col>

        <!-- BUSCADOR -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            label="Buscar"
            prepend-inner-icon="mdi-magnify"
            hide-details
            placeholder="Filtrar datos por cliente"
            persistent-placeholder
            variant="outlined"
            density="compact"
            clearable
          />
        </v-col>
        <!-- <v-col cols="12" sm="8" md="8">
          <div v-for="(param, index) in tbl.params" :key="index" 
            class="d-flex justify-start align-start">
            <div class="mr-4">
              <v-icon :color="param.color" class="mx-2">
                {{ param.icon }}
              </v-icon>
              <span>
                {{ param.title }}:
              </span>
            </div>
            <strong v-if="param.value === 1">
              {{ cxc.cliente }}
            </strong>
            <strong v-else-if="param.value === 2">
              {{ cxc.nCreditosPagados }}
            </strong>
            <strong v-else-if="param.value === 3">
              {{ cxc.nCreditosPendientes }}
            </strong>
          </div>
        </v-col> -->
      </v-row>

      <v-card-text>
        <v-card-subtitle
          class="d-flex align-center text-center"
        >
          <v-divider thickness="2" />
          <span
            class="mx-6 text-grey font-weight-bold"
            >Tabla de Créditos</span
          >
          <v-divider thickness="2" />
        </v-card-subtitle>
        <v-data-table
            :headers="tbl.headers"
            :items="tbl.items"
            :search="search"
            :headerProps="{class: 'font-weight-bold' }"
            :row-props="setStyle"
            class="border rounded font"
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
                <v-list-item @click="openVisualizarAbonosDisplay(item)" 
                  prepend-icon="mdi-eye">
                  <v-list-item-title>
                    Visualizar Abonos
                  </v-list-item-title>
                </v-list-item>

                <v-list-item v-if="hasAccessToFunct('85')" v-show="!item.cancelado"
                  @click="openAbonarDisplay(item)"
                  prepend-icon="mdi-cash-plus">
                  <v-list-item-title>
                    Nuevo Abonar
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

              <!-- <div class="d-flex justify-center">
                <v-tooltip text="Visualizar Abonos" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      variant="text"
                      @click="openVisualizarAbonosDisplay(item)"
                      v-bind="props" icon size="x-small" class="mx-1">
                      <v-icon color="indigo-darken-4" size="large">
                        mdi-table-eye
                      </v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip text="Abonar" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-if="hasAccessToFunct('85')"
                      variant="text"
                      v-show="!item.cancelado"
                      @click="openAbonarDisplay(item)"
                      v-bind="props" icon size="x-small" class="mx-1">
                      <v-icon color="green" size="large">
                        mdi-cash-plus
                      </v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div> -->
          </template>

          <template v-slot:item.totalVenta="{ item }">
            <div>{{ formatedCurrency(item.totalVenta) }}</div>
          </template>
          <template v-slot:item.montoCredito="{ item }">
            <div>{{ formatedCurrency(item.montoCredito) }}</div>
          </template>
          <template v-slot:item.saldo="{ item }">
            <div>{{ formatedCurrency(item.saldo) }}</div>
          </template>
          <template v-slot:item.fechaRegistro="{ item }">
            <div>{{ formatedDate(item.fechaRegistro) }}</div>
          </template>
          <template v-slot:item.cancelado="{ item }">
            <div>
              <v-chip :color="item.cancelado ? 'green-darken-4' : 'orange-darken-4'">
                {{ item.cancelado ? 'Saldada' : 'Pendiente' }}
              </v-chip>
            </div>
          </template>

          <!-- <template v-slot:item="{ item }">
            <tr>
              <td class="text-center" style="border: 1px solid #e0e0e0">
                <div class="d-flex justify-center">
                  <v-tooltip text="Visualizar Abonos" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                          @click="openVisualizarAbonosDisplay(item)"
                          v-bind="props" icon size="x-small" class="mx-1">
                        <v-icon color="indigo-darken-4">mdi-table-eye</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Abonar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                          v-show="!item.cancelado"
                          @click="openAbonarDisplay(item)"
                          v-bind="props" icon size="x-small" class="mx-1">
                        <v-icon color="green-darken-4">mdi-cash-plus</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
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
              <td class="text-center" style="border: 1px solid #e0e0e0">
                <div class="d-flex justify-center">
                  <v-chip
                      :color="item.cancelado ? 'green-darken-4' : 'orange-darken-4'"
                  >
                    {{ item.cancelado ? 'Saldada' : 'Pendiente' }}
                  </v-chip>
                </div>
              </td>
            </tr>
          </template> -->
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="display.abonarCuenta" width="380">
      <abonar-cuenta @close="closeAbonarDisplay" :credito="abonarCuenta"></abonar-cuenta>
    </v-dialog>

    <v-dialog v-model="display.visualizarAbonos" width="700">
      <visualizar-abonos @close="closeVisualizarAbonosDisplay" :credito="visualizarAbonos"></visualizar-abonos>
    </v-dialog>
  </div>
</template>

<script>
import {httpGet} from "@/scripts/api.js";
import {useLoading} from "@/composables/use-loading.js";
import {useSnackbar} from "@/composables/use-snackbar.js";
import {formatters} from "@/helpers/formatters.js";
import AbonarCuenta from "@/views/general/por-cobrar/cuentas-por-cobrar/components/abonar-cuenta.vue";
import VisualizarAbonos from "@/views/general/por-cobrar/cuentas-por-cobrar/components/visualizar-abonos.vue";
import { hasAccessToFunct } from '@/scripts/Seguridad.js'
export default {
  name: 'visualizar-cuentas',
  
  components: {VisualizarAbonos, AbonarCuenta},

  props: {
    cxc: {
      type: Object,
      required: true
    }
  },

  data(){
    return {
      search: null,
      tbl: {
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
            title: 'N° Factura',
            key: 'noVenta',
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
            title: 'Tipo Venta',
            key: 'tipoVenta',
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
            title: 'Productos Facturados',
            key: 'productosVendidos',
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
            title: 'Total Facturado',
            key: 'totalVenta',
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
            title: 'Monto Crédito',
            key: 'montoCredito',
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
            title: 'Saldo',
            key: 'saldo',
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
          {
            title: 'Cuenta Saldada',
            key: 'cancelado',
            format: '',
            align: 'center',
            opciones: true,
            headerProps: {
              class: 'pa-0',
            },
            cellProps: {
              class: 'pa-0',
            }
          },
        ],

        params: [
          { title: 'Cliente', icon: 'mdi-account', color: 'indigo', value: 1 },
          { title: 'N° Créditos Pagados', icon: 'mdi-cash-check', color: 'green', value: 2 },
          { title: 'N° Créditos Pendientes', icon: 'mdi-cash-clock', color: 'red', value: 3 },
        ]
      },

      display: {
        abonarCuenta: false,
        visualizarAbonos: false,
      },

      abonarCuenta: {
        idCredito: 0,
      },

      visualizarAbonos: {},

      snackbar: useSnackbar(),
      loading: useLoading()
    }
  },

  methods: {
    hasAccessToFunct,

    setStyle({ index }) {
      return {
        class:
          index % 2 === 0
            ? 'bg-white'
            : 'bg-indigo-lighten-5'
      }
    },

    async loadTblCuentas(){
      this.loading.load(true)
      try{
        const cxc = await httpGet(`api/cuentas-cobrar/${this.cxc.idCxc}/creditos`)
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

    openVisualizarAbonosDisplay(item){
      this.display.visualizarAbonos = true
      this.visualizarAbonos = item
    },

    closeVisualizarAbonosDisplay(){
      this.display.visualizarAbonos = false
    },

    openAbonarDisplay(item){
      this.display.abonarCuenta = true
      this.abonarCuenta = item
    },

    async closeAbonarDisplay(){
      await this.loadTblCuentas()
      this.display.abonarCuenta = false
    },

    close(){
      this.$emit('close')
    }
  },

  mounted() {
    this.loadTblCuentas()
  },
}
</script>

<style scoped>
.font {
  font-size: 12px !important;
  font-weight: 500;
}
</style>