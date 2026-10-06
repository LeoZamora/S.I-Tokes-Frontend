<template>
  <div class="w-100 pa-2 font">
    <!-- Snackbar para alertas -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="4000"
      location="top right"
      elevation="8"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2" size="large">{{
          snackbar.icon
        }}</v-icon>
        <span class="font-weight-medium">{{
          snackbar.text
        }}</span>
      </div>
    </v-snackbar>

    <!-- Encabezado y Acciones Principales -->
    <v-card
      class="border-t border-b mb-3"
      elevation="0"
      rounded="0"
    >
      <div
        class="d-flex align-center justify-space-between flex-wrap pa-3"
      >
        <div class="d-flex align-center">
          <v-avatar
            color="indigo-lighten-5"
            size="44"
            class="me-3"
          >
            <v-icon
              color="indigo-darken-4"
              size="26"
              >mdi-tune-vertical-variant</v-icon
            >
          </v-avatar>
          <div>
            <div
              class="text-h6 font-weight-bold text-indigo-darken-4"
            >
              Ajustes de Stock
            </div>
            <div
              class="text-caption text-grey-darken-1"
            >
              Administración, balance físico y
              auditoría de ajustes de inventario
              por bodega
            </div>
          </div>
        </div>

        <div
          class="d-flex align-center ga-2 mt-2 mt-sm-0"
        >
          <v-btn
            color="red-darken-3"
            prepend-icon="mdi-file-pdf-box"
            variant="outlined"
            density="comfortable"
            class="rounded font-weight-bold text-none"
            @click="exportarPDF"
            :disabled="
              loading ||
              (activeTab === 'historial'
                ? filteredAjustes.length === 0
                : stockBodegas.length === 0)
            "
          >
            Exportar PDF
          </v-btn>

          <v-btn
            color="green-darken-3"
            prepend-icon="mdi-file-excel"
            variant="outlined"
            density="comfortable"
            class="rounded font-weight-bold text-none"
            @click="exportarExcel"
            :disabled="
              loading ||
              (activeTab === 'historial'
                ? filteredAjustes.length === 0
                : stockBodegas.length === 0)
            "
          >
            Exportar Excel
          </v-btn>

          <v-btn
            color="indigo-darken-4"
            prepend-icon="mdi-plus-circle"
            variant="elevated"
            density="comfortable"
            class="rounded font-weight-bold text-none"
            elevation="2"
            @click="abrirModalAjuste()"
          >
            Nuevo Ajuste de Stock
          </v-btn>
        </div>
      </div>

      <v-divider />

      <!-- Tarjetas de Métricas Resumen -->
      <!--<v-row class="pa-3 align-center" dense>
        <v-col cols="12" sm="6" md="3">
          <v-card
            variant="flat"
            color="blue-lighten-5"
            class="pa-3 rounded-lg border"
          >
            <div
              class="d-flex align-center justify-space-between"
            >
              <div>
                <div
                  class="text-caption text-grey-darken-2 font-weight-bold"
                >
                  TOTAL AJUSTES
                </div>
                <div
                  class="text-h6 font-weight-bold text-blue-darken-4"
                >
                  {{ stats.totalAjustes }}
                </div>
                <div
                  class="text-caption text-grey"
                >
                  Movimientos registrados
                </div>
              </div>
              <v-avatar
                color="blue-lighten-4"
                size="42"
              >
                <v-icon color="blue-darken-4"
                  >mdi-clipboard-list-outline</v-icon
                >
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card
            variant="flat"
            color="green-lighten-5"
            class="pa-3 rounded-lg border"
          >
            <div
              class="d-flex align-center justify-space-between"
            >
              <div>
                <div
                  class="text-caption text-green-darken-3 font-weight-bold"
                >
                  AJUSTES DE ENTRADA (+)
                </div>
                <div
                  class="text-h6 font-weight-bold text-green-darken-4"
                >
                  {{ stats.ajustesPositivos }}
                  <span
                    class="text-caption text-green-darken-2 font-weight-regular"
                  >
                    (+{{
                      stats.unidadesPositivas
                    }}
                    uds)
                  </span>
                </div>
                <div
                  class="text-caption text-grey"
                >
                  Incrementos de stock
                </div>
              </div>
              <v-avatar
                color="green-lighten-4"
                size="42"
              >
                <v-icon color="green-darken-3"
                  >mdi-arrow-up-bold-circle-outline</v-icon
                >
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card
            variant="flat"
            color="orange-lighten-5"
            class="pa-3 rounded-lg border"
          >
            <div
              class="d-flex align-center justify-space-between"
            >
              <div>
                <div
                  class="text-caption text-orange-darken-3 font-weight-bold"
                >
                  AJUSTES DE SALIDA (-)
                </div>
                <div
                  class="text-h6 font-weight-bold text-orange-darken-4"
                >
                  {{ stats.ajustesNegativos }}
                  <span
                    class="text-caption text-orange-darken-2 font-weight-regular"
                  >
                    ({{
                      stats.unidadesNegativas
                    }}
                    uds)
                  </span>
                </div>
                <div
                  class="text-caption text-grey"
                >
                  Disminuciones de stock
                </div>
              </div>
              <v-avatar
                color="orange-lighten-4"
                size="42"
              >
                <v-icon color="orange-darken-3"
                  >mdi-arrow-down-bold-circle-outline</v-icon
                >
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card
            variant="flat"
            color="indigo-lighten-5"
            class="pa-3 rounded-lg border"
          >
            <div
              class="d-flex align-center justify-space-between"
            >
              <div>
                <div
                  class="text-caption text-indigo-darken-3 font-weight-bold"
                >
                  BODEGAS ACTIVAS
                </div>
                <div
                  class="text-h6 font-weight-bold text-indigo-darken-4"
                >
                  {{ stats.totalBodegas }}
                </div>
                <div
                  class="text-caption text-grey"
                >
                  {{
                    stats.totalProductosConStock
                  }}
                  productos monitoreados
                </div>
              </div>
              <v-avatar
                color="indigo-lighten-4"
                size="42"
              >
                <v-icon color="indigo-darken-3"
                  >mdi-warehouse</v-icon
                >
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>-->

      <v-divider />

      <!-- Tabs de Navegación -->
      <v-tabs
        v-model="activeTab"
        color="indigo-darken-4"
        density="comfortable"
        class="px-2"
      >
        <v-tab
          value="historial"
          class="font-weight-bold text-none"
        >
          <v-icon start>mdi-history</v-icon>
          Historial de Ajustes
        </v-tab>
        <v-tab
          value="stock-bodegas"
          class="font-weight-bold text-none"
        >
          <v-icon start
            >mdi-format-list-checks</v-icon
          >
          Stock Físico por Bodega
        </v-tab>
      </v-tabs>
    </v-card>

    <!-- VISTA 1: HISTORIAL DE AJUSTES -->
    <v-window v-model="activeTab">
      <v-window-item value="historial">
        <!-- Barra de Filtros para el Historial -->
        <v-card
          elevation="0"
          class="border rounded mb-3 pa-3 bg-white"
        >
          <v-row dense align="center">
            <!-- 1. Búsqueda General -->
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="filtrosHistorial.search"
                label="Buscar..."
                placeholder="Referencia, producto, usuario..."
                density="compact"
                variant="outlined"
                color="indigo"
                append-inner-icon="mdi-magnify"
                hide-details
                clearable
              />
            </v-col>

            <!-- 2. Filtro por Bodega -->
            <v-col cols="12" sm="6" md="3">
              <v-autocomplete
                v-model="
                  filtrosHistorial.idBodega
                "
                :items="bodegasCombobox"
                item-title="nombre"
                item-value="id"
                label="Filtrar por Bodega"
                placeholder="Todas las bodegas"
                density="compact"
                variant="outlined"
                color="indigo"
                prepend-inner-icon="mdi-warehouse"
                hide-details
                clearable
                @update:model-value="
                  filtrarHistorial
                "
              />
            </v-col>

            <!-- 3. Filtro por Concepto (TM07) -->
            <v-col cols="12" sm="6" md="3">
              <v-autocomplete
                v-model="
                  filtrosHistorial.idConcepto
                "
                :items="conceptosCombobox"
                item-title="nombreCompleto"
                item-value="id"
                label="Concepto de Ajuste"
                placeholder="Todos"
                density="compact"
                variant="outlined"
                color="indigo"
                prepend-inner-icon="mdi-tag-outline"
                hide-details
                clearable
                @update:model-value="
                  filtrarHistorial
                "
              />
            </v-col>

            <!-- 4. Filtro por Tipo de Operación -->
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="
                  filtrosHistorial.tipoOperacion
                "
                :items="tiposOperacion"
                item-title="title"
                item-value="value"
                label="Operación"
                density="compact"
                variant="outlined"
                color="indigo"
                prepend-inner-icon="mdi-swap-vertical"
                hide-details
                @update:model-value="
                  filtrarHistorial
                "
              />
            </v-col>

            <!-- 5. Fecha Desde -->
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="
                  filtrosHistorial.fechaDesde
                "
                type="date"
                label="Fecha Desde"
                density="compact"
                variant="outlined"
                color="indigo"
                prepend-inner-icon="mdi-calendar-start"
                hide-details
                clearable
                @update:model-value="
                  filtrarHistorial
                "
              />
            </v-col>

            <!-- 6. Fecha Hasta -->
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="
                  filtrosHistorial.fechaHasta
                "
                type="date"
                label="Fecha Hasta"
                density="compact"
                variant="outlined"
                color="indigo"
                prepend-inner-icon="mdi-calendar-end"
                hide-details
                clearable
                @update:model-value="
                  filtrarHistorial
                "
              />
            </v-col>

            <!-- 7. Botón Rápido Mes Actual y Botones de Acción -->
            <v-col
              cols="12"
              sm="12"
              md="6"
              class="d-flex align-center justify-end ga-2 pt-1"
            >
              <v-btn
                variant="tonal"
                color="indigo-darken-3"
                size="small"
                class="text-none font-weight-bold"
                prepend-icon="mdi-calendar-month"
                @click="establecerMesActual"
              >
                Mes Actual
              </v-btn>

              <v-tooltip
                text="Actualizar datos"
                location="top"
              >
                <template
                  v-slot:activator="{ props }"
                >
                  <v-btn
                    v-bind="props"
                    icon="mdi-refresh"
                    variant="tonal"
                    color="indigo-darken-3"
                    size="small"
                    @click="cargarDatos(true)"
                    :loading="loading"
                  />
                </template>
              </v-tooltip>

              <v-tooltip
                text="Limpiar filtros"
                location="top"
              >
                <template
                  v-slot:activator="{ props }"
                >
                  <v-btn
                    v-bind="props"
                    icon="mdi-broom"
                    variant="tonal"
                    color="grey-darken-1"
                    size="small"
                    @click="
                      limpiarFiltrosHistorial
                    "
                  />
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card>

        <!-- Tabla del Historial de Ajustes -->
        <v-card
          elevation="0"
          class="border rounded"
        >
          <v-data-table
            :headers="headersHistorial"
            :items="filteredAjustes"
            :search="filtrosHistorial.search"
            :loading="loading"
            density="compact"
            class="font"
            hover
            :items-per-page="15"
            :items-per-page-options="[
              10, 15, 25, 50, 100
            ]"
          >
            <!-- Loader -->
            <template v-slot:loading>
              <v-skeleton-loader
                type="table-row@8"
              />
            </template>

            <!-- Referencia Kardex -->
            <template
              v-slot:[`item.referenciaKardex`]="{
                item
              }"
            >
              <v-chip
                size="small"
                variant="tonal"
                color="indigo-darken-3"
                class="font-weight-bold"
              >
                <v-icon start size="14"
                  >mdi-barcode-scan</v-icon
                >
                {{
                  item.referenciaKardex ||
                  `AJU-${item.idAjusteStock}`
                }}
              </v-chip>
            </template>

            <!-- Fecha de Registro -->
            <template
              v-slot:[`item.fechaRegistro`]="{
                item
              }"
            >
              <div class="d-flex align-center">
                <v-icon
                  size="small"
                  color="grey"
                  class="me-1"
                  >mdi-calendar-clock</v-icon
                >
                <span class="text-caption">{{
                  formatearFechaHora(
                    item.fechaRegistro
                  )
                }}</span>
              </div>
            </template>

            <!-- Producto -->
            <template
              v-slot:[`item.producto`]="{ item }"
            >
              <div class="py-1">
                <div
                  class="font-weight-bold text-body-2 text-indigo-darken-4"
                >
                  {{ item.producto }}
                </div>
              </div>
            </template>

            <!-- Bodega -->
            <template
              v-slot:[`item.bodega`]="{ item }"
            >
              <div class="d-flex align-center">
                <v-icon
                  size="small"
                  color="blue-grey"
                  class="me-1"
                  >mdi-warehouse</v-icon
                >
                <span
                  class="font-weight-medium text-caption"
                  >{{
                    item.bodega || '- - -'
                  }}</span
                >
              </div>
            </template>

            <!-- Concepto -->
            <template
              v-slot:[`item.concepto`]="{ item }"
            >
              <v-chip
                size="small"
                variant="flat"
                color="blue-lighten-5"
                class="text-blue-darken-4 font-weight-medium"
              >
                {{
                  item.concepto ||
                  'Ajuste de Stock'
                }}
              </v-chip>
            </template>

            <!-- Stock Anterior -->
            <template
              v-slot:[`item.stockAnterior`]="{
                item
              }"
            >
              <span
                class="text-body-2 text-grey-darken-2"
              >
                {{
                  Number(
                    item.stockAnterior || 0
                  ).toLocaleString('es-NI')
                }}
              </span>
            </template>

            <!-- Cantidad Ajustada (Delta) -->
            <template
              v-slot:[`item.cantidadAjustada`]="{
                item
              }"
            >
              <v-chip
                size="small"
                :color="
                  item.cantidadAjustada >= 0
                    ? 'green-darken-1'
                    : 'deep-orange-darken-2'
                "
                variant="flat"
                class="font-weight-bold text-white"
              >
                <v-icon start size="14">
                  {{
                    item.cantidadAjustada >= 0
                      ? 'mdi-plus'
                      : 'mdi-minus'
                  }}
                </v-icon>
                {{
                  Math.abs(
                    item.cantidadAjustada || 0
                  ).toLocaleString('es-NI')
                }}
              </v-chip>
            </template>

            <!-- Stock Resultante -->
            <template
              v-slot:[`item.stockActual`]="{
                item
              }"
            >
              <span
                class="font-weight-bold text-body-2 text-indigo-darken-4"
              >
                {{
                  Number(
                    item.stockActual || 0
                  ).toLocaleString('es-NI')
                }}
              </span>
            </template>

            <!-- Tipo de Operación -->
            <template
              v-slot:[`item.tipoOperacion`]="{
                item
              }"
            >
              <v-chip
                size="x-small"
                :color="
                  item.tipoOperacion === 'Entrada'
                    ? 'green'
                    : 'orange-darken-3'
                "
                variant="outlined"
                class="font-weight-bold text-uppercase"
              >
                <v-icon start size="12">
                  {{
                    item.tipoOperacion ===
                    'Entrada'
                      ? 'mdi-arrow-up'
                      : 'mdi-arrow-down'
                  }}
                </v-icon>
                {{
                  item.tipoOperacion ||
                  (item.stockActual >=
                  item.stockAnterior
                    ? 'Entrada'
                    : 'Salida')
                }}
              </v-chip>
            </template>

            <!-- Observaciones -->
            <template
              v-slot:[`item.observaciones`]="{
                item
              }"
            >
              <span
                class="text-caption text-grey-darken-2 text-truncate d-inline-block"
                style="max-width: 180px"
              >
                {{
                  item.observaciones || '- - -'
                }}
                <v-tooltip
                  v-if="item.observaciones"
                  activator="parent"
                  location="top"
                >
                  {{ item.observaciones }}
                </v-tooltip>
              </span>
            </template>

            <!-- Usuario Registro -->
            <template
              v-slot:[`item.usuarioRegistro`]="{
                item
              }"
            >
              <div class="d-flex align-center">
                <v-avatar
                  size="20"
                  color="grey-lighten-2"
                  class="me-1"
                >
                  <v-icon
                    size="12"
                    color="grey-darken-2"
                    >mdi-account</v-icon
                  >
                </v-avatar>
                <span class="text-caption">{{
                  item.usuarioRegistro ||
                  'Sistema'
                }}</span>
              </div>
            </template>

            <!-- Acciones -->
            <template
              v-slot:[`item.actions`]="{ item }"
            >
              <v-btn
                icon="mdi-eye"
                size="small"
                variant="text"
                color="indigo-darken-3"
                @click="verDetalleAjuste(item)"
              >
                <v-icon size="18">mdi-eye</v-icon>
                <v-tooltip
                  activator="parent"
                  location="top"
                  >Ver Detalle Completo</v-tooltip
                >
              </v-btn>
            </template>

            <!-- Estado Vacío -->
            <template v-slot:no-data>
              <div class="text-center py-8">
                <v-icon
                  size="48"
                  color="grey-lighten-1"
                  class="mb-2"
                >
                  mdi-clipboard-text-search-outline
                </v-icon>
                <div
                  class="text-subtitle-1 font-weight-bold text-grey-darken-1"
                >
                  No se encontraron registros de
                  ajustes
                </div>
                <div
                  class="text-caption text-grey"
                >
                  Utiliza el botón "Nuevo Ajuste
                  de Stock" para registrar un
                  balance de inventario
                </div>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>

      <!-- VISTA 2: STOCK FÍSICO POR BODEGA -->
      <v-window-item value="stock-bodegas">
        <!-- Filtros para la vista de stock por bodega -->
        <v-card
          elevation="0"
          class="border rounded mb-3 pa-3 bg-white"
        >
          <v-row dense align="center">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="filtrosStock.search"
                label="Buscar producto en bodega..."
                placeholder="Código, descripción..."
                density="compact"
                variant="outlined"
                color="indigo"
                append-inner-icon="mdi-magnify"
                hide-details
                clearable
              />
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-autocomplete
                v-model="filtrosStock.idBodega"
                :items="bodegasCombobox"
                item-title="nombre"
                item-value="id"
                label="Seleccionar Bodega"
                placeholder="Todas las bodegas"
                density="compact"
                variant="outlined"
                color="indigo"
                prepend-inner-icon="mdi-warehouse"
                hide-details
                clearable
                @update:model-value="
                  cargarStockBodegas
                "
              />
            </v-col>

            <v-col cols="12" sm="6" md="2">
              <v-switch
                v-model="
                  filtrosStock.soloConStock
                "
                label="Solo con stock"
                color="indigo"
                density="compact"
                hide-details
                @update:model-value="
                  cargarStockBodegas
                "
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="2"
              class="d-flex justify-end"
            >
              <v-btn
                prepend-icon="mdi-refresh"
                variant="tonal"
                color="indigo-darken-3"
                density="comfortable"
                class="rounded text-none font-weight-bold"
                @click="cargarStockBodegas"
                :loading="loadingStock"
              >
                Actualizar
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Tabla de Stock por Bodega -->
        <v-card
          elevation="0"
          class="border rounded"
        >
          <v-data-table
            :headers="headersStockBodegas"
            :items="stockBodegas"
            :search="filtrosStock.search"
            :loading="loadingStock"
            density="compact"
            class="font"
            hover
            :items-per-page="15"
          >
            <!-- Loader -->
            <template v-slot:loading>
              <v-skeleton-loader
                type="table-row@8"
              />
            </template>

            <!-- Bodega -->
            <template
              v-slot:[`item.bodegaNombre`]="{
                item
              }"
            >
              <div class="d-flex align-center">
                <v-icon
                  size="small"
                  color="indigo"
                  class="me-1"
                  >mdi-warehouse</v-icon
                >
                <span
                  class="font-weight-medium"
                  >{{ item.bodegaNombre }}</span
                >
                <span
                  class="text-caption text-grey ms-1"
                  v-if="item.bodegaCodigo"
                >
                  ({{ item.bodegaCodigo }})
                </span>
              </div>
            </template>

            <!-- Código Producto -->
            <template
              v-slot:[`item.codigo`]="{ item }"
            >
              <v-chip
                size="small"
                variant="outlined"
                color="indigo-darken-3"
                class="font-weight-bold"
              >
                {{ item.codigo || 'N/A' }}
              </v-chip>
            </template>

            <!-- Nombre Producto -->
            <template
              v-slot:[`item.nombre`]="{ item }"
            >
              <div
                class="font-weight-bold text-body-2"
              >
                {{ item.nombre }}
              </div>
              <div
                class="text-caption text-grey"
                v-if="
                  item.subCategoria ||
                  item.categoria
                "
              >
                {{ item.categoria }}
                <span v-if="item.subCategoria"
                  >/ {{ item.subCategoria }}</span
                >
              </div>
            </template>

            <!-- Stock en Bodega -->
            <template
              v-slot:[`item.cantidadTotal`]="{
                item
              }"
            >
              <v-chip
                size="small"
                :color="
                  item.cantidadTotal >
                  (item.cantidadMinima || 0)
                    ? 'green-darken-1'
                    : 'red-darken-1'
                "
                variant="flat"
                class="font-weight-bold text-white"
              >
                {{
                  Number(
                    item.cantidadTotal || 0
                  ).toLocaleString('es-NI')
                }}
                {{ item.unidadMedida || 'und' }}
              </v-chip>
            </template>

            <!-- Stock Consolidado General -->
            <template
              v-slot:[`item.cantidadTotalGeneral`]="{
                item
              }"
            >
              <span
                class="font-weight-medium text-body-2"
              >
                {{
                  Number(
                    item.cantidadTotalGeneral || 0
                  ).toLocaleString('es-NI')
                }}
                {{ item.unidadMedida || 'und' }}
              </span>
            </template>

            <!-- Costo Unitario -->
            <template
              v-slot:[`item.costo`]="{ item }"
            >
              <span
                class="text-caption font-weight-medium"
              >
                {{ formatearMoneda(item.costo) }}
              </span>
            </template>

            <!-- Total Valorizado en Bodega -->
            <template
              v-slot:[`item.totalCostoBodega`]="{
                item
              }"
            >
              <span
                class="font-weight-bold text-indigo-darken-4 text-caption"
              >
                {{
                  formatearMoneda(
                    item.totalCostoBodega ||
                      item.cantidadTotal *
                        item.costo
                  )
                }}
              </span>
            </template>

            <!-- Acción Directa Ajustar -->
            <template
              v-slot:[`item.actions`]="{ item }"
            >
              <v-btn
                color="indigo-darken-4"
                variant="tonal"
                size="small"
                prepend-icon="mdi-pencil-box-outline"
                class="rounded font-weight-bold text-none"
                @click="abrirModalAjuste(item)"
              >
                Ajustar Stock
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- DIALOG: AJUSTE DE STOCK (INDIVIDUAL O EN LOTE) -->
    <v-dialog
      v-model="modalAjuste.show"
      max-width="1000"
      persistent
      scrollable
    >
      <v-card class="rounded-lg">
        <!-- Header del Modal -->
        <v-card-title
          class="bg-indigo-darken-4 text-white d-flex align-center py-3 px-4"
        >
          <v-icon
            color="white"
            size="24"
            class="me-2"
            >mdi-playlist-edit</v-icon
          >
          <div>
            <div
              class="text-subtitle-1 font-weight-bold"
            >
              Registrar Ajuste de Stock
            </div>
            <div
              class="text-caption text-indigo-lighten-4"
            >
              Ajuste uno o múltiples productos en
              una sola transacción auditada en
              Kardex
            </div>
          </div>
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            color="white"
            @click="cerrarModalAjuste"
            :disabled="modalAjuste.loading"
          />
        </v-card-title>

        <v-divider />

        <!-- Cuerpo del Modal -->
        <v-card-text
          class="pa-4 bg-white"
          style="max-height: 75vh"
        >
          <v-form
            ref="formAjuste"
            v-model="modalAjuste.valid"
            lazy-validation
          >
            <!-- 1. Configuración General del Lote -->
            <v-row dense class="mb-2">
              <!-- Bodega Física -->
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="modalAjuste.idBodega"
                  :items="bodegasCombobox"
                  item-title="nombre"
                  item-value="id"
                  label="Bodega Física *"
                  placeholder="Seleccione la bodega..."
                  density="comfortable"
                  variant="outlined"
                  color="indigo"
                  prepend-inner-icon="mdi-warehouse"
                  :rules="[
                    (v) =>
                      !!v ||
                      'Seleccione una bodega'
                  ]"
                  @update:model-value="
                    onCambioBodegaModal
                  "
                  hide-details="auto"
                />
              </v-col>

              <!-- Concepto de Ajuste Predeterminado -->
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="modalAjuste.idConcepto"
                  :items="conceptosCombobox"
                  item-title="nombreCompleto"
                  item-value="id"
                  label="Concepto Predeterminado *"
                  placeholder="Seleccione el concepto..."
                  density="comfortable"
                  variant="outlined"
                  color="indigo"
                  prepend-inner-icon="mdi-tag-outline"
                  :rules="[
                    (v) =>
                      !!v ||
                      'Seleccione un concepto de ajuste'
                  ]"
                  hide-details="auto"
                />
              </v-col>

              <!-- Observaciones Generales -->
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="
                    modalAjuste.observaciones
                  "
                  label="Observaciones generales"
                  placeholder="Motivo general del ajuste..."
                  density="comfortable"
                  variant="outlined"
                  color="indigo"
                  prepend-inner-icon="mdi-comment-text-outline"
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <!-- 2. Panel: Seleccionar y Añadir Productos al Lote -->
            <v-card
              variant="outlined"
              class="pa-3 mb-3 rounded-lg bg-indigo-lighten-5 border-indigo-lighten-3"
            >
              <div
                class="d-flex align-center justify-space-between mb-2 flex-wrap ga-2"
              >
                <div
                  class="text-caption font-weight-bold text-indigo-darken-4 d-flex align-center"
                >
                  <v-icon
                    size="18"
                    class="me-1"
                    color="indigo-darken-4"
                    >mdi-package-variant-closed-plus</v-icon
                  >
                  SELECCIONAR Y AGREGAR PRODUCTO
                </div>
                <div
                  v-if="
                    modalAjuste.nuevoItem
                      .productoSeleccionado
                  "
                  class="text-caption text-indigo-darken-3 font-weight-medium"
                >
                  Stock actual en bodega:
                  <strong
                    >{{
                      Number(
                        modalAjuste.nuevoItem
                          .stockActualBodega || 0
                      ).toLocaleString('es-NI')
                    }}
                    {{
                      modalAjuste.nuevoItem
                        .productoSeleccionado
                        .unidadMedida || 'und'
                    }}</strong
                  >
                </div>
              </div>

              <v-row dense align="center">
                <!-- Operación: Disminuir / Aumentar -->
                <v-col cols="12" sm="12">
                  <v-btn-toggle
                    v-model="
                      modalAjuste.nuevoItem
                        .tipoMovimiento
                    "
                    mandatory
                    density="compact"
                    color="indigo-darken-4"
                    variant="outlined"
                    class="w-100 bg-white"
                    @update:model-value="
                      calcularNuevoStock
                    "
                  >
                    <v-btn
                      value="disminuir"
                      class="flex-grow-1 text-none font-weight-bold"
                      color="deep-orange-darken-3"
                    >
                      <v-icon start size="16"
                        >mdi-minus-circle-outline</v-icon
                      >
                      Disminuir (-)
                    </v-btn>
                    <v-btn
                      value="aumentar"
                      class="flex-grow-1 text-none font-weight-bold"
                      color="green-darken-3"
                    >
                      <v-icon start size="16"
                        >mdi-plus-circle-outline</v-icon
                      >
                      Aumentar (+)
                    </v-btn>
                  </v-btn-toggle>
                </v-col>

                <!-- Selector de Producto -->
                <v-col cols="12" sm="8">
                  <v-autocomplete
                    v-model="
                      modalAjuste.nuevoItem
                        .idProducto
                    "
                    :items="
                      modalAjuste.productosBodega
                    "
                    :item-title="
                      (item) =>
                        `${item.codigo || ''} - ${item.nombre}`
                    "
                    item-value="idProducto"
                    :label="
                      !modalAjuste.idBodega
                        ? 'Seleccione primero una bodega...'
                        : 'Producto a ajustar *'
                    "
                    :placeholder="
                      !modalAjuste.idBodega
                        ? 'Seleccione primero una bodega'
                        : modalAjuste.loadingProductos
                          ? 'Cargando productos...'
                          : 'Buscar producto...'
                    "
                    :disabled="
                      !modalAjuste.idBodega ||
                      modalAjuste.loadingProductos
                    "
                    :loading="
                      modalAjuste.loadingProductos
                    "
                    density="compact"
                    variant="outlined"
                    color="indigo"
                    bg-color="white"
                    prepend-inner-icon="mdi-package-variant-closed"
                    @update:model-value="
                      onSeleccionarProductoModal
                    "
                    no-data-text="No hay productos disponibles en esta bodega"
                    hide-details
                  >
                    <template
                      v-slot:item="{
                        props,
                        item
                      }"
                    >
                      <v-list-item v-bind="props">
                        <template v-slot:subtitle>
                          <span
                            class="text-caption text-indigo font-weight-medium"
                          >
                            Stock actual:
                            {{
                              Number(
                                item.raw
                                  .cantidadTotal ||
                                  0
                              ).toLocaleString(
                                'es-NI'
                              )
                            }}
                            {{
                              item.raw
                                .unidadMedida ||
                              'und'
                            }}
                          </span>
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <!-- Cantidad a Ajustar -->
                <v-col cols="12" sm="2">
                  <v-text-field
                    v-model.number="
                      modalAjuste.nuevoItem
                        .cantidad
                    "
                    type="number"
                    min="1"
                    label="Cantidad *"
                    placeholder="Ej. 5"
                    density="compact"
                    variant="outlined"
                    color="indigo"
                    bg-color="white"
                    hide-details
                    @update:model-value="
                      calcularNuevoStock
                    "
                    @keydown.enter.prevent="
                      agregarProductoAlLote
                    "
                  />
                </v-col>

                <!-- Botón Agregar -->
                <v-col cols="12" sm="2">
                  <v-btn
                    color="indigo-darken-4"
                    prepend-icon="mdi-plus"
                    variant="elevated"
                    density="comfortable"
                    class="w-100 rounded font-weight-bold text-none"
                    @click="agregarProductoAlLote"
                    :disabled="
                      !modalAjuste.nuevoItem
                        .idProducto ||
                      !modalAjuste.nuevoItem
                        .cantidad ||
                      modalAjuste.nuevoItem
                        .cantidad <= 0
                    "
                  >
                    Añadir
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Vista previa en vivo del item a añadir -->
              <v-expand-transition>
                <div
                  class="mt-2 pt-2 border-t d-flex align-center justify-space-between flex-wrap ga-2 text-caption text-grey-darken-3"
                >
                  <div>
                    <span
                      >Stock Actual:
                      <strong>{{
                        modalAjuste.nuevoItem
                          .stockActualBodega
                      }}</strong></span
                    >
                    <span class="mx-1">→</span>
                    <span
                      >Ajuste:
                      <strong
                        :class="
                          modalAjuste.nuevoItem
                            .tipoMovimiento ===
                          'aumentar'
                            ? 'text-green-darken-3'
                            : 'text-deep-orange-darken-3'
                        "
                        >{{
                          modalAjuste.nuevoItem
                            .tipoMovimiento ===
                          'aumentar'
                            ? '+'
                            : '-'
                        }}{{
                          modalAjuste.nuevoItem
                            .cantidad
                        }}</strong
                      ></span
                    >
                    <span class="mx-1">→</span>
                    <span
                      >Nuevo Stock Resultante:
                      <strong
                        class="text-indigo-darken-4"
                        >{{
                          modalAjuste.nuevoItem
                            .stockResultante
                        }}</strong
                      ></span
                    >
                  </div>
                  <div class="text-grey">
                    Presione Enter o clic en
                    "Añadir" para sumar al lote
                  </div>
                </div>
              </v-expand-transition>
            </v-card>

            <!-- 3. Lista / Tabla de Productos en el Lote -->
            <div
              v-if="
                modalAjuste.items.length === 0
              "
              class="text-center pa-6 border border-dashed rounded-lg bg-grey-lighten-5 mb-3"
            >
              <v-icon
                size="42"
                color="grey-lighten-1"
                class="mb-2"
                >mdi-playlist-plus</v-icon
              >
              <div
                class="text-body-2 font-weight-bold text-grey-darken-2"
              >
                No hay productos agregados
                aún
              </div>
              <div class="text-caption text-grey">
                Seleccione un producto arriba,
                indique la cantidad a aumentar o
                disminuir y pulse "Añadir".
              </div>
            </div>

            <!-- Tabla de Productos en el Lote -->
            <v-card
              v-else
              variant="outlined"
              class="rounded-lg overflow-hidden mb-3 border"
            >
              <div
                class="pa-2 px-3 bg-grey-lighten-4 d-flex align-center justify-space-between border-b"
              >
                <span
                  class="text-caption font-weight-bold text-grey-darken-3"
                >
                  PRODUCTOS A AJUSTAR EN EL LOTE
                  ({{ modalAjuste.items.length }})
                </span>
                <v-btn
                  size="x-small"
                  variant="text"
                  color="red-darken-3"
                  prepend-icon="mdi-trash-can-outline"
                  class="text-none font-weight-bold"
                  @click="limpiarLoteCompleto"
                >
                  Limpiar lista
                </v-btn>
              </div>

              <v-table density="compact" hover>
                <thead>
                  <tr class="bg-indigo-lighten-5">
                    <th
                      class="text-caption font-weight-bold text-indigo-darken-4 text-center"
                      style="width: 35px"
                    >
                      #
                    </th>
                    <th
                      class="text-caption font-weight-bold text-indigo-darken-4"
                    >
                      Producto
                    </th>
                    <th
                      class="text-caption font-weight-bold text-indigo-darken-4 text-end"
                      style="width: 100px"
                    >
                      Stock Actual
                    </th>
                    <th
                      class="text-caption font-weight-bold text-indigo-darken-4 text-center"
                      style="width: 130px"
                    >
                      Ajuste (+/-)
                    </th>
                    <th
                      class="text-caption font-weight-bold text-indigo-darken-4 text-end"
                      style="width: 105px"
                    >
                      Nuevo Stock
                    </th>
                    <th
                      class="text-caption font-weight-bold text-indigo-darken-4"
                      style="width: 190px"
                    >
                      Observación
                    </th>
                    <th
                      class="text-caption font-weight-bold text-indigo-darken-4 text-center"
                      style="width: 50px"
                    >
                      Quitar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(
                      item, idx
                    ) in modalAjuste.items"
                    :key="item.idProducto"
                  >
                    <td
                      class="text-caption text-grey text-center"
                    >
                      {{ idx + 1 }}
                    </td>
                    <td>
                      <div
                        class="font-weight-bold text-body-2 text-indigo-darken-4"
                      >
                        {{ item.codigo }}
                      </div>
                      <div
                        class="text-caption text-grey-darken-2"
                      >
                        {{ item.nombre }}
                      </div>
                    </td>
                    <td
                      class="text-end font-weight-medium text-body-2"
                    >
                      {{
                        Number(
                          item.stockActual || 0
                        ).toLocaleString('es-NI')
                      }}
                      <span
                        class="text-caption text-grey"
                        >{{
                          item.unidadMedida
                        }}</span
                      >
                    </td>
                    <td class="text-center">
                      <v-chip
                        size="small"
                        :color="
                          item.tipoMovimiento ===
                          'aumentar'
                            ? 'green-darken-3'
                            : 'deep-orange-darken-3'
                        "
                        variant="flat"
                        class="font-weight-bold"
                      >
                        {{
                          item.tipoMovimiento ===
                          'aumentar'
                            ? '+'
                            : '-'
                        }}{{ item.cantidad }}
                        {{ item.unidadMedida }}
                      </v-chip>
                    </td>
                    <td class="text-end">
                      <span
                        class="font-weight-bold text-body-2 text-indigo-darken-4"
                        >{{
                          Number(
                            item.nuevoStock || 0
                          ).toLocaleString(
                            'es-NI'
                          )
                        }}</span
                      >
                      <span
                        class="text-caption text-grey ms-1"
                        >{{
                          item.unidadMedida
                        }}</span
                      >
                    </td>
                    <td>
                      <v-text-field
                        v-model="
                          item.observaciones
                        "
                        density="compact"
                        variant="plain"
                        placeholder="Opcional..."
                        hide-details
                        class="text-caption"
                      />
                    </td>
                    <td class="text-center">
                      <v-btn
                        icon="mdi-close-circle-outline"
                        color="red-darken-2"
                        size="x-small"
                        variant="text"
                        @click="
                          eliminarItemLote(idx)
                        "
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-form>
        </v-card-text>

        <v-divider />

        <!-- Acciones del Modal -->
        <v-card-actions
          class="pa-3 bg-white d-flex justify-end ga-2"
        >
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            class="rounded font-weight-bold text-none px-4"
            @click="cerrarModalAjuste"
            :disabled="modalAjuste.loading"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="indigo-darken-4"
            variant="elevated"
            class="rounded font-weight-bold text-none px-5"
            prepend-icon="mdi-content-save-check"
            @click="guardarAjusteStock"
            :loading="modalAjuste.loading"
          >
            {{
              modalAjuste.items.length > 1
                ? `Guardar Ajustes (${modalAjuste.items.length} productos)`
                : modalAjuste.items.length === 1
                  ? 'Guardar Ajuste (1 producto)'
                  : 'Guardar Ajuste'
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG: VER DETALLE COMPLETO DEL AJUSTE -->
    <v-dialog
      v-model="modalDetalle.show"
      max-width="600"
      persistent
    >
      <v-card
        class="rounded-lg"
        v-if="modalDetalle.item"
      >
        <v-card-title
          class="bg-indigo-darken-4 text-white d-flex align-center py-3 px-4"
        >
          <v-icon class="me-2"
            >mdi-clipboard-text-clock</v-icon
          >
          <span
            class="text-subtitle-1 font-weight-bold"
            >Detalle de Ajuste de Stock</span
          >
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            color="white"
            @click="modalDetalle.show = false"
          />
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <!-- Referencia e Indicador -->
          <div
            class="d-flex align-center justify-space-between mb-3 pa-2 bg-indigo-lighten-5 rounded border"
          >
            <div>
              <div
                class="text-caption text-grey-darken-2"
              >
                REFERENCIA KARDEX
              </div>
              <div
                class="text-subtitle-2 font-weight-bold text-indigo-darken-4"
              >
                {{
                  modalDetalle.item
                    .referenciaKardex ||
                  `AJU-${modalDetalle.item.idAjusteStock}`
                }}
              </div>
            </div>
            <v-chip
              :color="
                modalDetalle.item
                  .cantidadAjustada >= 0
                  ? 'green'
                  : 'orange-darken-3'
              "
              variant="flat"
              class="font-weight-bold text-white"
            >
              {{
                modalDetalle.item.tipoOperacion ||
                (modalDetalle.item.stockActual >=
                modalDetalle.item.stockAnterior
                  ? 'Entrada'
                  : 'Salida')
              }}
            </v-chip>
          </div>

          <v-list density="compact" class="pa-0">
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon
                  color="indigo"
                  class="me-2"
                  >mdi-package-variant</v-icon
                >
              </template>
              <v-list-item-title
                class="text-caption text-grey"
                >Producto</v-list-item-title
              >
              <v-list-item-subtitle
                class="font-weight-bold text-body-2 text-black"
              >
                {{ modalDetalle.item.producto }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider class="my-1" />

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon
                  color="indigo"
                  class="me-2"
                  >mdi-warehouse</v-icon
                >
              </template>
              <v-list-item-title
                class="text-caption text-grey"
                >Bodega</v-list-item-title
              >
              <v-list-item-subtitle
                class="font-weight-bold text-body-2 text-black"
              >
                {{ modalDetalle.item.bodega }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider class="my-1" />

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon
                  color="indigo"
                  class="me-2"
                  >mdi-tag</v-icon
                >
              </template>
              <v-list-item-title
                class="text-caption text-grey"
                >Concepto de
                Ajuste</v-list-item-title
              >
              <v-list-item-subtitle
                class="font-weight-bold text-body-2 text-black"
              >
                {{ modalDetalle.item.concepto }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider class="my-1" />

            <!-- Comparativa de Stock -->
            <v-row dense class="my-2">
              <v-col cols="4">
                <div
                  class="text-center pa-2 bg-grey-lighten-4 rounded border"
                >
                  <div
                    class="text-caption text-grey"
                    style="font-size: 10px"
                  >
                    STOCK ANTERIOR
                  </div>
                  <div
                    class="text-body-1 font-weight-bold text-grey-darken-3"
                  >
                    {{
                      modalDetalle.item
                        .stockAnterior
                    }}
                  </div>
                </div>
              </v-col>
              <v-col cols="4">
                <div
                  class="text-center pa-2 rounded border"
                  :class="
                    modalDetalle.item
                      .cantidadAjustada >= 0
                      ? 'bg-green-lighten-5'
                      : 'bg-orange-lighten-5'
                  "
                >
                  <div
                    class="text-caption text-grey"
                    style="font-size: 10px"
                  >
                    VARIACIÓN
                  </div>
                  <div
                    class="text-body-1 font-weight-bold"
                    :class="
                      modalDetalle.item
                        .cantidadAjustada >= 0
                        ? 'text-green-darken-4'
                        : 'text-orange-darken-4'
                    "
                  >
                    {{
                      modalDetalle.item
                        .cantidadAjustada >= 0
                        ? '+'
                        : ''
                    }}{{
                      modalDetalle.item
                        .cantidadAjustada
                    }}
                  </div>
                </div>
              </v-col>
              <v-col cols="4">
                <div
                  class="text-center pa-2 bg-indigo-lighten-5 rounded border"
                >
                  <div
                    class="text-caption text-indigo"
                    style="font-size: 10px"
                  >
                    STOCK FINAL
                  </div>
                  <div
                    class="text-body-1 font-weight-bold text-indigo-darken-4"
                  >
                    {{
                      modalDetalle.item
                        .stockActual
                    }}
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-1" />

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-icon color="grey" class="me-2"
                  >mdi-comment-text-outline</v-icon
                >
              </template>
              <v-list-item-title
                class="text-caption text-grey"
                >Observaciones /
                Motivo</v-list-item-title
              >
              <v-list-item-subtitle
                class="font-weight-medium text-body-2 text-black mt-1"
              >
                {{
                  modalDetalle.item
                    .observaciones ||
                  'Sin observaciones'
                }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider class="my-1" />

            <v-row dense class="mt-1">
              <v-col cols="6">
                <div
                  class="text-caption text-grey"
                >
                  Registrado por:
                </div>
                <div
                  class="font-weight-medium text-body-2"
                >
                  {{
                    modalDetalle.item
                      .usuarioRegistro ||
                    'Sistema'
                  }}
                </div>
              </v-col>
              <v-col cols="6">
                <div
                  class="text-caption text-grey"
                >
                  Fecha de Registro:
                </div>
                <div
                  class="font-weight-medium text-body-2"
                >
                  {{
                    formatearFechaHora(
                      modalDetalle.item
                        .fechaRegistro
                    )
                  }}
                </div>
              </v-col>
            </v-row>
          </v-list>
        </v-card-text>

        <v-divider />

        <v-card-actions
          class="pa-3 bg-white d-flex justify-space-between align-center"
        >
          <v-btn
            color="red-darken-3"
            variant="outlined"
            prepend-icon="mdi-file-pdf-box"
            class="rounded font-weight-bold text-none"
            @click="
              exportarComprobantePDF(
                modalDetalle.item
              )
            "
          >
            Descargar Comprobante PDF
          </v-btn>

          <v-btn
            color="indigo-darken-4"
            variant="tonal"
            class="rounded font-weight-bold text-none px-4"
            @click="modalDetalle.show = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RequestHttp from '@/services/requestHttp'
import { formatters } from '@/helpers/formatters'
import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'AjustesStockView',

  data() {
    return {
      requestHttp: new RequestHttp(),
      activeTab: 'historial',
      loading: false,
      loadingStock: false,

      // Alertas / Snackbar
      snackbar: {
        show: false,
        text: '',
        color: 'success',
        icon: 'mdi-check-circle'
      },

      // Catálogos combobox
      bodegasCombobox: [],
      conceptosCombobox: [],
      productosList: [],

      // Datos principales
      ajustesList: [],
      stockBodegas: [],

      // Filtros Historial (por defecto mes actual)
      filtrosHistorial: {
        search: '',
        idBodega: null,
        idConcepto: null,
        tipoOperacion: 'todos',
        fechaDesde: (() => {
          const now = new Date()
          const year = now.getFullYear()
          const month = String(
            now.getMonth() + 1
          ).padStart(2, '0')
          return `${year}-${month}-01`
        })(),
        fechaHasta: (() => {
          const now = new Date()
          const year = now.getFullYear()
          const month = String(
            now.getMonth() + 1
          ).padStart(2, '0')
          const lastDayNum = new Date(
            year,
            now.getMonth() + 1,
            0
          ).getDate()
          return `${year}-${month}-${String(lastDayNum).padStart(2, '0')}`
        })()
      },

      tiposOperacion: [
        {
          title: 'Todos los movimientos',
          value: 'todos'
        },
        {
          title: 'Solo Entradas (+)',
          value: 'Entrada'
        },
        {
          title: 'Solo Salidas (-)',
          value: 'Salida'
        }
      ],

      // Filtros Stock Bodegas
      filtrosStock: {
        search: '',
        idBodega: null,
        soloConStock: false
      },

      // Headers Historial
      headersHistorial: [
        {
          title: 'Referencia Kardex',
          key: 'referenciaKardex',
          align: 'start',
          sortable: true
        },
        {
          title: 'Fecha / Hora',
          key: 'fechaRegistro',
          align: 'start',
          sortable: true
        },
        {
          title: 'Producto',
          key: 'producto',
          align: 'start',
          sortable: true
        },
        {
          title: 'Bodega',
          key: 'bodega',
          align: 'start',
          sortable: true
        },
        {
          title: 'Concepto',
          key: 'concepto',
          align: 'start',
          sortable: true
        },
        {
          title: 'Stock Ant.',
          key: 'stockAnterior',
          align: 'end',
          sortable: true
        },
        {
          title: 'Ajuste',
          key: 'cantidadAjustada',
          align: 'center',
          sortable: true
        },
        {
          title: 'Stock Nuevo',
          key: 'stockActual',
          align: 'end',
          sortable: true
        },
        {
          title: 'Tipo',
          key: 'tipoOperacion',
          align: 'center',
          sortable: true
        },
        {
          title: 'Motivo',
          key: 'observaciones',
          align: 'start',
          sortable: false
        },
        {
          title: 'Usuario',
          key: 'usuarioRegistro',
          align: 'start',
          sortable: true
        },
        {
          title: 'Acciones',
          key: 'actions',
          align: 'center',
          sortable: false
        }
      ],

      // Headers Stock Bodegas
      headersStockBodegas: [
        {
          title: 'Bodega',
          key: 'bodegaNombre',
          align: 'start',
          sortable: true
        },
        {
          title: 'Código',
          key: 'codigo',
          align: 'start',
          sortable: true
        },
        {
          title: 'Producto',
          key: 'nombre',
          align: 'start',
          sortable: true
        },
        {
          title: 'Stock Bodega',
          key: 'cantidadTotal',
          align: 'end',
          sortable: true
        },
        {
          title: 'Stock Global',
          key: 'cantidadTotalGeneral',
          align: 'end',
          sortable: true
        },
        {
          title: 'Costo Unit.',
          key: 'costo',
          align: 'end',
          sortable: true
        },
        {
          title: 'Valor Bodega',
          key: 'totalCostoBodega',
          align: 'end',
          sortable: true
        },
        {
          title: 'Acción',
          key: 'actions',
          align: 'center',
          sortable: false
        }
      ],

      // Modal Registro de Ajuste (Individual y en Lote)
      modalAjuste: {
        show: false,
        loading: false,
        loadingProductos: false,
        valid: false,
        idBodega: null,
        idConcepto: null,
        observaciones: '',
        nuevoItem: {
          idProducto: null,
          productoSeleccionado: null,
          tipoMovimiento: 'disminuir', // 'disminuir' o 'aumentar'
          cantidad: null,
          stockActualBodega: 0,
          stockResultante: 0,
          idConcepto: null,
          observaciones: ''
        },
        items: [],
        productosBodega: []
      },

      // Modal Detalle
      modalDetalle: {
        show: false,
        item: null
      }
    }
  },

  computed: {
    // Estadísticas reactivas a filtros (incluyendo rango de fechas)
    stats() {
      const list = this.filteredAjustes || []
      const positivos = list.filter(
        (a) =>
          a.cantidadAjustada > 0 ||
          a.tipoOperacion === 'Entrada'
      )
      const negativos = list.filter(
        (a) =>
          a.cantidadAjustada < 0 ||
          a.tipoOperacion === 'Salida'
      )

      const unidadesPositivas = positivos.reduce(
        (acc, curr) =>
          acc +
          Math.abs(curr.cantidadAjustada || 0),
        0
      )
      const unidadesNegativas = negativos.reduce(
        (acc, curr) =>
          acc +
          Math.abs(curr.cantidadAjustada || 0),
        0
      )

      return {
        totalAjustes: list.length,
        ajustesPositivos: positivos.length,
        ajustesNegativos: negativos.length,
        unidadesPositivas: Number(
          unidadesPositivas
        ).toLocaleString('es-NI'),
        unidadesNegativas: Number(
          unidadesNegativas
        ).toLocaleString('es-NI'),
        totalBodegas: this.bodegasCombobox.length,
        totalProductosConStock:
          this.stockBodegas.length
      }
    },

    // Lista filtrada de ajustes
    filteredAjustes() {
      let items = [...this.ajustesList]

      if (this.filtrosHistorial.idBodega) {
        items = items.filter(
          (a) =>
            a.idBodega ===
            this.filtrosHistorial.idBodega
        )
      }

      if (this.filtrosHistorial.idConcepto) {
        items = items.filter(
          (a) =>
            a.idConcepto ===
            this.filtrosHistorial.idConcepto
        )
      }

      if (
        this.filtrosHistorial.tipoOperacion &&
        this.filtrosHistorial.tipoOperacion !==
          'todos'
      ) {
        items = items.filter((a) => {
          const op =
            a.tipoOperacion ||
            (a.stockActual >= a.stockAnterior
              ? 'Entrada'
              : 'Salida')
          return (
            op.toLowerCase() ===
            this.filtrosHistorial.tipoOperacion.toLowerCase()
          )
        })
      }

      if (this.filtrosHistorial.fechaDesde) {
        const fDesde =
          this.filtrosHistorial.fechaDesde
        items = items.filter((a) => {
          if (!a.fechaRegistro) return true
          const dateStr =
            typeof a.fechaRegistro === 'string'
              ? a.fechaRegistro.substring(0, 10)
              : new Date(a.fechaRegistro)
                  .toISOString()
                  .substring(0, 10)
          return dateStr >= fDesde
        })
      }

      if (this.filtrosHistorial.fechaHasta) {
        const fHasta =
          this.filtrosHistorial.fechaHasta
        items = items.filter((a) => {
          if (!a.fechaRegistro) return true
          const dateStr =
            typeof a.fechaRegistro === 'string'
              ? a.fechaRegistro.substring(0, 10)
              : new Date(a.fechaRegistro)
                  .toISOString()
                  .substring(0, 10)
          return dateStr <= fHasta
        })
      }

      return items
    },

    // Resumen del Lote de Productos a Ajustar
    resumenLote() {
      const items = this.modalAjuste.items || []
      const aumentos = items.filter(
        (i) => i.tipoMovimiento === 'aumentar'
      )
      const disminuciones = items.filter(
        (i) => i.tipoMovimiento === 'disminuir'
      )

      const udsAumento = aumentos.reduce(
        (acc, curr) =>
          acc + Number(curr.cantidad || 0),
        0
      )
      const udsDisminucion = disminuciones.reduce(
        (acc, curr) =>
          acc + Number(curr.cantidad || 0),
        0
      )
      const impactoNeto =
        udsAumento - udsDisminucion

      return {
        totalItems: items.length,
        totalAumentos: aumentos.length,
        totalDisminuciones: disminuciones.length,
        udsAumento,
        udsDisminucion,
        impactoNeto
      }
    }
  },

  mounted() {
    this.inicializar()
  },

  methods: {
    async inicializar() {
      await Promise.all([
        this.cargarBodegas(),
        this.cargarConceptosAjuste(),
        this.cargarProductos(),
        this.cargarDatos()
      ])
    },

    // 1. Cargar Combobox de Bodegas (solo Sucursales, excluyendo camiones)
    async cargarBodegas() {
      try {
        const resp =
          await this.requestHttp.getBodegasCombobox(
            'SUC'
          )
        if (
          resp.code === 200 &&
          Array.isArray(resp.data)
        ) {
          this.bodegasCombobox = resp.data
            .filter(
              (b) =>
                !b.idCamion &&
                !b.placaCamion &&
                b.tipoBodegaCodigo !== 'CAM' &&
                b.idTipoBodega !== 3
            )
            .map((b) => ({
              id: b.id || b.idBodega,
              idBodega: b.id || b.idBodega,
              nombre: b.codigo
                ? `[${b.codigo}] ${b.nombre}`
                : b.nombre,
              nombrePuro: b.nombre,
              codigo: b.codigo,
              sucursalNombre: b.sucursalNombre
            }))
        }
      } catch (err) {
        console.error(
          'Error al cargar bodegas:',
          err
        )
      }
    },

    // 2. Cargar Conceptos dedicados de Ajustes de Inventario (TM07)
    async cargarConceptosAjuste() {
      try {
        const resp =
          await this.requestHttp.getConceptosAjusteInventario()
        if (
          resp.code === 200 &&
          Array.isArray(resp.data)
        ) {
          this.conceptosCombobox = resp.data.map(
            (c) => ({
              id: c.id || c.idConceptoTipoMov,
              codigo: c.codigo,
              nombre: c.nombre,
              nombreCompleto: c.codigo
                ? `[${c.codigo}] ${c.nombre}`
                : c.nombre
            })
          )
        }
      } catch (err) {
        console.error(
          'Error al cargar conceptos de ajuste:',
          err
        )
      }
    },

    // 3. Cargar Catálogo de Productos
    async cargarProductos() {
      try {
        const resp =
          await this.requestHttp.getProductos()
        if (
          resp.code === 200 &&
          Array.isArray(resp.data)
        ) {
          this.productosList = resp.data
        }
      } catch (err) {
        console.error(
          'Error al cargar productos:',
          err
        )
      }
    },

    // 4. Cargar Historial de Ajustes
    async cargarDatos(mostrarToast = false) {
      this.loading = true
      try {
        // Parámetros de consulta
        const extraParams = {}
        if (this.filtrosHistorial.fechaDesde)
          extraParams.fechaInicio =
            this.filtrosHistorial.fechaDesde
        if (this.filtrosHistorial.fechaHasta)
          extraParams.fechaFin =
            this.filtrosHistorial.fechaHasta
        if (this.filtrosHistorial.idConcepto)
          extraParams.idConcepto =
            this.filtrosHistorial.idConcepto

        let resp = null
        if (this.filtrosHistorial.idBodega) {
          resp =
            await this.requestHttp.getAjustesStock(
              null,
              this.filtrosHistorial.idBodega,
              extraParams
            )
        } else {
          resp =
            await this.requestHttp.getAjustesStock(
              null,
              null,
              extraParams
            )
        }

        if (
          resp.code === 200 &&
          Array.isArray(resp.data)
        ) {
          this.ajustesList = resp.data
        } else {
          this.ajustesList = []
        }

        // Cargar stock por bodegas en paralelo
        await this.cargarStockBodegas()

        if (mostrarToast) {
          this.mostrarNotificacion(
            'Datos actualizados correctamente',
            'success'
          )
        }
      } catch (err) {
        console.error(
          'Error al cargar historial de ajustes:',
          err
        )
        this.mostrarNotificacion(
          'Error al consultar el historial de ajustes',
          'error'
        )
      } finally {
        this.loading = false
      }
    },

    // 5. Cargar Stock por Bodegas (solo Sucursales)
    async cargarStockBodegas() {
      this.loadingStock = true
      try {
        const params = {}
        if (this.filtrosStock.idBodega)
          params.idBodega =
            this.filtrosStock.idBodega
        if (this.filtrosStock.soloConStock)
          params.soloConStock = true

        const resp =
          await this.requestHttp.getStockBodegas(
            params
          )
        if (
          resp.code === 200 &&
          Array.isArray(resp.data)
        ) {
          // Filtrar exclusivamente sucursales, descartar camiones
          this.stockBodegas = resp.data.filter(
            (b) =>
              !b.idCamion &&
              !b.placaCamion &&
              b.tipoBodegaCodigo !== 'CAM' &&
              b.idTipoBodega !== 3
          )
        }
      } catch (err) {
        console.error(
          'Error al cargar stock de bodegas:',
          err
        )
      } finally {
        this.loadingStock = false
      }
    },

    obtenerRangoMesActual() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(
        now.getMonth() + 1
      ).padStart(2, '0')
      const firstDay = `${year}-${month}-01`
      const lastDayNum = new Date(
        year,
        now.getMonth() + 1,
        0
      ).getDate()
      const lastDay = `${year}-${month}-${String(
        lastDayNum
      ).padStart(2, '0')}`
      return {
        fechaDesde: firstDay,
        fechaHasta: lastDay
      }
    },

    establecerMesActual() {
      const { fechaDesde, fechaHasta } =
        this.obtenerRangoMesActual()
      this.filtrosHistorial.fechaDesde =
        fechaDesde
      this.filtrosHistorial.fechaHasta =
        fechaHasta
      this.filtrarHistorial()
    },

    filtrarHistorial() {
      // El computed filteredAjustes reacciona automáticamente
    },

    limpiarFiltrosHistorial() {
      const { fechaDesde, fechaHasta } =
        this.obtenerRangoMesActual()
      this.filtrosHistorial = {
        search: '',
        idBodega: null,
        idConcepto: null,
        tipoOperacion: 'todos',
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta
      }
    },

    // Helper para obtener nombre del concepto
    obtenerNombreConcepto(idConcepto) {
      if (!idConcepto) return ''
      const conc = this.conceptosCombobox.find(
        (c) => c.id === idConcepto
      )
      return conc ? conc.nombre : ''
    },

    // Abrir Modal de Ajuste (Individual o por Lote)
    async abrirModalAjuste(prefill = null) {
      this.modalAjuste.items = []
      this.modalAjuste.observaciones = ''
      this.modalAjuste.nuevoItem = {
        idProducto: null,
        productoSeleccionado: null,
        tipoMovimiento: 'disminuir',
        cantidad: null,
        stockActualBodega: 0,
        stockResultante: 0,
        idConcepto: null,
        observaciones: ''
      }

      const defaultBodega =
        prefill?.idBodega ||
        this.filtrosHistorial.idBodega ||
        this.bodegasCombobox[0]?.id ||
        null

      this.modalAjuste.idBodega = defaultBodega
      this.modalAjuste.idConcepto =
        this.conceptosCombobox.length > 0
          ? this.conceptosCombobox[0].id
          : null

      if (defaultBodega) {
        await this.cargarProductosBodegaModal(
          defaultBodega
        )
      }

      if (prefill && prefill.idProducto) {
        this.modalAjuste.nuevoItem.idProducto =
          prefill.idProducto
        this.onSeleccionarProductoModal()
      }

      this.modalAjuste.show = true
    },

    cerrarModalAjuste() {
      this.modalAjuste.show = false
      this.modalAjuste.loading = false
      this.modalAjuste.loadingProductos = false
      this.modalAjuste.items = []
      this.modalAjuste.nuevoItem = {
        idProducto: null,
        productoSeleccionado: null,
        tipoMovimiento: 'disminuir',
        cantidad: null,
        stockActualBodega: 0,
        stockResultante: 0,
        idConcepto: null,
        observaciones: ''
      }
      this.modalAjuste.productosBodega = []
    },

    // Cargar productos asignados a la bodega seleccionada para el modal
    async cargarProductosBodegaModal(idBodega) {
      if (!idBodega) {
        this.modalAjuste.productosBodega = []
        return
      }
      this.modalAjuste.loadingProductos = true
      try {
        const resp =
          await this.requestHttp.getProductosPorBodega(
            idBodega,
            false
          )
        if (
          resp &&
          resp.code === 200 &&
          Array.isArray(resp.data)
        ) {
          this.modalAjuste.productosBodega =
            resp.data.map((p) => ({
              idProducto: p.idProducto || p.id,
              id: p.idProducto || p.id,
              codigo: p.codigo,
              nombre: p.nombre,
              categoria:
                p.categoria ||
                p.categoriaNombre ||
                '',
              subCategoria: p.subCategoria || '',
              costo: Number(p.costo || 0),
              precio: Number(p.precio || 0),
              cantidadTotal: Number(
                p.cantidadTotal ??
                  p.cantidadTotalBodega ??
                  0
              ),
              cantidadTotalGeneral:
                p.cantidadTotalGeneral != null
                  ? Number(p.cantidadTotalGeneral)
                  : p.stockGeneral != null
                    ? Number(p.stockGeneral)
                    : null,
              unidadMedida:
                p.unidadMedida || 'und'
            }))
        } else {
          this.modalAjuste.productosBodega = []
        }
      } catch (err) {
        console.error(
          'Error al cargar productos de la bodega:',
          err
        )
        this.modalAjuste.productosBodega = []
      } finally {
        this.modalAjuste.loadingProductos = false
      }
    },

    // Al cambiar la bodega en el modal
    async onCambioBodegaModal(newBodegaId) {
      this.modalAjuste.items = []
      this.modalAjuste.nuevoItem = {
        idProducto: null,
        productoSeleccionado: null,
        tipoMovimiento: 'disminuir',
        cantidad: null,
        stockActualBodega: 0,
        stockResultante: 0,
        idConcepto: null,
        observaciones: ''
      }

      if (newBodegaId) {
        await this.cargarProductosBodegaModal(
          newBodegaId
        )
      } else {
        this.modalAjuste.productosBodega = []
      }
    },

    // Al seleccionar el producto en el buffer de añadir
    onSeleccionarProductoModal() {
      const idProd =
        this.modalAjuste.nuevoItem.idProducto
      if (!idProd) {
        this.modalAjuste.nuevoItem.productoSeleccionado =
          null
        this.modalAjuste.nuevoItem.stockActualBodega = 0
        this.modalAjuste.nuevoItem.stockResultante = 0
        return
      }

      const prod =
        this.modalAjuste.productosBodega.find(
          (p) => p.idProducto === idProd
        )
      if (prod) {
        this.modalAjuste.nuevoItem.productoSeleccionado =
          prod
        this.modalAjuste.nuevoItem.stockActualBodega =
          Number(prod.cantidadTotal || 0)
      } else {
        this.modalAjuste.nuevoItem.productoSeleccionado =
          null
        this.modalAjuste.nuevoItem.stockActualBodega = 0
      }

      this.calcularNuevoStock()
    },

    // Calcular nuevo stock resultante en el buffer
    calcularNuevoStock() {
      const cant = Number(
        this.modalAjuste.nuevoItem.cantidad || 0
      )
      const actual = Number(
        this.modalAjuste.nuevoItem
          .stockActualBodega || 0
      )
      if (
        this.modalAjuste.nuevoItem
          .tipoMovimiento === 'aumentar'
      ) {
        this.modalAjuste.nuevoItem.stockResultante =
          actual + cant
      } else {
        this.modalAjuste.nuevoItem.stockResultante =
          Math.max(0, actual - cant)
      }
    },

    // Agregar producto al lote
    agregarProductoAlLote() {
      if (
        !this.modalAjuste.nuevoItem.idProducto
      ) {
        this.mostrarNotificacion(
          'Seleccione un producto para agregar al lote',
          'warning'
        )
        return
      }

      const cant = Number(
        this.modalAjuste.nuevoItem.cantidad
      )
      if (!cant || cant <= 0) {
        this.mostrarNotificacion(
          'Ingrese una cantidad válida mayor a 0',
          'warning'
        )
        return
      }

      const prod =
        this.modalAjuste.nuevoItem
          .productoSeleccionado
      if (!prod) {
        this.mostrarNotificacion(
          'Producto no válido',
          'warning'
        )
        return
      }

      // Validar si ya existe en el lote
      const existe = this.modalAjuste.items.some(
        (i) => i.idProducto === prod.idProducto
      )
      if (existe) {
        this.mostrarNotificacion(
          'El producto ya está agregado en la lista del lote',
          'warning'
        )
        return
      }

      const stockActual = Number(
        prod.cantidadTotal || 0
      )
      const tipo =
        this.modalAjuste.nuevoItem.tipoMovimiento

      if (
        tipo === 'disminuir' &&
        cant > stockActual
      ) {
        this.mostrarNotificacion(
          `La cantidad a disminuir (${cant}) no puede ser mayor que el stock actual en bodega (${stockActual})`,
          'warning'
        )
        return
      }

      const nuevoStock =
        tipo === 'aumentar'
          ? stockActual + cant
          : Math.max(0, stockActual - cant)

      this.modalAjuste.items.push({
        idProducto: prod.idProducto,
        codigo: prod.codigo,
        nombre: prod.nombre,
        categoria: prod.categoria,
        unidadMedida: prod.unidadMedida || 'und',
        stockActual: stockActual,
        tipoMovimiento: tipo,
        cantidad: cant,
        nuevoStock: nuevoStock,
        idBodega: this.modalAjuste.idBodega,
        idConcepto:
          this.modalAjuste.nuevoItem.idConcepto ||
          this.modalAjuste.idConcepto,
        observaciones:
          this.modalAjuste.nuevoItem
            .observaciones || ''
      })

      // Limpiar buffer
      this.modalAjuste.nuevoItem.idProducto = null
      this.modalAjuste.nuevoItem.productoSeleccionado =
        null
      this.modalAjuste.nuevoItem.cantidad = null
      this.modalAjuste.nuevoItem.stockActualBodega = 0
      this.modalAjuste.nuevoItem.stockResultante = 0
      this.modalAjuste.nuevoItem.tipoMovimiento =
        'disminuir'
      this.modalAjuste.nuevoItem.observaciones =
        ''
    },

    // Recalcular stock al editar fila
    recalcularItem(item) {
      const cant = Number(item.cantidad || 0)
      const actual = Number(item.stockActual || 0)
      if (item.tipoMovimiento === 'aumentar') {
        item.nuevoStock = actual + cant
      } else {
        if (cant > actual) {
          item.cantidad = actual
          item.nuevoStock = 0
        } else {
          item.nuevoStock = Math.max(
            0,
            actual - cant
          )
        }
      }
    },

    // Eliminar producto de la lista
    eliminarItemLote(index) {
      this.modalAjuste.items.splice(index, 1)
    },

    // Limpiar lote completo
    limpiarLoteCompleto() {
      this.modalAjuste.items = []
    },

    // Guardar y Enviar Ajuste en Lote / Masivo
    async guardarAjusteStock() {
      if (!this.modalAjuste.idBodega) {
        this.mostrarNotificacion(
          'Debe seleccionar una bodega física',
          'warning'
        )
        return
      }

      if (!this.modalAjuste.idConcepto) {
        this.mostrarNotificacion(
          'Debe seleccionar un concepto de ajuste predeterminado',
          'warning'
        )
        return
      }

      // Si el usuario seleccionó un producto y cantidad pero no pulsó "Añadir", agregarlo automáticamente
      if (
        this.modalAjuste.nuevoItem.idProducto &&
        Number(
          this.modalAjuste.nuevoItem.cantidad
        ) > 0
      ) {
        this.agregarProductoAlLote()
      }

      if (this.modalAjuste.items.length === 0) {
        this.mostrarNotificacion(
          'Debe incluir al menos un producto en el lote para ajustar',
          'warning'
        )
        return
      }

      // Validar cada producto en el lote
      for (const item of this.modalAjuste.items) {
        if (
          item.tipoMovimiento === 'disminuir' &&
          Number(item.cantidad) >
            Number(item.stockActual)
        ) {
          this.mostrarNotificacion(
            `El producto "${item.nombre}" tiene una disminución (${item.cantidad}) mayor que su stock actual (${item.stockActual})`,
            'warning'
          )
          return
        }
        if (Number(item.cantidad) <= 0) {
          this.mostrarNotificacion(
            `El producto "${item.nombre}" debe tener una cantidad mayor a 0`,
            'warning'
          )
          return
        }
      }

      this.modalAjuste.loading = true

      try {
        // Obtener usuario autenticado
        const tokenRaw =
          localStorage.getItem('token') ||
          localStorage.getItem('authToken')
        let username = 'Usuario'
        if (tokenRaw) {
          try {
            const parsed = JSON.parse(tokenRaw)
            username =
              parsed.usuario ||
              parsed.username ||
              parsed.nombre ||
              'Usuario'
          } catch (e) {
            username = 'Usuario'
          }
        }

        const payload = {
          idBodega: this.modalAjuste.idBodega,
          idConcepto: this.modalAjuste.idConcepto,
          observaciones:
            this.modalAjuste.observaciones ||
            `Ajuste de stock en lote (${this.modalAjuste.items.length} productos)`,
          usuarioRegistro: username,
          items: this.modalAjuste.items.map(
            (item) => ({
              idProducto: item.idProducto,
              cantidadTotal: item.nuevoStock,
              idBodega:
                item.idBodega ||
                this.modalAjuste.idBodega,
              idConcepto:
                item.idConcepto ||
                this.modalAjuste.idConcepto,
              observaciones:
                item.observaciones ||
                (item.tipoMovimiento ===
                'aumentar'
                  ? `Aumento (+${item.cantidad})`
                  : `Disminución (-${item.cantidad})`)
            })
          )
        }

        const res =
          await this.requestHttp.postAjustesStockLote(
            payload
          )

        if (res.code === 200) {
          const ref = res.data?.referencia || ''
          const total =
            res.data?.totalAjustes ||
            this.modalAjuste.items.length
          this.mostrarNotificacion(
            `¡Ajuste en lote aplicado exitosamente! (${total} productos ajustados ${ref ? '- ' + ref : ''})`,
            'success'
          )
          this.cerrarModalAjuste()
          await this.cargarDatos()
          await this.cargarProductos()
        } else {
          const msg =
            res.data?.msg ||
            res.data?.message ||
            'Error al aplicar los ajustes de stock en lote'
          this.mostrarNotificacion(msg, 'error')
        }
      } catch (err) {
        console.error(
          'Error al guardar ajustes en lote:',
          err
        )
        this.mostrarNotificacion(
          'Ocurrió un error al realizar los ajustes de stock en lote',
          'error'
        )
      } finally {
        this.modalAjuste.loading = false
      }
    },

    // Ver Detalle
    verDetalleAjuste(item) {
      this.modalDetalle.item = item
      this.modalDetalle.show = true
    },

    // Notificaciones
    mostrarNotificacion(text, color = 'success') {
      this.snackbar.text = text
      this.snackbar.color = color
      this.snackbar.icon =
        color === 'success'
          ? 'mdi-check-circle'
          : color === 'warning'
            ? 'mdi-alert'
            : 'mdi-close-circle'
      this.snackbar.show = true
    },

    // Formateadores
    formatearMoneda(valor) {
      return formatters.formatCurrency(
        valor || 0,
        'NIO'
      )
    },

    formatearFechaHora(fecha) {
      return formatters.formatDate(fecha)
    },

    // Exportación a Excel
    async exportarExcel() {
      try {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet(
          'Ajustes de Stock'
        )

        // Título del reporte
        worksheet.mergeCells('A1:J1')
        const titleCell = worksheet.getCell('A1')
        titleCell.value =
          'REPORTE DE AUDITORÍA Y AJUSTES DE STOCK'
        titleCell.font = {
          name: 'Arial',
          size: 14,
          bold: true,
          color: { argb: 'FFFFFFFF' }
        }
        titleCell.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        }
        titleCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1A237E' }
        }
        worksheet.getRow(1).height = 30

        // Subtítulo con fecha y rango de período
        worksheet.mergeCells('A2:K2')
        const dateCell = worksheet.getCell('A2')
        let subtitleText = `Generado el: ${new Date().toLocaleString('es-NI')}`
        if (
          this.filtrosHistorial.fechaDesde &&
          this.filtrosHistorial.fechaHasta
        ) {
          subtitleText += ` | Período: ${this.filtrosHistorial.fechaDesde} al ${this.filtrosHistorial.fechaHasta}`
        }
        dateCell.value = subtitleText
        dateCell.font = {
          name: 'Arial',
          size: 10,
          italic: true
        }
        dateCell.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        }
        worksheet.getRow(2).height = 20

        // Encabezados
        const headers = [
          'Referencia Kardex',
          'Fecha Registro',
          'Producto',
          'Bodega',
          'Concepto',
          'Stock Anterior',
          'Cantidad Ajustada',
          'Stock Resultante',
          'Tipo Operación',
          'Usuario',
          'Observaciones'
        ]

        const headerRow =
          worksheet.addRow(headers)
        headerRow.height = 25
        headerRow.eachCell((cell) => {
          cell.font = {
            name: 'Arial',
            size: 11,
            bold: true,
            color: { argb: 'FFFFFFFF' }
          }
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
          }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF283593' }
          }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        })

        // Filas de datos
        const dataRows = this.filteredAjustes.map(
          (a) => [
            a.referenciaKardex ||
              `AJU-${a.idAjusteStock}`,
            this.formatearFechaHora(
              a.fechaRegistro
            ),
            a.producto,
            a.bodega,
            a.concepto,
            a.stockAnterior || 0,
            a.cantidadAjustada || 0,
            a.stockActual || 0,
            a.tipoOperacion ||
              (a.stockActual >= a.stockAnterior
                ? 'Entrada'
                : 'Salida'),
            a.usuarioRegistro || 'Sistema',
            a.observaciones || ''
          ]
        )

        dataRows.forEach((row, idx) => {
          const addedRow = worksheet.addRow(row)
          addedRow.height = 20
          const isEven = idx % 2 === 0
          addedRow.eachCell((cell, colNumber) => {
            cell.font = {
              name: 'Arial',
              size: 10
            }
            cell.alignment = {
              vertical: 'middle',
              horizontal: [6, 7, 8].includes(
                colNumber
              )
                ? 'right'
                : [1, 2, 9].includes(colNumber)
                  ? 'center'
                  : 'left'
            }
            if (isEven) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF5F5F5' }
              }
            }
            cell.border = {
              top: {
                style: 'thin',
                color: { argb: 'FFE0E0E0' }
              },
              left: {
                style: 'thin',
                color: { argb: 'FFE0E0E0' }
              },
              bottom: {
                style: 'thin',
                color: { argb: 'FFE0E0E0' }
              },
              right: {
                style: 'thin',
                color: { argb: 'FFE0E0E0' }
              }
            }
          })
        })

        // Ajustar anchos de columnas
        worksheet.columns = [
          { width: 22 }, // Ref
          { width: 20 }, // Fecha
          { width: 35 }, // Producto
          { width: 22 }, // Bodega
          { width: 25 }, // Concepto
          { width: 15 }, // Stock Ant
          { width: 16 }, // Cant Ajustada
          { width: 15 }, // Stock Nuevo
          { width: 15 }, // Tipo
          { width: 18 }, // Usuario
          { width: 35 } // Observaciones
        ]

        const buffer =
          await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        FileSaver.saveAs(
          blob,
          `Reporte_Ajustes_Stock_${new Date().toISOString().slice(0, 10)}.xlsx`
        )
        this.mostrarNotificacion(
          'Archivo Excel generado exitosamente',
          'success'
        )
      } catch (err) {
        console.error(
          'Error al exportar Excel:',
          err
        )
        this.mostrarNotificacion(
          'Error al generar el archivo Excel',
          'error'
        )
      }
    },

    // Exportación a PDF (Reporte de Auditoría / Stock por Bodega)
    async exportarPDF() {
      try {
        if (this.activeTab === 'historial') {
          if (
            !this.filteredAjustes ||
            this.filteredAjustes.length === 0
          ) {
            this.mostrarNotificacion(
              'No hay ajustes de stock para exportar.',
              'warning'
            )
            return
          }

          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          })
          const pageWidth =
            doc.internal.pageSize.getWidth()
          const pageHeight =
            doc.internal.pageSize.getHeight()

          const primaryColor = [26, 35, 126] // Indigo #1A237E
          const accentColor = [57, 73, 171] // #3949AB
          const darkColor = [30, 41, 59] // Slate #1E293B
          const lightBg = [248, 250, 252] // #F8FAFC
          const borderGray = [226, 232, 240] // #E2E8F0
          const greenColor = [46, 125, 50] // #2E7D32
          const redColor = [198, 40, 40] // #C62828

          // Header Top Line
          doc.setFillColor(
            primaryColor[0],
            primaryColor[1],
            primaryColor[2]
          )
          doc.rect(0, 0, pageWidth, 22, 'F')

          // Accent Stripe
          doc.setFillColor(
            accentColor[0],
            accentColor[1],
            accentColor[2]
          )
          doc.rect(0, 22, pageWidth, 1.2, 'F')

          // Title
          doc.setFontSize(14)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(255, 255, 255)
          doc.text(
            'REPORTE DE AUDITORÍA Y AJUSTES DE STOCK',
            14,
            10
          )

          doc.setFontSize(8.5)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(220, 225, 245)
          doc.text(
            'S.I. TOKES — HISTORIAL DE MOVIMIENTOS Y CONTROL DE INVENTARIO FÍSICO',
            14,
            17
          )

          // Right Info
          let rangoTexto = 'Todos los registros'
          if (
            this.filtrosHistorial.fechaDesde &&
            this.filtrosHistorial.fechaHasta
          ) {
            rangoTexto = `Período: ${this.filtrosHistorial.fechaDesde} al ${this.filtrosHistorial.fechaHasta}`
          }
          doc.setFontSize(8.5)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(255, 255, 255)
          doc.text(
            rangoTexto,
            pageWidth - 14,
            10,
            { align: 'right' }
          )

          doc.setFontSize(7.5)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(220, 225, 245)
          doc.text(
            `Generado: ${new Date().toLocaleString('es-NI')}`,
            pageWidth - 14,
            17,
            { align: 'right' }
          )

          // KPI Box
          let currentY = 27
          doc.setFillColor(
            lightBg[0],
            lightBg[1],
            lightBg[2]
          )
          doc.roundedRect(
            14,
            currentY,
            pageWidth - 28,
            12,
            1.5,
            1.5,
            'F'
          )
          doc.setDrawColor(
            borderGray[0],
            borderGray[1],
            borderGray[2]
          )
          doc.setLineWidth(0.3)
          doc.roundedRect(
            14,
            currentY,
            pageWidth - 28,
            12,
            1.5,
            1.5,
            'S'
          )

          doc.setFontSize(8)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(100, 116, 139)
          doc.text(
            'Total Ajustes:',
            20,
            currentY + 7.5
          )
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(
            primaryColor[0],
            primaryColor[1],
            primaryColor[2]
          )
          doc.text(
            `${this.stats.totalAjustes}`,
            42,
            currentY + 7.5
          )

          doc.setFont('helvetica', 'normal')
          doc.setTextColor(100, 116, 139)
          doc.text(
            'Entradas (+):',
            70,
            currentY + 7.5
          )
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(
            greenColor[0],
            greenColor[1],
            greenColor[2]
          )
          doc.text(
            `${this.stats.ajustesPositivos} (+${this.stats.unidadesPositivas} uds)`,
            90,
            currentY + 7.5
          )

          doc.setFont('helvetica', 'normal')
          doc.setTextColor(100, 116, 139)
          doc.text(
            'Salidas (-):',
            145,
            currentY + 7.5
          )
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(
            redColor[0],
            redColor[1],
            redColor[2]
          )
          doc.text(
            `${this.stats.ajustesNegativos} (-${this.stats.unidadesNegativas} uds)`,
            162,
            currentY + 7.5
          )

          const filtroBodegaText = this
            .filtrosHistorial.idBodega
            ? this.bodegasCombobox.find(
                (b) =>
                  b.id ===
                  this.filtrosHistorial.idBodega
              )?.nombre || 'Filtrada'
            : 'Todas las bodegas'
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(100, 116, 139)
          doc.text(
            `Bodega: ${filtroBodegaText}`,
            pageWidth - 20,
            currentY + 7.5,
            { align: 'right' }
          )

          // Table
          const tableHeaders = [
            'Referencia',
            'Fecha / Hora',
            'Producto',
            'Bodega',
            'Concepto',
            'Stock Ant.',
            'Ajuste (+/-)',
            'Stock Final',
            'Operación',
            'Usuario'
          ]

          const bodyRows =
            this.filteredAjustes.map((a) => {
              const esEntrada =
                a.cantidadAjustada > 0 ||
                a.tipoOperacion === 'Entrada'
              const signo =
                a.cantidadAjustada > 0 ? '+' : ''
              return [
                a.referenciaKardex ||
                  `AJU-${a.idAjusteStock}`,
                this.formatearFechaHora(
                  a.fechaRegistro
                ),
                a.producto || '—',
                a.bodega || '—',
                a.concepto || '—',
                String(
                  a.stockAnterior != null
                    ? a.stockAnterior
                    : 0
                ),
                `${signo}${a.cantidadAjustada != null ? a.cantidadAjustada : 0}`,
                String(
                  a.stockActual != null
                    ? a.stockActual
                    : 0
                ),
                esEntrada ? 'Entrada' : 'Salida',
                a.usuarioRegistro || '—'
              ]
            })

          doc.autoTable({
            startY: currentY + 16,
            head: [tableHeaders],
            body: bodyRows,
            theme: 'grid',
            styles: {
              font: 'helvetica',
              fontSize: 7.5,
              textColor: darkColor,
              cellPadding: {
                top: 2,
                bottom: 2,
                left: 2,
                right: 2
              },
              lineColor: borderGray,
              lineWidth: 0.2
            },
            headStyles: {
              fillColor: primaryColor,
              textColor: [255, 255, 255],
              fontStyle: 'bold',
              fontSize: 8,
              halign: 'center'
            },
            alternateRowStyles: {
              fillColor: lightBg
            },
            columnStyles: {
              0: {
                halign: 'center',
                cellWidth: 28
              }, // Ref
              1: {
                halign: 'center',
                cellWidth: 26
              }, // Fecha
              2: { cellWidth: 'auto' }, // Producto
              3: { cellWidth: 32 }, // Bodega
              4: { cellWidth: 32 }, // Concepto
              5: {
                halign: 'right',
                cellWidth: 18
              }, // Stock Ant
              6: {
                halign: 'right',
                fontStyle: 'bold',
                cellWidth: 20
              }, // Ajuste
              7: {
                halign: 'right',
                fontStyle: 'bold',
                cellWidth: 18
              }, // Stock Final
              8: {
                halign: 'center',
                fontStyle: 'bold',
                cellWidth: 18
              }, // Operación
              9: {
                halign: 'center',
                cellWidth: 22
              } // Usuario
            },
            didParseCell: (data) => {
              if (data.section === 'body') {
                if (
                  data.column.index === 6 ||
                  data.column.index === 8
                ) {
                  const val = String(
                    data.cell.raw || ''
                  )
                  if (
                    val.includes('+') ||
                    val === 'Entrada'
                  ) {
                    data.cell.styles.textColor =
                      greenColor
                  } else if (
                    val.includes('-') ||
                    val === 'Salida'
                  ) {
                    data.cell.styles.textColor =
                      redColor
                  }
                }
              }
            },
            didDrawPage: (data) => {
              const str = `Página ${doc.internal.getNumberOfPages()}`
              doc.setFontSize(7.5)
              doc.setTextColor(148, 163, 184)
              doc.text(
                'S.I. TOKES — Sistema de Gestión Empresarial e Inventario',
                14,
                pageHeight - 6
              )
              doc.text(
                str,
                pageWidth - 14,
                pageHeight - 6,
                { align: 'right' }
              )
            }
          })

          doc.save(
            `Reporte_Ajustes_Stock_${new Date().toISOString().slice(0, 10)}.pdf`
          )
          this.mostrarNotificacion(
            'Reporte PDF generado exitosamente',
            'success'
          )
        } else {
          // Stock Físico por Bodega
          if (
            !this.stockBodegas ||
            this.stockBodegas.length === 0
          ) {
            this.mostrarNotificacion(
              'No hay registros de existencias para exportar.',
              'warning'
            )
            return
          }

          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          })
          const pageWidth =
            doc.internal.pageSize.getWidth()
          const pageHeight =
            doc.internal.pageSize.getHeight()

          const primaryColor = [26, 35, 126]
          const accentColor = [57, 73, 171]
          const darkColor = [30, 41, 59]
          const lightBg = [248, 250, 252]
          const borderGray = [226, 232, 240]

          doc.setFillColor(
            primaryColor[0],
            primaryColor[1],
            primaryColor[2]
          )
          doc.rect(0, 0, pageWidth, 22, 'F')
          doc.setFillColor(
            accentColor[0],
            accentColor[1],
            accentColor[2]
          )
          doc.rect(0, 22, pageWidth, 1.2, 'F')

          doc.setFontSize(14)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(255, 255, 255)
          doc.text(
            'INVENTARIO FÍSICO POR BODEGA',
            14,
            10
          )

          doc.setFontSize(8.5)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(220, 225, 245)
          doc.text(
            'S.I. TOKES — REPORTE CONSOLIDADO DE STOCK Y VALORIZACIÓN EN SUCURSALES',
            14,
            17
          )

          doc.setFontSize(7.5)
          doc.text(
            `Generado: ${new Date().toLocaleString('es-NI')}`,
            pageWidth - 14,
            17,
            { align: 'right' }
          )

          const tableHeaders = [
            'Código',
            'Producto',
            'Categoría',
            'Bodega',
            'Stock Físico',
            'Stock Global',
            'Costo Unit.',
            'Valor Bodega'
          ]

          const bodyRows = this.stockBodegas.map(
            (item) => [
              item.codigo || '—',
              item.nombreProducto || '—',
              item.categoria || '—',
              item.nombreBodega || '—',
              String(item.cantidadTotal || 0),
              String(
                item.cantidadTotalGeneral || 0
              ),
              this.formatearMoneda(item.costo),
              this.formatearMoneda(
                item.totalCostoBodega
              )
            ]
          )

          doc.autoTable({
            startY: 28,
            head: [tableHeaders],
            body: bodyRows,
            theme: 'grid',
            styles: {
              font: 'helvetica',
              fontSize: 8,
              textColor: darkColor,
              cellPadding: {
                top: 2.5,
                bottom: 2.5,
                left: 2.5,
                right: 2.5
              },
              lineColor: borderGray,
              lineWidth: 0.2
            },
            headStyles: {
              fillColor: primaryColor,
              textColor: [255, 255, 255],
              fontStyle: 'bold',
              fontSize: 8.5,
              halign: 'center'
            },
            alternateRowStyles: {
              fillColor: lightBg
            },
            columnStyles: {
              0: {
                halign: 'center',
                cellWidth: 25
              },
              1: { cellWidth: 'auto' },
              2: { cellWidth: 35 },
              3: { cellWidth: 35 },
              4: {
                halign: 'right',
                fontStyle: 'bold',
                cellWidth: 25
              },
              5: {
                halign: 'right',
                cellWidth: 25
              },
              6: {
                halign: 'right',
                cellWidth: 25
              },
              7: {
                halign: 'right',
                fontStyle: 'bold',
                cellWidth: 30
              }
            },
            didDrawPage: (data) => {
              const str = `Página ${doc.internal.getNumberOfPages()}`
              doc.setFontSize(7.5)
              doc.setTextColor(148, 163, 184)
              doc.text(
                'S.I. TOKES — Sistema de Gestión Empresarial e Inventario',
                14,
                pageHeight - 6
              )
              doc.text(
                str,
                pageWidth - 14,
                pageHeight - 6,
                { align: 'right' }
              )
            }
          })

          doc.save(
            `Stock_Fisico_Bodegas_${new Date().toISOString().slice(0, 10)}.pdf`
          )
          this.mostrarNotificacion(
            'Reporte de existencias generado exitosamente',
            'success'
          )
        }
      } catch (err) {
        console.error(
          'Error al exportar PDF:',
          err
        )
        this.mostrarNotificacion(
          'Ocurrió un error al generar el archivo PDF',
          'error'
        )
      }
    },

    // Exportación de Comprobante Individual de Ajuste en PDF
    exportarComprobantePDF(item) {
      if (!item) return
      try {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        })
        const pageWidth =
          doc.internal.pageSize.getWidth()
        const pageHeight =
          doc.internal.pageSize.getHeight()

        const primaryColor = [26, 35, 126] // #1A237E
        const accentColor = [57, 73, 171] // #3949AB
        const darkColor = [30, 41, 59] // #1E293B
        const lightBg = [248, 250, 252] // #F8FAFC
        const borderGray = [226, 232, 240] // #E2E8F0
        const greenColor = [46, 125, 50] // #2E7D32
        const redColor = [198, 40, 40] // #C62828

        // Header Top Bar
        doc.setFillColor(
          primaryColor[0],
          primaryColor[1],
          primaryColor[2]
        )
        doc.rect(0, 0, pageWidth, 24, 'F')
        doc.setFillColor(
          accentColor[0],
          accentColor[1],
          accentColor[2]
        )
        doc.rect(0, 24, pageWidth, 1.5, 'F')

        // Header Title
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text(
          'COMPROBANTE DE AJUSTE DE INVENTARIO',
          14,
          11
        )

        doc.setFontSize(8.5)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(220, 225, 245)
        doc.text(
          'S.I. TOKES — DOCUMENTO OFICIAL DE AUDITORÍA Y CONTROL',
          14,
          18
        )

        // Voucher Number Badge
        const refTexto =
          item.referenciaKardex ||
          `AJU-${item.idAjusteStock}`
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text(refTexto, pageWidth - 14, 13, {
          align: 'right'
        })

        let currentY = 32

        // Section 1: General Details
        doc.setFillColor(
          lightBg[0],
          lightBg[1],
          lightBg[2]
        )
        doc.roundedRect(
          14,
          currentY,
          pageWidth - 28,
          22,
          2,
          2,
          'F'
        )
        doc.setDrawColor(
          borderGray[0],
          borderGray[1],
          borderGray[2]
        )
        doc.setLineWidth(0.3)
        doc.roundedRect(
          14,
          currentY,
          pageWidth - 28,
          22,
          2,
          2,
          'S'
        )

        doc.setFontSize(8.5)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(
          primaryColor[0],
          primaryColor[1],
          primaryColor[2]
        )
        doc.text(
          'INFORMACIÓN GENERAL',
          18,
          currentY + 6
        )

        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text(
          'Fecha / Hora de Registro:',
          18,
          currentY + 12
        )
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(
          darkColor[0],
          darkColor[1],
          darkColor[2]
        )
        doc.text(
          this.formatearFechaHora(
            item.fechaRegistro
          ),
          62,
          currentY + 12
        )

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text(
          'Usuario Responsable:',
          18,
          currentY + 17
        )
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(
          darkColor[0],
          darkColor[1],
          darkColor[2]
        )
        doc.text(
          item.usuarioRegistro || 'Sistema',
          62,
          currentY + 17
        )

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text(
          'Bodega Física:',
          pageWidth / 2 + 10,
          currentY + 12
        )
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(
          darkColor[0],
          darkColor[1],
          darkColor[2]
        )
        doc.text(
          item.bodega || '—',
          pageWidth / 2 + 35,
          currentY + 12
        )

        currentY += 28

        // Section 2: Product & Concept
        doc.setFillColor(
          lightBg[0],
          lightBg[1],
          lightBg[2]
        )
        doc.roundedRect(
          14,
          currentY,
          pageWidth - 28,
          26,
          2,
          2,
          'F'
        )
        doc.setDrawColor(
          borderGray[0],
          borderGray[1],
          borderGray[2]
        )
        doc.roundedRect(
          14,
          currentY,
          pageWidth - 28,
          26,
          2,
          2,
          'S'
        )

        doc.setFontSize(8.5)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(
          primaryColor[0],
          primaryColor[1],
          primaryColor[2]
        )
        doc.text(
          'DETALLE DEL PRODUCTO Y CONCEPTO',
          18,
          currentY + 6
        )

        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text('Producto:', 18, currentY + 13)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(
          darkColor[0],
          darkColor[1],
          darkColor[2]
        )
        doc.text(
          item.producto || '—',
          40,
          currentY + 13
        )

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text(
          'Concepto Ajuste:',
          18,
          currentY + 20
        )
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(
          darkColor[0],
          darkColor[1],
          darkColor[2]
        )
        doc.text(
          item.concepto || '—',
          45,
          currentY + 20
        )

        const esEntrada =
          item.cantidadAjustada > 0 ||
          item.tipoOperacion === 'Entrada'
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text(
          'Operación:',
          pageWidth / 2 + 10,
          currentY + 20
        )
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(
          esEntrada ? greenColor[0] : redColor[0],
          esEntrada ? greenColor[1] : redColor[1],
          esEntrada ? greenColor[2] : redColor[2]
        )
        doc.text(
          esEntrada
            ? 'Aumento (+)'
            : 'Disminución (-)',
          pageWidth / 2 + 32,
          currentY + 20
        )

        currentY += 32

        // Section 3: Stock Breakdown Cards (3 Columns)
        const colWidth = (pageWidth - 28 - 8) / 3

        // Box 1: Stock Anterior
        doc.setFillColor(241, 245, 249) // Slate 100
        doc.roundedRect(
          14,
          currentY,
          colWidth,
          24,
          2,
          2,
          'F'
        )
        doc.setDrawColor(
          borderGray[0],
          borderGray[1],
          borderGray[2]
        )
        doc.roundedRect(
          14,
          currentY,
          colWidth,
          24,
          2,
          2,
          'S'
        )
        doc.setFontSize(7.5)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text(
          'STOCK PREVIO',
          14 + colWidth / 2,
          currentY + 7,
          { align: 'center' }
        )
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(
          darkColor[0],
          darkColor[1],
          darkColor[2]
        )
        doc.text(
          String(
            item.stockAnterior != null
              ? item.stockAnterior
              : 0
          ),
          14 + colWidth / 2,
          currentY + 17,
          { align: 'center' }
        )

        // Box 2: Cantidad Ajustada
        const bgAjuste = esEntrada
          ? [232, 245, 233]
          : [255, 235, 238]
        doc.setFillColor(
          bgAjuste[0],
          bgAjuste[1],
          bgAjuste[2]
        )
        doc.roundedRect(
          14 + colWidth + 4,
          currentY,
          colWidth,
          24,
          2,
          2,
          'F'
        )
        doc.setDrawColor(
          borderGray[0],
          borderGray[1],
          borderGray[2]
        )
        doc.roundedRect(
          14 + colWidth + 4,
          currentY,
          colWidth,
          24,
          2,
          2,
          'S'
        )
        doc.setFontSize(7.5)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(
          esEntrada ? greenColor[0] : redColor[0],
          esEntrada ? greenColor[1] : redColor[1],
          esEntrada ? greenColor[2] : redColor[2]
        )
        doc.text(
          'AJUSTE APLICADO',
          14 + colWidth + 4 + colWidth / 2,
          currentY + 7,
          { align: 'center' }
        )
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        const signo =
          item.cantidadAjustada > 0 ? '+' : ''
        doc.text(
          `${signo}${item.cantidadAjustada != null ? item.cantidadAjustada : 0}`,
          14 + colWidth + 4 + colWidth / 2,
          currentY + 17,
          { align: 'center' }
        )

        // Box 3: Stock Final
        doc.setFillColor(232, 234, 246) // Indigo 50
        doc.roundedRect(
          14 + (colWidth + 4) * 2,
          currentY,
          colWidth,
          24,
          2,
          2,
          'F'
        )
        doc.setDrawColor(
          borderGray[0],
          borderGray[1],
          borderGray[2]
        )
        doc.roundedRect(
          14 + (colWidth + 4) * 2,
          currentY,
          colWidth,
          24,
          2,
          2,
          'S'
        )
        doc.setFontSize(7.5)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(
          primaryColor[0],
          primaryColor[1],
          primaryColor[2]
        )
        doc.text(
          'STOCK RESULTANTE',
          14 + (colWidth + 4) * 2 + colWidth / 2,
          currentY + 7,
          { align: 'center' }
        )
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text(
          String(
            item.stockActual != null
              ? item.stockActual
              : 0
          ),
          14 + (colWidth + 4) * 2 + colWidth / 2,
          currentY + 17,
          { align: 'center' }
        )

        currentY += 30

        // Section 4: Observations
        doc.setFillColor(
          lightBg[0],
          lightBg[1],
          lightBg[2]
        )
        doc.roundedRect(
          14,
          currentY,
          pageWidth - 28,
          24,
          2,
          2,
          'F'
        )
        doc.setDrawColor(
          borderGray[0],
          borderGray[1],
          borderGray[2]
        )
        doc.roundedRect(
          14,
          currentY,
          pageWidth - 28,
          24,
          2,
          2,
          'S'
        )

        doc.setFontSize(8.5)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(
          primaryColor[0],
          primaryColor[1],
          primaryColor[2]
        )
        doc.text(
          'OBSERVACIONES / JUSTIFICACIÓN',
          18,
          currentY + 6
        )

        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(
          darkColor[0],
          darkColor[1],
          darkColor[2]
        )
        const obsText = doc.splitTextToSize(
          item.observaciones ||
            'Sin observaciones registradas.',
          pageWidth - 36
        )
        doc.text(obsText, 18, currentY + 13)

        currentY += 36

        // Signatures Area
        const sigWidth = 65
        const sig1X = 25
        const sig2X = pageWidth - 25 - sigWidth
        const sigY = currentY + 22

        doc.setDrawColor(148, 163, 184)
        doc.setLineWidth(0.4)
        doc.line(
          sig1X,
          sigY,
          sig1X + sigWidth,
          sigY
        )
        doc.line(
          sig2X,
          sigY,
          sig2X + sigWidth,
          sigY
        )

        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(
          darkColor[0],
          darkColor[1],
          darkColor[2]
        )
        doc.text(
          'Responsable de Inventario / Bodega',
          sig1X + sigWidth / 2,
          sigY + 5,
          { align: 'center' }
        )
        doc.text(
          'Supervisor / Auditoría',
          sig2X + sigWidth / 2,
          sigY + 5,
          { align: 'center' }
        )

        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(148, 163, 184)
        doc.text(
          'Firma y Sello',
          sig1X + sigWidth / 2,
          sigY + 9,
          { align: 'center' }
        )
        doc.text(
          'Firma y Sello',
          sig2X + sigWidth / 2,
          sigY + 9,
          { align: 'center' }
        )

        // Footer
        doc.setFontSize(7.5)
        doc.setTextColor(148, 163, 184)
        doc.text(
          'Documento de control interno emitido por S.I. TOKES. Válido sin tachaduras ni enmendaduras.',
          14,
          pageHeight - 8
        )

        doc.save(
          `Comprobante_Ajuste_${refTexto}.pdf`
        )
        this.mostrarNotificacion(
          'Comprobante PDF descargado exitosamente',
          'success'
        )
      } catch (err) {
        console.error(
          'Error al generar comprobante PDF:',
          err
        )
        this.mostrarNotificacion(
          'Error al generar el comprobante PDF',
          'error'
        )
      }
    }
  }
}
</script>

<style scoped>
.font {
  font-family: inherit;
}
</style>
