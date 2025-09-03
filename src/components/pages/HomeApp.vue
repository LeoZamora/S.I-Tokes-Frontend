<template>
  <div class="pa-2">
    <v-dialog v-model="displayCtrl.config" width="300">
      <v-card>
        <v-card-title>
          Configuración de Dashboard
        </v-card-title>
        <v-card-subtitle>
          Editar intervalo de fechas
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  v-model="desde"
                  label="Fecha desde:"
                  type="date"
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="hasta"
                  label="Fecha hasta:"
                  type="date"
                  hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" variant="flat" @click="displayCtrl.config = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row class="no-gutters" dense>
      <v-col cols="12">
        <v-card elevation="3" class="pa-2">
          <v-row dense>
            <v-col class="text-center" >
              <h1>Bienvenido</h1>
              <h4 class="text-grey">
                Sistema de Información
              </h4>
              <h5>{{ `${desde} al ${hasta}` }}</h5>
            </v-col>
            <v-col class="d-flex">
              <img
                src="/128px.svg"
                width="250"
              />
              <div class="d-flex flex-column align-end ml-auto">
                <v-btn @click="displayCtrl.config = true" color="primary" class="mx-4"><v-icon>mdi-cog</v-icon></v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="6" md="3" sm="3">
        <v-card elevation="3" class="" height="100" >
          <div class="d-flex flex-column align-center">
            <div style="font-size: 14px; color: grey">
              Ventas desde POS
            </div>
            <img
              src="/dashboard/punto-de-venta.png"
              width="50"
            />
            <div style="font-size: 14px;">
              {{ `(${cantidadVentasPOS}) C$ ${valorVentasPOS}` }}
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3" sm="3">
        <v-card elevation="3" class="" height="100" >
          <div class="d-flex flex-column align-center">
            <div style="font-size: 14px; color: grey">
              Ventas en Local
            </div>
            <img
              src="/dashboard/compra-local.png"
              width="50"
            />
            <div style="font-size: 14px;">
              {{ `(${cantidadVentasLocal}) C$ ${valorVentasLocal}` }}
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col>
        <v-card elevation="3" class=" d-flex align-center justify-center" height="100">
          <div class="d-flex flex-column align-center">
            <div style="font-size: 14px; color: grey">
              Total de Ventas
            </div>
            <img
              src="/dashboard/analitica.png"
              width="50"
            />
            <div style="font-size: 14px;">
              {{ `(${cantidadVentas}) C$ ${valorVentas}` }}
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col>
        <v-card elevation="3" class=" d-flex align-center justify-center" height="100">
          <div class="d-flex flex-column align-center">
            <div style="font-size: 14px; color: grey">
              Total de Utilidades
            </div>
            <img
              src="/dashboard/beneficios.png"
              width="50"
            />
            <div style="font-size: 14px;">
              {{ `(${cantidadVentas}) C$ ${utilidades}` }}
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card elevation="3" height="300">
          <v-chart
            :option="ventas"
            autoresize
            style="height: 300px"
          />
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-row dense>
          <v-col cols="12">
            <v-card elevation="3" height="300">
              <v-chart :option="pieChart" autoresize style="height: 300px;" />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <!--<v-col cols="4">
        <v-card elevation="3" class=" d-flex align-center justify-center" height="100">
          <div class="d-flex flex-column align-center">
            <div style="font-size: 14px; color: grey">
              Últimas Transacciones
            </div>
            <img
              src="/dashboard/beneficios.png"
              width="50"
            />
            <div style="font-size: 14px;">
              (98) C$ 12,327.08
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3" sm="3">
        <v-card
          elevation="3"
          class=""
          height="150"
        >
        </v-card>
      </v-col>
      <v-col cols="6" md="3" sm="3">
        <v-card
          elevation="3"
          class=""
          height="150"
        >
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card
          elevation="3"
          class=""
          height="150"
        >
        </v-card>
      </v-col>-->
    </v-row>
  </div>
  <!--<div
    id="logo"
    class="pa-1 position-absolute"
    style="
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    "
  >
    <div class="d-flex flex-column align-center">
      <img src="/logoIZ.jpg" width="400" />
      <h1>Bienvenido</h1>
      <h4 class="text-grey">
        Sistema de Información
      </h4>
      <v-chart :option="ventas" autoresize style="height: 400px;" />
    </div>
  </div>-->
</template>

<script>
import { use } from 'echarts'
import { BarChart, PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import {httpGet} from "@/scripts/api.js";
import {getIntervaloMesActual} from "@/scripts/utils.js";
import {formatters} from "@/helpers/formatters.js";

use([
  BarChart,
  CanvasRenderer,
  GridComponent,
  TooltipComponent
])

export default {

  mounted() {
    this.loadDataVentas()
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.loadDataVentas()
    })
  },
  data() {
    return {
      displayCtrl: {
        config: false,
      },

      desde: getIntervaloMesActual().fechaDesde,
      hasta: getIntervaloMesActual().fechaHasta,

      cantidadVentasLocal: 0,
      valorVentasLocal: 0,

      cantidadVentasPOS: 0,
      valorVentasPOS: 0,

      cantidadVentas: 0,
      valorVentas: 0,
      utilidades: 0,
      colors: [
        '#FF6347',
        '#6A5ACD',
        '#3CB371',
        '#FFA500',
        '#20B2AA',
        '#DC143C',
        '#8A2BE2',
        '#FF4500'
      ],
      pieChart: {
        title: {
          text: 'Distribución de Ventas',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: []
        },
        series: [
          {
            name: 'Ventas',
            type: 'pie',
            radius: '50%',
            data: [],
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
      ventas: {
        title: {
          text: 'Ventas por Ruta',
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#333',
            lineHeight: 20
          }
        },
        tooltip: {},
        legend: {
          data: ['Ventas']
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
            fontSize: 10,
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
            lineStyle: { color: '#6C6CFF' }
          }
        },
        series: [
          {
            name: 'Ventas',
            type: 'bar',
            barWidth: '50%',  // ajusta el ancho de la barra si lo necesitas
            data: []
          }
        ]
      }
    }
  },

  computed: {
    configuracion(){
      return {
        desde: this.desde,
        hasta: this.hasta
      }
    }
  },

  methods: {
    async loadDataVentas(){
      var result = await httpGet(`api/estadisticas/ventas-mes?desde=${this.desde}&hasta=${this.hasta}`)

      this.ventas.xAxis.data = result.nombresRutas
      this.ventas.series[0].data = result.data

      this.pieChart.legend.data = result.nombresRutas
      this.pieChart.series[0].data = result.ventasPie

      this.cantidadVentasLocal = result.ventasLocal.cantidad
      this.valorVentasLocal = result.ventasLocal.ventasTotales

      this.cantidadVentasPOS = result.ventasPOS.cantidad
      this.valorVentasPOS = result.ventasPOS.ventasTotales

      this.cantidadVentas = result.cantidadVentas
      this.valorVentas = result.valorVentas

      this.utilidades = result.utilidades
    },

    formatedDate(dataString) {
      const value = formatters.formatDate(dataString)
      return value
    },
  },

  watch: {
    configuracion: {
      handler(){
        this.loadDataVentas()
      },
      deep: true
    },
  }
}
</script>

<style scoped>
.v-card-background {
  background-color: #fafafa;
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#logo {
  animation: slideInFromRight 2s;
}
</style>
