<template>
  <div class="w-100 pa-4">
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
            <v-icon class="me-2" color="primary">
              mdi-cart-arrow-down
            </v-icon>
            Pedidos de Venta
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn
          class="rounded"
          @click="openCreateDialog()"
          color="indigo-darken-4"
          prepend-icon="mdi-plus"
          variant="tonal"
        >
          Nuevo Pedido
        </v-btn>
      </template>
      <v-divider />

      <!-- FILTROS PRINCIPALES -->
      <v-card
        class="pa-4 mb-3 border rounded-lg"
        elevation="0"
      >
        <!-- CABECERA DE FILTROS -->
        <div
          class="d-flex align-center justify-space-between mb-3 flex-wrap ga-2"
        >
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-2"
              >mdi-filter-variant</v-icon
            >
            <span
              class="text-subtitle-2 font-weight-bold text-indigo-darken-4"
              >Filtros de búsqueda</span
            >
          </div>
          <div class="d-flex align-center ga-2">
            <v-btn
              size="small"
              :variant="
                showAdvancedFilters
                  ? 'flat'
                  : 'outlined'
              "
              :color="
                showAdvancedFilters
                  ? 'indigo'
                  : 'indigo-darken-2'
              "
              prepend-icon="mdi-tune-variant"
              @click="
                showAdvancedFilters =
                  !showAdvancedFilters
              "
              class="text-none"
            >
              {{
                showAdvancedFilters
                  ? 'Ocultar Filtros Avanzados'
                  : 'Filtros Avanzados'
              }}
              <v-badge
                v-if="hasActiveAdvancedFilters"
                dot
                color="amber-darken-3"
                class="ml-1"
              />
              <v-icon class="ml-1" size="small">
                {{
                  showAdvancedFilters
                    ? 'mdi-chevron-up'
                    : 'mdi-chevron-down'
                }}
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
        <div
          class="d-flex align-center flex-wrap ga-2 bg-grey-lighten-4 pa-2 rounded-lg border"
        >
          <span
            class="text-caption font-weight-bold text-grey-darken-2 me-1"
            >Filtros Rápidos (por Fecha de Pedido):</span
          >

          <v-btn
            size="small"
            :variant="
              search.quickFilter === 'pedidos_hoy'
                ? 'flat'
                : 'tonal'
            "
            color="indigo"
            prepend-icon="mdi-calendar-today"
            class="text-none font-weight-medium"
            @click="
              applyQuickFilter('pedidos_hoy')
            "
          >
            Pedidos de hoy
          </v-btn>

          <v-btn
            size="small"
            :variant="
              search.quickFilter === 'pedidos_ayer'
                ? 'flat'
                : 'tonal'
            "
            color="indigo-darken-2"
            prepend-icon="mdi-calendar-minus"
            class="text-none font-weight-medium"
            @click="
              applyQuickFilter('pedidos_ayer')
            "
          >
            Pedidos de ayer
          </v-btn>

          <v-btn
            size="small"
            :variant="
              search.quickFilter === 'pedidos_semana'
                ? 'flat'
                : 'tonal'
            "
            color="indigo-darken-4"
            prepend-icon="mdi-calendar-range"
            class="text-none font-weight-medium"
            @click="
              applyQuickFilter('pedidos_semana')
            "
          >
            Pedidos de la semana
          </v-btn>

          <v-btn
            v-if="search.quickFilter"
            size="small"
            variant="text"
            color="grey-darken-2"
            icon="mdi-close-circle"
            @click="applyQuickFilter('todos')"
          >
            <v-icon size="small"
              >mdi-close-circle</v-icon
            >
            <v-tooltip
              activator="parent"
              location="top"
              >Limpiar filtro rápido</v-tooltip
            >
          </v-btn>
        </div>

        <!-- FILTROS AVANZADOS (Desplegable) -->
        <v-expand-transition>
          <div
            v-show="showAdvancedFilters"
            class="mt-4 pt-3 border-t bg-indigo-lighten-5 pa-3 rounded-lg"
          >
            <div
              class="text-caption font-weight-bold text-indigo-darken-4 mb-2 d-flex align-center"
            >
              <v-icon
                size="small"
                class="me-1"
                color="indigo"
                >mdi-calendar-range</v-icon
              >
              Rangos de Fechas Avanzados
            </div>
            <v-row dense>
              <!-- 1. Rango Fecha Registro / Recibido -->
              <v-col cols="12" md="6">
                <v-card
                  variant="outlined"
                  class="pa-2 bg-white rounded-lg border-indigo-lighten-4 h-100"
                >
                  <div
                    class="text-caption font-weight-bold text-indigo mb-2 d-flex align-center"
                  >
                    <v-icon
                      size="x-small"
                      class="me-1"
                      >mdi-receipt-text-clock</v-icon
                    >
                    Fecha Recibido (Registro)
                  </div>
                  <v-row dense>
                    <v-col cols="6">
                      <v-text-field
                        v-model="search.desde"
                        label="Desde"
                        type="date"
                        density="compact"
                        variant="outlined"
                        hide-details
                        color="indigo"
                        @change="getPedidos()"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="search.hasta"
                        label="Hasta"
                        type="date"
                        density="compact"
                        variant="outlined"
                        hide-details
                        color="indigo"
                        @change="getPedidos()"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <!-- 2. Rango Fecha Atendido -->
              <v-col cols="12" md="6">
                <v-card
                  variant="outlined"
                  class="pa-2 bg-white rounded-lg border-indigo-lighten-4 h-100"
                >
                  <div
                    class="text-caption font-weight-bold text-amber-darken-3 mb-2 d-flex align-center"
                  >
                    <v-icon
                      size="x-small"
                      class="me-1"
                      >mdi-calendar-check</v-icon
                    >
                    Fecha Atendido
                  </div>
                  <v-row dense>
                    <v-col cols="6">
                      <v-text-field
                        v-model="
                          search.fechaAtencionDesde
                        "
                        label="Desde"
                        type="date"
                        density="compact"
                        variant="outlined"
                        hide-details
                        color="amber-darken-3"
                        @change="getPedidos()"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="
                          search.fechaAtencionHasta
                        "
                        label="Hasta"
                        type="date"
                        density="compact"
                        variant="outlined"
                        hide-details
                        color="amber-darken-3"
                        @change="getPedidos()"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-card>

      <!-- MÉTRICAS / KPI -->
      <v-row dense class="px-4 mb-2">
        <v-col cols="12" md="4" sm="6">
          <v-card
            variant="flat"
            color="indigo-lighten-5"
            class="pa-3 rounded-lg"
          >
            <div class="d-flex align-center">
              <v-avatar
                color="indigo"
                class="mr-3 text-white"
              >
                <v-icon
                  >mdi-receipt-text-clock</v-icon
                >
              </v-avatar>
              <div>
                <div
                  class="text-caption text-indigo-darken-3 font-weight-bold"
                >
                  N° Pedidos Recibidos
                </div>
                <div
                  class="text-h6 font-weight-bold text-indigo-darken-4"
                >
                  {{ pedidosRecibidosCount }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-card
            variant="flat"
            color="amber-lighten-5"
            class="pa-3 rounded-lg"
          >
            <div class="d-flex align-center">
              <v-avatar
                color="amber-darken-3"
                class="mr-3 text-white"
              >
                <v-icon
                  >mdi-calendar-check</v-icon
                >
              </v-avatar>
              <div>
                <div
                  class="text-caption text-amber-darken-4 font-weight-bold"
                >
                  N° Pedidos Atendidos
                </div>
                <div
                  class="text-h6 font-weight-bold text-amber-darken-4"
                >
                  {{ pedidosAtendidosCount }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="12">
          <v-card
            variant="flat"
            color="green-lighten-5"
            class="pa-3 rounded-lg"
          >
            <div class="d-flex align-center">
              <v-avatar
                color="green-darken-3"
                class="mr-3 text-white"
              >
                <v-icon>mdi-cash-multiple</v-icon>
              </v-avatar>
              <div>
                <div
                  class="text-caption text-green-darken-4 font-weight-bold"
                >
                  Total de Todos los Pedidos
                </div>
                <div
                  class="text-h6 font-weight-bold text-green-darken-4"
                >
                  {{
                    formatCurrency(
                      totalPedidosMonto
                    )
                  }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- TABLA DE PEDIDOS -->
      <v-card
        class="mx-4 mb-6 border"
        rounded="lg"
        elevation="0"
      >
        <v-data-table
          :headers="headers"
          :items="data.pedidos"
          :loading="loading"
          density="compact"
          class="rounded"
          :items-per-page="15"
        >
          <!-- ENCABEZADOS DE COLUMNA CON FILTROS -->
          <template
            v-slot:header.noPedido="{ column }"
          >
            <div
              class="d-flex flex-column align-center py-1 ga-1 w-100"
            >
              <span
                class="font-weight-bold text-caption text-indigo-darken-4"
                >Nº Pedido</span
              >
              <v-text-field
                v-model="search.noPedido"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                color="indigo"
                placeholder="Filtrar Nº"
                style="
                  min-width: 100px;
                  max-width: 130px;
                "
                @update:model-value="getPedidos()"
                @click:clear="getPedidos()"
              />
            </div>
          </template>

          <template
            v-slot:header.cliente="{ column }"
          >
            <div
              class="d-flex flex-column align-start py-1 ga-1 w-100"
            >
              <span
                class="font-weight-bold text-caption text-indigo-darken-4"
                >Cliente</span
              >
              <v-autocomplete
                v-model="search.idCliente"
                :items="cmb.clientes"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                color="indigo"
                placeholder="Todos los clientes"
                style="
                  min-width: 170px;
                  max-width: 240px;
                "
                @update:model-value="getPedidos()"
                @click:clear="getPedidos()"
              />
            </div>
          </template>

          <template
            v-slot:header.estado="{ column }"
          >
            <div
              class="d-flex flex-column align-center py-1 ga-1 w-100"
            >
              <span
                class="font-weight-bold text-caption text-indigo-darken-4"
                >Estado</span
              >
              <v-autocomplete
                v-model="search.idEstadoActual"
                :items="cmb.estados"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                color="indigo"
                placeholder="Todos"
                style="
                  min-width: 120px;
                  max-width: 150px;
                "
                @update:model-value="getPedidos()"
                @click:clear="getPedidos()"
              />
            </div>
          </template>
          <template
            v-slot:item.noPedido="{ item }"
          >
            <span
              class="font-weight-bold text-indigo"
              >{{ item.noPedido }}</span
            >
          </template>
          <template
            v-slot:item.fechaRegistro="{ item }"
          >
            {{ formatDate(item.fechaRegistro) }}
          </template>
          <template
            v-slot:item.fechaEntregaSolicitada="{
              item
            }"
          >
            {{
              formatDate(
                item.fechaEntregaSolicitada
              )
            }}
          </template>
          <template
            v-slot:item.fechaEntregaProgramada="{
              item
            }"
          >
            {{
              item.fechaEntregaProgramada
                ? formatDate(
                    item.fechaEntregaProgramada
                  )
                : '—'
            }}
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip
              :color="
                getEstadoColor(
                  item.idEstadoActual
                )
              "
              size="small"
              variant="flat"
              class="font-weight-bold"
            >
              {{ item.estado }}
            </v-chip>
          </template>
          <template
            v-slot:item.totalAfecha="{ item }"
          >
            <span
              class="font-weight-bold text-success"
              >{{
                formatCurrency(item.totalAfecha)
              }}</span
            >
          </template>
          <template v-slot:item.opc="{ item }">
            <div
              class="d-flex align-center justify-center"
            >
              <v-btn
                icon
                size="small"
                color="indigo-darken-3"
                variant="text"
                @click="viewPedidoDetail(item)"
              >
                <v-icon size="20">mdi-eye</v-icon>
                <v-tooltip
                  activator="parent"
                  location="top"
                  >Ver detalle</v-tooltip
                >
              </v-btn>
              <v-btn
                icon
                size="small"
                :color="
                  item.fechaEntregaProgramada
                    ? 'deep-purple-darken-3'
                    : 'amber-darken-3'
                "
                variant="text"
                @click="
                  openProgramarEntregaDialog(item)
                "
              >
                <v-icon size="20">{{
                  item.fechaEntregaProgramada
                    ? 'mdi-calendar-sync'
                    : 'mdi-calendar-clock'
                }}</v-icon>
                <v-tooltip
                  activator="parent"
                  location="top"
                  >{{
                    item.fechaEntregaProgramada
                      ? 'Reprogramar entrega'
                      : 'Programar entrega'
                  }}</v-tooltip
                >
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-card>

    <!-- DIÁLOGO DE DETALLE DEL PEDIDO -->
    <v-dialog
      v-model="dialogs.view"
      max-width="900"
      persistent
    >
      <v-card
        v-if="selectedPedido"
        class="rounded-lg overflow-hidden elevation-12"
      >
        <!-- Encabezado del diálogo -->
        <v-card-title
          class="d-flex align-center bg-indigo-darken-4 text-white py-2 px-4"
        >
          <v-avatar
            size="36"
            color="white"
            class="me-3"
            variant="flat"
          >
            <v-icon
              color="indigo-darken-4"
              size="22"
              >mdi-receipt-text-outline</v-icon
            >
          </v-avatar>
          <div>
            <div
              class="text-subtitle-1 font-weight-bold"
            >
              Detalles del Pedido
            </div>
            <div
              class="text-caption text-indigo-lighten-4"
            >
              Nº Pedido:
              <span
                class="font-weight-bold text-white"
                >{{
                  selectedPedido.noPedido
                }}</span
              >
            </div>
          </div>
          <v-spacer />
          <v-chip
            :color="
              getEstadoColor(
                selectedPedido.idEstadoActual
              )
            "
            size="small"
            variant="flat"
            class="font-weight-bold me-3 text-uppercase"
          >
            {{ selectedPedido.estado }}
          </v-chip>
          <v-btn
            variant="text"
            icon
            size="small"
            color="white"
            @click="dialogs.view = false"
          >
            <v-icon>mdi-close</v-icon>
            <v-tooltip
              activator="parent"
              location="top"
              >Cerrar</v-tooltip
            >
          </v-btn>
        </v-card-title>

        <!-- Contenido principal (Visualización Única y Ordenada) -->
        <v-card-text
          class="px-4 pt-4 pb-4 bg-grey-lighten-5"
          style="
            max-height: 80vh;
            overflow-y: auto;
          "
        >
          <v-row dense>
            <!-- 1. INFORMACIÓN GENERAL -->
            <v-col cols="12" md="6">
              <v-card
                variant="flat"
                class="border rounded-lg bg-white pa-4 mb-3 h-100"
                elevation="0"
              >
                <div
                  class="d-flex align-center mb-3"
                >
                  <v-icon
                    color="indigo-darken-3"
                    size="20"
                    class="me-2"
                    >mdi-information-outline</v-icon
                  >
                  <h4
                    class="font-weight-bold text-indigo-darken-4 text-subtitle-1"
                  >
                    Información General
                  </h4>
                </div>

                <v-list
                  density="compact"
                  class="pa-0"
                >
                  <v-list-item class="px-0 py-1">
                    <template v-slot:prepend>
                      <v-icon
                        size="18"
                        color="indigo-darken-2"
                        class="me-2"
                        >mdi-account</v-icon
                      >
                    </template>
                    <v-list-item-title
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                      >Cliente:</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="text-body-2 font-weight-bold text-indigo-darken-4"
                    >
                      {{ selectedPedido.cliente }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />

                  <v-list-item class="px-0 py-1">
                    <template v-slot:prepend>
                      <v-icon
                        size="18"
                        color="indigo-darken-2"
                        class="me-2"
                        >mdi-calendar</v-icon
                      >
                    </template>
                    <v-list-item-title
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                      >Fecha:</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="text-body-2 font-weight-bold text-grey-darken-4"
                    >
                      {{
                        formatDate(
                          selectedPedido.fechaRegistro
                        )
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />

                  <v-list-item class="px-0 py-1">
                    <template v-slot:prepend>
                      <v-icon
                        size="18"
                        color="indigo-darken-2"
                        class="me-2"
                        >mdi-calendar-clock</v-icon
                      >
                    </template>
                    <v-list-item-title
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                      >Fecha Entrega
                      Solicitada:</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="text-body-2 font-weight-bold text-grey-darken-4"
                    >
                      {{
                        formatDate(
                          selectedPedido.fechaEntregaSolicitada
                        )
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider
                    class="my-1"
                    v-if="
                      selectedPedido.fechaEntregaProgramada
                    "
                  />

                  <v-list-item
                    class="px-0 py-1"
                    v-if="
                      selectedPedido.fechaEntregaProgramada
                    "
                  >
                    <template v-slot:prepend>
                      <v-icon
                        size="18"
                        color="amber-darken-3"
                        class="me-2"
                        >mdi-truck-clock</v-icon
                      >
                    </template>
                    <v-list-item-title
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                      >Fecha Entrega
                      Programada:</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="text-body-2 font-weight-bold text-amber-darken-4"
                    >
                      {{
                        formatDate(
                          selectedPedido.fechaEntregaProgramada
                        )
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider
                    class="my-1"
                    v-if="
                      selectedPedido.fechaEntregado
                    "
                  />

                  <v-list-item
                    class="px-0 py-1"
                    v-if="
                      selectedPedido.fechaEntregado
                    "
                  >
                    <template v-slot:prepend>
                      <v-icon
                        size="18"
                        color="green-darken-2"
                        class="me-2"
                        >mdi-package-variant-closed-check</v-icon
                      >
                    </template>
                    <v-list-item-title
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                      >Fecha
                      Entregado:</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="text-body-2 font-weight-bold text-green-darken-4"
                    >
                      {{
                        formatDate(
                          selectedPedido.fechaEntregado
                        )
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />

                  <v-list-item class="px-0 py-1">
                    <template v-slot:prepend>
                      <v-icon
                        size="18"
                        color="indigo-darken-2"
                        class="me-2"
                        >mdi-credit-card-outline</v-icon
                      >
                    </template>
                    <v-list-item-title
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                      >Solicitud de
                      Crédito:</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="text-body-2 font-weight-medium pt-1"
                    >
                      <v-chip
                        size="small"
                        :color="
                          selectedPedido.isSolicitudCredito
                            ? 'success'
                            : 'grey-darken-1'
                        "
                        variant="flat"
                        class="font-weight-bold"
                      >
                        {{
                          selectedPedido.isSolicitudCredito
                            ? 'Sí'
                            : 'No'
                        }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <!-- 2. ENTREGA Y REGISTRO -->
            <v-col cols="12" md="6">
              <v-card
                variant="flat"
                class="border rounded-lg bg-white pa-4 mb-3 h-100"
                elevation="0"
              >
                <div
                  class="d-flex align-center mb-3"
                >
                  <v-icon
                    color="indigo-darken-3"
                    size="20"
                    class="me-2"
                    >mdi-truck-delivery-outline</v-icon
                  >
                  <h4
                    class="font-weight-bold text-indigo-darken-4 text-subtitle-1"
                  >
                    Entrega y Registro
                  </h4>
                </div>

                <v-list
                  density="compact"
                  class="pa-0"
                >
                  <v-list-item class="px-0 py-1">
                    <template v-slot:prepend>
                      <v-icon
                        size="18"
                        color="indigo-darken-2"
                        class="me-2"
                        >mdi-account-edit</v-icon
                      >
                    </template>
                    <v-list-item-title
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                      >Registrado
                      por:</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="text-body-2 font-weight-bold text-grey-darken-4"
                    >
                      {{
                        selectedPedido.usuarioRegistro ||
                        '—'
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />

                  <v-list-item class="px-0 py-1">
                    <template v-slot:prepend>
                      <v-icon
                        size="18"
                        color="indigo-darken-2"
                        class="me-2"
                        >mdi-map-marker-radius-outline</v-icon
                      >
                    </template>
                    <v-list-item-title
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                      >Ubicación de
                      registro:</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="text-body-2 font-weight-bold text-grey-darken-4"
                    >
                      {{
                        selectedPedido.ubicacion ||
                        '—'
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />

                  <v-list-item class="px-0 py-1">
                    <template v-slot:prepend>
                      <v-icon
                        size="18"
                        color="indigo-darken-2"
                        class="me-2"
                        >mdi-map-marker-outline</v-icon
                      >
                    </template>
                    <v-list-item-title
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                      >Enviar
                      A:</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="text-body-2 font-weight-bold text-grey-darken-4"
                    >
                      {{
                        selectedPedido.enviarA ||
                        '—'
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-1" />

                  <v-list-item class="px-0 py-1">
                    <template v-slot:prepend>
                      <v-icon
                        size="18"
                        color="indigo-darken-2"
                        class="me-2"
                        >mdi-text-box-outline</v-icon
                      >
                    </template>
                    <v-list-item-title
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                      >Observaciones:</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="text-body-2 text-grey-darken-4 font-italic"
                    >
                      {{
                        selectedPedido.observaciones ||
                        'Sin observaciones'
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <!-- 3. SESIÓN DE CAJA ASOCIADA -->
            <v-col cols="12" class="mb-3">
              <v-card
                variant="flat"
                class="border rounded-lg bg-white pa-4"
                elevation="0"
              >
                <div
                  class="d-flex align-center mb-2"
                >
                  <v-icon
                    color="indigo-darken-3"
                    size="20"
                    class="me-2"
                    >mdi-cash-register</v-icon
                  >
                  <h4
                    class="font-weight-bold text-indigo-darken-4 text-subtitle-1"
                  >
                    Sesión de Caja Asociada
                  </h4>
                </div>

                <v-row
                  dense
                  v-if="
                    selectedPedido.idAperturaCaja
                  "
                  class="pt-1"
                >
                  <v-col cols="12" md="4">
                    <div
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                    >
                      Caja:
                    </div>
                    <div
                      class="text-body-1 font-weight-bold text-grey-darken-4"
                    >
                      {{
                        selectedPedido.aperturaCajaCaja ||
                        '—'
                      }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                    >
                      Código Apertura:
                    </div>
                    <div
                      class="text-body-1 font-weight-bold text-indigo-darken-4"
                    >
                      {{
                        selectedPedido.aperturaCajaCodigo ||
                        '—'
                      }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div
                      class="text-body-2 font-weight-medium text-grey-darken-3"
                    >
                      Abierto por:
                    </div>
                    <div
                      class="text-body-1 font-weight-bold text-grey-darken-4"
                    >
                      {{
                        selectedPedido.aperturaCajaUsuario ||
                        '—'
                      }}
                    </div>
                  </v-col>
                </v-row>
                <div
                  v-else
                  class="text-body-2 text-grey-darken-3 font-italic pt-1"
                >
                  Este pedido no fue registrado
                  bajo una sesión de caja
                  específica.
                </div>
              </v-card>
            </v-col>

            <!-- 4. DETALLE DE PRODUCTOS (Alta Legibilidad) -->
            <v-col cols="12">
              <v-card
                variant="flat"
                class="border rounded-lg bg-white pa-4"
                elevation="0"
              >
                <div
                  class="d-flex align-center justify-space-between mb-3 flex-wrap ga-2"
                >
                  <div
                    class="d-flex align-center"
                  >
                    <v-avatar
                      size="32"
                      color="indigo-lighten-5"
                      class="me-2"
                    >
                      <v-icon
                        color="indigo-darken-4"
                        size="20"
                        >mdi-package-variant-closed</v-icon
                      >
                    </v-avatar>
                    <div>
                      <h4
                        class="font-weight-bold text-indigo-darken-4 text-subtitle-1"
                      >
                        Detalle de Productos
                      </h4>
                      <div
                        class="text-body-2 font-weight-medium text-grey-darken-3"
                      >
                        {{
                          selectedPedido.detallePedido
                            ? selectedPedido
                                .detallePedido
                                .length
                            : 0
                        }}
                        producto(s) en este pedido
                      </div>
                    </div>
                  </div>
                  <div
                    class="text-subtitle-1 font-weight-bold text-indigo-darken-4"
                  >
                    Total General:
                    <span
                      class="text-success-darken-2 text-h6 font-weight-bold ml-1"
                    >
                      {{
                        formatCurrency(
                          selectedPedido.totalAfecha
                        )
                      }}
                    </span>
                  </div>
                </div>

                <v-table
                  density="compact"
                  class="border rounded"
                >
                  <thead>
                    <tr
                      class="bg-indigo-lighten-5"
                    >
                      <th
                        class="font-weight-bold text-body-2 text-indigo-darken-4"
                      >
                        Código
                      </th>
                      <th
                        class="font-weight-bold text-body-2 text-indigo-darken-4"
                      >
                        Producto
                      </th>
                      <th
                        class="text-center font-weight-bold text-body-2 text-indigo-darken-4"
                      >
                        Cantidad
                      </th>
                      <th
                        class="text-right font-weight-bold text-body-2 text-indigo-darken-4"
                      >
                        Precio Unit. (C$)
                      </th>
                      <th
                        class="text-right font-weight-bold text-body-2 text-indigo-darken-4"
                      >
                        Subtotal (C$)
                      </th>
                      <th
                        class="font-weight-bold text-body-2 text-indigo-darken-4"
                      >
                        Observaciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in selectedPedido.detallePedido"
                      :key="item.idDetallePedido"
                    >
                      <td
                        class="text-body-2 font-weight-bold text-indigo-darken-4"
                      >
                        {{
                          item.codigoProducto ||
                          '—'
                        }}
                      </td>
                      <td
                        class="text-body-2 font-weight-bold text-grey-darken-4"
                      >
                        {{ item.producto }}
                      </td>
                      <td
                        class="text-center text-body-2 font-weight-bold text-grey-darken-4"
                      >
                        {{ item.cantidad }}
                      </td>
                      <td
                        class="text-right text-body-2 font-weight-medium text-grey-darken-4"
                      >
                        {{
                          formatCurrency(
                            item.precioUnitarioAfecha
                          )
                        }}
                      </td>
                      <td
                        class="text-right text-body-2 font-weight-bold text-success-darken-2"
                      >
                        {{
                          formatCurrency(
                            item.cantidad *
                              item.precioUnitarioAfecha
                          )
                        }}
                      </td>
                      <td
                        class="text-body-2 text-grey-darken-3 font-italic"
                      >
                        {{
                          item.observaciones ||
                          '—'
                        }}
                      </td>
                    </tr>
                    <tr
                      v-if="
                        !selectedPedido.detallePedido ||
                        selectedPedido
                          .detallePedido
                          .length === 0
                      "
                    >
                      <td
                        colspan="6"
                        class="text-center text-grey-darken-3 text-body-2 py-4 font-italic"
                      >
                        No hay productos
                        registrados en este
                        pedido.
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Acciones -->
        <v-divider />
        <v-card-actions
          class="bg-grey-lighten-4 px-4 py-2 d-flex align-center"
        >
          <v-btn
            :color="
              selectedPedido.fechaEntregaProgramada
                ? 'deep-purple-darken-3'
                : 'amber-darken-3'
            "
            variant="flat"
            :prepend-icon="
              selectedPedido.fechaEntregaProgramada
                ? 'mdi-calendar-sync'
                : 'mdi-calendar-clock'
            "
            class="text-none font-weight-bold"
            @click="openProgramarEntregaDialog(selectedPedido)"
          >
            {{
              selectedPedido.fechaEntregaProgramada
                ? 'Reprogramar Entrega'
                : 'Programar Entrega'
            }}
          </v-btn>
          <v-spacer />
          <v-btn
            color="grey-darken-2"
            variant="tonal"
            @click="dialogs.view = false"
            prepend-icon="mdi-close"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIÁLOGO DE PROGRAMAR / REPROGRAMAR ENTREGA -->
    <v-dialog
      v-model="dialogs.programarEntrega"
      max-width="550"
      persistent
    >
      <v-card
        v-if="selectedPedido"
        class="rounded-lg overflow-hidden elevation-12"
      >
        <v-card-title
          class="d-flex align-center text-white py-3 px-4"
          :class="
            selectedPedido.fechaEntregaProgramada
              ? 'bg-deep-purple-darken-3'
              : 'bg-amber-darken-3'
          "
        >
          <v-avatar
            size="36"
            color="white"
            class="me-3"
            variant="flat"
          >
            <v-icon
              :color="
                selectedPedido.fechaEntregaProgramada
                  ? 'deep-purple-darken-3'
                  : 'amber-darken-3'
              "
              size="22"
              >{{
                selectedPedido.fechaEntregaProgramada
                  ? 'mdi-calendar-sync'
                  : 'mdi-calendar-clock'
              }}</v-icon
            >
          </v-avatar>
          <div>
            <div
              class="text-subtitle-1 font-weight-bold"
            >
              {{
                selectedPedido.fechaEntregaProgramada
                  ? 'Reprogramar Entrega'
                  : 'Programar Entrega'
              }}
            </div>
            <div
              class="text-caption text-white opacity-90"
            >
              Nº Pedido:
              <span
                class="font-weight-bold text-white"
                >{{
                  selectedPedido.noPedido
                }}</span
              >
              — {{ selectedPedido.cliente }}
            </div>
          </div>
          <v-spacer />
          <v-btn
            variant="text"
            icon
            size="small"
            color="white"
            @click="
              dialogs.programarEntrega = false
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          class="pa-4 bg-grey-lighten-5"
        >
          <!-- Banner informativo con Fecha Solicitada por el Cliente -->
          <v-card
            variant="flat"
            class="pa-3 mb-4 rounded-lg bg-indigo-lighten-5 border-indigo-lighten-4 border"
          >
            <div class="d-flex align-center">
              <v-icon
                color="indigo-darken-3"
                class="me-2"
                size="22"
                >mdi-clock-alert-outline</v-icon
              >
              <div>
                <div
                  class="text-caption font-weight-bold text-indigo-darken-3"
                >
                  Fecha Solicitada por el Cliente:
                </div>
                <div
                  class="text-subtitle-2 font-weight-bold text-indigo-darken-4"
                >
                  {{
                    selectedPedido
                      ? formatDate(
                          selectedPedido.fechaEntregaSolicitada
                        )
                      : '—'
                  }}
                </div>
              </div>
            </div>
          </v-card>

          <!-- Si ya tiene fecha programada anterior -->
          <v-card
            v-if="selectedPedido.fechaEntregaProgramada"
            variant="flat"
            class="pa-3 mb-4 rounded-lg bg-purple-lighten-5 border-purple-lighten-4 border"
          >
            <div class="d-flex align-center">
              <v-icon
                color="deep-purple-darken-3"
                class="me-2"
                size="22"
                >mdi-calendar-check</v-icon
              >
              <div>
                <div
                  class="text-caption font-weight-bold text-deep-purple-darken-3"
                >
                  Fecha Programada Actual:
                </div>
                <div
                  class="text-subtitle-2 font-weight-bold text-deep-purple-darken-4"
                >
                  {{
                    formatDate(
                      selectedPedido.fechaEntregaProgramada
                    )
                  }}
                </div>
              </div>
            </div>
          </v-card>

          <v-form
            ref="formProgramar"
            v-model="formProgramarValid"
          >
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="
                    programarForm.fechaEntregaProgramada
                  "
                  :label="
                    selectedPedido.fechaEntregaProgramada
                      ? 'Nueva Fecha a Reprogramar'
                      : 'Fecha de Entrega a Programar'
                  "
                  type="date"
                  variant="outlined"
                  density="compact"
                  :color="
                    selectedPedido.fechaEntregaProgramada
                      ? 'deep-purple-darken-3'
                      : 'amber-darken-3'
                  "
                  :rules="[
                    (v) =>
                      !!v ||
                      'La fecha de entrega es requerida'
                  ]"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />
        <v-card-actions
          class="bg-grey-lighten-4 px-4 py-2"
        >
          <v-spacer />
          <v-btn
            color="grey-darken-2"
            variant="tonal"
            @click="
              dialogs.programarEntrega = false
            "
          >
            Cancelar
          </v-btn>
          <v-btn
            :color="
              selectedPedido.fechaEntregaProgramada
                ? 'deep-purple-darken-3'
                : 'amber-darken-3'
            "
            variant="flat"
            :prepend-icon="
              selectedPedido.fechaEntregaProgramada
                ? 'mdi-calendar-sync'
                : 'mdi-check'
            "
            :loading="saving"
            @click="guardarProgramacionEntrega()"
          >
            {{
              selectedPedido.fechaEntregaProgramada
                ? 'Guardar Reprogramación'
                : 'Guardar Programación'
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIÁLOGO DE CREACIÓN DE NUEVO PEDIDO -->
    <v-dialog
      v-model="dialogs.create"
      max-width="950"
      persistent
    >
      <v-card
        class="rounded-lg elevation-12 bg-grey-lighten-4"
      >
        <v-card-title
          class="bg-indigo-darken-4 text-white d-flex align-center py-2 px-3"
        >
          <v-avatar
            size="36"
            color="white"
            class="mr-3"
            variant="flat"
          >
            <v-icon color="indigo" size="20"
              >mdi-cart-plus</v-icon
            >
          </v-avatar>
          <h5
            class="text-h6 font-weight-bold text-white"
          >
            Nuevo Pedido de Venta
          </h5>
          <v-spacer />
          <v-btn
            icon
            size="small"
            color="white"
            variant="text"
            @click="closeCreateDialog()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          class="pa-4"
          style="
            max-height: 75vh;
            overflow-y: auto;
          "
        >
          <v-form ref="form" v-model="formValid">
            <v-row dense>
              <!-- DATOS PRINCIPALES DEL PEDIDO -->
              <v-col cols="12" md="6">
                <v-card
                  class="pa-4 h-100 border rounded-lg bg-white"
                  elevation="0"
                >
                  <div
                    class="text-subtitle-2 font-weight-bold text-indigo mb-3"
                  >
                    Información del Pedido
                  </div>

                  <v-autocomplete
                    v-model="newPedido.idCliente"
                    label="Cliente *"
                    :items="cmb.clientes"
                    density="compact"
                    variant="outlined"
                    :rules="[
                      (v) =>
                        !!v ||
                        'El cliente es requerido'
                    ]"
                    class="mb-3"
                    color="indigo"
                  />

                  <v-text-field
                    v-model="
                      newPedido.fechaEntregaSolicitada
                    "
                    label="Fecha Entrega Solicitada *"
                    type="date"
                    density="compact"
                    variant="outlined"
                    :rules="[
                      (v) =>
                        !!v ||
                        'La fecha de entrega es requerida'
                    ]"
                    class="mb-3"
                    color="indigo"
                  />

                  <v-checkbox
                    v-model="
                      newPedido.isSolicitudCredito
                    "
                    label="¿Solicita Crédito?"
                    color="indigo"
                    density="compact"
                    hide-details
                    class="mb-3"
                  />

                  <v-textarea
                    v-model="
                      newPedido.observaciones
                    "
                    label="Observaciones"
                    density="compact"
                    variant="outlined"
                    rows="2"
                    color="indigo"
                    class="mb-3"
                  />
                </v-card>
              </v-col>

              <!-- DATOS DE DESPACHO / UBICACIÓN -->
              <v-col cols="12" md="6">
                <v-card
                  class="pa-4 h-100 border rounded-lg bg-white"
                  elevation="0"
                >
                  <div
                    class="text-subtitle-2 font-weight-bold text-indigo mb-3"
                  >
                    Datos de Entrega y Despacho
                  </div>

                  <v-text-field
                    v-model="newPedido.enviarA"
                    label="Enviar A (Dirección de Despacho)"
                    density="compact"
                    variant="outlined"
                    prepend-inner-icon="mdi-map-marker"
                    class="mb-3"
                    color="indigo"
                  />

                  <v-text-field
                    v-model="newPedido.ubicacion"
                    label="Ubicación / Coordenadas"
                    density="compact"
                    variant="outlined"
                    prepend-inner-icon="mdi-crosshairs-gps"
                    class="mb-3"
                    color="indigo"
                  />

                  <div
                    class="text-caption text-grey-darken-1 italic"
                  >
                    <v-icon
                      size="x-small"
                      class="mr-1"
                      >mdi-information-outline</v-icon
                    >
                    Complete la información de
                    envío si requiere entrega a
                    domicilio o ruta.
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <!-- SECCIÓN AGREGAR PRODUCTOS -->
            <v-card
              class="pa-4 border rounded-lg bg-white mb-4"
            >
              <div
                class="text-subtitle-2 font-weight-bold text-indigo mb-3 d-flex align-center"
              >
                <v-icon size="small" class="mr-1"
                  >mdi-plus-box-outline</v-icon
                >
                Agregar Productos al Pedido
              </div>
              <v-row dense align="center">
                <v-col cols="12" md="5">
                  <v-autocomplete
                    v-model="
                      productForm.idProducto
                    "
                    label="Buscar Producto"
                    :items="cmb.productos"
                    density="compact"
                    variant="outlined"
                    hide-details
                    color="indigo"
                  />
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model.number="
                      productForm.cantidad
                    "
                    label="Cantidad"
                    type="number"
                    min="1"
                    density="compact"
                    variant="outlined"
                    hide-details
                    color="indigo"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="
                      productForm.observaciones
                    "
                    label="Observación (Item)"
                    density="compact"
                    variant="outlined"
                    hide-details
                    color="indigo"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="1"
                  class="d-flex justify-end"
                >
                  <v-btn
                    color="indigo"
                    @click="addProductToPedido"
                    variant="flat"
                    size="small"
                    prepend-icon="mdi-plus"
                  >
                    Agregar
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>

            <!-- TABLA DE ITEMS AGREGADOS -->
            <v-card
              class="border"
              rounded="lg"
              elevation="0"
            >
              <v-card-title
                class="text-subtitle-2 font-weight-bold py-2 bg-indigo-lighten-5 text-indigo d-flex justify-space-between align-center"
              >
                <span>Items del Pedido</span>
                <v-chip
                  size="x-small"
                  color="indigo"
                  variant="flat"
                  >{{
                    newPedido.detallePedido.length
                  }}
                  items</v-chip
                >
              </v-card-title>
              <v-table
                density="compact"
                class="elevation-0"
              >
                <thead>
                  <tr class="bg-grey-lighten-3">
                    <th
                      class="font-weight-bold text-caption"
                    >
                      Producto
                    </th>
                    <th
                      class="text-center font-weight-bold text-caption"
                    >
                      Cantidad
                    </th>
                    <th
                      class="text-right font-weight-bold text-caption"
                    >
                      Precio Unit. Estimado
                    </th>
                    <th
                      class="text-right font-weight-bold text-caption"
                    >
                      Importe Subtotal
                    </th>
                    <th
                      class="font-weight-bold text-caption"
                    >
                      Observaciones
                    </th>
                    <th
                      class="text-center font-weight-bold text-caption"
                      style="width: 80px"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(
                      item, idx
                    ) in newPedido.detallePedido"
                    :key="idx"
                  >
                    <td
                      class="text-caption font-weight-bold"
                    >
                      {{ item.nombre }}
                    </td>
                    <td
                      class="text-center text-caption font-weight-medium"
                    >
                      {{ item.cantidad }}
                    </td>
                    <td
                      class="text-right text-caption"
                    >
                      {{
                        formatCurrency(
                          item.precio
                        )
                      }}
                    </td>
                    <td
                      class="text-right text-caption font-weight-bold text-success"
                    >
                      {{
                        formatCurrency(
                          item.cantidad *
                            item.precio
                        )
                      }}
                    </td>
                    <td
                      class="text-caption text-grey italic"
                    >
                      {{
                        item.observaciones || '—'
                      }}
                    </td>
                    <td class="text-center">
                      <v-btn
                        icon
                        size="x-small"
                        color="error"
                        variant="text"
                        @click="
                          removeProductFromPedido(
                            idx
                          )
                        "
                      >
                        <v-icon
                          >mdi-trash-can-outline</v-icon
                        >
                      </v-btn>
                    </td>
                  </tr>
                  <tr
                    v-if="
                      newPedido.detallePedido
                        .length === 0
                    "
                  >
                    <td
                      colspan="6"
                      class="text-center text-grey text-caption py-4 italic"
                    >
                      Agregue productos desde el
                      panel de arriba para iniciar
                      su pedido.
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>

            <!-- RESUMEN DE TOTAL -->
            <div
              class="d-flex justify-end align-center mt-4 pa-3 bg-white border rounded-lg"
            >
              <div
                class="text-subtitle-1 font-weight-bold mr-4 text-indigo"
              >
                Total Estimado del Pedido:
              </div>
              <div
                class="text-h6 font-weight-bold text-success"
              >
                {{
                  formatCurrency(totalNuevoPedido)
                }}
              </div>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions
          class="bg-grey-lighten-4 pa-3"
        >
          <v-spacer />
          <v-btn
            color="grey"
            variant="outlined"
            @click="closeCreateDialog()"
            :disabled="saving"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="indigo"
            class="text-white"
            variant="flat"
            @click="savePedido()"
            :disabled="saving"
            :loading="saving"
          >
            Guardar Pedido
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Alertas -->
    <v-snackbar
      v-model="alert.show"
      :color="alert.type"
      timeout="3000"
      location="top right"
    >
      {{ alert.message }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="alert.show = false"
          >Cerrar</v-btn
        >
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import RequestHttp from '@/services/requestHttp'
import { useStore } from '@/store'

export default {
  name: 'PedidosComp',

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.applyQuickFilter('pedidos_hoy')
      vm.loadClientes()
      vm.loadEstados()
      vm.loadProductos()
    })
  },

  mounted() {
    this.applyQuickFilter('pedidos_hoy')
    this.loadClientes()
    this.loadEstados()
    this.loadProductos()
  },

  data() {
    return {
      requestHttp: new RequestHttp(),
      store: useStore(),
      loading: false,
      saving: false,
      formValid: false,

      showAdvancedFilters: false,
      viewTab: 1,

      search: {
        quickFilter: 'pedidos_hoy',
        desde: null,
        hasta: null,
        fechaEntregaProgramadaDesde: null,
        fechaEntregaProgramadaHasta: null,
        fechaEntregadoDesde: null,
        fechaEntregadoHasta: null,
        fechaAtencionDesde: null,
        fechaAtencionHasta: null,
        idCliente: null,
        idEstadoActual: null,
        noPedido: null
      },

      cmb: {
        clientes: [],
        estados: [],
        productos: []
      },

      headers: [
        {
          title: 'Opciones',
          key: 'opc',
          align: 'center',
          sortable: false
        },
        {
          title: 'Nº Pedido',
          key: 'noPedido',
          align: 'center',
          sortable: false
        },
        {
          title: 'Cliente',
          key: 'cliente',
          align: 'start',
          sortable: false
        },
        {
          title: 'Fecha Pedido',
          key: 'fechaRegistro',
          align: 'center',
          sortable: true
        },
        {
          title: 'Pedido Atendido',
          key: 'fechaAtencion',
          align: 'center',
          sortable: true
        },
        {
          title: 'Entrega Solicitada',
          key: 'fechaEntregaSolicitada',
          align: 'center',
          sortable: true
        },
        {
          title: 'Entrega Programada',
          key: 'fechaEntregaProgramada',
          align: 'center',
          sortable: true
        },
        {
          title: 'Total',
          key: 'totalAfecha',
          align: 'end',
          sortable: true
        },
        {
          title: 'Usuario Registro',
          key: 'usuarioRegistro',
          align: 'center',
          sortable: true
        },
        {
          title: 'Estado',
          key: 'estado',
          align: 'center',
          sortable: true
        }
      ],

      data: {
        pedidos: [],
        allProductsRaw: []
      },

      selectedPedido: null,

      newPedido: {
        idCliente: null,
        isSolicitudCredito: false,
        observaciones: '',
        enviarA: '',
        ubicacion: '',
        fechaEntregaSolicitada: null,
        detallePedido: []
      },

      productForm: {
        idProducto: null,
        cantidad: 1,
        observaciones: ''
      },

      dialogs: {
        view: false,
        create: false,
        programarEntrega: false
      },

      formProgramarValid: false,
      programarForm: {
        fechaEntregaProgramada: null,
        fechaAtencion: null,
        observaciones: ''
      },

      alert: {
        show: false,
        message: '',
        type: 'success'
      }
    }
  },

  computed: {
    hasActiveAdvancedFilters() {
      return !!(
        this.search.desde ||
        this.search.hasta ||
        this.search.fechaAtencionDesde ||
        this.search.fechaAtencionHasta
      )
    },
    pedidosRecibidosCount() {
      return this.data.pedidos.filter(
        (p) =>
          p.idEstadoActual === 1 ||
          (p.estado || '')
            .toLowerCase()
            .includes('pendiente')
      ).length
    },
    pedidosAtendidosCount() {
      return this.data.pedidos.filter(
        (p) =>
          p.fechaAtencion ||
          p.idEstadoActual === 2 ||
          (p.estado || '')
            .toLowerCase()
            .includes('programad') ||
          (p.estado || '')
            .toLowerCase()
            .includes('atendid')
      ).length
    },
    totalPedidosMonto() {
      return this.data.pedidos.reduce(
        (acc, item) =>
          acc + (item.totalAfecha || 0),
        0
      )
    },
    totalNuevoPedido() {
      return this.newPedido.detallePedido.reduce(
        (acc, item) =>
          acc + item.cantidad * item.precio,
        0
      )
    }
  },

  methods: {
    showAlert(msg, type = 'success') {
      this.alert.message = msg
      this.alert.type = type
      this.alert.show = true
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

      this.search.desde = null
      this.search.hasta = null
      this.search.fechaEntregaProgramadaDesde = null
      this.search.fechaEntregaProgramadaHasta = null
      this.search.fechaEntregadoDesde = null
      this.search.fechaEntregadoHasta = null
      this.search.fechaAtencionDesde = null
      this.search.fechaAtencionHasta = null

      if (type === 'pedidos_hoy') {
        this.search.quickFilter = 'pedidos_hoy'
        this.search.desde = hoy
        this.search.hasta = hoy
      } else if (type === 'pedidos_ayer') {
        const dAyer = new Date()
        dAyer.setDate(dAyer.getDate() - 1)
        const ayer = this.formatDateStr(dAyer)
        this.search.quickFilter = 'pedidos_ayer'
        this.search.desde = ayer
        this.search.hasta = ayer
      } else if (type === 'pedidos_semana') {
        const dSemana = new Date()
        const dayOfWeek = dSemana.getDay()
        const diffToMonday = dSemana.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
        const monday = new Date(dSemana.setDate(diffToMonday))
        const inicioSemana = this.formatDateStr(monday)

        this.search.quickFilter = 'pedidos_semana'
        this.search.desde = inicioSemana
        this.search.hasta = hoy
      } else {
        this.search.quickFilter = null
      }

      this.getPedidos()
    },

    clearFilters() {
      this.search = {
        quickFilter: null,
        desde: null,
        hasta: null,
        fechaEntregaProgramadaDesde: null,
        fechaEntregaProgramadaHasta: null,
        fechaEntregadoDesde: null,
        fechaEntregadoHasta: null,
        fechaAtencionDesde: null,
        fechaAtencionHasta: null,
        idCliente: null,
        idEstadoActual: null,
        noPedido: null
      }
      this.showAdvancedFilters = false
      this.getPedidos()
    },

    async getPedidos() {
      this.loading = true
      const filterReq = {
        desde: this.search.desde || null,
        hasta: this.search.hasta || null,
        fechaEntregaProgramadaDesde:
          this.search.fechaEntregaProgramadaDesde || null,
        fechaEntregaProgramadaHasta:
          this.search.fechaEntregaProgramadaHasta || null,
        fechaEntregadoDesde:
          this.search.fechaEntregadoDesde || null,
        fechaEntregadoHasta:
          this.search.fechaEntregadoHasta || null,
        fechaAtencionDesde:
          this.search.fechaAtencionDesde || null,
        fechaAtencionHasta:
          this.search.fechaAtencionHasta || null,
        idCliente: this.search.idCliente || null,
        idEstadoActual:
          this.search.idEstadoActual || null,
        noPedido: this.search.noPedido || null
      }

      try {
        const res =
          await this.requestHttp.getPedidos(
            filterReq
          )
        if (res.code === 200) {
          // Filtrar en recepción para mostrar solamente pedidos pendientes y programados/atendidos
          this.data.pedidos = (
            res.data || []
          ).filter((p) => {
            const estado = (
              p.estado || ''
            ).toLowerCase()
            return (
              estado.includes('pendiente') ||
              estado.includes('programad') ||
              estado.includes('atendid') ||
              p.idEstadoActual === 1 ||
              p.idEstadoActual === 2
            )
          })
        } else {
          this.showAlert(
            'No se pudieron cargar los pedidos',
            'error'
          )
        }
      } catch (e) {
        console.error(e)
        this.showAlert(
          'Ocurrió un error al obtener listado de pedidos',
          'error'
        )
      } finally {
        this.loading = false
      }
    },

    openProgramarEntregaDialog(item) {
      this.selectedPedido = item
      const hoy = this.getTodayStr()
      this.programarForm = {
        fechaEntregaProgramada: item.fechaEntregaProgramada
          ? item.fechaEntregaProgramada.substr(0, 10)
          : hoy
      }
      this.dialogs.programarEntrega = true
    },

    async guardarProgramacionEntrega() {
      if (!this.programarForm.fechaEntregaProgramada) {
        this.showAlert(
          'Por favor seleccione la fecha de entrega a programar',
          'warning'
        )
        return
      }

      this.saving = true
      try {
        const payload = {
          fechaEntregaProgramada: this.programarForm.fechaEntregaProgramada
        }

        const res = await this.requestHttp.programarEntregaPedido(
          this.selectedPedido.idPedido,
          payload
        )

        if (res.code === 200) {
          this.dialogs.programarEntrega = false
          this.showAlert(
            res.data?.msg || 'Entrega del pedido programada correctamente',
            'success'
          )
          this.getPedidos()
        } else {
          this.showAlert(
            res.data?.msg || 'Error al programar la entrega del pedido',
            'error'
          )
        }
      } catch (e) {
        console.error(e)
        this.showAlert(
          'Error al conectar con el servidor para programar entrega',
          'error'
        )
      } finally {
        this.saving = false
      }
    },

    async loadClientes() {
      try {
        const clientsList =
          await this.requestHttp.getClientes()
        this.cmb.clientes = clientsList.map(
          (c) => ({
            title: c.nombre,
            value: c.idCliente
          })
        )
      } catch (e) {
        console.error('Error loading clients:', e)
      }
    },

    async loadEstados() {
      try {
        const res =
          await this.requestHttp.getPedidosEstados()
        if (res.code === 200) {
          // Filtrar para que solo aparezcan los estados: Pendiente y Programado
          this.cmb.estados = res.data
            .filter((e) => {
              const name = (
                e.title || ''
              ).toLowerCase()
              return (
                name.includes('pendiente') ||
                name.includes('programad') ||
                name.includes('atendid')
              )
            })
            .map((e) => ({
              title: e.title,
              value: e.value
            }))
        }
      } catch (e) {
        console.error(
          'Error loading order states:',
          e
        )
      }
    },

    async loadProductos() {
      try {
        const res =
          await this.requestHttp.getProductos(
            null
          )
        if (res.code === 200) {
          this.data.allProductsRaw = res.data
          this.cmb.productos = res.data.map(
            (p) => ({
              title: p.nombre,
              value: p.idProducto
            })
          )
        }
      } catch (e) {
        console.error(
          'Error loading products:',
          e
        )
      }
    },

    getEstadoColor(idEstado) {
      const colors = {
        1: 'warning', // Pendiente
        2: 'info', // Atendido
        3: 'success', // Entregado
        4: 'error' // Cancelado
      }
      return colors[idEstado] || 'grey'
    },

    formatCurrency(val) {
      if (val === null || val === undefined)
        return 'C$ 0.00'
      return new Intl.NumberFormat('es-NI', {
        style: 'currency',
        currency: 'NIO'
      }).format(val)
    },

    formatDate(dateString) {
      if (!dateString) return '—'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    async viewPedidoDetail(item) {
      this.loading = true
      this.viewTab = 1
      try {
        const res =
          await this.requestHttp.getPedidoById(
            item.idPedido
          )
        if (res.code === 200) {
          this.selectedPedido = res.data
          this.dialogs.view = true
        } else {
          this.showAlert(
            'No se pudieron obtener los detalles del pedido',
            'error'
          )
        }
      } catch (e) {
        console.error(e)
        this.showAlert(
          'Error al abrir detalle del pedido',
          'error'
        )
      } finally {
        this.loading = false
      }
    },

    openCreateDialog() {
      this.newPedido = {
        idCliente: null,
        isSolicitudCredito: false,
        observaciones: '',
        enviarA: '',
        ubicacion: '',
        fechaEntregaSolicitada: new Date(
          Date.now() + 86400000
        )
          .toISOString()
          .substr(0, 10), // default to tomorrow
        detallePedido: []
      }
      this.productForm = {
        idProducto: null,
        cantidad: 1,
        observaciones: ''
      }
      this.dialogs.create = true
    },

    closeCreateDialog() {
      this.dialogs.create = false
    },

    async addProductToPedido() {
      const formProdId =
        this.productForm.idProducto
      const formQty = Number(
        this.productForm.cantidad
      )

      if (!formProdId || formQty <= 0) {
        this.showAlert(
          'Seleccione un producto y cantidad válida',
          'warning'
        )
        return
      }

      let fullProduct = null
      try {
        // Fetch product to evaluate price
        const res =
          await this.requestHttp.getByIdProducto(
            formProdId
          )
        if (res) {
          fullProduct = res
        }
      } catch (e) {
        console.error(e)
        this.showAlert(
          'Error al obtener información del producto',
          'error'
        )
        return
      }

      if (!fullProduct) {
        this.showAlert(
          'No se encontró el producto',
          'error'
        )
        return
      }

      const existingItemIndex =
        this.newPedido.detallePedido.findIndex(
          (item) => item.idProducto === formProdId
        )
      let totalQty = formQty
      let mergedObservaciones =
        this.productForm.observaciones

      if (existingItemIndex !== -1) {
        const existingItem =
          this.newPedido.detallePedido[
            existingItemIndex
          ]
        totalQty += Number(existingItem.cantidad)
        mergedObservaciones = [
          existingItem.observaciones,
          this.productForm.observaciones
        ]
          .filter(Boolean)
          .join(', ')
      }

      let precioUnitario = fullProduct.precio
      if (
        fullProduct.esMayorista &&
        fullProduct.precioMayorista &&
        fullProduct.precioMayorista.length > 0
      ) {
        const matchingRange =
          fullProduct.precioMayorista.find(
            (pm) =>
              totalQty >= pm.minimo &&
              (pm.rangoIndefinido ||
                totalQty <= pm.maximo)
          )
        if (matchingRange) {
          precioUnitario = matchingRange.precio
        } else {
          precioUnitario = fullProduct.precio
        }
      }

      if (existingItemIndex !== -1) {
        this.newPedido.detallePedido[
          existingItemIndex
        ].cantidad = totalQty
        this.newPedido.detallePedido[
          existingItemIndex
        ].precio = precioUnitario
        this.newPedido.detallePedido[
          existingItemIndex
        ].observaciones = mergedObservaciones
      } else {
        this.newPedido.detallePedido.push({
          idProducto: formProdId,
          nombre: fullProduct.nombre,
          cantidad: formQty,
          precio: precioUnitario,
          observaciones:
            this.productForm.observaciones
        })
      }

      this.productForm = {
        idProducto: null,
        cantidad: 1,
        observaciones: ''
      }
    },

    removeProductFromPedido(index) {
      this.newPedido.detallePedido.splice(
        index,
        1
      )
    },

    async savePedido() {
      const validate =
        await this.$refs.form.validate()
      if (!validate.valid) {
        this.showAlert(
          'Complete los campos obligatorios del pedido',
          'warning'
        )
        return
      }

      if (
        this.newPedido.detallePedido.length === 0
      ) {
        this.showAlert(
          'El pedido debe tener al menos un producto',
          'warning'
        )
        return
      }

      this.saving = true

      const reqData = {
        idAperturaCaja: null,
        idCliente: this.newPedido.idCliente,
        isSolicitudCredito:
          this.newPedido.isSolicitudCredito,
        observaciones:
          this.newPedido.observaciones || null,
        enviarA: this.newPedido.enviarA || null,
        usuarioRegistro:
          this.store.getNameUser() || 'Sistema',
        ubicacion:
          this.newPedido.ubicacion || null,
        fechaEntregaSolicitada: new Date(
          this.newPedido.fechaEntregaSolicitada
        ),
        detallePedido:
          this.newPedido.detallePedido.map(
            (item) => ({
              idProducto: item.idProducto,
              cantidad: item.cantidad,
              observaciones:
                item.observaciones || null
            })
          )
      }

      try {
        const res =
          await this.requestHttp.postPedido(
            reqData
          )
        if (res.code === 200) {
          this.showAlert(
            'Pedido guardado correctamente',
            'success'
          )
          this.closeCreateDialog()
          this.getPedidos()
        } else {
          this.showAlert(
            res.data?.msg ||
              'Error al guardar el pedido',
            'error'
          )
        }
      } catch (e) {
        console.error(e)
        this.showAlert(
          'Error al procesar la solicitud de guardado',
          'error'
        )
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.italic {
  font-style: italic;
}
</style>
