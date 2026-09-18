<template>
  <v-dialog v-model="localShow" max-width="950" persistent>
    <v-card class="rounded-lg" elevation="10">
      <!-- Header con gradiente -->
      <v-card-title class="d-flex align-center bg-indigo-darken-4 text-white pa-4">
        <v-avatar size="44" color="white" class="mr-3" variant="flat">
          <v-icon color="indigo-darken-4" size="26">mdi-swap-horizontal-bold</v-icon>
        </v-avatar>
        <div class="text-white">
          <h6 class="font-weight-bold text-h6 mb-0">MOVIMIENTO DE INVENTARIO</h6>
          <div class="text-subtitle-2 text-indigo-lighten-4">
            Referencia: <span class="font-weight-bold">{{ movimiento.referencia || referencia || '---' }}</span>
          </div>
        </div>
        <v-spacer />
        <v-btn icon color="white" variant="text" @click="closeDialog()" size="small" class="ml-2">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-4 bg-grey-lighten-4">
        <!-- Tarjeta de Resumen -->
        <v-card color="white" class="px-4 py-3 mb-3 rounded-lg border" elevation="0">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-caption font-weight-bold text-indigo-darken-4 text-uppercase">
              <v-icon size="small" class="mr-1">mdi-information-outline</v-icon>
              Datos del Movimiento
            </span>
            <v-chip size="small" color="indigo" variant="tonal" class="font-weight-bold">
              Tipo: {{ movimiento.idTipoMovimiento || 'Compra' }}
            </v-chip>
          </div>
          <v-divider class="mb-3" />

          <v-row dense>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-grey-darken-1 font-weight-medium">Nº Órden Compra:</div>
              <div class="text-subtitle-2 font-weight-bold text-indigo-darken-4">
                {{ movimiento.noOrden || '---' }}
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-grey-darken-1 font-weight-medium">ID Movimiento:</div>
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                #{{ movimiento.idMovInventario || '---' }}
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-grey-darken-1 font-weight-medium">Registrado Por:</div>
              <div class="text-subtitle-2 text-grey-darken-3 d-flex align-center">
                <v-icon size="x-small" color="grey" class="mr-1">mdi-account</v-icon>
                {{ movimiento.usuarioRegistro || 'Sistema' }}
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-grey-darken-1 font-weight-medium">Fecha Registro:</div>
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                {{ formatedDate(movimiento.fechaRegistro) }}
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Tabla de Detalles de Movimiento de Inventario -->
        <v-card variant="flat" class="rounded-lg overflow-hidden border" elevation="0">
          <v-card-title class="px-4 py-2 d-flex align-center" style="background-color: #e8eaf6;">
            <v-icon color="indigo-darken-3" class="mr-2">mdi-package-variant-closed</v-icon>
            <span class="text-subtitle-1 font-weight-bold text-indigo-darken-4">
              ENTRADAS DE PRODUCTOS A BODEGA ({{ detalles.length }})
            </span>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="detalles"
            :loading="loading"
            density="compact"
            hide-default-footer
            class="font-table"
            :header-props="{
              class: 'font-weight-bold text-uppercase bg-indigo-lighten-5'
            }"
            hover
          >
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@5" />
            </template>

            <!-- Bodega -->
            <template v-slot:item.bodega="{ item }">
              <div class="d-flex align-center py-1">
                <v-chip size="small" color="indigo-darken-3" variant="tonal" class="font-weight-medium">
                  <v-icon start size="x-small">mdi-warehouse</v-icon>
                  {{ item.bodegaNombre || item.bodegaCodigo || 'Bodega #' + item.idBodega }}
                </v-chip>
              </div>
            </template>

            <!-- Producto -->
            <template v-slot:item.producto="{ item }">
              <div class="py-1">
                <div class="font-weight-bold text-grey-darken-4">
                  {{ item.productoNombre || 'Producto #' + item.idProducto }}
                </div>
                <div v-if="item.productoCodigo" class="text-caption text-indigo-darken-2 font-weight-medium">
                  Cód: {{ item.productoCodigo }}
                </div>
              </div>
            </template>

            <!-- Cantidad Ingresada -->
            <template v-slot:item.cantidad="{ item }">
              <v-chip size="small" color="green-darken-3" variant="flat" class="font-weight-bold">
                <v-icon start size="x-small">mdi-plus</v-icon>
                {{ item.cantidad }}
              </v-chip>
            </template>

            <!-- Transición de Stock -->
            <template v-slot:item.stock="{ item }">
              <div class="d-flex align-center font-weight-medium text-caption">
                <span class="text-grey-darken-1">{{ item.stockAnterior ?? 0 }}</span>
                <v-icon size="small" color="indigo" class="mx-1">mdi-arrow-right</v-icon>
                <span class="text-green-darken-3 font-weight-bold">{{ item.nuevoStock ?? item.cantidad }}</span>
              </div>
            </template>

            <!-- Costo Unitario -->
            <template v-slot:item.costoUnitario="{ item }">
              <div class="font-weight-bold text-grey-darken-3">
                {{ formatedCurrency(item.costoUnitario) }}
              </div>
            </template>

            <!-- Subtotal -->
            <template v-slot:item.subtotal="{ item }">
              <div class="font-weight-bold text-indigo-darken-4">
                {{ formatedCurrency(item.cantidad * item.costoUnitario) }}
              </div>
            </template>

            <!-- Observaciones -->
            <template v-slot:item.observaciones="{ item }">
              <span class="text-caption text-grey-darken-1">
                {{ item.observaciones || '---' }}
              </span>
            </template>

            <!-- Empty State -->
            <template v-slot:no-data>
              <div class="text-center py-4 text-grey">
                <v-icon size="large" class="mb-1">mdi-alert-circle-outline</v-icon>
                <div>No se encontraron registros de movimiento de inventario.</div>
              </div>
            </template>
          </v-data-table>
        </v-card>

        <!-- Total general del movimiento -->
        <v-card color="white" class="px-4 py-2 mt-3 rounded-lg border d-flex justify-space-between align-center" elevation="0">
          <span class="text-subtitle-2 font-weight-bold text-grey-darken-2">
            TOTAL ENTRADAS MOVIMIENTO:
          </span>
          <span class="text-h6 font-weight-bold text-indigo-darken-4">
            {{ formatedCurrency(movimiento.totalDebitos || totalCalculado) }}
          </span>
        </v-card>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-3 bg-white">
        <v-spacer />
        <v-btn color="indigo-darken-4" variant="tonal" @click="closeDialog()" class="px-5 font-weight-bold">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatters } from '@/helpers/formatters'
