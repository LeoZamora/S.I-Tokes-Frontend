<template>
  <div class="pa-2">
    <!-- DIÁLOGO DE CONFIGURACIÓN -->
    <v-dialog
      v-model="displayCtrl.config"
      max-width="450"
    >
      <v-card
        class="dialog-card overflow-hidden"
        rounded="xl"
        elevation="24"
      >
        <v-card-item class="px-6 py-4 bg-indigo-darken-4 text-white">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-avatar color="indigo-lighten-4" size="40" class="mr-3">
                <v-icon icon="mdi-calendar-range" color="indigo-darken-4" size="22"></v-icon>
              </v-avatar>
              <div>
                <div class="text-h6 font-weight-bold text-white leading-tight">Filtrar Fechas</div>
                <div class="text-caption text-indigo-lighten-4">Define el período de análisis</div>
              </div>
            </div>
            <v-btn
              icon="mdi-close"
              variant="text"
              color="white"
              density="comfortable"
              @click="displayCtrl.config = false"
            />
          </div>
        </v-card-item>

        <v-card-text class="px-6 py-6 mt-2">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="desde"
                label="Fecha Desde"
                type="date"
                variant="outlined"
                density="comfortable"
                color="indigo"
                rounded="lg"
                prepend-inner-icon="mdi-calendar-start"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="hasta"
                label="Fecha Hasta"
                type="date"
                variant="outlined"
                density="comfortable"
                color="indigo"
                rounded="lg"
                prepend-inner-icon="mdi-calendar-end"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="px-6 pb-6 pt-0">
          <v-spacer />
          <v-btn
            variant="tonal"
            color="grey-darken-1"
            rounded="lg"
            class="text-none px-4"
            @click="displayCtrl.config = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            @click="loadDataVentas(); displayCtrl.config = false"
            color="indigo-darken-4"
            rounded="lg"
            variant="elevated"
            class="text-none px-6 text-white font-weight-bold"
          >
            Aplicar Filtro
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- HEADER DEL DASHBOARD -->
    <v-row class="align-center ma-0" dense>
      <v-col cols="12" md="7">
        <v-card class="welcome-card pa-4 border-0" rounded="xl" elevation="2">
          <div class="d-flex align-center flex-wrap ga-3">
            <v-avatar
              color="indigo-darken-4"
              size="56"
              class="elevation-2 wave-avatar"
            >
              <v-icon
                icon="mdi-hand-wave"
                color="white"
                size="28"
                class="wave-animation"
              ></v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold greeting-title mb-1">
                ¡Hola, {{ username }}!
              </h1>
              <p class="text-subtitle-1 text-indigo-darken-3 mb-0 font-weight-medium">
                Te damos la bienvenida al Sistema de Información
              </p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="5"
        class="d-flex justify-md-end align-center gap-3 mt-3 mt-md-0"
      >
        <v-chip
          prepend-icon="mdi-calendar-blank-outline"
          color="indigo-darken-4"
          variant="tonal"
          class="px-4 mr-2 py-5 font-weight-bold"
          rounded="lg"
        >
          {{ `${formatedDate(desde)} — ${formatedDate(hasta)}` }}
        </v-chip>
        <v-btn
          @click="displayCtrl.config = true"
          color="indigo-darken-4"
          icon="mdi-cog-outline"
          variant="tonal"
          size="large"
          rounded="lg"
          class="elevation-1"
        ></v-btn>
      </v-col>
    </v-row>

    <!-- TARJETAS DE MÉTRICAS (KPIs) -->
    <v-row dense class="px-2">
      <!-- Ventas POS -->
      <v-col cols="12" sm="6" lg="3">
        <v-card
          class="mx-auto border-0 metric-card"
          elevation="2"
          rounded="xl"
        >
          <v-card-item class="pa-5">
            <div class="d-flex align-center mb-4">
              <v-avatar
                color="indigo-lighten-5"
                size="48"
                class="mr-3"
                rounded="lg"
              >
                <v-icon
                  color="indigo-darken-1"
                  icon="mdi-monitor-dashboard"
                  size="24"
                ></v-icon>
              </v-avatar>
              <div>
                <span
                  class="text-caption text-grey font-weight-bold text-uppercase"
                  >Ventas POS</span
                >
                <div
                  class="d-flex align-center mt-1"
                >
                  <v-icon
                    icon="mdi-trending-up"
                    color="success"
                    size="16"
                    class="mr-1"
                  ></v-icon>
                  <span
                    class="text-caption text-success font-weight-bold"
                    >--.-%</span
                  >
                </div>
              </div>
            </div>
            <h2
              class="text-h5 font-weight-bold text-grey-darken-4 mb-3"
            >
              {{
                formatedCurrency(valorVentasPOS)
              }}
            </h2>
            <v-chip
              size="small"
              color="indigo-lighten-1"
              variant="flat"
              class="font-weight-bold text-white"
              rounded="lg"
            >
              {{ cantidadVentasPOS }}
              Transacciones
            </v-chip>
          </v-card-item>
        </v-card>
      </v-col>

      <!-- Ventas Local -->
      <v-col cols="12" sm="6" lg="3">
        <v-card
          class="mx-auto border-0 metric-card"
          elevation="2"
          rounded="xl"
        >
          <v-card-item class="pa-5">
            <div class="d-flex align-center mb-4">
              <v-avatar
                color="pink-lighten-5"
                size="48"
                class="mr-3"
                rounded="lg"
              >
                <v-icon
                  color="pink-darken-1"
                  icon="mdi-storefront"
                  size="24"
                ></v-icon>
              </v-avatar>
              <div>
                <span
                  class="text-caption text-grey font-weight-bold text-uppercase"
                  >Ventas Local</span
                >
                <div
                  class="d-flex align-center mt-1"
                >
                  <v-icon
                    icon="mdi-trending-down"
                    color="error"
                    size="16"
                    class="mr-1"
                  ></v-icon>
                  <span
                    class="text-caption text-error font-weight-bold"
                    >--.-%</span
                  >
                </div>
              </div>
            </div>
            <h2
              class="text-h5 font-weight-bold text-grey-darken-4 mb-3"
            >
              {{
                formatedCurrency(valorVentasLocal)
              }}
            </h2>
            <v-chip
              size="small"
              color="pink-lighten-1"
              variant="flat"
              class="font-weight-bold text-white"
              rounded="lg"
            >
              {{ cantidadVentasLocal }}
              Transacciones
            </v-chip>
          </v-card-item>
        </v-card>
      </v-col>

      <!-- Total Ventas -->
      <v-col cols="12" sm="6" lg="3">
        <v-card
          class="mx-auto border-0 metric-card"
          elevation="2"
          rounded="xl"
        >
          <v-card-item class="pa-5">
            <div class="d-flex align-center mb-4">
              <v-avatar
                color="teal-lighten-5"
                size="48"
                class="mr-3"
                rounded="lg"
              >
                <v-icon
                  color="teal-darken-1"
                  icon="mdi-chart-line"
                  size="24"
                ></v-icon>
              </v-avatar>
              <div>
                <span
                  class="text-caption text-grey font-weight-bold text-uppercase"
                  >Total Ventas</span
                >
                <div
                  class="d-flex align-center mt-1"
                >
                  <v-icon
                    icon="mdi-trending-up"
                    color="success"
                    size="16"
                    class="mr-1"
                  ></v-icon>
                  <span
                    class="text-caption text-success font-weight-bold"
                    >--.-%</span
                  >
                </div>
              </div>
            </div>
            <h2
              class="text-h5 font-weight-bold text-grey-darken-4 mb-3"
            >
              {{ formatedCurrency(valorVentas) }}
            </h2>
            <div class="d-flex align-center justify-space-between mt-2">
              <v-chip
                size="small"
                color="teal-lighten-1"
                variant="flat"
                class="font-weight-bold text-white"
                rounded="lg"
              >
                {{ cantidadVentas }} Totales
              </v-chip>
              <v-btn
                color="blue"
                @click="nameTab('Facturación')"
                variant="tonal"
                size="small"
                rounded
              >
                <v-icon start>mdi-arrow-top-right</v-icon>
                Ir a ver detalle
              </v-btn>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <!-- Utilidades -->
      <v-col cols="12" sm="6" lg="3">
        <v-card
          class="mx-auto border-0 metric-card"
          elevation="2"
          rounded="xl"
        >
          <v-card-item class="pa-5">
            <div class="d-flex align-center mb-4">
              <v-avatar
                color="amber-lighten-5"
                size="48"
                class="mr-3"
                rounded="lg"
              >
                <v-icon
                  color="amber-darken-2"
                  icon="mdi-currency-usd"
                  size="24"
                ></v-icon>
              </v-avatar>
              <div>
                <span
                  class="text-caption text-grey font-weight-bold text-uppercase"
                  >Utilidades</span
                >
                <div
                  class="d-flex align-center mt-1"
                >
                  <v-icon
                    icon="mdi-trending-up"
                    color="success"
                    size="16"
                    class="mr-1"
                  ></v-icon>
                  <span
                    class="text-caption text-success font-weight-bold"
                    >--.-%</span
                  >
                </div>
              </div>
            </div>
            <h2
              class="text-h5 font-weight-bold text-grey-darken-4 mb-3"
            >
              {{ formatedCurrency(utilidades) }}
            </h2>
            <div class="d-flex align-center justify-space-between mt-2">
              <v-chip
                size="small"
                color="amber-darken-2"
                variant="flat"
                class="font-weight-bold text-white"
                rounded="lg"
              >
                Margen Activo
              </v-chip>
              <v-btn
                color="blue"
                @click="nameTab('Detalle de Ventas')"
                variant="tonal"
                size="small"
                rounded
              >
                <v-icon start>mdi-arrow-top-right</v-icon>
                Ir a ver detalle
              </v-btn>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- SECCIÓN DE GRÁFICOS -->
    <v-row dense class="px-2">
      <!-- Gráfico de Ventas Principal -->
      <v-col cols="12" lg="6">
        <v-card
          class="border-0 pa-6 chart-card"
          elevation="2"
          rounded="xl"
        >
          <v-card-item class="pa-0 mb-6">
            <div
              class="d-flex justify-space-between align-center flex-wrap ga-4"
            >
              <div>
                <div
                  class="text-h6 font-weight-bold text-grey-darken-4 mb-1"
                >
                  Analítica de Ventas
                </div>
                <span
                  class="text-caption text-grey font-weight-medium"
                  >Tendencia del período
                  seleccionado</span
                >
              </div>
              <v-btn-toggle
                mandatory
                density="comfortable"
                divided
                rounded="lg"
                color="primary"
              >
                <v-btn
                  value="day"
                  size="small"
                  class="text-none px-4"
                  >Día</v-btn
                >
                <v-btn
                  value="week"
                  size="small"
                  class="text-none px-4"
                  >Semana</v-btn
                >
                <v-btn
                  value="month"
                  size="small"
                  class="text-none px-4"
                  >Mes</v-btn
                >
              </v-btn-toggle>
            </div>
          </v-card-item>
          <v-chart
            :option="ventas"
            autoresize
            style="height: 330px; width: 100%"
          />
        </v-card>
      </v-col>

      <!-- Gráfico de Pastel / Distribución -->
      <v-col cols="12" lg="6">
        <v-card
          class="border-0 pa-6 chart-card"
          elevation="2"
          rounded="xl"
        >
          <v-card-item class="pa-0 mb-6">
            <div
              class="d-flex justify-space-between align-center"
            >
              <div>
                <div
                  class="text-h6 font-weight-bold text-grey-darken-4 mb-1"
                >
                  Distribución por Rutas
                </div>
                <span
                  class="text-caption text-grey font-weight-medium"
                  >Proporción de ventas por
                  tipo</span
                >
              </div>
              <v-icon
                icon="mdi-dots-horizontal"
                color="grey-lighten-1"
              ></v-icon>
            </div>
          </v-card-item>
          <v-chart
            :option="pieChart"
            autoresize
            style="height: 330px; width: 100%"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { use } from 'echarts'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { httpGet } from '@/scripts/api.js'
