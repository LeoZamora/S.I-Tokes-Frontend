<template>
  <div class="w-100 pa-4">
    <v-card class="border-t border-b" elevation="0" rounded="0">
      <!-- Encabezado -->
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <v-avatar color="green-lighten-5" class="me-3" size="40">
            <v-icon color="green-darken-3" size="24">mdi-package-variant-closed-check</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold text-indigo-darken-4">
              Entrega de Pedidos
            </div>
            <div class="text-caption text-grey-darken-2">
              Confirmación de entrega final al cliente, registro de entrega y firma de recibido
            </div>
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn
          color="green-darken-3"
          variant="flat"
          prepend-icon="mdi-refresh"
          class="text-none font-weight-medium"
          @click="getPedidosEntrega()"
        >
          Actualizar Listado
        </v-btn>
      </template>
      <v-divider />

      <!-- MÉTRICAS DE ENTREGA -->
      <v-row dense class="px-4 pt-4 mb-2">
        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" color="green-lighten-5" class="pa-3 rounded-lg border-green-lighten-4 border">
            <div class="d-flex align-center">
              <v-avatar color="green-darken-3" class="mr-3 text-white">
                <v-icon>mdi-calendar-check</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-green-darken-4 font-weight-bold">
                  Entregados Hoy
                </div>
                <div class="text-h6 font-weight-bold text-green-darken-4">
                  {{ pedidosEntregadosHoy.length }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" color="teal-lighten-5" class="pa-3 rounded-lg border-teal-lighten-4 border">
            <div class="d-flex align-center">
              <v-avatar color="teal-darken-3" class="mr-3 text-white">
                <v-icon>mdi-truck-check</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-teal-darken-4 font-weight-bold">
                  Total Pedidos Entregados
                </div>
                <div class="text-h6 font-weight-bold text-teal-darken-4">
                  {{ pedidosEntregadosTotal.length }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="12">
          <v-card variant="flat" color="amber-lighten-5" class="pa-3 rounded-lg border-amber-lighten-4 border">
            <div class="d-flex align-center">
              <v-avatar color="amber-darken-3" class="mr-3 text-white">
                <v-icon>mdi-clock-alert-outline</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-amber-darken-4 font-weight-bold">
                  Pendientes por Entregar
                </div>
                <div class="text-h6 font-weight-bold text-amber-darken-4">
                  {{ pedidosPendientesEntrega.length }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- FILTROS DE ENTREGA -->
      <v-card class="mx-4 mb-4 pa-4 border rounded-lg" elevation="0">
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="d-flex align-center">
            <v-icon color="green-darken-3" class="mr-2">mdi-tune</v-icon>
            <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">Filtros de Entrega</span>
          </div>
          <v-btn
            size="small"
            color="grey-darken-1"
            variant="outlined"
            prepend-icon="mdi-broom"
            class="text-none"
            @click="clearFilters()"
          >
            Limpiar Filtros
          </v-btn>
        </div>

        <v-row dense align="center">
          <v-col cols="12" md="3" sm="6">
            <v-text-field
              v-model="search.fechaEntregadoDesde"
              label="Entregado Desde"
              type="date"
              density="compact"
              variant="outlined"
              hide-details
              color="green-darken-3"
              @change="getPedidosEntrega()"
            />
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-text-field
              v-model="search.fechaEntregadoHasta"
              label="Entregado Hasta"
              type="date"
              density="compact"
              variant="outlined"
              hide-details
              color="green-darken-3"
              @change="getPedidosEntrega()"
            />
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-autocomplete
              v-model="search.idCliente"
              label="Cliente"
              :items="cmb.clientes"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              color="green-darken-3"
              @update:model-value="getPedidosEntrega()"
            />
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-autocomplete
              v-model="search.idEstadoActual"
              label="Estado Entrega"
              :items="cmb.estados"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              color="green-darken-3"
              @update:model-value="getPedidosEntrega()"
            />
          </v-col>
        </v-row>
      </v-card>

      <!-- TABLA DE ENTREGAS -->
      <v-card class="mx-4 mb-6 border rounded-lg" elevation="0">
        <v-data-table
          :headers="headers"
          :items="pedidosList"
          :loading="loading"
          density="compact"
          class="rounded"
          :items-per-page="15"
        >
          <template v-slot:item.noPedido="{ item }">
            <span class="font-weight-bold text-green-darken-4">{{ item.noPedido }}</span>
          </template>

          <template v-slot:item.cliente="{ item }">
            <span class="font-weight-bold text-grey-darken-4">{{ item.cliente }}</span>
          </template>

          <template v-slot:item.fechaEntregaSolicitada="{ item }">
            <span class="text-body-2 font-weight-medium">{{ formatDate(item.fechaEntregaSolicitada) }}</span>
          </template>

          <template v-slot:item.fechaEntregado="{ item }">
            <span class="text-body-2 font-weight-bold text-green-darken-3">
              {{ item.fechaEntregado ? formatDate(item.fechaEntregado) : 'Pendiente' }}
            </span>
          </template>

          <template v-slot:item.estado="{ item }">
            <v-chip
              :color="getEstadoColor(item.idEstadoActual)"
              size="small"
              variant="flat"
              class="font-weight-bold"
            >
              {{ item.estado }}
            </v-chip>
          </template>

          <template v-slot:item.totalAfecha="{ item }">
            <span class="font-weight-bold text-success-darken-2">
              {{ formatCurrency(item.totalAfecha) }}
            </span>
          </template>

          <template v-slot:item.opc="{ item }">
            <v-btn
              icon
              size="small"
              color="green-darken-3"
              variant="text"
              @click="viewPedidoDetail(item)"
            >
              <v-icon size="20">mdi-eye</v-icon>
              <v-tooltip activator="parent" location="top">Ver detalle entrega</v-tooltip>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-card>

    <!-- DIÁLOGO DE DETALLE DE ENTREGA -->
    <v-dialog v-model="dialogView" max-width="850" persistent>
      <v-card v-if="selectedPedido" class="rounded-lg overflow-hidden elevation-12">
        <v-card-title class="d-flex align-center bg-green-darken-4 text-white py-2 px-4">
          <v-avatar size="36" color="white" class="me-3" variant="flat">
            <v-icon color="green-darken-4" size="22">mdi-package-variant-closed-check</v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">Detalle de Entrega de Pedido</div>
            <div class="text-caption text-green-lighten-4">
              Nº Pedido: <span class="font-weight-bold text-white">{{ selectedPedido.noPedido }}</span>
            </div>
          </div>
          <v-spacer />
          <v-chip :color="getEstadoColor(selectedPedido.idEstadoActual)" size="small" variant="flat" class="font-weight-bold me-3">
            {{ selectedPedido.estado }}
          </v-chip>
          <v-btn variant="text" icon size="small" color="white" @click="dialogView = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="px-4 pt-4 pb-4 bg-grey-lighten-5" style="max-height: 80vh; overflow-y: auto;">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-card variant="flat" class="border rounded-lg bg-white pa-4 mb-3 h-100">
                <div class="d-flex align-center mb-3">
                  <v-icon color="green-darken-3" size="20" class="me-2">mdi-account-check</v-icon>
                  <h4 class="font-weight-bold text-green-darken-4 text-subtitle-1">Datos del Cliente</h4>
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Cliente:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-green-darken-4">{{ selectedPedido.cliente }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Enviar A:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-grey-darken-4">{{ selectedPedido.enviarA || '—' }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card variant="flat" class="border rounded-lg bg-white pa-4 mb-3 h-100">
                <div class="d-flex align-center mb-3">
                  <v-icon color="green-darken-3" size="20" class="me-2">mdi-clock-check-outline</v-icon>
                  <h4 class="font-weight-bold text-green-darken-4 text-subtitle-1">Tiempos de Entrega</h4>
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Fecha Solicitada:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-grey-darken-4">{{ formatDate(selectedPedido.fechaEntregaSolicitada) }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Fecha Entregado:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-green-darken-4">{{ formatDate(selectedPedido.fechaEntregado) || 'Pendiente' }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <v-col cols="12">
              <v-card variant="flat" class="border rounded-lg bg-white pa-4">
                <div class="d-flex align-center justify-space-between mb-3">
                  <h4 class="font-weight-bold text-green-darken-4 text-subtitle-1">Productos Entregados</h4>
                  <div class="text-subtitle-1 font-weight-bold text-green-darken-4">
                    Total: <span class="text-success-darken-2 text-h6 font-weight-bold">{{ formatCurrency(selectedPedido.totalAfecha) }}</span>
                  </div>
                </div>

                <v-table density="compact" class="border rounded">
                  <thead>
                    <tr class="bg-green-lighten-5">
                      <th class="font-weight-bold text-body-2 text-green-darken-4">Código</th>
                      <th class="font-weight-bold text-body-2 text-green-darken-4">Producto</th>
                      <th class="text-center font-weight-bold text-body-2 text-green-darken-4">Cantidad</th>
                      <th class="text-right font-weight-bold text-body-2 text-green-darken-4">Precio (C$)</th>
                      <th class="text-right font-weight-bold text-body-2 text-green-darken-4">Subtotal (C$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedPedido.detallePedido" :key="item.idDetallePedido">
                      <td class="text-body-2 font-weight-bold text-green-darken-4">{{ item.codigoProducto || '—' }}</td>
                      <td class="text-body-2 font-weight-bold text-grey-darken-4">{{ item.producto }}</td>
                      <td class="text-center text-body-2 font-weight-bold text-grey-darken-4">{{ item.cantidad }}</td>
                      <td class="text-right text-body-2 text-grey-darken-4">{{ formatCurrency(item.precioUnitarioAfecha) }}</td>
                      <td class="text-right text-body-2 font-weight-bold text-success-darken-2">{{ formatCurrency(item.cantidad * item.precioUnitarioAfecha) }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />
        <v-card-actions class="bg-grey-lighten-4 px-4 py-2">
          <v-spacer />
          <v-btn color="grey-darken-2" variant="tonal" @click="dialogView = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RequestHttp from '@/services/requestHttp'

export default {
  name: 'EntregaPedidosComp',

  data() {
    return {
      requestHttp: new RequestHttp(),
      loading: false,
      dialogView: false,
      selectedPedido: null,

      search: {
        fechaEntregadoDesde: null,
        fechaEntregadoHasta: null,
        idCliente: null,
        idEstadoActual: null
      },

      cmb: {
        clientes: [],
        estados: []
      },

      headers: [
        { title: 'Opciones', key: 'opc', align: 'center', sortable: false },
        { title: 'Nº Pedido', key: 'noPedido', align: 'center', sortable: true },
        { title: 'Cliente', key: 'cliente', align: 'start', sortable: true },
        { title: 'Entrega Solicitada', key: 'fechaEntregaSolicitada', align: 'center', sortable: true },
        { title: 'Fecha Entregado', key: 'fechaEntregado', align: 'center', sortable: true },
        { title: 'Total', key: 'totalAfecha', align: 'end', sortable: true },
        { title: 'Estado Entrega', key: 'estado', align: 'center', sortable: true }
      ],

      pedidosList: []
    }
  },

  computed: {
    getTodayStr() {
      const d = new Date()
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    pedidosEntregadosHoy() {
      const hoy = this.getTodayStr
      return this.pedidosList.filter(p => p.fechaEntregado && p.fechaEntregado.substr(0, 10) === hoy)
    },
    pedidosEntregadosTotal() {
      return this.pedidosList.filter(p => p.fechaEntregado || p.idEstadoActual === 3)
    },
    pedidosPendientesEntrega() {
      return this.pedidosList.filter(p => !p.fechaEntregado && p.idEstadoActual !== 3)
    }
  },

  mounted() {
    this.getPedidosEntrega()
    this.loadClientes()
    this.loadEstados()
  },

  methods: {
    clearFilters() {
      this.search = {
        fechaEntregadoDesde: null,
        fechaEntregadoHasta: null,
        idCliente: null,
        idEstadoActual: null
      }
      this.getPedidosEntrega()
    },

    async getPedidosEntrega() {
      this.loading = true
      const req = {
        fechaEntregadoDesde: this.search.fechaEntregadoDesde || null,
        fechaEntregadoHasta: this.search.fechaEntregadoHasta || null,
        idCliente: this.search.idCliente || null,
        idEstadoActual: this.search.idEstadoActual || null
      }

      try {
        const res = await this.requestHttp.getPedidos(req)
        if (res.code === 200) {
          this.pedidosList = res.data
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async loadClientes() {
      try {
        const list = await this.requestHttp.getClientes()
        this.cmb.clientes = list.map(c => ({ title: c.nombre, value: c.idCliente }))
      } catch (e) {
        console.error(e)
      }
    },

    async loadEstados() {
      try {
        const res = await this.requestHttp.getPedidosEstados()
        if (res.code === 200) {
          this.cmb.estados = res.data.map(e => ({ title: e.title, value: e.value }))
        }
      } catch (e) {
        console.error(e)
      }
    },

    getEstadoColor(id) {
      const colors = { 1: 'warning', 2: 'info', 3: 'success', 4: 'error' }
      return colors[id] || 'grey'
    },

    formatCurrency(val) {
      if (val === null || val === undefined) return 'C$ 0.00'
      return new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO' }).format(val)
    },

    formatDate(d) {
      if (!d) return '—'
      return new Date(d).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
    },

    async viewPedidoDetail(item) {
      try {
        const res = await this.requestHttp.getPedidoById(item.idPedido)
        if (res.code === 200) {
          this.selectedPedido = res.data
          this.dialogView = true
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
