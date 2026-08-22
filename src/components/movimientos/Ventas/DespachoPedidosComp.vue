<template>
  <div class="w-100 pa-4">
    <v-card class="border-t border-b" elevation="0" rounded="0">
      <!-- Encabezado -->
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <v-avatar color="amber-lighten-5" class="me-3" size="40">
            <v-icon color="amber-darken-3" size="24">mdi-truck-fast</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold text-indigo-darken-4">
              Despacho de Pedidos
            </div>
            <div class="text-caption text-grey-darken-2">
              Gestión de salidas, asignación de camiones, entregadores y control de despacho
            </div>
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn
          color="amber-darken-3"
          variant="flat"
          prepend-icon="mdi-refresh"
          class="text-none font-weight-medium"
          @click="getPedidosDespacho()"
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
            <v-icon color="amber-darken-3" class="mr-2">mdi-filter-variant</v-icon>
            <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">Filtros de búsqueda</span>
          </div>
          <div class="d-flex align-center ga-2">
            <v-btn
              size="small"
              :variant="showAdvancedFilters ? 'flat' : 'outlined'"
              :color="showAdvancedFilters ? 'amber-darken-3' : 'indigo-darken-2'"
              prepend-icon="mdi-tune-variant"
              @click="showAdvancedFilters = !showAdvancedFilters"
              class="text-none"
            >
              {{ showAdvancedFilters ? 'Ocultar Filtros Avanzados' : 'Filtros Avanzados' }}
              <v-badge v-if="hasActiveAdvancedFilters" dot color="amber-darken-3" class="ml-1" />
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
          <span class="text-caption font-weight-bold text-grey-darken-2 me-1">Filtros Rápidos (por Entrega Programada):</span>

          <v-btn
            size="small"
            :variant="search.quickFilter === 'programados_hoy' ? 'flat' : 'tonal'"
            color="amber-darken-3"
            prepend-icon="mdi-calendar-today"
            class="text-none font-weight-medium"
            @click="applyQuickFilter('programados_hoy')"
          >
            Programados para entregar hoy
          </v-btn>

          <v-btn
            size="small"
            :variant="search.quickFilter === 'programados_manana' ? 'flat' : 'tonal'"
            color="amber-darken-4"
            prepend-icon="mdi-calendar-arrow-right"
            class="text-none font-weight-medium"
            @click="applyQuickFilter('programados_manana')"
          >
            Programados para entregar mañana
          </v-btn>

          <v-btn
            size="small"
            :variant="search.quickFilter === 'programados_semana' ? 'flat' : 'tonal'"
            color="indigo-darken-3"
            prepend-icon="mdi-calendar-range"
            class="text-none font-weight-medium"
            @click="applyQuickFilter('programados_semana')"
          >
            Programados para la semana
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
          <div v-show="showAdvancedFilters" class="mt-4 pt-3 border-t bg-amber-lighten-5 pa-3 rounded-lg">
            <div class="text-caption font-weight-bold text-amber-darken-4 mb-2 d-flex align-center">
              <v-icon size="small" class="me-1" color="amber-darken-3">mdi-calendar-range</v-icon>
              Rangos de Fechas Avanzados
            </div>
            <v-row dense>
              <!-- 1. Rango Fecha Entrega Programada -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-2 bg-white rounded-lg border-amber-lighten-4 h-100">
                  <div class="text-caption font-weight-bold text-amber-darken-4 mb-2 d-flex align-center">
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
                        color="amber-darken-3"
                        @change="getPedidosDespacho()"
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
                        color="amber-darken-3"
                        @change="getPedidosDespacho()"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <!-- 2. Rango Fecha Atendido -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-2 bg-white rounded-lg border-amber-lighten-4 h-100">
                  <div class="text-caption font-weight-bold text-indigo-darken-3 mb-2 d-flex align-center">
                    <v-icon size="x-small" class="me-1">mdi-calendar-check</v-icon>
                    Fecha Atendido
                  </div>
                  <v-row dense>
                    <v-col cols="6">
                      <v-text-field
                        v-model="search.fechaAtencionDesde"
                        label="Desde"
                        type="date"
                        density="compact"
                        variant="outlined"
                        hide-details
                        color="indigo"
                        @change="getPedidosDespacho()"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="search.fechaAtencionHasta"
                        label="Hasta"
                        type="date"
                        density="compact"
                        variant="outlined"
                        hide-details
                        color="indigo"
                        @change="getPedidosDespacho()"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-card>

      <!-- MÉTRICAS DE DESPACHO -->
      <v-row dense class="px-4 mb-2">
        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" color="amber-lighten-5" class="pa-3 rounded-lg border-amber-lighten-4 border">
            <div class="d-flex align-center">
              <v-avatar color="amber-darken-3" class="mr-3 text-white">
                <v-icon>mdi-calendar-clock</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-amber-darken-4 font-weight-bold">
                  Total Pedidos Programados
                </div>
                <div class="text-h6 font-weight-bold text-amber-darken-4">
                  {{ totalPedidosProgramadosCount }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" color="indigo-lighten-5" class="pa-3 rounded-lg border-indigo-lighten-4 border">
            <div class="d-flex align-center">
              <v-avatar color="indigo-darken-3" class="mr-3 text-white">
                <v-icon>mdi-truck-fast</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-indigo-darken-4 font-weight-bold">
                  Total Pedidos Asignados
                </div>
                <div class="text-h6 font-weight-bold text-indigo-darken-4">
                  {{ totalPedidosAsignadosCount }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="12">
          <v-card variant="flat" color="green-lighten-5" class="pa-3 rounded-lg border-green-lighten-4 border">
            <div class="d-flex align-center">
              <v-avatar color="green-darken-3" class="mr-3 text-white">
                <v-icon>mdi-cash-multiple</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-green-darken-4 font-weight-bold">
                  Total Monto Despacho
                </div>
                <div class="text-h6 font-weight-bold text-green-darken-4">
                  {{ formatCurrency(totalDespachoMonto) }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- TABLA DE DESPACHOS -->
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
                color="amber-darken-3"
                placeholder="Filtrar Nº"
                style="min-width: 100px; max-width: 130px;"
                @update:model-value="getPedidosDespacho()"
                @click:clear="getPedidosDespacho()"
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
                color="amber-darken-3"
                placeholder="Todos los clientes"
                style="min-width: 170px; max-width: 240px;"
                @update:model-value="getPedidosDespacho()"
                @click:clear="getPedidosDespacho()"
              />
            </div>
          </template>

          <template v-slot:header.camionAsignado="{ column }">
            <div class="d-flex flex-column align-center py-1 ga-1 w-100">
              <span class="font-weight-bold text-caption text-indigo-darken-4">Camión Asignado</span>
              <v-autocomplete
                v-model="search.idCamionAsignado"
                :items="cmb.camiones"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                color="amber-darken-3"
                placeholder="Todos"
                style="min-width: 130px; max-width: 160px;"
                @update:model-value="getPedidosDespacho()"
                @click:clear="getPedidosDespacho()"
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
                color="amber-darken-3"
                placeholder="Todos"
                style="min-width: 120px; max-width: 150px;"
                @update:model-value="getPedidosDespacho()"
                @click:clear="getPedidosDespacho()"
              />
            </div>
          </template>

          <!-- PLANTILLAS DE CELDA -->
          <template v-slot:item.noPedido="{ item }">
            <span class="font-weight-bold text-amber-darken-4">{{ item.noPedido }}</span>
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
              color="amber-darken-4"
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
                Ver pedidos cargados en el camión {{ item.camionAsignado }}
              </v-tooltip>
            </v-chip>
            <span v-else class="text-caption text-grey-darken-1 font-italic">Sin asignar</span>
          </template>

          <template v-slot:item.nombreEntregadorAsignado="{ item }">
            <div v-if="item.nombreEntregadorAsignado" class="d-flex align-center">
              <v-icon size="16" color="indigo" class="me-1">mdi-account-badge-outline</v-icon>
              <span class="text-body-2 font-weight-bold text-grey-darken-4">{{ item.nombreEntregadorAsignado }}</span>
            </div>
            <span v-else class="text-caption text-grey-darken-1 font-italic">Sin asignación</span>
          </template>

          <template v-slot:item.fechaEntregaSolicitada="{ item }">
            <span class="text-body-2 font-weight-medium">{{ formatDate(item.fechaEntregaSolicitada) }}</span>
          </template>

          <template v-slot:item.fechaEntregaProgramada="{ item }">
            <span class="text-body-2 font-weight-bold text-amber-darken-4">
              {{ item.fechaEntregaProgramada ? formatDate(item.fechaEntregaProgramada) : 'Sin programar' }}
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
                color="amber-darken-3"
                variant="text"
                @click="viewPedidoDetail(item)"
              >
                <v-icon size="20">mdi-eye</v-icon>
                <v-tooltip activator="parent" location="top">Ver detalle despacho</v-tooltip>
              </v-btn>

              <v-btn
                icon
                size="small"
                :color="item.idCamionAsignado ? 'indigo-darken-3' : 'amber-darken-4'"
                variant="text"
                @click="openAsignarDialog(item)"
              >
                <v-icon size="20">
                  {{ item.idCamionAsignado ? 'mdi-truck-check' : 'mdi-truck-cargo-container' }}
                </v-icon>
                <v-tooltip activator="parent" location="top">
                  {{ item.idCamionAsignado ? 'Reasignar y Cargar' : 'Asignar y Cargar' }}
                </v-tooltip>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-card>

    <!-- DIÁLOGO DE VISUALIZACIÓN ESPECIAL: PEDIDOS POR CAMIÓN -->
    <v-dialog v-model="dialogs.camionPedidos" max-width="950" persistent>
      <v-card v-if="selectedCamionInfo" class="rounded-lg overflow-hidden elevation-12">
        <!-- Encabezado del diálogo -->
        <v-card-title class="d-flex align-center bg-amber-darken-4 text-white py-3 px-4">
          <v-avatar size="36" color="white" class="me-3" variant="flat">
            <v-icon color="amber-darken-4" size="22">mdi-truck-cargo-container</v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              Pedidos Cargados en Camión: {{ selectedCamionInfo.placa }}
            </div>
            <div class="text-caption text-amber-lighten-4">
              Entregador Responsable: <span class="font-weight-bold text-white">{{ selectedCamionInfo.entregador || 'Sin asignar' }}</span>
            </div>
          </div>
          <v-spacer />
          <v-btn variant="text" icon size="small" color="white" @click="dialogs.camionPedidos = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4 bg-grey-lighten-5" style="max-height: 80vh; overflow-y: auto;">
          <!-- BANNER RESUMEN DEL VEHÍCULO -->
          <v-row dense class="mb-3">
            <v-col cols="12" md="4">
              <v-card variant="flat" class="pa-3 border rounded-lg bg-white">
                <div class="text-caption text-grey-darken-2 font-weight-bold">Total Pedidos Asignados</div>
                <div class="text-h6 font-weight-bold text-amber-darken-4">
                  {{ pedidosCamionList.length }} pedido(s)
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card variant="flat" class="pa-3 border rounded-lg bg-white">
                <div class="text-caption text-grey-darken-2 font-weight-bold">Monto Total de Carga</div>
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

          <!-- SELECCIÓN DE PESTAÑAS (PEDIDOS VS PRODUCTOS) -->
          <v-tabs v-model="tabCamion" color="amber-darken-4" class="mb-3 border-b">
            <v-tab value="pedidos" class="text-none font-weight-bold">
              <v-icon start size="18">mdi-format-list-bulleted</v-icon>
              Listado de Pedidos ({{ pedidosCamionList.length }})
            </v-tab>
            <v-tab value="productos" class="text-none font-weight-bold">
              <v-icon start size="18">mdi-package-variant-closed</v-icon>
              Consolidado de Mercancía Cargada ({{ resumenProductosCamion.length }})
            </v-tab>
          </v-tabs>

          <v-window v-model="tabCamion">
            <!-- TAB 1: LISTADO DE PEDIDOS DEL CAMIÓN -->
            <v-window-item value="pedidos">
              <v-card variant="flat" class="border rounded-lg bg-white">
                <v-data-table
                  :headers="headersCamionPedidos"
                  :items="pedidosCamionList"
                  :loading="loadingCamionPedidos"
                  density="compact"
                  class="rounded"
                  :items-per-page="10"
                >
                  <template v-slot:item.noPedido="{ item }">
                    <span class="font-weight-bold text-amber-darken-4">{{ item.noPedido }}</span>
                  </template>

                  <template v-slot:item.cliente="{ item }">
                    <span class="font-weight-bold text-grey-darken-4">{{ item.cliente }}</span>
                  </template>

                  <template v-slot:item.enviarA="{ item }">
                    <span class="text-body-2 text-grey-darken-4">{{ item.enviarA || '—' }}</span>
                  </template>

                  <template v-slot:item.fechaEntregaProgramada="{ item }">
                    <span class="text-body-2 font-weight-medium">
                      {{ item.fechaEntregaProgramada ? formatDate(item.fechaEntregaProgramada) : '—' }}
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
                      color="amber-darken-3"
                      variant="text"
                      @click="viewPedidoDetail(item)"
                    >
                      <v-icon size="18">mdi-eye</v-icon>
                      <v-tooltip activator="parent" location="top">Ver detalle pedido</v-tooltip>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card>
            </v-window-item>

            <!-- TAB 2: CONSOLIDADO DE MERCANCÍA EN BODEGA CAMIÓN -->
            <v-window-item value="productos">
              <v-card variant="flat" class="border rounded-lg bg-white pa-3">
                <div class="text-caption font-weight-bold text-indigo-darken-4 mb-2">
                  Mercancía total trasladada a la bodega del camión {{ selectedCamionInfo.placa }}:
                </div>
                <v-table density="compact" class="border rounded">
                  <thead>
                    <tr class="bg-amber-lighten-5">
                      <th class="font-weight-bold text-body-2 text-amber-darken-4">Código</th>
                      <th class="font-weight-bold text-body-2 text-amber-darken-4">Producto</th>
                      <th class="text-center font-weight-bold text-body-2 text-amber-darken-4">Cantidad Total en Camión</th>
                      <th class="text-right font-weight-bold text-body-2 text-amber-darken-4">Monto Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="prod in resumenProductosCamion" :key="prod.idProducto">
                      <td class="text-body-2 font-weight-medium text-amber-darken-4">{{ prod.codigoProducto || '—' }}</td>
                      <td class="text-body-2 font-weight-bold text-grey-darken-4">{{ prod.producto }}</td>
                      <td class="text-center">
                        <v-chip color="amber-darken-3" size="small" variant="flat" class="font-weight-bold px-3">
                          {{ prod.cantidadTotal }}
                        </v-chip>
                      </td>
                      <td class="text-right text-body-2 font-weight-bold text-success-darken-2">{{ formatCurrency(prod.subtotalTotal) }}</td>
                    </tr>
                    <tr v-if="!resumenProductosCamion || resumenProductosCamion.length === 0">
                      <td colspan="4" class="text-center text-grey-darken-3 text-body-2 py-4 font-italic">
                        No hay productos cargados registrados en este vehículo.
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>
            </v-window-item>
          </v-window>
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

    <!-- DIÁLOGO DE DETALLE DE DESPACHO -->
    <v-dialog v-model="dialogView" max-width="850" persistent>
      <v-card v-if="selectedPedido" class="rounded-lg overflow-hidden elevation-12">
        <v-card-title class="d-flex align-center bg-amber-darken-4 text-white py-2 px-4">
          <v-avatar size="36" color="white" class="me-3" variant="flat">
            <v-icon color="amber-darken-4" size="22">mdi-truck-fast</v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">Detalle de Despacho</div>
            <div class="text-caption text-amber-lighten-4">
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
                  <v-icon color="amber-darken-3" size="20" class="me-2">mdi-truck-clock</v-icon>
                  <h4 class="font-weight-bold text-amber-darken-4 text-subtitle-1">Datos de Programación y Vehículo</h4>
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Cliente:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-amber-darken-4">{{ selectedPedido.cliente }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Camión Asignado:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-amber-darken-4">
                      {{ selectedPedido.camionAsignado || 'Sin asignar' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Entregador Asignado:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-indigo-darken-4">
                      {{ selectedPedido.nombreEntregadorAsignado || 'Sin asignación' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Fecha Solicitada:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-grey-darken-4">{{ formatDate(selectedPedido.fechaEntregaSolicitada) }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item class="px-0 py-1">
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Fecha Programada:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 font-weight-bold text-amber-darken-4">{{ formatDate(selectedPedido.fechaEntregaProgramada) || 'Sin asignar' }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card variant="flat" class="border rounded-lg bg-white pa-4 mb-3 h-100">
                <div class="d-flex align-center mb-3">
                  <v-icon color="amber-darken-3" size="20" class="me-2">mdi-map-marker-distance</v-icon>
                  <h4 class="font-weight-bold text-amber-darken-4 text-subtitle-1">Destino y Entrega</h4>
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
                    <v-list-item-title class="text-body-2 font-weight-medium text-grey-darken-3">Observaciones:</v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 text-grey-darken-4 font-italic">{{ selectedPedido.observaciones || 'Sin observaciones' }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <!-- DETALLE DE PRODUCTOS -->
            <v-col cols="12">
              <v-card variant="flat" class="border rounded-lg bg-white pa-4">
                <div class="d-flex align-center justify-space-between mb-3">
                  <h4 class="font-weight-bold text-amber-darken-4 text-subtitle-1">Productos a Despachar</h4>
                  <div class="text-subtitle-1 font-weight-bold text-indigo-darken-4">
                    Total: <span class="text-success-darken-2 text-h6 font-weight-bold">{{ formatCurrency(selectedPedido.totalAfecha) }}</span>
                  </div>
                </div>

                <v-table density="compact" class="border rounded">
                  <thead>
                    <tr class="bg-amber-lighten-5">
                      <th class="font-weight-bold text-body-2 text-amber-darken-4">Código</th>
                      <th class="font-weight-bold text-body-2 text-amber-darken-4">Producto</th>
                      <th class="text-center font-weight-bold text-body-2 text-amber-darken-4">Cantidad</th>
                      <th class="text-right font-weight-bold text-body-2 text-amber-darken-4">Precio Unit.</th>
                      <th class="text-right font-weight-bold text-body-2 text-amber-darken-4">Subtotal</th>
                      <th class="font-weight-bold text-body-2 text-amber-darken-4">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedPedido.detallePedido" :key="item.idDetallePedido">
                      <td class="text-body-2 font-weight-medium text-amber-darken-4">{{ item.codigoProducto || '—' }}</td>
                      <td class="text-body-2 font-weight-bold text-grey-darken-4">{{ item.producto }}</td>
                      <td class="text-center text-body-2 font-weight-bold text-grey-darken-4">{{ item.cantidad }}</td>
                      <td class="text-right text-body-2 font-weight-medium text-grey-darken-4">{{ formatCurrency(item.precioUnitarioAfecha) }}</td>
                      <td class="text-right text-body-2 font-weight-bold text-success-darken-2">{{ formatCurrency(item.cantidad * item.precioUnitarioAfecha) }}</td>
                      <td class="text-body-2 text-grey-darken-3 font-italic">{{ item.observaciones || '—' }}</td>
                    </tr>
                    <tr v-if="!selectedPedido.detallePedido || selectedPedido.detallePedido.length === 0">
                      <td colspan="6" class="text-center text-grey-darken-3 text-body-2 py-4 font-italic">
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
            color="indigo-darken-3"
            variant="flat"
            prepend-icon="mdi-truck-cargo-container"
            class="text-none font-weight-bold"
            @click="openAsignarDialog(selectedPedido)"
          >
            {{ selectedPedido.idCamionAsignado ? 'Reasignar y Cargar' : 'Asignar y Cargar' }}
          </v-btn>
          <v-spacer />
          <v-btn color="grey-darken-2" variant="tonal" @click="dialogView = false" prepend-icon="mdi-close">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIÁLOGO DE ASIGNAR Y CARGAR PEDIDO A CAMIÓN -->
    <v-dialog v-model="dialogs.asignar" max-width="750" persistent>
      <v-card v-if="selectedPedido" class="rounded-lg overflow-hidden elevation-12">
        <!-- Encabezado del diálogo -->
        <v-card-title class="d-flex align-center bg-indigo-darken-4 text-white py-3 px-4">
          <v-avatar size="36" color="white" class="me-3" variant="flat">
            <v-icon color="indigo-darken-4" size="22">mdi-truck-cargo-container</v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              {{ selectedPedido.idCamionAsignado ? 'Reasignar y Cargar Pedido' : 'Asignar y Cargar Pedido' }}
            </div>
            <div class="text-caption text-indigo-lighten-4">
              Nº Pedido: <span class="font-weight-bold text-white">{{ selectedPedido.noPedido }}</span>
              — {{ selectedPedido.cliente }}
            </div>
          </div>
          <v-spacer />
          <v-btn variant="text" icon size="small" color="white" @click="dialogs.asignar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4 bg-grey-lighten-5" style="max-height: 80vh; overflow-y: auto;">
          <!-- Formulario de Asignación -->
          <v-card variant="flat" class="pa-4 mb-4 rounded-lg bg-white border">
            <div class="d-flex align-center mb-3">
              <v-icon color="indigo-darken-3" class="me-2" size="20">mdi-truck-fast-outline</v-icon>
              <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">Datos del Camión y Entregador</span>
            </div>

            <v-form ref="formAsignar" v-model="formAsignarValid">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="asignarForm.idCamion"
                    :items="cmb.camiones"
                    label="Seleccionar Camión a Asignar"
                    variant="outlined"
                    density="compact"
                    color="indigo-darken-3"
                    clearable
                    prepend-inner-icon="mdi-truck"
                    :rules="[v => !!v || 'Debe seleccionar un camión']"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="asignarForm.nombreEntregador"
                    label="Nombre del Entregador"
                    variant="outlined"
                    density="compact"
                    color="indigo-darken-3"
                    placeholder="Ej. Juan Pérez"
                    prepend-inner-icon="mdi-account-badge"
                    :rules="[v => !!v || 'El nombre del entregador es requerido']"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card>

          <!-- Detalle de productos a cargar -->
          <v-card variant="flat" class="pa-4 rounded-lg bg-white border">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="d-flex align-center">
                <v-icon color="amber-darken-3" class="me-2" size="20">mdi-package-variant-closed</v-icon>
                <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">Detalle del Pedido a Cargar en el Camión</span>
              </div>
              <v-chip color="success" size="small" variant="tonal" class="font-weight-bold">
                Total: {{ formatCurrency(selectedPedido.totalAfecha) }}
              </v-chip>
            </div>

            <v-alert
              type="info"
              variant="tonal"
              density="compact"
              class="mb-3 text-caption"
              icon="mdi-information-outline"
            >
              Al confirmar <strong>Asignar y Cargar</strong>, la mercancía detallada abajo se descontará del inventario total y se trasladará directamente a la bodega del camión seleccionado.
            </v-alert>

            <v-table density="compact" class="border rounded">
              <thead>
                <tr class="bg-indigo-lighten-5">
                  <th class="font-weight-bold text-body-2 text-indigo-darken-4">Código</th>
                  <th class="font-weight-bold text-body-2 text-indigo-darken-4">Producto</th>
                  <th class="text-center font-weight-bold text-body-2 text-indigo-darken-4">Cantidad a Cargar</th>
                  <th class="text-right font-weight-bold text-body-2 text-indigo-darken-4">Precio Unit.</th>
                  <th class="text-right font-weight-bold text-body-2 text-indigo-darken-4">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in (selectedPedido.detallePedido || [])" :key="item.idDetallePedido">
                  <td class="text-body-2 font-weight-medium text-indigo-darken-4">{{ item.codigoProducto || '—' }}</td>
                  <td class="text-body-2 font-weight-bold text-grey-darken-4">{{ item.producto }}</td>
                  <td class="text-center text-body-2 font-weight-bold text-amber-darken-4">
                    <v-chip color="amber-darken-3" size="x-small" variant="flat" class="font-weight-bold px-2">
                      {{ item.cantidad }}
                    </v-chip>
                  </td>
                  <td class="text-right text-body-2 font-weight-medium text-grey-darken-4">{{ formatCurrency(item.precioUnitarioAfecha) }}</td>
                  <td class="text-right text-body-2 font-weight-bold text-success-darken-2">{{ formatCurrency(item.cantidad * item.precioUnitarioAfecha) }}</td>
                </tr>
                <tr v-if="!selectedPedido.detallePedido || selectedPedido.detallePedido.length === 0">
                  <td colspan="5" class="text-center text-grey-darken-3 text-body-2 py-4 font-italic">
                    No se encontraron productos registrados en este pedido.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-card-text>

        <v-divider />
        <v-card-actions class="bg-grey-lighten-4 px-4 py-2">
          <v-spacer />
          <v-btn color="grey-darken-2" variant="tonal" @click="dialogs.asignar = false">
            Cancelar
          </v-btn>
          <v-btn
            color="indigo-darken-3"
            variant="flat"
            prepend-icon="mdi-truck-check"
            class="text-none font-weight-bold"
            :loading="saving"
            @click="guardarAsignacionPedido()"
          >
            Asignar y Cargar
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
  name: 'DespachoPedidosComp',

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
      tabCamion: 'pedidos',
      showAdvancedFilters: false,
      formAsignarValid: false,

      dialogs: {
        asignar: false,
        camionPedidos: false
      },

      asignarForm: {
        idCamion: null,
        nombreEntregador: ''
      },

      snackbar: {
        show: false,
        text: '',
        color: 'success'
      },

      search: {
        quickFilter: 'programados_hoy',
        noPedido: null,
        fechaEntregaProgramadaDesde: null,
        fechaEntregaProgramadaHasta: null,
        fechaAtencionDesde: null,
        fechaAtencionHasta: null,
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
        { title: 'Ruta', key: 'rutaCliente', align: 'start', sortable: true },
        { title: 'Entrega Solicitada', key: 'fechaEntregaSolicitada', align: 'center', sortable: true },
        { title: 'Entrega Programada', key: 'fechaEntregaProgramada', align: 'center', sortable: true },
        { title: 'Total', key: 'totalAfecha', align: 'end', sortable: true },
        { title: 'Estado Despacho', key: 'estado', align: 'center', sortable: false }
      ],

      headersCamionPedidos: [
        { title: 'Opciones', key: 'opc', align: 'center', sortable: false },
        { title: 'Nº Pedido', key: 'noPedido', align: 'center', sortable: true },
        { title: 'Cliente', key: 'cliente', align: 'start', sortable: true },
        { title: 'Dirección de Entrega', key: 'enviarA', align: 'start', sortable: true },
        { title: 'Fecha Programada', key: 'fechaEntregaProgramada', align: 'center', sortable: true },
        { title: 'Estado', key: 'estado', align: 'center', sortable: true },
        { title: 'Total', key: 'totalAfecha', align: 'end', sortable: true }
      ],

      pedidosList: []
    }
  },

  computed: {
    hasActiveAdvancedFilters() {
      return !!(
        this.search.fechaEntregaProgramadaDesde ||
        this.search.fechaEntregaProgramadaHasta ||
        this.search.fechaAtencionDesde ||
        this.search.fechaAtencionHasta
      )
    },
    totalPedidosProgramadosCount() {
      return this.pedidosList.filter(p => {
        const est = (p.estado || '').toLowerCase()
        return est.includes('programad') || p.idEstadoActual === 2
      }).length
    },
    totalPedidosAsignadosCount() {
      return this.pedidosList.filter(p => {
        const est = (p.estado || '').toLowerCase()
        return est.includes('asignad') || p.idEstadoActual === 5
      }).length
    },
    totalDespachoMonto() {
      return this.pedidosList.reduce((acc, item) => acc + (item.totalAfecha || 0), 0)
    },
    montoTotalCamion() {
      return this.pedidosCamionList.reduce((acc, p) => acc + (p.totalAfecha || 0), 0)
    },
    resumenProductosCamion() {
      const map = new Map()
      this.pedidosCamionList.forEach(p => {
        if (p.detallePedido && Array.isArray(p.detallePedido)) {
          p.detallePedido.forEach(d => {
            const id = d.idProducto
            if (!map.has(id)) {
              map.set(id, {
                idProducto: id,
                codigoProducto: d.codigoProducto,
                producto: d.producto,
                cantidadTotal: 0,
                subtotalTotal: 0
              })
            }
            const item = map.get(id)
            item.cantidadTotal += d.cantidad || 0
            item.subtotalTotal += (d.cantidad || 0) * (d.precioUnitarioAfecha || 0)
          })
        }
      })
      return Array.from(map.values())
    }
  },

  mounted() {
    this.applyQuickFilter('programados_hoy')
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

      this.search.fechaEntregaProgramadaDesde = null
      this.search.fechaEntregaProgramadaHasta = null
      this.search.fechaAtencionDesde = null
      this.search.fechaAtencionHasta = null

      if (type === 'programados_hoy') {
        this.search.quickFilter = 'programados_hoy'
        this.search.fechaEntregaProgramadaDesde = hoy
        this.search.fechaEntregaProgramadaHasta = hoy
      } else if (type === 'programados_manana') {
        const dManana = new Date()
        dManana.setDate(dManana.getDate() + 1)
        const manana = this.formatDateStr(dManana)
        this.search.quickFilter = 'programados_manana'
        this.search.fechaEntregaProgramadaDesde = manana
        this.search.fechaEntregaProgramadaHasta = manana
      } else if (type === 'programados_semana') {
        const dSemana = new Date()
        const dayOfWeek = dSemana.getDay()
        const diffToMonday = dSemana.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
        const monday = new Date(dSemana.setDate(diffToMonday))
        const inicioSemana = this.formatDateStr(monday)

        const sundayDate = new Date(monday)
        sundayDate.setDate(sundayDate.getDate() + 6)
        const finSemana = this.formatDateStr(sundayDate)

        this.search.quickFilter = 'programados_semana'
        this.search.fechaEntregaProgramadaDesde = inicioSemana
        this.search.fechaEntregaProgramadaHasta = finSemana
      } else {
        this.search.quickFilter = null
      }

      this.getPedidosDespacho()
    },

    clearFilters() {
      this.search = {
        quickFilter: null,
        noPedido: null,
        fechaEntregaProgramadaDesde: null,
        fechaEntregaProgramadaHasta: null,
        fechaAtencionDesde: null,
        fechaAtencionHasta: null,
        idCliente: null,
        idEstadoActual: null,
        idCamionAsignado: null
      }
      this.showAdvancedFilters = false
      this.getPedidosDespacho()
    },

    async getPedidosDespacho() {
      this.loading = true
      const req = {
        fechaEntregaProgramadaDesde: this.search.fechaEntregaProgramadaDesde || null,
        fechaEntregaProgramadaHasta: this.search.fechaEntregaProgramadaHasta || null,
        fechaAtencionDesde: this.search.fechaAtencionDesde || null,
        fechaAtencionHasta: this.search.fechaAtencionHasta || null,
        idCliente: this.search.idCliente || null,
        idEstadoActual: this.search.idEstadoActual || null,
        idCamionAsignado: this.search.idCamionAsignado || null,
        noPedido: this.search.noPedido || null
      }

      try {
        const res = await this.requestHttp.getPedidos(req)
        if (res.code === 200) {
          this.pedidosList = (res.data || []).filter(p => {
            const estado = (p.estado || '').toLowerCase()
            return estado.includes('programad') || estado.includes('asignad') || estado.includes('despach') || p.idEstadoActual === 2 || p.idEstadoActual === 5
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
              const title = (e.title || '').toLowerCase()
              return title.includes('programad') || title.includes('asignad') || title.includes('despach')
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

    async openAsignarDialog(item) {
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

      this.asignarForm = {
        idCamion: this.selectedPedido.idCamionAsignado || null,
        nombreEntregador: this.selectedPedido.nombreEntregadorAsignado || ''
      }
      this.dialogs.asignar = true
    },

    async openPedidosCamionDialog(item) {
      if (!item.idCamionAsignado) return

      this.selectedCamionInfo = {
        idCamion: item.idCamionAsignado,
        placa: item.camionAsignado,
        entregador: item.nombreEntregadorAsignado
      }
      this.pedidosCamionList = []
      this.tabCamion = 'pedidos'
      this.dialogs.camionPedidos = true

      this.loadingCamionPedidos = true
      try {
        const res = await this.requestHttp.getPedidosPorCamion(item.idCamionAsignado)
        if (res.code === 200) {
          this.pedidosCamionList = res.data || []
        }
      } catch (e) {
        console.error(e)
        this.showNotification('Error al obtener los pedidos asignados a este camión', 'error')
      } finally {
        this.loadingCamionPedidos = false
      }
    },

    async guardarAsignacionPedido() {
      if (!this.asignarForm.idCamion || !this.asignarForm.nombreEntregador) {
        this.showNotification('Por favor complete la selección de camión y nombre del entregador', 'warning')
        return
      }

      this.saving = true
      try {
        const usuarioRegistro = localStorage.getItem('usuario') || 'ADMIN'
        const payload = {
          idCamion: this.asignarForm.idCamion,
          nombreEntregador: this.asignarForm.nombreEntregador,
          usuarioRegistro: usuarioRegistro
        }

        const res = await this.requestHttp.asignarCamionPedido(
          this.selectedPedido.idPedido,
          payload
        )

        if (res.code === 200) {
          this.dialogs.asignar = false
          if (this.dialogView) this.dialogView = false
          this.showNotification(
            res.data?.msg || 'Pedido asignado al camión y mercancía cargada correctamente.',
            'success'
          )
          this.getPedidosDespacho()
        } else {
          this.showNotification(
            res.data?.msg || 'Error al asignar y cargar el pedido al camión',
            'error'
          )
        }
      } catch (e) {
        console.error(e)
        this.showNotification(
          'Error al conectar con el servidor para asignar y cargar pedido',
          'error'
        )
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
