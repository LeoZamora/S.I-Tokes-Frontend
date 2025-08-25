<template>
  <v-card>
    <v-card-title class="font-weight-bold">
      <div class="mr-auto ml-auto">
        Resumen de Inventario
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
                  label="Fecha desde:"
                  density="compact"
                  type="date"
                  :rules="[v => !!v || 'Requerido.']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                  v-model="fechaHasta"
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
            <v-row>
              <v-col cols="4" class="py-4">
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
              </v-col>
              <v-col cols="4" class="py-4">
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
              <v-col cols="4" class="py-4">
                <div style="font-size: 18px; font-weight: bold" class="mb-2">
                  Proyección de Utilidad Actual
                </div>
                <div style="font-size: 16px">
                  <v-row v-for="(item, index) in resumenUtilidad" :key="index"
                         class="font-weight-bold"
                         dense
                         :style="{
                  'background-color': [resumenUtilidad.length-1].includes(index) ? 'yellow' : 'white'
                }"
                  >
                    <v-col
                        cols="7"
                        style="border: 1px solid #BDBDBD; border-bottom: none"
                        :style="{
                    'border': '1px solid #BDBDBD',
                    'border-bottom': [resumenUtilidad.length-1].includes(index) ? '1px solid #BDBDBD' : 'none',
                    'border-right': 'none',
                    'background-color': [resumenUtilidad.length-1].includes(index) ? 'yellow' : 'white'
                  }"
                    >
                      <span class="font-weight-bold">{{ item.concepto }}</span>
                    </v-col>
                    <v-col
                        class="text-center"
                        :style="{
                    'border': '1px solid #BDBDBD',
                    'border-bottom': [resumenUtilidad.length-1].includes(index) ? '1px solid #BDBDBD' : 'none',
                    'background-color': [resumenUtilidad.length-1].includes(index) ? 'yellow' : 'white'
                  }"
                    >
                      <span>{{ formatedCurrency(item.valor) }}</span>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="12">
                <v-card elevation="3" height="300">
                  <v-chart
                      :option="ventas"
                      autoresize
                      style="height: 300px"
                  />
                </v-card>
              </v-col>
            </v-row>
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
import {getIntervaloMesActual} from "@/scripts/utils.js";
import {useLoading} from "@/composables/use-loading.js";
import {useSnackbar} from "@/composables/use-snackbar.js";
import {httpGet} from "@/scripts/api.js";
import {formatters} from "@/helpers/formatters.js";

use([
  BarChart,
  PieChart,
  CanvasRenderer,
  GridComponent,
  TooltipComponent
])

export default {
  name: 'resumen-inventario',

  data(){
    return{
      loading: useLoading(),
      snackbar: useSnackbar(),

      fechaDesde: getIntervaloMesActual().fechaDesde,
      fechaHasta: getIntervaloMesActual().fechaHasta,

      resumenInventario: [],
      resumenProyeccionInventario: [],
      resumenUtilidad: [],

      ventas: {
        title: {
          text: 'Ventas por Categoría\n',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            lineHeight: 20
          }
        },
        tooltip: {},
        color: ['#1A237E', '#43A047'],
        legend: {
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold'
          },
          data: ['Ventas', 'Utilidad']
        },
        xAxis: {
          data: [],
          axisLine: {
            lineStyle: {
              color: '#000000',
            }
          },
          axisLabel: {
            interval: 0,
            rotate: 0,
            align: 'center',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#333',
            lineHeight: 20
          }
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              color: '#757575',
              type: 'dashed'
            }
          },
          axisLine: {
            lineStyle: { color: '#000000' },
          },
          axisLabel: {
            fontSize: 12,
            fontWeight: 'bold',
            rotate: 0,
            formatter: function (value) {
              return formatters.formatCurrency(value)
            },
            margin: 20
          }
        },
        series: [
          {
            name: 'Ventas',
            type: 'bar',
            barWidth: '30%',
            data: [],
            label: {
              show: true,
              position: 'top',
              fontSize: 12,
              formatter: function (params) {
                // Aquí params.value equivale a {c}
                return formatters.formatCurrency(params.value)
              },
              fontWeight: 'bold',
              color: '#333'
            }
          },
          {
            name: 'Utilidad',
            type: 'bar',
            barWidth: '30%',
            data: [],
            label: {
              show: true,
              position: 'top',
              fontSize: 12,
              fontWeight: 'bold',
              formatter: function (params) {
                // Aquí params.value equivale a {c}
                return formatters.formatCurrency(params.value)
              },
              color: '#333'
            }
          },
        ]
      }
    }
  },

  methods: {
    async loadDataResumen() {
      try {
        this.loading.load(true)

        const data = await httpGet(`api/estadisticas/resumen-inventario?desde=${this.fechaDesde}&hasta=${this.fechaHasta}`)

        this.resumenInventario = data.inventario
        this.resumenInventario.push({concepto: 'Valor Total Inventario', valor: data.valorInventario})

        this.resumenProyeccionInventario = data.inventarioProyeccion
        this.resumenProyeccionInventario.push({
          concepto: 'Valor Total Proyectado',
          valor: data.valorInventarioProyeccion
        })


        this.resumenUtilidad = []
        data.inventario.slice(0, data.inventario.length-1).forEach(x => {
          let proy = this.resumenProyeccionInventario.find(c => c.concepto === x.concepto)

          this.resumenUtilidad.push({
            concepto: x.concepto,
            valor: proy ? proy.valor - x.valor : 0
          })
        })

        this.resumenUtilidad.push({
          concepto: 'Utilidad Total Proyectada',
          valor: data.valorInventarioProyeccion - data.valorInventario
        })

        this.ventas.xAxis.data = data.nombresCategorias
        this.ventas.series[0].data = data.ventas
        this.ventas.series[1].data = data.utilidades

        this.loading.load(false)
      } catch (e) {
        this.loading.load(false)
      }
    },

    //FORMATERS
    formatedCurrency(key) {
      const value = formatters.formatCurrency(key)
      return value
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