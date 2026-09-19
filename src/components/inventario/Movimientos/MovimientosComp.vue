<template>
  <div class="w-100">
    <!-- Encabezado y botón de agregar -->
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
              mdi-warehouse
            </v-icon>
            Administración de Stock por Bodega
          </div>
        </div>
      </template>

      <template v-slot:append>
        <v-btn
          color="indigo-darken-4"
          @click="openSelectProductDialog"
          variant="tonal"
          prepend-icon="mdi-warehouse-plus"
        >
          Nueva Asignación
        </v-btn>
      </template>

      <v-divider />

      <v-row class="pa-2" dense align="center">
        <v-col cols="12" md="6" sm="6">
          <v-text-field
            color="indigo"
            density="compact"
            variant="outlined"
            append-inner-icon="mdi-magnify"
            label="Buscar en stock..."
            v-model="data.search"
            hide-details
            placeholder="Código, producto, bodega, categoría, subcategoría..."
            clearable
            persistent-placeholder
            @click:clear="data.search = ''"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
          sm="6"
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
              Descargar Stock a Excel
            </v-tooltip>
          </v-btn>

          <v-btn
            class="mr-2"
            variant="text"
            color="indigo"
            @click="loadStockData"
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

    <!-- Tabla Principal de StockBodega -->
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

      <!-- Header Filtro Tipo Bodega -->
      <template v-slot:header.tipoBodegaNombre>
        <div
          class="text-caption font-weight-bold"
        >
          Tipo Bodega
        </div>
        <v-select
          v-model="filters.tipoBodega"
          variant="outlined"
          density="compact"
          :items="tiposBodegaOptions"
          hide-details
          clearable
          placeholder="Todos"
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

      <!-- Header Filtro Condición de Stock -->
      <template v-slot:header.cantidadTotal>
        <div
          class="text-caption font-weight-bold"
        >
          Stock Bodega
        </div>
        <v-select
          v-model="filters.stockFiltro"
          variant="outlined"
          density="compact"
          :items="stockFiltrosOptions"
          hide-details
          clearable
          placeholder="Todos"
          color="indigo"
          class="mt-1 filter-select"
        />
      </template>

      <!-- Header Filtro Estado -->
      <template v-slot:header.estado>
        <div
          class="text-caption font-weight-bold"
        >
          Estado
        </div>
        <v-select
          v-model="filters.estado"
          variant="outlined"
          density="compact"
          :items="estadosOptions"
          hide-details
          clearable
          placeholder="Todos"
          color="indigo"
          class="mt-1 filter-select"
        />
      </template>

      <!-- ITEM: Producto / Código Unificados -->
      <template v-slot:item.nombre="{ item }">
        <div class="py-1">
          <div class="d-flex align-center">
            <v-chip
              v-if="item.codigo"
              size="x-small"
              color="indigo-darken-3"
              variant="tonal"
              class="font-weight-bold me-2 flex-shrink-0"
            >
              {{ item.codigo }}
            </v-chip>
            <span
              class="font-weight-bold text-grey-darken-4 text-truncate"
              style="max-width: 250px"
            >
              {{ item.nombre }}
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
        <div class="d-flex align-center py-1">
          <v-avatar
            size="26"
            :color="
              item.tipoBodegaCodigo === 'CAM'
                ? 'amber-lighten-4'
                : 'indigo-lighten-4'
            "
            class="me-2 flex-shrink-0"
          >
            <v-icon
              size="15"
              :color="
                item.tipoBodegaCodigo === 'CAM'
                  ? 'amber-darken-4'
                  : 'indigo-darken-4'
              "
            >
              {{
                item.tipoBodegaCodigo === 'CAM'
                  ? 'mdi-truck-outline'
                  : 'mdi-store-outline'
              }}
            </v-icon>
          </v-avatar>
          <div>
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
              <span
                v-if="item.bodegaCodigo"
                class="font-weight-medium"
                >[{{ item.bodegaCodigo }}]</span
              >
              <span v-if="item.sucursalNombre">
                {{ item.sucursalNombre }}</span
              >
              <span v-if="item.placaCamion">
                Placa:
                {{ item.placaCamion }}</span
              >
            </div>
          </div>
        </div>
      </template>

      <!-- ITEM: Tipo Bodega -->
      <template v-slot:item.tipoBodegaNombre="{ item }">
        <span class="text-body-2 font-weight-medium text-grey-darken-3">
          {{ item.tipoBodegaNombre || (item.tipoBodegaCodigo === 'CAM' ? 'Camión' : 'Sucursal') }}
        </span>
      </template>

      <!-- ITEM: Categoría -->
      <template v-slot:item.categoria="{ item }">
        <span class="text-body-2 text-grey-darken-3 font-weight-medium">
          {{ item.categoria || 'Sin categoría' }}
        </span>
      </template>

      <!-- ITEM: Subcategoría -->
      <template v-slot:item.subCategoria="{ item }">
        <span class="text-body-2 text-grey-darken-2">
          {{ item.subCategoria || '-' }}
        </span>
      </template>

      <!-- ITEM: Costo -->
      <template v-slot:item.costo="{ item }">
        <div
          class="d-flex flex-column align-center py-1"
        >
          <span
            class="font-weight-medium text-grey-darken-3"
          >
            {{ formatCurrency(item.costo) }}
          </span>
          <span
            v-if="
              item.costo !== null &&
              item.costo !== undefined
            "
            class="text-caption text-indigo-darken-3 font-weight-bold"
            style="
              font-size: 0.72rem !important;
              line-height: 1;
            "
            title="Costo con IVA (15%)"
          >
            c/IVA:
            {{
              formatCurrency(item.costo * 1.15)
            }}
          </span>
        </div>
      </template>

      <!-- ITEM: Precio -->
      <template v-slot:item.precio="{ item }">
        <div
          class="font-weight-medium text-grey-darken-3"
        >
          {{ formatCurrency(item.precio) }}
        </div>
      </template>

      <!-- ITEM: Cantidad Total (Stock en Bodega) -->
      <template
        v-slot:item.cantidadTotal="{ item }"
      >
        <div
          class="d-flex flex-column align-center py-1"
        >
          <v-chip
            size="small"
            :color="getStockColor(item)"
            variant="flat"
            class="font-weight-bold text-white px-2"
          >
            <v-icon
              v-if="
                item.cantidadTotal <=
                (item.cantidadMinima || 0)
              "
              size="14"
              class="me-1"
            >
              mdi-alert-circle
            </v-icon>
            {{ item.cantidadTotal }}
            {{ item.unidadMedida || 'Und.' }}
          </v-chip>
          <div
            class="text-caption text-grey-darken-1 mt-0.5"
            style="
              font-size: 0.7rem !important;
              line-height: 1.1;
            "
          >
            <span
              >Mín:
              {{ item.cantidadMinima || 0 }}</span
            >
            <span class="mx-1">|</span>
            <span
              title="Stock total sumando todas las bodegas"
              >Global:
              {{
                item.cantidadTotalGeneral || 0
              }}</span
            >
          </div>
        </div>
      </template>

      <!-- ITEM: Total Costo Bodega -->
      <template
        v-slot:item.totalCostoBodega="{ item }"
      >
        <div
          class="font-weight-medium text-teal-darken-4"
        >
          {{
            formatCurrency(
              item.totalCostoBodega ??
                item.cantidadTotal *
                  (item.costo || 0)
            )
          }}
        </div>
      </template>

      <!-- ITEM: Total Venta Bodega -->
      <template
        v-slot:item.totalVentaBodega="{ item }"
      >
        <div
          class="font-weight-medium text-green-darken-4"
        >
          {{
            formatCurrency(
              item.totalVentaBodega ??
                item.cantidadTotal *
                  (item.precio || 0)
            )
          }}
        </div>
      </template>

      <!-- ITEM: Estado -->
      <template v-slot:item.estado="{ item }">
        <v-chip
          size="x-small"
          :color="
            item.estado
              ? 'green-darken-2'
              : 'grey-darken-1'
          "
          variant="flat"
          class="font-weight-bold text-white"
        >
          {{
            item.estado ? 'Activo' : 'Inactivo'
          }}
        </v-chip>
      </template>

      <!-- ITEM: Acciones / Opciones -->
      <template v-slot:item.actions="{ item }">
        <v-menu
          :close-on-content-click="true"
          location="right center"
          origin="auto"
        >
          <template v-slot:activator="{ props }">
            <v-tooltip
              text="Opciones"
              location="top"
            >
              <template
                v-slot:activator="{
                  props: tooltipProps
                }"
              >
                <v-btn
                  size="small"
                  icon
                  variant="text"
                  color="grey-darken-1"
                  v-bind="{
                    ...props,
                    ...tooltipProps
                  }"
                  class="hover-scale"
                >
                  <v-icon
                    >mdi-dots-vertical</v-icon
                  >
                </v-btn>
              </template>
            </v-tooltip>
          </template>

          <v-list
            nav
            rounded="lg"
            density="compact"
          >
            <v-list-subheader
              class="pa-1 text-caption text-grey"
            >
              Acciones de Stock
            </v-list-subheader>

            <!-- Asignar / Gestionar Bodegas -->
            <v-list-item
              rounded
              density="compact"
              prepend-icon="mdi-warehouse-plus"
              color="indigo"
              @click="openAsignarBodegasRow(item)"
            >
              <v-list-item-title
                class="font-weight-medium"
              >
                Asignar a Bodegas
              </v-list-item-title>
            </v-list-item>

            <!-- Ver Detalles del Producto -->
            <v-list-item
              rounded
              density="compact"
              prepend-icon="mdi-eye-outline"
              color="indigo"
              @click="openDetallesProducto(item)"
            >
              <v-list-item-title
                class="font-weight-medium"
              >
                Ver Detalles Producto
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <!-- Modal Seleccionar Producto para Asignar a Bodega (Botón Superior "Nueva Asignación") -->
    <v-dialog
      v-model="dialogSelectProduct"
      max-width="600"
      persistent
    >
      <v-card class="rounded-lg">
        <v-card-title
          class="d-flex align-center justify-space-between bg-indigo-darken-4 text-white py-3 px-4"
        >
          <div class="d-flex align-center">
            <v-avatar
              size="32"
              color="white"
              class="me-2"
            >
              <v-icon
                color="indigo-darken-4"
                size="20"
                >mdi-package-variant</v-icon
              >
            </v-avatar>
            <span
              class="text-subtitle-1 font-weight-bold"
              >Seleccionar Producto</span
            >
          </div>
          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            @click="dialogSelectProduct = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <div
            class="text-body-2 text-grey-darken-2 mb-3"
          >
            Seleccione el producto que desea
            asignar o agregar stock a una o
            múltiples bodegas:
          </div>

          <v-autocomplete
            v-model="selectedProductForAssign"
            :items="productosList"
            item-title="customLabel"
            item-value="idProducto"
            return-object
            variant="outlined"
            density="comfortable"
            label="Buscar Producto"
            placeholder="Escriba código o nombre del producto..."
            prepend-inner-icon="mdi-magnify"
            color="indigo"
            hide-details
            clearable
            :loading="loadingProductos"
          >
            <template
              v-slot:item="{ props, item }"
            >
              <v-list-item
                v-bind="props"
                density="compact"
              >
                <template v-slot:title>
                  <div
                    class="font-weight-bold text-body-2"
                  >
                    <v-chip
                      size="x-small"
                      color="indigo"
                      class="mr-2 font-weight-bold"
                    >
                      {{ item.raw.codigo }}
                    </v-chip>
                    {{ item.raw.nombre }}
                  </div>
                </template>
                <template v-slot:subtitle>
                  <div
                    class="text-caption text-grey"
                  >
                    {{ item.raw.categoria }} |
                    Costo:
                    {{
                      formatCurrency(
                        item.raw.costo
                      )
                    }}
                    | Stock Global:
                    {{
                      item.raw
                        .cantidadTotalGeneral ||
                      item.raw.cantidadTotal ||
                      0
                    }}
                  </div>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-card-text>

        <v-divider />

        <v-card-actions
          class="px-4 py-3 bg-grey-lighten-4 d-flex justify-end"
        >
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            @click="dialogSelectProduct = false"
            class="mr-2 text-none"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="indigo-darken-4"
            variant="elevated"
            :disabled="!selectedProductForAssign"
            @click="confirmSelectProductForAssign"
            prepend-icon="mdi-arrow-right-circle"
            class="text-none font-weight-bold"
          >
            Continuar a Asignación
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Componente Modal Asignar Bodegas -->
    <AsignarBodegasProducto
      :show="asignarBodegaModal.show"
      :producto="asignarBodegaModal.producto"
      @closeDialog="
        asignarBodegaModal.show = false
      "
      @asignado="onStockAsignado"
    />

    <!-- Componente Modal Detalles Producto -->
    <DetallesProducto
      :show="detallesModal.show"
      :producto="detallesModal.producto"
      @cerrarDialog="detallesModal.show = false"
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
import AsignarBodegasProducto from '@/components/inventario/Productos/modalsProductos/AsignarBodegasProducto.vue'
import DetallesProducto from '@/components/inventario/Productos/modalsProductos/DetallesProducto.vue'
import OverlayComp from '@/components/reutilizable/OverlayComp.vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export default {
  name: 'AdministracionStockBodega',

  components: {
    AsignarBodegasProducto,
    DetallesProducto,
    OverlayComp
  },

  setup() {
    const requestHttp = new RequestHttp()

    const data = reactive({
      loading: false,
      search: '',
      stockItems: [],
      bodegas: [],
      overlay: {
        show: false
      },
      headers: [
        {
          title: 'Opciones',
          key: 'actions',
          align: 'center',
          sortable: false,
          headerProps: {
            class: 'pa-0'
          },
          cellProps: {
            class: 'pa-0'
          }
        },
        {
          title: 'Tipo Bodega',
          key: 'tipoBodegaNombre',
          align: 'center',
          sortable: true,
          width: '130px'
        },
        {
          title: 'Bodega',
          key: 'bodegaNombre',
          align: 'start',
          sortable: true,
          minWidth: '180px'
        },
        {
          title: 'Categoría',
          key: 'categoria',
          align: 'center',
          sortable: true,
          width: '135px'
        },
        {
          title: 'Subcategoría',
          key: 'subCategoria',
          align: 'center',
          sortable: true,
          width: '135px'
        },
        {
          title: 'Producto',
          key: 'nombre',
          align: 'start',
          sortable: true,
          minWidth: '240px'
        },
        {
          title: 'Costo Unit.',
          key: 'costo',
          align: 'center',
          sortable: true,
          width: '115px'
        },
        {
          title: 'Precio Venta',
          key: 'precio',
          align: 'center',
          sortable: true,
          width: '115px'
        },
        {
          title: 'Stock Bodega',
          key: 'cantidadTotal',
          align: 'center',
          sortable: true,
          width: '140px'
        },
        {
          title: 'Valor Total',
          key: 'totalCostoBodega',
          align: 'center',
          sortable: true,
          width: '125px'
        }
      ]
    })

    const filters = reactive({
      idBodega: null,
      tipoBodega: null,
      categoria: null,
      subCategoria: null,
      stockFiltro: null, // 'CON_STOCK', 'SIN_STOCK', 'STOCK_BAJO'
      estado: null // true, false
    })

    const stockFiltrosOptions = [
      { title: 'Todos', value: null },
      {
        title: 'Con Stock (> 0)',
        value: 'CON_STOCK'
      },
      {
        title: 'Sin Stock (= 0)',
        value: 'SIN_STOCK'
      },
      {
        title: 'Stock Bajo (≤ Mínimo)',
        value: 'STOCK_BAJO'
      }
    ]

    const estadosOptions = [
      { title: 'Todos', value: null },
      { title: 'Activo', value: true },
      { title: 'Inactivo', value: false }
    ]

    // Modals
    const asignarBodegaModal = reactive({
      show: false,
      producto: null
    })

    const detallesModal = reactive({
      show: false,
      producto: null
    })

    const dialogSelectProduct = ref(false)
    const selectedProductForAssign = ref(null)
    const productosList = ref([])
    const loadingProductos = ref(false)

    const formatCurrency = (val) => {
      if (
        val === null ||
        val === undefined ||
        isNaN(val)
      )
        return 'C$ 0.00'
      return `C$ ${Number(val).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const setStyle = ({ index }) => {
      return {
        class:
          index % 2 === 0
            ? 'bg-white'
            : 'bg-indigo-lighten-5'
      }
    }

    const getStockColor = (item) => {
      const cantidad = Number(
        item.cantidadTotal || 0
      )
      const minima = Number(
        item.cantidadMinima || 0
      )

      if (cantidad <= 0) return 'red-darken-3'
      if (cantidad <= minima)
        return 'orange-darken-3'
      return 'green-darken-2'
    }

    // Load Stock Data from API
    const loadStockData = async () => {
      data.loading = true
      try {
        const res =
          await requestHttp.getStockBodegas()
        if (
          res &&
          res.code === 200 &&
          Array.isArray(res.data)
        ) {
          data.stockItems = res.data.map(
            (item) => ({
              ...item,
              totalCostoBodega:
                item.totalCostoBodega ??
                Number(item.cantidadTotal || 0) *
                  Number(item.costo || 0),
              totalVentaBodega:
                item.totalVentaBodega ??
                Number(item.cantidadTotal || 0) *
                  Number(item.precio || 0)
            })
          )
        } else {
          data.stockItems = []
        }
      } catch (err) {
        console.error(
          'Error loading stock bodegas:',
          err
        )
        data.stockItems = []
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

    // Dropdown options
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

    const tiposBodegaOptions = computed(() => {
      const set = new Set()
      data.stockItems.forEach((item) => {
        if (item.tipoBodegaNombre) {
          set.add(item.tipoBodegaNombre)
        } else if (
          item.tipoBodegaCodigo === 'CAM'
        ) {
          set.add('Camión')
        } else if (
          item.tipoBodegaCodigo === 'SUC'
        ) {
          set.add('Sucursal')
        }
      })
      const items = [
        { title: 'Todos', value: null }
      ]
      Array.from(set)
        .sort()
        .forEach((tipo) => {
          items.push({ title: tipo, value: tipo })
        })
      return items
    })

    const categoriasOptions = computed(() => {
      const set = new Set()
      data.stockItems.forEach((item) => {
        if (item.categoria)
          set.add(item.categoria)
      })
      const items = [
        { title: 'Todas', value: null }
      ]
      Array.from(set)
        .sort()
        .forEach((cat) => {
          items.push({ title: cat, value: cat })
        })
      return items
    })

    const subCategoriasOptions = computed(() => {
      const set = new Set()
      data.stockItems.forEach((item) => {
        if (item.subCategoria)
          set.add(item.subCategoria)
      })
      const items = [
        { title: 'Todas', value: null }
      ]
      Array.from(set)
        .sort()
        .forEach((sub) => {
          items.push({ title: sub, value: sub })
        })
      return items
    })

    // Filtered Items
    const filteredItems = computed(() => {
      return data.stockItems.filter((item) => {
        // Filtro Bodega
        if (
          filters.idBodega !== null &&
          filters.idBodega !== undefined
        ) {
          if (item.idBodega !== filters.idBodega)
            return false
        }

        // Filtro Tipo Bodega
        if (filters.tipoBodega) {
          const itemTipo =
            item.tipoBodegaNombre ||
            (item.tipoBodegaCodigo === 'CAM'
              ? 'Camión'
              : item.tipoBodegaCodigo === 'SUC'
                ? 'Sucursal'
                : '')
          if (itemTipo !== filters.tipoBodega)
            return false
        }

        // Filtro Categoría
        if (filters.categoria) {
          if (
            item.categoria !== filters.categoria
          )
            return false
        }

        // Filtro Subcategoría
        if (filters.subCategoria) {
          if (
            item.subCategoria !==
            filters.subCategoria
          )
            return false
        }

        // Filtro Condición Stock
        if (filters.stockFiltro) {
          const qty = Number(
            item.cantidadTotal || 0
          )
          const min = Number(
            item.cantidadMinima || 0
          )
          if (
            filters.stockFiltro === 'CON_STOCK' &&
            qty <= 0
          )
            return false
          if (
            filters.stockFiltro === 'SIN_STOCK' &&
            qty > 0
          )
            return false
          if (
            filters.stockFiltro ===
              'STOCK_BAJO' &&
            qty > min
          )
            return false
        }

        // Filtro Estado
        if (
          filters.estado !== null &&
          filters.estado !== undefined
        ) {
          if (
            Boolean(item.estado) !==
            Boolean(filters.estado)
          )
            return false
        }

        return true
      })
    })

    // KPI Metrics recalculated based on filtered items
    const metrics = computed(() => {
      const items = filteredItems.value
      let totalUnidades = 0
      let valorTotalCosto = 0
      let valorTotalVenta = 0
      let alertasStockBajo = 0

      items.forEach((item) => {
        const qty = Number(
          item.cantidadTotal || 0
        )
        const cost = Number(item.costo || 0)
        const price = Number(item.precio || 0)
        const min = Number(
          item.cantidadMinima || 0
        )

        totalUnidades += qty
        valorTotalCosto +=
          item.totalCostoBodega ?? qty * cost
        valorTotalVenta +=
          item.totalVentaBodega ?? qty * price

        if (qty <= min) {
          alertasStockBajo++
        }
      })

      return {
        totalRegistros: items.length,
        totalUnidades,
        valorTotalCosto,
        valorTotalVenta,
        alertasStockBajo
      }
    })

    // Action handlers
    const openAsignarBodegasRow = (item) => {
      asignarBodegaModal.producto = {
        idProducto: item.idProducto,
        codigo: item.codigo,
        nombre: item.nombre,
        categoria: item.categoria,
        subCategoria: item.subCategoria,
        unidadMedida: item.unidadMedida,
        costo: item.costo,
        precio: item.precio,
        cantidadTotalGeneral:
          item.cantidadTotalGeneral
      }
      asignarBodegaModal.show = true
    }

    const openDetallesProducto = (item) => {
      detallesModal.producto = {
        idProducto: item.idProducto,
        codigo: item.codigo,
        nombre: item.nombre,
        categoria: item.categoria,
        subCategoria: item.subCategoria,
        unidadMedida: item.unidadMedida,
        costo: item.costo,
        precio: item.precio,
        cantidadTotal:
          item.cantidadTotalGeneral ||
          item.cantidadTotal
      }
      detallesModal.show = true
    }

    const openSelectProductDialog = async () => {
      selectedProductForAssign.value = null
      dialogSelectProduct.value = true
      if (productosList.value.length === 0) {
        loadingProductos.value = true
        try {
          // Extraer productos únicos de la lista o llamar al endpoint de productos
          const res =
            await requestHttp.getProductos()
          if (
            res &&
            res.code === 200 &&
            Array.isArray(res.data)
          ) {
            productosList.value = res.data.map(
              (p) => ({
                ...p,
                customLabel: p.codigo
                  ? `[${p.codigo}] ${p.nombre}`
                  : p.nombre
              })
            )
          } else {
            // Fallback a productos únicos desde stockItems
            const mapProd = new Map()
            data.stockItems.forEach((s) => {
              if (!mapProd.has(s.idProducto)) {
                mapProd.set(s.idProducto, {
                  idProducto: s.idProducto,
                  codigo: s.codigo,
                  nombre: s.nombre,
                  categoria: s.categoria,
                  subCategoria: s.subCategoria,
                  unidadMedida: s.unidadMedida,
                  costo: s.costo,
                  precio: s.precio,
                  cantidadTotalGeneral:
                    s.cantidadTotalGeneral,
                  customLabel: `[${s.codigo}] ${s.nombre}`
                })
              }
            })
            productosList.value = Array.from(
              mapProd.values()
            )
          }
        } catch (err) {
          console.error(
            'Error fetching products list:',
            err
          )
        } finally {
          loadingProductos.value = false
        }
      }
    }

    const confirmSelectProductForAssign = () => {
      if (!selectedProductForAssign.value) return
      dialogSelectProduct.value = false
      asignarBodegaModal.producto =
        selectedProductForAssign.value
      asignarBodegaModal.show = true
    }

    const onStockAsignado = () => {
      loadStockData()
    }

    // Export to Excel
    const exportToExcel = async () => {
      const items = filteredItems.value
      if (items.length === 0) {
        alert(
          'No hay datos para exportar con los filtros seleccionados.'
        )
        return
      }

      data.overlay.show = true
      try {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet(
          'Stock por Bodega'
        )

        // Title Row
        worksheet.mergeCells('A1:K1')
        const titleCell = worksheet.getCell('A1')
        titleCell.value =
          'REPORTE DE ADMINISTRACIÓN DE STOCK POR BODEGA'
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

        // Subtitle / Date Row
        const today = new Date()
        const dateStr =
          today.toLocaleString('es-NI')
        worksheet.mergeCells('A2:K2')
        const subCell = worksheet.getCell('A2')
        subCell.value = `Generado el: ${dateStr} | Total Registros: ${metrics.value.totalRegistros} | Total Unidades: ${metrics.value.totalUnidades} | Costo Total: ${formatCurrency(metrics.value.valorTotalCosto)} | Venta Total: ${formatCurrency(metrics.value.valorTotalVenta)}`
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
          'Producto',
          'Bodega',
          'Tipo Bodega',
          'Categoría',
          'Subcategoría',
          'Costo Unit.',
          'Precio Venta',
          'Stock Bodega',
          'Total Costo',
          'Total Venta',
          'Estado'
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
          const prodDisplay = item.codigo
            ? `[${item.codigo}] ${item.nombre}`
            : item.nombre || ''
          const row = worksheet.addRow([
            prodDisplay,
            item.bodegaNombre || '',
            item.tipoBodegaNombre || '',
            item.categoria || '',
            item.subCategoria || '',
            Number(item.costo || 0),
            Number(item.precio || 0),
            Number(item.cantidadTotal || 0),
            Number(item.totalCostoBodega || 0),
            Number(item.totalVentaBodega || 0),
            item.estado ? 'Activo' : 'Inactivo'
          ])

          row.height = 20
          row.getCell(1).alignment = {
            horizontal: 'left'
          }
          row.getCell(3).alignment = {
            horizontal: 'center'
          }
          row.getCell(4).alignment = {
            horizontal: 'center'
          }
          row.getCell(5).alignment = {
            horizontal: 'center'
          }
          row.getCell(6).numFmt = '"C$"#,##0.00'
          row.getCell(7).numFmt = '"C$"#,##0.00'
          row.getCell(8).alignment = {
            horizontal: 'center'
          }
          row.getCell(8).numFmt = '#,##0.00'
          row.getCell(9).numFmt = '"C$"#,##0.00'
          row.getCell(10).numFmt = '"C$"#,##0.00'
          row.getCell(11).alignment = {
            horizontal: 'center'
          }
        })

        // Total Summary Row
        const totalRow = worksheet.addRow([
          'TOTALES',
          '',
          '',
          '',
          '',
          '',
          '',
          metrics.value.totalUnidades,
          metrics.value.valorTotalCosto,
          metrics.value.valorTotalVenta,
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
        totalRow.getCell(8).numFmt = '#,##0.00'
        totalRow.getCell(9).numFmt =
          '"C$"#,##0.00'
        totalRow.getCell(10).numFmt =
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
          `Stock_Bodegas_${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.xlsx`
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
      await Promise.all([
        loadStockData(),
        loadBodegas()
      ])
    })

    return {
      data,
      filters,
      stockFiltrosOptions,
      estadosOptions,
      bodegasOptions,
      tiposBodegaOptions,
      categoriasOptions,
      subCategoriasOptions,
      filteredItems,
      metrics,
      asignarBodegaModal,
      detallesModal,
      dialogSelectProduct,
      selectedProductForAssign,
      productosList,
      loadingProductos,
      formatCurrency,
      setStyle,
      getStockColor,
      loadStockData,
      openAsignarBodegasRow,
      openDetallesProducto,
      openSelectProductDialog,
      confirmSelectProductForAssign,
      onStockAsignado,
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

.border-error {
  border: 1px solid #e53935 !important;
}
</style>