<template>
  <v-card class="border-t">
    <v-card-title class="font-weight-bold">
      <v-btn
          @click="close"
          color="secondary"
          variant="tonal"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div class="mr-auto ml-auto">
        Resumen de Movimientos
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div>
        <v-form ref="form1">
          <v-row dense>
            <v-col>
              <v-text-field
                  v-model="fechaDesde"
                  variant="outlined"
                  label="Fecha desde:"
                  density="compact"
                  type="date"
                  :rules="[v => !!v || 'Requerido.']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                  v-model="fechaHasta"
                  variant="outlined"
                  label="Fecha hasta:"
                  density="compact"
                  type="date"
                  :rules="[v => !!v || 'Requerido.']"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-row>
          <v-col>
            <v-progress-linear indeterminate :active="loadStates.resumen"></v-progress-linear>
            <v-row>
              <v-col cols="12" md="6" sm="6">
                <div style="font-size: 18px; font-weight: bold" class="mb-2">
                  Ingresos del Periodo
                </div>
                <div style="font-size: 16px">
                  <v-row v-for="(item, index) in resumen.slice(0, 3)" :key="index"
                         class="font-weight-bold"
                         dense
                         :style="{
                  'background-color': [2].includes(index) ? 'yellow' : 'white'
                }"
                  >
                    <v-col
                        cols="12" md="6" sm="6"
                        :style="{
                    'border': '1px solid #BDBDBD',
                    'border-bottom': [2].includes(index) ? '1px solid #BDBDBD' : 'none',
                    'border-right': 'none',
                    'background-color': [2].includes(index) ? 'yellow' : 'white'
                  }"
                    >
                      <span class="font-weight-bold">{{ item.concepto }}</span>
                    </v-col>
                    <v-col
                      cols="12" md="6" sm="6"
                        class="text-center"
                        :style="{
                    'border': '1px solid #BDBDBD',
                    'border-bottom': [2].includes(index) ? '1px solid #BDBDBD' : 'none',
                    'background-color': [2].includes(index) ? 'yellow' : 'white'
                  }">
                      <span>{{ formatedCurrency(item.valor) }}</span>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <div style="font-size: 18px; font-weight: bold" class="mb-2">
                  Egresos del Periodo
                </div>
                <div style="font-size: 16px">
                  <v-row v-for="(item, index) in resumen.slice(3)" :key="index"
                         class="font-weight-bold"
                         dense
                         :style="{
                  'background-color': [5].includes(index) ? 'yellow' : 'white'
                }"
                  >
                    <v-col
                        cols="12" md="6" sm="6"
                        style="border: 1px solid #BDBDBD; border-bottom: none"
                        :style="{
                    'border': '1px solid #BDBDBD',
                    'border-bottom': [2].includes(index) ? '1px solid #BDBDBD' : 'none',
                    'border-right': 'none',
                    'background-color': [2].includes(index) ? 'yellow' : 'white'
                  }"
                    >
                      <span class="font-weight-bold">{{ item.concepto }}</span>
                    </v-col>
                    <v-col
                        class="text-center"
                        :style="{
                    'border': '1px solid #BDBDBD',
                    'border-bottom': [2].includes(index) ? '1px solid #BDBDBD' : 'none',
                    'background-color': [2].includes(index) ? 'yellow' : 'white'
                  }"
                    >
                      <span>{{ formatedCurrency(item.valor) }}</span>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <div style="font-size: 18px; font-weight: bold" class="mb-2">
                  Utilidad del Periodo
                </div>
                <div style="font-size: 16px">
                  <v-row v-for="(item, index) in resumenUtilidad" :key="index"
                         class="font-weight-bold"
                         dense
                         :style="{
                  'background-color': [5].includes(index) ? 'yellow' : 'white'
                }"
                  >
                    <v-col
                        cols="12" md="6" sm="6"
                        style="border: 1px solid #BDBDBD; border-bottom: none"
                        :style="{
                    'border': '1px solid #BDBDBD',
                    'border-bottom': [2].includes(index) ? '1px solid #BDBDBD' : 'none',
                    'border-right': 'none',
                    'background-color': [2].includes(index) ? 'yellow' : 'white'
                  }"
                    >
                      <span class="font-weight-bold">{{ item.concepto }}</span>
                    </v-col>
                    <v-col
                        class="text-center"
                        :style="{
                    'border': '1px solid #BDBDBD',
                    'border-bottom': [2].includes(index) ? '1px solid #BDBDBD' : 'none',
                    'background-color': [2].includes(index) ? 'yellow' : 'white'
                  }"
                    >
                      <span>{{ formatedCurrency(item.valor) }}</span>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <!--<v-col cols="6" class="py-4">
                <div style="font-size: 18px; font-weight: bold" class="mb-2">
                  Valor del Inventario Actual
                </div>
                <div style="font-size: 16px">
                  <v-row v-for="(item, index) in resumenInventario" :key="index"
                         class="font-weight-bold"
                         dense
                         :style="{
                  'background-color': [resumenInventario.length-1].includes(index) ? 'yellow' : 'white'
                }"
                  >
                    <v-col
                        cols="7"
                        style="border: 1px solid #BDBDBD; border-bottom: none"
                        :style="{
                    'border': '1px solid #BDBDBD',
                    'border-bottom': [resumenInventario.length-1].includes(index) ? '1px solid #BDBDBD' : 'none',
                    'border-right': 'none',
                    'background-color': [resumenInventario.length-1].includes(index) ? 'yellow' : 'white'
                  }"
                    >
                      <span class="font-weight-bold">{{ item.concepto }}</span>
                    </v-col>
                    <v-col
                        class="text-center"
                        :style="{
                    'border': '1px solid #BDBDBD',
                    'border-bottom': [resumenInventario.length-1].includes(index) ? '1px solid #BDBDBD' : 'none',
                    'background-color': [resumenInventario.length-1].includes(index) ? 'yellow' : 'white'
                  }"
                    >
                      <span>{{ formatedCurrency(item.valor) }}</span>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="6" class="py-4">
                <div style="font-size: 18px; font-weight: bold" class="mb-2">
                  Proyección de Venta Actual
                </div>
                <div style="font-size: 16px">
                  <v-row v-for="(item, index) in resumenProyeccionInventario" :key="index"
                         class="font-weight-bold"
                         dense
                         :style="{
                  'background-color': [resumenProyeccionInventario.length-1].includes(index) ? 'yellow' : 'white'
                }"
                  >
                    <v-col
                        cols="7"
                        style="border: 1px solid #BDBDBD; border-bottom: none"
                        :style="{
                    'border': '1px solid #BDBDBD',
                    'border-bottom': [resumenProyeccionInventario.length-1].includes(index) ? '1px solid #BDBDBD' : 'none',
                    'border-right': 'none',
                    'background-color': [resumenProyeccionInventario.length-1].includes(index) ? 'yellow' : 'white'
                  }"
                    >
                      <span class="font-weight-bold">{{ item.concepto }}</span>
                    </v-col>
                    <v-col
                        class="text-center"
                        :style="{
                    'border': '1px solid #BDBDBD',
                    'border-bottom': [resumenProyeccionInventario.length-1].includes(index) ? '1px solid #BDBDBD' : 'none',
                    'background-color': [resumenProyeccionInventario.length-1].includes(index) ? 'yellow' : 'white'
                  }"
                    >
                      <span>{{ formatedCurrency(item.valor) }}</span>
                    </v-col>
                  </v-row>
                </div>
              </v-col>-->
            </v-row>
          </v-col>
          <v-col cols="12" md="6" sm="6" class="border rounded">
            <v-chart :option="pieChart" autoresize style="height: 300px;"/>
          </v-col>
          <v-col cols="12">
            <v-textarea
                v-model="descripcion"
                label="Descipción para el cierre:"
                placeholder="Ingrese una descripción del cierre"
                persistent-placeholder
                variant="outlined"
                density="comfortable"
                rows="2"
                auto-grow
            ></v-textarea>
          </v-col>
          <v-col class="d-flex justify-end">
            <v-btn color="secondary" variant="outlined" class="mr-2">
              Cancelar
            </v-btn>
            <v-btn @click="guardarCierre" color="indigo-darken-4">
              Guardar
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
//CHARTS
import {use} from 'echarts'
import {BarChart, PieChart} from 'echarts/charts'
import {CanvasRenderer} from 'echarts/renderers'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
//
import {useSnackbar} from "@/composables/use-snackbar.js";
import {useLoading} from "@/composables/use-loading.js";
import {httpGet, httpPost} from "@/scripts/api.js";
import {getIntervaloMesActual} from "@/scripts/utils.js";
import {formatters} from "@/helpers/formatters.js";
import {ref} from "vue";

