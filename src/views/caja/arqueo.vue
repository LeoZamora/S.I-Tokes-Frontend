<template>
  <div class="w-100 pa-4">
    <!-- SNACKBAR ALERTAS -->
    <v-snackbar v-model="alert.show" :color="alert.type" timeout="4000" location="top right">
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ alert.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
        <span>{{ alert.message }}</span>
      </div>
    </v-snackbar>

    <!-- ENCABEZADO -->
    <v-card class="border-t border-b mb-4" elevation="0" rounded="0">
      <div class="d-flex align-center justify-space-between flex-wrap pa-3 bg-white">
        <div class="d-flex align-center">
          <v-avatar color="indigo-lighten-5" class="mr-3" size="44">
            <v-icon color="indigo-darken-3" size="26">mdi-calculator-variant-outline</v-icon>
          </v-avatar>
          <div>
            <div class="d-flex align-center flex-wrap ga-2">
              <span class="text-h6 font-weight-bold d-block text-indigo-darken-4">Arqueo de Caja</span>
              <v-chip
                v-if="currentUserNombre"
                size="small"
                color="indigo-lighten-5"
                class="text-indigo-darken-4 font-weight-bold"
                variant="flat"
              >
                <v-icon start size="14">mdi-account-check</v-icon>
                Cajas de {{ currentUserNombre }}
              </v-chip>
            </div>
            <span class="text-caption text-grey-darken-1">Auditoría, conteo físico de efectivo y verificación de turnos</span>
          </div>
        </div>

        <div class="d-flex align-center ga-2 mt-2 mt-sm-0">
          <v-btn
            color="green-darken-1"
            variant="tonal"
            prepend-icon="mdi-refresh"
            @click="loadAllData()"
            :loading="loading"
            class="text-none font-weight-bold"
          >
            Actualizar
          </v-btn>
        </div>
      </div>

      <v-divider />

      <!-- TARJETAS DE MÉTRICAS -->
      <v-row class="pa-3 align-center" dense>
        <v-col cols="12" sm="6" md="4">
          <v-card variant="flat" color="indigo-lighten-5" class="pa-3 rounded-lg border">
            <div class="d-flex align-center">
              <v-avatar color="indigo-darken-3" class="mr-3 text-white" size="42">
                <v-icon>mdi-cash-register</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-indigo-darken-3 font-weight-bold text-uppercase">Cajas Aperturadas</div>
                <div class="text-h6 font-weight-bold text-indigo-darken-4">
                  {{ cajasAperturadas.length }} disponibles para arqueo
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card variant="flat" color="amber-lighten-5" class="pa-3 rounded-lg border">
            <div class="d-flex align-center">
              <v-avatar color="amber-darken-3" class="mr-3 text-white" size="42">
                <v-icon>mdi-history</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-amber-darken-4 font-weight-bold text-uppercase">Total Arqueos Realizados</div>
                <div class="text-h6 font-weight-bold text-amber-darken-4">
                  {{ arqueosHistorial.length }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="12" md="4">
          <v-card variant="flat" color="green-lighten-5" class="pa-3 rounded-lg border">
            <div class="d-flex align-center">
              <v-avatar color="green-darken-3" class="mr-3 text-white" size="42">
                <v-icon>mdi-cash-multiple</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-green-darken-3 font-weight-bold text-uppercase">Último Arqueo Realizado</div>
                <div class="text-h6 font-weight-bold text-green-darken-4">
                  {{ ultimoArqueoTexto }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- TABS: CAJAS APERTURADAS / HISTORIAL DE ARQUEOS -->
    <v-card variant="outlined" class="rounded-lg mb-4 bg-white">
      <v-tabs v-model="tabActive" color="indigo-darken-4" density="compact" class="border-b px-2">
        <v-tab value="disponibles" class="text-none font-weight-bold">
          <v-icon start>mdi-cash-check</v-icon>
          Cajas Disponibles para Arqueo ({{ cajasAperturadas.length }})
        </v-tab>
        <v-tab value="historial" class="text-none font-weight-bold">
          <v-icon start>mdi-clipboard-text-clock-outline</v-icon>
          Historial de Arqueos ({{ arqueosHistorial.length }})
        </v-tab>
      </v-tabs>

      <v-card-text class="pa-4">
        <!-- TAB 1: CAJAS APERTURADAS -->
        <div v-if="tabActive === 'disponibles'">
          <!-- LOADER -->
          <div v-if="loading" class="d-flex justify-center my-8">
            <v-progress-circular indeterminate color="indigo" size="48" />
          </div>

          <!-- VACIO -->
          <v-alert
            v-else-if="cajasAperturadas.length === 0"
            type="info"
            variant="tonal"
            class="rounded-lg"
            icon="mdi-information-outline"
          >
            No hay cajas actualmente en estado <strong>Aperturada</strong> o <strong>Arqueada</strong>. Para realizar un arqueo es necesario que una caja cuente con una apertura vigente.
          </v-alert>

          <!-- GRID DE CAJAS APERTURADAS -->
          <v-row v-else dense>
            <v-col
              v-for="caja in cajasAperturadas"
              :key="caja.idCaja"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card variant="outlined" class="rounded-lg h-100 d-flex flex-column border hover-card">
                <div class="pa-3 bg-indigo-darken-4 text-white d-flex align-center justify-space-between">
                  <div>
                    <div class="text-subtitle-2 font-weight-bold">{{ caja.nombre }}</div>
                    <div class="text-caption text-indigo-lighten-3">[{{ caja.codigo || '—' }}]</div>
                  </div>
                  <v-chip size="x-small" color="success" variant="flat" class="font-weight-bold">
                    {{ caja.estadoNombre || 'Aperturada' }}
                  </v-chip>
                </div>

                <v-divider />

                <div class="pa-3 flex-grow-1 bg-grey-lighten-5">
                  <div class="d-flex align-center mb-1 text-caption text-grey-darken-3">
                    <v-icon size="14" class="mr-1" color="indigo">mdi-warehouse</v-icon>
                    Bodega: <strong class="ml-1 text-grey-darken-4">{{ caja.bodegaNombre || '—' }}</strong>
                  </div>

                  <div class="d-flex align-center mb-1 text-caption text-grey-darken-3">
                    <v-icon size="14" class="mr-1" color="indigo">mdi-account</v-icon>
                    Aperturó: <strong class="ml-1 text-grey-darken-4">{{ caja.apertura?.usuarioAperturaNombre || '—' }}</strong>
                  </div>

                  <div class="d-flex align-center mb-2 text-caption text-grey-darken-3">
                    <v-icon size="14" class="mr-1" color="indigo">mdi-calendar-clock</v-icon>
                    Fecha: <strong class="ml-1 text-grey-darken-4">{{ formateDate(caja.apertura?.fechaApertura) }}</strong>
                  </div>

                  <v-divider class="my-2" />

                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption text-grey-darken-2">Fondo Inicial:</span>
                    <span class="text-subtitle-2 font-weight-bold text-green-darken-3">
                      {{ formatCurrency(caja.apertura?.montoAperturaEfectivo) }}
                    </span>
                  </div>
                </div>

                <v-divider />

                <div class="pa-3 bg-white">
                  <v-btn
                    v-if="hasAccessToFunct('182')"
                    block
                    color="indigo-darken-4"
                    variant="flat"
                    prepend-icon="mdi-calculator"
                    @click="iniciarArqueo(caja)"
                    class="font-weight-bold text-none"
                  >
                    Realizar Arqueo
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- TAB 2: HISTORIAL DE ARQUEOS -->
        <div v-else-if="tabActive === 'historial'">
          <v-row dense class="mb-3 align-center">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="searchHistorial"
                density="compact"
                variant="outlined"
                label="Buscar en historial..."
                prepend-inner-icon="mdi-magnify"
                placeholder="Código, usuario, apertura..."
                hide-details
                clearable
                color="indigo"
              />
            </v-col>
          </v-row>

          <v-data-table
            :loading="loading"
            class="border"
            :headers="headersHistorial"
            density="compact"
            :items="filteredHistorial"
            :header-props="{ class: 'font-weight-bold text-uppercase bg-grey-lighten-4' }"
          >
            <template v-slot:item.codigo="{ item }">
              <v-chip size="small" variant="tonal" color="indigo-darken-3" class="font-weight-bold">
                {{ item.codigo || '—' }}
              </v-chip>
            </template>

            <template v-slot:item.aperturaCodigo="{ item }">
              <span class="text-caption font-weight-medium">{{ item.aperturaCodigo || '—' }}</span>
            </template>

            <template v-slot:item.usuarioArqueo="{ item }">
              <span class="font-weight-medium">{{ item.usuarioArqueo || '—' }}</span>
            </template>

            <template v-slot:item.montoArqueoEfectivo="{ item }">
              <span class="font-weight-bold text-green-darken-3">{{ formatCurrency(item.montoArqueoEfectivo) }}</span>
            </template>

            <template v-slot:item.montoArqueoVentas="{ item }">
              <span class="text-caption font-weight-medium text-indigo-darken-3">{{ formatCurrency(item.montoArqueoVentas) }}</span>
            </template>

            <template v-slot:item.montoArqueoAbonos="{ item }">
              <div>
                <span class="text-caption font-weight-bold text-teal-darken-3 d-block">{{ formatCurrency(item.montoArqueoAbonos) }}</span>
                <span v-if="Number(item.montoArqueoAbonosEfectivo) > 0" class="text-caption text-grey" style="font-size: 10px;">
                  Efec: {{ formatCurrency(item.montoArqueoAbonosEfectivo) }}
                </span>
              </div>
            </template>

            <template v-slot:item.montoArqueoRetiros="{ item }">
              <span class="text-caption text-red-darken-3">{{ formatCurrency(item.montoArqueoRetiros) }}</span>
            </template>

            <template v-slot:item.totalEsperado="{ item }">
              <span class="text-caption font-weight-bold text-grey-darken-4">{{ formatCurrency(item.totalEsperado) }}</span>
            </template>

            <template v-slot:item.diferencia="{ item }">
              <v-chip
                v-if="item.estadoLiquidacion || item.diferencia !== undefined"
                size="x-small"
                :color="item.estadoLiquidacion === 'Cuadrada' ? 'indigo-darken-3' : (item.estadoLiquidacion === 'Sobrante' ? 'success' : 'error')"
                variant="flat"
                class="font-weight-bold"
              >
                {{ item.diferencia >= 0 ? (item.diferencia === 0 ? '' : '+') : '' }}{{ formatCurrency(item.diferencia) }}
              </v-chip>
              <span v-else class="text-caption text-grey">—</span>
            </template>

            <template v-slot:item.montoArqueoMercaderia="{ item }">
              <span class="text-caption text-grey-darken-2">{{ formatCurrency(item.montoArqueoMercaderia) }}</span>
            </template>

            <template v-slot:item.fechaArqueo="{ item }">
              <span class="text-caption">{{ formateDate(item.fechaArqueo) }}</span>
            </template>

            <template v-slot:item.acciones="{ item }">
              <v-btn
                icon="mdi-receipt-text-outline"
                size="x-small"
                color="indigo-darken-3"
                variant="tonal"
                title="Ver Comprobante de Arqueo"
                @click="verDetalleArqueo(item)"
              />
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>

    <!-- DIALOG: REALIZAR ARQUEO MULTIDIVISA -->
    <v-dialog v-model="dialogs.arqueo" max-width="850" persistent scrollable>
      <v-card class="rounded-lg">
        <v-card-title class="bg-indigo-darken-4 text-white d-flex align-center py-3 px-4">
          <v-icon class="mr-2">mdi-calculator</v-icon>
          <div>
            <div class="text-subtitle-1 font-weight-bold lh-1">
              Arqueo de Caja - {{ cajaSeleccionada?.nombre }}
            </div>
            <div class="text-caption text-indigo-lighten-3">
              Apertura: {{ cajaSeleccionada?.apertura?.codigo || '—' }} | Usuario: {{ cajaSeleccionada?.apertura?.usuarioAperturaNombre || '—' }}
            </div>
          </div>
          <v-spacer />
          <v-btn icon size="small" color="white" variant="tonal" @click="dialogs.arqueo = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4" style="max-height: 520px;">
          <!-- RESUMEN ENCABEZADO -->
          <v-card variant="outlined" class="pa-3 mb-4 bg-indigo-lighten-5 border-indigo-lighten-3">
            <v-row dense class="text-caption">
              <v-col cols="6" sm="2">
                <span class="text-grey-darken-1 d-block">Fondo Inicial:</span>
                <strong class="text-body-2 text-indigo-darken-4">{{ formatCurrency(cajaSeleccionada?.apertura?.montoAperturaEfectivo) }}</strong>
              </v-col>
              <v-col cols="6" sm="2">
                <span class="text-grey-darken-1 d-block">Ventas Efectivo:</span>
                <strong class="text-body-2 text-green-darken-4">{{ formatCurrency(resumenVigente.totalVentasEfectivo) }}</strong>
              </v-col>
              <v-col cols="6" sm="2">
                <span class="text-grey-darken-1 d-block">Abonos Efectivo:</span>
                <strong class="text-body-2 text-teal-darken-3">{{ formatCurrency(resumenVigente.totalAbonosEfectivo) }}</strong>
              </v-col>
              <v-col cols="6" sm="2">
                <span class="text-grey-darken-1 d-block">Otras Modalidades:</span>
                <strong class="text-body-2 text-blue-grey-darken-3">{{ formatCurrency((resumenVigente.totalVentasOtrasModalidades || 0) + (resumenVigente.totalAbonosOtrasModalidades || 0)) }}</strong>
              </v-col>
              <v-col cols="6" sm="2">
                <span class="text-grey-darken-1 d-block">Retiros Turno:</span>
                <strong class="text-body-2 text-red-darken-4">{{ formatCurrency(formArqueo.montoRetiros) }}</strong>
              </v-col>
              <v-col cols="6" sm="2">
                <span class="text-grey-darken-1 d-block">Total Esperado (Efec):</span>
                <strong class="text-body-2 text-indigo-darken-4 font-weight-black">{{ formatCurrency(totalEsperado) }}</strong>
              </v-col>
            </v-row>

            <!-- DESGLOSE POR MODALIDAD DE PAGO EN VENTAS -->
            <div v-if="resumenVigente.desgloseModalidades && resumenVigente.desgloseModalidades.length > 0" class="mt-2 pt-2 border-t">
              <div class="d-flex align-center justify-space-between mb-1">
                <span class="text-caption font-weight-bold text-indigo-darken-4 d-flex align-center">
                  <v-icon size="14" class="mr-1">mdi-credit-card-outline</v-icon>
                  Desglose de Ventas por Modalidad de Pago:
                </span>
                <span class="text-caption font-weight-bold text-grey-darken-3">
                  Total Ventas: {{ formatCurrency(resumenVigente.totalVentas) }}
                </span>
              </div>
              <div class="d-flex align-center ga-1.5 flex-wrap">
                <v-chip
                  v-for="mod in resumenVigente.desgloseModalidades"
                  :key="mod.idTipoPago"
                  size="x-small"
                  :color="mod.esEfectivo ? 'green-darken-3' : 'indigo-darken-3'"
                  variant="tonal"
                  class="font-weight-medium"
                >
                  <v-icon start size="12">{{ mod.esEfectivo ? 'mdi-cash' : 'mdi-credit-card' }}</v-icon>
                  <strong>{{ mod.modalidad }}:</strong>&nbsp;{{ formatCurrency(mod.total) }} ({{ mod.cantidadVentas }} fact.)
                </v-chip>
              </div>
            </div>

            <!-- DESGLOSE DE ABONOS CXC POR MODALIDAD -->
            <div v-if="resumenVigente.desgloseAbonosModalidades && resumenVigente.desgloseAbonosModalidades.length > 0" class="mt-2 pt-2 border-t">
              <div class="d-flex align-center justify-space-between mb-1">
                <span class="text-caption font-weight-bold text-teal-darken-4 d-flex align-center">
                  <v-icon size="14" class="mr-1">mdi-account-cash</v-icon>
                  Desglose de Abonos CXC por Modalidad:
                </span>
                <span class="text-caption font-weight-bold text-grey-darken-3">
                  Total Abonos: {{ formatCurrency(resumenVigente.totalAbonos) }}
                </span>
              </div>
              <div class="d-flex align-center ga-1.5 flex-wrap">
                <v-chip
                  v-for="mod in resumenVigente.desgloseAbonosModalidades"
                  :key="mod.idModalidad"
                  size="x-small"
                  :color="mod.esEfectivo ? 'green-darken-3' : 'teal-darken-3'"
                  variant="tonal"
                  class="font-weight-medium"
                >
                  <v-icon start size="12">{{ mod.esEfectivo ? 'mdi-cash' : 'mdi-bank-transfer' }}</v-icon>
                  <strong>{{ mod.modalidad }}:</strong>&nbsp;{{ formatCurrency(mod.total) }} ({{ mod.cantidadAbonos }} abono{{ mod.cantidadAbonos > 1 ? 's' : '' }})
                </v-chip>
              </div>
            </div>

            <!-- LISTADO RÁPIDO DE ABONOS DEL TURNO -->
            <v-expansion-panels v-if="resumenVigente.abonos && resumenVigente.abonos.length > 0" variant="accordion" class="mt-2">
              <v-expansion-panel elevation="0" class="border">
                <v-expansion-panel-title class="py-1 px-3 text-caption font-weight-bold text-indigo-darken-4 bg-white">
                  <v-icon size="14" class="mr-1 text-teal">mdi-format-list-bulleted</v-icon>
                  Ver Listado de Abonos del Turno ({{ resumenVigente.abonos.length }})
                </v-expansion-panel-title>
                <v-expansion-panel-text class="pa-0">
                  <v-table density="compact" class="text-caption border-t">
                    <thead>
                      <tr class="bg-grey-lighten-4">
                        <th class="py-1">Factura</th>
                        <th class="py-1">Cliente</th>
                        <th class="py-1">Modalidad</th>
                        <th class="py-1 text-right">Monto</th>
                        <th class="py-1">Referencia</th>
                        <th class="py-1">Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="ab in resumenVigente.abonos" :key="ab.idAbonoCXC">
                        <td class="font-weight-bold text-indigo py-1">{{ ab.noFactura || '—' }}</td>
                        <td class="py-1">{{ ab.cliente || '—' }}</td>
                        <td class="py-1">
                          <v-chip size="x-small" :color="ab.esEfectivo ? 'success' : 'teal'" variant="tonal" class="font-weight-bold">
                            {{ ab.modalidad }}
                          </v-chip>
                        </td>
                        <td class="text-right font-weight-bold py-1">{{ formatCurrency(ab.monto) }}</td>
                        <td class="text-caption text-grey py-1">{{ ab.numReferencia || '—' }}</td>
                        <td class="text-caption text-grey py-1">{{ formateDate(ab.fechaMovimiento) }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>

          <!-- TABLA DE DESGLOSE DE EFECTIVO MULTIDIVISA -->
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-subtitle-2 font-weight-bold text-indigo-darken-4 d-flex align-center">
              <v-icon size="18" class="mr-1">mdi-cash-multiple</v-icon>
              Desglose de Efectivo Físico Contado (Multidivisa)
            </div>
            <v-btn
              size="x-small"
              variant="tonal"
              color="grey-darken-2"
              prepend-icon="mdi-eraser"
              class="text-none font-weight-bold"
              @click="resetCantidades()"
            >
              Limpiar Cantidades
            </v-btn>
          </div>

          <!-- TABS DE DIVISAS EN ARQUEO -->
          <v-tabs
            v-model="activeTabDivisa"
            color="indigo-darken-4"
            density="compact"
            class="border rounded-t-lg bg-grey-lighten-4 mb-3"
          >
            <v-tab
              v-for="(div, idx) in divisas"
              :key="div.idDivisa"
              :value="idx"
              class="text-none font-weight-bold"
            >
              <v-icon start size="small">{{ div.codigo === 'USD' ? 'mdi-currency-usd' : 'mdi-cash' }}</v-icon>
              {{ div.nombre }} ({{ div.codigo }})
              <v-chip
                v-if="subtotalDivisa(div) > 0"
                size="x-small"
                color="green-darken-3"
                variant="flat"
                class="ml-2 font-weight-bold"
              >
                {{ div.simbolo }} {{ subtotalDivisa(div).toLocaleString('es-NI', { minimumFractionDigits: 2 }) }}
              </v-chip>
            </v-tab>
          </v-tabs>

          <!-- CONTENIDO DE LA DIVISA ACTIVA -->
          <div v-if="divisaActiva">
            <!-- Banner informativo de Tasa de Cambio para divisas extranjeras -->
            <div
              v-if="!divisaActiva.esPredeterminada && divisaActiva.codigo !== 'NIO'"
              class="d-flex align-center justify-space-between pa-2 mb-3 rounded bg-amber-lighten-5 border border-amber-lighten-3 text-caption text-amber-darken-4 font-weight-medium"
            >
              <div class="d-flex align-center">
                <v-icon size="small" color="amber-darken-4" class="mr-1">mdi-swap-horizontal-bold</v-icon>
                <span>Tasa de cambio: <strong>1 {{ divisaActiva.codigo }} = C$ {{ Number(divisaActiva.tasaCambio).toFixed(2) }}</strong></span>
              </div>
              <div>
                Subtotal convertido: <strong>{{ formatCurrency(subtotalDivisaMonedaPrincipal(divisaActiva)) }}</strong>
              </div>
            </div>

            <!-- Tabla de Denominaciones para la Divisa Activa -->
            <v-table density="compact" class="border rounded mb-3">
              <thead class="bg-grey-lighten-4">
                <tr>
                  <th class="text-left font-weight-bold">Denominación</th>
                  <th class="text-center font-weight-bold" style="width: 140px;">Cantidad</th>
                  <th class="text-right font-weight-bold" style="width: 150px;">Subtotal ({{ divisaActiva.simbolo }})</th>
                  <th v-if="divisaActiva.codigo !== 'NIO'" class="text-right font-weight-bold" style="width: 150px;">Equiv. (C$)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="den in getDenominaciones(divisaActiva)" :key="`${divisaActiva.idDivisa}_${den.valor}`">
                  <td class="font-weight-medium">{{ den.label }}</td>
                  <td class="pa-1">
                    <v-text-field
                      v-model.number="cantidades[`${divisaActiva.idDivisa}_${den.valor}`]"
                      type="number"
                      min="0"
                      density="compact"
                      variant="outlined"
                      hide-details
                      class="text-center"
                      color="indigo"
                      @keydown="preventNegative"
                    />
                  </td>
                  <td class="text-right font-weight-bold text-grey-darken-3">
                    {{ divisaActiva.simbolo }} {{ ((cantidades[`${divisaActiva.idDivisa}_${den.valor}`] || 0) * den.valor).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </td>
                  <td v-if="divisaActiva.codigo !== 'NIO'" class="text-right font-weight-bold text-indigo-darken-4">
                    {{ formatCurrency(((cantidades[`${divisaActiva.idDivisa}_${den.valor}`] || 0) * den.valor) * (divisaActiva.tasaCambio || 1)) }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <!-- Total Consolidado y Diferencia -->
          <div class="pa-3 rounded-lg bg-green-lighten-5 border border-green-lighten-3 mb-4">
            <!-- Chips por Divisa -->
            <div v-if="resumenPorDivisas.length > 0" class="d-flex align-center ga-2 flex-wrap mb-2 pb-2 border-b border-green-lighten-3">
              <span class="text-caption font-weight-bold text-green-darken-4">Subtotales por Divisa:</span>
              <v-chip
                v-for="r in resumenPorDivisas"
                :key="r.idDivisa"
                size="small"
                color="green-darken-4"
                variant="outlined"
                class="font-weight-bold bg-white"
              >
                {{ r.codigo }}: {{ r.simbolo }} {{ r.totalMonedaOriginal.toLocaleString('es-NI', { minimumFractionDigits: 2 }) }}
                <span v-if="r.codigo !== 'NIO'" class="ml-1 text-caption text-grey-darken-2">
                  (≈ {{ formatCurrency(r.totalMonedaPrincipal) }})
                </span>
              </v-chip>
            </div>

            <div class="d-flex align-center justify-space-between">
              <span class="text-subtitle-2 font-weight-bold text-green-darken-4">Total Efectivo Físico Contado (Moneda Principal):</span>
              <span class="text-h6 font-weight-black text-green-darken-4">
                {{ formatCurrency(totalEfectivoContado) }}
              </span>
            </div>
          </div>

          <!-- CAMPOS ADICIONALES: RETIROS Y OBSERVACIONES -->
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="formArqueo.montoRetiros"
                type="number"
                min="0"
                step="0.01"
                density="compact"
                variant="outlined"
                label="Monto de Retiros durante el turno"
                prefix="C$"
                placeholder="0.00"
                color="indigo"
                persistent-placeholder
                @keydown="preventNegative"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <div class="pa-2 rounded bg-grey-lighten-4 border d-flex justify-space-between align-center h-100">
                <span class="text-caption font-weight-bold text-grey-darken-2">Diferencia vs Teórico:</span>
                <span
                  class="font-weight-bold text-subtitle-2"
                  :class="diferenciaArqueo >= 0 ? 'text-green-darken-3' : 'text-red-darken-3'"
                >
                  {{ formatCurrency(diferenciaArqueo) }}
                  <small>({{ diferenciaArqueo >= 0 ? 'Sobrante/Cuadrado' : 'Faltante' }})</small>
                </span>
              </div>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formArqueo.observaciones"
                rows="2"
                density="compact"
                variant="outlined"
                label="Observaciones del arqueo"
                placeholder="Indique cualquier comentario o novedad en el conteo..."
                color="indigo"
                persistent-placeholder
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3 bg-grey-lighten-4 d-flex justify-end">
          <v-btn
            variant="outlined"
            color="grey-darken-2"
            @click="dialogs.arqueo = false"
            :disabled="savingArqueo"
          >
            Cancelar
          </v-btn>
          <v-btn
            class="bg-indigo-darken-4"
            @click="guardarArqueo()"
            :loading="savingArqueo"
            prepend-icon="mdi-content-save-check"
            elevation="2"
          >
            Confirmar y Guardar Arqueo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG: VER DETALLE / COMPROBANTE DE ARQUEO -->
    <v-dialog v-model="dialogs.detalle" max-width="700" scrollable>
      <v-card class="rounded-lg overflow-hidden elevation-10" v-if="detalleArqueo">
        <v-card-title class="bg-indigo-darken-4 text-white d-flex align-center py-3 px-4">
          <v-icon class="mr-2">mdi-receipt-text-check</v-icon>
          <div>
            <div class="text-subtitle-1 font-weight-bold lh-1">
              Comprobante de Arqueo - {{ detalleArqueo.codigo || 'ARQ-000' }}
            </div>
            <div class="text-caption text-indigo-lighten-3">
              Apertura: {{ detalleArqueo.aperturaCodigo }} | Auditor: {{ detalleArqueo.usuarioArqueo }}
            </div>
          </div>
          <v-spacer />
          <v-btn icon size="small" color="white" variant="text" @click="dialogs.detalle = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4 bg-grey-lighten-5">
          <!-- Tarjeta de Resumen Financiero -->
          <v-card variant="flat" class="pa-3 rounded-lg border bg-white mb-3" elevation="0">
            <v-row dense>
              <v-col cols="12" sm="6">
                <span class="text-caption text-grey font-weight-bold">FECHA Y HORA:</span>
                <div class="text-body-2 text-grey-darken-4">
                  {{ formateDate(detalleArqueo.fechaArqueo) }}
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <span class="text-caption text-grey font-weight-bold">USUARIO AUDITOR:</span>
                <div class="text-body-2 font-weight-bold text-grey-darken-4">
                  {{ detalleArqueo.usuarioArqueo }}
                </div>
              </v-col>

              <v-divider class="my-2 w-100" />

              <v-col cols="6" sm="3">
                <span class="text-caption text-grey font-weight-bold">EFECTIVO CONTADO:</span>
                <div class="text-subtitle-2 font-weight-bold text-green-darken-3">
                  {{ formatCurrency(detalleArqueo.montoArqueoEfectivo) }}
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <span class="text-caption text-grey font-weight-bold">VENTAS TURNO:</span>
                <div class="text-subtitle-2 font-weight-bold text-indigo-darken-3">
                  {{ formatCurrency(detalleArqueo.montoArqueoVentas) }}
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <span class="text-caption text-grey font-weight-bold">ABONOS CXC:</span>
                <div class="text-subtitle-2 font-weight-bold text-teal-darken-3">
                  {{ formatCurrency(detalleArqueo.montoArqueoAbonos) }}
                </div>
                <div v-if="Number(detalleArqueo.montoArqueoAbonosEfectivo) > 0" class="text-caption text-grey" style="font-size: 10px;">
                  Efec: {{ formatCurrency(detalleArqueo.montoArqueoAbonosEfectivo) }}
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <span class="text-caption text-grey font-weight-bold">RETIROS:</span>
                <div class="text-subtitle-2 font-weight-bold text-red-darken-3">
                  {{ formatCurrency(detalleArqueo.montoArqueoRetiros) }}
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <span class="text-caption text-grey font-weight-bold">TOTAL ESPERADO:</span>
                <div class="text-subtitle-2 font-weight-bold text-grey-darken-4">
                  {{ formatCurrency(detalleArqueo.totalEsperado) }}
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <span class="text-caption text-grey font-weight-bold">DIFERENCIA:</span>
                <div>
                  <v-chip
                    v-if="detalleArqueo.estadoLiquidacion || detalleArqueo.diferencia !== undefined"
                    size="x-small"
                    :color="detalleArqueo.estadoLiquidacion === 'Cuadrada' ? 'indigo-darken-3' : (detalleArqueo.estadoLiquidacion === 'Sobrante' ? 'success' : 'error')"
                    variant="flat"
                    class="font-weight-bold"
                  >
                    {{ detalleArqueo.diferencia >= 0 ? (detalleArqueo.diferencia === 0 ? '' : '+') : '' }}{{ formatCurrency(detalleArqueo.diferencia) }}
                    ({{ detalleArqueo.estadoLiquidacion }})
                  </v-chip>
                  <span v-else class="text-caption text-grey">—</span>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <span class="text-caption text-grey font-weight-bold">MERCADERÍA:</span>
                <div class="text-subtitle-2 font-weight-bold text-blue-grey-darken-2">
                  {{ formatCurrency(detalleArqueo.montoArqueoMercaderia) }}
                </div>
              </v-col>

              <v-col cols="12" class="mt-2" v-if="detalleArqueo.observaciones">
                <span class="text-caption text-grey font-weight-bold">OBSERVACIONES:</span>
                <div class="text-caption pa-2 bg-grey-lighten-4 rounded mt-1 text-grey-darken-3">
                  {{ detalleArqueo.observaciones }}
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Desglose de Abonos CXC por Modalidad -->
          <v-card v-if="detalleArqueo.desgloseAbonosModalidades && detalleArqueo.desgloseAbonosModalidades.length > 0" variant="flat" class="pa-3 rounded-lg border bg-white mb-3" elevation="0">
            <div class="text-caption font-weight-bold text-teal-darken-4 mb-2 d-flex align-center">
              <v-icon size="small" class="mr-1">mdi-account-cash</v-icon>
              DESGLOSE DE ABONOS CXC POR MODALIDAD
            </div>
            <div class="d-flex align-center ga-1.5 flex-wrap">
              <v-chip
                v-for="mod in detalleArqueo.desgloseAbonosModalidades"
                :key="mod.idModalidad"
                size="small"
                :color="mod.esEfectivo ? 'green-darken-3' : 'teal-darken-3'"
                variant="tonal"
                class="font-weight-medium"
              >
                <v-icon start size="14">{{ mod.esEfectivo ? 'mdi-cash' : 'mdi-bank-transfer' }}</v-icon>
                <strong>{{ mod.modalidad }}:</strong>&nbsp;{{ formatCurrency(mod.total) }} ({{ mod.cantidadAbonos }} abono{{ mod.cantidadAbonos > 1 ? 's' : '' }})
              </v-chip>
            </div>
          </v-card>

          <!-- Listado de Abonos del Arqueo -->
          <v-card v-if="detalleArqueo.abonos && detalleArqueo.abonos.length > 0" variant="flat" class="pa-3 rounded-lg border bg-white mb-3" elevation="0">
            <div class="text-caption font-weight-bold text-indigo-darken-4 mb-2 d-flex align-center">
              <v-icon size="small" class="mr-1">mdi-receipt-text-outline</v-icon>
              DETALLE DE ABONOS DEL TURNO ({{ detalleArqueo.abonos.length }})
            </div>
            <v-table density="compact" class="border rounded text-caption">
              <thead>
                <tr class="bg-indigo-lighten-5 text-indigo-darken-4">
                  <th class="py-1">Factura</th>
                  <th class="py-1">Cliente</th>
                  <th class="py-1">Modalidad</th>
                  <th class="py-1 text-right">Monto</th>
                  <th class="py-1">Referencia</th>
                  <th class="py-1">Hora</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ab in detalleArqueo.abonos" :key="ab.idAbonoCXC">
                  <td class="font-weight-bold text-indigo py-1">{{ ab.noFactura || '—' }}</td>
                  <td class="py-1">{{ ab.cliente || '—' }}</td>
                  <td class="py-1">
                    <v-chip size="x-small" :color="ab.esEfectivo ? 'success' : 'teal'" variant="tonal" class="font-weight-bold">
                      {{ ab.modalidad }}
                    </v-chip>
                  </td>
                  <td class="text-right font-weight-bold py-1">{{ formatCurrency(ab.monto) }}</td>
                  <td class="text-caption text-grey py-1">{{ ab.numReferencia || '—' }}</td>
                  <td class="text-caption text-grey py-1">{{ formateDate(ab.fechaMovimiento) }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <!-- Resumen por Divisas -->
          <v-card v-if="detalleArqueo.desglocePorDivisa && detalleArqueo.desglocePorDivisa.length > 0" variant="flat" class="pa-3 rounded-lg border bg-white mb-3" elevation="0">
            <div class="text-caption font-weight-bold text-indigo-darken-4 mb-2 d-flex align-center">
              <v-icon size="small" class="mr-1">mdi-cash-multiple</v-icon>
              DESGLOSE POR DIVISAS (MULTIDIVISA)
            </div>
            <v-row dense>
              <v-col
                v-for="div in detalleArqueo.desglocePorDivisa"
                :key="div.idDivisa"
                cols="12"
                sm="6"
              >
                <div class="pa-2 rounded border bg-grey-lighten-5">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <v-chip size="x-small" color="indigo-darken-3" variant="flat" class="font-weight-bold">
                      {{ div.divisaCodigo }} - {{ div.divisaNombre }}
                    </v-chip>
                    <span class="text-caption text-grey-darken-2">{{ div.totalCantidad }} unids.</span>
                  </div>
                  <div class="d-flex align-center justify-space-between">
                    <span class="text-caption text-grey-darken-1">Monto Original:</span>
                    <span class="text-body-2 font-weight-bold text-grey-darken-4">
                      {{ div.divisaSimbolo }} {{ Number(div.totalMonedaOriginal).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </span>
                  </div>
                  <div v-if="div.divisaCodigo !== 'NIO'" class="d-flex align-center justify-space-between mt-1 text-caption">
                    <span class="text-grey-darken-1">T.C. {{ Number(div.tasaCambio).toFixed(2) }}:</span>
                    <span class="font-weight-bold text-indigo-darken-3">
                      {{ formatCurrency(div.totalMonedaPrincipal) }}
                    </span>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Detalle Físico de Billetes y Monedas -->
          <v-card v-if="detalleArqueo.desgloceDetalle && detalleArqueo.desgloceDetalle.length > 0" variant="flat" class="pa-3 rounded-lg border bg-white" elevation="0">
            <div class="text-caption font-weight-bold text-indigo-darken-4 mb-2 d-flex align-center">
              <v-icon size="small" class="mr-1">mdi-format-list-numbered</v-icon>
              DETALLE DE BILLETES Y MONEDAS CONTADOS
            </div>
            <v-table density="compact" class="border rounded">
              <thead>
                <tr class="bg-indigo-lighten-5 text-indigo-darken-4">
                  <th class="font-weight-bold text-caption">Divisa</th>
                  <th class="font-weight-bold text-caption">Denominación</th>
                  <th class="font-weight-bold text-caption text-center">Cantidad</th>
                  <th class="font-weight-bold text-caption text-right">Subtotal Moneda</th>
                  <th class="font-weight-bold text-caption text-right">Subtotal (C$)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in detalleArqueo.desgloceDetalle" :key="idx">
                  <td class="text-caption font-weight-bold">{{ item.divisaCodigo || 'NIO' }}</td>
                  <td class="text-caption font-weight-medium">
                    {{ (item.valorDenominacion >= 10 ? 'Billete de ' : 'Moneda de ') + (item.divisaSimbolo || 'C$') + ' ' + (item.valorDenominacion >= 1 ? item.valorDenominacion.toLocaleString('es-NI') : item.valorDenominacion.toFixed(2)) }}
                  </td>
                  <td class="text-caption text-center font-weight-bold">{{ item.cantidad }}</td>
                  <td class="text-caption text-right font-weight-medium">
                    {{ (item.divisaSimbolo || 'C$') }} {{ (item.valorDenominacion * item.cantidad).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </td>
                  <td class="text-caption text-right font-weight-bold text-indigo-darken-4">
                    {{ formatCurrency(item.subtotalMonedaPrincipal ?? ((item.valorDenominacion * item.cantidad) * (item.tasaCambio || 1))) }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-3 bg-white d-flex justify-end">
          <v-btn color="indigo-darken-3" variant="tonal" class="px-5 font-weight-bold text-none" @click="dialogs.detalle = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onActivated } from 'vue'
import { formatters } from '@/helpers/formatters'
import RequestHttp from '@/services/requestHttp'
import { hasAccessToFunct } from '@/scripts/Seguridad.js'
import { DEFAULT_DIVISAS, getDenominacionesPorDivisa } from '@/helpers/divisaHelper.js'

export default {
  name: 'ArqueoCajaModule',

  setup() {
    const requestHttp = new RequestHttp()

    const loading = ref(false)
    const savingArqueo = ref(false)
    const tabActive = ref('disponibles')
    const searchHistorial = ref('')

    const dialogs = reactive({
      arqueo: false,
      detalle: false
    })

    const alert = reactive({
      show: false,
      message: '',
      type: 'success'
    })

    const showAlert = (message, type = 'success') => {
      alert.message = message
      alert.type = type
      alert.show = true
    }

    const cajasList = ref([])
    const arqueosHistorial = ref([])
    const cajaSeleccionada = ref(null)
    const detalleArqueo = ref(null)

    const divisas = ref([...DEFAULT_DIVISAS])
    const activeTabDivisa = ref(0)
    const cantidades = reactive({})

    const resumenVigente = reactive({
      totalVentas: 0,
      totalVentasEfectivo: 0,
      totalVentasOtrasModalidades: 0,
      totalAbonos: 0,
      totalAbonosEfectivo: 0,
      totalAbonosOtrasModalidades: 0,
      totalMercaderia: 0,
      efectivoApertura: 0,
      totalRetiros: 0,
      totalEnCaja: 0,
      desgloseModalidades: [],
      desgloseAbonosModalidades: [],
      abonos: []
    })

    const formArqueo = reactive({
      montoRetiros: 0,
      observaciones: ''
    })

    const loadDivisas = async () => {
      try {
        const res = await requestHttp.getDivisas()
        if (res && res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
          divisas.value = res.data
        }
      } catch (e) {
        console.error('Error al cargar catálogo de divisas:', e)
      }
    }

    const divisaActiva = computed(() => {
      return divisas.value[activeTabDivisa.value] || divisas.value[0]
    })

    const getDenominaciones = (divisa) => {
      return getDenominacionesPorDivisa(divisa)
    }

    const subtotalDivisa = (divisa) => {
      if (!divisa) return 0
      const denoms = getDenominaciones(divisa)
      return denoms.reduce((acc, d) => {
        const cant = Number(cantidades[`${divisa.idDivisa}_${d.valor}`]) || 0
        return acc + (cant * d.valor)
      }, 0)
    }

    const subtotalDivisaMonedaPrincipal = (divisa) => {
      if (!divisa) return 0
      const sub = subtotalDivisa(divisa)
      const tasa = Number(divisa.tasaCambio) > 0 ? Number(divisa.tasaCambio) : 1
      return sub * tasa
    }

    const totalEfectivoContado = computed(() => {
      return divisas.value.reduce((total, div) => {
        return total + subtotalDivisaMonedaPrincipal(div)
      }, 0)
    })

    const resumenPorDivisas = computed(() => {
      return divisas.value
        .map(div => {
          const subtotalOriginal = subtotalDivisa(div)
          const subtotalPrincipal = subtotalDivisaMonedaPrincipal(div)
          return {
            idDivisa: div.idDivisa,
            codigo: div.codigo,
            nombre: div.nombre,
            simbolo: div.simbolo,
            tasaCambio: div.tasaCambio,
            totalMonedaOriginal: subtotalOriginal,
            totalMonedaPrincipal: subtotalPrincipal
          }
        })
        .filter(r => r.totalMonedaOriginal > 0)
    })

    const resetCantidades = () => {
      for (const k in cantidades) {
        cantidades[k] = 0
      }
      formArqueo.montoRetiros = 0
      formArqueo.observaciones = ''
    }

    const totalEsperado = computed(() => {
      const fondo = Number(cajaSeleccionada.value?.apertura?.montoAperturaEfectivo) || 0
      const ventasEf = Number(resumenVigente.totalVentasEfectivo) || 0
      const abonosEf = Number(resumenVigente.totalAbonosEfectivo) || 0
      const retiros = Number(formArqueo.montoRetiros) || 0
      return (fondo + ventasEf + abonosEf) - retiros
    })

    const diferenciaArqueo = computed(() => {
      const esperado = Number(totalEsperado.value) || 0
      const fisico = Number(totalEfectivoContado.value) || 0
      return fisico - esperado
    })

    const cajasAperturadas = computed(() => {
      return cajasList.value.filter(c => {
        const est = (c.estadoNombre || '').toLowerCase()
        return est.includes('aperturad') || est.includes('arquead')
      })
    })

    const currentUserNombre = computed(() => {
      try {
        const name = localStorage.getItem('name')
        if (name) return name
        const raw = localStorage.getItem('token')
        if (raw) {
          const userObj = typeof raw === 'string' && raw.startsWith('{') ? JSON.parse(raw) : {}
          return userObj?.nombre || userObj?.name || userObj?.usuario || userObj?.username || ''
        }
      } catch (e) {
        // ignore
      }
      return ''
    })

    const ultimoArqueoTexto = computed(() => {
      if (arqueosHistorial.value.length === 0) return 'Sin registros'
      const ult = arqueosHistorial.value[0]
      return `${ult.codigo || 'Arqueo'} (${formatCurrency(ult.montoArqueoEfectivo)})`
    })

    const headersHistorial = [
      { title: 'Código', key: 'codigo', align: 'center' },
      { title: 'Apertura', key: 'aperturaCodigo', align: 'center' },
      { title: 'Usuario', key: 'usuarioArqueo', align: 'start' },
      { title: 'Efectivo Contado', key: 'montoArqueoEfectivo', align: 'end' },
      { title: 'Ventas Turno', key: 'montoArqueoVentas', align: 'end' },
      { title: 'Abonos CXC', key: 'montoArqueoAbonos', align: 'end' },
      { title: 'Retiros', key: 'montoArqueoRetiros', align: 'end' },
      { title: 'Total Esperado', key: 'totalEsperado', align: 'end' },
      { title: 'Diferencia', key: 'diferencia', align: 'center' },
      { title: 'Mercadería', key: 'montoArqueoMercaderia', align: 'end' },
      { title: 'Fecha Arqueo', key: 'fechaArqueo', align: 'center' },
      { title: 'Acción', key: 'acciones', align: 'center', sortable: false }
    ]

    const filteredHistorial = computed(() => {
      if (!searchHistorial.value || searchHistorial.value.trim() === '') {
        return arqueosHistorial.value
      }
      const q = searchHistorial.value.toLowerCase().trim()
      return arqueosHistorial.value.filter(a => {
        const cod = (a.codigo || '').toLowerCase()
        const ap = (a.aperturaCodigo || '').toLowerCase()
        const usu = (a.usuarioArqueo || '').toLowerCase()
        const obs = (a.observaciones || '').toLowerCase()
        return cod.includes(q) || ap.includes(q) || usu.includes(q) || obs.includes(q)
      })
    })

    const loadAllData = async () => {
      loading.value = true
      try {
        await loadDivisas()

        // 1. Obtener identificador del usuario autenticado
        let idUsuario = null
        try {
          const raw = localStorage.getItem('token')
          if (raw) {
            const userObj = typeof raw === 'string' && raw.startsWith('{') ? JSON.parse(raw) : {}
            idUsuario = Number(userObj?.idusuario || userObj?.idUsuario || userObj?.id || userObj?.userId)
          }
        } catch (e) {
          console.error('Error al leer token de usuario:', e)
        }

        // 2. Obtener cajas autorizadas para el usuario desde UsuarioController
        let authorizedIds = []
        if (idUsuario) {
          try {
            const resIds = await requestHttp.getCajasAutorizadasIds(idUsuario)
            if (resIds && resIds.code === 200 && Array.isArray(resIds.data)) {
              authorizedIds = resIds.data
            } else {
              const resDetalle = await requestHttp.getCajasAutorizadas(idUsuario)
              if (resDetalle && resDetalle.code === 200 && Array.isArray(resDetalle.data)) {
                authorizedIds = resDetalle.data.map(c => c.idCaja)
              }
            }
          } catch (e) {
            console.warn('Error al consultar cajas autorizadas:', e)
          }
        }

        // 3. Cargar cajas y filtrar exclusivamente las autorizadas para el usuario
        const resCajas = await requestHttp.getCajas()
        if (resCajas.code === 200 && Array.isArray(resCajas.data)) {
          const authorizedSet = new Set(authorizedIds)
          const cajasAutorizadas = idUsuario
            ? resCajas.data.filter(c =>
                authorizedSet.has(c.idCaja) ||
                (Array.isArray(c.cajerosAutorizados) && c.cajerosAutorizados.some(u => (u.idUsuario || u.idusuario) === idUsuario))
              )
            : resCajas.data

          cajasList.value = cajasAutorizadas

          // Para cada caja abierta, cargar apertura vigente
          await Promise.all(
            cajasList.value.map(async (caja) => {
              const est = (caja.estadoNombre || '').toLowerCase()
              if (est.includes('aperturad') || est.includes('arquead')) {
                const resAp = await requestHttp.getCajaAperturaVigente(caja.idCaja)
                if (resAp.code === 200 && resAp.data) {
                  caja.apertura = resAp.data
                }
              }
            })
          )
        }

        // 4. Cargar historial de arqueos
        const resArqueos = await requestHttp.getArqueosCaja()
        if (resArqueos.code === 200 && Array.isArray(resArqueos.data)) {
          arqueosHistorial.value = resArqueos.data
        }
      } catch (err) {
        console.error('Error cargando datos de arqueo:', err)
        showAlert('Error al consultar los datos del servidor.', 'error')
      } finally {
        loading.value = false
      }
    }

    const iniciarArqueo = async (caja) => {
      cajaSeleccionada.value = caja
      resetCantidades()
      activeTabDivisa.value = 0

      await loadDivisas()

      // Cargar resumen vigente de la caja
      try {
        const resResumen = await requestHttp.getCajaAperturaVigenteResumen(caja.idCaja)
        if (resResumen.code === 200 && resResumen.data) {
          resumenVigente.totalVentas = resResumen.data.totalVentas || 0
          resumenVigente.totalVentasEfectivo = resResumen.data.totalVentasEfectivo ?? (resResumen.data.totalVentas || 0)
          resumenVigente.totalVentasOtrasModalidades = resResumen.data.totalVentasOtrasModalidades || 0
          resumenVigente.totalAbonos = resResumen.data.totalAbonos || 0
          resumenVigente.totalAbonosEfectivo = resResumen.data.totalAbonosEfectivo || 0
          resumenVigente.totalAbonosOtrasModalidades = resResumen.data.totalAbonosOtrasModalidades || 0
          resumenVigente.totalMercaderia = resResumen.data.totalMercaderia || 0
          resumenVigente.efectivoApertura = resResumen.data.efectivoApertura || 0
          resumenVigente.totalRetiros = resResumen.data.totalRetiros || 0
          resumenVigente.totalEnCaja = resResumen.data.totalEnCaja || 0
          resumenVigente.desgloseModalidades = resResumen.data.desgloseModalidades || []
          resumenVigente.desgloseAbonosModalidades = resResumen.data.desgloseAbonosModalidades || []
          resumenVigente.abonos = resResumen.data.abonos || []
          formArqueo.montoRetiros = resResumen.data.totalRetiros || 0
        } else {
          resumenVigente.totalVentas = 0
          resumenVigente.totalVentasEfectivo = 0
          resumenVigente.totalVentasOtrasModalidades = 0
          resumenVigente.totalAbonos = 0
          resumenVigente.totalAbonosEfectivo = 0
          resumenVigente.totalAbonosOtrasModalidades = 0
          resumenVigente.totalMercaderia = 0
          resumenVigente.efectivoApertura = 0
          resumenVigente.totalRetiros = 0
          resumenVigente.totalEnCaja = 0
          resumenVigente.desgloseModalidades = []
          resumenVigente.desgloseAbonosModalidades = []
          resumenVigente.abonos = []
          formArqueo.montoRetiros = 0
        }
      } catch (e) {
        console.error('Error cargando resumen vigente:', e)
      }

      dialogs.arqueo = true
    }

    const guardarArqueo = async () => {
      const idApertura = cajaSeleccionada.value?.apertura?.idAperturaCaja
      if (!idApertura) {
        showAlert('No se encontró el identificador de la apertura vigente.', 'error')
        return
      }

      // Preparar desglose multidivisa
      const desgloceDetalle = []
      divisas.value.forEach(div => {
        const denoms = getDenominaciones(div)
        denoms.forEach(d => {
          const cant = Number(cantidades[`${div.idDivisa}_${d.valor}`]) || 0
          if (cant > 0) {
            desgloceDetalle.push({
              idDivisa: div.idDivisa,
              valorDenominacion: d.valor,
              cantidad: cant
            })
          }
        })
      })

      if (desgloceDetalle.length === 0 && totalEfectivoContado.value === 0) {
        if (!confirm('¿Desea registrar el arqueo con total de efectivo en 0?')) {
          return
        }
        const defaultDiv = divisas.value.find(d => d.esPredeterminada) || divisas.value[0] || { idDivisa: 1 }
        desgloceDetalle.push({
          idDivisa: defaultDiv.idDivisa,
          valorDenominacion: 1,
          cantidad: 0.001
        })
      }

      const payload = {
        idAperturaCaja: idApertura,
        montoArqueoRetiros: Number(formArqueo.montoRetiros) || 0,
        observaciones: formArqueo.observaciones ? formArqueo.observaciones.trim() : null,
        desgloceDetalle: desgloceDetalle
      }

      savingArqueo.value = true
      try {
        const res = await requestHttp.postArqueoCaja(payload)
        if (res.code === 200) {
          showAlert('¡Arqueo de caja registrado correctamente!', 'success')
          dialogs.arqueo = false
          await loadAllData()
        } else {
          const msg = res.data?.msg || res.data?.ex || 'No se pudo registrar el arqueo.'
          showAlert(msg, 'error')
        }
      } catch (err) {
        showAlert('Error de conexión al registrar el arqueo.', 'error')
      } finally {
        savingArqueo.value = false
      }
    }

    const verDetalleArqueo = (item) => {
      detalleArqueo.value = item
      dialogs.detalle = true
    }

    const formateDate = (dateString) => {
      if (!dateString) return '—'
      return formatters.formatDate(dateString)
    }

    const formatCurrency = (val) => {
      return formatters.formatCurrency(val || 0, 'NIO')
    }

    const preventNegative = (e) => {
      if (['-', 'e', '+'].includes(e.key)) {
        e.preventDefault()
      }
    }

    onActivated(() => {
      loadAllData()
    })

    return {
      loading,
      savingArqueo,
      tabActive,
      dialogs,
      alert,
      searchHistorial,
      cajasList,
      cajasAperturadas,
      currentUserNombre,
      arqueosHistorial,
      filteredHistorial,
      headersHistorial,
      cajaSeleccionada,
      detalleArqueo,
      resumenVigente,
      formArqueo,
      divisas,
      activeTabDivisa,
      divisaActiva,
      cantidades,
      getDenominaciones,
      subtotalDivisa,
      subtotalDivisaMonedaPrincipal,
      totalEfectivoContado,
      resumenPorDivisas,
      totalEsperado,
      diferenciaArqueo,
      ultimoArqueoTexto,
      loadAllData,
      iniciarArqueo,
      guardarArqueo,
      verDetalleArqueo,
      resetCantidades,
      formateDate,
      formatCurrency,
      preventNegative,
      hasAccessToFunct
    }
  }
}
</script>

<style scoped>
.lh-1 {
  line-height: 1.2;
}
.hover-card {
  transition: all 0.2s ease-in-out;
}
.hover-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}
</style>
