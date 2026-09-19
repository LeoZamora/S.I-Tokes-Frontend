<template>
  <div class="w-100 pa-4">
    <!-- Snackbar alertas -->
    <v-snackbar v-model="alert.show" :color="alert.type" timeout="4000" location="top right">
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ alert.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
        <span>{{ alert.message }}</span>
      </div>
    </v-snackbar>

    <!-- Encabezado -->
    <v-card class="border-t border-b mb-4" elevation="0" rounded="0">
      <div class="d-flex align-center justify-space-between flex-wrap pa-2 bg-white">
        <div class="d-flex align-center">
          <v-avatar color="indigo-lighten-5" class="mr-3" size="40">
            <v-icon color="indigo">mdi-safe-square-outline</v-icon>
          </v-avatar>
          <div>
            <span class="text-h6 font-weight-bold d-block">Cierre de Caja y Liquidación</span>
            <span class="text-caption text-grey-darken-1">Cierre de efectivo con arqueo verificado y cierre/devolución de mercadería a bodega</span>
          </div>
        </div>
        <div class="d-flex align-center ga-3">
          <v-btn
            variant="outlined"
            color="indigo"
            size="small"
            prepend-icon="mdi-refresh"
            @click="loadCajas()"
            :loading="loading"
          >
            Actualizar
          </v-btn>
          <!-- Toggle Cards vs Tabla -->
          <v-btn-toggle
            v-model="viewMode"
            mandatory
            variant="outlined"
            color="indigo-darken-4"
            density="compact"
            class="rounded bg-white"
          >
            <v-btn value="grid" icon="mdi-view-grid" size="small" title="Vista Tarjetas" />
            <v-btn value="list" icon="mdi-view-list" size="small" title="Vista Lista" />
          </v-btn-toggle>
        </div>
      </div>
      <v-divider />

      <!-- Tarjetas de Métricas -->
      <v-row class="pa-3 align-center" dense>
        <v-col cols="12" md="3" sm="6">
          <v-card variant="flat" color="amber-lighten-5" class="pa-3 rounded-lg border border-amber-lighten-3">
            <div class="d-flex align-center">
              <v-avatar color="amber-darken-3" class="mr-3 text-white">
                <v-icon>mdi-clipboard-check</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-amber-darken-4 font-weight-bold">Listas para Cerrar (Arqueadas)</div>
                <div class="text-h6 font-weight-black text-amber-darken-4">
                  {{ stats.arqueadas }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-card variant="flat" color="green-lighten-5" class="pa-3 rounded-lg border border-green-lighten-3">
            <div class="d-flex align-center">
              <v-avatar color="green" class="mr-3 text-white">
                <v-icon>mdi-cash-register</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-green-darken-4 font-weight-bold">Aperturadas (Sin Arqueo)</div>
                <div class="text-h6 font-weight-black text-green-darken-4">
                  {{ stats.aperturadas }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-card variant="flat" color="blue-grey-lighten-5" class="pa-3 rounded-lg border border-blue-grey-lighten-2">
            <div class="d-flex align-center">
              <v-avatar color="blue-grey-darken-2" class="mr-3 text-white">
                <v-icon>mdi-package-variant-closed</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-blue-grey-darken-4 font-weight-bold">Mercadería en Cajas Activas</div>
                <div class="text-h6 font-weight-bold text-blue-grey-darken-4">
                  {{ formatCurrency(totalMercaderiaEnCajas) }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-card variant="flat" color="indigo-lighten-5" class="pa-3 rounded-lg border border-indigo-lighten-3">
            <div class="d-flex align-center">
              <v-avatar color="indigo" class="mr-3 text-white">
                <v-icon>mdi-cash-multiple</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-indigo-darken-3 font-weight-bold">Total Efectivo en Cajas</div>
                <div class="text-h6 font-weight-bold text-indigo-darken-4">
                  {{ formatCurrency(totalEfectivoEnCajas) }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- Barra de Filtros -->
    <v-row class="mb-4 align-center" dense>
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="searchQuery"
          label="Buscar caja por nombre, código o bodega..."
          prepend-inner-icon="mdi-magnify"
          density="compact"
          variant="outlined"
          color="indigo"
          hide-details
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="filterEstado"
          :items="[
            { title: 'Todas las cajas activas', value: 'ALL' },
            { title: 'Solo Arqueadas (Listas para cerrar)', value: 'Arqueada' },
            { title: 'Solo Aperturadas (Requieren arqueo)', value: 'Aperturada' }
          ]"
          label="Filtrar por estado"
          density="compact"
          variant="outlined"
          color="indigo"
          hide-details
        />
      </v-col>
    </v-row>

    <!-- Loader -->
    <div v-if="loading" class="d-flex justify-center my-10">
      <v-progress-circular indeterminate color="indigo" size="64" />
    </div>

    <!-- SIN RESULTADOS -->
    <v-alert
      v-else-if="filteredCajas.length === 0"
      type="info"
      variant="tonal"
      class="rounded-lg"
    >
      No se encontraron cajas registradas o que coincidan con la búsqueda.
    </v-alert>

    <!-- VISTA GRID (CARDS LAYOUT) -->
    <v-row v-else-if="viewMode === 'grid'" dense>
      <v-col
        v-for="caja in filteredCajas"
        :key="caja.idCaja"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="rounded elevation-2 overflow-hidden hover-card h-100 d-flex flex-column"
          :style="getCardBorder(caja)"
        >
          <!-- Encabezado de la Tarjeta -->
          <div class="pa-3 bg-indigo-darken-4 text-white d-flex align-center justify-space-between">
            <div>
              <span class="text-subtitle-2 font-weight-bold d-block">{{ caja.nombre }}</span>
              <span class="text-caption text-indigo-lighten-3">Código: {{ caja.codigo || '—' }}</span>
            </div>
            <v-chip
              :color="caja.estadoNombre === 'Arqueada' ? 'amber-darken-3' : (caja.estadoNombre === 'Aperturada' ? 'success' : 'grey')"
              size="x-small"
              variant="flat"
              class="font-weight-bold"
            >
              {{ caja.estadoNombre }}
            </v-chip>
          </div>

          <!-- Cuerpo de la Tarjeta -->
          <div class="pa-3 flex-grow-1 bg-white">
            <div class="text-caption text-grey mb-1 d-flex align-center justify-space-between">
              <div>
                <v-icon size="small" class="mr-1">mdi-warehouse</v-icon>
                Bodega: <span class="font-weight-medium text-grey-darken-3">{{ caja.bodegaNombre }}</span>
              </div>
            </div>
            
            <v-divider class="my-2" />

            <!-- Si la caja está abierta (Aperturada o Arqueada) -->
            <div v-if="caja.isOpen" class="caja-info">
              <!-- Banner de Arqueo si está arqueada -->
              <div v-if="caja.estadoNombre === 'Arqueada' && caja.arqueo" class="mb-2 pa-2 bg-amber-lighten-5 border border-amber rounded">
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon size="small" color="amber-darken-4" class="mr-1">mdi-clipboard-check</v-icon>
                    <span class="text-caption font-weight-bold text-amber-darken-4">Arqueo Verificado:</span>
                  </div>
                  <span class="text-caption font-weight-black text-amber-darken-4">{{ caja.arqueo.codigo }}</span>
                </div>
                <div class="text-caption text-grey-darken-2 mt-0.5 d-flex justify-space-between">
                  <span>Auditor: {{ caja.arqueo.usuarioArqueo }}</span>
                  <span>{{ formatDate(caja.arqueo.fechaArqueo) }}</span>
                </div>
              </div>

              <!-- Banner de advertencia si solo está aperturada -->
              <div v-else-if="caja.estadoNombre === 'Aperturada'" class="mb-2 pa-2 bg-grey-lighten-4 border border-grey-lighten-2 rounded d-flex align-center">
                <v-icon size="small" color="orange-darken-3" class="mr-1.5">mdi-alert-circle-outline</v-icon>
                <span class="text-caption text-grey-darken-3">Requiere arqueo previo antes de cerrar</span>
              </div>

              <div class="d-flex justify-space-between py-1 border-bottom">
                <span class="text-caption text-grey">Apertura:</span>
                <span class="text-body-2 font-weight-bold text-indigo">{{ caja.apertura?.codigo || '—' }}</span>
              </div>
              <div class="d-flex justify-space-between py-1 border-bottom">
                <span class="text-caption text-grey">Cajero:</span>
                <span class="text-body-2 font-weight-medium">{{ caja.apertura?.usuarioAperturaNombre || '—' }}</span>
              </div>
              <div class="d-flex justify-space-between py-1 border-bottom">
                <span class="text-caption text-grey">Fecha Apertura:</span>
                <span class="text-body-2">{{ formatDate(caja.apertura?.fechaApertura) }}</span>
              </div>
              <div class="d-flex justify-space-between py-1 border-bottom">
                <span class="text-caption text-grey">Efectivo Inicial:</span>
                <span class="text-body-2 font-weight-medium">{{ formatCurrency(caja.apertura?.montoAperturaEfectivo) }}</span>
              </div>
              <div class="d-flex justify-space-between py-1 border-bottom">
                <span class="text-caption text-grey">Mercadería Inicial:</span>
                <span class="text-body-2 font-weight-medium text-blue-grey-darken-3">{{ formatCurrency(caja.apertura?.montoAperturaMercaderia) }}</span>
              </div>

              <!-- Resumen Financiero y Mercadería -->
              <div v-if="caja.resumen" class="mt-2 bg-grey-lighten-4 pa-2 rounded border">
                <div class="d-flex justify-space-between py-0.5">
                  <span class="text-caption text-grey">Ventas (Efectivo):</span>
                  <span class="text-caption font-weight-bold text-success">{{ formatCurrency(caja.resumen.totalVentas) }}</span>
                </div>
                <div class="d-flex justify-space-between py-0.5">
                  <span class="text-caption text-grey">Pedidos Realizados:</span>
                  <span class="text-caption font-weight-bold text-indigo">{{ formatCurrency(caja.resumen.totalPedidos) }}</span>
                </div>
                <div class="d-flex justify-space-between py-0.5 align-center">
                  <span class="text-caption text-grey">Mercadería en Caja:</span>
                  <div class="d-flex align-center ga-1">
                    <span
                      class="text-caption font-weight-bold"
                      :class="Number(caja.resumen.totalMercaderia) > 0 ? 'text-blue-grey-darken-3' : 'text-teal'"
                    >
                      {{ formatCurrency(caja.resumen.totalMercaderia) }}
                    </span>
                    <v-icon
                      v-if="Number(caja.resumen.totalMercaderia) === 0"
                      size="14"
                      color="teal"
                      title="Mercadería en cero"
                    >
                      mdi-check-circle
                    </v-icon>
                  </div>
                </div>
                <v-divider class="my-1" />
                <div class="d-flex justify-space-between py-0.5">
                  <span class="text-caption text-grey-darken-3 font-weight-bold">Estimado en Caja (Efectivo):</span>
                  <span class="text-body-2 font-weight-black text-indigo">
                    {{ formatCurrency(Number(caja.resumen.efectivoApertura) + Number(caja.resumen.totalVentas)) }}
                  </span>
                </div>
              </div>
              <div v-else class="d-flex justify-center py-4">
                <v-progress-circular indeterminate size="20" color="indigo" />
              </div>
            </div>
            
            <!-- Si la caja está cerrada -->
            <div v-else class="d-flex flex-column align-center justify-center py-6">
              <v-icon color="grey-lighten-1" size="48">mdi-lock-outline</v-icon>
              <span class="text-caption text-grey-darken-1 mt-2">Caja Cerrada / Sin Sesión Vigente</span>
            </div>
          </div>

          <!-- Pie de la Tarjeta / Acciones -->
          <v-card-actions class="bg-grey-lighten-4 border-t pa-2 d-flex justify-space-between align-center flex-wrap ga-1">
            <!-- Botón Cierre de Mercadería (Siempre disponible si la caja está activa) -->
            <v-btn
              v-if="caja.isOpen"
              color="blue-grey-darken-3"
              variant="tonal"
              size="small"
              class="font-weight-medium"
              prepend-icon="mdi-package-variant-closed"
              title="Devolver / liquidar mercadería remanente a otra bodega"
              @click="openCierreMercaderiaDialog(caja)"
            >
              Cierre Mercadería
            </v-btn>

            <!-- Botón Cierre de Caja (Solo Arqueada) -->
            <v-btn
              v-if="caja.estadoNombre === 'Arqueada'"
              color="indigo"
              variant="flat"
              size="small"
              class="text-white font-weight-bold"
              prepend-icon="mdi-lock"
              @click="openCierreDialog(caja)"
            >
              Cerrar Caja
            </v-btn>
            <v-btn
              v-else-if="caja.estadoNombre === 'Aperturada'"
              color="amber-darken-4"
              variant="tonal"
              size="small"
              class="font-weight-medium"
              prepend-icon="mdi-clipboard-alert-outline"
              disabled
              title="Debe realizar el arqueo de caja antes de cerrarla"
            >
              Requiere Arqueo
            </v-btn>
            <v-btn
              v-else
              color="grey"
              variant="outlined"
              size="small"
              disabled
              prepend-icon="mdi-lock"
            >
              Cerrada
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- VISTA TABLA (LIST LAYOUT) -->
    <v-card v-else class="border rounded-lg" elevation="0">
      <v-data-table
        :headers="headers"
        :items="filteredCajas"
        :loading="loading"
        density="compact"
        class="rounded"
      >
        <template v-slot:item.nombre="{ item }">
          <span class="font-weight-bold">{{ item.nombre }}</span>
        </template>
        <template v-slot:item.estadoNombre="{ item }">
          <v-chip
            :color="item.estadoNombre === 'Arqueada' ? 'amber-darken-3' : (item.estadoNombre === 'Aperturada' ? 'success' : 'grey')"
            size="small"
            variant="flat"
            class="font-weight-bold"
          >
            {{ item.estadoNombre }}
          </v-chip>
        </template>
        <template v-slot:item.aperturaCodigo="{ item }">
          <span v-if="item.isOpen" class="font-weight-bold text-indigo">{{ item.apertura?.codigo || '—' }}</span>
          <span v-else class="text-grey italic">Cerrada</span>
        </template>
        <template v-slot:item.arqueoCodigo="{ item }">
          <v-chip
            v-if="item.arqueo"
            size="x-small"
            color="amber-darken-3"
            variant="tonal"
            class="font-weight-bold"
          >
            <v-icon start size="12">mdi-clipboard-check</v-icon>
            {{ item.arqueo.codigo }}
          </v-chip>
          <span v-else-if="item.estadoNombre === 'Aperturada'" class="text-caption text-orange-darken-4 font-italic">
            Pendiente
          </span>
          <span v-else class="text-caption text-grey">—</span>
        </template>
        <template v-slot:item.usuarioApertura="{ item }">
          <span v-if="item.isOpen">{{ item.apertura?.usuarioAperturaNombre || '—' }}</span>
          <span v-else>—</span>
        </template>
        <template v-slot:item.efectivoApertura="{ item }">
          <span v-if="item.isOpen">{{ formatCurrency(item.apertura?.montoAperturaEfectivo) }}</span>
          <span v-else>—</span>
        </template>
        <template v-slot:item.mercaderiaApertura="{ item }">
          <span v-if="item.isOpen" class="font-weight-medium text-blue-grey-darken-3">
            {{ formatCurrency(item.apertura?.montoAperturaMercaderia) }}
          </span>
          <span v-else>—</span>
        </template>
        <template v-slot:item.totalMercaderia="{ item }">
          <span
            v-if="item.isOpen && item.resumen"
            class="font-weight-bold"
            :class="Number(item.resumen.totalMercaderia) > 0 ? 'text-blue-grey-darken-2' : 'text-teal'"
          >
            {{ formatCurrency(item.resumen.totalMercaderia) }}
          </span>
          <span v-else-if="item.isOpen">
            <v-progress-circular indeterminate size="16" color="indigo" />
          </span>
          <span v-else>—</span>
        </template>
        <template v-slot:item.totalEnCaja="{ item }">
          <span v-if="item.isOpen && item.resumen" class="font-weight-bold text-indigo">
            {{ formatCurrency(Number(item.resumen.efectivoApertura) + Number(item.resumen.totalVentas)) }}
          </span>
          <span v-else-if="item.isOpen">
            <v-progress-circular indeterminate size="16" color="indigo" />
          </span>
          <span v-else>—</span>
        </template>
        <template v-slot:item.opc="{ item }">
          <div class="d-flex align-center justify-center ga-1">
            <v-btn
              v-if="item.isOpen"
              icon="mdi-package-variant-closed"
              color="blue-grey-darken-2"
              variant="tonal"
              size="x-small"
              title="Cierre y Devolución de Mercadería"
              @click="openCierreMercaderiaDialog(item)"
            />
            <v-btn
              v-if="item.estadoNombre === 'Arqueada'"
              color="indigo"
              variant="flat"
              size="small"
              class="text-white"
              prepend-icon="mdi-lock"
              @click="openCierreDialog(item)"
            >
              Cerrar Caja
            </v-btn>
            <v-chip
              v-else-if="item.estadoNombre === 'Aperturada'"
              color="amber-darken-4"
              variant="tonal"
              size="small"
              class="font-weight-medium"
              title="Debe arquearse antes de cerrar"
            >
              Requiere Arqueo
            </v-chip>
            <span v-else class="text-caption text-grey italic">Cerrada</span>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ======================================================== -->
    <!-- DIÁLOGO DE CIERRE DE MERCADERÍA / DEVOLUCIÓN A BODEGA   -->
    <!-- ======================================================== -->
    <v-dialog v-model="dialogs.cierreMercaderia" max-width="1050" persistent>
      <v-card v-if="activeCajaMercaderia" class="rounded-lg elevation-12 bg-grey-lighten-4">
        <!-- Header -->
        <v-card-title class="bg-blue-grey-darken-4 text-white d-flex align-center py-2 px-4">
          <v-avatar size="36" color="white" class="mr-3" variant="flat">
            <v-icon color="blue-grey-darken-4" size="20">mdi-package-variant-closed</v-icon>
          </v-avatar>
          <div>
            <div class="d-flex align-center ga-2">
              <h5 class="text-h6 font-weight-bold text-white mb-0">Cierre de Mercadería: {{ activeCajaMercaderia.nombre }}</h5>
              <v-chip size="x-small" color="blue-grey-lighten-3" class="text-blue-grey-darken-4 font-weight-bold">
                Apertura: {{ activeCajaMercaderia.apertura?.codigo }}
              </v-chip>
            </div>
            <span class="text-caption text-blue-grey-lighten-3 d-block" style="margin-top: -2px;">
              Bodega de Origen: <strong>{{ activeCajaMercaderia.bodegaNombre }}</strong>
            </span>
          </div>
          <v-spacer />
          <v-btn icon size="small" color="white" variant="text" @click="closeCierreMercaderiaDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4" style="max-height: 75vh; overflow-y: auto;">
          <!-- Bloque de Selección de Bodega Destino -->
          <v-card variant="flat" class="pa-3 border bg-white rounded-lg mb-3" elevation="0">
            <v-row dense class="align-center">
              <v-col cols="12" md="6">
                <div class="d-flex align-center">
                  <v-avatar color="blue-grey-lighten-5" size="40" class="mr-3">
                    <v-icon color="blue-grey-darken-3">mdi-warehouse</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-grey-darken-1">Bodega de Origen (Caja)</div>
                    <div class="text-subtitle-2 font-weight-bold text-blue-grey-darken-4">
                      {{ activeCajaMercaderia.bodegaNombre }}
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="formMercaderia.idBodegaDestino"
                  :items="bodegasDestinoDisponibles"
                  item-title="title"
                  item-value="value"
                  label="Bodega de Destino (Recepción) *"
                  prepend-inner-icon="mdi-dolly"
                  density="compact"
                  variant="outlined"
                  color="blue-grey-darken-3"
                  hide-details
                  clearable
                  placeholder="Seleccione la bodega donde se devolverá la mercadería..."
                />
              </v-col>
            </v-row>
          </v-card>

          <!-- Métricas Resumen de Devolución -->
          <v-row dense class="mb-3">
            <v-col cols="12" sm="6" md="2">
              <v-card variant="flat" color="blue-grey-lighten-5" class="pa-2 rounded text-center border">
                <div class="text-caption text-grey-darken-1 font-weight-medium">Mercadería Inicial</div>
                <div class="text-subtitle-1 font-weight-bold text-blue-grey-darken-4">{{ formatCurrency(activeCajaMercaderia.apertura?.montoAperturaMercaderia) }}</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-card variant="flat" color="blue-grey-lighten-5" class="pa-2 rounded text-center border">
                <div class="text-caption text-grey-darken-1 font-weight-medium">Productos en Caja</div>
                <div class="text-subtitle-1 font-weight-bold text-blue-grey-darken-4">{{ mercaderiaItems.length }}</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-card variant="flat" color="indigo-lighten-5" class="pa-2 rounded text-center border">
                <div class="text-caption text-grey-darken-1 font-weight-medium">Unidades a Devolver</div>
                <div class="text-subtitle-1 font-weight-bold text-indigo-darken-4">{{ totalUnidadesADevolver }}</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card variant="flat" color="green-lighten-5" class="pa-2 rounded text-center border">
                <div class="text-caption text-grey-darken-1 font-weight-medium">Total Costo a Devolver</div>
                <div class="text-subtitle-1 font-weight-bold text-green-darken-4">{{ formatCurrency(totalCostoADevolver) }}</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card variant="flat" color="amber-lighten-5" class="pa-2 rounded text-center border">
                <div class="text-caption text-grey-darken-1 font-weight-medium">Total Venta Estimado</div>
                <div class="text-subtitle-1 font-weight-bold text-amber-darken-4">{{ formatCurrency(totalVentaADevolver) }}</div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Tabla de Productos / Detalle y Recepción -->
          <v-card class="pa-3 border bg-white rounded-lg mb-3" elevation="0">
            <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-2">
              <div class="text-subtitle-2 font-weight-bold text-blue-grey-darken-4 d-flex align-center">
                <v-icon size="small" class="mr-1">mdi-clipboard-list-outline</v-icon>
                Detalle y Conteo de Mercadería a Devolver
              </div>
              <div class="d-flex align-center ga-2">
                <v-btn
                  size="x-small"
                  variant="tonal"
                  color="blue-grey-darken-3"
                  prepend-icon="mdi-check-all"
                  @click="devolverTodoMercaderia()"
                >
                  Devolver Todo
                </v-btn>
                <v-btn
                  size="x-small"
                  variant="text"
                  color="grey-darken-2"
                  prepend-icon="mdi-eraser"
                  @click="limpiarCantidadesMercaderia()"
                >
                  Limpiar
                </v-btn>
              </div>
            </div>

            <!-- Loader de Productos -->
            <div v-if="loadingMercaderia" class="d-flex justify-center my-6">
              <v-progress-circular indeterminate color="blue-grey-darken-3" />
            </div>

            <!-- Sin stock en la caja -->
            <v-alert
              v-else-if="mercaderiaItems.length === 0"
              type="info"
              variant="tonal"
              density="compact"
              class="my-2"
            >
              Esta caja no tiene productos con existencias en su bodega asociada. La mercadería ya se encuentra liquidada.
            </v-alert>

            <!-- Tabla de mercadería -->
            <v-table v-else density="compact" class="border rounded">
              <thead>
                <tr class="bg-blue-grey-darken-4 text-white">
                  <th class="text-white font-weight-bold text-caption py-2" style="width: 110px;">Código</th>
                  <th class="text-white font-weight-bold text-caption py-2">Producto</th>
                  <th class="text-white text-center font-weight-bold text-caption py-2" style="width: 120px;">Stock en Caja</th>
                  <th class="text-white text-center font-weight-bold text-caption py-2" style="width: 150px;">Cant. a Devolver</th>
                  <th class="text-white text-right font-weight-bold text-caption py-2" style="width: 110px;">Costo Unit.</th>
                  <th class="text-white text-right font-weight-bold text-caption py-2" style="width: 130px;">Subtotal (C$)</th>
                  <th class="text-white font-weight-bold text-caption py-2" style="width: 180px;">Observación</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in mercaderiaItems" :key="item.idProducto">
                  <td class="text-caption font-weight-bold text-blue-grey-darken-3 py-1">{{ item.codigo }}</td>
                  <td class="text-body-2 font-weight-medium py-1">
                    <div>{{ item.nombre }}</div>
                    <div v-if="item.categoria" class="text-caption text-grey">{{ item.categoria }}</div>
                  </td>
                  <td class="text-center text-body-2 font-weight-bold py-1">
                    <v-chip size="x-small" color="blue-grey-lighten-4" class="font-weight-bold text-blue-grey-darken-4">
                      {{ item.cantidadTotal }} {{ item.unidadMedida || 'und' }}
                    </v-chip>
                  </td>
                  <td class="text-center py-1">
                    <v-text-field
                      v-model.number="item.cantADevolver"
                      type="number"
                      min="0"
                      :max="item.cantidadTotal"
                      density="compact"
                      variant="outlined"
                      color="blue-grey-darken-3"
                      hide-details
                      class="align-center-input"
                      style="max-width: 120px; margin: 0 auto;"
                    />
                  </td>
                  <td class="text-right text-caption py-1">
                    {{ formatCurrency(item.costo) }}
                  </td>
                  <td class="text-right text-body-2 font-weight-bold text-blue-grey-darken-4 py-1">
                    {{ formatCurrency((Number(item.cantADevolver) || 0) * item.costo) }}
                  </td>
                  <td class="py-1">
                    <v-text-field
                      v-model="item.obsADevolver"
                      density="compact"
                      variant="outlined"
                      color="blue-grey-darken-3"
                      hide-details
                      placeholder="Opcional..."
                    />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-grey-lighten-3 font-weight-black">
                  <td colspan="3" class="text-right text-body-2 py-2">Total Unidades Seleccionadas:</td>
                  <td class="text-center text-body-1 text-indigo-darken-4 py-2">{{ totalUnidadesADevolver }}</td>
                  <td class="text-right text-body-2 py-2">Total Costo:</td>
                  <td class="text-right text-subtitle-2 text-green-darken-4 py-2">{{ formatCurrency(totalCostoADevolver) }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </v-table>
          </v-card>

          <!-- Observaciones Generales -->
          <v-textarea
            v-model="formMercaderia.observaciones"
            label="Observaciones Generales de la Devolución"
            rows="2"
            density="compact"
            variant="outlined"
            color="blue-grey-darken-3"
            hide-details
            placeholder="Notas o justificaciones del cierre y retorno de mercadería..."
          />
        </v-card-text>

        <!-- Acciones del Modal -->
        <v-card-actions class="bg-grey-lighten-4 pa-3 border-t">
          <v-spacer />
          <v-btn color="grey-darken-1" variant="outlined" @click="closeCierreMercaderiaDialog()" :disabled="savingMercaderia">
            Cancelar
          </v-btn>
          <v-btn
            color="blue-grey-darken-4"
            class="text-white font-weight-bold"
            variant="flat"
            prepend-icon="mdi-check-circle-outline"
            @click="submitCierreMercaderia()"
            :disabled="savingMercaderia || mercaderiaItems.length === 0"
            :loading="savingMercaderia"
          >
            Confirmar y Devolver Mercadería
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ======================================================== -->
    <!-- DIÁLOGO DE CIERRE DE CAJA (EFECTIVO)                     -->
    <!-- ======================================================== -->
    <v-dialog v-model="dialogs.cierre" max-width="1100" persistent>
      <v-card v-if="activeCaja" class="rounded-lg elevation-12 bg-grey-lighten-4">
        <!-- Header del Diálogo -->
        <v-card-title class="bg-indigo-darken-4 text-white d-flex align-center py-2 px-4">
          <v-avatar size="36" color="white" class="mr-3" variant="flat">
            <v-icon color="indigo" size="20">mdi-lock</v-icon>
          </v-avatar>
          <div>
            <div class="d-flex align-center ga-2">
              <h5 class="text-h6 font-weight-bold text-white mb-0">Cerrar Caja: {{ activeCaja.nombre }}</h5>
              <v-chip size="x-small" color="amber-lighten-2" class="text-indigo-darken-4 font-weight-bold">
                {{ activeCaja.estadoNombre }}
              </v-chip>
            </div>
            <span class="text-caption text-indigo-lighten-3 d-block" style="margin-top: -2px;">
              Apertura: {{ activeCaja.apertura?.codigo }} &bull; Bodega: {{ activeCaja.bodegaNombre }}
            </span>
          </div>
          <v-spacer />
          <v-btn icon size="small" color="white" variant="text" @click="closeCierreDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <!-- BANNER DE REFERENCIA DE ARQUEO -->
        <div class="pa-3 bg-indigo-lighten-5 border-b">
          <v-card variant="outlined" color="indigo" class="bg-white pa-3 rounded-lg" elevation="0">
            <div class="d-flex align-center justify-space-between flex-wrap ga-2">
              <div class="d-flex align-center">
                <v-avatar color="amber-darken-3" size="36" class="text-white mr-3">
                  <v-icon size="20">mdi-clipboard-check</v-icon>
                </v-avatar>
                <div>
                  <div class="d-flex align-center ga-2">
                    <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">
                      Referencia de Arqueo Previo: {{ activeArqueo?.codigo || 'Registrado' }}
                    </span>
                    <v-chip size="x-small" color="success" variant="flat" class="font-weight-bold">
                      Verificado
                    </v-chip>
                  </div>
                  <div class="text-caption text-grey-darken-2">
                    Auditor: <strong>{{ activeArqueo?.usuarioArqueo || activeCaja.apertura?.usuarioAperturaNombre }}</strong> &bull; 
                    Fecha/Hora: {{ formatDate(activeArqueo?.fechaArqueo) }}
                  </div>
                </div>
              </div>

              <!-- Valores del Arqueo -->
              <div class="d-flex align-center ga-4 flex-wrap">
                <div class="text-center px-2 py-1 bg-grey-lighten-4 rounded border">
                  <span class="text-caption text-grey-darken-1 d-block font-weight-medium">Efectivo en Arqueo</span>
                  <span class="text-body-2 font-weight-bold text-indigo-darken-4">
                    {{ formatCurrency(activeArqueo?.montoArqueoEfectivo ?? totalEsperado) }}
                  </span>
                </div>
                <div class="text-center px-2 py-1 bg-grey-lighten-4 rounded border">
                  <span class="text-caption text-grey-darken-1 d-block font-weight-medium">Ventas en Arqueo</span>
                  <span class="text-body-2 font-weight-bold text-success">
                    {{ formatCurrency(activeArqueo?.montoArqueoVentas ?? activeCaja.resumen?.totalVentas) }}
                  </span>
                </div>
                <div class="text-center px-2 py-1 bg-grey-lighten-4 rounded border">
                  <span class="text-caption text-grey-darken-1 d-block font-weight-medium">Retiros en Arqueo</span>
                  <span class="text-body-2 font-weight-bold text-orange-darken-3">
                    {{ formatCurrency(activeArqueo?.montoArqueoRetiros ?? form.montoCierreRetiros) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Observaciones del Arqueo si existen -->
            <div v-if="activeArqueo?.observaciones" class="mt-2 text-caption bg-amber-lighten-5 pa-2 rounded border border-amber-lighten-3 text-amber-darken-4">
              <strong>Nota del Auditor:</strong> {{ activeArqueo.observaciones }}
            </div>
          </v-card>
        </div>

        <!-- TABS DE NAVEGACIÓN -->
        <v-tabs
          v-model="tabCierre"
          color="indigo-darken-4"
          bg-color="white"
          density="comfortable"
          class="border-b"
        >
          <v-tab :value="0" class="text-none font-weight-bold">
            <v-icon start size="18">mdi-calculator-variant</v-icon>
            Saldos y Desglose de Efectivo
          </v-tab>
          <v-tab :value="1" class="text-none font-weight-bold">
            <v-icon start size="18">mdi-receipt-text</v-icon>
            Detalle de Ventas ({{ ventasTurno.length }})
          </v-tab>
          <v-tab :value="2" class="text-none font-weight-bold">
            <v-icon start size="18">mdi-cash-minus</v-icon>
            Detalle de Retiros ({{ retirosTurno.length }})
          </v-tab>
          <v-tab :value="3" class="text-none font-weight-bold">
            <v-icon start size="18">mdi-package-variant-closed</v-icon>
            Mercadería Vendida ({{ mercaderiaVendidaItems.length }})
          </v-tab>
        </v-tabs>

        <!-- CONTENIDO DE LAS TABS -->
        <v-card-text class="pa-4" style="max-height: 70vh; overflow-y: auto;">
          <v-window v-model="tabCierre">
            <!-- TAB 0: SALDOS Y DESGLOSE -->
            <v-window-item :value="0">
              <v-row dense>
                <!-- LADO IZQUIERDO: RESUMEN FINANCIERO -->
                <v-col cols="12" md="4">
                  <v-card class="pa-3 h-100 border bg-white" elevation="0" rounded="lg">
                    <div class="text-subtitle-2 font-weight-bold text-indigo mb-3 d-flex align-center">
                      <v-icon size="small" class="mr-1">mdi-calculator</v-icon>
                      Saldos y Liquidación
                    </div>
                    
                    <div class="py-1.5 border-bottom d-flex justify-space-between">
                      <span class="text-caption text-grey-darken-1">Efectivo Apertura:</span>
                      <span class="text-body-2 font-weight-medium">{{ formatCurrency(activeCaja.apertura?.montoAperturaEfectivo) }}</span>
                    </div>
                    <div class="py-1.5 border-bottom d-flex justify-space-between">
                      <span class="text-caption text-grey-darken-1">Mercadería Inicial:</span>
                      <span class="text-body-2 font-weight-bold text-blue-grey-darken-3">{{ formatCurrency(activeCaja.apertura?.montoAperturaMercaderia) }}</span>
                    </div>
                    <div class="py-1.5 border-bottom d-flex justify-space-between">
                      <span class="text-caption text-grey-darken-1">Ventas Turno:</span>
                      <span class="text-body-2 font-weight-bold text-success">{{ formatCurrency(activeCaja.resumen?.totalVentas) }}</span>
                    </div>
                    <div class="py-1.5 border-bottom d-flex justify-space-between">
                      <span class="text-caption text-grey-darken-1">Pedidos Turno:</span>
                      <span class="text-body-2 font-weight-bold text-indigo">{{ formatCurrency(activeCaja.resumen?.totalPedidos) }}</span>
                    </div>

                    <!-- Estado de Mercadería Remanente -->
                    <div class="py-1.5 border-bottom d-flex justify-space-between align-center">
                      <span class="text-caption text-grey-darken-1">Mercadería en Caja:</span>
                      <div class="d-flex align-center ga-1">
                        <span
                          class="text-body-2 font-weight-bold"
                          :class="Number(activeCaja.resumen?.totalMercaderia) > 0 ? 'text-blue-grey-darken-3' : 'text-teal'"
                        >
                          {{ formatCurrency(activeCaja.resumen?.totalMercaderia) }}
                        </span>
                        <v-btn
                          v-if="Number(activeCaja.resumen?.totalMercaderia) > 0"
                          icon="mdi-package-variant-closed"
                          size="x-small"
                          variant="text"
                          color="blue-grey-darken-3"
                          title="Realizar Cierre de Mercadería"
                          @click="openCierreMercaderiaDialog(activeCaja)"
                        />
                      </div>
                    </div>

                    <!-- Retiros / Gastos -->
                    <div class="mt-3">
                      <div class="d-flex align-center justify-space-between mb-1">
                        <span class="text-caption font-weight-bold text-grey-darken-2">Retiros / Gastos:</span>
                        <v-chip
                          size="x-small"
                          color="orange-darken-4"
                          variant="tonal"
                          class="font-weight-bold cursor-pointer"
                          @click="tabCierre = 2"
                        >
                          {{ retirosTurno.length }} retiro(s)
                        </v-chip>
                      </div>
                      <v-text-field
                        v-model.number="form.montoCierreRetiros"
                        label="Monto Retiros (C$)"
                        type="number"
                        min="0"
                        density="compact"
                        variant="outlined"
                        color="indigo"
                        hide-details
                        prepend-inner-icon="mdi-cash-minus"
                      />
                    </div>

                    <v-textarea
                      v-model="form.observaciones"
                      label="Observaciones del Cierre"
                      rows="3"
                      density="compact"
                      variant="outlined"
                      class="mt-3"
                      color="indigo"
                      hide-details
                      placeholder="Observaciones o notas adicionales de liquidación..."
                    />
                    
                    <v-divider class="my-3" />

                    <!-- COMPARATIVA GENERAL -->
                    <div class="bg-indigo-lighten-5 pa-3 rounded border border-indigo">
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-caption font-weight-bold text-indigo-darken-3">Total Esperado:</span>
                        <span class="text-body-2 font-weight-bold text-indigo-darken-4">{{ formatCurrency(totalEsperado) }}</span>
                      </div>
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-caption font-weight-bold text-indigo-darken-3">Total Contado:</span>
                        <span class="text-body-2 font-weight-bold text-indigo-darken-4">{{ formatCurrency(totalContado) }}</span>
                      </div>
                      <v-divider class="my-1.5" />
                      <div class="d-flex justify-space-between align-center">
                        <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">Diferencia:</span>
                        <v-chip
                          :color="diferencia >= 0 ? (diferencia === 0 ? 'indigo' : 'success') : 'error'"
                          size="small"
                          variant="flat"
                          class="font-weight-black"
                        >
                          {{ diferencia >= 0 ? '+' : '' }} {{ formatCurrency(diferencia) }}
                        </v-chip>
                      </div>
                      <div class="text-center mt-2">
                        <span class="text-caption italic font-weight-bold" :class="diferencia === 0 ? 'text-indigo' : (diferencia > 0 ? 'text-success' : 'text-error')">
                          {{ diferencia === 0 ? 'Caja Cuadrada Exacta' : (diferencia > 0 ? 'Sobrante de Caja' : 'Faltante de Caja') }}
                        </span>
                      </div>
                    </div>
                  </v-card>
                </v-col>

                <!-- LADO DERECHO: DESGLOSE DE EFECTIVO -->
                <v-col cols="12" md="8">
                  <v-card class="pa-3 border bg-white" elevation="0" rounded="lg">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <div class="text-subtitle-2 font-weight-bold text-indigo d-flex align-center">
                        <v-icon size="small" class="mr-1">mdi-table-edit</v-icon>
                        Desglose de Dinero en Caja al Cierre
                      </div>
                      <v-btn
                        size="x-small"
                        variant="text"
                        color="grey-darken-2"
                        prepend-icon="mdi-eraser"
                        @click="limpiarDesglose()"
                      >
                        Limpiar
                      </v-btn>
                    </div>
                    
                    <v-table density="compact" class="border rounded">
                      <thead>
                        <tr class="bg-indigo-darken-4 text-white">
                          <th class="text-white font-weight-bold text-caption py-2">Denominación</th>
                          <th class="text-white text-center font-weight-bold text-caption py-2" style="width: 180px;">Cantidad</th>
                          <th class="text-white text-right font-weight-bold text-caption py-2" style="width: 180px;">Subtotal (C$)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="denom in denominaciones" :key="denom.valor">
                          <td class="text-body-2 font-weight-medium py-1">{{ denom.label }}</td>
                          <td class="text-center py-1">
                            <v-text-field
                              v-model.number="cantidades[denom.valor]"
                              type="number"
                              min="0"
                              density="compact"
                              variant="outlined"
                              hide-details
                              class="align-center-input text-center"
                              style="max-width: 140px; margin: 0 auto;"
                            />
                          </td>
                          <td class="text-right text-body-2 font-weight-bold py-1">
                            {{ formatCurrency(cantidades[denom.valor] * denom.valor) }}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr class="bg-grey-lighten-4">
                          <td colspan="2" class="text-right font-weight-black text-body-2 py-2">Total Efectivo Contado:</td>
                          <td class="text-right font-weight-black text-subtitle-1 text-indigo-darken-4 py-2">
                            {{ formatCurrency(totalContado) }}
                          </td>
                        </tr>
                      </tfoot>
                    </v-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- TAB 1: DETALLE DE VENTAS -->
            <v-window-item :value="1">
              <v-card class="pa-3 border bg-white" elevation="0" rounded="lg">
                <!-- Métricas de Ventas -->
                <v-row dense class="mb-3">
                  <v-col cols="12" sm="3">
                    <v-card variant="flat" color="indigo-lighten-5" class="pa-2 rounded text-center">
                      <div class="text-caption text-grey-darken-1 font-weight-medium">Total Ventas Registradas</div>
                      <div class="text-h6 font-weight-bold text-indigo-darken-4">{{ ventasTurno.length }}</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-card variant="flat" color="green-lighten-5" class="pa-2 rounded text-center">
                      <div class="text-caption text-grey-darken-1 font-weight-medium">Total Facturado (C$)</div>
                      <div class="text-h6 font-weight-bold text-green-darken-4">{{ formatCurrency(totalVentasTurno) }}</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-card variant="flat" color="blue-grey-lighten-5" class="pa-2 rounded text-center">
                      <div class="text-caption text-grey-darken-1 font-weight-medium">Ventas Contado</div>
                      <div class="text-h6 font-weight-bold text-blue-grey-darken-3">{{ formatCurrency(totalVentasContado) }}</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-card variant="flat" color="amber-lighten-5" class="pa-2 rounded text-center">
                      <div class="text-caption text-grey-darken-1 font-weight-medium">Ventas Crédito</div>
                      <div class="text-h6 font-weight-bold text-amber-darken-4">{{ formatCurrency(totalVentasCredito) }}</div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Filtro de Búsqueda de Ventas -->
                <v-text-field
                  v-model="searchVentas"
                  label="Buscar por No. Venta, cliente o vendedor..."
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  variant="outlined"
                  color="indigo"
                  hide-details
                  clearable
                  class="mb-3"
                />

                <!-- Loader de Ventas -->
                <div v-if="loadingVentas" class="d-flex justify-center my-6">
                  <v-progress-circular indeterminate color="indigo" />
                </div>

                <!-- Tabla de Ventas -->
                <v-data-table
                  v-else
                  :headers="headersVentas"
                  :items="filteredVentasTurno"
                  density="compact"
                  class="border rounded"
                  :items-per-page="5"
                >
                  <template v-slot:item.noVenta="{ item }">
                    <span class="font-weight-bold text-indigo">{{ item.noVenta }}</span>
                  </template>
                  <template v-slot:item.fechaRegistro="{ item }">
                    <span class="text-caption">{{ formatDate(item.fechaRegistro) }}</span>
                  </template>
                  <template v-slot:item.credito="{ item }">
                    <v-chip
                      size="x-small"
                      :color="item.credito ? 'amber-darken-3' : 'blue-grey-darken-2'"
                      variant="flat"
                      class="font-weight-bold"
                    >
                      {{ item.credito ? 'Crédito' : 'Contado' }}
                    </v-chip>
                  </template>
                  <template v-slot:item.subtotal="{ item }">
                    <span>{{ formatCurrency(item.subtotal) }}</span>
                  </template>
                  <template v-slot:item.iva="{ item }">
                    <span>{{ formatCurrency(item.iva) }}</span>
                  </template>
                  <template v-slot:item.total="{ item }">
                    <span class="font-weight-bold text-success">{{ formatCurrency(item.total) }}</span>
                  </template>
                  <template v-slot:item.opciones="{ item }">
                    <v-btn
                      icon="mdi-eye"
                      size="x-small"
                      variant="text"
                      color="indigo"
                      title="Ver detalle de factura"
                      @click="verFacturaDetalle(item)"
                    />
                  </template>
                </v-data-table>
              </v-card>
            </v-window-item>

            <!-- TAB 2: DETALLE DE RETIROS -->
            <v-window-item :value="2">
              <v-card class="pa-3 border bg-white" elevation="0" rounded="lg">
                <!-- Métricas de Retiros -->
                <v-row dense class="mb-3">
                  <v-col cols="12" sm="6">
                    <v-card variant="flat" color="orange-lighten-5" class="pa-2 rounded text-center">
                      <div class="text-caption text-grey-darken-1 font-weight-medium">Cantidad de Retiros / Egresos</div>
                      <div class="text-h6 font-weight-bold text-orange-darken-4">{{ retirosTurno.length }}</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-card variant="flat" color="red-lighten-5" class="pa-2 rounded text-center">
                      <div class="text-caption text-grey-darken-1 font-weight-medium">Total de Retiros Realizados</div>
                      <div class="text-h6 font-weight-bold text-red-darken-4">{{ formatCurrency(totalRetirosSum) }}</div>
                    </v-card>
                  </v-col>
                </v-row>

                <v-alert
                  type="info"
                  variant="tonal"
                  density="compact"
                  class="mb-3 text-caption"
                >
                  Los retiros aquí listados fueron registrados durante esta sesión de caja y se deducen automáticamente del efectivo esperado para la liquidación.
                </v-alert>

                <!-- Loader de Retiros -->
                <div v-if="loadingRetiros" class="d-flex justify-center my-6">
                  <v-progress-circular indeterminate color="indigo" />
                </div>

                <!-- Tabla de Retiros -->
                <v-data-table
                  v-else
                  :headers="headersRetiros"
                  :items="retirosTurno"
                  density="compact"
                  class="border rounded"
                  :items-per-page="5"
                >
                  <template v-slot:item.fechaRegistro="{ item }">
                    <span class="text-caption">{{ formatDate(item.fechaRegistro) }}</span>
                  </template>
                  <template v-slot:item.conceptoNombre="{ item }">
                    <span class="font-weight-medium text-grey-darken-4">{{ item.conceptoNombre }}</span>
                  </template>
                  <template v-slot:item.monto="{ item }">
                    <span class="font-weight-bold text-red-darken-3">{{ formatCurrency(item.monto) }}</span>
                  </template>
                  <template v-slot:item.usuarioRegistro="{ item }">
                    <span class="text-caption font-weight-medium">{{ item.usuarioRegistro }}</span>
                  </template>
                  <template v-slot:item.observaciones="{ item }">
                    <span class="text-caption text-grey-darken-1">{{ item.observaciones || '—' }}</span>
                  </template>
                </v-data-table>
              </v-card>
            </v-window-item>

            <!-- TAB 3: DETALLE DE MERCADERÍA VENDIDA -->
            <v-window-item :value="3">
              <v-card class="pa-3 border bg-white" elevation="0" rounded="lg">
                <!-- Métricas de Balance de Mercadería -->
                <v-row dense class="mb-3">
                  <v-col cols="12" sm="6" md="3">
                    <v-card variant="flat" color="indigo-lighten-5" class="pa-2 rounded text-center h-100">
                      <div class="text-caption text-grey-darken-1 font-weight-medium">Mercadería Inicial (Apertura)</div>
                      <div class="text-h6 font-weight-bold text-indigo-darken-4">
                        {{ formatCurrency(activeCaja.apertura?.montoAperturaMercaderia) }}
                      </div>
                      <div class="text-caption text-grey-darken-2" style="font-size: 11px;">Monto con que abrió la sesión</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="6" md="2">
                    <v-card variant="flat" color="blue-grey-lighten-5" class="pa-2 rounded text-center h-100">
                      <div class="text-caption text-grey-darken-1 font-weight-medium">Costo de lo Vendido</div>
                      <div class="text-h6 font-weight-bold text-blue-grey-darken-4">
                        {{ formatCurrency(totalCostoMercaderiaVendida) }}
                      </div>
                      <div class="text-caption text-grey-darken-2" style="font-size: 11px;">Valor de costo de salida</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="6" md="2">
                    <v-card variant="flat" color="green-lighten-5" class="pa-2 rounded text-center h-100">
                      <div class="text-caption text-grey-darken-1 font-weight-medium">Ventas de Mercadería (Sin IVA)</div>
                      <div class="text-h6 font-weight-bold text-green-darken-4">
                        {{ formatCurrency(totalVentaMercaderiaVendida) }}
                      </div>
                      <div class="text-caption text-grey-darken-2" style="font-size: 11px;">Ingreso neto de productos</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-card variant="flat" color="teal-lighten-5" class="pa-2 rounded text-center h-100">
                      <div class="text-caption text-grey-darken-1 font-weight-medium">Saldo Remanente de Mercadería</div>
                      <div class="text-h6 font-weight-bold text-teal-darken-4">
                        {{ formatCurrency(activeCaja.resumen?.totalMercaderia) }}
                      </div>
                      <div class="text-caption text-grey-darken-2" style="font-size: 11px;">Stock actual valorizado en caja</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="6" md="2">
                    <v-card variant="flat" color="amber-lighten-5" class="pa-2 rounded text-center h-100">
                      <div class="text-caption text-grey-darken-1 font-weight-medium">Unidades Vendidas</div>
                      <div class="text-h6 font-weight-bold text-amber-darken-4">
                        {{ totalUnidadesVendidas }}
                      </div>
                      <div class="text-caption text-grey-darken-2" style="font-size: 11px;">Total artículos facturados</div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Filtro de Búsqueda de Mercadería Vendida -->
                <v-text-field
                  v-model="searchMercaderiaVendida"
                  label="Buscar por código, producto o categoría..."
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  variant="outlined"
                  color="indigo"
                  hide-details
                  clearable
                  class="mb-3"
                />

                <!-- Loader de Mercadería Vendida -->
                <div v-if="loadingMercaderiaVendida" class="d-flex justify-center my-6">
                  <v-progress-circular indeterminate color="indigo" />
                </div>

                <!-- Tabla de Mercadería Vendida -->
                <v-data-table
                  v-else
                  :headers="headersMercaderiaVendida"
                  :items="filteredMercaderiaVendida"
                  density="compact"
                  class="border rounded"
                  :items-per-page="5"
                >
                  <template v-slot:item.codigo="{ item }">
                    <span class="font-weight-bold text-indigo">{{ item.codigo || 'S/C' }}</span>
                  </template>
                  <template v-slot:item.nombre="{ item }">
                    <div class="font-weight-medium text-grey-darken-4">{{ item.nombre }}</div>
                  </template>
                  <template v-slot:item.categoria="{ item }">
                    <v-chip size="x-small" color="blue-grey" variant="tonal" class="font-weight-medium">
                      {{ item.categoria || 'General' }}
                    </v-chip>
                  </template>
                  <template v-slot:item.cantidadVendida="{ item }">
                    <span class="font-weight-bold text-blue-grey-darken-3">
                      {{ item.cantidadVendida }} {{ item.unidadMedida || '' }}
                    </span>
                  </template>
                  <template v-slot:item.costoUnitario="{ item }">
                    <span>{{ formatCurrency(item.costoUnitario) }}</span>
                  </template>
                  <template v-slot:item.totalCosto="{ item }">
                    <span class="font-weight-bold text-blue-grey-darken-3">{{ formatCurrency(item.totalCosto) }}</span>
                  </template>
                  <template v-slot:item.precioUnitario="{ item }">
                    <span>{{ formatCurrency(item.precioUnitario) }}</span>
                  </template>
                  <template v-slot:item.totalVenta="{ item }">
                    <span class="font-weight-bold text-success">{{ formatCurrency(item.totalVenta) }}</span>
                  </template>
                </v-data-table>
              </v-card>
            </v-window-item>
          </v-window>
        </v-card-text>

        <!-- Acciones del Diálogo -->
        <v-card-actions class="bg-grey-lighten-4 pa-3 border-t">
          <v-spacer />
          <v-btn color="grey-darken-1" variant="outlined" @click="closeCierreDialog()" :disabled="saving">
            Cancelar
          </v-btn>
          <v-btn color="indigo" class="text-white font-weight-bold" variant="flat" @click="submitCierre()" :disabled="saving" :loading="saving">
            Confirmar y Cerrar Caja
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para ver detalle completo de una Factura -->
    <ViewVenta
      v-if="viewFactura.show"
      :show="viewFactura.show"
      :factura="viewFactura.item"
      @closeDialog="viewFactura.show = false"
    />
  </div>
</template>

<script>
import RequestHttp from '@/services/requestHttp';
import ViewVenta from '@/components/movimientos/Ventas/ViewVenta.vue';

export default {
  name: 'CierreCajaView',
  
  components: {
    ViewVenta
  },
  
  data() {
    return {
      requestHttp: new RequestHttp(),
      loading: false,
      saving: false,
      savingMercaderia: false,
      viewMode: 'grid',
      searchQuery: '',
      filterEstado: 'ALL',
      tabCierre: 0,
      
      stats: {
        arqueadas: 0,
        aperturadas: 0,
        cerradas: 0
      },
      
      data: {
        cajas: [],
        bodegas: []
      },
      
      headers: [
        { title: 'Caja', key: 'nombre', align: 'start', sortable: true },
        { title: 'Código', key: 'codigo', align: 'center', sortable: true },
        { title: 'Bodega', key: 'bodegaNombre', align: 'start', sortable: true },
        { title: 'Estado', key: 'estadoNombre', align: 'center', sortable: true },
        { title: 'Código Apertura', key: 'aperturaCodigo', align: 'center', sortable: false },
        { title: 'Ref. Arqueo', key: 'arqueoCodigo', align: 'center', sortable: false },
        { title: 'Responsable', key: 'usuarioApertura', align: 'start', sortable: false },
        { title: 'Efectivo Inicial', key: 'efectivoApertura', align: 'end', sortable: false },
        { title: 'Mercadería Inicial', key: 'mercaderiaApertura', align: 'end', sortable: false },
        { title: 'Mercadería Actual', key: 'totalMercaderia', align: 'end', sortable: false },
        { title: 'Total en Caja', key: 'totalEnCaja', align: 'end', sortable: false },
        { title: 'Opciones', key: 'opc', align: 'center', sortable: false }
      ],
      
      // Detalle de Ventas
      headersVentas: [
        { title: 'No. Venta', key: 'noVenta', align: 'start', sortable: true },
        { title: 'Fecha / Hora', key: 'fechaRegistro', align: 'start', sortable: true },
        { title: 'Cliente', key: 'cliente', align: 'start', sortable: true },
        { title: 'Tipo Venta', key: 'tipoVenta', align: 'start', sortable: false },
        { title: 'Condición', key: 'credito', align: 'center', sortable: false },
        { title: 'Vendedor', key: 'usuarioRegistro', align: 'start', sortable: false },
        { title: 'Subtotal', key: 'subtotal', align: 'end', sortable: false },
        { title: 'IVA', key: 'iva', align: 'end', sortable: false },
        { title: 'Total', key: 'total', align: 'end', sortable: true },
        { title: 'Detalle', key: 'opciones', align: 'center', sortable: false }
      ],
      ventasTurno: [],
      loadingVentas: false,
      searchVentas: '',
      
      // Detalle de Retiros
      headersRetiros: [
        { title: 'Fecha / Hora', key: 'fechaRegistro', align: 'start', sortable: true },
        { title: 'Concepto', key: 'conceptoNombre', align: 'start', sortable: true },
        { title: 'Monto (C$)', key: 'monto', align: 'end', sortable: true },
        { title: 'Usuario', key: 'usuarioRegistro', align: 'start', sortable: false },
        { title: 'Observaciones', key: 'observaciones', align: 'start', sortable: false }
      ],
      retirosTurno: [],
      loadingRetiros: false,

      // Detalle de Mercadería Vendida (Tab 4)
      headersMercaderiaVendida: [
        { title: 'Código', key: 'codigo', align: 'start', sortable: true },
        { title: 'Producto', key: 'nombre', align: 'start', sortable: true },
        { title: 'Categoría', key: 'categoria', align: 'start', sortable: true },
        { title: 'Cant. Vendida', key: 'cantidadVendida', align: 'end', sortable: true },
        { title: 'Costo Unit. (C$)', key: 'costoUnitario', align: 'end', sortable: true },
        { title: 'Total Costo (C$)', key: 'totalCosto', align: 'end', sortable: true },
        { title: 'Precio Prom. (C$)', key: 'precioUnitario', align: 'end', sortable: true },
        { title: 'Total Venta (C$)', key: 'totalVenta', align: 'end', sortable: true }
      ],
      mercaderiaVendidaItems: [],
      loadingMercaderiaVendida: false,
      searchMercaderiaVendida: '',
      catalogoProductos: [],
      
      // Cierre de Mercadería
      activeCajaMercaderia: null,
      mercaderiaItems: [],
      loadingMercaderia: false,
      formMercaderia: {
        idBodegaDestino: null,
        observaciones: ''
      },
      
      activeCaja: null,
      activeArqueo: null,
      
      dialogs: {
        cierre: false,
        cierreMercaderia: false
      },
      
      viewFactura: {
        show: false,
        item: null
      },
      
      form: {
        montoCierreRetiros: 0,
        observaciones: ''
      },
      
      denominaciones: [
        { valor: 1000, label: 'Billetes de C$ 1000' },
        { valor: 500, label: 'Billetes de C$ 500' },
        { valor: 200, label: 'Billetes de C$ 200' },
        { valor: 100, label: 'Billetes de C$ 100' },
        { valor: 50, label: 'Billetes de C$ 50' },
        { valor: 20, label: 'Billetes de C$ 20' },
        { valor: 10, label: 'Billetes de C$ 10' },
        { valor: 5, label: 'Monedas de C$ 5' },
        { valor: 1, label: 'Monedas de C$ 1' },
        { valor: 0.5, label: 'Monedas de C$ 0.50' }
      ],
      
      cantidades: {
        1000: 0,
        500: 0,
        200: 0,
        100: 0,
        50: 0,
        20: 0,
        10: 0,
        5: 0,
        1: 0,
        0.5: 0
      },
      
      alert: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },
  
  computed: {
    filteredCajas() {
      let result = this.data.cajas;
      
      if (this.filterEstado !== 'ALL') {
        result = result.filter(c => c.estadoNombre === this.filterEstado);
      }
      
      if (!this.searchQuery) return result;
      const query = this.searchQuery.toLowerCase();
      return result.filter(c => 
        c.nombre.toLowerCase().includes(query) || 
        (c.codigo && c.codigo.toLowerCase().includes(query)) ||
        (c.bodegaNombre && c.bodegaNombre.toLowerCase().includes(query))
      );
    },
    
    bodegasDestinoDisponibles() {
      if (!this.activeCajaMercaderia) return [];
      const origenId = this.activeCajaMercaderia.idBodega;
      return (this.data.bodegas || [])
        .filter(b => b.idBodega !== origenId && b.estado !== false)
        .map(b => ({
          title: `${b.nombre} (${b.codigo || 'S/C'}${b.tipoBodega ? ' - ' + b.tipoBodega : ''})`,
          value: b.idBodega
        }));
    },
    
    totalUnidadesADevolver() {
      return this.mercaderiaItems.reduce((sum, i) => sum + (Number(i.cantADevolver) || 0), 0);
    },
    
    totalCostoADevolver() {
      return this.mercaderiaItems.reduce((sum, i) => sum + ((Number(i.cantADevolver) || 0) * (Number(i.costo) || 0)), 0);
    },
    
    totalVentaADevolver() {
      return this.mercaderiaItems.reduce((sum, i) => sum + ((Number(i.cantADevolver) || 0) * (Number(i.precio) || 0)), 0);
    },
    
    filteredVentasTurno() {
      if (!this.searchVentas) return this.ventasTurno;
      const query = this.searchVentas.toLowerCase();
      return this.ventasTurno.filter(v => 
        (v.noVenta && v.noVenta.toString().toLowerCase().includes(query)) ||
        (v.cliente && v.cliente.toLowerCase().includes(query)) ||
        (v.usuarioRegistro && v.usuarioRegistro.toLowerCase().includes(query))
      );
    },
    
    totalVentasTurno() {
      return this.ventasTurno.reduce((sum, v) => sum + (Number(v.total) || 0), 0);
    },
    
    totalVentasContado() {
      return this.ventasTurno
        .filter(v => !v.credito)
        .reduce((sum, v) => sum + (Number(v.total) || 0), 0);
    },
    
    totalVentasCredito() {
      return this.ventasTurno
        .filter(v => v.credito)
        .reduce((sum, v) => sum + (Number(v.total) || 0), 0);
    },
    
    totalRetirosSum() {
      return this.retirosTurno.reduce((sum, r) => sum + (Number(r.monto) || 0), 0);
    },
    
    totalEfectivoEnCajas() {
      return this.data.cajas
        .filter(c => c.isOpen && c.resumen)
        .reduce((sum, c) => sum + (Number(c.resumen.efectivoApertura || 0) + Number(c.resumen.totalVentas || 0)), 0);
    },

    totalMercaderiaEnCajas() {
      return this.data.cajas
        .filter(c => c.isOpen && c.resumen)
        .reduce((sum, c) => sum + Number(c.resumen.totalMercaderia || 0), 0);
    },
    
    totalContado() {
      return this.denominaciones.reduce((sum, d) => {
        const qty = Number(this.cantidades[d.valor]) || 0;
        return sum + (qty * d.valor);
      }, 0);
    },
    
    totalEsperado() {
      if (!this.activeCaja || !this.activeCaja.resumen) return 0;
      const res = this.activeCaja.resumen;
      const expected = Number(res.efectivoApertura) + Number(res.totalVentas);
      return expected;
    },
    
    diferencia() {
      return this.totalContado - this.totalEsperado - Number(this.form.montoCierreRetiros || 0);
    },

    filteredMercaderiaVendida() {
      if (!this.searchMercaderiaVendida) return this.mercaderiaVendidaItems;
      const query = this.searchMercaderiaVendida.toLowerCase();
      return this.mercaderiaVendidaItems.filter(i =>
        (i.codigo && i.codigo.toLowerCase().includes(query)) ||
        (i.nombre && i.nombre.toLowerCase().includes(query)) ||
        (i.categoria && i.categoria.toLowerCase().includes(query))
      );
    },

    totalCostoMercaderiaVendida() {
      return this.mercaderiaVendidaItems.reduce((sum, i) => sum + (Number(i.totalCosto) || 0), 0);
    },

    totalVentaMercaderiaVendida() {
      return this.mercaderiaVendidaItems.reduce((sum, i) => sum + (Number(i.totalVenta) || 0), 0);
    },

    totalUnidadesVendidas() {
      return this.mercaderiaVendidaItems.reduce((sum, i) => sum + (Number(i.cantidadVendida) || 0), 0);
    },

    totalUtilidadMercaderiaVendida() {
      return this.totalVentaMercaderiaVendida - this.totalCostoMercaderiaVendida;
    }
  },
  
  mounted() {
    this.loadCajas();
    this.loadBodegas();
  },
  
  methods: {
    showAlert(msg, type = 'success') {
      this.alert.message = msg;
      this.alert.type = type;
      this.alert.show = true;
    },
    
    async loadBodegas() {
      try {
        const res = await this.requestHttp.getBodegas();
        if (res.code === 200 && Array.isArray(res.data)) {
          this.data.bodegas = res.data;
        }
      } catch (e) {
        console.error('Error loading bodegas:', e);
      }
    },
    
    async loadCajas() {
      this.loading = true;
      try {
        const [resCajas, resArqueos] = await Promise.all([
          this.requestHttp.getCajas(),
          this.requestHttp.getArqueosCaja()
        ]);

        const arqueosList = (resArqueos.code === 200 && Array.isArray(resArqueos.data)) ? resArqueos.data : [];

        if (resCajas.code === 200) {
          const mapped = resCajas.data.map(c => {
            const isOpen = c.estadoNombre === 'Aperturada' || c.estadoNombre === 'Arqueada';
            return {
              ...c,
              isOpen,
              apertura: null,
              resumen: null,
              arqueo: null
            };
          });

          // Calculate statistics
          this.stats.arqueadas = mapped.filter(c => c.estadoNombre === 'Arqueada').length;
          this.stats.aperturadas = mapped.filter(c => c.estadoNombre === 'Aperturada').length;
          this.stats.cerradas = mapped.filter(c => !c.isOpen).length;

          // Show boxes with an active open session
          this.data.cajas = mapped.filter(c => c.isOpen);
          
          await Promise.all(this.data.cajas.map(async (caja) => {
            await this.loadBoxDetails(caja, arqueosList);
          }));
        } else {
          this.showAlert('No se pudieron obtener las cajas', 'error');
        }
      } catch (e) {
        console.error(e);
        this.showAlert('Error al procesar consulta de cajas', 'error');
      } finally {
        this.loading = false;
      }
    },
    
    async loadBoxDetails(caja, arqueosList = []) {
      try {
        const [apRes, resRes] = await Promise.all([
          this.requestHttp.getCajaAperturaVigente(caja.idCaja),
          this.requestHttp.getCajaAperturaVigenteResumen(caja.idCaja)
        ]);
        
        if (apRes.code === 200 && apRes.data) {
          caja.apertura = apRes.data;
          // Associate matching arqueo if available
          if (caja.apertura.idAperturaCaja && arqueosList.length > 0) {
            caja.arqueo = arqueosList.find(a => a.idAperturaCaja === caja.apertura.idAperturaCaja && a.estado !== false) || null;
          }
        }
        if (resRes.code === 200 && resRes.data) {
          caja.resumen = resRes.data;
        }
      } catch (e) {
        console.error(`Error loading details for box ${caja.idCaja}:`, e);
      }
    },
    
    getCardBorder(caja) {
      if (caja.estadoNombre === 'Arqueada') {
        return 'border-top: 4px solid #ff9800 !important;';
      } else if (caja.estadoNombre === 'Aperturada') {
        return 'border-top: 4px solid #4caf50 !important;';
      }
      return 'border-top: 4px solid #9e9e9e !important;';
    },
    
    formatCurrency(val) {
      if (val === null || val === undefined) return 'C$ 0.00';
      return new Intl.NumberFormat('es-NI', {
        style: 'currency',
        currency: 'NIO'
      }).format(val);
    },
    
    formatDate(dateString) {
      if (!dateString) return '—';
      const date = new Date(dateString);
      return date.toLocaleString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    limpiarDesglose() {
      this.denominaciones.forEach(d => {
        this.cantidades[d.valor] = 0;
      });
    },
    
    verFacturaDetalle(venta) {
      this.viewFactura.item = venta;
      this.viewFactura.show = true;
    },
    
    // ==========================================
    // CIERRE DE MERCADERÍA
    // ==========================================
    async openCierreMercaderiaDialog(caja) {
      this.activeCajaMercaderia = caja;
      this.formMercaderia = {
        idBodegaDestino: null,
        observaciones: ''
      };
      this.mercaderiaItems = [];
      this.dialogs.cierreMercaderia = true;
      this.loadingMercaderia = true;

      try {
        if (!caja.apertura) {
          await this.loadBoxDetails(caja);
        }

        const res = await this.requestHttp.getCajaStockMercaderia(caja.idCaja);
        if (res.code === 200 && Array.isArray(res.data)) {
          this.mercaderiaItems = res.data.map(p => ({
            ...p,
            cantADevolver: p.cantidadTotal, // Default devolver todo el stock
            obsADevolver: ''
          }));
        } else {
          this.showAlert('No se pudo obtener el stock de mercadería de la caja', 'warning');
        }
      } catch (e) {
        console.error('Error opening cierre mercaderia:', e);
        this.showAlert('Error al consultar stock de mercadería', 'error');
      } finally {
        this.loadingMercaderia = false;
      }
    },
    
    closeCierreMercaderiaDialog() {
      this.dialogs.cierreMercaderia = false;
      this.activeCajaMercaderia = null;
      this.mercaderiaItems = [];
    },
    
    devolverTodoMercaderia() {
      this.mercaderiaItems.forEach(i => {
        i.cantADevolver = i.cantidadTotal;
      });
    },
    
    limpiarCantidadesMercaderia() {
      this.mercaderiaItems.forEach(i => {
        i.cantADevolver = 0;
      });
    },
    
    async submitCierreMercaderia() {
      if (!this.formMercaderia.idBodegaDestino) {
        this.showAlert('Debe seleccionar la bodega de destino para la devolución.', 'warning');
        return;
      }

      if (!this.activeCajaMercaderia?.apertura?.idAperturaCaja) {
        this.showAlert('No se encontró la apertura de caja activa.', 'error');
        return;
      }

      const itemsADevolver = this.mercaderiaItems
        .filter(i => Number(i.cantADevolver) > 0)
        .map(i => ({
          idProducto: i.idProducto,
          cantidad: Number(i.cantADevolver),
          observaciones: i.obsADevolver || null
        }));

      if (itemsADevolver.length === 0) {
        this.showAlert('Debe ingresar una cantidad mayor a cero para al menos un producto.', 'warning');
        return;
      }

      // Validar que no se exceda el stock
      for (const item of this.mercaderiaItems) {
        if (Number(item.cantADevolver) > Number(item.cantidadTotal)) {
          this.showAlert(`La cantidad a devolver de "${item.nombre}" no puede superar el stock actual (${item.cantidadTotal}).`, 'error');
          return;
        }
      }

      this.savingMercaderia = true;
      try {
        const payload = {
          idAperturaCaja: this.activeCajaMercaderia.apertura.idAperturaCaja,
          idBodegaDestino: this.formMercaderia.idBodegaDestino,
          observaciones: this.formMercaderia.observaciones || null,
          detalles: itemsADevolver
        };

        const res = await this.requestHttp.postCierreMercaderia(payload);
        if (res.code === 200) {
          const refCode = res.data?.data?.referencia || res.data?.referencia || '';
          this.showAlert(`Cierre de mercadería procesado con éxito. Movimiento: ${refCode}`, 'success');
          this.closeCierreMercaderiaDialog();
          await this.loadCajas();
        } else {
          let errorMsg = 'Error al procesar el cierre de mercadería';
          if (res.data?.msg) {
            errorMsg = res.data.msg;
            if (res.data.ex) errorMsg += `: ${res.data.ex}`;
          }
          this.showAlert(errorMsg, 'error');
        }
      } catch (e) {
        console.error(e);
        this.showAlert('Error al procesar la devolución de mercadería', 'error');
      } finally {
        this.savingMercaderia = false;
      }
    },
    
    // ==========================================
    // CIERRE DE EFECTIVO
    // ==========================================
    async openCierreDialog(caja) {
      this.activeCaja = caja;
      this.tabCierre = 0;
      this.searchVentas = '';
      this.searchMercaderiaVendida = '';
      this.mercaderiaVendidaItems = [];
      
      this.form = {
        montoCierreRetiros: 0,
        observaciones: ''
      };
      
      this.limpiarDesglose();

      if (!caja.apertura || !caja.resumen) {
        await this.loadBoxDetails(caja);
      }

      this.activeArqueo = caja.arqueo || null;
      
      // Open dialog
      this.dialogs.cierre = true;

      // Load Arqueo details, Ventas, and Retiros in parallel
      await Promise.all([
        this.loadArqueoData(caja),
        this.loadVentasData(caja),
        this.loadRetirosData(caja)
      ]);
    },
    
    async loadArqueoData(caja) {
      try {
        if (!this.activeArqueo) {
          const res = await this.requestHttp.getArqueosCaja();
          if (res.code === 200 && Array.isArray(res.data)) {
            this.activeArqueo = res.data.find(a => a.idAperturaCaja === caja.apertura?.idAperturaCaja && a.estado !== false) || null;
            caja.arqueo = this.activeArqueo;
          }
        }
      } catch (e) {
        console.error('Error loading arqueo for closure:', e);
      }
    },
    
    async loadVentasData(caja) {
      this.loadingVentas = true;
      this.loadingMercaderiaVendida = true;
      this.ventasTurno = [];
      this.mercaderiaVendidaItems = [];
      try {
        const payload = {
          idCaja: caja.idCaja
        };
        if (caja.apertura?.fechaApertura) {
          payload.desde = caja.apertura.fechaApertura;
        }

        const [resVentas, resProductos] = await Promise.all([
          this.requestHttp.getVentasLista(payload),
          this.catalogoProductos?.length ? Promise.resolve({ code: 200, data: this.catalogoProductos }) : this.requestHttp.getProductos()
        ]);

        let catalogo = [];
        if (resProductos.code === 200 && Array.isArray(resProductos.data)) {
          catalogo = resProductos.data;
          this.catalogoProductos = catalogo;
        }

        if (resVentas.code === 200 && Array.isArray(resVentas.data)) {
          // Filter by active apertura if present
          if (caja.apertura?.idAperturaCaja) {
            this.ventasTurno = resVentas.data.filter(v => !v.idAperturaCaja || v.idAperturaCaja === caja.apertura.idAperturaCaja);
          } else {
            this.ventasTurno = resVentas.data;
          }

          if (this.ventasTurno.length > 0) {
            const detallesResponses = await Promise.all(
              this.ventasTurno.map(v => this.requestHttp.getByIdVenta(v.idVenta))
            );

            const mapProductos = new Map();
            for (const res of detallesResponses) {
              if (res.code === 200 && res.data && Array.isArray(res.data.detalleVenta)) {
                for (const item of res.data.detalleVenta) {
                  const idProd = item.idProducto;
                  const cant = Number(item.cantidad) || 0;
                  const costoUnit = Number(item.costoUnitario) || 0;
                  const precioUnit = Number(item.precioUnitario) || 0;
                  const totalLineaCosto = cant * costoUnit;
                  const totalLineaVenta = cant * precioUnit;

                  if (!mapProductos.has(idProd)) {
                    const prodInfo = catalogo.find(p => p.idProducto === idProd) || {};
                    mapProductos.set(idProd, {
                      idProducto: idProd,
                      codigo: prodInfo.codigo || item.codigo || `P-${idProd}`,
                      nombre: prodInfo.nombre || item.producto || `Producto #${idProd}`,
                      categoria: prodInfo.categoria || prodInfo.subCategoria || '- - -',
                      unidadMedida: prodInfo.unidadMedida || prodInfo.unidadMedidaVenta || 'Und',
                      cantidadVendida: 0,
                      costoUnitario: costoUnit || Number(prodInfo.costo) || 0,
                      totalCosto: 0,
                      totalVenta: 0
                    });
                  }

                  const prodAcc = mapProductos.get(idProd);
                  prodAcc.cantidadVendida += cant;
                  prodAcc.totalCosto += totalLineaCosto;
                  prodAcc.totalVenta += totalLineaVenta;
                  if (costoUnit > 0) prodAcc.costoUnitario = costoUnit;
                }
              }
            }

            this.mercaderiaVendidaItems = Array.from(mapProductos.values()).map(item => {
              const precioProm = item.cantidadVendida > 0 ? (item.totalVenta / item.cantidadVendida) : 0;
              const margen = item.totalVenta - item.totalCosto;
              const margenPorc = item.totalVenta > 0 ? (margen / item.totalVenta) * 100 : 0;
              return {
                ...item,
                precioUnitario: precioProm,
                margen,
                margenPorcentaje: margenPorc
              };
            });
          }
        }
      } catch (e) {
        console.error('Error loading ventas and mercaderia for caja:', e);
      } finally {
        this.loadingVentas = false;
        this.loadingMercaderiaVendida = false;
      }
    },
    
    async loadRetirosData(caja) {
      this.loadingRetiros = true;
      this.retirosTurno = [];
      try {
        if (caja.apertura?.idAperturaCaja) {
          const res = await this.requestHttp.getRetirosCaja({ idAperturaCaja: caja.apertura.idAperturaCaja });
          if (res.code === 200 && Array.isArray(res.data)) {
            this.retirosTurno = res.data;
            const sumRetiros = this.retirosTurno.reduce((acc, r) => acc + (Number(r.monto) || 0), 0);
            this.form.montoCierreRetiros = sumRetiros;
          }
        }
      } catch (e) {
        console.error('Error loading retiros for caja:', e);
      } finally {
        this.loadingRetiros = false;
      }
    },
    
    closeCierreDialog() {
      this.dialogs.cierre = false;
      this.activeCaja = null;
      this.activeArqueo = null;
      this.ventasTurno = [];
      this.retirosTurno = [];
      this.mercaderiaVendidaItems = [];
      this.searchMercaderiaVendida = '';
    },
    
    async submitCierre() {
      if (this.form.montoCierreRetiros < 0) {
        this.showAlert('El monto de retiros no puede ser negativo', 'warning');
        return;
      }

      if (!this.activeCaja || !this.activeCaja.apertura?.idAperturaCaja) {
        this.showAlert('No se encontró una apertura de caja activa o válida para cerrar.', 'error');
        return;
      }

      // Validar que la caja esté arqueada
      if (this.activeCaja.estadoNombre !== 'Arqueada') {
        this.showAlert('La caja debe ser arqueada previamente antes de poder cerrarla.', 'warning');
        return;
      }
      
      this.saving = true;
      
      const desgloceDetalle = this.denominaciones
        .map(d => ({
          ValorDenominacion: d.valor,
          Cantidad: Number(this.cantidades[d.valor]) || 0
        }))
        .filter(d => d.Cantidad > 0);
        
      const reqData = {
        IdAperturaCaja: this.activeCaja.apertura.idAperturaCaja,
        MontoCierreRetiros: Number(this.form.montoCierreRetiros) || 0,
        Observaciones: this.form.observaciones || null,
        DesgloceDetalle: desgloceDetalle
      };
      
      try {
        const res = await this.requestHttp.postCierreCaja(reqData);
        if (res.code === 200) {
          this.showAlert('El cierre de caja se ha procesado exitosamente', 'success');
          this.closeCierreDialog();
          await this.loadCajas();
        } else {
          let errorMsg = 'Error al guardar el cierre de caja';
          if (res.data) {
            if (res.data.msg) {
              errorMsg = res.data.msg;
              if (res.data.ex) {
                errorMsg += `: ${res.data.ex}`;
              }
            } else if (res.data.errors) {
              const errorsList = Object.values(res.data.errors).flat();
              if (errorsList.length > 0) {
                errorMsg = errorsList.join(' | ');
              }
            }
          }
          this.showAlert(errorMsg, 'error');
        }
      } catch (e) {
        console.error(e);
        this.showAlert('Error al enviar la solicitud de cierre de caja', 'error');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.border-indigo {
  border: 1.5px solid #3f51b5 !important;
}
.italic {
  font-style: italic;
}
.cursor-pointer {
  cursor: pointer;
}
.align-center-input :deep(input) {
  text-align: center !important;
}
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
}
</style>
