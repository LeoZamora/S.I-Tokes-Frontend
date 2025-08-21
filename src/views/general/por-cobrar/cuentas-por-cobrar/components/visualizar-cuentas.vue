<template>
  <div>
    <!--WIN1: PRINCIPAL-->
    <v-card>
      <template v-slot:prepend>
        <v-btn
            @click="close"
            color="secondary"
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

      <v-card-text>
        <div style="font-size: 16px; font-weight: bold">
          {{ `Cliente: ${cxc.cliente}` }}
        </div>
        <div style="font-size: 16px; font-weight: bold">
          {{ `N° Créditos Pagados: ${cxc.nCreditosPagados}` }}
        </div>
        <div style="font-size: 16px; font-weight: bold">
          {{ `N° Créditos Pendientes: ${cxc.nCreditosPendientes}` }}
        </div>
        <v-data-table
            :headers="tbl.headers"
            :items="tbl.items"
        >
          <template v-slot:top>
            <h3 class="text-center">Tabla de Créditos</h3>
          </template>
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center" style="border: 1px solid #e0e0e0">
                <div class="d-flex justify-center">
                  <v-tooltip text="Visualizar Abonos" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                          @click="openVisualizarAbonosDisplay"
                          v-bind="props" icon size="x-small" color="grey-lighten-4" class="mx-1">
                        <v-icon color="indigo-darken-4">mdi-table-eye</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Abonar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                          @click="openAbonarDisplay"
                          v-bind="props" icon size="x-small" color="grey-lighten-4" class="mx-1">
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
                  style="border: 1px solid #e0e0e0"
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
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {httpGet} from "@/scripts/api.js";
import {useLoading} from "@/composables/use-loading.js";
import {useSnackbar} from "@/composables/use-snackbar.js";
import {formatters} from "@/helpers/formatters.js";
export default {
  name: 'visualizar-cuentas',

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
            title: 'Opciones',
            key: 'opc',
            align: 'center',
            opciones: true,
            sortable: false,
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
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
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
        ],
      },

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

    openVisualizarAbonosDisplay(){
      this.snackbar.notify('warn', 'Visualizar abonos estará disponible próximamente.')
    },

    openAbonarDisplay(){
      this.snackbar.notify('warn', 'Abonar estará disponible próximamente.')
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

</style>