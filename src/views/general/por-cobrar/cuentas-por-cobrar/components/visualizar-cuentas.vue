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
              {{ cxc.cliente }}
            </strong>
            <strong v-else-if="param.value === 2">
              {{ cxc.nCreditosPagados }}
            </strong>
            <strong v-else-if="param.value === 3">
              {{ cxc.nCreditosPendientes }}
            </strong>
          </div>
        </v-col>
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
            class="border rounded font"
        >
        <template v-slot:item.opc="{ item }">
            <div class="d-flex justify-center">
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
            </div>
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
      tbl: {
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
            title: 'N° Factura',
            key: 'noVenta',
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
            title: 'Tipo Venta',
            key: 'tipoVenta',
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
            title: 'Productos Facturados',
            key: 'productosVendidos',
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
            title: 'Total Facturado',
            key: 'totalVenta',
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
            title: 'Monto Crédito',
            key: 'montoCredito',
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
            title: 'Saldo',
            key: 'saldo',
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
          {
            title: 'Cuenta Saldada',
            key: 'cancelado',
            format: '',
            align: 'center',
            width: 1,
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
          { title: 'Cliente', icon: 'mdi-account', color: 'grey', value: 1 },
          { title: 'N° Créditos Pagados', icon: 'mdi-cash-check', color: 'grey', value: 2 },
          { title: 'N° Créditos Pendientes', icon: 'mdi-cash-clock', color: 'grey', value: 3 },
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