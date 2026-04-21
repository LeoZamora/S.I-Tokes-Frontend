<template>
  <div>
    <!--WIN1: PRINCIPAL-->
    <v-card
      v-if="!display.nuevoCierre"
      elevation="0"
      class="border-t border-b"
    >
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div
            class="text-h6 font-weight-bold d-flex align-center"
          >
            <v-icon class="me-2" color="primary"
              >mdi-finance</v-icon
            >
            Detalle de Ventas
          </div>
        </div>
      </template>
      <!--<template v-slot:append>
        <v-btn
          v-if="hasAccessToFunct('132')"
          class="bg-primary rounded"
          @click="openRegistrarDisplay"
        >
          <v-icon>mdi-plus</v-icon>
          <v-tooltip
            activator="parent"
            location="left"
            >Nuevo cierre</v-tooltip
          >
        </v-btn>
      </template>-->

      <v-form ref="form1">
        <v-row dense>
          <v-col>
            <v-text-field
              v-model="fechaDesde"
              variant="outlined"
              label="Fecha desde:"
              density="compact"
              type="date"
              :rules="[
                (v) => !!v || 'Requerido.'
              ]"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="fechaHasta"
              variant="outlined"
              label="Fecha hasta:"
              density="compact"
              type="date"
              :rules="[
                (v) => !!v || 'Requerido.'
              ]"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>

      <div>
        <div>
          Cantidad Ventas: {{ cantidadVentas }}
        </div>
        <div>
          Total Vendido:
          {{ formatedCurrency(totalVendido) }}
        </div>
        <div>
          Total Costo Ventas:
          {{ formatedCurrency(totalCosto) }}
        </div>
        <div>
          Utilidad Bruta:
          {{ formatedCurrency(utilidadBruta) }}
        </div>
      </div>

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

          <template v-slot:header.producto>
            <div>Producto</div>
            <v-autocomplete
              v-model="idProducto"
              variant="outlined"
              density="compact"
              :items="cmb.productos"
              hide-details
              clearable
            >
            </v-autocomplete>
          </template>

          <template
            v-slot:item="{ item, index, columns }"
          >
            <tr :class="setStyle(index).class">
              <td
                v-for="col in columns"
                :key="col.key"
              >
                <div
                  class="d-flex justify-center align-center"
                >
                  {{ formatCell(item, col.key) }}
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!--WIN2: NUEVO CIERRE-->
    <nuevo-cierre
      v-if="display.nuevoCierre"
      ref="nuevoCierre"
      @close="closeRegistrarDisplay"
    />
  </div>
</template>

<script>
import { useLoading } from '@/composables/use-loading.js'
import { useSnackbar } from '@/composables/use-snackbar.js'
import nuevoCierre from '@/views/empresa/cierres/components/nuevo-cierre.vue'
import { httpGet } from '@/scripts/api.js'
import { formatters } from '@/helpers/formatters.js'
import { hasAccessToFunct } from '@/scripts/Seguridad.js'
import { getIntervaloMesActual } from '@/scripts/utils.js'
export default {
  components: {
    nuevoCierre
  },

  data() {
    return {
      display: {
        nuevoCierre: false
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
            title: 'No. Venta',
            key: 'noVenta',
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
            title: 'Tipo de Venta',
            key: 'tipoVenta',
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
            title: 'Cliente',
            key: 'cliente',
            align: 'center',
            width: 200, // Más ancho para nombres largos
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },
          {
            title: 'Fecha',
            key: 'fechaVenta',
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
            title: 'Condición',
            key: 'condicionVenta',
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
            title: 'Producto',
            key: 'producto',
            align: 'center',
            width: 200, // Más ancho porque incluye el código concatenado
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          },
          {
            title: 'Cantidad',
            key: 'cantidad',
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
            title: 'Precio Unit.',
            key: 'precioUnitario',
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
            title: 'Total Vendido',
            key: 'totalVendido',
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
            title: 'Costo Unit.',
            key: 'costoUnitario',
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
            title: 'Total Costo',
            key: 'totalCosto',
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
            title: 'Utilidad',
            key: 'utilidad',
            format: 'currency',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1'
            },
            cellProps: {
              class: 'pa-1'
            }
          }
        ],
        items: []
      },

      fechaDesde:
        getIntervaloMesActual().fechaDesde,
      fechaHasta:
        getIntervaloMesActual().fechaHasta,
      idProducto: 0,

      totalVendido: 0,
      totalCosto: 0,
      utilidadBruta: 0,
      cantidadVentas: 0,

      cmb: {
        productos: []
      },

      notify: useSnackbar(),
      loading: useLoading()
    }
  },

  methods: {
    hasAccessToFunct,

    formatCell(item, key) {
      const value = item[key]

      // Si la columna es numérica de dinero
      const moneyKeys = [
        'precioUnitario',
        'totalVendido',
        'costoUnitario',
        'totalCosto',
        'utilidad'
      ]

      if (moneyKeys.includes(key))
        return this.formatedCurrency(value)

      // Si la columna es fecha
      const dateKeys = ['fechaVenta', 'hasta']
      if (dateKeys.includes(key))
        return this.formatedDate(
          value,
          key === 'fechaRegistro'
        )

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

    async loadTblCierres() {
      this.loading.load(true)
      try {
        const cierres = await httpGet(
          `api/cierres/detalle-ventas?desde=${this.fechaDesde}&hasta=${this.fechaHasta}`
        )
        this.tbl.items = cierres.items
        this.cantidadVentas =
          cierres.cantidadVentas
        this.totalVendido = cierres.totalVendido
        this.totalCosto = cierres.totalCosto
        this.utilidadBruta = cierres.utilidadBruta

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

    //DISPLAY
    openRegistrarDisplay() {
      this.display.nuevoCierre = true
    },

    async closeRegistrarDisplay() {
      await this.loadTblCierres()
      this.display.nuevoCierre = false
    }
  },

  computed: {
    rangosResumen() {
      return {
        desde: this.fechaDesde,
        hasta: this.fechaHasta
      }
    }
  },

  watch: {
    rangosResumen: {
      handler() {
        this.loadTblCierres()
      },
      deep: true
    }
  },

  mounted() {
    this.loadTblCierres()
  },

  activated() {
    this.loadTblCierres()
  }
}
</script>

<style scoped>
.font {
  font-size: 12px !important;
  font-weight: 500;
}
</style>