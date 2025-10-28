<template>
  <div>
    <v-data-table
      :headers="tbl.headers"
      :items="tbl.items"
      :search="search"
    >
      <template v-slot:top>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                v-model="search"
                variant="outlined"
                label="Buscar"
                density="comfortable"
                placeholder="Buscar Créditos"
                persistent-placeholder
                hide-details
              />
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.opc="{ item }">
        <div class="d-flex justify-center">
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
        </div>
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
      <template v-slot:item.cancelado="{ item }">
        <div>
          <v-chip
            :color="
              item.cancelado
                ? 'green-darken-4'
                : 'orange-darken-4'
            "
          >
            {{
              item.cancelado
                ? 'Saldada'
                : 'Pendiente'
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
import { httpGet } from '@/scripts/api.js'
import { useLoading } from '@/composables/use-loading.js'
import { useSnackbar } from '@/composables/use-snackbar.js'
import { formatters } from '@/helpers/formatters.js'
import AbonarCuenta from '@/views/general/por-cobrar/cuentas-por-cobrar/components/abonar-cuenta.vue'
import VisualizarAbonos from '@/views/general/por-cobrar/cuentas-por-cobrar/components/visualizar-abonos.vue'
import { hasAccessToFunct } from '@/scripts/Seguridad.js'
export default {
  name: 'visualizar-cuentas',
  components: { VisualizarAbonos, AbonarCuenta },

  data() {
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
            width: 1,
            headerProps: {
              class: 'pa-0'
            },
            cellProps: {
              class: 'pa-0'
            }
          },
          {
            title: 'Cliente',
            key: 'cliente',
            format: '',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },
          {
            title: 'N° Factura',
            key: 'noVenta',
            format: '',
            align: 'center',
            width: 1,
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
            width: 1,
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },
          {
            title: 'Productos Facturados',
            key: 'productosVendidos',
            format: '',
            align: 'center',
            width: 1,
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
            width: 1,
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
            width: 1,
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
            width: 1,
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
            width: 1,
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
            width: 1,
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
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

  methods: {
    hasAccessToFunct,
    async loadTblCuentas() {
      this.loading.load(true)
      try {
        const cxc = await httpGet(
          `api/cuentas-cobrar/creditos`
        )
        this.tbl.items = cxc

        this.loading.load(false)
      } catch (e) {
        this.handleException(e)
      }
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
      await this.loadTblCuentas()
      this.display.abonarCuenta = false
    },

    close() {
      this.$emit('close')
    }
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