//CHARTS
use([
  BarChart,
  PieChart,
  CanvasRenderer,
  GridComponent,
  TooltipComponent
])

export default {
  data() {
    return {
      notify: useSnackbar(),
      loading: useLoading(),
      resumen: [],
      resumenUtilidad: [],
      resumenInventario: [],
      resumenProyeccionInventario: [],

      fechaDesde: getIntervaloMesActual().fechaDesde,
      fechaHasta: getIntervaloMesActual().fechaHasta,
      usuarioRegistro: JSON.parse(localStorage.getItem('token')).usuario,
      descripcion: '',

      loadStates: {
        resumen: false,
      },

      snackbar: {
        show: false,
        timeout: 2000,
        text: '',
      },

      pieChart: {
        title: {
          text: 'Proporción\nVentas Totales',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: `{a} <br/>{b}: {c} ({d}%)`
        },
        legend: {
          orient: 'horizontal',
          top: 'bottom',
          data: ['Utilidad', 'Costo de Ventas', 'Gastos Adicionales']
        },
        series: [
          {
            name: 'Ventas',
            type: 'pie',
            top: 50,
            bottom: 50,
            radius: '50%',
            data: [],
            label: {
              show: true,
              formatter: ({
                            name,
                            percent,
                            value
                          }) => name ? `${ name}\n${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`,
              position: 'outside',
              color: '#000000'
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
    }
  },

  methods: {
    async loadDataResumen() {
      try {
        this.loadStates.resumen = true
        const data = await httpGet(`api/cierres/resumen-movimientos?desde=${this.fechaDesde}&hasta=${this.fechaHasta}`)

        this.resumen = data.resumen

        this.resumenUtilidad = []
        this.resumenUtilidad.push({concepto: 'Total Ingresos', valor: data.resumen[2].valor})
        this.resumenUtilidad.push({concepto: 'Total Egresos', valor: data.resumen[5].valor})
        this.resumenUtilidad.push({concepto: 'Utilidad', valor: data.resumen[2].valor - data.resumen[5].valor})

        var ventasTotales = data.resumen[0].valor
        var costoVentas = data.resumen[3].valor
        var gastosAdicionales = data.resumen[4].valor
        var utilidad = ventasTotales - costoVentas - gastosAdicionales

        this.pieChart.series[0].data = []

        this.pieChart.series[0].data.push({value: costoVentas, name: 'Costo de Ventas'})

        this.pieChart.series[0].data.push({value: data.resumen[2].valor - data.resumen[5].valor, name: 'Utilidad'})

        this.pieChart.series[0].data.push({value: gastosAdicionales, name: 'Gastos Adicionales'})


        this.resumenInventario = data.inventario
        this.resumenInventario.push({concepto: 'Valor Total Inventario', valor: data.valorInventario})

        this.resumenProyeccionInventario = data.inventarioProyeccion
        this.resumenProyeccionInventario.push({
          concepto: 'Valor Total Proyectado',
          valor: data.valorInventarioProyeccion
        })

        this.loadStates.resumen = false
        this.notificar('hola')
      } catch (e) {
        this.loadStates.resumen = false
      }
    },

    async guardarCierre() {
      const valid = await this.$refs.form1.validate()
      if(!valid.valid){
        this.notify.notify('error', 'Rellene los campos requeridos.')
        return
      }

      this.loading.load(true)

      try {
        const response =
            await httpPost(
                'api/cierres',
                {
                  desde: this.fechaDesde,
                  hasta: this.fechaHasta,
                  usuarioRegistro: this.usuarioRegistro,
                  descripcion: this.descripcion
                })

        this.notify.notify('info', response.data)
        this.loading.load(false)

        this.close()
      } catch (e) {
        this.handleException(e)
      }
    },

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
                ex.data,
            ) :
            console.log(ex)
      }
    },

    formatedCurrency(key) {
      const value = formatters.formatCurrency(key)
      return value
    },

    close() {
      this.$emit('close')
    },
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
        this.loadDataResumen()
      },
      deep: true,
    },
  },

  mounted() {
    this.loadDataResumen()
  },

  activated() {
    this.loadDataResumen()
  }
}
</script>

<style scoped>

</style>