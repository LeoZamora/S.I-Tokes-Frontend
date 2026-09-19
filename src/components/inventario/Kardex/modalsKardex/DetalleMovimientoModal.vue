<template>
  <v-dialog
    :model-value="show"
    @update:model-value="$emit('closeDialog')"
    max-width="950"
    scrollable
    persistent
  >
    <v-card class="rounded-lg">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between bg-indigo-darken-4 text-white py-3 px-4">
        <div class="d-flex align-center">
          <v-avatar size="32" color="white" class="me-2">
            <v-icon color="indigo-darken-4" size="20">mdi-clipboard-text-clock-outline</v-icon>
          </v-avatar>
          <div>
            <span class="text-subtitle-1 font-weight-bold">Detalle del Movimiento de Inventario</span>
            <div class="text-caption text-indigo-lighten-4" v-if="movimiento">
              Referencia: {{ movimiento.referencia || 'N/A' }} | ID: #{{ movimiento.idMovInventario }}
            </div>
          </div>
        </div>
        <v-btn icon size="small" variant="text" color="white" @click="$emit('closeDialog')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <!-- Body / Content -->
      <v-card-text class="pa-4" style="max-height: 70vh;">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="indigo" size="40" />
          <div class="text-caption text-grey mt-2">Cargando detalles del movimiento...</div>
        </div>

        <template v-else-if="movimiento">
          <!-- Summary Info Cards -->
          <v-row dense class="mb-3">
            <v-col cols="12" sm="6" md="3">
              <v-card variant="outlined" class="pa-2 rounded-lg bg-grey-lighten-5">
                <div class="text-caption text-grey font-weight-medium">Tipo Movimiento</div>
                <div class="mt-1">
                  <v-chip
                    size="small"
                    :color="getTipoMovColor(movimiento.tipoMovimiento)"
                    variant="flat"
                    class="font-weight-bold text-white"
                  >
                    {{ movimiento.tipoMovimiento }}
                  </v-chip>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card variant="outlined" class="pa-2 rounded-lg bg-grey-lighten-5">
                <div class="text-caption text-grey font-weight-medium">Referencia</div>
                <div class="text-body-2 font-weight-bold text-indigo-darken-4 mt-1">
                  {{ movimiento.referencia || '- - -' }}
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card variant="outlined" class="pa-2 rounded-lg bg-grey-lighten-5">
                <div class="text-caption text-grey font-weight-medium">Fecha y Hora</div>
                <div class="text-body-2 font-weight-medium text-grey-darken-3 mt-1">
                  {{ formatDate(movimiento.fechaRegistro) }}
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card variant="outlined" class="pa-2 rounded-lg bg-grey-lighten-5">
                <div class="text-caption text-grey font-weight-medium">Registrado Por</div>
                <div class="text-body-2 font-weight-bold text-grey-darken-3 mt-1">
                  <v-icon size="14" color="grey" class="me-1">mdi-account-outline</v-icon>
                  {{ movimiento.usuarioRegistro || 'Sistema' }}
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Table of items in this movement -->
          <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-2 d-flex align-center">
            <v-icon size="18" color="indigo" class="me-1">mdi-format-list-bulleted</v-icon>
            Artículos Afectados ({{ movimiento.detalles ? movimiento.detalles.length : 0 }})
          </div>

          <v-table density="compact" class="border rounded-lg">
            <thead class="bg-indigo-lighten-5 font-weight-bold">
              <tr>
                <th class="text-center" style="width: 40px;">#</th>
                <th class="text-start">Producto</th>
                <th class="text-start">Bodega</th>
                <th class="text-center" style="width: 100px;">Operación</th>
                <th class="text-center" style="width: 90px;">Cantidad</th>
                <th class="text-center" style="width: 110px;">Costo Unit.</th>
                <th class="text-center" style="width: 110px;">Total Costo</th>
                <th class="text-center" style="width: 150px;">Stock (Ant ➔ Nvo)</th>
                <th class="text-start" style="width: 140px;">Observación</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in movimiento.detalles" :key="item.idDetalleMovInventario || idx">
                <td class="text-center text-caption font-weight-bold text-grey">
                  {{ idx + 1 }}
                </td>
                <td>
                  <div class="py-1">
                    <div class="d-flex align-center">
                      <v-chip size="x-small" color="indigo-darken-3" variant="tonal" class="me-1 font-weight-bold">
                        {{ item.productoCodigo }}
                      </v-chip>
                      <span class="font-weight-medium text-body-2 text-truncate" style="max-width: 220px;">
                        {{ item.productoNombre }}
                      </span>
                    </div>
                    <div class="text-caption text-grey" style="font-size: 0.72rem !important;">
                      {{ item.categoria }} <span v-if="item.subCategoria">/ {{ item.subCategoria }}</span>
                      <span v-if="item.unidadMedida" class="ms-1 font-weight-medium">({{ item.unidadMedida }})</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="py-1">
                    <span class="font-weight-medium text-body-2">{{ item.bodegaNombre }}</span>
                    <div class="text-caption text-grey" style="font-size: 0.72rem !important;">
                      {{ item.tipoBodegaNombre || '' }}
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <v-chip
                    size="x-small"
                    :color="item.cantidad >= 0 ? 'green-darken-2' : 'red-darken-2'"
                    variant="tonal"
                    class="font-weight-bold"
                  >
                    <v-icon size="12" class="me-0.5">
                      {{ item.cantidad >= 0 ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' }}
                    </v-icon>
                    {{ item.cantidad >= 0 ? 'Entrada' : 'Salida' }}
                  </v-chip>
                </td>
                <td class="text-center font-weight-bold" :class="item.cantidad >= 0 ? 'text-green-darken-3' : 'text-red-darken-3'">
                  {{ item.cantidad >= 0 ? `+${item.cantidad}` : item.cantidad }}
                </td>
                <td class="text-center text-grey-darken-3">
                  {{ formatCurrency(item.costoUnitario) }}
                </td>
                <td class="text-center font-weight-medium text-teal-darken-4">
                  {{ formatCurrency(Math.abs(item.cantidad) * (item.costoUnitario || 0)) }}
                </td>
                <td class="text-center">
                  <div class="d-flex align-center justify-center text-caption">
                    <span class="text-grey-darken-1">{{ item.stockAnterior }}</span>
                    <v-icon size="12" color="indigo" class="mx-1">mdi-arrow-right</v-icon>
                    <span class="font-weight-bold text-indigo-darken-3">{{ item.nuevoStock }}</span>
                  </div>
                </td>
                <td class="text-caption text-grey-darken-2 text-truncate" style="max-width: 140px;" :title="item.observaciones || ''">
                  {{ item.observaciones || '- - -' }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </template>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-4 py-3 bg-grey-lighten-4 d-flex justify-end">
        <v-btn
          color="indigo-darken-4"
          variant="elevated"
          @click="$emit('closeDialog')"
          class="text-none font-weight-bold px-4"
        >
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DetalleMovimientoModal',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    movimiento: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  emits: ['closeDialog'],

  setup() {
    const formatCurrency = (val) => {
      if (val === null || val === undefined || isNaN(val)) return 'C$ 0.00'
      return `C$ ${Number(val).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const formatDate = (val) => {
      if (!val) return '- - -'
      const date = new Date(val)
      if (isNaN(date.getTime())) return val
      return date.toLocaleString('es-NI', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    const getTipoMovColor = (tipo) => {
      if (!tipo) return 'grey-darken-1'
      const upper = tipo.toUpperCase()
      if (upper.includes('VENTA')) return 'deep-orange-darken-2'
      if (upper.includes('COMPRA')) return 'green-darken-2'
      if (upper.includes('TRASLADO')) return 'blue-darken-2'
      if (upper.includes('ASIGNACION') || upper.includes('ASIGNACIÓN')) return 'indigo-darken-2'
      if (upper.includes('AJUSTE')) return 'purple-darken-2'
      if (upper.includes('CARGA')) return 'amber-darken-3'
      if (upper.includes('ANULACION') || upper.includes('ANULACIÓN')) return 'red-darken-3'
      return 'grey-darken-2'
    }

    return {
      formatCurrency,
      formatDate,
      getTipoMovColor
    }
  }
}
</script>
