<template>
  <div class="control-abonos-page pa-4 bg-grey-lighten-4 fill-height">
    <!-- TARJETA PRINCIPAL CONTENEDORA -->
    <v-card variant="flat" class="border rounded-lg bg-white overflow-hidden">
      <!-- BARRA SUPERIOR: ENCABEZADO Y ACCIONES (MINIMALISTA) -->
      <div class="px-4 py-3 bg-white border-b d-flex flex-wrap align-center justify-space-between ga-3">
        <!-- Título y descripción -->
        <div class="d-flex align-center">
          <v-avatar color="primary" variant="tonal" size="42" class="mr-3 rounded-lg">
            <v-icon color="primary" size="24">mdi-receipt-text-check-outline</v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 leading-tight">
              Control de Abonos
            </div>
            <div class="text-caption text-grey">
              Consulta, filtrado avanzado e historial de pagos de cuentas por cobrar
            </div>
          </div>
        </div>

        <!-- Indicadores de métricas y Botones de acción -->
        <div class="d-flex flex-wrap align-center ga-2">
          <!-- Total Recaudado -->
          <v-sheet
            class="px-3 py-1 rounded border bg-blue-lighten-5 border-blue-lighten-3 d-flex align-center ga-2"
          >
            <v-icon size="18" color="primary">mdi-cash-multiple</v-icon>
            <div>
              <div class="text-caption text-grey-darken-1 line-height-1">Recaudado</div>
              <div class="text-subtitle-2 font-weight-bold text-primary">
                {{ formatCurrency(totalRecaudado) }}
              </div>
            </div>
          </v-sheet>

          <!-- Total de Abonos -->
          <v-sheet
            class="px-3 py-1 rounded border bg-grey-lighten-5 border-grey-lighten-2 d-flex align-center ga-2"
          >
            <v-icon size="18" color="grey-darken-2">mdi-format-list-numbered</v-icon>
            <div>
              <div class="text-caption text-grey-darken-1 line-height-1">Total Abonos</div>
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                {{ totalItems }}
              </div>
            </div>
          </v-sheet>

          <v-divider vertical class="mx-1" />

          <!-- Botón Limpiar Filtros -->
          <v-btn
            v-if="totalFiltrosActivos > 0"
            variant="tonal"
            color="error"
            size="small"
            prepend-icon="mdi-filter-off-outline"
            class="text-none font-weight-medium"
            @click="limpiarTodosFiltros"
          >
            Limpiar filtros ({{ totalFiltrosActivos }})
          </v-btn>

          <!-- Botón Exportar a Excel -->
          <v-btn
            variant="outlined"
            color="success"
            size="small"
            prepend-icon="mdi-file-excel-outline"
            class="text-none font-weight-bold"
            :loading="exportando"
            @click="exportarExcel"
          >
            Exportar Excel
          </v-btn>

          <!-- Botón Refrescar -->
          <v-btn
            icon="mdi-refresh"
            variant="text"
            size="small"
            color="grey-darken-2"
            :loading="loading"
            title="Actualizar datos"
            @click="fetchAbonos"
          />
        </div>
      </div>

      <!-- BARRA DE CHIPS DE FILTROS ACTIVOS (ESTILO EXCEL) -->
      <div
        v-if="totalFiltrosActivos > 0"
        class="px-4 py-2 bg-grey-lighten-5 border-b d-flex flex-wrap align-center ga-2"
      >
        <div class="d-flex align-center text-caption font-weight-bold text-grey-darken-2 mr-1">
          <v-icon size="16" class="mr-1 text-primary">mdi-filter</v-icon>
          Filtros aplicados:
        </div>



        <v-chip
          v-if="filtros.noFactura"
          size="small"
          closable
          color="primary"
          variant="tonal"
          @click:close="removerFiltro('noFactura')"
        >
          <strong>Factura:</strong>&nbsp;{{ filtros.noFactura }}
        </v-chip>

        <v-chip
          v-if="filtros.cliente"
          size="small"
          closable
          color="primary"
          variant="tonal"
          @click:close="removerFiltro('cliente')"
        >
          <strong>Cliente:</strong>&nbsp;{{ filtros.cliente }}
        </v-chip>

        <v-chip
          v-if="filtros.rutaCliente"
          size="small"
          closable
          color="primary"
          variant="tonal"
          @click:close="removerFiltro('rutaCliente')"
        >
          <strong>Ruta:</strong>&nbsp;{{ filtros.rutaCliente }}
        </v-chip>

        <v-chip
          v-if="filtros.modalidadTexto"
          size="small"
          closable
          color="primary"
          variant="tonal"
          @click:close="removerFiltro('modalidad')"
        >
          <strong>Modalidad:</strong>&nbsp;{{ filtros.modalidadTexto }}
        </v-chip>

        <v-chip
          v-if="filtros.numReferencia"
          size="small"
          closable
          color="primary"
          variant="tonal"
          @click:close="removerFiltro('numReferencia')"
        >
          <strong>Referencia:</strong>&nbsp;{{ filtros.numReferencia }}
        </v-chip>

        <v-chip
          v-if="filtros.usuarioRegistro"
          size="small"
          closable
          color="primary"
          variant="tonal"
          @click:close="removerFiltro('usuarioRegistro')"
        >
          <strong>Usuario:</strong>&nbsp;{{ filtros.usuarioRegistro }}
        </v-chip>

        <v-chip
          v-if="filtros.fechaDesde || filtros.fechaHasta"
          size="small"
          closable
          color="primary"
          variant="tonal"
          @click:close="removerFiltro('fechaMovimiento')"
        >
          <strong>Fecha:</strong>&nbsp;
          {{ filtros.fechaDesde || 'Inicio' }} al {{ filtros.fechaHasta || 'Hoy' }}
        </v-chip>
      </div>

      <!-- TABLA DE DATOS PAGINADA SERVER-SIDE (V-DATA-TABLE-SERVER) -->
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        v-model:sort-by="sortBy"
        :headers="headers"
        :items="items"
        :items-length="totalItems"
        :loading="loading"
        :items-per-page-options="[10, 25, 50, 100]"
        density="comfortable"
        hover
        class="border-0 control-abonos-table"
        @update:options="cargarTabla"
      >
        <!-- ========================================== -->
        <!-- SLOTS DE ENCABEZADO CON FILTROS ESTILO EXCEL -->
        <!-- ========================================== -->



        <!-- 2. ENCABEZADO: FECHA -->
        <template #header.fechaMovimiento="{ column, isSorted, getSortIcon, toggleSort }">
          <div class="d-flex align-center justify-space-between w-100 ga-1">
            <span
              class="font-weight-bold cursor-pointer text-truncate"
              @click="toggleSort(column)"
            >
              {{ column.title }}
              <v-icon v-if="isSorted(column)" size="16">
                {{ getSortIcon(column) }}
              </v-icon>
            </span>

            <v-menu
              v-model="menusFiltros.fechaMovimiento"
              :close-on-content-click="false"
              location="bottom end"
              offset="6"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  size="x-small"
                  :color="(filtros.fechaDesde || filtros.fechaHasta) ? 'primary' : 'grey-darken-1'"
                  class="filter-header-btn"
                  :class="{ 'filter-active': Boolean(filtros.fechaDesde || filtros.fechaHasta) }"
                  @click.stop="abrirMenuFiltro('fechaMovimiento')"
                >
                  <v-icon size="15">
                    {{ (filtros.fechaDesde || filtros.fechaHasta) ? 'mdi-filter' : 'mdi-filter-variant' }}
                  </v-icon>
                </v-btn>
              </template>

              <v-card min-width="290" class="border elevation-3 pa-3 rounded-lg">
                <div class="text-caption font-weight-bold text-grey-darken-3 mb-2 d-flex align-center">
                  <v-icon size="16" class="mr-1 text-primary">mdi-calendar-range</v-icon>
                  Rango de Fechas
                </div>

                <!-- Atajos rápidos -->
                <div class="d-flex ga-1 mb-2">
                  <v-chip
                    size="x-small"
                    variant="outlined"
                    class="cursor-pointer"
                    @click="setRangoFechaRapido('hoy')"
                  >
                    Hoy
                  </v-chip>
                  <v-chip
                    size="x-small"
                    variant="outlined"
                    class="cursor-pointer"
                    @click="setRangoFechaRapido('mes')"
                  >
                    Este Mes
                  </v-chip>
                  <v-chip
                    size="x-small"
                    variant="outlined"
                    class="cursor-pointer"
                    @click="setRangoFechaRapido('anio')"
                  >
                    Este Año
                  </v-chip>
                </div>

                <div class="d-flex flex-column ga-2">
                  <v-text-field
                    v-model="filtrosTemp.fechaDesde"
                    label="Desde"
                    type="date"
                    density="compact"
                    variant="outlined"
                    hide-details
                  />
                  <v-text-field
                    v-model="filtrosTemp.fechaHasta"
                    label="Hasta"
                    type="date"
                    density="compact"
                    variant="outlined"
                    hide-details
                  />
                </div>

                <div class="d-flex justify-end ga-2 mt-3">
                  <v-btn
                    size="small"
                    variant="text"
                    color="grey-darken-1"
                    class="text-none"
                    @click="limpiarFiltroColumna('fechaMovimiento')"
                  >
                    Limpiar
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="flat"
                    color="primary"
                    class="text-none font-weight-bold"
                    @click="aplicarFiltroColumna('fechaMovimiento')"
                  >
                    Aplicar
                  </v-btn>
                </div>
              </v-card>
            </v-menu>
          </div>
        </template>

        <!-- 3. ENCABEZADO: FACTURA -->
        <template #header.noFactura="{ column, isSorted, getSortIcon, toggleSort }">
          <div class="d-flex align-center justify-space-between w-100 ga-1">
            <span
              class="font-weight-bold cursor-pointer text-truncate"
              @click="toggleSort(column)"
            >
              {{ column.title }}
              <v-icon v-if="isSorted(column)" size="16">
                {{ getSortIcon(column) }}
              </v-icon>
            </span>

            <v-menu
              v-model="menusFiltros.noFactura"
              :close-on-content-click="false"
              location="bottom end"
              offset="6"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  size="x-small"
                  :color="filtros.noFactura ? 'primary' : 'grey-darken-1'"
                  class="filter-header-btn"
                  :class="{ 'filter-active': Boolean(filtros.noFactura) }"
                  @click.stop="abrirMenuFiltro('noFactura')"
                >
                  <v-icon size="15">
                    {{ filtros.noFactura ? 'mdi-filter' : 'mdi-filter-variant' }}
                  </v-icon>
                </v-btn>
              </template>

              <v-card min-width="260" class="border elevation-3 pa-3 rounded-lg">
                <div class="text-caption font-weight-bold text-grey-darken-3 mb-2 d-flex align-center">
                  <v-icon size="16" class="mr-1 text-primary">mdi-file-document-outline</v-icon>
                  Filtrar por Factura
                </div>
                <v-text-field
                  v-model="filtrosTemp.noFactura"
                  placeholder="Ej: FAC-0012"
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                  autofocus
                  @keydown.enter="aplicarFiltroColumna('noFactura')"
                />
                <div class="d-flex justify-end ga-2 mt-3">
                  <v-btn
                    size="small"
                    variant="text"
                    color="grey-darken-1"
                    class="text-none"
                    @click="limpiarFiltroColumna('noFactura')"
                  >
                    Limpiar
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="flat"
                    color="primary"
                    class="text-none font-weight-bold"
                    @click="aplicarFiltroColumna('noFactura')"
                  >
                    Aplicar
                  </v-btn>
                </div>
              </v-card>
            </v-menu>
          </div>
        </template>

        <!-- 4. ENCABEZADO: CLIENTE -->
        <template #header.cliente="{ column, isSorted, getSortIcon, toggleSort }">
          <div class="d-flex align-center justify-space-between w-100 ga-1">
            <span
              class="font-weight-bold cursor-pointer text-truncate"
              @click="toggleSort(column)"
            >
              {{ column.title }}
              <v-icon v-if="isSorted(column)" size="16">
                {{ getSortIcon(column) }}
              </v-icon>
            </span>

            <v-menu
              v-model="menusFiltros.cliente"
              :close-on-content-click="false"
              location="bottom end"
              offset="6"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  size="x-small"
                  :color="filtros.cliente ? 'primary' : 'grey-darken-1'"
                  class="filter-header-btn"
                  :class="{ 'filter-active': Boolean(filtros.cliente) }"
                  @click.stop="abrirMenuFiltro('cliente')"
                >
                  <v-icon size="15">
                    {{ filtros.cliente ? 'mdi-filter' : 'mdi-filter-variant' }}
                  </v-icon>
                </v-btn>
              </template>

              <v-card min-width="280" class="border elevation-3 pa-3 rounded-lg">
                <div class="text-caption font-weight-bold text-grey-darken-3 mb-2 d-flex align-center">
                  <v-icon size="16" class="mr-1 text-primary">mdi-account-search-outline</v-icon>
                  Filtrar por Cliente
                </div>
                <v-text-field
                  v-model="filtrosTemp.cliente"
                  placeholder="Nombre o código del cliente..."
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                  autofocus
                  @keydown.enter="aplicarFiltroColumna('cliente')"
                />
                <div class="d-flex justify-end ga-2 mt-3">
                  <v-btn
                    size="small"
                    variant="text"
                    color="grey-darken-1"
                    class="text-none"
                    @click="limpiarFiltroColumna('cliente')"
                  >
                    Limpiar
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="flat"
                    color="primary"
                    class="text-none font-weight-bold"
                    @click="aplicarFiltroColumna('cliente')"
                  >
                    Aplicar
                  </v-btn>
                </div>
              </v-card>
            </v-menu>
          </div>
        </template>

        <!-- 5. ENCABEZADO: RUTA CLIENTE -->
        <template #header.rutaCliente="{ column, isSorted, getSortIcon, toggleSort }">
          <div class="d-flex align-center justify-space-between w-100 ga-1">
            <span
              class="font-weight-bold cursor-pointer text-truncate"
              @click="toggleSort(column)"
            >
              {{ column.title }}
              <v-icon v-if="isSorted(column)" size="16">
                {{ getSortIcon(column) }}
              </v-icon>
            </span>

            <v-menu
              v-model="menusFiltros.rutaCliente"
              :close-on-content-click="false"
              location="bottom end"
              offset="6"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  size="x-small"
                  :color="filtros.rutaCliente ? 'primary' : 'grey-darken-1'"
                  class="filter-header-btn"
                  :class="{ 'filter-active': Boolean(filtros.rutaCliente) }"
                  @click.stop="abrirMenuFiltro('rutaCliente')"
                >
                  <v-icon size="15">
                    {{ filtros.rutaCliente ? 'mdi-filter' : 'mdi-filter-variant' }}
                  </v-icon>
                </v-btn>
              </template>

              <v-card min-width="280" class="border elevation-3 pa-3 rounded-lg">
                <div class="text-caption font-weight-bold text-grey-darken-3 mb-2 d-flex align-center">
                  <v-icon size="16" class="mr-1 text-primary">mdi-map-marker-path</v-icon>
                  Filtrar por Ruta
                </div>
                <v-autocomplete
                  v-model="filtrosTemp.rutaCliente"
                  :items="opcionesFiltro.rutas"
                  placeholder="Seleccionar ruta..."
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                />
                <div class="d-flex justify-end ga-2 mt-3">
                  <v-btn
                    size="small"
                    variant="text"
                    color="grey-darken-1"
                    class="text-none"
                    @click="limpiarFiltroColumna('rutaCliente')"
                  >
                    Limpiar
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="flat"
                    color="primary"
                    class="text-none font-weight-bold"
                    @click="aplicarFiltroColumna('rutaCliente')"
                  >
                    Aplicar
                  </v-btn>
                </div>
              </v-card>
            </v-menu>
          </div>
        </template>

        <!-- 6. ENCABEZADO: MODALIDAD -->
        <template #header.modalidad="{ column, isSorted, getSortIcon, toggleSort }">
          <div class="d-flex align-center justify-space-between w-100 ga-1">
            <span
              class="font-weight-bold cursor-pointer text-truncate"
              @click="toggleSort(column)"
            >
              {{ column.title }}
              <v-icon v-if="isSorted(column)" size="16">
                {{ getSortIcon(column) }}
              </v-icon>
            </span>

            <v-menu
              v-model="menusFiltros.modalidad"
              :close-on-content-click="false"
              location="bottom end"
              offset="6"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  size="x-small"
                  :color="filtros.idModalidad ? 'primary' : 'grey-darken-1'"
                  class="filter-header-btn"
                  :class="{ 'filter-active': Boolean(filtros.idModalidad) }"
                  @click.stop="abrirMenuFiltro('modalidad')"
                >
                  <v-icon size="15">
                    {{ filtros.idModalidad ? 'mdi-filter' : 'mdi-filter-variant' }}
                  </v-icon>
                </v-btn>
              </template>

              <v-card min-width="280" class="border elevation-3 pa-3 rounded-lg">
                <div class="text-caption font-weight-bold text-grey-darken-3 mb-2 d-flex align-center">
                  <v-icon size="16" class="mr-1 text-primary">mdi-credit-card-outline</v-icon>
                  Filtrar por Modalidad
                </div>
                <v-select
                  v-model="filtrosTemp.idModalidad"
                  :items="opcionesFiltro.modalidades"
                  item-title="nombre"
                  item-value="idModalidad"
                  placeholder="Seleccionar modalidad..."
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                />
                <div class="d-flex justify-end ga-2 mt-3">
                  <v-btn
                    size="small"
                    variant="text"
                    color="grey-darken-1"
                    class="text-none"
                    @click="limpiarFiltroColumna('modalidad')"
                  >
                    Limpiar
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="flat"
                    color="primary"
                    class="text-none font-weight-bold"
                    @click="aplicarFiltroColumna('modalidad')"
                  >
                    Aplicar
                  </v-btn>
                </div>
              </v-card>
            </v-menu>
          </div>
        </template>

        <!-- 7. ENCABEZADO: REFERENCIA -->
        <template #header.numReferencia="{ column, isSorted, getSortIcon, toggleSort }">
          <div class="d-flex align-center justify-space-between w-100 ga-1">
            <span
              class="font-weight-bold cursor-pointer text-truncate"
              @click="toggleSort(column)"
            >
              {{ column.title }}
              <v-icon v-if="isSorted(column)" size="16">
                {{ getSortIcon(column) }}
              </v-icon>
            </span>

            <v-menu
              v-model="menusFiltros.numReferencia"
              :close-on-content-click="false"
              location="bottom end"
              offset="6"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  size="x-small"
                  :color="filtros.numReferencia ? 'primary' : 'grey-darken-1'"
                  class="filter-header-btn"
                  :class="{ 'filter-active': Boolean(filtros.numReferencia) }"
                  @click.stop="abrirMenuFiltro('numReferencia')"
                >
                  <v-icon size="15">
                    {{ filtros.numReferencia ? 'mdi-filter' : 'mdi-filter-variant' }}
                  </v-icon>
                </v-btn>
              </template>

              <v-card min-width="260" class="border elevation-3 pa-3 rounded-lg">
                <div class="text-caption font-weight-bold text-grey-darken-3 mb-2 d-flex align-center">
                  <v-icon size="16" class="mr-1 text-primary">mdi-pound</v-icon>
                  Filtrar por Referencia
                </div>
                <v-text-field
                  v-model="filtrosTemp.numReferencia"
                  placeholder="Ej: REF-9871"
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                  autofocus
                  @keydown.enter="aplicarFiltroColumna('numReferencia')"
                />
                <div class="d-flex justify-end ga-2 mt-3">
                  <v-btn
                    size="small"
                    variant="text"
                    color="grey-darken-1"
                    class="text-none"
                    @click="limpiarFiltroColumna('numReferencia')"
                  >
                    Limpiar
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="flat"
                    color="primary"
                    class="text-none font-weight-bold"
                    @click="aplicarFiltroColumna('numReferencia')"
                  >
                    Aplicar
                  </v-btn>
                </div>
              </v-card>
            </v-menu>
          </div>
        </template>

        <!-- 8. ENCABEZADO: USUARIO -->
        <template #header.usuarioRegistro="{ column, isSorted, getSortIcon, toggleSort }">
          <div class="d-flex align-center justify-space-between w-100 ga-1">
            <span
              class="font-weight-bold cursor-pointer text-truncate"
              @click="toggleSort(column)"
            >
              {{ column.title }}
              <v-icon v-if="isSorted(column)" size="16">
                {{ getSortIcon(column) }}
              </v-icon>
            </span>

            <v-menu
              v-model="menusFiltros.usuarioRegistro"
              :close-on-content-click="false"
              location="bottom end"
              offset="6"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  size="x-small"
                  :color="filtros.usuarioRegistro ? 'primary' : 'grey-darken-1'"
                  class="filter-header-btn"
                  :class="{ 'filter-active': Boolean(filtros.usuarioRegistro) }"
                  @click.stop="abrirMenuFiltro('usuarioRegistro')"
                >
                  <v-icon size="15">
                    {{ filtros.usuarioRegistro ? 'mdi-filter' : 'mdi-filter-variant' }}
                  </v-icon>
                </v-btn>
              </template>

              <v-card min-width="260" class="border elevation-3 pa-3 rounded-lg">
                <div class="text-caption font-weight-bold text-grey-darken-3 mb-2 d-flex align-center">
                  <v-icon size="16" class="mr-1 text-primary">mdi-account-outline</v-icon>
                  Filtrar por Usuario
                </div>
                <v-autocomplete
                  v-model="filtrosTemp.usuarioRegistro"
                  :items="opcionesFiltro.usuarios"
                  placeholder="Seleccionar usuario..."
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                />
                <div class="d-flex justify-end ga-2 mt-3">
                  <v-btn
                    size="small"
                    variant="text"
                    color="grey-darken-1"
                    class="text-none"
                    @click="limpiarFiltroColumna('usuarioRegistro')"
                  >
                    Limpiar
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="flat"
                    color="primary"
                    class="text-none font-weight-bold"
                    @click="aplicarFiltroColumna('usuarioRegistro')"
                  >
                    Aplicar
                  </v-btn>
                </div>
              </v-card>
            </v-menu>
          </div>
        </template>

        <!-- ========================================== -->
        <!-- SLOTS DE CELDAS DE DATOS (ITEMS) -->
        <!-- ========================================== -->

        <!-- N° Comprobante -->
        <template #item.noComprobante="{ item }">
          <span class="font-weight-bold text-primary">
            #{{ item.noComprobante || item.idMovimiento }}
          </span>
        </template>

        <!-- Fecha y Hora -->
        <template #item.fechaMovimiento="{ item }">
          <div>
            <div class="font-weight-medium text-grey-darken-3">
              {{ item.fechaMovimientoFormateada }}
            </div>
            <div class="text-caption text-grey">
              {{ item.horaMovimientoFormateada }}
            </div>
          </div>
        </template>

        <!-- N° Factura -->
        <template #item.noFactura="{ item }">
          <v-chip
            v-if="item.noFactura"
            size="small"
            variant="tonal"
            color="primary"
            class="font-weight-medium"
          >
            {{ item.noFactura }}
          </v-chip>
          <span v-else class="text-grey">-</span>
        </template>

        <!-- Cliente -->
        <template #item.cliente="{ item }">
          <div>
            <div class="font-weight-medium text-grey-darken-3">
              {{ item.cliente }}
            </div>
            <div v-if="item.codigoCliente" class="text-caption text-grey">
              Cód: {{ item.codigoCliente }}
            </div>
          </div>
        </template>

        <!-- Ruta -->
        <template #item.rutaCliente="{ item }">
          <span class="text-body-2 text-grey-darken-2">
            {{ item.rutaCliente || '-' }}
          </span>
        </template>

        <!-- Modalidad -->
        <template #item.modalidad="{ item }">
          <v-chip
            size="small"
            variant="outlined"
            color="grey-darken-2"
            class="font-weight-medium"
          >
            {{ item.modalidad }}
          </v-chip>
        </template>

        <!-- N° Referencia -->
        <template #item.numReferencia="{ item }">
          <span class="text-caption text-grey-darken-2 font-mono">
            {{ item.numReferencia || '-' }}
          </span>
        </template>

        <!-- Monto Abonado -->
        <template #item.monto="{ item }">
          <span class="font-weight-bold text-success">
            {{ formatCurrency(item.monto) }}
          </span>
        </template>

        <!-- Saldo Resultante -->
        <template #item.saldoResultante="{ item }">
          <div v-if="Number(item.saldoResultante || 0) <= 0">
            <span class="text-caption font-weight-bold text-success mr-1">C$ 0.00</span>
            <v-chip size="x-small" color="success" variant="flat" class="font-weight-bold">
              Saldada
            </v-chip>
          </div>
          <div v-else>
            <span class="font-weight-bold text-grey-darken-3">
              {{ item.saldoResultanteFormateado || formatCurrency(item.saldoResultante) }}
            </span>
          </div>
        </template>

        <!-- Saldo Factura Actual -->
        <template #item.saldoFacturaActual="{ item }">
          <div v-if="item.facturaCancelada || Number(item.saldoFacturaActual || 0) <= 0">
            <v-chip size="x-small" color="success" variant="outlined" class="font-weight-medium">
              Saldada hoy
            </v-chip>
          </div>
          <div v-else>
            <span class="font-weight-medium text-error">
              {{ formatCurrency(item.saldoFacturaActual) }}
            </span>
          </div>
        </template>

        <!-- Usuario -->
        <template #item.usuarioRegistro="{ item }">
          <span class="text-caption text-grey-darken-2">
            {{ item.usuarioRegistro }}
          </span>
        </template>

        <!-- Acciones -->
        <template #item.acciones="{ item }">
          <div class="d-flex align-center justify-center ga-1">
            <v-tooltip text="Reimprimir en Impresora Térmica (POS-80C)" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-printer"
                  size="small"
                  variant="text"
                  color="green-darken-3"
                  :loading="printingId === (item.idAbonoCXC || item.idAbonoCxc || item.IdAbonoCXC)"
                  @click="reimprimirTicketDirecto(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip text="Ver detalle / Comprobante" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-receipt-text-outline"
                  size="small"
                  variant="text"
                  color="blue-grey-darken-2"
                  @click="abrirTicket(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>

        <!-- Estado vacío -->
        <template #no-data>
          <div class="py-8 text-center text-grey">
            <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-cash-remove</v-icon>
            <div class="text-body-1 font-weight-medium">No se encontraron abonos registrados</div>
            <div class="text-caption">Intenta ajustar o limpiar los filtros seleccionados</div>
            <v-btn
              v-if="totalFiltrosActivos > 0"
              size="small"
              variant="outlined"
              color="primary"
              class="mt-3 text-none"
              @click="limpiarTodosFiltros"
            >
              Limpiar todos los filtros
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- DIÁLOGO MODAL: VISTA PREVIA Y REIMPRESIÓN DE COMPROBANTE -->
    <v-dialog v-model="ticketModal" max-width="500" persistent>
      <v-card class="rounded-lg border bg-white">
        <!-- Encabezado del modal -->
        <div class="px-4 py-3 bg-white border-b d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon color="primary" size="22" class="mr-2">mdi-receipt-text-outline</v-icon>
            <span class="text-subtitle-1 font-weight-bold text-grey-darken-3">
              Comprobante de Abono #{{ ticketActual?.noComprobante || ticketActual?.idMovimiento }}
            </span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="ticketModal = false" />
        </div>

        <!-- Contenido del Comprobante -->
        <v-card-text class="pa-4">
          <div v-if="ticketActual" class="ticket-preview pa-4 border rounded bg-grey-lighten-5">
            <!-- Datos de la empresa -->
            <div class="text-center pb-2 border-b">
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                {{ ticketActual.empresa?.nombre || 'COMPROBANTE DE PAGO' }}
              </div>
              <div class="text-caption text-grey">
                {{ ticketActual.empresa?.direccion || '' }}
              </div>
              <div v-if="ticketActual.empresa?.telefono" class="text-caption text-grey">
                Tel: {{ ticketActual.empresa.telefono }}
              </div>
              <div v-if="ticketActual.empresa?.ruc" class="text-caption text-grey">
                RUC: {{ ticketActual.empresa.ruc }}
              </div>
            </div>

            <!-- Datos generales -->
            <div class="py-2 text-caption border-b">
              <div class="d-flex justify-space-between">
                <span><strong>Fecha:</strong> {{ ticketActual.fechaFormateada }} {{ ticketActual.horaFormateada }}</span>
                <span><strong>Modalidad:</strong> {{ ticketActual.modalidad }}</span>
              </div>
              <div><strong>Cliente:</strong> {{ ticketActual.cliente?.nombre }}</div>
              <div v-if="ticketActual.cliente?.direccion">
                <strong>Dirección:</strong> {{ ticketActual.cliente.direccion }}
              </div>
              <div v-if="ticketActual.numReferencia">
                <strong>Referencia:</strong> {{ ticketActual.numReferencia }}
              </div>
              <div><strong>Registrado por:</strong> {{ ticketActual.usuarioRegistro }}</div>
            </div>

            <!-- Detalle de la factura abonada -->
            <div class="py-2 border-b">
              <div class="text-caption font-weight-bold mb-1 text-grey-darken-3">
                Factura Abonada:
              </div>
              <div class="d-flex justify-space-between text-caption py-1">
                <span>N° Factura:</span>
                <span class="font-weight-bold">{{ ticketActual.credito?.noFactura || 'N/A' }}</span>
              </div>
              <div class="d-flex justify-space-between text-caption py-1">
                <span>Total Facturado:</span>
                <span>{{ ticketActual.credito?.totalFacturadoFormateado || formatCurrency(ticketActual.credito?.totalFacturado || 0) }}</span>
              </div>
              <div class="d-flex justify-space-between text-caption py-1">
                <span>Saldo Anterior:</span>
                <span>{{ ticketActual.saldoAnteriorFormateado || formatCurrency(ticketActual.saldoAnterior || 0) }}</span>
              </div>
              <div class="d-flex justify-space-between text-caption py-1 font-weight-bold text-primary">
                <span>MONTO ABONADO:</span>
                <span>{{ ticketActual.montoAbonadoFormateado || formatCurrency(ticketActual.montoAbonado || 0) }}</span>
              </div>
              <div class="d-flex justify-space-between text-caption py-1 font-weight-bold text-grey-darken-3">
                <span>Saldo Resultante:</span>
                <span>{{ ticketActual.saldoResultanteFormateado || ticketActual.saldoActualFormateado || formatCurrency(ticketActual.saldoResultante ?? ticketActual.saldoActual ?? 0) }}</span>
              </div>
              <div class="d-flex justify-space-between text-caption py-1">
                <span>Estado Crédito:</span>
                <span :class="ticketActual.cancelado ? 'text-success font-weight-bold' : 'text-warning font-weight-bold'">
                  {{ ticketActual.cancelado ? 'SALDADA' : 'PENDIENTE' }}
                </span>
              </div>
            </div>

            <!-- Pie de comprobante -->
            <div class="pt-3 text-center text-caption text-grey">
              ¡Gracias por su pago!
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <!-- Acciones del modal -->
        <v-card-actions class="pa-3 bg-white d-flex flex-wrap justify-end ga-2">
          <v-btn
            variant="outlined"
            color="grey-darken-1"
            class="text-none"
            @click="ticketModal = false"
          >
            Cerrar
          </v-btn>
          <v-btn
            variant="outlined"
            color="grey-darken-3"
            prepend-icon="mdi-printer-outline"
            class="text-none"
            @click="imprimirTicketNavegador"
          >
            Imprimir Navegador
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-printer"
            class="text-none font-weight-bold"
            :loading="loadingTicket"
            @click="imprimirTicketTermico(true)"
          >
            Reimprimir en POS-80C
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <OverlayComp :show="exportando || loadingTicket" />
  </div>
