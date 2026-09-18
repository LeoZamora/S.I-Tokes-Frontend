<template>
  <div class="w-100">
    <!-- Vista Principal: Tabla de Órdenes de Compra -->
    <div v-if="!data.compra.show">
      <!-- Encabezado y botón de agregar -->
      <v-card class="border-t border-b" elevation="0" rounded="0">
      <!-- Encabezado -->
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <div class="text-h6 font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="indigo">
              mdi-cart-arrow-down
            </v-icon>
            Órdenes de Compra
          </div>
        </div>
      </template>

      <template v-slot:append>
        <v-btn
          v-if="data.crud.create"
          color="indigo-darken-4"
          @click="createOrden()"
          variant="tonal"
          prepend-icon="mdi-plus"
          class="rounded font-weight-bold"
        >
          Nueva Compra
        </v-btn>
      </template>

      <v-divider />

      <v-row class="pa-2" dense>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model="data.search"
            color="indigo"
            density="compact"
            variant="outlined"
            append-inner-icon="mdi-magnify"
            label="Buscar compras"
            placeholder="Buscar por orden, referencia, proveedor, usuario u observaciones..."
            persistent-placeholder
            hide-details
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
          class="d-flex justify-end align-center"
        >
          <v-btn
            class="mr-2"
            variant="text"
            color="indigo"
            @click="loadData()"
            icon
            size="small"
          >
            <v-icon>mdi-refresh</v-icon>
            <v-tooltip location="top center" activator="parent">
              Actualizar
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Tabla de órdenes de compra -->
    <v-data-table
      class="border-t border-b font"
      density="compact"
      :headers="data.headers"
      :items="filteredOrdenes"
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

      <!-- Header Filtro Estado -->
      <template v-slot:header.estado>
        <div>Estado</div>
        <v-autocomplete
          v-model="filters.estado"
          variant="outlined"
          density="compact"
          :items="estadosOptions"
          hide-details
          clearable
          placeholder="Todos"
          color="indigo"
          class="mt-1"
        >
        </v-autocomplete>
      </template>

      <!-- Columna de Acciones (Opciones) -->
      <template v-slot:item.actions="{ item }">
        <v-menu
          :close-on-content-click="false"
          location="right center"
          origin="auto"
        >
          <template v-slot:activator="{ props }">
            <v-tooltip text="Opciones" location="top">
              <template v-slot:activator="{ props: tooltipProps }">
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
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </template>

          <v-list density="compact" rounded="lg" class="py-1">
            <v-list-item
              density="compact"
              @click="viewOrden(item)"
              prepend-icon="mdi-eye"
            >
              <v-list-item-title class="text-caption font-weight-medium">
                Ver Compra
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              density="compact"
              @click="verMovimientoInventario(item)"
              prepend-icon="mdi-swap-horizontal-bold"
              class="text-indigo-darken-3"
            >
              <v-list-item-title class="text-caption font-weight-medium">
                Ver Mov. Inventario
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              v-if="hasAccessToFunct('33')"
              density="compact"
              @click="editOrden(item)"
              prepend-icon="mdi-pencil"
            >
              <v-list-item-title class="text-caption font-weight-medium">
                Editar Compra
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              v-if="data.crud.delete"
              density="compact"
              @click="showAlert(item)"
              prepend-icon="mdi-delete"
              class="text-error"
            >
              <v-list-item-title class="text-caption font-weight-medium text-error">
                Eliminar Compra
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <!-- Columna Nº Órden -->
      <template v-slot:item.noOrden="{ item }">
        <div class="font-weight-bold text-indigo-darken-4">
          {{ item.noOrden || `COMP-${item.idCompra}` }}
        </div>
      </template>

      <!-- Columna Referencia (Movimiento de Inventario) -->
      <template v-slot:item.referenciaMovInventario="{ item }">
        <v-btn
          v-if="item.referenciaMovInventario"
          size="small"
          variant="tonal"
          color="indigo-darken-3"
          class="font-weight-bold text-caption text-none px-2"
          @click.stop="verMovimientoInventario(item)"
        >
          <v-icon start size="x-small" color="indigo-darken-2">mdi-swap-horizontal-bold</v-icon>
          {{ item.referenciaMovInventario }}
          <v-tooltip activator="parent" location="top">
            Ver movimiento de inventario asociado
          </v-tooltip>
        </v-btn>
        <span v-else class="text-caption text-grey font-italic">
          Sin referencia
        </span>
      </template>

      <!-- Columna Proveedor -->
      <template v-slot:item.proveedor="{ item }">
        <div class="font-weight-bold text-grey-darken-3">
          {{ item.proveedor || 'Sin proveedor' }}
        </div>
      </template>

      <!-- Columna Registrado Por -->
      <template v-slot:item.usuarioRegistro="{ item }">
        <div class="d-flex align-center text-caption text-grey-darken-3">
          <v-icon size="x-small" color="grey" class="mr-1">mdi-account</v-icon>
          {{ item.usuarioRegistro || 'Sistema' }}
        </div>
      </template>

      <!-- Columna Fecha Registro -->
      <template v-slot:item.fechaRegistro="{ item }">
        <div class="text-caption font-weight-medium text-grey-darken-3">
          {{ formatedDate(item.fechaRegistro) }}
        </div>
      </template>

      <!-- Columna Total -->
      <template v-slot:item.total="{ item }">
        <div class="text-right">
          <div class="font-weight-bold text-indigo-darken-4 text-subtitle-2">
            {{ formatedCurrency(Number(item.total || 0) * 1.15) }}
          </div>
          <div class="text-caption text-grey font-weight-medium" style="font-size: 11px;">
            Neto: {{ formatedCurrency(item.total) }}
          </div>
        </div>
      </template>

      <!-- Columna Estado -->
      <template v-slot:item.estado="{ item }">
        <v-chip
          size="small"
          :color="item.estado ? 'success' : 'error'"
          variant="tonal"
          class="font-weight-bold"
        >
          {{ item.estado ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </template>

      <!-- Columna Observaciones -->
      <template v-slot:item.observaciones="{ item }">
        <div
          class="text-caption text-grey-darken-2 text-truncate"
          style="max-width: 240px;"
          :title="item.observaciones || ''"
        >
          {{ item.observaciones || '---' }}
        </div>
      </template>
    </v-data-table>
  </div>

      <!-- Vista Formulario Completo -->
      <div v-else class="w-100">
        <NuevaFacturaCompras
          :show="data.compra.show"
          :editar="data.compra.editar"
          :title="data.compra.title"
          :orden="data.compra.item"
          @closeDialog="closeDialog"
          @refreshTable="loadData()"
        />
      </div>

    <ViewOrdenes
      :show="data.viewOrden.show"
      :orden="data.viewOrden.item"
      @closeDialog="closeDialog"
    />

    <ViewMovimientoInventario
      :show="data.viewMovimiento.show"
      :compra-id="data.viewMovimiento.compraId"
      :referencia="data.viewMovimiento.referencia"
      @closeDialog="closeDialog"
    />

    <AlertComp
      :show="data.viewAlert"
      @deleteItem="deleteAction"
    />
  </div>
</template>

<script>
import { formatters } from '@/helpers/formatters'
import AlertComp from '@/components/widgets/AlertaAction.vue'
import NuevaFacturaCompras from './dialogsCompras/NuevaFacturaCompras.vue'
import ViewOrdenes from './dialogsCompras/ViewOrdenes.vue'
import ViewMovimientoInventario from './dialogsCompras/ViewMovimientoInventario.vue'
import RequestHttp from '@/services/requestHttp'
import { useStore } from '@/store'
import { hasAccessToFunct } from '@/scripts/Seguridad'

export default {
  name: 'FacturacionCompras',

  components: {
    NuevaFacturaCompras,
    ViewOrdenes,
    ViewMovimientoInventario,
    AlertComp
  },

  data() {
    return {
      store: useStore(),
      requestHttp: new RequestHttp(),

      filters: {
        estado: null
      },

      data: {
        headers: [
          {
            title: 'Opciones',
            key: 'actions',
            align: 'center',
            sortable: false,
            width: '80px'
          },
          {
            title: 'Nº Órden',
            key: 'noOrden',
            align: 'start'
          },
          {
            title: 'Movimiento Inventario',
            key: 'referenciaMovInventario',
            align: 'start'
          },
          {
            title: 'Proveedor',
            key: 'proveedor',
            align: 'start'
          },
          {
            title: 'Registrado Por',
            key: 'usuarioRegistro',
            align: 'start'
          },
          {
            title: 'Fecha Registro',
            key: 'fechaRegistro',
            align: 'center'
          },
          {
            title: 'Total',
            key: 'total',
            align: 'end'
          },
          {
            title: 'Estado',
            key: 'estado',
            align: 'center'
          },
          {
            title: 'Observaciones',
            key: 'observaciones',
            align: 'start'
          }
        ],

        ordenes: [],
        compra: {
          show: false,
          editar: false,
          item: {},
          title: ''
        },
        loading: false,
        selectedItem: null,
        viewAlert: false,
        search: '',
        crud: {
          create: false,
          view: false,
          edit: false,
          delete: false
        },
        viewOrden: {
          show: false,
          item: {}
        },
        viewMovimiento: {
          show: false,
          compraId: null,
          referencia: ''
        }
      }
    }
  },

  computed: {
    estadosOptions() {
      return [
        { title: 'Activos', value: true },
        { title: 'Inactivos', value: false }
      ]
    },

    filteredOrdenes() {
      let list = [...this.data.ordenes]

      // Filtro por Estado
      if (this.filters.estado !== null && this.filters.estado !== undefined) {
        list = list.filter((item) => item.estado === this.filters.estado)
      }

      // Búsqueda general
      if (this.data.search) {
        const s = this.data.search.toLowerCase().trim()
        list = list.filter((item) => {
          return (
            (item.noOrden && item.noOrden.toLowerCase().includes(s)) ||
            (item.referenciaMovInventario && item.referenciaMovInventario.toLowerCase().includes(s)) ||
            (item.proveedor && item.proveedor.toLowerCase().includes(s)) ||
            (item.usuarioRegistro && item.usuarioRegistro.toLowerCase().includes(s)) ||
            (item.observaciones && item.observaciones.toLowerCase().includes(s))
          )
        })
      }

      return list.sort((a, b) => (b.idCompra || 0) - (a.idCompra || 0))
    }
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.loadData()
      vm.verifyDataSecurity()
    })
  },

  methods: {
    hasAccessToFunct,

    setStyle({ index }) {
      return {
        class: index % 2 === 0 ? 'bg-white' : 'bg-indigo-lighten-5'
      }
    },

    verifyDataSecurity() {
      const token = this.store.getInfoUser()
      if (token && token.permisos) {
        const permisos = token.permisos.split(',')
        permisos.forEach((item) => {
          switch (item) {
            case '71':
              this.data.crud.view = true
              break
            case '72':
              this.data.crud.create = true
              break
            case '73':
              this.data.crud.edit = true
              break
            case '74':
              this.data.crud.delete = true
              break
          }
        })
      } else {
        this.data.crud.create = true
        this.data.crud.view = true
        this.data.crud.edit = true
      }
    },

    async loadData() {
      await this.getOrdenes()
    },

    async getOrdenes() {
      this.data.loading = true
      try {
        const result = await this.requestHttp.getCompras()
        if (Array.isArray(result)) {
          this.data.ordenes = result
        } else if (result && Array.isArray(result.data)) {
          this.data.ordenes = result.data
        } else {
          this.data.ordenes = []
        }
      } catch (error) {
        console.error('Error al obtener compras:', error)
        this.data.ordenes = []
      } finally {
        this.data.loading = false
      }
    },

    editOrden(item) {
      this.data.compra.show = true
      this.data.compra.editar = true
      this.data.compra.title = 'EDITAR ORDEN DE COMPRA'
      this.data.compra.item = item
    },

    viewOrden(item) {
      this.data.viewOrden.show = true
      this.data.viewOrden.item = item
    },

    verMovimientoInventario(item) {
      this.data.viewMovimiento.compraId = item.idCompra
      this.data.viewMovimiento.referencia = item.referenciaMovInventario || item.noOrden || ''
      this.data.viewMovimiento.show = true
    },

    createOrden() {
      this.data.compra.show = true
      this.data.compra.editar = false
      this.data.compra.item = {}
      this.data.compra.title = 'NUEVA ORDEN DE COMPRA'
    },

    formatedCurrency(key) {
      return formatters.formatCurrency(key || 0, 'NIO')
    },

    formatedDate(dataString) {
      if (!dataString) return '---'
      return formatters.formatDate(dataString)
    },

    deleteAction(val) {
      if (val === true) {
        this.deleteItem()
      }
      this.data.viewAlert = false
    },

    showAlert(item) {
      this.data.viewAlert = true
      this.data.selectedItem = item
    },

    async deleteItem() {
      if (!this.data.selectedItem?.idCompra) return
      try {
        const result = await this.requestHttp.deleteCompra(
          this.data.selectedItem.idCompra
        )
        if (result !== null) {
          this.loadData()
        }
      } catch (err) {
        console.error('Error al eliminar compra:', err)
      }
    },

    closeDialog() {
      this.data.compra.show = false
      this.data.viewOrden.show = false
      this.data.viewMovimiento.show = false
      this.data.compra.editar = false
      this.data.compra.title = ''
    }
  }
}
</script>

<style scoped>
.font {
  font-size: 12px !important;
}

.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.15);
}
</style>