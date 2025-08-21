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

      <v-card-text>
        <v-data-table
            :headers="tbl.headers"
            :items="tbl.items"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center" style="border: 1px solid #e0e0e0">
                <div class="d-flex justify-center">
                  <v-tooltip text="Visualizar Cuentas" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                          @click="openVisualizarCuentasDisplay(item)"
                          v-bind="props" icon size="x-small" color="grey-lighten-4" class="mx-1">
                        <v-icon color="indigo-darken-4">mdi-eye</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <!--<v-tooltip text="Abonar Cuentas" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" icon size="x-small" color="grey-lighten-4" class="mx-1">
                        <v-icon color="green-darken-4">mdi-cash</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>-->
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
            </tr>
          </template>
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

  data(){
    return {
      display: {
        visualizarCuentas: false,
      },

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

</style>