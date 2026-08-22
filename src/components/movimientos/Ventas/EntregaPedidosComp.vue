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
              Registro, confirmación de entregas finales al cliente y control de recepciones
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

      <!-- FILTROS PRINCIPALES -->
      <v-card class="pa-4 mb-3 border rounded-lg" elevation="0">
        <!-- CABECERA DE FILTROS -->
        <div class="d-flex align-center justify-space-between mb-3 flex-wrap ga-2">
          <div class="d-flex align-center">
            <v-icon color="green-darken-3" class="mr-2">mdi-filter-variant</v-icon>
            <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">Filtros de búsqueda</span>
          </div>
          <div class="d-flex align-center ga-2">
            <v-btn
              size="small"
              :variant="showAdvancedFilters ? 'flat' : 'outlined'"
              :color="showAdvancedFilters ? 'green-darken-3' : 'indigo-darken-2'"
              prepend-icon="mdi-tune-variant"
              @click="showAdvancedFilters = !showAdvancedFilters"
              class="text-none"
            >
              {{ showAdvancedFilters ? 'Ocultar Filtros Avanzados' : 'Filtros Avanzados' }}
              <v-badge v-if="hasActiveAdvancedFilters" dot color="green-darken-3" class="ml-1" />
              <v-icon class="ml-1" size="small">
                {{ showAdvancedFilters ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
            </v-btn>
            <v-btn
              size="small"
              color="grey-darken-1"
              variant="outlined"
              prepend-icon="mdi-broom"
              class="text-none"
              @click="clearFilters()"
            >
              Limpiar Todo
            </v-btn>
          </div>
        </div>

        <!-- FILTROS BÁSICOS -->
        <div class="d-flex align-center flex-wrap ga-2 bg-grey-lighten-4 pa-2 rounded-lg border">
          <span class="text-caption font-weight-bold text-grey-darken-2 me-1">Filtros Rápidos (por Fecha Programada):</span>

          <v-btn
            size="small"
            :variant="search.quickFilter === 'a_entregar_hoy' ? 'flat' : 'tonal'"
            color="green-darken-3"
            prepend-icon="mdi-calendar-today"
            class="text-none font-weight-medium"
            @click="applyQuickFilter('a_entregar_hoy')"
          >
            A Entregar Hoy
          </v-btn>

          <v-btn
            size="small"
            :variant="search.quickFilter === 'entregados_ayer' ? 'flat' : 'tonal'"
            color="teal-darken-3"
            prepend-icon="mdi-calendar-arrow-left"
            class="text-none font-weight-medium"
            @click="applyQuickFilter('entregados_ayer')"
          >
            Entregados ayer
          </v-btn>

          <v-btn
            size="small"
            :variant="search.quickFilter === 'entregados_semana' ? 'flat' : 'tonal'"
            color="indigo-darken-3"
            prepend-icon="mdi-calendar-range"
            class="text-none font-weight-medium"
            @click="applyQuickFilter('entregados_semana')"
          >
            Entregados esta semana
          </v-btn>

          <v-btn
            v-if="search.quickFilter"
            size="small"
            variant="text"
            color="grey-darken-2"
            icon="mdi-close-circle"
            @click="applyQuickFilter('todos')"
          >
            <v-icon size="small">mdi-close-circle</v-icon>
            <v-tooltip activator="parent" location="top">Limpiar filtro rápido</v-tooltip>
          </v-btn>
        </div>

        <!-- FILTROS AVANZADOS (Desplegable) -->
        <v-expand-transition>
          <div v-show="showAdvancedFilters" class="mt-4 pt-3 border-t bg-green-lighten-5 pa-3 rounded-lg">
            <div class="text-caption font-weight-bold text-green-darken-4 mb-2 d-flex align-center">
              <v-icon size="small" class="me-1" color="green-darken-3">mdi-calendar-range</v-icon>
              Rangos de Fechas Avanzados
            </div>
            <v-row dense>
              <!-- 1. Rango Fecha Entregado -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-2 bg-white rounded-lg border-green-lighten-4 h-100">
                  <div class="text-caption font-weight-bold text-green-darken-4 mb-2 d-flex align-center">
                    <v-icon size="x-small" class="me-1">mdi-package-variant-closed-check</v-icon>
                    Fecha Entregado (Confirmado)
                  </div>
                  <v-row dense>
                    <v-col cols="6">
                      <v-text-field
                        v-model="search.fechaEntregadoDesde"
                        label="Desde"
                        type="date"
                        density="compact"
                        variant="outlined"
                        hide-details
                        color="green-darken-3"
                        @change="getPedidosEntrega()"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="search.fechaEntregadoHasta"
                        label="Hasta"
                        type="date"
                        density="compact"
                        variant="outlined"
                        hide-details
                        color="green-darken-3"
                        @change="getPedidosEntrega()"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <!-- 2. Rango Fecha Entrega Programada -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-2 bg-white rounded-lg border-green-lighten-4 h-100">
                  <div class="text-caption font-weight-bold text-indigo-darken-3 mb-2 d-flex align-center">
                    <v-icon size="x-small" class="me-1">mdi-truck-clock</v-icon>
                    Fecha Entrega Programada
                  </div>
                  <v-row dense>
                    <v-col cols="6">
                      <v-text-field
                        v-model="search.fechaEntregaProgramadaDesde"
                        label="Desde"
                        type="date"
                        density="compact"
                        variant="outlined"
                        hide-details
                        color="indigo"
                        @change="getPedidosEntrega()"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="search.fechaEntregaProgramadaHasta"
                        label="Hasta"
                        type="date"
                        density="compact"
                        variant="outlined"
                        hide-details
                        color="indigo"
                        @change="getPedidosEntrega()"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-card>

      <!-- MÉTRICAS DE ENTREGA -->
      <v-row dense class="px-4 mb-2">
        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" color="amber-lighten-5" class="pa-3 rounded-lg border-amber-lighten-4 border">
            <div class="d-flex align-center">
              <v-avatar color="amber-darken-3" class="mr-3 text-white">
                <v-icon>mdi-clock-alert-outline</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-amber-darken-4 font-weight-bold">
                  Pedidos Pendientes de Entrega
                </div>
                <div class="text-h6 font-weight-bold text-amber-darken-4">
                  {{ totalPendientesEntregaCount }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" color="teal-lighten-5" class="pa-3 rounded-lg border-teal-lighten-4 border">
            <div class="d-flex align-center">
              <v-avatar color="teal-darken-3" class="mr-3 text-white">
                <v-icon>mdi-package-variant-closed-check</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-teal-darken-4 font-weight-bold">
                  N° Total Pedidos Entregados
                </div>
                <div class="text-h6 font-weight-bold text-teal-darken-4">
                  {{ totalEntregadosTotalCount }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="12">
          <v-card variant="flat" color="emerald-lighten-5" class="pa-3 rounded-lg border-green-lighten-4 border">
            <div class="d-flex align-center">
              <v-avatar color="green-darken-4" class="mr-3 text-white">
                <v-icon>mdi-cash-check</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-green-darken-4 font-weight-bold">
                  Total Monto Entregado
                </div>
                <div class="text-h6 font-weight-bold text-green-darken-4">
                  {{ formatCurrency(totalMontoEntregado) }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

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
          <!-- ENCABEZADOS CON FILTROS EN COLUMNAS -->
          <template v-slot:header.noPedido="{ column }">
            <div class="d-flex flex-column align-center py-1 ga-1 w-100">
              <span class="font-weight-bold text-caption text-indigo-darken-4">Nº Pedido</span>
              <v-text-field
                v-model="search.noPedido"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                color="green-darken-3"
                placeholder="Filtrar Nº"
                style="min-width: 100px; max-width: 130px;"
                @update:model-value="getPedidosEntrega()"
                @click:clear="getPedidosEntrega()"
              />
            </div>
          </template>

          <template v-slot:header.cliente="{ column }">
            <div class="d-flex flex-column align-start py-1 ga-1 w-100">
              <span class="font-weight-bold text-caption text-indigo-darken-4">Cliente</span>
              <v-autocomplete
                v-model="search.idCliente"
                :items="cmb.clientes"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                color="green-darken-3"
                placeholder="Todos los clientes"
                style="min-width: 170px; max-width: 240px;"
                @update:model-value="getPedidosEntrega()"
                @click:clear="getPedidosEntrega()"
              />
            </div>
          </template>

          <template v-slot:header.camionAsignado="{ column }">
            <div class="d-flex flex-column align-center py-1 ga-1 w-100">
              <span class="font-weight-bold text-caption text-indigo-darken-4">Camión</span>
              <v-autocomplete
                v-model="search.idCamionAsignado"
                :items="cmb.camiones"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                color="green-darken-3"
                placeholder="Todos"
                style="min-width: 130px; max-width: 160px;"
                @update:model-value="getPedidosEntrega()"
                @click:clear="getPedidosEntrega()"
              />
            </div>
          </template>

          <template v-slot:header.estado="{ column }">
            <div class="d-flex flex-column align-center py-1 ga-1 w-100">
              <span class="font-weight-bold text-caption text-indigo-darken-4">Estado</span>
              <v-autocomplete
                v-model="search.idEstadoActual"
                :items="cmb.estados"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                color="green-darken-3"
                placeholder="Todos"
                style="min-width: 120px; max-width: 150px;"
                @update:model-value="getPedidosEntrega()"
                @click:clear="getPedidosEntrega()"
              />
            </div>
          </template>

          <!-- PLANTILLAS DE CELDA -->
          <template v-slot:item.noPedido="{ item }">
            <span class="font-weight-bold text-green-darken-4">{{ item.noPedido }}</span>
          </template>

          <template v-slot:item.cliente="{ item }">
            <span class="font-weight-bold text-grey-darken-4">{{ item.cliente }}</span>
          </template>

          <template v-slot:item.enviarA="{ item }">
            <span class="text-body-2 text-grey-darken-4">{{ item.enviarA || '—' }}</span>
          </template>

          <!-- VISUALIZACIÓN ESPECIAL: CAMIÓN ASIGNADO -->
          <template v-slot:item.camionAsignado="{ item }">
            <v-chip
              v-if="item.camionAsignado"
              color="teal-darken-3"
              size="small"
              variant="flat"
              class="font-weight-bold elevation-1"
              style="cursor: pointer"
              @click.stop="openPedidosCamionDialog(item)"
            >
              <v-icon start size="14">mdi-truck</v-icon>
              {{ item.camionAsignado }}
              <v-icon end size="14" class="ms-1">mdi-eye</v-icon>
              <v-tooltip activator="parent" location="top">
                Ver pedidos asignados al camión {{ item.camionAsignado }}
              </v-tooltip>
            </v-chip>
            <span v-else class="text-caption text-grey-darken-1 font-italic">Sin asignar</span>
          </template>

          <template v-slot:item.nombreEntregadorAsignado="{ item }">
            <div v-if="item.nombreEntregadorAsignado" class="d-flex align-center">
              <v-icon size="16" color="teal-darken-3" class="me-1">mdi-account-badge-outline</v-icon>
              <span class="text-body-2 font-weight-bold text-grey-darken-4">{{ item.nombreEntregadorAsignado }}</span>
            </div>
            <span v-else class="text-caption text-grey-darken-1 font-italic">Sin asignación</span>
          </template>

          <template v-slot:item.fechaEntregaProgramada="{ item }">
            <span class="text-body-2 font-weight-medium">
              {{ item.fechaEntregaProgramada ? formatDate(item.fechaEntregaProgramada) : '—' }}
            </span>
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
            <div class="d-flex align-center justify-center ga-1">
              <v-btn
                icon
                size="small"
                color="green-darken-3"
                variant="text"
                @click="viewPedidoDetail(item)"
              >
                <v-icon size="20">mdi-eye</v-icon>
                <v-tooltip activator="parent" location="top">Ver detalle de entrega</v-tooltip>
              </v-btn>

              <v-btn
                v-if="item.idEstadoActual === 5 || (item.estado || '').toLowerCase().includes('asignad')"
                icon
                size="small"
                color="green-darken-4"
                variant="text"
                @click="openEntregaDialog(item)"
              >
                <v-icon size="20">mdi-check-decagram</v-icon>
                <v-tooltip activator="parent" location="top">Registrar / Confirmar Entrega</v-tooltip>
              </v-btn>
            </div>
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
            <div class="text-subtitle-1 font-weight-bold">Detalle de Entrega al Cliente</div>
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
                  <v-icon color="green-darken-3" size="20" class="me-2">mdi-truck-check</v-icon>
                  <h4 class="font-weight-bold text-green-darken-4 text-subtitle-1">Datos de Entrega y Transporte</h4>
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Cliente:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-green-darken-4">{{ selectedPedido.cliente }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Camión Asignado:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-teal-darken-3">
                      {{ selectedPedido.camionAsignado || 'Sin asignar' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Entregador Responsable:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-indigo-darken-4">
                      {{ selectedPedido.nombreEntregadorAsignado || 'Sin asignación' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Fecha Entregado:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-green-darken-3">{{ formatDate(selectedPedido.fechaEntregado) || 'Pendiente' }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card variant="flat" class="border rounded-lg bg-white pa-4 mb-3 h-100">
                <div class="d-flex align-center mb-3">
                  <v-icon color="green-darken-3" size="20" class="me-2">mdi-map-marker-check</v-icon>
                  <h4 class="font-weight-bold text-green-darken-4 text-subtitle-1">Destino y Recepción</h4>
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Dirección de Entrega (Enviar A):</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-grey-darken-4">{{ selectedPedido.enviarA || '—' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Ubicación de registro:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-grey-darken-4">{{ selectedPedido.ubicacion || '—' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Observaciones de Entrega:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 text-grey-darken-4 font-italic">{{ selectedPedido.observaciones || 'Sin observaciones' }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <!-- DETALLE DE PRODUCTOS ENTREGADOS -->
            <v-col cols="12">
              <v-card variant="flat" class="border rounded-lg bg-white pa-4">
                <div class="d-flex align-center justify-space-between mb-3">
                  <h4 class="font-weight-bold text-green-darken-4 text-subtitle-1">Productos Entregados al Cliente</h4>
                  <div class="text-subtitle-1 font-weight-bold text-indigo-darken-4">
                    Total: <span class="text-success-darken-2 text-h6 font-weight-bold">{{ formatCurrency(selectedPedido.totalAfecha) }}</span>
                  </div>
                </div>

                <v-table density="compact" class="border rounded">
                  <thead>
                    <tr class="bg-green-lighten-5">
                      <th class="font-weight-bold text-body-2 text-green-darken-4">Código</th>
                      <th class="font-weight-bold text-body-2 text-green-darken-4">Producto</th>
                      <th class="text-center font-weight-bold text-body-2 text-green-darken-4">Cantidad Entregada</th>
                      <th class="text-right font-weight-bold text-body-2 text-green-darken-4">Precio Unit.</th>
                      <th class="text-right font-weight-bold text-body-2 text-green-darken-4">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedPedido.detallePedido" :key="item.idDetallePedido">
                      <td class="text-body-2 font-weight-medium text-green-darken-4">{{ item.codigoProducto || '—' }}</td>
                      <td class="text-body-2 font-weight-bold text-grey-darken-4">{{ item.producto }}</td>
                      <td class="text-center text-body-2 font-weight-bold text-grey-darken-4">{{ item.cantidad }}</td>
                      <td class="text-right text-body-2 font-weight-medium text-grey-darken-4">{{ formatCurrency(item.precioUnitarioAfecha) }}</td>
                      <td class="text-right text-body-2 font-weight-bold text-success-darken-2">{{ formatCurrency(item.cantidad * item.precioUnitarioAfecha) }}</td>
                    </tr>
                    <tr v-if="!selectedPedido.detallePedido || selectedPedido.detallePedido.length === 0">
                      <td colspan="5" class="text-center text-grey-darken-3 text-body-2 py-4 font-italic">
                        No hay productos registrados en este pedido.
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />
        <v-card-actions class="bg-grey-lighten-4 px-4 py-2 d-flex align-center">
          <v-btn
            v-if="selectedPedido && (selectedPedido.idEstadoActual === 5 || (selectedPedido.estado || '').toLowerCase().includes('asignad'))"
            color="green-darken-4"
            variant="flat"
            prepend-icon="mdi-check-decagram"
            class="text-none font-weight-bold"
            @click="openEntregaDialog(selectedPedido)"
          >
            Registrar Entrega (Checklist)
          </v-btn>
          <v-spacer />
          <v-btn color="grey-darken-2" variant="tonal" @click="dialogView = false" prepend-icon="mdi-close">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIÁLOGO DE REGISTRO / CONFIRMACIÓN DE ENTREGA (CHECKLIST) -->
    <v-dialog v-model="dialogs.entrega" max-width="850" persistent>
      <v-card v-if="selectedPedido" class="rounded-lg overflow-hidden elevation-12">
        <v-card-title class="d-flex align-center bg-green-darken-4 text-white py-3 px-4">
          <v-avatar size="36" color="white" class="me-3" variant="flat">
            <v-icon color="green-darken-4" size="22">mdi-check-decagram</v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              Registrar Entrega de Pedido (Checklist)
            </div>
            <div class="text-caption text-green-lighten-4">
              Nº Pedido: <span class="font-weight-bold text-white">{{ selectedPedido.noPedido }}</span>
              — {{ selectedPedido.cliente }}
            </div>
          </div>
          <v-spacer />
          <v-btn variant="text" icon size="small" color="white" @click="dialogs.entrega = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4 bg-grey-lighten-5" style="max-height: 80vh; overflow-y: auto;">
          <!-- BANNER INFORMACIÓN DE ENTREGA -->
          <v-card variant="flat" class="pa-3 mb-3 border rounded-lg bg-white">
            <v-row dense align="center">
              <v-col cols="12" md="4">
                <div class="text-caption text-grey-darken-2 font-weight-bold">Cliente:</div>
                <div class="text-subtitle-2 font-weight-bold text-green-darken-4">{{ selectedPedido.cliente }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-caption text-grey-darken-2 font-weight-bold">Camión / Entregador:</div>
                <div class="text-body-2 font-weight-bold text-indigo-darken-4">
                  {{ selectedPedido.camionAsignado || '—' }} / {{ selectedPedido.nombreEntregadorAsignado || '—' }}
                </div>
              </v-col>
              <v-col cols="12" md="4" class="text-md-right">
                <div class="text-caption text-grey-darken-2 font-weight-bold">Tipo de Entrega Estimado:</div>
                <v-chip
                  :color="esEntregaTotalCalculada ? 'success' : 'amber-darken-4'"
                  size="small"
                  variant="flat"
                  class="font-weight-bold mt-1"
                >
                  <v-icon start size="14">{{ esEntregaTotalCalculada ? 'mdi-check-all' : 'mdi-triangle-wave' }}</v-icon>
                  {{ esEntregaTotalCalculada ? 'Entrega Total' : 'Entrega Parcial' }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card>

          <!-- INSTRUCCIONES -->
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            class="mb-3 text-caption"
            icon="mdi-format-list-checks"
          >
            Marque o desmarque los productos recibidos por el cliente y edite las cantidades entregadas en caso de una <strong>Entrega Parcial</strong>.
          </v-alert>

          <!-- TABLA CHECKLIST DE PRODUCTOS -->
          <v-card variant="flat" class="border rounded-lg bg-white pa-3">
            <v-table density="compact" class="border rounded">
              <thead>
                <tr class="bg-green-lighten-5">
                  <th class="text-center font-weight-bold text-body-2 text-green-darken-4" style="width: 70px;">Recibido</th>
                  <th class="font-weight-bold text-body-2 text-green-darken-4">Código</th>
                  <th class="font-weight-bold text-body-2 text-green-darken-4">Producto</th>
                  <th class="text-center font-weight-bold text-body-2 text-green-darken-4" style="width: 100px;">Cant. Pedida</th>
                  <th class="text-center font-weight-bold text-body-2 text-green-darken-4" style="width: 130px;">Cant. Entregada</th>
                  <th class="text-right font-weight-bold text-body-2 text-green-darken-4" style="width: 110px;">Subtotal</th>
                  <th class="font-weight-bold text-body-2 text-green-darken-4">Observaciones Item</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in entregaForm.items"
                  :key="item.idProducto"
                  :class="{ 'bg-grey-lighten-4 opacity-60': !item.incluido }"
                >
                  <td class="text-center pa-1">
                    <v-checkbox-btn
                      v-model="item.incluido"
                      color="green-darken-3"
                      density="compact"
                    />
                  </td>
                  <td class="text-body-2 font-weight-medium text-green-darken-4">{{ item.codigoProducto || '—' }}</td>
                  <td class="text-body-2 font-weight-bold text-grey-darken-4">{{ item.producto }}</td>
                  <td class="text-center text-body-2 font-weight-bold text-grey-darken-3">
                    {{ item.cantidadOriginal }}
                  </td>
                  <td class="text-center pa-1">
                    <v-text-field
                      v-model.number="item.cantidadEntregada"
                      type="number"
                      min="0"
                      :max="item.cantidadOriginal"
                      density="compact"
                      variant="outlined"
                      hide-details
                      :disabled="!item.incluido"
                      color="green-darken-3"
                      class="text-center"
                      style="max-width: 100px;"
                    />
                  </td>
                  <td class="text-right text-body-2 font-weight-bold text-success-darken-2">
                    {{ item.incluido ? formatCurrency((Number(item.cantidadEntregada) || 0) * Number(item.precioUnitarioAfecha)) : 'C$ 0.00' }}
                  </td>
                  <td class="pa-1">
                    <v-text-field
                      v-model="item.observaciones"
                      density="compact"
                      variant="outlined"
                      hide-details
                      placeholder="Ej. Devolución parcial..."
                      :disabled="!item.incluido"
                      color="green-darken-3"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>

            <!-- PIE DE RECAPITULACIÓN -->
            <div class="d-flex align-center justify-space-between mt-3 pt-2 border-t">
              <div class="text-caption font-weight-bold text-grey-darken-3">
                Items recibidos: {{ entregaForm.items.filter(i => i.incluido).length }} / {{ entregaForm.items.length }}
              </div>
              <div class="text-subtitle-1 font-weight-bold text-indigo-darken-4">
                Total Recibido: <span class="text-success-darken-2 text-h6 font-weight-bold">{{ formatCurrency(montoTotalEntregaCalculado) }}</span>
              </div>
            </div>
          </v-card>
        </v-card-text>

        <v-divider />
        <v-card-actions class="bg-grey-lighten-4 px-4 py-2">
          <v-spacer />
          <v-btn color="grey-darken-2" variant="tonal" @click="dialogs.entrega = false">
            Cancelar
          </v-btn>
          <v-btn
            color="green-darken-3"
            variant="flat"
            prepend-icon="mdi-check-decagram"
            class="text-none font-weight-bold"
            :loading="saving"
            @click="guardarEntregaPedido()"
          >
            Confirmar Entrega
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIÁLOGO DE VISUALIZACIÓN ESPECIAL: PEDIDOS POR CAMIÓN -->
    <v-dialog v-model="dialogs.camionPedidos" max-width="950" persistent>
      <v-card v-if="selectedCamionInfo" class="rounded-lg overflow-hidden elevation-12">
        <v-card-title class="d-flex align-center bg-teal-darken-4 text-white py-3 px-4">
          <v-avatar size="36" color="white" class="me-3" variant="flat">
            <v-icon color="teal-darken-4" size="22">mdi-truck-cargo-container</v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              Pedidos Asignados al Camión: {{ selectedCamionInfo.placa }}
            </div>
            <div class="text-caption text-teal-lighten-4">
              Entregador Responsable: <span class="font-weight-bold text-white">{{ selectedCamionInfo.entregador || 'Sin asignar' }}</span>
            </div>
          </div>
          <v-spacer />
          <v-btn variant="text" icon size="small" color="white" @click="dialogs.camionPedidos = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4 bg-grey-lighten-5" style="max-height: 80vh; overflow-y: auto;">
          <v-row dense class="mb-3">
            <v-col cols="12" md="4">
              <v-card variant="flat" class="pa-3 border rounded-lg bg-white">
                <div class="text-caption text-grey-darken-2 font-weight-bold">Total Pedidos Asignados</div>
                <div class="text-h6 font-weight-bold text-teal-darken-4">
                  {{ pedidosCamionList.length }} pedido(s)
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card variant="flat" class="pa-3 border rounded-lg bg-white">
                <div class="text-caption text-grey-darken-2 font-weight-bold">Monto Total Carga</div>
                <div class="text-h6 font-weight-bold text-success-darken-2">
                  {{ formatCurrency(montoTotalCamion) }}
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card variant="flat" class="pa-3 border rounded-lg bg-white">
                <div class="text-caption text-grey-darken-2 font-weight-bold">Placa del Vehículo</div>
                <div class="text-h6 font-weight-bold text-indigo-darken-4">
                  {{ selectedCamionInfo.placa }}
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headersCamionPedidos"
            :items="pedidosCamionList"
            :loading="loadingCamionPedidos"
            density="compact"
            class="rounded border bg-white"
            :items-per-page="10"
          >
            <template v-slot:item.noPedido="{ item }">
              <span class="font-weight-bold text-green-darken-4">{{ item.noPedido }}</span>
            </template>

            <template v-slot:item.cliente="{ item }">
              <span class="font-weight-bold text-grey-darken-4">{{ item.cliente }}</span>
            </template>

            <template v-slot:item.enviarA="{ item }">
              <span class="text-body-2 text-grey-darken-4">{{ item.enviarA || '—' }}</span>
            </template>

            <template v-slot:item.fechaEntregado="{ item }">
              <span class="text-body-2 font-weight-medium">
                {{ item.fechaEntregado ? formatDate(item.fechaEntregado) : 'Pendiente' }}
              </span>
            </template>

            <template v-slot:item.estado="{ item }">
              <v-chip
                :color="getEstadoColor(item.idEstadoActual)"
                size="x-small"
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
                <v-icon size="18">mdi-eye</v-icon>
                <v-tooltip activator="parent" location="top">Ver detalle entrega</v-tooltip>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider />
        <v-card-actions class="bg-grey-lighten-4 px-4 py-2">
          <v-spacer />
          <v-btn color="grey-darken-2" variant="tonal" @click="dialogs.camionPedidos = false" prepend-icon="mdi-close">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- NOTIFICACIONES SNACKBAR -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3500"
      location="top right"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" color="white" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
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
      saving: false,
      dialogView: false,
      selectedPedido: null,
      selectedCamionInfo: null,
      pedidosCamionList: [],
      loadingCamionPedidos: false,
      showAdvancedFilters: false,

      dialogs: {
        camionPedidos: false,
        entrega: false
      },

      entregaForm: {
        items: []
      },

      snackbar: {
        show: false,
        text: '',
        color: 'success'
      },

      search: {
        quickFilter: 'a_entregar_hoy',
        noPedido: null,
        fechaEntregadoDesde: null,
        fechaEntregadoHasta: null,
        fechaEntregaProgramadaDesde: null,
        fechaEntregaProgramadaHasta: null,
        idCliente: null,
        idEstadoActual: null,
        idCamionAsignado: null
      },

      cmb: {
        clientes: [],
        estados: [],
        camiones: []
      },

      headers: [
        { title: 'Opciones', key: 'opc', align: 'center', sortable: false },
        { title: 'Nº Pedido', key: 'noPedido', align: 'center', sortable: false },
        { title: 'Cliente', key: 'cliente', align: 'start', sortable: false },
        { title: 'Dirección de Entrega', key: 'enviarA', align: 'start', sortable: true },
        { title: 'Camión Asignado', key: 'camionAsignado', align: 'center', sortable: false },
        { title: 'Entregador Asignado', key: 'nombreEntregadorAsignado', align: 'start', sortable: true },
        { title: 'Entrega Programada', key: 'fechaEntregaProgramada', align: 'center', sortable: true },
        { title: 'Fecha Entregado', key: 'fechaEntregado', align: 'center', sortable: true },
        { title: 'Total', key: 'totalAfecha', align: 'end', sortable: true },
        { title: 'Estado Entrega', key: 'estado', align: 'center', sortable: false }
      ],

      headersCamionPedidos: [
        { title: 'Opciones', key: 'opc', align: 'center', sortable: false },
        { title: 'Nº Pedido', key: 'noPedido', align: 'center', sortable: true },
        { title: 'Cliente', key: 'cliente', align: 'start', sortable: true },
        { title: 'Dirección de Entrega', key: 'enviarA', align: 'start', sortable: true },
        { title: 'Fecha Entregado', key: 'fechaEntregado', align: 'center', sortable: true },
        { title: 'Estado', key: 'estado', align: 'center', sortable: true },
        { title: 'Total', key: 'totalAfecha', align: 'end', sortable: true }
      ],

      pedidosList: []
    }
  },

  computed: {
    hasActiveAdvancedFilters() {
      return !!(
        this.search.fechaEntregadoDesde ||
        this.search.fechaEntregadoHasta ||
        this.search.fechaEntregaProgramadaDesde ||
        this.search.fechaEntregaProgramadaHasta
      )
    },
    totalPendientesEntregaCount() {
      return this.pedidosList.filter(p => {
        const est = (p.estado || '').toLowerCase()
        return est.includes('asignad') || p.idEstadoActual === 5 || !p.fechaEntregado
      }).length
    },
    totalEntregadosTotalCount() {
      return this.pedidosList.filter(p => p.fechaEntregado || p.idEstadoActual === 3).length
    },
    totalMontoEntregado() {
      return this.pedidosList.reduce((acc, item) => acc + (item.totalAfecha || 0), 0)
    },
    montoTotalCamion() {
      return this.pedidosCamionList.reduce((acc, p) => acc + (p.totalAfecha || 0), 0)
    },
    esEntregaTotalCalculada() {
      if (!this.entregaForm.items || this.entregaForm.items.length === 0) return true
      for (const item of this.entregaForm.items) {
        if (!item.incluido || Number(item.cantidadEntregada) !== Number(item.cantidadOriginal)) {
          return false
        }
      }
      return true
    },
    montoTotalEntregaCalculado() {
      if (!this.entregaForm.items) return 0
      return this.entregaForm.items.reduce((acc, item) => {
        if (!item.incluido) return acc
        const cant = Number(item.cantidadEntregada) || 0
        const precio = Number(item.precioUnitarioAfecha) || 0
        return acc + (cant * precio)
      }, 0)
    }
  },

  mounted() {
    this.applyQuickFilter('a_entregar_hoy')
    this.loadClientes()
    this.loadEstados()
    this.loadCamiones()
  },

  methods: {
    showNotification(text, color = 'success') {
      this.snackbar.text = text
      this.snackbar.color = color
      this.snackbar.show = true
    },

    formatDateStr(d) {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    getTodayStr() {
      return this.formatDateStr(new Date())
    },

    applyQuickFilter(type) {
      const now = new Date()
      const hoy = this.formatDateStr(now)

      this.search.fechaEntregadoDesde = null
      this.search.fechaEntregadoHasta = null
      this.search.fechaEntregaProgramadaDesde = null
      this.search.fechaEntregaProgramadaHasta = null

      if (type === 'a_entregar_hoy') {
        this.search.quickFilter = 'a_entregar_hoy'
        this.search.fechaEntregaProgramadaDesde = hoy
        this.search.fechaEntregaProgramadaHasta = hoy
      } else if (type === 'entregados_ayer') {
        const dAyer = new Date()
        dAyer.setDate(dAyer.getDate() - 1)
        const ayer = this.formatDateStr(dAyer)
        this.search.quickFilter = 'entregados_ayer'
        this.search.fechaEntregadoDesde = ayer
        this.search.fechaEntregadoHasta = ayer
      } else if (type === 'entregados_semana') {
        const dSemana = new Date()
        const dayOfWeek = dSemana.getDay()
        const diffToMonday = dSemana.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
        const monday = new Date(dSemana.setDate(diffToMonday))
        const inicioSemana = this.formatDateStr(monday)

        const sundayDate = new Date(monday)
        sundayDate.setDate(sundayDate.getDate() + 6)
        const finSemana = this.formatDateStr(sundayDate)

        this.search.quickFilter = 'entregados_semana'
        this.search.fechaEntregadoDesde = inicioSemana
        this.search.fechaEntregadoHasta = finSemana
      } else {
        this.search.quickFilter = null
      }

      this.getPedidosEntrega()
    },

    clearFilters() {
      this.search = {
        quickFilter: null,
        noPedido: null,
        fechaEntregadoDesde: null,
        fechaEntregadoHasta: null,
        fechaEntregaProgramadaDesde: null,
        fechaEntregaProgramadaHasta: null,
        idCliente: null,
        idEstadoActual: null,
        idCamionAsignado: null
      }
      this.showAdvancedFilters = false
      this.getPedidosEntrega()
    },

    async getPedidosEntrega() {
      this.loading = true
      const req = {
        fechaEntregadoDesde: this.search.fechaEntregadoDesde || null,
        fechaEntregadoHasta: this.search.fechaEntregadoHasta || null,
        fechaEntregaProgramadaDesde: this.search.fechaEntregaProgramadaDesde || null,
        fechaEntregaProgramadaHasta: this.search.fechaEntregaProgramadaHasta || null,
        idCliente: this.search.idCliente || null,
        idEstadoActual: this.search.idEstadoActual || null,
        idCamionAsignado: this.search.idCamionAsignado || null,
        noPedido: this.search.noPedido || null
      }

      try {
        const res = await this.requestHttp.getPedidos(req)
        if (res.code === 200) {
          // Filtrar estrictamente solo pedidos con estado: Asignado, Entregado o Entrega Parcial
          this.pedidosList = (res.data || []).filter(p => {
            const estado = (p.estado || '').toLowerCase().trim()

            // Si es Pendiente, Programado o Cancelado, excluir rotundamente
            if (
              estado.includes('pendient') ||
              estado.includes('programad') ||
              estado.includes('cancelad') ||
              p.idEstadoActual === 1
            ) {
              return false
            }

            // Únicamente permitir Asignado, Entregado o Entrega Parcial
            return (
              estado.includes('asignad') ||
              estado.includes('entregad') ||
              estado.includes('parcial') ||
              p.idEstadoActual === 3 ||
              p.idEstadoActual === 5
            )
          })
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
          this.cmb.estados = res.data
            .filter(e => {
              const title = (e.title || '').toLowerCase().trim()
              if (title.includes('pendient') || title.includes('programad') || title.includes('cancelad')) {
                return false
              }
              return title.includes('asignad') || title.includes('entregad') || title.includes('parcial')
            })
            .map(e => ({ title: e.title, value: e.value }))
        }
      } catch (e) {
        console.error(e)
      }
    },

    async loadCamiones() {
      try {
        const res = await this.requestHttp.getCamiones()
        if (res.code === 200) {
          this.cmb.camiones = (res.data || []).map(c => ({
            title: c.placa,
            value: c.idCamion
          }))
        }
      } catch (e) {
        console.error(e)
      }
    },

    getEstadoColor(id) {
      const colors = { 1: 'warning', 2: 'info', 3: 'success', 4: 'error', 5: 'indigo' }
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
    },

    async openPedidosCamionDialog(item) {
      if (!item.idCamionAsignado) return

      this.selectedCamionInfo = {
        idCamion: item.idCamionAsignado,
        placa: item.camionAsignado,
        entregador: item.nombreEntregadorAsignado
      }
      this.pedidosCamionList = []
      this.dialogs.camionPedidos = true

      this.loadingCamionPedidos = true
      try {
        const res = await this.requestHttp.getPedidosPorCamion(item.idCamionAsignado)
        if (res.code === 200) {
          this.pedidosCamionList = res.data || []
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingCamionPedidos = false
      }
    },

    async openEntregaDialog(item) {
      try {
        const res = await this.requestHttp.getPedidoById(item.idPedido)
        if (res.code === 200) {
          this.selectedPedido = res.data
        } else {
          this.selectedPedido = item
        }
      } catch (e) {
        this.selectedPedido = item
      }

      const detalles = this.selectedPedido.detallePedido || []
      this.entregaForm.items = detalles.map(d => ({
        idProducto: d.idProducto,
        codigoProducto: d.codigoProducto,
        producto: d.producto,
        cantidadOriginal: d.cantidad,
        cantidadEntregada: d.cantidad,
        precioUnitarioAfecha: d.precioUnitarioAfecha,
        incluido: true,
        observaciones: d.observaciones || ''
      }))

      this.dialogs.entrega = true
    },

    async guardarEntregaPedido() {
      const itemsIncluidos = this.entregaForm.items.filter(i => i.incluido && Number(i.cantidadEntregada) > 0)
      if (itemsIncluidos.length === 0) {
        this.showNotification('Debe marcar al menos un producto recibido con cantidad mayor a cero', 'warning')
        return
      }

      for (const item of itemsIncluidos) {
        if (Number(item.cantidadEntregada) > Number(item.cantidadOriginal)) {
          this.showNotification(`La cantidad entregada de ${item.producto} no puede superar la cantidad pedida (${item.cantidadOriginal})`, 'warning')
          return
        }
      }

      this.saving = true
      try {
        const payload = {
          idPedido: this.selectedPedido.idPedido,
          detalleEntregado: itemsIncluidos.map(i => ({
            idProducto: i.idProducto,
            cantidad: Number(i.cantidadEntregada),
            observaciones: i.observaciones || null
          }))
        }

        const res = await this.requestHttp.marcarPedidoEntregado(
          this.selectedPedido.idPedido,
          payload
        )

        if (res.code === 200) {
          this.dialogs.entrega = false
          if (this.dialogView) this.dialogView = false
          this.showNotification(
            res.data?.msg || 'Entrega de pedido registrada correctamente.',
            'success'
          )
          this.getPedidosEntrega()
        } else {
          this.showNotification(
            res.data?.msg || 'Error al registrar la entrega del pedido',
            'error'
          )
        }
      } catch (e) {
        console.error(e)
        this.showNotification(
          'Error al conectar con el servidor para registrar la entrega',
          'error'
        )
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
