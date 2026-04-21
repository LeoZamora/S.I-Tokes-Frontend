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

      <v-container>
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
            Cantidad Ventas:
            <strong>
              {{ cantidadVentas }}
            </strong>
          </div>
          <div>
            Total Vendido:
            <strong>
              {{ formatedCurrency(totalVendido) }}
            </strong>
          </div>
          <div>
            Total Costo Ventas:
            <strong>
              {{ formatedCurrency(totalCosto) }}
            </strong>
          </div>
          <div>
            Utilidad Bruta:
            <strong>
              {{ formatedCurrency(utilidadBruta) }}
            </strong>
          </div>
        </div>
      </v-container>

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

          <template v-slot:top>
            <div class="d-flex justify-end align-center py-2 px-4">
              <v-btn color="green" variant="outlined"
                append-icon="mdi-download-multiple" @click="exportToExcel(tbl.headers, tbl.items)">
                Excel's
              </v-btn>
            </div>
          </template>

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
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import RequestHttp from '@/services/requestHttp'

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
            width: 200,
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
            width: 200,
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
      idProducto: null,

      totalVendido: 0,
      totalCosto: 0,
      utilidadBruta: 0,
      cantidadVentas: 0,

      requestHttp: new RequestHttp(),

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

    exportToExcel(headers, items) {
      if (!items || items.length === 0) return

      const headersMapeed = [...headers.map(item => item.title)]
      const datos = items.map(item => {
        return {
          ...item,
          fechaVenta: this.formatedDate(item.fechaVenta) || '- - -',
        }
      })

      const rows = datos.map(item => [...headers.map(h => item[h.key])])

      const exportData = []
      exportData.push([])
      exportData.push(headersMapeed)
      exportData.push(...rows)

      const workBook = new ExcelJS.Workbook()
      const workSheet = workBook.addWorksheet(`Detalles de venta`)
      workSheet.addRows(exportData)

      workBook.xlsx.writeBuffer().then((buffer) => {
          const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" })
          saveAs(data, `Detalles de venta.xlsx`)
      })
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
        const url = this.idProducto === null ? 
          `api/cierres/detalle-ventas?desde=${this.fechaDesde}&hasta=${this.fechaHasta}`
          : `api/cierres/detalle-ventas?desde=${this.fechaDesde}&hasta=${this.fechaHasta}&idProducto=${this.idProducto}`
        const cierres = await httpGet(url)
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

    async getProductos() {
      this.cmb.productos = []
      this.loading.load(true)
      const result = await this.requestHttp.getProductos(null)
      this.loading.load(false)

      if (result.code === 200) {
          result.data.map(item => {
              this.cmb.productos.push({title: item.nombre, value: item.idProducto})
          })
      }
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
        hasta: this.fechaHasta,
        idProducto: this.idProducto
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
    this.getProductos()
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