import RequestHttp from '@/services/requestHttp'

export default {
  name: 'ViewMovimientoInventario',

  props: {
    show: {
      type: Boolean,
      required: true
    },
    compraId: {
      type: Number,
      default: null
    },
    referencia: {
      type: String,
      default: ''
    }
  },

  emits: ['closeDialog'],

  data() {
    return {
      requestHttp: new RequestHttp(),
      loading: false,
      movimiento: {},
      detalles: [],
      headers: [
        { title: 'Bodega Destino', key: 'bodega', align: 'start' },
        { title: 'Producto', key: 'producto', align: 'start' },
        { title: 'Cant. Ingresada', key: 'cantidad', align: 'center' },
        { title: 'Stock (Antes ➔ Después)', key: 'stock', align: 'center' },
        { title: 'Costo Unit.', key: 'costoUnitario', align: 'end' },
        { title: 'Total', key: 'subtotal', align: 'end' },
        { title: 'Observaciones', key: 'observaciones', align: 'start' }
      ]
    }
  },

  computed: {
    localShow: {
      get() {
        return this.show
      },
      set(val) {
        if (!val) {
          this.$emit('closeDialog')
        }
      }
    },

    totalCalculado() {
      return this.detalles.reduce(
        (sum, item) => sum + (Number(item.cantidad) * Number(item.costoUnitario) || 0),
        0
      )
    }
  },

  watch: {
    show(val) {
      if (val && this.compraId) {
        this.fetchMovimientoInventario(this.compraId)
      } else if (!val) {
        this.movimiento = {}
        this.detalles = []
      }
    }
  },

  methods: {
    async fetchMovimientoInventario(id) {
      this.loading = true
      try {
        const res = await this.requestHttp.getCompraMovimientoInventario(id)
        if (res.code === 200 && res.data) {
          this.movimiento = res.data
          this.detalles = res.data.detalles || []
        } else {
          this.movimiento = {}
          this.detalles = []
        }
      } catch (err) {
        console.error('Error al cargar movimiento de inventario:', err)
        this.movimiento = {}
        this.detalles = []
      } finally {
        this.loading = false
      }
    },

    formatedCurrency(val) {
      return formatters.formatCurrency(val || 0, 'NIO')
    },

    formatedDate(dateStr) {
      if (!dateStr) return '---'
      return formatters.formatDate(dateStr)
    },

    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>
.font-table {
  font-size: 12px !important;
}
</style>