</template>

<script>
import { httpGet, httpPost } from '@/scripts/api.js'
import { useSnackbar } from '@/composables/use-snackbar.js'
import { formatters } from '@/helpers/formatters.js'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import OverlayComp from '@/components/reutilizable/OverlayComp.vue'

export default {
  name: 'ControlAbonos',

  components: {
    OverlayComp
  },

  data() {
    return {
      snackbar: useSnackbar(),
      loading: false,
      exportando: false,
      loadingTicket: false,

      // Paginación y ordenamiento server-side
      page: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalRecaudado: 0,
      sortBy: [{ key: 'fechaMovimiento', order: 'desc' }],
      items: [],

      // Columnas de la tabla
      headers: [
        { title: 'N° Comprobante', key: 'noComprobante', align: 'start', sortable: true, width: '135px' },
        { title: 'Fecha', key: 'fechaMovimiento', align: 'start', sortable: true, width: '130px' },
        { title: 'N° Factura', key: 'noFactura', align: 'start', sortable: true, width: '130px' },
        { title: 'Cliente', key: 'cliente', align: 'start', sortable: true, minWidth: '220px' },
        { title: 'Ruta', key: 'rutaCliente', align: 'start', sortable: true, width: '125px' },
        { title: 'Modalidad', key: 'modalidad', align: 'start', sortable: true, width: '125px' },
        { title: 'N° Referencia', key: 'numReferencia', align: 'start', sortable: true, width: '135px' },
        { title: 'Monto', key: 'monto', align: 'end', sortable: true, width: '125px' },
        { title: 'Saldo Resultante', key: 'saldoResultante', align: 'end', sortable: true, width: '145px' },
        { title: 'Saldo Actual', key: 'saldoFacturaActual', align: 'end', sortable: false, width: '130px' },
        { title: 'Usuario', key: 'usuarioRegistro', align: 'start', sortable: true, width: '115px' },
        { title: 'Acciones', key: 'acciones', align: 'center', sortable: false, width: '90px' }
      ],

      // Opciones cargadas para selects/autocompletes
      opcionesFiltro: {
        rutas: [],
        modalidades: [],
        usuarios: []
      },

      // Visibilidad de menús de filtros por columna
      menusFiltros: {
        fechaMovimiento: false,
        noFactura: false,
        cliente: false,
        rutaCliente: false,
        modalidad: false,
        numReferencia: false,
        usuarioRegistro: false
      },

      // Filtros aplicados a la consulta
      filtros: {
        noFactura: null,
        cliente: null,
        rutaCliente: null,
        idModalidad: null,
        modalidadTexto: null,
        numReferencia: null,
        usuarioRegistro: null,
        fechaDesde: null,
        fechaHasta: null
      },

      // Filtros temporales mientras el usuario interactúa con el popover
      filtrosTemp: {
        noFactura: null,
        cliente: null,
        rutaCliente: null,
        idModalidad: null,
        numReferencia: null,
        usuarioRegistro: null,
        fechaDesde: null,
        fechaHasta: null
      },

      // Modal del ticket
      ticketModal: false,
      ticketActual: null,
      printingId: null
    }
  },

  computed: {
    totalFiltrosActivos() {
      let count = 0
      if (this.filtros.noFactura) count++
      if (this.filtros.cliente) count++
      if (this.filtros.rutaCliente) count++
      if (this.filtros.idModalidad) count++
      if (this.filtros.numReferencia) count++
      if (this.filtros.usuarioRegistro) count++
      if (this.filtros.fechaDesde || this.filtros.fechaHasta) count++
      return count
    }
  },

  mounted() {
    this.cargarOpcionesFiltro()
  },

  methods: {
    formatCurrency(val) {
      return formatters.formatCurrency(val || 0)
    },

    async cargarOpcionesFiltro() {
      try {
        const res = await httpGet('api/creditos/abonos/opciones-filtro')
        if (res) {
          this.opcionesFiltro = {
            rutas: res.rutas || [],
            modalidades: res.modalidades || [],
            usuarios: res.usuarios || []
          }
        }
      } catch (err) {
        console.warn('Error al cargar opciones de filtro:', err)
      }
    },

    cargarTabla({ page, itemsPerPage, sortBy }) {
      this.page = page
      this.itemsPerPage = itemsPerPage
      if (sortBy && sortBy.length > 0) {
        this.sortBy = sortBy
      }
      this.fetchAbonos()
    },

    async fetchAbonos() {
      this.loading = true
      try {
        const sort = this.sortBy && this.sortBy[0] ? this.sortBy[0] : { key: 'fechaMovimiento', order: 'desc' }
        const payload = {
          page: this.page,
          itemsPerPage: this.itemsPerPage,
          sortBy: sort.key || 'fechaMovimiento',
          sortOrder: sort.order || 'desc',
          noFactura: this.filtros.noFactura || null,
          cliente: this.filtros.cliente || null,
          rutaCliente: this.filtros.rutaCliente || null,
          idModalidad: this.filtros.idModalidad || null,
          numReferencia: this.filtros.numReferencia || null,
          usuarioRegistro: this.filtros.usuarioRegistro || null,
          fechaDesde: this.filtros.fechaDesde || null,
          fechaHasta: this.filtros.fechaHasta || null
        }



        const res = await httpPost('api/creditos/abonos/consulta-paginada', payload)
        const data = res.data || {}

        this.items = data.items || []
        this.totalItems = data.totalItems || 0
        this.totalRecaudado = data.totalRecaudado || 0
      } catch (err) {
        console.error('Error al consultar abonos:', err)
        this.snackbar.notify('error', 'Error al obtener la lista de abonos.')
      } finally {
        this.loading = false
      }
    },

    abrirMenuFiltro(colKey) {
      if (colKey === 'fechaMovimiento') {
        this.filtrosTemp.fechaDesde = this.filtros.fechaDesde
        this.filtrosTemp.fechaHasta = this.filtros.fechaHasta
      } else {
        this.filtrosTemp[colKey] = this.filtros[colKey]
      }
    },

    aplicarFiltroColumna(colKey) {
      if (colKey === 'fechaMovimiento') {
        this.filtros.fechaDesde = this.filtrosTemp.fechaDesde || null
        this.filtros.fechaHasta = this.filtrosTemp.fechaHasta || null
      } else if (colKey === 'modalidad') {
        this.filtros.idModalidad = this.filtrosTemp.idModalidad || null
        if (this.filtros.idModalidad) {
          const mod = this.opcionesFiltro.modalidades.find(m => m.idModalidad === this.filtros.idModalidad)
          this.filtros.modalidadTexto = mod ? mod.nombre : `Modalidad ${this.filtros.idModalidad}`
        } else {
          this.filtros.modalidadTexto = null
        }
      } else {
        this.filtros[colKey] = this.filtrosTemp[colKey] ? String(this.filtrosTemp[colKey]).trim() : null
      }

      this.menusFiltros[colKey] = false
      this.page = 1
      this.fetchAbonos()
    },

    limpiarFiltroColumna(colKey) {
      if (colKey === 'fechaMovimiento') {
        this.filtrosTemp.fechaDesde = null
        this.filtrosTemp.fechaHasta = null
        this.filtros.fechaDesde = null
        this.filtros.fechaHasta = null
      } else if (colKey === 'modalidad') {
        this.filtrosTemp.idModalidad = null
        this.filtros.idModalidad = null
        this.filtros.modalidadTexto = null
      } else {
        this.filtrosTemp[colKey] = null
        this.filtros[colKey] = null
      }

      this.menusFiltros[colKey] = false
      this.page = 1
      this.fetchAbonos()
    },

    removerFiltro(colKey) {
      this.limpiarFiltroColumna(colKey)
    },

    limpiarTodosFiltros() {
      this.filtros = {
        noFactura: null,
        cliente: null,
        rutaCliente: null,
        idModalidad: null,
        modalidadTexto: null,
        numReferencia: null,
        usuarioRegistro: null,
        fechaDesde: null,
        fechaHasta: null
      }
      this.filtrosTemp = { ...this.filtros }
      this.page = 1
      this.fetchAbonos()
    },

    setRangoFechaRapido(tipo) {
      const hoy = new Date()
      const formatYMD = (d) => d.toISOString().slice(0, 10)

      if (tipo === 'hoy') {
        const ymd = formatYMD(hoy)
        this.filtrosTemp.fechaDesde = ymd
        this.filtrosTemp.fechaHasta = ymd
      } else if (tipo === 'mes') {
        const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        this.filtrosTemp.fechaDesde = formatYMD(primerDia)
        this.filtrosTemp.fechaHasta = formatYMD(hoy)
      } else if (tipo === 'anio') {
        const primerDia = new Date(hoy.getFullYear(), 0, 1)
        this.filtrosTemp.fechaDesde = formatYMD(primerDia)
        this.filtrosTemp.fechaHasta = formatYMD(hoy)
      }
    },

    async abrirTicket(item) {
      this.loadingTicket = true
      try {
        const res = await httpGet(`api/creditos/abonos/${item.idAbonoCXC}/ticket`)
        this.ticketActual = res.data || res
        this.ticketModal = true
      } catch (err) {
        console.error('Error al obtener datos del ticket:', err)
        this.snackbar.notify('error', 'No se pudieron cargar los datos del comprobante.')
      } finally {
        this.loadingTicket = false
      }
    },

    async reimprimirTicketDirecto(item) {
      const idAbono = item.idAbonoCXC || item.idAbonoCxc || item.IdAbonoCXC
      if (!idAbono) {
        this.snackbar.notify('warning', 'Este registro no tiene un ID de comprobante asociado.')
        return
      }

      this.printingId = idAbono
      try {
        const res = await httpGet(`api/creditos/abonos/${idAbono}/ticket`)
        const ticketData = res.data || res
        if (!ticketData) {
          throw new Error('No se obtuvieron datos del comprobante.')
        }

        this.ticketActual = ticketData
        await this.imprimirTicketTermico(true)
      } catch (err) {
        console.error('Error al reimprimir comprobante:', err)
        this.snackbar.notify('warning', 'No se pudo reimprimir directamente en POS-80C. Abriendo comprobante.')
        this.ticketModal = true
      } finally {
        this.printingId = null
      }
    },

    lineaDosColsTexto(izquierda, derecha, ancho = 42) {
      const izq = String(izquierda || '')
      const der = String(derecha || '')
      const espacio = ancho - izq.length - der.length
      return espacio > 0
        ? izq + ' '.repeat(espacio) + der + '\n'
        : izq.slice(0, Math.max(0, ancho - der.length - 1)) + ' ' + der + '\n'
    },

    generarTextoTicket(ticketData = null, esReimpresion = true) {
      const target = ticketData || this.ticketActual
      if (!target) return ''

      const NEGOCIO = {
        nombre: target.empresa?.nombre || "Migdalia's Market",
        direccion: target.empresa?.direccion || 'Mercado Mayoreo Modulo #4',
        telefono: target.empresa?.telefono || '2263-2783'
      }

      const ANCHO = 42
      const separador = '-'.repeat(ANCHO) + '\n'

      let t = ''
      t += `${NEGOCIO.nombre.padStart(Math.floor((ANCHO + NEGOCIO.nombre.length) / 2))}\n`
      if (NEGOCIO.direccion) t += `${NEGOCIO.direccion.padStart(Math.floor((ANCHO + NEGOCIO.direccion.length) / 2))}\n`
      if (NEGOCIO.telefono) t += `${('Tel: ' + NEGOCIO.telefono).padStart(Math.floor((ANCHO + ('Tel: ' + NEGOCIO.telefono).length) / 2))}\n`
      t += separador
      t += `${'COMPROBANTE DE ABONO'.padStart(Math.floor((ANCHO + 20) / 2))}\n`
      if (esReimpresion) {
        t += `${'*** REIMPRESIÓN ***'.padStart(Math.floor((ANCHO + 19) / 2))}\n`
        t += `Reimpreso: ${new Date().toLocaleString()}\n`
      }
      t += separador
      t += `Comprobante: #${target.noComprobante || target.idMovimiento || 'N/A'}\n`
      t += `Fecha:       ${target.fechaFormateada}  Hora: ${target.horaFormateada}\n`
      t += `Cliente:     ${target.cliente?.nombre || 'General'}\n`
      if (target.cliente?.codigo) t += `Código Cli:  ${target.cliente.codigo}\n`
      t += `Modalidad:   ${target.modalidad || 'Efectivo'}\n`
      if (target.numReferencia) t += `Referencia:  ${target.numReferencia}\n`
      if (target.usuarioRegistro) t += `Usuario:     ${target.usuarioRegistro}\n`
      t += separador
      t += 'DETALLE DEL ABONO:\n'
      t += `Factura N°:  ${target.credito?.noFactura || 'N/A'}\n`
      t += this.lineaDosColsTexto('Total Factura:', target.credito?.totalFacturadoFormateado || '')
      t += this.lineaDosColsTexto('Saldo Anterior:', target.saldoAnteriorFormateado || '')
      t += this.lineaDosColsTexto('MONTO ABONADO:', target.montoAbonadoFormateado || '')
      t += this.lineaDosColsTexto('Saldo Resultante:', target.saldoResultanteFormateado || target.saldoActualFormateado || '')
      t += this.lineaDosColsTexto('Estado Factura:', target.cancelado ? 'SALDADA' : 'PENDIENTE')
      t += separador
      if (target.observaciones) {
        t += `Obs: ${target.observaciones}\n`
        t += separador
      }
      t += '\n' + `${'¡Gracias por su pago!'.padStart(Math.floor((ANCHO + 21) / 2))}\n\n`
      return t
    },

    imprimirTicketNavegador() {
      const contenido = this.generarTextoTicket(this.ticketActual, true)
      const win = window.open('', '_blank', 'width=450,height=600')
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Comprobante de Abono</title>
              <style>
                body {
                  font-family: 'Courier New', Courier, monospace;
                  font-size: 12px;
                  margin: 10px;
                  white-space: pre;
                  color: #000;
                }
              </style>
            </head>
            <body>${contenido}</body>
          </html>
        `)
        win.document.close()
        win.focus()
        setTimeout(() => {
          win.print()
          win.close()
        }, 300)
      }
    },

    async imprimirTicketTermico(esReimpresion = true) {
      if (!this.ticketActual) return

      try {
        const qz = window.qz
        if (!qz) {
          this.snackbar.notify('warning', 'QZ Tray no está disponible en la ventana. Abriendo comprobante.')
          this.ticketModal = true
          return
        }

        if (!qz.websocket.isActive()) {
          await qz.websocket.connect()
        }
        const nombreImpresora = await qz.printers.find('POS-80C')
        const config = qz.configs.create(nombreImpresora)

        const ANCHO = 42
        const separador = '-'.repeat(ANCHO) + '\n'
        const lineaDosCols = (izq, der) => {
          izq = String(izq || '')
          der = String(der || '')
          const espacio = ANCHO - izq.length - der.length
          return espacio > 0 ? izq + ' '.repeat(espacio) + der + '\n' : izq.slice(0, Math.max(0, ANCHO - der.length - 1)) + ' ' + der + '\n'
        }

        const rawData = [
          '\x1B\x40',             // init
          '\x1B\x61\x01',         // centrar
          '\x1B\x21\x10',         // doble altura
          '\x1B\x45\x01',         // negrita ON
          `${this.ticketActual.empresa?.nombre || "Migdalia's Market"}\n`,
          '\x1B\x45\x00',         // negrita OFF
          '\x1B\x21\x00',         // normal
          this.ticketActual.empresa?.direccion ? `${this.ticketActual.empresa.direccion}\n` : '',
          this.ticketActual.empresa?.telefono ? `Tel: ${this.ticketActual.empresa.telefono}\n` : '',
          this.ticketActual.empresa?.ruc ? `RUC: ${this.ticketActual.empresa.ruc}\n` : '',
          separador,

          '\x1B\x45\x01',
          'COMPROBANTE DE ABONO\n',
          esReimpresion ? '*** REIMPRESIÓN ***\n' : '',
          '\x1B\x45\x00',
          '\x1B\x61\x00',         // izquierda
          `Comprobante: #${this.ticketActual.noComprobante || this.ticketActual.idMovimiento || 'N/A'}\n`,
          `Fecha:       ${this.ticketActual.fechaFormateada}  Hora: ${this.ticketActual.horaFormateada}\n`,
          `Cliente:     ${this.ticketActual.cliente?.nombre || 'General'}\n`,
          this.ticketActual.cliente?.codigo ? `Código Cli:  ${this.ticketActual.cliente.codigo}\n` : '',
          `Modalidad:   ${this.ticketActual.modalidad || 'Efectivo'}\n`,
          this.ticketActual.numReferencia ? `Referencia:  ${this.ticketActual.numReferencia}\n` : '',
          this.ticketActual.usuarioRegistro ? `Usuario:     ${this.ticketActual.usuarioRegistro}\n` : '',
          esReimpresion ? `Reimpreso:   ${new Date().toLocaleString()}\n` : '',
          separador,

          '\x1B\x45\x01',
          'DETALLE DEL ABONO:\n',
          '\x1B\x45\x00',
          `Factura N°:  ${this.ticketActual.credito?.noFactura || 'N/A'}\n`,
          lineaDosCols('Total Factura:', this.ticketActual.credito?.totalFacturadoFormateado || ''),
          lineaDosCols('Saldo Anterior:', this.ticketActual.saldoAnteriorFormateado || ''),
          '\x1B\x45\x01',
          lineaDosCols('MONTO ABONADO:', this.ticketActual.montoAbonadoFormateado || ''),
          '\x1B\x45\x00',
          lineaDosCols('Saldo Resultante:', this.ticketActual.saldoResultanteFormateado || this.ticketActual.saldoActualFormateado || ''),
          lineaDosCols('Estado Factura:', this.ticketActual.cancelado ? 'SALDADA' : 'PENDIENTE'),
          separador,

          this.ticketActual.observaciones ? `Obs: ${this.ticketActual.observaciones}\n${separador}` : '',

          '\x1B\x61\x01',         // centrar
          '¡Gracias por su pago!\n\n\n\n\n',
          '\x1D\x56\x00'          // corte
        ]

        await qz.print(config, rawData)
        this.snackbar.notify('success', esReimpresion ? 'Reimpresión enviada a POS-80C exitosamente.' : 'Comprobante impreso exitosamente.')
      } catch (err) {
        console.error('Error al imprimir comprobante en POS-80C:', err)
        this.snackbar.notify('warning', 'No se pudo imprimir en POS-80C. Abriendo comprobante.')
        this.ticketModal = true
      }
    },

    async exportarExcel() {
      if (this.totalItems === 0) {
        this.snackbar.notify('warning', 'No hay registros para exportar.')
        return
      }

      this.exportando = true
      try {
        const sort = this.sortBy && this.sortBy[0] ? this.sortBy[0] : { key: 'fechaMovimiento', order: 'desc' }
        const payload = {
          page: 1,
          itemsPerPage: Math.min(this.totalItems, 5000),
          sortBy: sort.key || 'fechaMovimiento',
          sortOrder: sort.order || 'desc',
          noFactura: this.filtros.noFactura || null,
          cliente: this.filtros.cliente || null,
          rutaCliente: this.filtros.rutaCliente || null,
          idModalidad: this.filtros.idModalidad || null,
          numReferencia: this.filtros.numReferencia || null,
          usuarioRegistro: this.filtros.usuarioRegistro || null,
          fechaDesde: this.filtros.fechaDesde || null,
          fechaHasta: this.filtros.fechaHasta || null
        }

        const res = await httpPost('api/creditos/abonos/consulta-paginada', payload)
        const dataExport = res.data?.items || []

        const workbook = new ExcelJS.Workbook()
        workbook.creator = 'DevoDigital - SI Tokes'
        workbook.created = new Date()

        const ws = workbook.addWorksheet('Control de Abonos', {
          views: [{ showGridLines: true }]
        })

        // Título del reporte
        ws.mergeCells('A1:L1')
        const titleCell = ws.getCell('A1')
        titleCell.value = 'REPORTE GENERAL DE CONTROL DE ABONOS'
        titleCell.font = { name: 'Calibri', size: 15, bold: true, color: { argb: 'FFFFFFFF' } }
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F52BA' } }
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
        ws.getRow(1).height = 30

        // Subtítulo con metadatos
        ws.mergeCells('A2:L2')
        const metaCell = ws.getCell('A2')
        const fechaGeneracion = new Date().toLocaleString()
        metaCell.value = `Generado el: ${fechaGeneracion} | Total Registros: ${dataExport.length} | Total Recaudado: C$ ${Number(res.data?.totalRecaudado || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        metaCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF475569' } }
        metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }
        metaCell.alignment = { horizontal: 'center', vertical: 'middle' }
        ws.getRow(2).height = 22

        ws.addRow([]) // Fila vacía

        // Anchos de columna
        ws.columns = [
          { key: 'noComprobante', width: 16 },
          { key: 'fecha', width: 14 },
          { key: 'hora', width: 12 },
          { key: 'noFactura', width: 16 },
          { key: 'cliente', width: 30 },
          { key: 'ruta', width: 18 },
          { key: 'modalidad', width: 16 },
          { key: 'referencia', width: 18 },
          { key: 'monto', width: 18 },
          { key: 'saldoResultante', width: 18 },
          { key: 'saldoActual', width: 18 },
          { key: 'usuario', width: 16 }
        ]

        // Fila de encabezados de la tabla
        const headerRow = ws.addRow([
          'N° Comprobante',
          'Fecha',
          'Hora',
          'N° Factura',
          'Cliente',
          'Ruta',
          'Modalidad',
          'N° Referencia',
          'Monto Abonado',
          'Saldo Resultante',
          'Saldo Factura Actual',
          'Usuario'
        ])
        headerRow.height = 24
        headerRow.eachCell((cell) => {
          cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            bottom: { style: 'medium', color: { argb: 'FF0F52BA' } },
            left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
          }
        })

        // Llenado de filas
        let totalSumaMonto = 0
        dataExport.forEach((item, index) => {
          totalSumaMonto += Number(item.monto || 0)
          const row = ws.addRow([
            item.noComprobante || item.idMovimiento,
            item.fechaMovimientoFormateada || '',
            item.horaMovimientoFormateada || '',
            item.noFactura || '',
            item.cliente || '',
            item.rutaCliente || 'N/A',
            item.modalidad || '',
            item.numReferencia || '',
            Number(item.monto || 0),
            Number(item.saldoResultante || 0),
            Number(item.saldoFacturaActual || 0),
            item.usuarioRegistro || ''
          ])
          row.height = 20

          const isEven = index % 2 === 0
          const bgColor = isEven ? 'FFFFFFFF' : 'FFF8FAFC'

          row.eachCell((cell, colNumber) => {
            cell.font = { name: 'Calibri', size: 10 }
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
            cell.border = {
              bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            }

            if (colNumber === 9 || colNumber === 10 || colNumber === 11) {
              cell.numFmt = '"C$"#,##0.00'
              cell.alignment = { horizontal: 'right', vertical: 'middle' }
            } else if (colNumber === 1 || colNumber === 2 || colNumber === 3) {
              cell.alignment = { horizontal: 'center', vertical: 'middle' }
            } else {
              cell.alignment = { horizontal: 'left', vertical: 'middle' }
            }
          })
        })

        // Fila Totalizadora
        const totalRow = ws.addRow([
          'TOTAL GENERAL', '', '', '', '', '', '', '',
          totalSumaMonto, '', '', ''
        ])
        totalRow.height = 24
        totalRow.eachCell((cell, colNumber) => {
          cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF0F52BA' } }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF94A3B8' } },
            bottom: { style: 'double', color: { argb: 'FF0F52BA' } }
          }
          if (colNumber === 9) {
            cell.numFmt = '"C$"#,##0.00'
            cell.alignment = { horizontal: 'right', vertical: 'middle' }
          }
        })

        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const fechaArchivo = new Date().toISOString().slice(0, 10)
        saveAs(blob, `Control_Abonos_${fechaArchivo}.xlsx`)
        this.snackbar.notify('success', 'Archivo Excel generado y descargado exitosamente.')
      } catch (err) {
        console.error('Error al exportar a Excel:', err)
        this.snackbar.notify('error', 'Error al exportar el archivo Excel.')
      } finally {
        this.exportando = false
      }
    }
  }
}
</script>

<style scoped>
.control-abonos-page {
  font-family: inherit;
}

.leading-tight {
  line-height: 1.2;
}

.line-height-1 {
  line-height: 1;
}

/* Botón de filtro en el encabezado estilo Excel */
.filter-header-btn {
  opacity: 0.7;
  transition: opacity 0.2s, background-color 0.2s;
  border-radius: 4px;
}

.filter-header-btn:hover {
  opacity: 1;
  background-color: rgba(15, 82, 186, 0.08);
}

.filter-header-btn.filter-active {
  opacity: 1;
  background-color: rgba(15, 82, 186, 0.15);
}

.font-mono {
  font-family: monospace;
}

.ticket-preview {
  font-family: 'Courier New', Courier, monospace;
}

:deep(.control-abonos-table thead th) {
  font-size: 0.82rem !important;
  color: #334155 !important;
  background-color: #f8fafc !important;
  border-bottom: 2px solid #e2e8f0 !important;
  white-space: nowrap;
}

:deep(.control-abonos-table tbody tr:hover) {
  background-color: #f1f5f9 !important;
}
</style>