import { getIntervaloMesActual } from '@/scripts/utils.js'
import { formatters } from '@/helpers/formatters.js'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'

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
    next((vm) => {
      vm.loadDataVentas()
    })
  },
  data() {
    return {
      displayCtrl: {
        config: false
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
              color: '#000000'
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
            barWidth: '50%', // ajusta el ancho de la barra si lo necesitas
            data: []
          }
        ]
      }
    }
  },

  methods: {
    async loadDataVentas() {
      var result = await httpGet(
        `api/estadisticas/ventas-mes?desde=${this.desde}&hasta=${this.hasta}`
      )

      this.ventas.xAxis.data = result.nombresRutas
      this.ventas.series[0].data = result.data

      this.pieChart.legend.data =
        result.nombresRutas
      this.pieChart.series[0].data =
        result.ventasPie

      this.cantidadVentasLocal =
        result.ventasLocal.cantidad
      this.valorVentasLocal =
        result.ventasLocal.ventasTotales

      this.cantidadVentasPOS =
        result.ventasPOS.cantidad
      this.valorVentasPOS =
        result.ventasPOS.ventasTotales

      this.cantidadVentas = result.cantidadVentas
      this.valorVentas = result.valorVentas

      this.utilidades = result.utilidades
    },

    formatedDate(dataString) {
      return formatters.formateDate(
        dataString,
        false
      )
    },

    formatedCurrency(value) {
      return formatters.formatCurrency(
        value,
        'NIO'
      )
    }
  },

  setup() {
    const router = useRouter()
    const store = useStore()
    const token = store.getInfoUser()
    const username = token ? token.usuario : ''

    function nameTab(name) {
      router.push({ name: name })
    }

    return {
      nameTab,
      username
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

.dashboard-container {
  background: #f8fafc;
  min-height: 100vh;
  padding: 24px;
}

.greeting-title {
  background: linear-gradient(45deg, #1a237e, #311b92, #0d47a1);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 5s linear infinite;
}

@keyframes shine {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.welcome-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%);
  border-left: 5px solid #1a237e;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.welcome-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
}

.wave-animation {
  animation: wave 2.2s infinite;
  transform-origin: 70% 70%;
}

@keyframes wave {
  0% { transform: rotate( 0.0deg) }
  10% { transform: rotate(14.0deg) }
  20% { transform: rotate(-8.0deg) }
  30% { transform: rotate(14.0deg) }
  40% { transform: rotate(-4.0deg) }
  50% { transform: rotate(10.0deg) }
  60% { transform: rotate( 0.0deg) }
  100% { transform: rotate( 0.0deg) }
}
</style>
