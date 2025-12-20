<template>
  <div>
    <!--WIN1: PRINCIPAL-->
    <v-card v-if="!display.nuevoCierre" elevation="0" class="border-t border-b">
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div class="text-h6 font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="primary">mdi-finance</v-icon>
            Cierres de Mes
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn v-if="hasAccessToFunct('132')" class="bg-primary rounded" @click="openRegistrarDisplay">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="left">Nuevo cierre</v-tooltip>
        </v-btn>
      </template>

      <v-divider />

      <v-card-text class="pa-0">
        <v-data-table
            :headers="tbl.headers"
            :items="tbl.items"
            class="font"
        >
          <!-- <template v-slot:item="{ item }">
            <tr>
              <td class="text-center" style="border: 1px solid #e0e0e0">
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
          </template> -->

          <template v-slot:item="{ item, index, columns }">
              <tr :class="setStyle(index).class">
                <td v-for="col in columns" :key="col.key">
                  <div class="d-flex justify-center align-center">
                    {{ formatCell(item, col.key) }}
                  </div>
                </td>
              </tr>
            </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!--WIN2: NUEVO CIERRE-->
    <nuevo-cierre v-if="display.nuevoCierre" ref="nuevoCierre" @close="closeRegistrarDisplay" />
  </div>
</template>

<script>
import {useLoading} from "@/composables/use-loading.js";
import {useSnackbar} from "@/composables/use-snackbar.js";
import nuevoCierre from "@/views/empresa/cierres/components/nuevo-cierre.vue";
import {httpGet} from "@/scripts/api.js";
import {formatters} from "@/helpers/formatters.js";
import { hasAccessToFunct } from '@/scripts/Seguridad.js'
export default {
  components: {
    nuevoCierre
  },

  data(){
    return {
      display: {
        nuevoCierre: false,
      },

      tbl: {
        headers: [
          // {
          //   title: 'Opciones',
          //   key: 'opc',
          //   align: 'center',
          //   opciones: true,
          //   sortable: false,
          //   width: 1,
          //   headerProps: {
          //     class: 'pa-1',
          //   },
          //   cellProps: {
          //     class: 'pa-1',
          //   }
          // },
          {
            title: 'Fecha Desde',
            key: 'desde',
            align: 'center',
            width: 1,
            format: 'date',
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Fecha Hasta',
            key: 'hasta',
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
            title: 'Descripción',
            key: 'descripcion',
            format: '',
            align: 'center',
            width: 200,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Ventas',
            key: 'ventas',
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
            title: 'Ingresos Adicionales',
            key: 'ingresosAdicionales',
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
            title: 'Total Ingresos',
            key: 'totalIngresos',
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
            title: 'Costos de Ventas',
            key: 'costoVentas',
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
            title: 'Gastos Adicionales',
            key: 'gastosAdicionales',
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
            title: 'Total Egresos',
            key: 'totalEgresos',
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
            title: 'Utilidad',
            key: 'utilidad',
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
            title: 'Proporción de Utilidad',
            key: 'proporcionUtilidad',
            format: '%',
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
        items: [],
      },

      notify: useSnackbar(),
      loading: useLoading(),
    }
  },

  methods: {
    hasAccessToFunct,

    formatCell(item, key) {
      const value = item[key]

      // Si la columna es numérica de dinero
      const moneyKeys = [
        'ventas',
        'ingresosAdicionales',
        'totalIngresos',
        'costoVentas',
        'gastosAdicionales',
        'totalEgresos',
        'utilidad',
      ]

      if (moneyKeys.includes(key))
        return this.formatedCurrency(value)

      // Si la columna es fecha
      const dateKeys = [
        'desde',
        'hasta',
      ]
      if (dateKeys.includes(key))
        return this.formatedDate(value, key === 'fechaRegistro')

      // Si no aplica formato especial
      return value
    },

    setStyle(index) {
      return {
        class:
          index % 2 === 0
            ? 'bg-white'
            : 'bg-indigo-lighten-5'
      }
    },

    async loadTblCierres(){
      this.loading.load(true)
      try{
        const cierres = await httpGet('api/cierres')
        this.tbl.items = cierres

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
    openRegistrarDisplay(){
      this.display.nuevoCierre = true
    },

    async closeRegistrarDisplay(){
      await this.loadTblCierres()
      this.display.nuevoCierre = false
    },
  },

  mounted() {
    this.loadTblCierres()
  },
}
</script>

<style scoped>
.font {
  font-size: 12px !important;
  font-weight: 500;
}
</style>