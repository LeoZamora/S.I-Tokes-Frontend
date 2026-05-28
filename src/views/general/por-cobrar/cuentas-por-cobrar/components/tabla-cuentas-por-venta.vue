<template>
  <div>
    <v-data-table
      :headers="tbl.headers"
      :items="tbl.items"
      :search="tbl.search"
      :headerProps="{class: 'font-weight-bold' }"
      :row-props="setStyle"      
    >
      <template v-slot:top>
        <v-row dense class="pa-2 align-center">
          <v-col cols="12" md="6" sm="6">
            <v-text-field
              v-model="tbl.search"
              variant="outlined"
              label="Buscar"
              color="indigo-darken-4"
              density="comfortable"
              placeholder="Buscar Créditos"
              persistent-placeholder
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6" sm="6" class="d-flex justify-end options">
            <div>
              <div style="font-size: 16px">
                Mostrar cuentas:
              </div>
              <div class="d-flex">
                <v-btn-toggle
                  v-model="search.estados"
                  color="primary"
                  class="ml-2"
                  rounded="xl"
                  variant="plain"
                  mandatory
                  multiple
                  border
                >
                  <v-btn :value="1" color="orange-darken-4">
                    Pendientes
                  </v-btn>
                  <v-btn :value="2" color="green-darken-4">
                    Saldadas
                  </v-btn>
                  <v-btn :value="3" color="red-darken-4">
                    Vencidas
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-divider />
      </template>
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
            <v-list-item @click="openVisualizarAbonosDisplay(item)"
              prepend-icon="mdi-table-eye">
              <v-list-item-title>
                Visualizar Abonos
              </v-list-item-title>
            </v-list-item>

            <v-list-item v-if="hasAccessToFunct('85')" v-show="!item.cancelado"
              @click="openAbonarDisplay(item)" prepend-icon="mdi-cash-plus">
              <v-list-item-title>
                Abonar
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- <div class="d-flex justify-center">
          <v-tooltip
            text="Visualizar Abonos"
            location="top"
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-btn
                variant="text"
                @click="
                  openVisualizarAbonosDisplay(
                    item
                  )
                "
                v-bind="props"
                icon
                size="x-small"
                class="mx-1"
              >
                <v-icon
                  color="indigo-darken-4"
                  size="large"
                >
                  mdi-table-eye
                </v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="Abonar" location="top">
            <template
              v-slot:activator="{ props }"
            >
              <v-btn
                v-if="hasAccessToFunct('85')"
                variant="text"
                v-show="!item.cancelado"
                @click="openAbonarDisplay(item)"
                v-bind="props"
                icon
                size="x-small"
                class="mx-1"
              >
                <v-icon
                  color="green"
                  size="large"
                >
                  mdi-cash-plus
                </v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div> -->
      </template>

      <template v-slot:item.totalVenta="{ item }">
        <div>
          {{ formatedCurrency(item.totalVenta) }}
        </div>
      </template>
      <template
        v-slot:item.montoCredito="{ item }"
      >
        <div>
          {{
            formatedCurrency(item.montoCredito)
          }}
        </div>
      </template>
      <template
        v-slot:item.totalAbonado="{ item }"
      >
        <div>
          {{
            `(${item.abonosRealizados}) ${formatedCurrency(item.totalAbonado)}`
          }}
        </div>
      </template>
      <template v-slot:item.saldo="{ item }">
        <div>
          {{ formatedCurrency(item.saldo) }}
        </div>
      </template>
      <template
        v-slot:item.fechaRegistro="{ item }"
      >
        <div>
          {{ formatedDate(item.fechaRegistro) }}
        </div>
      </template>
      <template v-slot:item.estado="{ item }">
        <div>
          <v-chip
            :color="
              item.cancelado
                ? 'green-darken-4'
                : (item.vencida ? 'red-darken-4' : 'orange-darken-4')
            "
          >
            {{
              item.cancelado
                ? 'Saldada'
                : (item.vencida ? 'Vencida' : 'Pendiente')
            }}
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

    <v-dialog
      v-model="display.abonarCuenta"
      width="380"
    >
      <abonar-cuenta
        @close="closeAbonarDisplay"
        :credito="abonarCuenta"
      ></abonar-cuenta>
    </v-dialog>

    <v-dialog
      v-model="display.visualizarAbonos"
      width="700"
    >
      <visualizar-abonos
        @close="closeVisualizarAbonosDisplay"
        :credito="visualizarAbonos"
      ></visualizar-abonos>
    </v-dialog>
  </div>
</template>

<script>
import {
  httpGet,
  httpPost
} from '@/scripts/api.js'
import { useLoading } from '@/composables/use-loading.js'
import { useSnackbar } from '@/composables/use-snackbar.js'
import { formatters } from '@/helpers/formatters.js'
import AbonarCuenta from '@/views/general/por-cobrar/cuentas-por-cobrar/components/abonar-cuenta.vue'
import VisualizarAbonos from '@/views/general/por-cobrar/cuentas-por-cobrar/components/visualizar-abonos.vue'
import { hasAccessToFunct } from '@/scripts/Seguridad.js'
import { onMounted, nextTick } from 'vue'
import introJs from 'intro.js'
import tourOptions from '@/helpers/utilFunctions'

