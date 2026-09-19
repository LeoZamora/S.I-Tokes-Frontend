<template>
  <div class="estados-cuenta-view w-100 pa-4">
    <!-- HEADER COMPACTO Y SIMPLE -->
    <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-3">
      <div class="d-flex align-center">
        <v-icon color="indigo-darken-4" size="24" class="mr-2">mdi-account-cash</v-icon>
        <div>
          <div class="d-flex align-center ga-2">
            <h1 class="text-h6 font-weight-bold text-grey-darken-4 mb-0">Estados de Cuenta de Cajas</h1>
            <v-chip size="x-small" color="indigo" variant="tonal" class="font-weight-bold">
              Auditoría y Rendimiento
            </v-chip>
          </div>
          <span class="text-caption text-grey-darken-1 d-block" style="font-size: 11px;">
            Consolidación de arqueos, liquidaciones, sobrantes y faltantes por cajero y caja
          </span>
        </div>
      </div>

      <div class="d-flex align-center ga-2">
        <v-btn
          prepend-icon="mdi-printer"
          color="indigo-darken-4"
          variant="flat"
          size="small"
          class="text-white font-weight-bold text-none rounded-lg"
          :disabled="loading || items.length === 0"
          @click="imprimirPdfGeneral()"
        >
          Imprimir PDF
        </v-btn>
        <v-btn
          prepend-icon="mdi-file-excel"
          color="green-darken-3"
          variant="flat"
          size="small"
          class="text-white font-weight-bold text-none rounded-lg"
          :disabled="loading || items.length === 0"
          @click="exportToExcel()"
        >
          Exportar Excel
        </v-btn>
        <v-btn
          icon="mdi-refresh"
          variant="text"
          size="small"
          color="grey-darken-3"
          title="Recargar datos"
          :loading="loading"
          @click="loadEstadoCuenta()"
        />
      </div>
    </div>

    <!-- PANEL DE FILTROS SUPERIOR (FECHAS Y CONSULTA) -->
    <v-card elevation="1" class="rounded-xl pa-3 mb-4 bg-white border">
      <div class="d-flex align-center justify-space-between mb-2 flex-wrap ga-2">
        <div class="text-subtitle-2 font-weight-bold text-indigo-darken-4 d-flex align-center">
          <v-icon size="18" class="mr-1.5" color="indigo">mdi-calendar-range</v-icon>
          Rango de Fechas
        </div>
        <!-- Presets de Fecha Rápida -->
        <div class="d-flex align-center ga-1 flex-wrap">
          <span class="text-caption text-grey-darken-1 mr-1 font-weight-medium">Rango Rápido:</span>
          <v-chip
            v-for="p in presetsFecha"
            :key="p.label"
            size="x-small"
            :color="activePreset === p.label ? 'indigo' : 'grey-lighten-2'"
            :variant="activePreset === p.label ? 'flat' : 'outlined'"
            :class="activePreset === p.label ? 'text-white font-weight-bold' : 'text-grey-darken-3'"
            class="cursor-pointer"
            @click="applyPreset(p)"
          >
            {{ p.label }}
          </v-chip>
        </div>
      </div>

      <v-row dense align="center">
        <!-- Fecha Desde -->
        <v-col cols="12" sm="5" md="4">
          <v-text-field
            v-model="filters.desde"
            label="Fecha Desde"
            type="date"
            density="compact"
            variant="outlined"
            color="indigo"
            hide-details
            prepend-inner-icon="mdi-calendar-start"
            @change="activePreset = null"
          />
        </v-col>

        <!-- Fecha Hasta -->
        <v-col cols="12" sm="5" md="4">
          <v-text-field
            v-model="filters.hasta"
            label="Fecha Hasta"
            type="date"
            density="compact"
            variant="outlined"
            color="indigo"
            hide-details
            prepend-inner-icon="mdi-calendar-end"
            @change="activePreset = null"
          />
        </v-col>

        <!-- Botón Aplicar Filtros -->
        <v-col cols="12" sm="2" md="4">
          <v-btn
            block
            color="indigo-darken-4"
            variant="flat"
            class="text-white font-weight-bold text-none rounded-lg"
            prepend-icon="mdi-magnify"
            :loading="loading"
            @click="loadEstadoCuenta()"
          >
            Consultar Rango
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- CARDS DE RESUMEN EJECUTIVO (KPIS) -->
    <v-row dense class="mb-4">
      <!-- Total Sesiones -->
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-3 rounded-xl elevation-1 bg-white border h-100 hover-card">
          <div class="d-flex align-center justify-space-between mb-1">
            <span class="text-caption text-grey-darken-1 font-weight-bold">Sesiones Evaluadas</span>
            <v-avatar color="indigo-lighten-5" size="32">
              <v-icon color="indigo" size="18">mdi-history</v-icon>
            </v-avatar>
          </div>
          <div class="text-h5 font-weight-black text-indigo-darken-4">
            {{ resumen.totalCierres }}
          </div>
          <div class="d-flex align-center ga-1 mt-1 flex-wrap">
            <v-chip size="x-small" color="indigo" variant="tonal" class="font-weight-bold">
              {{ resumen.cantidadCuadradas }} Cuadradas
            </v-chip>
            <v-chip size="x-small" color="success" variant="tonal" class="font-weight-bold">
              {{ resumen.cantidadSobrantes }} Sobrantes
            </v-chip>
            <v-chip size="x-small" color="error" variant="tonal" class="font-weight-bold">
              {{ resumen.cantidadFaltantes }} Faltantes
            </v-chip>
          </div>
        </v-card>
      </v-col>

      <!-- Total Facturado en Ventas -->
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-3 rounded-xl elevation-1 bg-white border h-100 hover-card">
          <div class="d-flex align-center justify-space-between mb-1">
            <span class="text-caption text-grey-darken-1 font-weight-bold">Total Facturado</span>
            <v-avatar color="green-lighten-5" size="32">
              <v-icon color="green-darken-3" size="18">mdi-cash-register</v-icon>
            </v-avatar>
          </div>
          <div class="text-h5 font-weight-black text-green-darken-4">
            {{ formatCurrency(resumen.totalVentas) }}
          </div>
          <div class="text-caption text-grey-darken-2 mt-1">
            Retiros: <strong class="text-orange-darken-4">{{ formatCurrency(resumen.totalRetiros) }}</strong>
          </div>
        </v-card>
      </v-col>

      <!-- Total Dinero Contado vs Esperado -->
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-3 rounded-xl elevation-1 bg-white border h-100 hover-card">
          <div class="d-flex align-center justify-space-between mb-1">
            <span class="text-caption text-grey-darken-1 font-weight-bold">Efectivo Físico Contado</span>
            <v-avatar color="blue-grey-lighten-5" size="32">
              <v-icon color="blue-grey-darken-3" size="18">mdi-calculator-variant</v-icon>
            </v-avatar>
          </div>
          <div class="text-h5 font-weight-black text-blue-grey-darken-4">
            {{ formatCurrency(resumen.totalContado) }}
          </div>
          <div class="text-caption text-grey-darken-2 mt-1">
            Esperado: <strong class="text-indigo-darken-3">{{ formatCurrency(resumen.totalEsperado) }}</strong>
          </div>
        </v-card>
      </v-col>

      <!-- Balance Neto y Diferencias -->
      <v-col cols="12" sm="6" md="3">
        <v-card
          class="pa-3 rounded-xl elevation-1 border h-100 hover-card"
          :class="resumen.diferenciaNeta >= 0 ? (resumen.diferenciaNeta === 0 ? 'bg-indigo-lighten-5 border-indigo' : 'bg-green-lighten-5 border-green') : 'bg-red-lighten-5 border-red'"
        >
          <div class="d-flex align-center justify-space-between mb-1">
            <span class="text-caption font-weight-bold" :class="resumen.diferenciaNeta >= 0 ? (resumen.diferenciaNeta === 0 ? 'text-indigo-darken-4' : 'text-green-darken-4') : 'text-red-darken-4'">
              Balance Neto (Diferencia)
            </span>
            <v-avatar :color="resumen.diferenciaNeta >= 0 ? (resumen.diferenciaNeta === 0 ? 'indigo' : 'green') : 'red'" size="32" class="text-white">
              <v-icon size="18">{{ resumen.diferenciaNeta >= 0 ? (resumen.diferenciaNeta === 0 ? 'mdi-check-circle' : 'mdi-arrow-up-bold') : 'mdi-arrow-down-bold' }}</v-icon>
            </v-avatar>
          </div>
          <div
            class="text-h5 font-weight-black"
            :class="resumen.diferenciaNeta >= 0 ? (resumen.diferenciaNeta === 0 ? 'text-indigo-darken-4' : 'text-green-darken-4') : 'text-red-darken-4'"
          >
            {{ resumen.diferenciaNeta >= 0 ? '+' : '' }} {{ formatCurrency(resumen.diferenciaNeta) }}
          </div>
          <div class="d-flex align-center justify-space-between text-caption mt-1 font-weight-medium">
            <span class="text-error font-weight-bold">Faltante: -{{ formatCurrency(resumen.totalFaltantes) }}</span>
            <span class="text-success font-weight-bold">Sobrante: +{{ formatCurrency(resumen.totalSobrantes) }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- TABS PRINCIPALES DE VISUALIZACIÓN -->
    <v-card elevation="1" class="rounded-xl overflow-hidden bg-white border">
      <v-tabs
        v-model="tabActive"
        color="indigo-darken-4"
        bg-color="white"
        density="comfortable"
        class="border-b"
      >
        <v-tab :value="0" class="text-none font-weight-bold">
          <v-icon start size="18">mdi-format-list-bulleted</v-icon>
          Detalle de Sesiones y Cierres ({{ filteredItems.length }})
        </v-tab>
        <v-tab :value="1" class="text-none font-weight-bold">
          <v-icon start size="18">mdi-account-group</v-icon>
          Consolidado por Cajero ({{ consolidadoCajeros.length }})
        </v-tab>
        <v-tab :value="2" class="text-none font-weight-bold">
          <v-icon start size="18">mdi-cash-register</v-icon>
          Consolidado por Caja ({{ consolidadoCajas.length }})
        </v-tab>
      </v-tabs>

      <v-card-text class="pa-4">
        <v-window v-model="tabActive">
          <!-- ========================================== -->
          <!-- TAB 0: DETALLE CRONOLÓGICO DE SESIONES     -->
          <!-- ========================================== -->
          <v-window-item :value="0">
            <!-- Barra de Búsqueda Local -->
            <v-text-field
              v-model="searchTable"
              label="Buscar por código, observaciones o datos de sesión..."
              prepend-inner-icon="mdi-magnify"
              density="compact"
              variant="outlined"
              color="indigo"
              hide-details
              clearable
              class="mb-3"
            />

            <!-- Loader -->
            <div v-if="loading" class="d-flex justify-center my-8">
              <v-progress-circular indeterminate color="indigo" size="48" />
            </div>

            <!-- Tabla de Sesiones -->
            <v-data-table
              v-else
              :headers="headersItems"
              :items="filteredItems"
              density="compact"
              class="border rounded-lg"
              :items-per-page="10"
            >
              <!-- Header Filtro Caja -->
              <template v-slot:header.cajaNombre>
                <div class="font-weight-bold text-caption text-grey-darken-4">Caja</div>
                <v-autocomplete
                  v-model="filters.idCaja"
                  :items="cajasOptions"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  placeholder="Todas"
                  color="indigo"
                  class="mt-1"
                  style="min-width: 150px;"
                  @update:model-value="loadEstadoCuenta()"
                />
              </template>

              <!-- Header Filtro Cajero -->
              <template v-slot:header.nombreCajero>
                <div class="font-weight-bold text-caption text-grey-darken-4">Cajero / Responsable</div>
                <v-autocomplete
                  v-model="filters.idUsuario"
                  :items="usuariosOptions"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  placeholder="Todos"
                  color="indigo"
                  class="mt-1"
                  style="min-width: 170px;"
                  @update:model-value="loadEstadoCuenta()"
                />
              </template>

              <!-- Header Filtro Condición -->
              <template v-slot:header.estadoLiquidacion>
                <div class="font-weight-bold text-caption text-grey-darken-4">Condición</div>
                <v-select
                  v-model="filters.estadoLiquidacion"
                  :items="estadosLiquidacionOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                  placeholder="Todas"
                  color="indigo"
                  class="mt-1"
                  style="min-width: 140px;"
                />
              </template>
              <!-- Fecha Cierre -->
              <template v-slot:item.fechaCierre="{ item }">
                <div>
                  <span class="font-weight-bold text-grey-darken-4 d-block">{{ formatDate(item.fechaCierre) }}</span>
                  <span class="text-caption text-grey-darken-1">Ap: {{ formatDate(item.fechaApertura) }}</span>
                </div>
              </template>

              <!-- Códigos -->
              <template v-slot:item.codigoCierre="{ item }">
                <div>
                  <span class="font-weight-bold text-indigo d-block">{{ item.codigoCierre || '—' }}</span>
                  <span class="text-caption text-grey-darken-1">{{ item.codigoApertura }}</span>
                </div>
              </template>

              <!-- Caja -->
              <template v-slot:item.cajaNombre="{ item }">
                <div>
                  <span class="font-weight-medium text-grey-darken-4 d-block">{{ item.cajaNombre }}</span>
                  <v-chip size="x-small" color="blue-grey-lighten-4" class="text-blue-grey-darken-4">
                    {{ item.cajaCodigo || 'S/C' }}
                  </v-chip>
                </div>
              </template>

              <!-- Cajero -->
              <template v-slot:item.nombreCajero="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="24" color="indigo-lighten-5" class="mr-1.5 text-indigo font-weight-bold text-caption">
                    {{ (item.nombreCajero || item.usuario || 'U').charAt(0).toUpperCase() }}
                  </v-avatar>
                  <div>
                    <span class="font-weight-bold text-grey-darken-4 d-block">{{ item.nombreCajero }}</span>
                    <span class="text-caption text-grey-darken-1">@{{ item.usuario }}</span>
                  </div>
                </div>
              </template>

              <!-- Efectivo Inicial -->
              <template v-slot:item.efectivoInicial="{ item }">
                <span class="text-caption text-grey-darken-2">{{ formatCurrency(item.efectivoInicial) }}</span>
              </template>

              <!-- Ventas -->
              <template v-slot:item.ventas="{ item }">
                <span class="font-weight-medium text-success">{{ formatCurrency(item.ventas) }}</span>
              </template>

              <!-- Retiros -->
              <template v-slot:item.retiros="{ item }">
                <span class="text-orange-darken-4">{{ formatCurrency(item.retiros) }}</span>
              </template>

              <!-- Total Esperado -->
              <template v-slot:item.totalEsperado="{ item }">
                <span class="font-weight-bold text-indigo-darken-3">{{ formatCurrency(item.totalEsperado) }}</span>
              </template>

              <!-- Total Contado -->
              <template v-slot:item.totalContado="{ item }">
                <span class="font-weight-bold text-blue-grey-darken-4">{{ formatCurrency(item.totalContado) }}</span>
              </template>

              <!-- Diferencia -->
              <template v-slot:item.diferencia="{ item }">
                <v-chip
                  size="small"
                  :color="item.diferencia === 0 ? 'indigo-darken-1' : (item.diferencia > 0 ? 'success' : 'error')"
                  variant="flat"
                  class="font-weight-black"
                >
                  <v-icon start size="14">
                    {{ item.diferencia === 0 ? 'mdi-check' : (item.diferencia > 0 ? 'mdi-plus' : 'mdi-minus') }}
                  </v-icon>
                  {{ item.diferencia >= 0 ? '+' : '' }} {{ formatCurrency(item.diferencia) }}
                </v-chip>
              </template>

              <!-- Condición -->
              <template v-slot:item.estadoLiquidacion="{ item }">
                <v-chip
                  size="x-small"
                  :color="item.estadoLiquidacion === 'Cuadrada' ? 'indigo' : (item.estadoLiquidacion === 'Sobrante' ? 'success' : 'error')"
                  variant="tonal"
                  class="font-weight-bold text-uppercase"
                >
                  {{ item.estadoLiquidacion }}
                </v-chip>
              </template>

              <!-- Acciones -->
              <template v-slot:item.acciones="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="x-small"
                  variant="text"
                  color="indigo"
                  title="Ver detalle completo de la sesión"
                  @click="verDetalleSesion(item)"
                />
              </template>
            </v-data-table>
          </v-window-item>

          <!-- ========================================== -->
          <!-- TAB 1: CONSOLIDADO POR CAJERO             -->
          <!-- ========================================== -->
          <v-window-item :value="1">
            <v-row dense class="mb-3">
              <v-col
                v-for="cajero in consolidadoCajeros"
                :key="cajero.usuario"
                cols="12"
                md="6"
                lg="4"
              >
                <v-card class="pa-4 rounded-xl border bg-white h-100 hover-card elevation-1">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="d-flex align-center">
                      <v-avatar color="indigo-lighten-4" size="40" class="mr-2 text-indigo-darken-4 font-weight-black">
                        {{ (cajero.nombreCajero || cajero.usuario || 'U').charAt(0).toUpperCase() }}
                      </v-avatar>
                      <div>
                        <div class="font-weight-bold text-subtitle-2 text-indigo-darken-4">{{ cajero.nombreCajero }}</div>
                        <div class="text-caption text-grey-darken-1">@{{ cajero.usuario }}</div>
                      </div>
                    </div>
                    <v-chip
                      size="small"
                      :color="cajero.diferenciaAcumulada >= 0 ? (cajero.diferenciaAcumulada === 0 ? 'indigo' : 'success') : 'error'"
                      variant="flat"
                      class="font-weight-black"
                    >
                      {{ cajero.diferenciaAcumulada >= 0 ? '+' : '' }} {{ formatCurrency(cajero.diferenciaAcumulada) }}
                    </v-chip>
                  </div>

                  <v-divider class="my-2" />

                  <div class="d-flex justify-space-between text-caption py-1">
                    <span class="text-grey-darken-1">Turnos Trabajados:</span>
                    <span class="font-weight-bold text-grey-darken-4">{{ cajero.totalTurnos }} sesiones</span>
                  </div>
                  <div class="d-flex justify-space-between text-caption py-1">
                    <span class="text-grey-darken-1">Cajas Cuadradas:</span>
                    <span class="font-weight-bold text-indigo">{{ cajero.turnosCuadrados }} de {{ cajero.totalTurnos }} ({{ cajero.porcentajeEfectividad }}%)</span>
                  </div>
                  <div class="d-flex justify-space-between text-caption py-1">
                    <span class="text-grey-darken-1">Ventas Facturadas:</span>
                    <span class="font-weight-bold text-success">{{ formatCurrency(cajero.totalVentas) }}</span>
                  </div>
                  <div class="d-flex justify-space-between text-caption py-1">
                    <span class="text-grey-darken-1">Total Retiros:</span>
                    <span class="font-weight-bold text-orange-darken-4">{{ formatCurrency(cajero.totalRetiros) }}</span>
                  </div>
                  <div class="d-flex justify-space-between text-caption py-1">
                    <span class="text-grey-darken-1">Total Faltantes:</span>
                    <span class="font-weight-bold text-error">-{{ formatCurrency(cajero.totalFaltantes) }}</span>
                  </div>
                  <div class="d-flex justify-space-between text-caption py-1">
                    <span class="text-grey-darken-1">Total Sobrantes:</span>
                    <span class="font-weight-bold text-success">+{{ formatCurrency(cajero.totalSobrantes) }}</span>
                  </div>

                  <v-btn
                    size="small"
                    variant="tonal"
                    color="indigo-darken-3"
                    prepend-icon="mdi-printer-outline"
                    class="text-none font-weight-bold w-100 mt-2 rounded-lg"
                    @click="imprimirPdfCajero(cajero)"
                  >
                    Imprimir Estado de Cuenta
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>

            <!-- Tabla Resumen de Cajeros -->
            <v-data-table
              :headers="headersCajeros"
              :items="consolidadoCajeros"
              density="compact"
              class="border rounded-lg mt-3"
              :items-per-page="5"
            >
              <template v-slot:item.nombreCajero="{ item }">
                <span class="font-weight-bold text-indigo-darken-4">{{ item.nombreCajero }}</span>
              </template>
              <template v-slot:item.totalTurnos="{ item }">
                <span class="font-weight-bold">{{ item.totalTurnos }}</span>
              </template>
              <template v-slot:item.porcentajeEfectividad="{ item }">
                <v-chip size="x-small" :color="item.porcentajeEfectividad >= 90 ? 'success' : (item.porcentajeEfectividad >= 70 ? 'amber-darken-3' : 'error')" variant="flat" class="font-weight-bold">
                  {{ item.porcentajeEfectividad }}%
                </v-chip>
              </template>
              <template v-slot:item.totalVentas="{ item }">
                <span class="text-success font-weight-medium">{{ formatCurrency(item.totalVentas) }}</span>
              </template>
              <template v-slot:item.totalRetiros="{ item }">
                <span class="text-orange-darken-4">{{ formatCurrency(item.totalRetiros) }}</span>
              </template>
              <template v-slot:item.totalFaltantes="{ item }">
                <span class="text-error font-weight-bold">-{{ formatCurrency(item.totalFaltantes) }}</span>
              </template>
              <template v-slot:item.totalSobrantes="{ item }">
                <span class="text-success font-weight-bold">+{{ formatCurrency(item.totalSobrantes) }}</span>
              </template>
              <template v-slot:item.diferenciaAcumulada="{ item }">
                <v-chip
                  size="small"
                  :color="item.diferenciaAcumulada >= 0 ? (item.diferenciaAcumulada === 0 ? 'indigo' : 'success') : 'error'"
                  variant="flat"
                  class="font-weight-black"
                >
                  {{ item.diferenciaAcumulada >= 0 ? '+' : '' }} {{ formatCurrency(item.diferenciaAcumulada) }}
                </v-chip>
              </template>
              <template v-slot:item.acciones="{ item }">
                <v-btn
                  icon="mdi-printer"
                  size="x-small"
                  variant="text"
                  color="indigo-darken-3"
                  title="Imprimir Estado de Cuenta"
                  @click="imprimirPdfCajero(item)"
                />
              </template>
            </v-data-table>
          </v-window-item>

          <!-- ========================================== -->
          <!-- TAB 2: CONSOLIDADO POR CAJA               -->
          <!-- ========================================== -->
          <v-window-item :value="2">
            <v-data-table
              :headers="headersCajas"
              :items="consolidadoCajas"
              density="compact"
              class="border rounded-lg"
              :items-per-page="5"
            >
              <template v-slot:item.cajaNombre="{ item }">
                <div>
                  <span class="font-weight-bold text-indigo-darken-4 d-block">{{ item.cajaNombre }}</span>
                  <span class="text-caption text-grey-darken-1">{{ item.cajaCodigo }}</span>
                </div>
              </template>
              <template v-slot:item.totalTurnos="{ item }">
                <span class="font-weight-bold">{{ item.totalTurnos }} turnos</span>
              </template>
              <template v-slot:item.porcentajeEfectividad="{ item }">
                <v-chip size="x-small" :color="item.porcentajeEfectividad >= 90 ? 'success' : 'amber-darken-3'" variant="flat" class="font-weight-bold">
                  {{ item.porcentajeEfectividad }}%
                </v-chip>
              </template>
              <template v-slot:item.totalVentas="{ item }">
                <span class="text-success font-weight-medium">{{ formatCurrency(item.totalVentas) }}</span>
              </template>
              <template v-slot:item.totalRetiros="{ item }">
                <span class="text-orange-darken-4">{{ formatCurrency(item.totalRetiros) }}</span>
              </template>
              <template v-slot:item.diferenciaAcumulada="{ item }">
                <v-chip
                  size="small"
                  :color="item.diferenciaAcumulada >= 0 ? (item.diferenciaAcumulada === 0 ? 'indigo' : 'success') : 'error'"
                  variant="flat"
                  class="font-weight-black"
                >
                  {{ item.diferenciaAcumulada >= 0 ? '+' : '' }} {{ formatCurrency(item.diferenciaAcumulada) }}
                </v-chip>
              </template>
            </v-data-table>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <!-- MODAL DE DETALLE DE SESIÓN -->
    <v-dialog v-model="dialogDetalle.show" max-width="700" persistent>
      <v-card v-if="dialogDetalle.item" class="rounded-xl overflow-hidden elevation-12">
        <v-card-title class="bg-indigo-darken-4 text-white d-flex align-center justify-space-between py-3 px-4">
          <div class="d-flex align-center ga-2">
            <v-icon color="amber">mdi-receipt-text-check</v-icon>
            <span class="font-weight-bold text-subtitle-1">Detalle de Sesión: {{ dialogDetalle.item.codigoCierre }}</span>
          </div>
          <v-btn icon="mdi-close" size="small" variant="text" color="white" @click="dialogDetalle.show = false" />
        </v-card-title>

        <v-card-text class="pa-4 bg-white">
          <!-- Cabecera Informativa -->
          <v-row dense class="mb-3">
            <v-col cols="12" sm="6">
              <v-card class="pa-2 rounded border bg-white">
                <div class="text-caption text-grey-darken-1 font-weight-medium">Caja y Responsable</div>
                <div class="font-weight-bold text-body-2 text-indigo-darken-4">{{ dialogDetalle.item.cajaNombre }}</div>
                <div class="text-caption text-grey-darken-2">Cajero: <strong>{{ dialogDetalle.item.nombreCajero }}</strong> (@{{ dialogDetalle.item.usuario }})</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card class="pa-2 rounded border bg-white">
                <div class="text-caption text-grey-darken-1 font-weight-medium">Fechas de la Sesión</div>
                <div class="text-caption">Apertura: <strong>{{ formatDate(dialogDetalle.item.fechaApertura) }}</strong></div>
                <div class="text-caption">Cierre: <strong>{{ formatDate(dialogDetalle.item.fechaCierre) }}</strong></div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Desglose Financiero -->
          <v-card class="pa-3 rounded border bg-white mb-3">
            <div class="text-subtitle-2 font-weight-bold text-indigo-darken-4 mb-2">Liquidación Financiera</div>
            <div class="d-flex justify-space-between py-1 border-bottom text-body-2">
              <span class="text-grey-darken-1">Efectivo Apertura:</span>
              <span class="font-weight-medium">{{ formatCurrency(dialogDetalle.item.efectivoInicial) }}</span>
            </div>
            <div class="d-flex justify-space-between py-1 border-bottom text-body-2">
              <span class="text-grey-darken-1">Ventas del Turno:</span>
              <span class="font-weight-bold text-success">{{ formatCurrency(dialogDetalle.item.ventas) }}</span>
            </div>
            <div class="d-flex justify-space-between py-1 border-bottom text-body-2">
              <span class="text-grey-darken-1">Retiros / Gastos:</span>
              <span class="font-weight-bold text-orange-darken-4">-{{ formatCurrency(dialogDetalle.item.retiros) }}</span>
            </div>
            <div class="d-flex justify-space-between py-1 border-bottom text-body-2 bg-indigo-lighten-5 pa-1 rounded">
              <span class="font-weight-bold text-indigo-darken-4">Total Esperado:</span>
              <span class="font-weight-bold text-indigo-darken-4">{{ formatCurrency(dialogDetalle.item.totalEsperado) }}</span>
            </div>
            <div class="d-flex justify-space-between py-1 border-bottom text-body-2">
              <span class="text-grey-darken-1">Total Contado en Cierre:</span>
              <span class="font-weight-bold text-blue-grey-darken-4">{{ formatCurrency(dialogDetalle.item.totalContado) }}</span>
            </div>
            <div class="d-flex justify-space-between align-center py-2 mt-1">
              <span class="text-subtitle-2 font-weight-bold">Diferencia Final:</span>
              <v-chip
                size="small"
                :color="dialogDetalle.item.diferencia === 0 ? 'indigo' : (dialogDetalle.item.diferencia > 0 ? 'success' : 'error')"
                variant="flat"
                class="font-weight-black"
              >
                {{ dialogDetalle.item.diferencia >= 0 ? '+' : '' }} {{ formatCurrency(dialogDetalle.item.diferencia) }} ({{ dialogDetalle.item.estadoLiquidacion }})
              </v-chip>
            </div>
          </v-card>

          <!-- Referencia de Arqueo si existe -->
          <v-alert
            v-if="dialogDetalle.item.idArqueoCaja"
            type="info"
            variant="tonal"
            density="compact"
            class="text-caption mb-3"
          >
            <strong>Arqueo Previo Realizado:</strong> Efectivo Auditado: {{ formatCurrency(dialogDetalle.item.montoArqueoEfectivo) }} &bull; Ventas: {{ formatCurrency(dialogDetalle.item.montoArqueoVentas) }}
          </v-alert>

          <!-- Observaciones -->
          <div v-if="dialogDetalle.item.observaciones" class="pa-2 bg-amber-lighten-5 rounded border border-amber-lighten-3 text-caption text-amber-darken-4">
            <strong>Observaciones de Cierre:</strong> {{ dialogDetalle.item.observaciones }}
          </div>
        </v-card-text>

        <v-card-actions class="bg-white pa-3 border-t">
          <v-spacer />
          <v-btn color="indigo-darken-4" variant="flat" class="text-white font-weight-bold text-none rounded-lg" @click="dialogDetalle.show = false">
            Cerrar Detalle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SNACKBAR DE NOTIFICACIONES -->
    <v-snackbar v-model="alert.show" :color="alert.type" location="top right" :timeout="4000">
      {{ alert.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="alert.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import RequestHttp from '@/services/requestHttp';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default {
  name: 'EstadosCuentaCajaView',

  data() {
    return {
      requestHttp: new RequestHttp(),
      loading: false,
      tabActive: 0,
      searchTable: '',
      activePreset: 'Este Mes',

      presetsFecha: [
        { label: 'Hoy', days: 0 },
        { label: 'Esta Semana', days: 7 },
        { label: 'Este Mes', type: 'month' },
        { label: 'Mes Anterior', type: 'prev_month' },
        { label: 'Todo', type: 'all' }
      ],

      filters: {
        desde: '',
        hasta: '',
        idCaja: null,
        idUsuario: null,
        estadoLiquidacion: 'TODOS'
      },

      estadosLiquidacionOptions: [
        { title: 'Todas las Condiciones', value: 'TODOS' },
        { title: 'Solo Cajas Cuadradas', value: 'Cuadrada' },
        { title: 'Solo con Faltante (Descuadres)', value: 'Faltante' },
        { title: 'Solo con Sobrante', value: 'Sobrante' }
      ],

      dataCatalogos: {
        cajas: [],
        usuarios: []
      },

      resumen: {
        totalCierres: 0,
        totalEfectivoInicial: 0,
        totalVentas: 0,
        totalRetiros: 0,
        totalEsperado: 0,
        totalContado: 0,
        diferenciaNeta: 0,
        totalSobrantes: 0,
        totalFaltantes: 0,
        cantidadCuadradas: 0,
        cantidadSobrantes: 0,
        cantidadFaltantes: 0,
        porcentajeEfectividad: 0
      },

      items: [],
      consolidadoCajeros: [],
      consolidadoCajas: [],

      headersItems: [
        { title: 'Fecha Cierre', key: 'fechaCierre', align: 'start', sortable: true },
        { title: 'Código Cierre / Ap.', key: 'codigoCierre', align: 'start', sortable: true },
        { title: 'Caja', key: 'cajaNombre', align: 'start', sortable: false },
        { title: 'Cajero / Responsable', key: 'nombreCajero', align: 'start', sortable: false },
        { title: 'Ef. Inicial', key: 'efectivoInicial', align: 'end', sortable: true },
        { title: 'Ventas', key: 'ventas', align: 'end', sortable: true },
        { title: 'Retiros', key: 'retiros', align: 'end', sortable: true },
        { title: 'Total Esperado', key: 'totalEsperado', align: 'end', sortable: true },
        { title: 'Total Contado', key: 'totalContado', align: 'end', sortable: true },
        { title: 'Diferencia', key: 'diferencia', align: 'center', sortable: true },
        { title: 'Condición', key: 'estadoLiquidacion', align: 'center', sortable: false },
        { title: 'Detalle', key: 'acciones', align: 'center', sortable: false }
      ],

      headersCajeros: [
        { title: 'Cajero / Usuario', key: 'nombreCajero', align: 'start', sortable: true },
        { title: 'Sesiones', key: 'totalTurnos', align: 'center', sortable: true },
        { title: 'Efectividad', key: 'porcentajeEfectividad', align: 'center', sortable: true },
        { title: 'Total Ventas', key: 'totalVentas', align: 'end', sortable: true },
        { title: 'Total Retiros', key: 'totalRetiros', align: 'end', sortable: true },
        { title: 'Faltantes Acum.', key: 'totalFaltantes', align: 'end', sortable: true },
        { title: 'Sobrantes Acum.', key: 'totalSobrantes', align: 'end', sortable: true },
        { title: 'Balance Neto', key: 'diferenciaAcumulada', align: 'center', sortable: true },
        { title: 'Acciones', key: 'acciones', align: 'center', sortable: false }
      ],

      headersCajas: [
        { title: 'Caja', key: 'cajaNombre', align: 'start', sortable: true },
        { title: 'Sesiones', key: 'totalTurnos', align: 'center', sortable: true },
        { title: 'Efectividad', key: 'porcentajeEfectividad', align: 'center', sortable: true },
        { title: 'Total Ventas', key: 'totalVentas', align: 'end', sortable: true },
        { title: 'Total Retiros', key: 'totalRetiros', align: 'end', sortable: true },
        { title: 'Balance Neto', key: 'diferenciaAcumulada', align: 'center', sortable: true }
      ],

      dialogDetalle: {
        show: false,
        item: null
      },

      alert: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },

  computed: {
    cajasOptions() {
      return (this.dataCatalogos.cajas || []).map(c => ({
        title: `${c.nombre} (${c.codigo || 'S/C'})`,
        value: c.idCaja
      }));
    },

    usuariosOptions() {
      return (this.dataCatalogos.usuarios || []).map(u => ({
        title: `${u.nombre || u.username} (@${u.username})`,
        value: u.idusuario
      }));
    },

    filteredItems() {
      let list = this.items || [];

      // Filtro por condición
      if (this.filters.estadoLiquidacion && this.filters.estadoLiquidacion !== 'TODOS') {
        list = list.filter(i => i.estadoLiquidacion === this.filters.estadoLiquidacion);
      }

      // Filtro de búsqueda local
      if (this.searchTable) {
        const q = this.searchTable.toLowerCase();
        list = list.filter(i =>
          (i.codigoCierre && i.codigoCierre.toLowerCase().includes(q)) ||
          (i.codigoApertura && i.codigoApertura.toLowerCase().includes(q)) ||
          (i.cajaNombre && i.cajaNombre.toLowerCase().includes(q)) ||
          (i.cajaCodigo && i.cajaCodigo.toLowerCase().includes(q)) ||
          (i.nombreCajero && i.nombreCajero.toLowerCase().includes(q)) ||
          (i.usuario && i.usuario.toLowerCase().includes(q)) ||
          (i.observaciones && i.observaciones.toLowerCase().includes(q))
        );
      }

      return list;
    }
  },

  mounted() {
    this.initDates();
    this.loadCatalogos();
    this.loadEstadoCuenta();
  },

  methods: {
    showAlert(msg, type = 'success') {
      this.alert.message = msg;
      this.alert.type = type;
      this.alert.show = true;
    },

    formatCurrency(val) {
      const num = Number(val) || 0;
      return `C$ ${num.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    formatDate(dateVal) {
      if (!dateVal) return '—';
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatDateSimple(dateVal) {
      if (!dateVal) return '—';
      const d = new Date(dateVal);
      return d.toISOString().split('T')[0];
    },

    initDates() {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      this.filters.desde = this.formatDateSimple(firstDay);
      this.filters.hasta = this.formatDateSimple(now);
    },

    applyPreset(p) {
      this.activePreset = p.label;
      const now = new Date();
      if (p.label === 'Hoy') {
        const d = this.formatDateSimple(now);
        this.filters.desde = d;
        this.filters.hasta = d;
      } else if (p.label === 'Esta Semana') {
        const curr = new Date();
        const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
        const firstDay = new Date(curr.setDate(first));
        this.filters.desde = this.formatDateSimple(firstDay);
        this.filters.hasta = this.formatDateSimple(now);
      } else if (p.label === 'Este Mes') {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        this.filters.desde = this.formatDateSimple(firstDay);
        this.filters.hasta = this.formatDateSimple(now);
      } else if (p.label === 'Mes Anterior') {
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
        this.filters.desde = this.formatDateSimple(firstDay);
        this.filters.hasta = this.formatDateSimple(lastDay);
      } else if (p.label === 'Todo') {
        this.filters.desde = '';
        this.filters.hasta = '';
      }
      this.loadEstadoCuenta();
    },

    async loadCatalogos() {
      try {
        const [resCajas, resUsuarios] = await Promise.all([
          this.requestHttp.getCajas(),
          this.requestHttp.getUsuarios()
        ]);
        if (resCajas.code === 200 && Array.isArray(resCajas.data)) {
          this.dataCatalogos.cajas = resCajas.data;
        }
        if (resUsuarios.code === 200 && Array.isArray(resUsuarios.data)) {
          this.dataCatalogos.usuarios = resUsuarios.data;
        }
      } catch (e) {
        console.error('Error cargando catálogos:', e);
      }
    },

    async loadEstadoCuenta() {
      this.loading = true;
      try {
        const payload = {};
        if (this.filters.desde) {
          payload.desde = `${this.filters.desde}T00:00:00`;
        }
        if (this.filters.hasta) {
          payload.hasta = `${this.filters.hasta}T23:59:59`;
        }
        if (this.filters.idCaja) {
          payload.idCaja = this.filters.idCaja;
        }
        if (this.filters.idUsuario) {
          payload.idUsuario = this.filters.idUsuario;
        }

        const res = await this.requestHttp.postEstadoCuentaCaja(payload);
        if (res.code === 200 && res.data) {
          this.resumen = res.data.resumen || this.resumen;
          this.items = res.data.items || [];
          this.consolidadoCajeros = res.data.consolidadoCajeros || [];
          this.consolidadoCajas = res.data.consolidadoCajas || [];
        } else {
          this.showAlert(res.data?.msg || 'Error al consultar estado de cuenta.', 'error');
        }
      } catch (e) {
        console.error('Error al cargar estado de cuenta:', e);
        this.showAlert('Error al conectar con el servidor.', 'error');
      } finally {
        this.loading = false;
      }
    },

    verDetalleSesion(item) {
      this.dialogDetalle.item = item;
      this.dialogDetalle.show = true;
    },

    async exportToExcel() {
      if (!this.items || this.items.length === 0) {
        this.showAlert('No hay datos para exportar.', 'warning');
        return;
      }

      try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'DevoDigital';
        workbook.created = new Date();

        // HOJA 1: DETALLE DE SESIONES
        const wsDetalle = workbook.addWorksheet('Detalle de Sesiones');
        wsDetalle.columns = [
          { header: 'No. Cierre', key: 'codigoCierre', width: 18 },
          { header: 'No. Apertura', key: 'codigoApertura', width: 18 },
          { header: 'Fecha Cierre', key: 'fechaCierre', width: 20 },
          { header: 'Caja', key: 'cajaNombre', width: 22 },
          { header: 'Cajero', key: 'nombreCajero', width: 25 },
          { header: 'Usuario', key: 'usuario', width: 15 },
          { header: 'Efectivo Inicial (C$)', key: 'efectivoInicial', width: 18 },
          { header: 'Ventas (C$)', key: 'ventas', width: 18 },
          { header: 'Retiros (C$)', key: 'retiros', width: 18 },
          { header: 'Total Esperado (C$)', key: 'totalEsperado', width: 18 },
          { header: 'Total Contado (C$)', key: 'totalContado', width: 18 },
          { header: 'Diferencia (C$)', key: 'diferencia', width: 18 },
          { header: 'Condición', key: 'estadoLiquidacion', width: 15 },
          { header: 'Observaciones', key: 'observaciones', width: 30 }
        ];

        // Header Style
        wsDetalle.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        wsDetalle.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1A237E' }
        };

        this.items.forEach(i => {
          wsDetalle.addRow({
            codigoCierre: i.codigoCierre || '—',
            codigoApertura: i.codigoApertura || '—',
            fechaCierre: this.formatDate(i.fechaCierre),
            cajaNombre: i.cajaNombre,
            nombreCajero: i.nombreCajero,
            usuario: i.usuario,
            efectivoInicial: i.efectivoInicial,
            ventas: i.ventas,
            retiros: i.retiros,
            totalEsperado: i.totalEsperado,
            totalContado: i.totalContado,
            diferencia: i.diferencia,
            estadoLiquidacion: i.estadoLiquidacion,
            observaciones: i.observaciones || ''
          });
        });

        // HOJA 2: CONSOLIDADO POR CAJERO
        const wsCajeros = workbook.addWorksheet('Consolidado por Cajero');
        wsCajeros.columns = [
          { header: 'Cajero', key: 'nombreCajero', width: 25 },
          { header: 'Usuario', key: 'usuario', width: 15 },
          { header: 'Turnos Trabajados', key: 'totalTurnos', width: 18 },
          { header: 'Efectividad (%)', key: 'porcentajeEfectividad', width: 18 },
          { header: 'Total Ventas (C$)', key: 'totalVentas', width: 18 },
          { header: 'Total Retiros (C$)', key: 'totalRetiros', width: 18 },
          { header: 'Total Faltantes (C$)', key: 'totalFaltantes', width: 18 },
          { header: 'Total Sobrantes (C$)', key: 'totalSobrantes', width: 18 },
          { header: 'Balance Neto (C$)', key: 'diferenciaAcumulada', width: 18 }
        ];
        wsCajeros.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        wsCajeros.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF2E7D32' }
        };

        this.consolidadoCajeros.forEach(c => {
          wsCajeros.addRow({
            nombreCajero: c.nombreCajero,
            usuario: c.usuario,
            totalTurnos: c.totalTurnos,
            porcentajeEfectividad: c.porcentajeEfectividad,
            totalVentas: c.totalVentas,
            totalRetiros: c.totalRetiros,
            totalFaltantes: c.totalFaltantes,
            totalSobrantes: c.totalSobrantes,
            diferenciaAcumulada: c.diferenciaAcumulada
          });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Estados_Cuenta_Cajas_${this.filters.desde || 'inicio'}_al_${this.filters.hasta || 'fin'}.xlsx`);
        this.showAlert('Archivo Excel generado y descargado exitosamente.', 'success');
      } catch (e) {
        console.error('Error al exportar a Excel:', e);
        this.showAlert('No se pudo generar el archivo Excel.', 'error');
      }
    },

    imprimirPdfCajero(cajero) {
      if (!cajero) {
        this.showAlert('No se especificó el cajero a imprimir.', 'warning');
        return;
      }

      try {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const primaryColor = [26, 35, 126];    // Indigo #1A237E
        const accentColor = [57, 73, 171];     // #3949AB
        const darkColor = [30, 41, 59];        // Slate #1E293B
        const lightBg = [248, 250, 252];       // #F8FAFC
        const borderGray = [226, 232, 240];    // #E2E8F0
        const successColor = [46, 125, 50];    // Green #2E7D32
        const errorColor = [198, 40, 40];      // Red #C62828

        // Header Banner
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, pageWidth, 24, 'F');

        // Accent line under banner
        doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.rect(0, 24, pageWidth, 1.5, 'F');

        // Title in Header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('ESTADO DE CUENTA DE CAJERO', 14, 11);

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(220, 225, 245);
        doc.text('SISTEMA DE CONTROL DE CAJA Y LIQUIDACIONES', 14, 18);

        // Right Header Info
        const rangoTexto = `${this.filters.desde || 'Inicio'} al ${this.filters.hasta || 'Actual'}`;
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(`Rango: ${rangoTexto}`, pageWidth - 14, 11, { align: 'right' });

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(220, 225, 245);
        doc.text(`Emisión: ${new Date().toLocaleString('es-NI')}`, pageWidth - 14, 18, { align: 'right' });

        let currentY = 31;

        // Cajero Info Box
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.roundedRect(14, currentY, pageWidth - 28, 26, 2, 2, 'F');
        doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
        doc.setLineWidth(0.4);
        doc.roundedRect(14, currentY, pageWidth - 28, 26, 2, 2, 'S');

        // Cashier identity
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`${cajero.nombreCajero || cajero.usuario || 'Cajero'}`, 18, currentY + 6.5);

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text(`Usuario: @${cajero.usuario || '—'}`, 18, currentY + 12.5);
        doc.text(`Sesiones de Caja: ${cajero.totalTurnos || 0} turnos`, 18, currentY + 18);
        doc.text(`Cajas Cuadradas: ${cajero.turnosCuadrados || 0} (${cajero.porcentajeEfectividad || 0}% efectividad)`, 18, currentY + 23);

        // Right KPI summary column in box
        const col2X = pageWidth - 72;
        doc.setFontSize(8);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text('Total Ventas:', col2X, currentY + 7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(successColor[0], successColor[1], successColor[2]);
        doc.text(this.formatCurrency(cajero.totalVentas), pageWidth - 18, currentY + 7, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text('Total Retiros:', col2X, currentY + 12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(190, 80, 0);
        doc.text(this.formatCurrency(cajero.totalRetiros), pageWidth - 18, currentY + 12, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text('Balance Neto:', col2X, currentY + 18);
        doc.setFont('helvetica', 'bold');
        const difVal = Number(cajero.diferenciaAcumulada) || 0;
        const difColor = difVal >= 0 ? (difVal === 0 ? primaryColor : successColor) : errorColor;
        doc.setTextColor(difColor[0], difColor[1], difColor[2]);
        const balanceSign = difVal > 0 ? '+' : '';
        doc.text(`${balanceSign}${this.formatCurrency(difVal)}`, pageWidth - 18, currentY + 18, { align: 'right' });

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        doc.text(`Sobrantes: +${this.formatCurrency(cajero.totalSobrantes)} | Faltantes: -${this.formatCurrency(cajero.totalFaltantes)}`, col2X - 18, currentY + 23);

        currentY += 31;

        // Filter sessions for this cashier
        const sesiones = (this.items || []).filter(i =>
          (i.idUsuario && cajero.idUsuario && i.idUsuario === cajero.idUsuario) ||
          (i.usuario && cajero.usuario && i.usuario.toLowerCase() === cajero.usuario.toLowerCase()) ||
          (i.nombreCajero && cajero.nombreCajero && i.nombreCajero.toLowerCase() === cajero.nombreCajero.toLowerCase())
        );

        // Sessions Table Header Title
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`DETALLE DE SESIONES Y CIERRES DE CAJA (${sesiones.length} sesiones)`, 14, currentY);
        currentY += 3;

        // Prepare table data
        const tableHeaders = [[
          '#', 'Fecha Cierre', 'No. Cierre', 'Caja',
          'Ef. Inicial', 'Ventas', 'Retiros',
          'Esperado', 'Contado', 'Diferencia', 'Condición'
        ]];

        const tableRows = sesiones.map((s, idx) => [
          (idx + 1).toString(),
          this.formatDate(s.fechaCierre),
          s.codigoCierre || s.codigoApertura || '—',
          s.cajaNombre || '—',
          this.formatCurrency(s.efectivoInicial),
          this.formatCurrency(s.ventas),
          this.formatCurrency(s.retiros),
          this.formatCurrency(s.totalEsperado),
          this.formatCurrency(s.totalContado),
          `${Number(s.diferencia) >= 0 ? '+' : ''}${this.formatCurrency(s.diferencia)}`,
          s.estadoLiquidacion || '—'
        ]);

        // Totales al pie de la tabla
        const totalEfInicial = sesiones.reduce((acc, s) => acc + (Number(s.efectivoInicial) || 0), 0);
        const totalVentas = sesiones.reduce((acc, s) => acc + (Number(s.ventas) || 0), 0);
        const totalRetiros = sesiones.reduce((acc, s) => acc + (Number(s.retiros) || 0), 0);
        const totalEsperado = sesiones.reduce((acc, s) => acc + (Number(s.totalEsperado) || 0), 0);
        const totalContado = sesiones.reduce((acc, s) => acc + (Number(s.totalContado) || 0), 0);
        const totalDiferencia = sesiones.reduce((acc, s) => acc + (Number(s.diferencia) || 0), 0);

        const footRows = [[
          '',
          'TOTALES',
          '',
          '',
          this.formatCurrency(totalEfInicial),
          this.formatCurrency(totalVentas),
          this.formatCurrency(totalRetiros),
          this.formatCurrency(totalEsperado),
          this.formatCurrency(totalContado),
          `${totalDiferencia >= 0 ? '+' : ''}${this.formatCurrency(totalDiferencia)}`,
          totalDiferencia === 0 ? 'CUADRADO' : (totalDiferencia > 0 ? 'SOBRANTE' : 'FALTANTE')
        ]];

        doc.autoTable({
          startY: currentY,
          head: tableHeaders,
          body: tableRows,
          foot: footRows,
          theme: 'striped',
          styles: {
            fontSize: 7.5,
            cellPadding: 1.8,
            lineColor: [230, 235, 240],
            lineWidth: 0.1
          },
          headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 7.5,
            halign: 'center'
          },
          footStyles: {
            fillColor: [240, 243, 248],
            textColor: primaryColor,
            fontStyle: 'bold',
            fontSize: 7.5,
            halign: 'right'
          },
          columnStyles: {
            0: { cellWidth: 7, halign: 'center' },
            1: { cellWidth: 26, halign: 'left' },
            2: { cellWidth: 22, halign: 'left' },
            3: { cellWidth: 22, halign: 'left' },
            4: { cellWidth: 16, halign: 'right' },
            5: { cellWidth: 16, halign: 'right' },
            6: { cellWidth: 16, halign: 'right' },
            7: { cellWidth: 17, halign: 'right' },
            8: { cellWidth: 17, halign: 'right' },
            9: { cellWidth: 17, halign: 'right' },
            10: { cellWidth: 16, halign: 'center' }
          },
          margin: { left: 14, right: 14, bottom: 20 },
          didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 9) {
              const rawVal = Number(sesiones[data.row.index]?.diferencia) || 0;
              if (rawVal < 0) {
                data.cell.styles.textColor = errorColor;
                data.cell.styles.fontStyle = 'bold';
              } else if (rawVal > 0) {
                data.cell.styles.textColor = successColor;
                data.cell.styles.fontStyle = 'bold';
              }
            }
          }
        });

        let finalY = doc.lastAutoTable.finalY + 12;

        // Si no alcanza espacio para firmas, agregar nueva página
        if (finalY + 38 > pageHeight - 15) {
          doc.addPage();
          finalY = 25;
        }

        // Sección de Firmas
        const sigWidth = 70;
        const leftSigX = 20;
        const rightSigX = pageWidth - 20 - sigWidth;

        doc.setDrawColor(180, 185, 195);
        doc.setLineWidth(0.5);

        // Firma Cajero
        doc.line(leftSigX, finalY + 18, leftSigX + sigWidth, finalY + 18);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text('Firma del Cajero Responsable', leftSigX + sigWidth / 2, finalY + 23, { align: 'center' });
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`${cajero.nombreCajero} (@${cajero.usuario})`, leftSigX + sigWidth / 2, finalY + 27, { align: 'center' });

        // Firma Auditor
        doc.line(rightSigX, finalY + 18, rightSigX + sigWidth, finalY + 18);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text('Firma Auditor / Supervisor', rightSigX + sigWidth / 2, finalY + 23, { align: 'center' });
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Control Interno y Liquidación', rightSigX + sigWidth / 2, finalY + 27, { align: 'center' });

        // Pie de página en todas las páginas
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setDrawColor(220, 225, 230);
          doc.setLineWidth(0.3);
          doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(130, 135, 145);
          doc.text('Documento oficial de control interno y liquidación de valores - S.I. Tokes', 14, pageHeight - 7);
          doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
        }

        const blobUrl = doc.output('bloburl');
        window.open(blobUrl, '_blank');
        this.showAlert(`Estado de cuenta de ${cajero.nombreCajero} generado exitosamente.`, 'success');
      } catch (err) {
        console.error('Error generando PDF de cajero:', err);
        this.showAlert('Error al generar el PDF del estado de cuenta.', 'error');
      }
    },

    imprimirPdfGeneral() {
      if (this.filters.idUsuario) {
        const cajero = this.consolidadoCajeros.find(c => c.idUsuario === this.filters.idUsuario);
        if (cajero) {
          this.imprimirPdfCajero(cajero);
          return;
        }
      }

      if (!this.items || this.items.length === 0) {
        this.showAlert('No hay datos para generar el PDF.', 'warning');
        return;
      }

      try {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const primaryColor = [26, 35, 126];    // Indigo #1A237E
        const accentColor = [57, 73, 171];
        const darkColor = [30, 41, 59];
        const lightBg = [248, 250, 252];
        const borderGray = [226, 232, 240];
        const successColor = [46, 125, 50];
        const errorColor = [198, 40, 40];

        // Header Banner
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, pageWidth, 24, 'F');

        doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.rect(0, 24, pageWidth, 1.5, 'F');

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('ESTADOS DE CUENTA - INFORME GENERAL', 14, 11);

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(220, 225, 245);
        doc.text('AUDITORÍA CONSOLIDADA DE CAJAS Y CAJEROS', 14, 18);

        const rangoTexto = `${this.filters.desde || 'Inicio'} al ${this.filters.hasta || 'Actual'}`;
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(`Rango: ${rangoTexto}`, pageWidth - 14, 11, { align: 'right' });

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(220, 225, 245);
        doc.text(`Emisión: ${new Date().toLocaleString('es-NI')}`, pageWidth - 14, 18, { align: 'right' });

        let currentY = 31;

        // Resumen Ejecutivo General
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'F');
        doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
        doc.setLineWidth(0.4);
        doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'S');

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('RESUMEN EJECUTIVO DEL PERÍODO', 18, currentY + 5.5);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text(`Sesiones Evaluadas: ${this.resumen.totalCierres} (${this.resumen.cantidadCuadradas} cuadradas, ${this.resumen.cantidadSobrantes} con sobrante, ${this.resumen.cantidadFaltantes} con faltante)`, 18, currentY + 11);
        doc.text(`Total Facturado: ${this.formatCurrency(this.resumen.totalVentas)}   |   Total Retiros: ${this.formatCurrency(this.resumen.totalRetiros)}`, 18, currentY + 16.5);

        doc.setFont('helvetica', 'bold');
        const difVal = Number(this.resumen.diferenciaNeta) || 0;
        const difColor = difVal >= 0 ? (difVal === 0 ? primaryColor : successColor) : errorColor;
        doc.setTextColor(difColor[0], difColor[1], difColor[2]);
        const balanceSign = difVal > 0 ? '+' : '';
        doc.text(`Balance Neto: ${balanceSign}${this.formatCurrency(difVal)}`, pageWidth - 18, currentY + 11, { align: 'right' });

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        doc.text(`Sobrantes: +${this.formatCurrency(this.resumen.totalSobrantes)}  |  Faltantes: -${this.formatCurrency(this.resumen.totalFaltantes)}`, pageWidth - 18, currentY + 16.5, { align: 'right' });

        currentY += 27;

        // TABLA 1: RESUMEN POR CAJERO
        if (this.consolidadoCajeros && this.consolidadoCajeros.length > 0) {
          doc.setFontSize(9.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.text('CONSOLIDADO POR CAJERO', 14, currentY);
          currentY += 3;

          const headersCaj = [[
            'Cajero', 'Usuario', 'Sesiones', 'Cuadre %',
            'Ventas Fact.', 'Total Retiros', 'Faltantes', 'Sobrantes', 'Balance Neto'
          ]];

          const rowsCaj = this.consolidadoCajeros.map(c => [
            c.nombreCajero || '—',
            `@${c.usuario || '—'}`,
            (c.totalTurnos || 0).toString(),
            `${c.porcentajeEfectividad || 0}%`,
            this.formatCurrency(c.totalVentas),
            this.formatCurrency(c.totalRetiros),
            `-${this.formatCurrency(c.totalFaltantes)}`,
            `+${this.formatCurrency(c.totalSobrantes)}`,
            `${(Number(c.diferenciaAcumulada) || 0) >= 0 ? '+' : ''}${this.formatCurrency(c.diferenciaAcumulada)}`
          ]);

          doc.autoTable({
            startY: currentY,
            head: headersCaj,
            body: rowsCaj,
            theme: 'striped',
            styles: { fontSize: 7.5, cellPadding: 1.8 },
            headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', halign: 'center' },
            columnStyles: {
              0: { cellWidth: 35, halign: 'left' },
              1: { cellWidth: 20, halign: 'left' },
              2: { cellWidth: 16, halign: 'center' },
              3: { cellWidth: 16, halign: 'center' },
              4: { cellWidth: 20, halign: 'right' },
              5: { cellWidth: 20, halign: 'right' },
              6: { cellWidth: 18, halign: 'right', textColor: errorColor },
              7: { cellWidth: 18, halign: 'right', textColor: successColor },
              8: { cellWidth: 19, halign: 'right', fontStyle: 'bold' }
            },
            margin: { left: 14, right: 14, bottom: 20 }
          });

          currentY = doc.lastAutoTable.finalY + 8;
        }

        // TABLA 2: DETALLE DE SESIONES
        if (currentY + 30 > pageHeight - 20) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`DETALLE DE SESIONES Y CIERRES (${this.filteredItems.length} registros)`, 14, currentY);
        currentY += 3;

        const headersSes = [[
          '#', 'Fecha Cierre', 'No. Cierre', 'Caja', 'Cajero',
          'Ef. Inicial', 'Ventas', 'Retiros', 'Esperado', 'Contado', 'Diferencia', 'Condición'
        ]];

        const rowsSes = this.filteredItems.map((s, idx) => [
          (idx + 1).toString(),
          this.formatDate(s.fechaCierre),
          s.codigoCierre || s.codigoApertura || '—',
          s.cajaNombre || '—',
          s.nombreCajero || s.usuario || '—',
          this.formatCurrency(s.efectivoInicial),
          this.formatCurrency(s.ventas),
          this.formatCurrency(s.retiros),
          this.formatCurrency(s.totalEsperado),
          this.formatCurrency(s.totalContado),
          `${Number(s.diferencia) >= 0 ? '+' : ''}${this.formatCurrency(s.diferencia)}`,
          s.estadoLiquidacion || '—'
        ]);

        doc.autoTable({
          startY: currentY,
          head: headersSes,
          body: rowsSes,
          theme: 'striped',
          styles: { fontSize: 7, cellPadding: 1.6 },
          headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', halign: 'center' },
          columnStyles: {
            0: { cellWidth: 6, halign: 'center' },
            1: { cellWidth: 22, halign: 'left' },
            2: { cellWidth: 18, halign: 'left' },
            3: { cellWidth: 18, halign: 'left' },
            4: { cellWidth: 22, halign: 'left' },
            5: { cellWidth: 14, halign: 'right' },
            6: { cellWidth: 14, halign: 'right' },
            7: { cellWidth: 14, halign: 'right' },
            8: { cellWidth: 15, halign: 'right' },
            9: { cellWidth: 15, halign: 'right' },
            10: { cellWidth: 14, halign: 'right' },
            11: { cellWidth: 12, halign: 'center' }
          },
          margin: { left: 14, right: 14, bottom: 20 }
        });

        let finalY = doc.lastAutoTable.finalY + 12;

        if (finalY + 38 > pageHeight - 15) {
          doc.addPage();
          finalY = 25;
        }

        // Signatures
        const sigWidth = 70;
        const leftSigX = 20;
        const rightSigX = pageWidth - 20 - sigWidth;

        doc.setDrawColor(180, 185, 195);
        doc.setLineWidth(0.5);

        doc.line(leftSigX, finalY + 18, leftSigX + sigWidth, finalY + 18);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text('Responsable de Cajas', leftSigX + sigWidth / 2, finalY + 23, { align: 'center' });

        doc.line(rightSigX, finalY + 18, rightSigX + sigWidth, finalY + 18);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text('Firma Auditor / Supervisor', rightSigX + sigWidth / 2, finalY + 23, { align: 'center' });

        // Page numbering on all pages
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setDrawColor(220, 225, 230);
          doc.setLineWidth(0.3);
          doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(130, 135, 145);
          doc.text('Informe Consolidado de Cajas - S.I. Tokes', 14, pageHeight - 7);
          doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
        }

        const blobUrl = doc.output('bloburl');
        window.open(blobUrl, '_blank');
        this.showAlert('Informe general generado en PDF exitosamente.', 'success');
      } catch (err) {
        console.error('Error generando PDF general:', err);
        this.showAlert('Error al generar el PDF del informe.', 'error');
      }
    }
  }
};
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.border-indigo {
  border: 1.5px solid #3f51b5 !important;
}
.border-green {
  border: 1.5px solid #43a047 !important;
}
.border-red {
  border: 1.5px solid #e53935 !important;
}
.cursor-pointer {
  cursor: pointer;
}
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
}
</style>
