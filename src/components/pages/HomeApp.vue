<template>
  <div class="pa-2">
    <v-row class="no-gutters" dense>
      <v-col cols="8">
        <v-card
          elevation="3"
          class="v-card-background"
          height="100"
        >
          <v-row>
            <v-col class="text-center">
              <h1>Bienvenido</h1>
              <h4 class="text-grey">
                Sistema de Información
              </h4>
            </v-col>
            <v-col>
              <img
                src="/128px.svg"
                width="250"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card
          elevation="3"
          class="v-card-background"
          height="100"
        >
          <div class="d-flex flex-column align-center">
            <div style="font-size: 14px; color: grey">
              Ventas desde POS
            </div>
            <img
              src="/dashboard/punto-de-venta.png"
              width="50"
            />
            <div style="font-size: 14px;">
              (42) C$ 12,545.25
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card
          elevation="3"
          class="v-card-background"
          height="100"
        >
          <div class="d-flex flex-column align-center">
            <div style="font-size: 14px; color: grey">
              Ventas en Local
            </div>
            <img
              src="/dashboard/compra-local.png"
              width="50"
            />
            <div style="font-size: 14px;">
              (56) C$ 18,272.45
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card
          elevation="3"
          class="v-card-background"
          height="300"
        >
          <v-chart
            :option="ventas"
            autoresize
            style="height: 300px"
          />
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-row dense>
          <v-col cols="12">
            <v-card
              elevation="3"
              class="v-card-background"
              height="145"
            >
              <v-chart :option="pieChart" autoresize style="height: 145px;" />
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-row dense>
              <v-col>
                <v-card
                  elevation="3"
                  class="v-card-background d-flex align-center justify-center"
                  height="145"
                >
                  <div class="d-flex flex-column align-center">
                    <div style="font-size: 14px; color: grey">
                      Total de Ventas
                    </div>
                    <img
                      src="/dashboard/analitica.png"
                      width="50"
                    />
                    <div style="font-size: 14px;">
                      (98) C$ 30,817.70
                    </div>
                  </div>
                </v-card>
              </v-col>
              <v-col>
                <v-card
                  elevation="3"
                  class="v-card-background d-flex align-center justify-center"
                  height="145"
                >
                  <div class="d-flex flex-column align-center">
                    <div style="font-size: 14px; color: grey">
                      Total de Utilidades
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
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <!--<v-col cols="4">
        <v-card
          elevation="3"
          class="v-card-background d-flex align-center justify-center"
          height="145"
        >
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
      <v-col cols="2">
        <v-card
          elevation="3"
          class="v-card-background"
          height="150"
        >
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card
          elevation="3"
          class="v-card-background"
          height="150"
        >
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card
          elevation="3"
          class="v-card-background"
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

use([
  BarChart,
  CanvasRenderer,
  GridComponent,
  TooltipComponent
])

export default {
  data() {
    return {
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
          left: 'left',
          data: ['Ruta 1', 'Ruta 2', 'Ruta 3', 'Ruta 4', 'Ruta 5']
        },
        series: [
          {
            name: 'Ventas',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 8596.25, name: 'Ruta 1' },
              { value: 11525.46, name: 'Ruta 2' },
              { value: 5645.25, name: 'Ruta 3' },
              { value: 7850.22, name: 'Ruta 4' },
              { value: 2548.25, name: 'Ruta 5' }
            ],
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
          text: 'Ventas por Ruta\nMes de julio',
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
          data: [
            'Ruta 1\nChinandega',
            'Ruta 2\nEstelí',
            'Ruta 3\nEl Cuá',
            'Ruta 4\nMatagalpa',
            'Ruta 5\nChinandega 2'
          ],
          axisLine: {
            lineStyle: { color: '#6C6CFF' }
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
            data: [
              {
                value: 8596.25,
                itemStyle: { color: '#FF6347' }
              },
              {
                value: 11525.46,
                itemStyle: { color: '#6A5ACD' }
              },
              {
                value: 5645.25,
                itemStyle: { color: '#3CB371' }
              },
              {
                value: 7850.22,
                itemStyle: { color: '#FFA500' }
              },
              {
                value: 2548.25,
                itemStyle: { color: '#8A2BE2' }
              },
            ]
          }
        ]
      }
    }
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