export default {
  name: 'tabla-cuentas-por-venta',
  components: { VisualizarAbonos, AbonarCuenta },

  data() {
    return {
      search: {
        idCliente: 0,
        estados: [1, 3]
      },

      tbl: {
        search: '',
        headers: [
          {
            title: '',
            key: 'opc',
            align: 'center',
            opciones: true,
            sortable: false,
            headerProps: {
              class: 'pa-0'
            },
            cellProps: {
              class: 'pa-0'
            }
          },
          {
            title: 'N° Factura',
            key: 'noVenta',
            format: '',
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
            align: 'center',
            format: '',
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },
          {
            title: 'Ruta Cliente',
            key: 'rutaCliente',
            format: '',
            align: 'center',
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },
          {
            title: 'Cliente',
            key: 'cliente',
            format: '',
            align: 'center',
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },

          {
            title: 'Total Facturado',
            key: 'totalVenta',
            format: 'currency',
            align: 'center',
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },
          {
            title: 'Monto Crédito',
            key: 'montoCredito',
            format: 'currency',
            align: 'center',
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },
          {
            title: 'Total Abonado',
            key: 'totalAbonado',
            format: 'currency',
            align: 'center',
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },
          {
            title: 'Saldo',
            key: 'saldo',
            format: 'currency',
            align: 'center',
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },
          {
            title: 'Fecha Registro',
            key: 'fechaRegistro',
            format: 'date',
            align: 'center',
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },
          {
            title: 'Usuario Registro',
            key: 'usuarioRegistro',
            format: '',
            align: 'center',
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },
          {
            title: 'Días Vencido',
            key: 'diasVencido',
            format: '',
            align: 'center',
            opciones: true,
            headerProps: {
              class: 'pa-0'
            },
            cellProps: {
              class: 'pa-0'
            }
          },
          {
            title: 'Estado',
            key: 'estado',
            format: '',
            align: 'center',
            opciones: true,
            headerProps: {
              class: 'pa-0'
            },
            cellProps: {
              class: 'pa-0'
            }
          }
        ],

        params: [
          {
            title: 'Cliente',
            icon: 'mdi-account',
            color: 'grey',
            value: 1
          },
          {
            title: 'N° Créditos Pagados',
            icon: 'mdi-cash-check',
            color: 'grey',
            value: 2
          },
          {
            title: 'N° Créditos Pendientes',
            icon: 'mdi-cash-clock',
            color: 'grey',
            value: 3
          }
        ]
      },

      display: {
        abonarCuenta: false,
        visualizarAbonos: false
      },

      abonarCuenta: {
        idCredito: 0
      },

      visualizarAbonos: {},

      snackbar: useSnackbar(),
      loading: useLoading()
    }
  },

  setup() {
    onMounted(async () => {
      await nextTick()

      const introKey = 'tutorialTipoVenta'
      if (localStorage.getItem(introKey)) return

      const el = document.querySelector('.options')

      if (!el) return

      var steps = [{
          title: '',
          element: el,
          intro: 'Aquí podras seleccionar el tipo de ventas que deseas visualizar.'
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

  methods: {
    hasAccessToFunct,
    async loadTblCuentas() {
      this.loading.load(true)
      try {
        const cxc = await httpPost(
          `api/cuentas-cobrar/creditos`,
          this.search
        )
        this.tbl.items = cxc.data

        this.loading.load(false)
      } catch (e) {
        this.handleException(e)
      }
    },

    setStyle({ index }) {
      return {
        class:
          index % 2 === 0
            ? 'bg-white'
            : 'bg-indigo-lighten-5'
      }
    },

    getRowStyles(data){
      if (data.item.vencida) {
        return {
          style: 'background-color: #FFEBEE;',
        }
      }
      return {}
    },

    //FORMATERS
    formatedDate(dateString) {
      const value =
        formatters.formatDate(dateString)
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
          'No tiene los permisos necesarios.'
        )
      } else {
        ex.data
          ? this.notify.notify(
              'error',
              ex.data.msg
            )
          : console.log(ex)
      }
    },

    openVisualizarAbonosDisplay(item) {
      this.display.visualizarAbonos = true
      this.visualizarAbonos = item
    },

    closeVisualizarAbonosDisplay() {
      this.display.visualizarAbonos = false
    },

    openAbonarDisplay(item) {
      this.display.abonarCuenta = true
      this.abonarCuenta = item
    },

    async closeAbonarDisplay() {
      this.display.abonarCuenta = false
      await this.loadTblCuentas()
    },

    close() {
      this.$emit('close')
    }
  },

  watch: {
    search: {
      handler() {
        this.loadTblCuentas()
      },
      deep: true,
    },
  },

  mounted() {
    this.loadTblCuentas()
  }
}
</script>

<style scoped>
.font {
  font-size: 12px !important;
  font-weight: 500;
}
</style>
