<template>
  <div class="w-100 pa-4">
    <!-- Snackbar de alertas -->
    <v-snackbar v-model="alert.show" :color="alert.type" timeout="4000" location="top right">
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ alert.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
        <span>{{ alert.message }}</span>
      </div>
    </v-snackbar>

    <!-- Encabezado y Métricas -->
    <v-card class="border-t border-b mb-4" elevation="0" rounded="0">
      <div class="d-flex align-center justify-space-between flex-wrap pa-3 bg-white">
        <div class="d-flex align-center">
          <v-avatar color="indigo-lighten-5" class="mr-3" size="44">
            <v-icon color="indigo-darken-3" size="26">mdi-lock-open-check-outline</v-icon>
          </v-avatar>
          <div>
            <span class="text-h6 font-weight-bold d-block text-indigo-darken-4">Apertura de Caja</span>
            <span class="text-caption text-grey-darken-1">Gestión de inicio de sesión de caja, fondos iniciales y control de turnos</span>
          </div>
        </div>

        <div class="d-flex align-center ga-3 flex-wrap">
          <!-- Pestañas de Vista -->
          <v-tabs v-model="activeTab" color="indigo-darken-3" density="compact">
            <v-tab value="cajas" class="text-none font-weight-bold">
              <v-icon start size="18">mdi-cash-register</v-icon>
              Cajas Disponibles
            </v-tab>
            <v-tab value="historial" class="text-none font-weight-bold">
              <v-icon start size="18">mdi-history</v-icon>
              Historial de Aperturas
            </v-tab>
          </v-tabs>

          <!-- Toggle Cards vs Tabla (solo en tab cajas) -->
          <v-btn-toggle
            v-if="activeTab === 'cajas'"
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

          <v-btn
            color="indigo-darken-3"
            variant="flat"
            size="small"
            class="text-none font-weight-bold"
            prepend-icon="mdi-refresh"
            :loading="loading"
            @click="recargarTodo()"
          >
            Actualizar
          </v-btn>
        </div>
      </div>
      <v-divider />

      <!-- Tarjetas de Métricas -->
      <v-row class="pa-3 align-center" dense>
        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" color="blue-lighten-5" class="pa-3 rounded-lg border border-blue-lighten-4">
            <div class="d-flex align-center">
              <v-avatar color="blue-darken-3" class="mr-3 text-white" size="42">
                <v-icon size="22">mdi-lock-outline</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-blue-darken-4 font-weight-medium">Cajas Listas para Aperturar</div>
                <div class="text-h6 font-weight-black text-blue-darken-4">
                  {{ stats.cerradas }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" color="green-lighten-5" class="pa-3 rounded-lg border border-green-lighten-4">
            <div class="d-flex align-center">
              <v-avatar color="green-darken-3" class="mr-3 text-white" size="42">
                <v-icon size="22">mdi-lock-open-variant-outline</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-green-darken-4 font-weight-medium">Cajas Aperturadas / En Turno</div>
                <div class="text-h6 font-weight-black text-green-darken-4">
                  {{ stats.abiertas }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="12">
          <v-card variant="flat" color="indigo-lighten-5" class="pa-3 rounded-lg border border-indigo-lighten-4">
            <div class="d-flex align-center">
              <v-avatar color="indigo-darken-3" class="mr-3 text-white" size="42">
                <v-icon size="22">mdi-cash-multiple</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-indigo-darken-4 font-weight-medium">Total Fondo Inicial en Cajas Activas</div>
                <div class="text-h6 font-weight-black text-indigo-darken-4">
                  {{ formatCurrency(stats.totalFondoInicial) }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- PESTAÑA 1: GESTIÓN Y APERTURA DE CAJAS -->
    <v-window v-model="activeTab">
      <v-window-item value="cajas">
        <!-- Barra de Filtros -->
        <v-row class="mb-3 align-center" dense>
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
              bg-color="white"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filtroEstado"
              :items="[
                { title: 'Todas las cajas', value: 'todos' },
                { title: 'Solo Cerradas (Disponibles)', value: 'cerradas' },
                { title: 'Solo Aperturadas', value: 'aperturadas' }
              ]"
              label="Filtrar por estado"
              density="compact"
              variant="outlined"
              color="indigo"
              hide-details
              bg-color="white"
            />
          </v-col>
        </v-row>

        <!-- Loader -->
        <div v-if="loading" class="d-flex justify-center my-10">
          <v-progress-circular indeterminate color="indigo-darken-3" size="56" />
        </div>

        <!-- Sin Cajas -->
        <v-alert
          v-else-if="filteredCajas.length === 0"
          type="info"
          variant="tonal"
          class="rounded-lg"
        >
          No se encontraron cajas registradas o que coincidan con los filtros aplicados.
        </v-alert>

        <!-- VISTA GRID (TARJETAS) -->
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
              class="rounded-lg elevation-2 overflow-hidden hover-card h-100 d-flex flex-column border"
              :style="getCardBorder(caja)"
            >
              <!-- Encabezado de Tarjeta -->
              <div class="pa-3 bg-indigo-darken-4 text-white d-flex align-center justify-space-between">
                <div>
                  <span class="text-subtitle-2 font-weight-bold d-block">{{ caja.nombre }}</span>
                  <span class="text-caption text-indigo-lighten-3">Código: {{ caja.codigo || '—' }}</span>
                </div>
                <v-chip
                  :color="caja.isCerrada ? 'blue-grey-lighten-4' : 'success'"
                  :class="caja.isCerrada ? 'text-blue-grey-darken-4' : 'text-white'"
                  size="x-small"
                  variant="flat"
                  class="font-weight-bold text-uppercase"
                >
                  <v-icon start size="12">
                    {{ caja.isCerrada ? 'mdi-lock' : 'mdi-lock-open-variant' }}
                  </v-icon>
                  {{ caja.estadoNombre }}
                </v-chip>
              </div>

              <!-- Cuerpo de la Tarjeta -->
              <div class="pa-3 flex-grow-1 bg-white">
                <div class="d-flex align-center text-caption text-grey-darken-2 mb-2">
                  <v-icon size="16" color="indigo" class="mr-1">mdi-warehouse</v-icon>
                  <span>Bodega: <strong>{{ caja.bodegaNombre }}</strong></span>
                </div>

                <v-divider class="my-2" />

                <!-- Si la caja está Cerrada (Lista para abrir) -->
                <div v-if="caja.isCerrada" class="py-2 text-center">
                  <div class="text-caption text-grey-darken-1 mb-3">
                    La caja se encuentra cerrada y disponible para iniciar turno.
                  </div>
                  <v-btn
                    color="indigo-darken-3"
                    variant="flat"
                    block
                    prepend-icon="mdi-lock-open-check"
                    class="font-weight-bold text-none py-2 elevation-1"
                    @click="openAperturaDialog(caja)"
                  >
                    Aperturar Caja
                  </v-btn>
                </div>

                <!-- Si la caja ya está Aperturada o Arqueada -->
                <div v-else class="caja-info">
                  <div class="d-flex justify-space-between py-1 border-b">
                    <span class="text-caption text-grey">Apertura No:</span>
                    <span class="text-caption font-weight-bold text-indigo-darken-3">{{ caja.apertura?.codigo || '—' }}</span>
                  </div>
                  <div class="d-flex justify-space-between py-1 border-b">
                    <span class="text-caption text-grey">Cajero Responsable:</span>
                    <span class="text-caption font-weight-medium text-grey-darken-4">{{ caja.apertura?.usuarioAperturaNombre || '—' }}</span>
                  </div>
                  <div class="d-flex justify-space-between py-1 border-b">
                    <span class="text-caption text-grey">Fecha y Hora:</span>
                    <span class="text-caption text-grey-darken-3">{{ formatDate(caja.apertura?.fechaApertura) }}</span>
                  </div>
                  <div class="d-flex justify-space-between py-1 border-b">
                    <span class="text-caption text-grey">Fondo Inicial:</span>
                    <span class="text-caption font-weight-bold text-success">{{ formatCurrency(caja.apertura?.montoAperturaEfectivo) }}</span>
                  </div>
                  <div class="d-flex justify-space-between py-1">
                    <span class="text-caption text-grey">Valor Mercadería:</span>
                    <span class="text-caption font-weight-bold text-blue-grey-darken-2">{{ formatCurrency(caja.apertura?.montoAperturaMercaderia) }}</span>
                  </div>

                  <div class="mt-3">
                    <v-btn
                      color="indigo"
                      variant="tonal"
                      block
                      size="small"
                      prepend-icon="mdi-eye-outline"
                      class="font-weight-bold text-none"
                      @click="verDetalleApertura(caja.apertura)"
                    >
                      Ver Comprobante
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- VISTA LISTA (TABLA) -->
        <v-card v-else variant="flat" class="border rounded-lg bg-white overflow-hidden" elevation="0">
          <v-table density="comfortable" hover>
            <thead>
              <tr class="bg-grey-lighten-4">
                <th class="text-left font-weight-bold text-caption text-grey-darken-3">Caja</th>
                <th class="text-left font-weight-bold text-caption text-grey-darken-3">Código</th>
                <th class="text-left font-weight-bold text-caption text-grey-darken-3">Bodega</th>
                <th class="text-center font-weight-bold text-caption text-grey-darken-3">Estado</th>
                <th class="text-left font-weight-bold text-caption text-grey-darken-3">Cajero / Turno</th>
                <th class="text-right font-weight-bold text-caption text-grey-darken-3">Fondo Inicial</th>
                <th class="text-right font-weight-bold text-caption text-grey-darken-3">Valor Mercadería</th>
                <th class="text-center font-weight-bold text-caption text-grey-darken-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="caja in filteredCajas" :key="caja.idCaja">
                <td class="font-weight-bold text-body-2 text-indigo-darken-4">
                  {{ caja.nombre }}
                </td>
                <td class="text-caption text-grey-darken-2">
                  {{ caja.codigo || '—' }}
                </td>
                <td class="text-caption text-grey-darken-3">
                  {{ caja.bodegaNombre }}
                </td>
                <td class="text-center">
                  <v-chip
                    :color="caja.isCerrada ? 'blue-grey-lighten-4' : 'success'"
                    :class="caja.isCerrada ? 'text-blue-grey-darken-4' : 'text-white'"
                    size="x-small"
                    variant="flat"
                    class="font-weight-bold text-uppercase"
                  >
                    {{ caja.estadoNombre }}
                  </v-chip>
                </td>
                <td class="text-caption">
                  <span v-if="!caja.isCerrada" class="font-weight-medium text-grey-darken-4">
                    {{ caja.apertura?.usuarioAperturaNombre || '—' }}
                    <small class="d-block text-grey">{{ formatDate(caja.apertura?.fechaApertura) }}</small>
                  </span>
                  <span v-else class="text-grey font-italic">Sin sesión activa</span>
                </td>
                <td class="text-right text-caption font-weight-bold text-success">
                  {{ !caja.isCerrada ? formatCurrency(caja.apertura?.montoAperturaEfectivo) : '—' }}
                </td>
                <td class="text-right text-caption font-weight-bold text-blue-grey-darken-2">
                  {{ !caja.isCerrada ? formatCurrency(caja.apertura?.montoAperturaMercaderia) : '—' }}
                </td>
                <td class="text-center">
                  <v-btn
                    v-if="caja.isCerrada"
                    color="indigo-darken-3"
                    variant="flat"
                    size="x-small"
                    prepend-icon="mdi-lock-open-check"
                    class="font-weight-bold text-none"
                    @click="openAperturaDialog(caja)"
                  >
                    Aperturar
                  </v-btn>
                  <v-btn
                    v-else
                    color="indigo"
                    variant="tonal"
                    size="x-small"
                    icon="mdi-eye-outline"
                    title="Ver detalle"
                    @click="verDetalleApertura(caja.apertura)"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>

      <!-- PESTAÑA 2: HISTORIAL DE APERTURAS -->
      <v-window-item value="historial">
        <v-card variant="flat" class="border rounded-lg bg-white overflow-hidden" elevation="0">
          <div class="pa-3 bg-grey-lighten-4 border-b d-flex align-center justify-space-between flex-wrap gap-2">
            <div class="d-flex align-center">
              <v-icon color="indigo-darken-3" class="mr-2">mdi-history</v-icon>
              <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">Registro Histórico de Aperturas de Caja</span>
            </div>
            <v-chip size="small" color="indigo-darken-3" variant="flat" class="font-weight-bold">
              {{ aperturasHistorial.length }} aperturas registradas
            </v-chip>
          </div>

          <v-data-table
            :headers="headersHistorial"
            :items="aperturasHistorial"
            :loading="loadingHistorial"
            density="compact"
            hover
            items-per-page="15"
            class="historial-table"
          >
            <template v-slot:item.codigo="{ item }">
              <span class="font-weight-bold text-indigo-darken-3">{{ item.codigo }}</span>
            </template>

            <template v-slot:item.cajaNombre="{ item }">
              <div class="font-weight-medium text-grey-darken-4">{{ item.cajaNombre }}</div>
              <small class="text-grey">Cód: {{ item.cajaCodigo || '—' }}</small>
            </template>

            <template v-slot:item.fechaApertura="{ item }">
              <span>{{ formatDate(item.fechaApertura) }}</span>
            </template>

            <template v-slot:item.montoAperturaEfectivo="{ item }">
              <span class="font-weight-bold text-success">{{ formatCurrency(item.montoAperturaEfectivo) }}</span>
            </template>

            <template v-slot:item.montoAperturaMercaderia="{ item }">
              <span class="font-weight-bold text-blue-grey-darken-2">{{ formatCurrency(item.montoAperturaMercaderia) }}</span>
            </template>

            <template v-slot:item.estado="{ item }">
              <v-chip
                :color="item.estado ? 'success' : 'grey-darken-1'"
                size="x-small"
                variant="flat"
                class="font-weight-bold text-uppercase"
              >
                {{ item.estado ? 'Vigente' : 'Cerrada' }}
              </v-chip>
            </template>

            <template v-slot:item.acciones="{ item }">
              <v-btn
                icon="mdi-eye-outline"
                size="x-small"
                color="indigo-darken-3"
                variant="tonal"
                title="Ver Comprobante"
                @click="verDetalleApertura(item)"
              />
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- DIÁLOGO: FORMULARIO DE APERTURA DE CAJA -->
    <v-dialog v-model="dialogs.apertura" max-width="850" persistent scrollable>
      <v-card class="rounded-xl overflow-hidden" elevation="16">
        <!-- Header del Diálogo -->
        <div class="pa-4 bg-indigo-darken-4 text-white d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="36" color="white" class="mr-3">
              <v-icon color="indigo-darken-4" size="20">mdi-lock-open-check</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold leading-tight">Registrar Apertura de Caja</div>
              <div class="text-caption text-indigo-lighten-4">
                Establezca el fondo inicial y valide la mercadería para iniciar el turno
              </div>
            </div>
          </div>
          <v-btn icon color="white" variant="text" size="small" @click="dialogs.apertura = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <!-- Contenido del Diálogo -->
        <v-card-text class="pa-4 bg-grey-lighten-5">
          <!-- Bloque de Resumen de Caja y Bodega -->
          <v-card variant="flat" class="pa-3 mb-4 rounded-lg border bg-white" elevation="0">
            <v-row dense>
              <v-col cols="12" sm="4">
                <div class="text-caption text-grey font-weight-bold text-uppercase">Caja Seleccionada</div>
                <div class="text-body-1 font-weight-bold text-indigo-darken-4">
                  {{ activeCaja?.nombre || '—' }}
                </div>
                <div class="text-caption text-grey-darken-1">
                  Código: {{ activeCaja?.codigo || '—' }}
                </div>
              </v-col>

              <v-col cols="12" sm="4">
                <div class="text-caption text-grey font-weight-bold text-uppercase">Bodega Asociada</div>
                <div class="text-body-2 font-weight-bold text-grey-darken-4">
                  {{ activeCaja?.bodegaNombre || '—' }}
                </div>
                <div class="text-caption text-grey-darken-1">
                  Inventario físico vinculado
                </div>
              </v-col>

              <v-col cols="12" sm="4">
                <div class="text-caption text-grey font-weight-bold text-uppercase">Cajero Responsable</div>
                <div class="text-body-2 font-weight-bold text-grey-darken-4">
                  {{ currentUser?.username || currentUser?.usuario || 'Usuario en Sesión' }}
                </div>
                <div class="text-caption text-grey-darken-1">
                  Rol: {{ currentUser?.rol || 'Cajero' }}
                </div>
              </v-col>

              <v-divider class="my-2 w-100" />

              <!-- Valor Estimado de Mercadería -->
              <v-col cols="12">
                <div class="d-flex align-center justify-space-between bg-indigo-lighten-5 pa-2 rounded border border-indigo-lighten-4">
                  <div class="d-flex align-center">
                    <v-icon color="indigo-darken-3" class="mr-2">mdi-package-variant-closed</v-icon>
                    <span class="text-caption font-weight-bold text-indigo-darken-4">
                      Valor de Mercadería en Bodega (Calculado automáticamente):
                    </span>
                  </div>
                  <div v-if="loadingStockPreview" class="d-flex align-center">
                    <v-progress-circular indeterminate size="16" width="2" color="indigo" class="mr-2" />
                    <span class="text-caption text-grey">Calculando stock...</span>
                  </div>
                  <div v-else class="text-subtitle-2 font-weight-black text-indigo-darken-4">
                    {{ formatCurrency(stockMercaderiaPreview) }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Desglose de Efectivo / Fondo de Caja -->
          <v-card variant="flat" class="pa-4 rounded-lg border bg-white mb-4" elevation="0">
            <div class="d-flex align-center justify-space-between mb-3 border-b pb-2">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" class="mr-2">mdi-cash-register</v-icon>
                <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">
                  Desglose de Efectivo Inicial (Fondo de Caja)
                </span>
              </div>
              <v-btn
                size="x-small"
                variant="tonal"
                color="grey-darken-2"
                prepend-icon="mdi-eraser"
                class="text-none font-weight-bold"
                @click="limpiarDesglose()"
              >
                Limpiar Cantidades
              </v-btn>
            </div>

            <!-- Grid de Denominaciones de Billetes y Monedas -->
            <v-row dense>
              <v-col
                v-for="den in denominaciones"
                :key="den.valor"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card variant="flat" class="pa-2 bg-grey-lighten-4 rounded border d-flex align-center justify-space-between">
                  <div class="flex-grow-1 pr-2">
                    <span class="text-caption font-weight-bold text-grey-darken-3 d-block">
                      {{ den.label }}
                    </span>
                    <span class="text-caption text-indigo-darken-3 font-weight-bold">
                      Subtotal: {{ formatCurrency((cantidades[den.valor] || 0) * den.valor) }}
                    </span>
                  </div>
                  <div style="width: 90px;">
                    <v-text-field
                      v-model.number="cantidades[den.valor]"
                      type="number"
                      min="0"
                      step="1"
                      density="compact"
                      variant="outlined"
                      hide-details
                      bg-color="white"
                      class="text-center font-weight-bold"
                      @focus="$event.target.select()"
                    />
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Total General del Desglose de Efectivo -->
            <div class="d-flex align-center justify-space-between mt-3 pa-3 rounded-lg bg-green-lighten-5 border border-green-lighten-3">
              <div class="d-flex align-center">
                <v-icon color="green-darken-3" class="mr-2" size="24">mdi-cash-check</v-icon>
                <div>
                  <div class="text-caption font-weight-bold text-green-darken-4 text-uppercase">Total Efectivo de Apertura</div>
                  <div class="text-caption text-green-darken-2">Suma de billetes y monedas ingresados</div>
                </div>
              </div>
              <div class="text-h6 font-weight-black text-green-darken-4">
                {{ formatCurrency(totalEfectivoCalculado) }}
              </div>
            </div>
          </v-card>

          <!-- Observaciones -->
          <v-card variant="flat" class="pa-3 rounded-lg border bg-white" elevation="0">
            <div class="d-flex align-center mb-2">
              <v-icon size="16" color="indigo" class="mr-1">mdi-comment-text-outline</v-icon>
              <span class="text-caption font-weight-bold text-grey-darken-2">OBSERVACIONES DE APERTURA (OPCIONAL)</span>
            </div>
            <v-textarea
              v-model="formApertura.observaciones"
              placeholder="Ingrese notas u observaciones relevantes para el inicio de este turno..."
              rows="2"
              variant="outlined"
              density="compact"
              hide-details
              color="indigo"
            />
          </v-card>
        </v-card-text>

        <!-- Footer de Acciones -->
        <v-divider />
        <v-card-actions class="pa-4 bg-white d-flex align-center justify-space-between">
          <v-btn
            color="grey-darken-2"
            variant="tonal"
            class="px-4 font-weight-bold text-none"
            @click="dialogs.apertura = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="indigo-darken-4"
            variant="flat"
            class="px-6 font-weight-bold text-none elevation-2"
            prepend-icon="mdi-check-bold"
            :loading="guardandoApertura"
            @click="confirmarApertura()"
          >
            Confirmar e Iniciar Turno
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIÁLOGO: VER COMPROBANTE / DETALLE DE APERTURA -->
    <v-dialog v-model="dialogs.detalle" max-width="650" persistent>
      <v-card class="rounded-xl overflow-hidden" elevation="16">
        <div class="pa-4 bg-indigo-darken-4 text-white d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="36" color="white" class="mr-3">
              <v-icon color="indigo-darken-4" size="20">mdi-receipt-text-check-outline</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold leading-tight">Comprobante de Apertura</div>
              <div class="text-caption text-indigo-lighten-4">
                {{ detalleApertura?.codigo || 'APE-000' }}
              </div>
            </div>
          </div>
          <v-btn icon color="white" variant="text" size="small" @click="dialogs.detalle = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="pa-4 bg-grey-lighten-5" v-if="detalleApertura">
          <v-card variant="flat" class="pa-4 rounded-lg border bg-white mb-3" elevation="0">
            <v-row dense>
              <v-col cols="12" sm="6">
                <span class="text-caption text-grey font-weight-bold">CAJA:</span>
                <div class="text-body-2 font-weight-bold text-grey-darken-4">
                  {{ detalleApertura.cajaNombre }} ({{ detalleApertura.cajaCodigo || '—' }})
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <span class="text-caption text-grey font-weight-bold">ESTADO:</span>
                <div>
                  <v-chip
                    :color="detalleApertura.estado ? 'success' : 'grey'"
                    size="x-small"
                    variant="flat"
                    class="font-weight-bold"
                  >
                    {{ detalleApertura.estado ? 'VIGENTE / ACTIVA' : 'CERRADA' }}
                  </v-chip>
                </div>
              </v-col>

              <v-col cols="12" sm="6" class="mt-2">
                <span class="text-caption text-grey font-weight-bold">CAJERO RESPONSABLE:</span>
                <div class="text-body-2 font-weight-medium text-grey-darken-4">
                  {{ detalleApertura.usuarioAperturaNombre }}
                </div>
              </v-col>

              <v-col cols="12" sm="6" class="mt-2">
                <span class="text-caption text-grey font-weight-bold">FECHA Y HORA:</span>
                <div class="text-body-2 text-grey-darken-4">
                  {{ formatDate(detalleApertura.fechaApertura) }}
                </div>
              </v-col>

              <v-divider class="my-3 w-100" />

              <v-col cols="12" sm="6">
                <div class="pa-2 bg-green-lighten-5 rounded border border-green-lighten-3">
                  <span class="text-caption text-green-darken-4 font-weight-bold d-block">FONDO EFECTIVO APERTURA:</span>
                  <span class="text-subtitle-1 font-weight-black text-green-darken-4">
                    {{ formatCurrency(detalleApertura.montoAperturaEfectivo) }}
                  </span>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="pa-2 bg-indigo-lighten-5 rounded border border-indigo-lighten-3">
                  <span class="text-caption text-indigo-darken-4 font-weight-bold d-block">VALOR MERCADERÍA INICIAL:</span>
                  <span class="text-subtitle-1 font-weight-black text-indigo-darken-4">
                    {{ formatCurrency(detalleApertura.montoAperturaMercaderia) }}
                  </span>
                </div>
              </v-col>

              <v-col cols="12" class="mt-2" v-if="detalleApertura.observaciones">
                <span class="text-caption text-grey font-weight-bold">OBSERVACIONES:</span>
                <div class="text-caption pa-2 bg-grey-lighten-4 rounded mt-1 text-grey-darken-3">
                  {{ detalleApertura.observaciones }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-3 bg-white d-flex justify-end">
          <v-btn color="indigo-darken-3" variant="flat" class="px-5 font-weight-bold text-none" @click="dialogs.detalle = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { formatters } from '@/helpers/formatters';
import RequestHttp from '@/services/requestHttp';

export default {
  name: 'AperturaCajaView',

  data() {
    return {
      requestHttp: new RequestHttp(),
      activeTab: 'cajas',
      viewMode: 'grid',
      loading: false,
      loadingHistorial: false,
      loadingStockPreview: false,
      guardandoApertura: false,

      searchQuery: '',
      filtroEstado: 'todos',

      cajas: [],
      aperturasHistorial: [],
      activeCaja: null,
      stockMercaderiaPreview: 0,
      detalleApertura: null,

      currentUser: null,

      dialogs: {
        apertura: false,
        detalle: false
      },

      formApertura: {
        observaciones: ''
      },

      denominaciones: [
        { valor: 1000, label: 'Billetes de C$ 1,000' },
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

      headersHistorial: [
        { title: 'Código Apertura', key: 'codigo', align: 'start' },
        { title: 'Caja', key: 'cajaNombre', align: 'start' },
        { title: 'Cajero Responsable', key: 'usuarioAperturaNombre', align: 'start' },
        { title: 'Fecha y Hora', key: 'fechaApertura', align: 'start' },
        { title: 'Fondo Efectivo', key: 'montoAperturaEfectivo', align: 'end' },
        { title: 'Valor Mercadería', key: 'montoAperturaMercaderia', align: 'end' },
        { title: 'Estado', key: 'estado', align: 'center' },
        { title: 'Acciones', key: 'acciones', align: 'center', sortable: false }
      ],

      alert: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },

  computed: {
    totalEfectivoCalculado() {
      return this.denominaciones.reduce((acc, den) => {
        const cant = Number(this.cantidades[den.valor]) || 0;
        return acc + (cant * den.valor);
      }, 0);
    },

    stats() {
      const abiertas = this.cajas.filter(c => !c.isCerrada).length;
      const cerradas = this.cajas.filter(c => c.isCerrada).length;
      const totalFondoInicial = this.cajas
        .filter(c => !c.isCerrada && c.apertura)
        .reduce((acc, c) => acc + (Number(c.apertura?.montoAperturaEfectivo) || 0), 0);

      return {
        abiertas,
        cerradas,
        totalFondoInicial
      };
    },

    filteredCajas() {
      let list = this.cajas;

      if (this.filtroEstado === 'cerradas') {
        list = list.filter(c => c.isCerrada);
      } else if (this.filtroEstado === 'aperturadas') {
        list = list.filter(c => !c.isCerrada);
      }

      if (!this.searchQuery) return list;

      const q = this.searchQuery.toLowerCase().trim();
      return list.filter(c =>
        (c.nombre && c.nombre.toLowerCase().includes(q)) ||
        (c.codigo && c.codigo.toLowerCase().includes(q)) ||
        (c.bodegaNombre && c.bodegaNombre.toLowerCase().includes(q)) ||
        (c.apertura?.usuarioAperturaNombre && c.apertura.usuarioAperturaNombre.toLowerCase().includes(q))
      );
    }
  },

  mounted() {
    this.cargarUsuarioSesion();
    this.recargarTodo();
  },

  methods: {
    cargarUsuarioSesion() {
      try {
        const raw = localStorage.getItem('token');
        if (raw) {
          this.currentUser = JSON.parse(raw);
        }
      } catch (e) {
        console.error('Error al leer el token de usuario:', e);
      }
    },

    async recargarTodo() {
      await Promise.all([
        this.cargarCajas(),
        this.cargarHistorialAperturas()
      ]);
    },

    async cargarCajas() {
      this.loading = true;
      try {
        const res = await this.requestHttp.getCajas();
        if (res && res.code === 200 && Array.isArray(res.data)) {
          const mapped = res.data.map(c => {
            const estadoNombre = c.idEstadoActualNavigation?.nombre || 'Cerrada';
            const isCerrada = estadoNombre.toLowerCase() === 'cerrada' || c.idEstadoActual === 3;
            return {
              idCaja: c.idCaja,
              codigo: c.codigo,
              nombre: c.nombre,
              idBodega: c.idBodega,
              bodegaNombre: c.idBodegaNavigation?.nombre || 'Sucursal Principal',
              idEstadoActual: c.idEstadoActual,
              estadoNombre: estadoNombre,
              isCerrada: isCerrada,
              apertura: null
            };
          });

          // Cargar detalles de apertura vigente para las cajas no cerradas
          await Promise.all(mapped.map(async (caja) => {
            if (!caja.isCerrada) {
              try {
                const apRes = await this.requestHttp.getCajaAperturaVigente(caja.idCaja);
                if (apRes && apRes.code === 200 && apRes.data) {
                  caja.apertura = apRes.data;
                }
              } catch (e) {
                // Ignore if not found
              }
            }
          }));

          this.cajas = mapped;
        } else {
          this.showAlert('No se pudieron obtener las cajas', 'error');
        }
      } catch (error) {
        this.showAlert('Error al procesar consulta de cajas', 'error');
      } finally {
        this.loading = false;
      }
    },

    async cargarHistorialAperturas() {
      this.loadingHistorial = true;
      try {
        const res = await this.requestHttp.getAperturasCaja();
        if (res && res.code === 200 && Array.isArray(res.data)) {
          this.aperturasHistorial = res.data;
        }
      } catch (e) {
        console.error('Error al cargar historial de aperturas:', e);
      } finally {
        this.loadingHistorial = false;
      }
    },

    async openAperturaDialog(caja) {
      this.activeCaja = caja;
      this.limpiarDesglose();
      this.formApertura.observaciones = '';
      this.stockMercaderiaPreview = 0;
      this.dialogs.apertura = true;

      // Calcular valor de stock en bodega
      this.loadingStockPreview = true;
      try {
        const res = await this.requestHttp.getAperturaPreviewStock(caja.idCaja);
        if (res && res.code === 200 && res.data) {
          this.stockMercaderiaPreview = Number(res.data.montoMercaderia) || 0;
        }
      } catch (e) {
        console.warn('No se pudo previsualizar el valor del inventario:', e);
      } finally {
        this.loadingStockPreview = false;
      }
    },

    limpiarDesglose() {
      this.denominaciones.forEach(d => {
        this.cantidades[d.valor] = 0;
      });
    },

    async confirmarApertura() {
      if (!this.activeCaja) return;

      const desgloceDetalle = this.denominaciones
        .filter(d => (Number(this.cantidades[d.valor]) || 0) > 0)
        .map(d => ({
          valorDenominacion: d.valor,
          cantidad: Number(this.cantidades[d.valor]) || 0
        }));

      // Obtener el ID de usuario autenticado
      const idUsuario = this.currentUser?.idUsuario ||
                        this.currentUser?.idusuario ||
                        this.currentUser?.userId ||
                        this.currentUser?.id;

      if (!idUsuario) {
        this.showAlert('No se pudo determinar el usuario de apertura. Inicie sesión nuevamente.', 'error');
        return;
      }

      const payload = {
        idCaja: this.activeCaja.idCaja,
        idUsuarioApertura: Number(idUsuario),
        observaciones: this.formApertura.observaciones || '',
        desgloceDetalle: desgloceDetalle
      };

      this.guardandoApertura = true;
      try {
        const res = await this.requestHttp.postAperturaCaja(payload);
        if (res && (res.code === 200 || res.code === 201)) {
          this.showAlert(res.data?.msg || '¡Apertura de caja realizada exitosamente!', 'success');
          this.dialogs.apertura = false;
          await this.recargarTodo();
        } else {
          const msg = res.data?.msg || res.data?.ex || 'No se pudo realizar la apertura de la caja';
          this.showAlert(msg, 'error');
        }
      } catch (error) {
        this.showAlert('Error de conexión al procesar la apertura', 'error');
      } finally {
        this.guardandoApertura = false;
      }
    },

    verDetalleApertura(apertura) {
      if (!apertura) return;
      this.detalleApertura = apertura;
      this.dialogs.detalle = true;
    },

    getCardBorder(caja) {
      if (!caja.isCerrada) {
        return 'border-left: 4px solid #10B981 !important;';
      }
      return 'border-left: 4px solid #1A237E !important;';
    },

    formatCurrency(val) {
      return formatters.formatCurrency(val || 0, 'NIO');
    },

    formatDate(val) {
      if (!val) return '—';
      return formatters.formatDate(val);
    },

    showAlert(message, type = 'success') {
      this.alert.message = message;
      this.alert.type = type;
      this.alert.show = true;
    }
  }
};
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1) !important;
}

.caja-info {
  background: #f8fafc;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}
</style>
