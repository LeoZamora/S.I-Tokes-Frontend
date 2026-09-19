<template>
  <div class="w-100">
    <!-- Encabezado y Barra de Filtros Generales -->
    <v-card
      class="border-t border-b"
      elevation="0"
      rounded="0"
    >
      <!-- Encabezado -->
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <div
            class="text-h6 font-weight-bold d-flex align-center"
          >
            <v-icon class="me-2" color="indigo">
              mdi-clipboard-text-clock-outline
            </v-icon>
            Kardex de Inventario
          </div>
        </div>
      </template>

      <template v-slot:append>
        <div class="d-flex align-center">
          <v-btn-toggle
            v-model="quickDateFilter"
            mandatory
            density="compact"
            color="indigo-darken-3"
            class="me-2 d-none d-md-flex"
            @update:model-value="
              onQuickDateChange
            "
          >
            <v-btn
              value="today"
              size="small"
              class="text-none"
              >Hoy</v-btn
            >
            <v-btn
              value="week"
              size="small"
              class="text-none"
              >Esta Semana</v-btn
            >
            <v-btn
              value="month"
              size="small"
              class="text-none"
              >Este Mes</v-btn
            >
            <v-btn
              value="all"
              size="small"
              class="text-none"
              >Todo</v-btn
            >
          </v-btn-toggle>
        </div>
      </template>

      <v-divider />

      <!-- Fila de Fechas y Búsqueda -->
      <v-row class="pa-2" dense align="center">
        <!-- Rango de Fechas -->
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="filters.fechaDesde"
            type="date"
            label="Fecha Desde"
            density="compact"
            variant="outlined"
            color="indigo"
            hide-details
            clearable
            @update:model-value="loadKardexData"
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="filters.fechaHasta"
            type="date"
            label="Fecha Hasta"
            density="compact"
            variant="outlined"
            color="indigo"
            hide-details
            clearable
            @update:model-value="loadKardexData"
          />
        </v-col>

        <!-- Búsqueda General -->
        <v-col cols="12" sm="8" md="4">
          <v-text-field
            color="indigo"
            density="compact"
            variant="outlined"
            append-inner-icon="mdi-magnify"
            label="Buscar en Kardex..."
            v-model="data.search"
            hide-details
            placeholder="Código, producto, referencia, bodega, usuario..."
            clearable
            persistent-placeholder
            @click:clear="data.search = ''"
          />
        </v-col>

        <!-- Botones de Acción -->
        <v-col
          cols="12"
          sm="4"
          md="2"
          class="d-flex justify-end align-center"
        >
          <v-btn
            class="mr-2"
            variant="text"
            color="error"
            @click="exportToExcel"
            icon
            size="small"
          >
            <v-icon>mdi-download-multiple</v-icon>
            <v-tooltip
              location="top center"
              activator="parent"
            >
              Descargar Kardex a Excel
            </v-tooltip>
          </v-btn>

          <v-btn
            class="mr-2"
            variant="text"
            color="indigo"
            @click="loadKardexData"
            icon
            size="small"
          >
            <v-icon>mdi-refresh</v-icon>
            <v-tooltip
              location="top center"
              activator="parent"
            >
              Actualizar
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- KPI Summary Cards -->
    <v-card
      elevation="0"
      class="pa-2 bg-grey-lighten-4 border-b rounded-0"
    >
      <v-row dense>
        <!-- Total Movimientos -->
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card
            elevation="1"
            class="pa-3 rounded-lg fill-height bg-white"
          >
            <div class="d-flex align-center">
              <v-avatar
                size="36"
                color="indigo-lighten-5"
                class="me-2"
              >
                <v-icon color="indigo" size="20"
                  >mdi-clipboard-list-outline</v-icon
                >
              </v-avatar>
              <div>
                <div
                  class="text-caption text-grey font-weight-medium"
                >
                  Total Movimientos
                </div>
                <div
                  class="text-subtitle-1 font-weight-bold text-indigo-darken-4"
                >
                  {{ metrics.totalMovimientos }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Total Entradas -->
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card
            elevation="1"
            class="pa-3 rounded-lg fill-height bg-white"
          >
            <div class="d-flex align-center">
              <v-avatar
                size="36"
                color="green-lighten-5"
                class="me-2"
              >
                <v-icon
                  color="green-darken-3"
                  size="20"
                  >mdi-arrow-down-bold-box-outline</v-icon
                >
              </v-avatar>
              <div>
                <div
                  class="text-caption text-grey font-weight-medium"
                >
                  Entradas (+ Unidades)
                </div>
                <div
                  class="text-subtitle-1 font-weight-bold text-green-darken-4"
                >
                  +{{
                    metrics.totalUnidadesEntrada.toLocaleString(
                      'es-NI'
                    )
                  }}
                  <span
                    class="text-caption font-weight-regular text-grey-darken-1 ms-1"
                  >
                    ({{
                      formatCurrency(
                        metrics.totalValorEntrada
                      )
                    }})
                  </span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Total Salidas -->
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card
            elevation="1"
            class="pa-3 rounded-lg fill-height bg-white"
          >
            <div class="d-flex align-center">
              <v-avatar
                size="36"
                color="red-lighten-5"
                class="me-2"
              >
                <v-icon
                  color="red-darken-3"
                  size="20"
                  >mdi-arrow-up-bold-box-outline</v-icon
                >
              </v-avatar>
              <div>
                <div
                  class="text-caption text-grey font-weight-medium"
                >
                  Salidas (- Unidades)
                </div>
                <div
                  class="text-subtitle-1 font-weight-bold text-red-darken-4"
                >
                  -{{
                    metrics.totalUnidadesSalida.toLocaleString(
                      'es-NI'
                    )
                  }}
                  <span
                    class="text-caption font-weight-regular text-grey-darken-1 ms-1"
                  >
                    ({{
                      formatCurrency(
                        metrics.totalValorSalida
                      )
                    }})
                  </span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Variación Neta -->
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card
            elevation="1"
            class="pa-3 rounded-lg fill-height bg-white"
          >
            <div class="d-flex align-center">
              <v-avatar
                size="36"
                :color="
                  metrics.variacionNeta >= 0
                    ? 'teal-lighten-5'
                    : 'orange-lighten-5'
                "
                class="me-2"
              >
                <v-icon
                  :color="
                    metrics.variacionNeta >= 0
                      ? 'teal-darken-3'
                      : 'orange-darken-3'
                  "
                  size="20"
                >
                  {{
                    metrics.variacionNeta >= 0
                      ? 'mdi-trending-up'
                      : 'mdi-trending-down'
                  }}
                </v-icon>
              </v-avatar>
              <div>
                <div
                  class="text-caption text-grey font-weight-medium"
                >
                  Balance Neto Unidades
                </div>
                <div
                  class="text-subtitle-1 font-weight-bold"
                  :class="
                    metrics.variacionNeta >= 0
                      ? 'text-teal-darken-4'
                      : 'text-orange-darken-4'
                  "
                >
                  {{
                    metrics.variacionNeta >= 0
                      ? `+${metrics.variacionNeta.toLocaleString('es-NI')}`
                      : metrics.variacionNeta.toLocaleString(
                          'es-NI'
                        )
                  }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- Tabla Principal de Kardex -->
    <v-data-table
      class="font"
      density="compact"
      :headers="data.headers"
      :items="filteredItems"
      :items-per-page="15"
      :search="data.search"
      :loading="data.loading"
      :row-props="setStyle"
      :header-props="{
        class: 'font-weight-bold'
      }"
      hover
    >
      <template v-slot:loader>
        <v-progress-linear
          color="indigo"
          indeterminate
          height="2"
        />
      </template>
      <template v-slot:loading>
        <v-skeleton-loader
          type="table-row@10"
        ></v-skeleton-loader>
      </template>

      <!-- Header Filtro Tipo Movimiento -->
      <template v-slot:header.tipoMovimiento>
        <div
          class="text-caption font-weight-bold"
        >
          Tipo Movimiento
        </div>
        <v-select
          v-model="filters.tipoMovimiento"
          variant="outlined"
          density="compact"
          :items="tiposMovOptions"
          hide-details
          clearable
          placeholder="Todos"
          color="indigo"
          class="mt-1 filter-select"
        />
      </template>

      <!-- Header Filtro Bodega -->
      <template v-slot:header.bodegaNombre>
        <div
          class="text-caption font-weight-bold"
        >
          Bodega
        </div>
        <v-autocomplete
          v-model="filters.idBodega"
          variant="outlined"
          density="compact"
          :items="bodegasOptions"
          hide-details
          clearable
          placeholder="Todas"
          color="indigo"
          class="mt-1 filter-select"
        />
      </template>

      <!-- Header Filtro Categoría -->
      <template v-slot:header.categoria>
        <div
          class="text-caption font-weight-bold"
        >
          Categoría
        </div>
        <v-autocomplete
          v-model="filters.categoria"
          variant="outlined"
          density="compact"
          :items="categoriasOptions"
          hide-details
          clearable
          placeholder="Todas"
          color="indigo"
          class="mt-1 filter-select"
        />
      </template>

      <!-- Header Filtro Subcategoría -->
      <template v-slot:header.subCategoria>
        <div
          class="text-caption font-weight-bold"
        >
          Subcategoría
        </div>
        <v-autocomplete
          v-model="filters.subCategoria"
          variant="outlined"
          density="compact"
          :items="subCategoriasOptions"
          hide-details
          clearable
          placeholder="Todas"
          color="indigo"
          class="mt-1 filter-select"
        />
      </template>

      <!-- Header Filtro Operación -->
      <template v-slot:header.cantidad>
        <div
          class="text-caption font-weight-bold"
        >
          Cantidad / Operación
        </div>
        <v-select
          v-model="filters.tipoOperacion"
          variant="outlined"
          density="compact"
          :items="operacionesOptions"
          hide-details
          clearable
          placeholder="Todas"
          color="indigo"
          class="mt-1 filter-select"
        />
      </template>

      <!-- ITEM: Fecha y Hora -->
      <template
        v-slot:item.fechaRegistro="{ item }"
      >
        <div class="py-1 text-center">
          <div
            class="font-weight-medium text-body-2 text-grey-darken-4"
          >
            {{ formatDate(item.fechaRegistro) }}
          </div>
          <div
            class="text-caption text-grey"
            style="
              font-size: 0.72rem !important;
              line-height: 1;
            "
          >
            {{ formatTime(item.fechaRegistro) }}
          </div>
        </div>
      </template>

      <!-- ITEM: Tipo Movimiento -->
      <template
        v-slot:item.tipoMovimiento="{ item }"
      >
        <div class="text-center">
          <v-chip
            size="small"
            :color="
              getTipoMovColor(item.tipoMovimiento)
            "
            variant="flat"
            class="font-weight-bold text-white px-2"
          >
            {{ item.tipoMovimiento }}
          </v-chip>
        </div>
      </template>

      <!-- ITEM: Referencia / Documento -->
      <template v-slot:item.referencia="{ item }">
        <div class="py-1">
          <v-btn
            variant="text"
            density="compact"
            color="indigo-darken-3"
            class="pa-0 font-weight-bold text-body-2 text-none"
            @click="
              openDetalleMovimiento(
                item.idMovInventario
              )
            "
          >
            <v-icon size="14" class="me-1"
              >mdi-open-in-new</v-icon
            >
            {{ item.referencia || '- - -' }}
          </v-btn>
          <div
            class="text-caption text-grey"
            style="
              font-size: 0.7rem !important;
              line-height: 1;
            "
          >
            ID Mov: #{{ item.idMovInventario }}
          </div>
        </div>
      </template>

      <!-- ITEM: Producto / Código Unificados -->
      <template
        v-slot:item.productoNombre="{ item }"
      >
        <div class="py-1">
          <div class="d-flex align-center">
            <v-chip
              v-if="item.productoCodigo"
              size="x-small"
              color="indigo-darken-3"
              variant="tonal"
              class="font-weight-bold me-2 flex-shrink-0"
            >
              {{ item.productoCodigo }}
            </v-chip>
            <span
              class="font-weight-bold text-grey-darken-4 text-truncate"
              style="max-width: 230px"
            >
              {{ item.productoNombre }}
            </span>
          </div>
          <div
            class="text-caption text-grey-darken-1 d-flex align-center mt-0.5"
            v-if="item.unidadMedida"
          >
            <v-icon size="12" class="me-1"
              >mdi-scale-balance</v-icon
            >
            <span>{{ item.unidadMedida }}</span>
          </div>
        </div>
      </template>

      <!-- ITEM: Bodega -->
      <template
        v-slot:item.bodegaNombre="{ item }"
      >
        <div class="py-1">
          <div
            class="font-weight-medium text-body-2"
          >
            {{ item.bodegaNombre }}
          </div>
          <div
            class="text-caption text-grey"
            style="
              font-size: 0.72rem !important;
              line-height: 1;
            "
          >
            <span v-if="item.bodegaCodigo"
              >[{{ item.bodegaCodigo }}]</span
            >
            <span v-if="item.tipoBodegaNombre">
              {{ item.tipoBodegaNombre }}</span
            >
          </div>
        </div>
      </template>

      <!-- ITEM: Categoría -->
      <template v-slot:item.categoria="{ item }">
        <span
          class="text-body-2 text-grey-darken-3 font-weight-medium"
        >
          {{ item.categoria || 'Sin categoría' }}
        </span>
      </template>

      <!-- ITEM: Subcategoría -->
      <template
        v-slot:item.subCategoria="{ item }"
      >
        <span
          class="text-body-2 text-grey-darken-2"
        >
          {{ item.subCategoria || '-' }}
        </span>
      </template>

      <!-- ITEM: Cantidad / Movimiento -->
      <template v-slot:item.cantidad="{ item }">
        <div
          class="d-flex flex-column align-center py-1"
        >
          <v-chip
            size="small"
            :color="
              item.cantidad >= 0
                ? 'green-darken-2'
                : 'red-darken-2'
            "
            variant="tonal"
            class="font-weight-bold px-2"
          >
            <v-icon size="13" class="me-0.5">
              {{
                item.cantidad >= 0
                  ? 'mdi-arrow-down-bold'
                  : 'mdi-arrow-up-bold'
              }}
            </v-icon>
            {{
              item.cantidad >= 0
                ? `+${item.cantidad}`
                : item.cantidad
            }}
          </v-chip>
          <div
            class="text-caption text-grey-darken-1 mt-0.5"
            style="
              font-size: 0.7rem !important;
              line-height: 1;
            "
          >
            {{
              item.cantidad >= 0
                ? 'Entrada'
                : 'Salida'
            }}
          </div>
        </div>
      </template>

      <!-- ITEM: Costo Unitario -->
      <template
        v-slot:item.costoUnitario="{ item }"
      >
        <div
          class="font-weight-medium text-grey-darken-3 text-center"
        >
          {{ formatCurrency(item.costoUnitario) }}
        </div>
      </template>

      <!-- ITEM: Valor Total del Movimiento -->
      <template v-slot:item.valorTotal="{ item }">
        <div
          class="font-weight-medium text-teal-darken-4 text-center"
        >
          {{
            formatCurrency(
              item.valorTotal ??
                Math.abs(item.cantidad) *
                  (item.costoUnitario || 0)
            )
          }}
        </div>
      </template>

      <!-- ITEM: Variación de Stock (Ant -> Nvo) -->
      <template
        v-slot:item.stockAnterior="{ item }"
      >
        <div
          class="d-flex align-center justify-center text-caption py-1"
        >
          <span
            class="text-grey-darken-1 font-weight-medium"
            >{{ item.stockAnterior }}</span
          >
          <v-icon
            size="12"
            color="indigo"
            class="mx-1"
            >mdi-arrow-right</v-icon
          >
          <span
            class="font-weight-bold text-indigo-darken-4"
            >{{ item.nuevoStock }}</span
          >
        </div>
      </template>

      <!-- ITEM: Usuario Registro -->
      <template
        v-slot:item.usuarioRegistro="{ item }"
      >
        <div
          class="text-caption font-weight-medium text-grey-darken-3 d-flex align-center justify-center"
        >
          <v-icon
            size="13"
            color="grey"
            class="me-1"
            >mdi-account-outline</v-icon
          >
          {{ item.usuarioRegistro || 'Sistema' }}
        </div>
      </template>

      <!-- ITEM: Acciones -->
      <template v-slot:item.actions="{ item }">
        <v-tooltip
          text="Ver Detalle del Movimiento"
          location="top"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              size="small"
              icon
              variant="text"
              color="indigo"
              v-bind="props"
              @click="
                openDetalleMovimiento(
                  item.idMovInventario
                )
              "
              class="hover-scale"
            >
              <v-icon size="18"
                >mdi-eye-outline</v-icon
              >
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-data-table>

    <!-- Modal Detalle Completo de Movimiento -->
    <DetalleMovimientoModal
      :show="detalleModal.show"
      :movimiento="detalleModal.movimiento"
      :loading="detalleModal.loading"
      @closeDialog="detalleModal.show = false"
    />

    <!-- Overlay Loader -->
    <OverlayComp :show="data.overlay.show" />
  </div>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  onMounted
} from 'vue'
import RequestHttp from '@/services/requestHttp'
import DetalleMovimientoModal from '@/components/inventario/Kardex/modalsKardex/DetalleMovimientoModal.vue'
import OverlayComp from '@/components/reutilizable/OverlayComp.vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export default {
  name: 'KardexInventario',

  components: {
    DetalleMovimientoModal,
    OverlayComp
  },

  setup() {
    const requestHttp = new RequestHttp()

    const quickDateFilter = ref('month')

    const data = reactive({
      loading: false,
      search: '',
      kardexItems: [],
      bodegas: [],
      tiposMovimientoList: [],
      overlay: {
        show: false
      },
      headers: [
        {
          title: 'Bodega',
          key: 'bodegaNombre',
          align: 'start',
          sortable: false,
          minWidth: '160px'
        },
        {
          title: 'Tipo Movimiento',
          key: 'tipoMovimiento',
          align: 'center',
          sortable: false,
          width: '135px'
        },
        {
          title: 'Fecha / Hora',
          key: 'fechaRegistro',
          align: 'center',
          sortable: true,
          width: '135px'
        },
        {
          title: 'Referencia',
          key: 'referencia',
          align: 'start',
          sortable: false,
          width: '130px'
        },
        {
          title: 'Producto',
          key: 'productoNombre',
          align: 'start',
          sortable: true,
          minWidth: '220px'
        },

        {
          title: 'Categoría',
          key: 'categoria',
          align: 'center',
          sortable: true,
          width: '130px'
        },
        {
          title: 'Subcategoría',
          key: 'subCategoria',
          align: 'center',
          sortable: true,
          width: '130px'
        },
        {
          title: 'Cantidad',
          key: 'cantidad',
          align: 'center',
          sortable: true,
          width: '120px'
        },
        {
          title: 'Costo Unit.',
          key: 'costoUnitario',
          align: 'center',
          sortable: true,
          width: '110px'
        },
        {
          title: 'Valor Total',
          key: 'valorTotal',
          align: 'center',
          sortable: true,
          width: '120px'
        },
        {
          title: 'Stock (Ant ➔ Nvo)',
          key: 'stockAnterior',
          align: 'center',
          sortable: true,
          width: '135px'
        },
        {
          title: 'Usuario',
          key: 'usuarioRegistro',
          align: 'center',
          sortable: true,
          width: '110px'
        },
        {
          title: 'Detalle',
          key: 'actions',
          align: 'center',
          sortable: false,
          width: '70px'
        }
      ]
    })

    const filters = reactive({
      fechaDesde: null,
      fechaHasta: null,
      tipoMovimiento: null,
      idBodega: null,
      categoria: null,
      subCategoria: null,
      tipoOperacion: null // 'Entrada', 'Salida'
    })

    const operacionesOptions = [
      { title: 'Todas', value: null },
      { title: 'Entradas (+)', value: 'Entrada' },
      { title: 'Salidas (-)', value: 'Salida' }
    ]

    const detalleModal = reactive({
      show: false,
      loading: false,
      movimiento: null
    })

    // Helper functions
    const formatCurrency = (val) => {
      if (
        val === null ||
        val === undefined ||
        isNaN(val)
      )
        return 'C$ 0.00'
      return `C$ ${Number(val).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const formatDate = (val) => {
      if (!val) return '- - -'
      const date = new Date(val)
      if (isNaN(date.getTime())) return val
      return date.toLocaleDateString('es-NI', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }

    const formatTime = (val) => {
      if (!val) return ''
      const date = new Date(val)
      if (isNaN(date.getTime())) return ''
      return date.toLocaleTimeString('es-NI', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const setStyle = ({ index }) => {
      return {
        class:
          index % 2 === 0
            ? 'bg-white'
            : 'bg-indigo-lighten-5'
      }
    }

    const getTipoMovColor = (tipo) => {
      if (!tipo) return 'grey-darken-1'
      const upper = tipo.toUpperCase()
      if (upper.includes('VENTA'))
        return 'deep-orange-darken-2'
      if (upper.includes('COMPRA'))
        return 'green-darken-2'
      if (upper.includes('TRASLADO'))
        return 'blue-darken-2'
      if (
        upper.includes('ASIGNACION') ||
        upper.includes('ASIGNACIÓN')
      )
        return 'indigo-darken-2'
      if (upper.includes('AJUSTE'))
        return 'purple-darken-2'
      if (upper.includes('CARGA'))
        return 'amber-darken-3'
      if (
        upper.includes('ANULACION') ||
        upper.includes('ANULACIÓN')
      )
        return 'red-darken-3'
      return 'grey-darken-2'
    }

    // Set Default Dates (Month)
    const setDefaultDateMonth = () => {
      const now = new Date()
      const firstDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
      const lastDay = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      )
      filters.fechaDesde = firstDay
        .toISOString()
        .split('T')[0]
      filters.fechaHasta = lastDay
        .toISOString()
        .split('T')[0]
    }

    const onQuickDateChange = (val) => {
      const now = new Date()
      if (val === 'today') {
        const todayStr = now
          .toISOString()
          .split('T')[0]
        filters.fechaDesde = todayStr
        filters.fechaHasta = todayStr
      } else if (val === 'week') {
        const firstDayOfWeek = new Date(now)
        const day = now.getDay() || 7
        if (day !== 1)
          firstDayOfWeek.setHours(-24 * (day - 1))
        filters.fechaDesde = firstDayOfWeek
          .toISOString()
          .split('T')[0]
        filters.fechaHasta = now
          .toISOString()
          .split('T')[0]
      } else if (val === 'month') {
        setDefaultDateMonth()
      } else if (val === 'all') {
        filters.fechaDesde = null
        filters.fechaHasta = null
      }
      loadKardexData()
    }

    // Load Kardex Data from Backend
    const loadKardexData = async () => {
      data.loading = true
      try {
        const params = {}
        if (filters.fechaDesde)
          params.fechaDesde = filters.fechaDesde
        if (filters.fechaHasta)
          params.fechaHasta = filters.fechaHasta

        const res =
          await requestHttp.getKardex(params)
        if (
          res &&
          res.code === 200 &&
          Array.isArray(res.data)
        ) {
          data.kardexItems = res.data.map(
            (item) => ({
              ...item,
              valorTotal:
                item.valorTotal ??
                Math.abs(
                  Number(item.cantidad || 0)
                ) *
                  Number(item.costoUnitario || 0)
            })
          )
        } else {
          data.kardexItems = []
        }
      } catch (err) {
        console.error(
          'Error loading Kardex data:',
          err
        )
        data.kardexItems = []
      } finally {
        data.loading = false
      }
    }

    // Load Bodegas for Combobox
    const loadBodegas = async () => {
      try {
        const res =
          await requestHttp.getBodegasCombobox()
        if (
          res &&
          res.code === 200 &&
          Array.isArray(res.data)
        ) {
          data.bodegas = res.data
        }
      } catch (err) {
        console.error(
          'Error loading bodegas:',
          err
        )
      }
    }

    // Dropdown computed options
    const bodegasOptions = computed(() => {
      const items = [
        { title: 'Todas', value: null }
      ]
      data.bodegas.forEach((b) => {
        const id = b.idBodega || b.id
        const label = b.codigo
          ? `[${b.codigo}] ${b.nombre}`
          : b.nombre
        items.push({ title: label, value: id })
      })
      return items
    })

    const tiposMovOptions = computed(() => {
      const set = new Set()
      data.kardexItems.forEach((item) => {
        if (item.tipoMovimiento)
          set.add(item.tipoMovimiento)
      })
      const items = [
        { title: 'Todos', value: null }
      ]
      Array.from(set)
        .sort()
        .forEach((t) => {
          items.push({ title: t, value: t })
        })
      return items
    })

    const categoriasOptions = computed(() => {
      const set = new Set()
      data.kardexItems.forEach((item) => {
        if (item.categoria)
          set.add(item.categoria)
      })
      const items = [
        { title: 'Todas', value: null }
      ]
      Array.from(set)
        .sort()
        .forEach((c) => {
          items.push({ title: c, value: c })
        })
      return items
    })

    const subCategoriasOptions = computed(() => {
      const set = new Set()
      data.kardexItems.forEach((item) => {
        if (item.subCategoria)
          set.add(item.subCategoria)
      })
      const items = [
        { title: 'Todas', value: null }
      ]
      Array.from(set)
        .sort()
        .forEach((s) => {
          items.push({ title: s, value: s })
        })
      return items
    })

    // Filtered Items
    const filteredItems = computed(() => {
      return data.kardexItems.filter((item) => {
        // Tipo Movimiento
        if (
          filters.tipoMovimiento &&
          item.tipoMovimiento !==
            filters.tipoMovimiento
        ) {
          return false
        }

        // Bodega
        if (
          filters.idBodega !== null &&
          filters.idBodega !== undefined
        ) {
          if (item.idBodega !== filters.idBodega)
            return false
        }

        // Categoría
        if (
          filters.categoria &&
          item.categoria !== filters.categoria
        ) {
          return false
        }

        // Subcategoría
        if (
          filters.subCategoria &&
          item.subCategoria !==
            filters.subCategoria
        ) {
          return false
        }

        // Operación (Entrada / Salida)
        if (filters.tipoOperacion) {
          const esEntrada =
            Number(item.cantidad || 0) >= 0
          if (
            filters.tipoOperacion === 'Entrada' &&
            !esEntrada
          )
            return false
          if (
            filters.tipoOperacion === 'Salida' &&
            esEntrada
          )
            return false
        }

        return true
      })
    })

    // Recalculated KPI Metrics
    const metrics = computed(() => {
      const items = filteredItems.value
      let totalUnidadesEntrada = 0
      let totalValorEntrada = 0
      let totalUnidadesSalida = 0
      let totalValorSalida = 0

      items.forEach((item) => {
        const qty = Number(item.cantidad || 0)
        const cost = Number(
          item.costoUnitario || 0
        )
        const total =
          item.valorTotal ?? Math.abs(qty) * cost

        if (qty >= 0) {
          totalUnidadesEntrada += qty
          totalValorEntrada += total
        } else {
          totalUnidadesSalida += Math.abs(qty)
          totalValorSalida += total
        }
      })

      return {
        totalMovimientos: items.length,
        totalUnidadesEntrada,
        totalValorEntrada,
        totalUnidadesSalida,
        totalValorSalida,
        variacionNeta:
          totalUnidadesEntrada -
          totalUnidadesSalida
      }
    })

    // Open detail of specific movement
    const openDetalleMovimiento = async (
      idMovInventario
    ) => {
      if (!idMovInventario) return
      detalleModal.loading = true
      detalleModal.movimiento = null
      detalleModal.show = true
      try {
        const res =
          await requestHttp.getKardexById(
            idMovInventario
          )
        if (res && res.code === 200 && res.data) {
          detalleModal.movimiento = res.data
        } else {
          // Fallback to grouping from local kardex items
          const itemsOfMov =
            data.kardexItems.filter(
              (k) =>
                k.idMovInventario ===
                idMovInventario
            )
          if (itemsOfMov.length > 0) {
            const first = itemsOfMov[0]
            detalleModal.movimiento = {
              idMovInventario:
                first.idMovInventario,
              tipoMovimiento:
                first.tipoMovimiento,
              referencia: first.referencia,
              fechaRegistro: first.fechaRegistro,
              usuarioRegistro:
                first.usuarioRegistro,
              detalles: itemsOfMov
            }
          }
        }
      } catch (err) {
        console.error(
          'Error fetching movement detail:',
          err
        )
      } finally {
        detalleModal.loading = false
      }
    }

    // Export to Excel
    const exportToExcel = async () => {
      const items = filteredItems.value
      if (items.length === 0) {
        alert(
          'No hay datos en el Kardex para exportar con los filtros seleccionados.'
        )
        return
      }

      data.overlay.show = true
      try {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet(
          'Kardex de Inventario'
        )

        // Title Row
        worksheet.mergeCells('A1:L1')
        const titleCell = worksheet.getCell('A1')
        titleCell.value =
          'REPORTE DE KARDEX DE INVENTARIO'
        titleCell.font = {
          name: 'Arial',
          size: 14,
          bold: true,
          color: { argb: 'FFFFFFFF' }
        }
        titleCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1A237E' }
        }
        titleCell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        }
        worksheet.getRow(1).height = 30

        // Subtitle Row
        const today = new Date()
        const dateStr =
          today.toLocaleString('es-NI')
        const periodStr =
          filters.fechaDesde && filters.fechaHasta
            ? `Período: ${filters.fechaDesde} al ${filters.fechaHasta}`
            : 'Período: Histórico Completo'
        worksheet.mergeCells('A2:L2')
        const subCell = worksheet.getCell('A2')
        subCell.value = `Generado el: ${dateStr} | ${periodStr} | Total Movs: ${metrics.value.totalMovimientos} | Entradas: +${metrics.value.totalUnidadesEntrada} (${formatCurrency(metrics.value.totalValorEntrada)}) | Salidas: -${metrics.value.totalUnidadesSalida} (${formatCurrency(metrics.value.totalValorSalida)})`
        subCell.font = {
          name: 'Arial',
          size: 9,
          italic: true
        }
        subCell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        }
        worksheet.getRow(2).height = 20

        worksheet.addRow([])

        // Header Row
        const headers = [
          'Fecha / Hora',
          'Tipo Movimiento',
          'Referencia',
          'Producto',
          'Bodega',
          'Categoría',
          'Subcategoría',
          'Operación',
          'Cantidad',
          'Costo Unit.',
          'Valor Total',
          'Stock (Ant ➔ Nvo)',
          'Usuario'
        ]

        const headerRow =
          worksheet.addRow(headers)
        headerRow.height = 24
        headerRow.eachCell((cell) => {
          cell.font = {
            name: 'Arial',
            size: 10,
            bold: true,
            color: { argb: 'FFFFFFFF' }
          }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF283593' }
          }
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          }
        })

        // Data Rows
        items.forEach((item) => {
          const prodDisplay = item.productoCodigo
            ? `[${item.productoCodigo}] ${item.productoNombre}`
            : item.productoNombre || ''
          const stockFlow = `${item.stockAnterior} ➔ ${item.nuevoStock}`
          const row = worksheet.addRow([
            formatDate(item.fechaRegistro) +
              ' ' +
              formatTime(item.fechaRegistro),
            item.tipoMovimiento || '',
            item.referencia || '',
            prodDisplay,
            item.bodegaNombre || '',
            item.categoria || '',
            item.subCategoria || '',
            item.cantidad >= 0
              ? 'Entrada'
              : 'Salida',
            Number(item.cantidad || 0),
            Number(item.costoUnitario || 0),
            Number(item.valorTotal || 0),
            stockFlow,
            item.usuarioRegistro || ''
          ])

          row.height = 20
          row.getCell(1).alignment = {
            horizontal: 'center'
          }
          row.getCell(2).alignment = {
            horizontal: 'center'
          }
          row.getCell(3).alignment = {
            horizontal: 'center'
          }
          row.getCell(6).alignment = {
            horizontal: 'center'
          }
          row.getCell(7).alignment = {
            horizontal: 'center'
          }
          row.getCell(8).alignment = {
            horizontal: 'center'
          }
          row.getCell(9).alignment = {
            horizontal: 'right'
          }
          row.getCell(9).numFmt = '#,##0.00'
          row.getCell(10).numFmt = '"C$"#,##0.00'
          row.getCell(11).numFmt = '"C$"#,##0.00'
          row.getCell(12).alignment = {
            horizontal: 'center'
          }
          row.getCell(13).alignment = {
            horizontal: 'center'
          }
        })

        // Summary Row
        const totalRow = worksheet.addRow([
          'TOTALES',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          metrics.value.variacionNeta,
          '',
          metrics.value.totalValorEntrada +
            metrics.value.totalValorSalida,
          '',
          ''
        ])
        totalRow.height = 22
        totalRow.eachCell((cell) => {
          cell.font = {
            name: 'Arial',
            size: 10,
            bold: true
          }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE8EAF6' }
          }
        })
        totalRow.getCell(9).numFmt = '#,##0.00'
        totalRow.getCell(11).numFmt =
          '"C$"#,##0.00'

        // Adjust Column Widths
        worksheet.columns.forEach((col) => {
          let maxLength = 12
          col.eachCell(
            { includeEmpty: false },
            (cell) => {
              const valStr = cell.value
                ? cell.value.toString()
                : ''
              if (
                valStr.length > maxLength &&
                valStr.length < 50
              ) {
                maxLength = valStr.length
              }
            }
          )
          col.width = maxLength + 3
        })

        const buffer =
          await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        saveAs(
          blob,
          `Kardex_Inventario_${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.xlsx`
        )
      } catch (err) {
        console.error(
          'Error exporting to Excel:',
          err
        )
        alert(
          'Ocurrió un error al generar el archivo de Excel.'
        )
      } finally {
        data.overlay.show = false
      }
    }

    onMounted(async () => {
      setDefaultDateMonth()
      await Promise.all([
        loadKardexData(),
        loadBodegas()
      ])
    })

    return {
      data,
      filters,
      quickDateFilter,
      operacionesOptions,
      bodegasOptions,
      tiposMovOptions,
      categoriasOptions,
      subCategoriasOptions,
      filteredItems,
      metrics,
      detalleModal,
      formatCurrency,
      formatDate,
      formatTime,
      setStyle,
      getTipoMovColor,
      onQuickDateChange,
      loadKardexData,
      openDetalleMovimiento,
      exportToExcel
    }
  }
}
</script>

<style scoped>
.filter-select :deep(.v-field__input) {
  font-size: 0.78rem !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  min-height: 28px !important;
}

.filter-select :deep(.v-field) {
  font-size: 0.78rem !important;
}

.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.15);
}
</style>
