<template>
  <div class="visualizar-cuentas-container">
    <!-- TARJETA PRINCIPAL: CENTRO DE COBRO Y ESTADO DE CUENTA -->
    <v-card class="elevation-2 rounded-xl overflow-hidden border">
      <!-- HEADER PRINCIPAL -->
      <div class="px-5 py-4 header-gradient d-flex flex-wrap align-center justify-space-between ga-3">
        <div class="d-flex align-center">
          <v-btn
            @click="close"
            color="white"
            variant="tonal"
            class="mr-3 rounded-lg"
            size="small"
            icon
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div>
            <div class="d-flex align-center ga-2 flex-wrap">
              <span class="text-h6 font-weight-bold text-white">
                Gestión de Cobro y Cuentas por Cobrar
              </span>
              <v-chip
                size="small"
                color="white"
                variant="flat"
                class="text-indigo-darken-4 font-weight-bold"
              >
                {{ resumen.noCxc || `CXC #${cxc.idCxc}` }}
              </v-chip>
            </div>
            <div class="text-caption text-indigo-lighten-4">
              Recibo Oficial de Caja (ROC) y Estado de Cuenta del Cliente
            </div>
          </div>
        </div>

        <!-- BADGES SUPERIORES DE RESUMEN FINANCIERO -->
        <div class="d-flex align-center flex-wrap ga-2">
          <v-chip
            size="default"
            variant="flat"
            :color="resumen.saldoTotalPendiente > 0 ? 'amber-lighten-5' : 'green-lighten-5'"
            :class="resumen.saldoTotalPendiente > 0 ? 'text-amber-darken-4 font-weight-bold border-amber' : 'text-green-darken-4 font-weight-bold border-green'"
          >
            <v-icon start size="18">
              {{ resumen.saldoTotalPendiente > 0 ? 'mdi-cash-clock' : 'mdi-check-decagram' }}
            </v-icon>
            Saldo Total: {{ formatedCurrency(resumen.saldoTotalPendiente) }}
          </v-chip>

          <v-chip
            size="default"
            variant="flat"
            color="white"
            class="text-indigo-darken-4 font-weight-bold"
          >
            <v-icon start size="18">mdi-file-document-alert-outline</v-icon>
            {{ resumen.totalFacturasPendientes }} Facturas Pendientes
          </v-chip>
        </div>
      </div>

      <!-- FICHA DE INFORMACIÓN DEL CLIENTE (COMPACTA Y ELEGANTE) -->
      <v-card-text class="pa-4 bg-grey-lighten-5 border-b">
        <v-row dense align="center">
          <!-- DATOS DEL CLIENTE -->
          <v-col cols="12" md="8">
            <v-card variant="flat" class="pa-3 bg-white border rounded-lg">
              <div class="d-flex align-center mb-2">
                <v-avatar size="38" color="indigo-lighten-5" class="mr-3">
                  <v-icon color="indigo-darken-3">mdi-account-tie</v-icon>
                </v-avatar>
                <div>
                  <div class="d-flex align-center ga-2">
                    <span class="text-subtitle-1 font-weight-bold text-indigo-darken-4">
                      {{ resumen.cliente.nombre || cxc.cliente || 'Cargando cliente...' }}
                    </span>
                    <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold">
                      CÓD: {{ resumen.cliente.codigo || 'S/C' }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-grey-darken-1 d-flex flex-wrap align-center ga-4 mt-1">
                    <span class="d-flex align-center">
                      <v-icon size="14" class="mr-1" color="grey">mdi-map-marker-outline</v-icon>
                      {{ resumen.cliente.direccion || 'Sin dirección registrada' }}
                    </span>
                    <span class="d-flex align-center">
                      <v-icon size="14" class="mr-1" color="grey">mdi-phone-outline</v-icon>
                      {{ resumen.cliente.telefono || 'Sin teléfono' }}
                    </span>
                    <span v-if="resumen.cliente.ruta" class="d-flex align-center">
                      <v-icon size="14" class="mr-1" color="grey">mdi-truck-outline</v-icon>
                      Ruta: {{ resumen.cliente.ruta }}
                    </span>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- PARÁMETROS BÁSICOS DEL RECIBO -->
          <v-col cols="12" md="4">
            <v-card variant="flat" class="pa-3 bg-white border rounded-lg">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model="pago.fechaMovimiento"
                    type="date"
                    label="Fecha de Cobro"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="font-sm"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="pago.numRecibo"
                    label="No. Recibo (ROC)"
                    placeholder="Auto / Talonario"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="font-sm"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- SECCIÓN INTERMEDIA: FILTROS Y ACCIONES RÁPIDAS DE TABLA -->
      <div class="px-4 py-3 d-flex flex-wrap align-center justify-space-between ga-2 bg-white">
        <!-- BUSCADOR Y FILTRO DE FACTURAS -->
        <div class="d-flex align-center ga-2 flex-grow-1 flex-md-grow-0" style="min-width: 280px; max-width: 450px;">
          <v-text-field
            v-model="search"
            placeholder="Buscar por N° de Factura..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            class="flex-grow-1"
          />

          <v-btn-toggle
            v-model="filtroEstado"
            mandatory
            density="compact"
            color="indigo-darken-3"
            rounded="lg"
            variant="outlined"
          >
            <v-btn value="pendientes" size="small" class="text-caption font-weight-bold">
              Pendientes ({{ resumen.totalFacturasPendientes }})
            </v-btn>
            <v-btn value="todas" size="small" class="text-caption font-weight-bold">
              Todas ({{ resumen.facturas.length }})
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- ACCIONES RÁPIDAS POR LOTE -->
        <div class="d-flex align-center ga-2">
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-checkbox-multiple-marked-outline"
            @click="saldarTodasPendientes"
            :disabled="!tieneFacturasPendientes || guardando"
            class="text-none font-weight-bold"
          >
            Saldar Todas
          </v-btn>
          <v-btn
            size="small"
            variant="outlined"
            color="grey-darken-1"
            prepend-icon="mdi-format-clear"
            @click="limpiarAbonos"
            :disabled="totalAbonarCalculado <= 0 || guardando"
            class="text-none"
          >
            Limpiar Abonos
          </v-btn>
        </div>
      </div>

      <!-- TABLA INTERACTIVA DE FACTURAS Y COBRO EN LÍNEA -->
      <v-card-text class="pa-0">
        <v-table density="compact" class="tabla-cobros" hover>
          <thead>
            <tr class="bg-indigo-lighten-5">
              <th class="text-center font-weight-bold" style="width: 100px;">Factura</th>
              <th class="text-center font-weight-bold" style="width: 110px;">Fecha</th>
              <th class="text-center font-weight-bold" style="width: 110px;">Estado</th>
              <th class="text-end font-weight-bold" style="width: 120px;">Débito</th>
              <th class="text-end font-weight-bold" style="width: 120px;">Crédito (Abonos)</th>
              <th class="text-end font-weight-bold" style="width: 130px;">Saldo Actual</th>
              <th class="text-center font-weight-bold bg-indigo-lighten-4" style="width: 110px;">
                Saldar
              </th>
              <th class="text-center font-weight-bold bg-indigo-lighten-4" style="width: 180px;">
                Abono a Aplicar
              </th>
              <th class="text-end font-weight-bold bg-indigo-lighten-4" style="width: 140px;">
                Nuevo Saldo
              </th>
              <th class="text-center font-weight-bold" style="width: 70px;">Historial</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loadingResumen">
              <td colspan="10" class="text-center py-6 text-grey">
                <v-progress-circular indeterminate color="primary" size="24" class="mr-2" />
                Cargando estado de cuenta del cliente...
              </td>
            </tr>
            <tr v-else-if="facturasFiltradas.length === 0">
              <td colspan="10" class="text-center py-6 text-grey">
                <v-icon color="grey" class="mr-1">mdi-alert-circle-outline</v-icon>
                No se encontraron facturas con los filtros seleccionados.
              </td>
            </tr>
            <tr
              v-else
              v-for="item in facturasFiltradas"
              :key="item.idDetalleCxc"
              :class="{
                'fila-saldada': item.cancelado || item.saldo <= 0,
                'fila-activa-pago': item.abonoAplicar > 0,
                'fila-vencida': item.diasVencido > 0 && !item.cancelado && item.saldo > 0
              }"
            >
              <!-- FACTURA -->
              <td class="text-center font-weight-bold text-indigo-darken-3">
                <v-icon size="14" color="primary" class="mr-1">mdi-receipt-outline</v-icon>
                {{ item.noVenta || 'S/N' }}
              </td>

              <!-- FECHA -->
              <td class="text-center text-caption">
                {{ formatearFechaSimple(item.fechaRegistro) }}
              </td>

              <!-- ESTADO / DÍAS VENCIDO -->
              <td class="text-center">
                <v-chip
                  v-if="item.cancelado || item.saldo <= 0"
                  size="x-small"
                  color="green-darken-3"
                  variant="flat"
                  class="font-weight-bold"
                >
                  Saldada
                </v-chip>
                <v-chip
                  v-else-if="item.diasVencido > 0"
                  size="x-small"
                  color="error"
                  variant="flat"
                  class="font-weight-bold"
                >
                  Vencida ({{ item.diasVencido }}d)
                </v-chip>
                <v-chip
                  v-else
                  size="x-small"
                  color="indigo-darken-1"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  Al día
                </v-chip>
              </td>

              <!-- DÉBITO (TOTAL FACTURADO) -->
              <td class="text-end text-caption font-weight-medium">
                {{ formatedCurrency(item.debito) }}
              </td>

              <!-- CRÉDITO (ABONOS ACUMULADOS) -->
              <td class="text-end text-caption text-grey-darken-2">
                {{ formatedCurrency(item.credito) }}
              </td>

              <!-- SALDO ACTUAL PENDIENTE -->
              <td class="text-end font-weight-bold text-body-2 text-indigo-darken-4">
                {{ formatedCurrency(item.saldo) }}
              </td>

              <!-- ACCIÓN RÁPIDA: CHECKBOX SALDAR -->
              <td class="text-center bg-indigo-lighten-5">
                <v-checkbox-btn
                  v-model="item.saldar"
                  :disabled="item.cancelado || item.saldo <= 0 || guardando"
                  color="indigo-darken-3"
                  density="compact"
                  class="justify-center mx-auto"
                  @update:model-value="() => onToggleSaldar(item)"
                />
              </td>

              <!-- INPUT DE ABONO A APLICAR -->
              <td class="text-center bg-indigo-lighten-5 pa-1">
                <v-text-field
                  v-model.number="item.abonoAplicar"
                  type="number"
                  min="0"
                  :max="item.saldo"
                  step="0.01"
                  placeholder="0.00"
                  prefix="C$"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="input-abono font-weight-bold"
                  :disabled="item.cancelado || item.saldo <= 0 || guardando"
                  @input="() => onInputAbono(item)"
                  @focus="$event.target.select()"
                />
              </td>

              <!-- NUEVO SALDO CALCULADO EN TIEMPO REAL -->
              <td class="text-end font-weight-bold bg-indigo-lighten-5 pr-3">
                <span
                  v-if="(item.saldo - (item.abonoAplicar || 0)) <= 0.001 && item.saldo > 0 && item.abonoAplicar > 0"
                  class="text-green-darken-3 d-flex align-center justify-end"
                >
                  <v-icon size="14" color="green-darken-3" class="mr-1">mdi-check-circle</v-icon>
                  C$ 0.00
                </span>
                <span
                  v-else-if="item.abonoAplicar > 0"
                  class="text-amber-darken-4"
                >
                  {{ formatedCurrency(Math.max(0, item.saldo - (item.abonoAplicar || 0))) }}
                </span>
                <span
                  v-else-if="item.cancelado || item.saldo <= 0"
                  class="text-grey"
                >
                  C$ 0.00
                </span>
                <span v-else class="text-grey-darken-3">
                  {{ formatedCurrency(item.saldo) }}
                </span>
              </td>

              <!-- HISTORIAL DE ABONOS -->
              <td class="text-center">
                <v-tooltip text="Ver historial de abonos" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="x-small"
                      variant="text"
                      color="indigo-darken-3"
                      @click="abrirHistorialAbonos(item)"
                    >
                      <v-icon size="18">mdi-history</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>

      <!-- PANEL INFERIOR DE LIQUIDACIÓN Y PAGO (FOOTER INTEGRADO) -->
      <v-card-text class="pa-4 bg-grey-lighten-4 border-t">
        <v-row dense align="center">
          <!-- DATOS DE LA FORMA DE PAGO -->
          <v-col cols="12" md="6">
            <v-card variant="flat" class="pa-3 bg-white border rounded-lg h-100">
              <div class="text-subtitle-2 font-weight-bold text-indigo-darken-4 mb-2 d-flex align-center">
                <v-icon color="indigo-darken-3" size="18" class="mr-1">mdi-credit-card-outline</v-icon>
                Información del Pago
              </div>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="pago.idModalidad"
                    :items="cmb.modalidades"
                    item-title="nombre"
                    item-value="id"
                    label="Modalidad de Pago *"
                    variant="outlined"
                    density="compact"
                    hide-details
                    :disabled="guardando"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="pago.numReferencia"
                    label="N° Referencia / Banco"
                    placeholder="Ej. Cheque, Transf..."
                    variant="outlined"
                    density="compact"
                    hide-details
                    :disabled="guardando"
                  />
                </v-col>
                <v-col cols="12" class="mt-2">
                  <v-textarea
                    v-model="pago.observaciones"
                    label="Observaciones del Cobro"
                    placeholder="Detalles adicionales del abono..."
                    variant="outlined"
                    density="compact"
                    rows="2"
                    hide-details
                    auto-grow
                    :disabled="guardando"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- RESUMEN FINANCIERO REACTIVO EN TIEMPO REAL -->
          <v-col cols="12" md="6">
            <v-card variant="flat" class="pa-4 bg-white border rounded-lg h-100 d-flex flex-column justify-space-between">
              <div>
                <div class="text-subtitle-2 font-weight-bold text-indigo-darken-4 mb-3 d-flex align-center">
                  <v-icon color="indigo-darken-3" size="18" class="mr-1">mdi-calculator</v-icon>
                  Liquidación de Saldos
                </div>

                <div class="d-flex justify-space-between align-center py-1 border-b">
                  <span class="text-body-2 text-grey-darken-2 font-weight-medium">
                    Saldo Pendiente Actual:
                  </span>
                  <span class="text-body-1 font-weight-bold text-grey-darken-4">
                    {{ formatedCurrency(resumen.saldoTotalPendiente) }}
                  </span>
                </div>

                <div class="d-flex justify-space-between align-center py-2 border-b bg-indigo-lighten-5 px-2 rounded mt-1">
                  <span class="text-body-2 font-weight-bold text-indigo-darken-4 d-flex align-center">
                    <v-icon size="16" class="mr-1" color="indigo-darken-4">mdi-cash-plus</v-icon>
                    Total a Abonar (Recibo Neto):
                  </span>
                  <span class="text-h6 font-weight-black text-indigo-darken-4">
                    {{ formatedCurrency(totalAbonarCalculado) }}
                  </span>
                </div>

                <div class="d-flex justify-space-between align-center py-2 px-2 mt-1 rounded"
                     :class="saldoRestanteCalculado <= 0 ? 'bg-green-lighten-5' : 'bg-amber-lighten-5'">
                  <span class="text-body-2 font-weight-bold"
                        :class="saldoRestanteCalculado <= 0 ? 'text-green-darken-4' : 'text-amber-darken-4'">
                    <v-icon size="16" class="mr-1"
                            :color="saldoRestanteCalculado <= 0 ? 'green-darken-4' : 'amber-darken-4'">
                      {{ saldoRestanteCalculado <= 0 ? 'mdi-check-decagram' : 'mdi-cash-clock' }}
                    </v-icon>
                    Saldo Después de este Pago:
                  </span>
                  <span class="text-h6 font-weight-black"
                        :class="saldoRestanteCalculado <= 0 ? 'text-green-darken-4' : 'text-amber-darken-4'">
                    {{ formatedCurrency(saldoRestanteCalculado) }}
                  </span>
                </div>
              </div>

              <!-- BOTONES DE ACCIÓN PRINCIPALES -->
              <div class="d-flex align-center justify-end ga-2 mt-4">
                <v-btn
                  variant="outlined"
                  color="grey-darken-1"
                  @click="limpiarAbonos"
                  :disabled="guardando || totalAbonarCalculado <= 0"
                  class="text-none"
                >
                  <v-icon start size="16">mdi-refresh</v-icon>
                  Limpiar
                </v-btn>

                <v-btn
                  v-if="hasAccessToFunct('85')"
                  color="indigo-darken-4"
                  variant="flat"
                  size="large"
                  elevation="2"
                  @click="guardarReciboAbonos"
                  :disabled="!puedeGuardar || guardando"
                  :loading="guardando"
                  class="text-none px-6 font-weight-bold"
                >
                  <v-icon start size="20">mdi-content-save-check-outline</v-icon>
                  Registrar Pago ({{ formatedCurrency(totalAbonarCalculado) }})
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- DIÁLOGO MODAL: HISTORIAL DE ABONOS DE FACTURA ESPECÍFICA -->
    <v-dialog v-model="display.visualizarAbonos" max-width="880" width="880" persistent>
      <visualizar-abonos
        v-if="display.visualizarAbonos"
        @close="closeVisualizarAbonosDisplay"
        :credito="facturaSeleccionadaAbonos"
      />
    </v-dialog>

    <!-- DIÁLOGO MODAL: CONFIRMACIÓN Y EMISIÓN DE TICKET -->
    <v-dialog v-model="display.ticketModal" max-width="520" persistent>
      <v-card class="rounded-xl overflow-hidden border">
        <div class="px-5 py-4 bg-indigo-darken-4 d-flex align-center justify-space-between text-white">
          <div class="d-flex align-center">
            <v-icon color="white" size="24" class="mr-2">mdi-check-circle-outline</v-icon>
            <span class="text-h6 font-weight-bold">Pago Registrado con Éxito</span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="white" @click="display.ticketModal = false" />
        </div>

        <v-card-text class="pa-5">
          <div v-if="ultimoRecibo" class="ticket-preview pa-4 border rounded-lg bg-grey-lighten-5">
            <div class="text-center pb-2 border-b">
              <div class="text-subtitle-1 font-weight-black text-indigo-darken-4">
                {{ ultimoRecibo.empresa?.nombre || 'RECIBO OFICIAL DE CAJA' }}
              </div>
              <div class="text-caption text-grey">
                {{ ultimoRecibo.empresa?.direccion || 'Comprobante de Abono a Crédito' }}
              </div>
            </div>

            <div class="py-2 text-caption border-b">
              <div class="d-flex justify-space-between">
                <span><strong>Fecha:</strong> {{ ultimoRecibo.fechaFormateada }} {{ ultimoRecibo.horaFormateada }}</span>
                <span><strong>Modalidad:</strong> {{ ultimoRecibo.modalidad }}</span>
              </div>
              <div><strong>Cliente:</strong> {{ ultimoRecibo.cliente?.nombre }}</div>
              <div v-if="ultimoRecibo.numReferencia">
                <strong>Referencia:</strong> {{ ultimoRecibo.numReferencia }}
              </div>
            </div>

            <!-- DETALLE DE FACTURAS ABONADAS -->
            <div class="py-2 border-b">
              <div class="text-caption font-weight-bold mb-1 text-indigo-darken-4">
                Facturas Abonadas ({{ ultimoRecibo.totalFacturasAbonadas }}):
              </div>
              <div
                v-for="f in ultimoRecibo.facturasAbonadas"
                :key="f.idDetalleCxc"
                class="d-flex justify-space-between text-caption py-1 border-b-dashed"
              >
                <span>Factura N° {{ f.noFactura }}</span>
                <span class="font-weight-bold text-indigo-darken-3">{{ f.montoAbonadoFormateado }}</span>
              </div>
            </div>

            <!-- TOTALES -->
            <div class="pt-2 text-body-2">
              <div class="d-flex justify-space-between py-1 font-weight-bold">
                <span>TOTAL ABONADO:</span>
                <span class="text-indigo-darken-4">{{ ultimoRecibo.totalAbonadoFormateado }}</span>
              </div>
              <div class="d-flex justify-space-between py-1 text-caption text-grey-darken-2">
                <span>Saldo Anterior:</span>
                <span>{{ ultimoRecibo.saldoTotalAnteriorFormateado }}</span>
              </div>
              <div class="d-flex justify-space-between py-1 text-caption font-weight-bold text-amber-darken-4">
                <span>Saldo Restante:</span>
                <span>{{ ultimoRecibo.saldoTotalRestanteFormateado }}</span>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 bg-white d-flex justify-end ga-2">
          <v-btn
            variant="outlined"
            color="grey-darken-1"
            @click="display.ticketModal = false"
            class="text-none"
          >
            Cerrar
          </v-btn>
          <v-btn
            color="indigo-darken-4"
            variant="flat"
            prepend-icon="mdi-printer"
            @click="imprimirTicketRecibo"
            class="text-none font-weight-bold px-4"
          >
            Imprimir Ticket Térmico
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <OverlayComp :show="guardando" />
  </div>
</template>

<script>
import { httpGet, httpPost, getItemsCombobox } from '@/scripts/api.js'
import { useSnackbar } from '@/composables/use-snackbar.js'
import { formatters } from '@/helpers/formatters.js'
import { getDate } from '@/scripts/utils.js'
import { hasAccessToFunct } from '@/scripts/Seguridad.js'
import VisualizarAbonos from '@/views/general/por-cobrar/cuentas-por-cobrar/components/visualizar-abonos.vue'
import OverlayComp from '@/components/reutilizable/OverlayComp.vue'

export default {
  name: 'visualizar-cuentas',

  components: {
    VisualizarAbonos,
    OverlayComp
  },

  props: {
    cxc: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      snackbar: useSnackbar(),
      loadingResumen: false,
      guardando: false,

      search: '',
      filtroEstado: 'pendientes', // 'pendientes' | 'todas'

      resumen: {
        idCxc: 0,
        noCxc: '',
        cliente: {
          idCliente: 0,
          codigo: '',
          nombre: '',
          telefono: '',
          direccion: '',
          ruta: ''
        },
        saldoTotalPendiente: 0,
        totalFacturasPendientes: 0,
        totalFacturasSaldadas: 0,
        facturas: []
      },

      pago: {
        idModalidad: 1, // 1: Efectivo por defecto
        numReferencia: '',
        fechaMovimiento: getDate(),
        numRecibo: '',
        observaciones: ''
      },

      cmb: {
        modalidades: []
      },

      display: {
        visualizarAbonos: false,
        ticketModal: false
      },

      facturaSeleccionadaAbonos: {},
      ultimoRecibo: null
    }
  },

  computed: {
    facturasFiltradas() {
      let lista = this.resumen.facturas || []

      // Filtro de estado
      if (this.filtroEstado === 'pendientes') {
        lista = lista.filter((f) => !f.cancelado && f.saldo > 0)
      }

      // Filtro de búsqueda por N° de Factura
      if (this.search && this.search.trim() !== '') {
        const query = this.search.trim().toLowerCase()
        lista = lista.filter((f) =>
          (f.noVenta || '').toLowerCase().includes(query)
        )
      }

      return lista
    },

    totalAbonarCalculado() {
      return (this.resumen.facturas || []).reduce((acc, f) => {
        const monto = Number(f.abonoAplicar) || 0
        return acc + monto
      }, 0)
    },

    saldoRestanteCalculado() {
      const saldoInicial = Number(this.resumen.saldoTotalPendiente) || 0
      return Math.max(0, Math.round((saldoInicial - this.totalAbonarCalculado) * 100) / 100)
    },

    tieneFacturasPendientes() {
      return (this.resumen.facturas || []).some((f) => !f.cancelado && f.saldo > 0)
    },

    puedeGuardar() {
      return (
        this.totalAbonarCalculado > 0 &&
        this.pago.idModalidad > 0 &&
        !this.guardando
      )
    }
  },

  methods: {
    hasAccessToFunct,

    async loadComboboxes() {
      try {
        const modalidades = await getItemsCombobox('api/modalidades/combobox', false)
        this.cmb.modalidades = modalidades
        if (modalidades.length > 0 && !this.pago.idModalidad) {
          this.pago.idModalidad = modalidades[0].id || modalidades[0].value
        }
      } catch (e) {
        console.error('Error cargando modalidades:', e)
      }
    },

    async loadResumenCliente() {
      this.loadingResumen = true
      try {
        const data = await httpGet(`api/cuentas-cobrar/${this.cxc.idCxc}/resumen-cliente`)
        if (data) {
          // Preparamos las facturas con propiedades reactivas para cobro
          const facturas = (data.facturas || []).map((f) => ({
            ...f,
            debito: Number(f.debito) || 0,
            credito: Number(f.credito) || 0,
            saldo: Number(f.saldo) || 0,
            saldar: false,
            abonoAplicar: null
          }))

          this.resumen = {
            ...data,
            saldoTotalPendiente: Number(data.saldoTotalPendiente) || 0,
            facturas
          }
        }
      } catch (e) {
        this.handleException(e)
      } finally {
        this.loadingResumen = false
      }
    },

    onToggleSaldar(item) {
      if (item.saldar) {
        item.abonoAplicar = Number(item.saldo)
      } else {
        item.abonoAplicar = null
      }
    },

    onInputAbono(item) {
      if (item.abonoAplicar === null || item.abonoAplicar === undefined || item.abonoAplicar === '') {
        item.saldar = false
        return
      }

      let val = Number(item.abonoAplicar)
      if (isNaN(val) || val < 0) {
        item.abonoAplicar = 0
        val = 0
      }

      // Validar que no supere el saldo actual
      if (val > item.saldo) {
        this.snackbar.notify('warning', `El abono no puede superar el saldo pendiente de la factura (C$ ${item.saldo.toFixed(2)})`)
        item.abonoAplicar = Number(item.saldo)
        val = Number(item.saldo)
      }

      item.saldar = val === Number(item.saldo) && val > 0
    },

    saldarTodasPendientes() {
      (this.resumen.facturas || []).forEach((f) => {
        if (!f.cancelado && f.saldo > 0) {
          f.saldar = true
          f.abonoAplicar = Number(f.saldo)
        }
      })
    },

    limpiarAbonos() {
      (this.resumen.facturas || []).forEach((f) => {
        f.saldar = false
        f.abonoAplicar = null
      })
    },

    async guardarReciboAbonos() {
      const facturasConAbono = (this.resumen.facturas || []).filter(
        (f) => Number(f.abonoAplicar) > 0
      )

      if (facturasConAbono.length === 0) {
        return this.snackbar.notify('warning', 'Debe ingresar al menos un abono mayor a cero.')
      }

      if (!this.pago.idModalidad) {
        return this.snackbar.notify('warning', 'Seleccione la modalidad de pago.')
      }

      const usuarioToken = JSON.parse(localStorage.getItem('token') || '{}')
      const usuario = usuarioToken.usuario || 'Sistema'

      const payload = {
        idCxc: this.cxc.idCxc,
        idModalidad: Number(this.pago.idModalidad),
        numReferencia: this.pago.numReferencia ? this.pago.numReferencia.trim() : null,
        fechaMovimiento: this.pago.fechaMovimiento || getDate(),
        observaciones: this.pago.observaciones ? this.pago.observaciones.trim() : null,
        usuarioRegistro: usuario,
        abonos: facturasConAbono.map((f) => ({
          idDetalleCxc: f.idDetalleCxc,
          monto: Number(f.abonoAplicar)
        }))
      }

      this.guardando = true
      try {
        const response = await httpPost('api/creditos/abono-recibo-multiple', payload)

        if (response.status === 200 || response.status === 201) {
          this.snackbar.notify('success', 'Recibo de abono registrado correctamente.')
          this.ultimoRecibo = response.data?.data || null
          this.display.ticketModal = true

          // Limpiar inputs del pago
          this.pago.numReferencia = ''
          this.pago.observaciones = ''

          // Imprimir ticket en la impresora térmica de manera automática
          await this.imprimirTicketRecibo(this.ultimoRecibo, false)

          // Recargar el estado de cuenta actualizado
          await this.loadResumenCliente()
        } else {
          this.snackbar.notify('error', response.data?.msg || 'Error al procesar el pago.')
        }
      } catch (e) {
        this.handleException(e)
      } finally {
        this.guardando = false
      }
    },

    abrirHistorialAbonos(factura) {
      this.facturaSeleccionadaAbonos = {
        idDetalleCxc: factura.idDetalleCxc,
        noVenta: factura.noVenta
      }
      this.display.visualizarAbonos = true
    },

    closeVisualizarAbonosDisplay() {
      this.display.visualizarAbonos = false
    },

    async imprimirTicketRecibo(reciboObj = null, esReimpresion = false) {
      const target = reciboObj || this.ultimoRecibo
      if (!target) return

      const NEGOCIO = {
        nombre: target.empresa?.nombre || "Migdalia's Market",
        direccion: target.empresa?.direccion || 'Mercado Mayoreo Modulo #4',
        telefono: target.empresa?.telefono || '2263-2783',
        ruc: target.empresa?.ruc || ''
      }

      const ANCHO = 42
      const separador = '-'.repeat(ANCHO) + '\n'
      const lineaDosCols = (izq, der) => {
        izq = String(izq || '')
        der = String(der || '')
        const espacio = ANCHO - izq.length - der.length
        return espacio > 0 ? izq + ' '.repeat(espacio) + der + '\n' : izq.slice(0, Math.max(0, ANCHO - der.length - 1)) + ' ' + der + '\n'
      }

      // Intentar imprimir vía QZ Tray (formato térmico 80mm) si está activo
      try {
        const qz = window.qz
        if (!qz) {
          this.snackbar.notify('warning', 'QZ Tray no está disponible en la ventana. Abriendo comprobante.')
          this.display.ticketModal = true
          return
        }

        if (!qz.websocket.isActive()) {
          await qz.websocket.connect()
        }
        const nombreImpresora = await qz.printers.find('POS-80C')
        const config = qz.configs.create(nombreImpresora)

        const lineasFacturas = (target.facturasAbonadas || []).map((f) => {
          return `Factura N° ${f.noFactura}\n` +
                 lineaDosCols(`  Saldo Ant: ${f.saldoAnteriorFormateado}`, `Abono: ${f.montoAbonadoFormateado}`) +
                 lineaDosCols(`  Saldo Act: ${f.saldoActualFormateado}`, f.cancelado ? ' [Saldada]' : '')
        })

        const rawData = [
          '\x1B\x40',             // init
          '\x1B\x61\x01',         // centrar
          '\x1B\x21\x10',         // doble altura
          '\x1B\x45\x01',         // negrita ON
          `${NEGOCIO.nombre}\n`,
          '\x1B\x45\x00',         // negrita OFF
          '\x1B\x21\x00',         // normal
          NEGOCIO.direccion ? `${NEGOCIO.direccion}\n` : '',
          NEGOCIO.telefono ? `Tel: ${NEGOCIO.telefono}\n` : '',
          NEGOCIO.ruc ? `RUC: ${NEGOCIO.ruc}\n` : '',
          separador,

          '\x1B\x45\x01',
          'COMPROBANTE DE ABONO\n',
          esReimpresion ? '*** REIMPRESIÓN ***\n' : '',
          '\x1B\x45\x00',
          '\x1B\x61\x00',         // izquierda
          `COMPROBANTE ROC N°: ${target.idCxc || 'N/A'}\n`,
          `Fecha:     ${target.fechaFormateada}  Hora: ${target.horaFormateada}\n`,
          `Cliente:   ${target.cliente?.nombre || 'General'}\n`,
          `Modalidad: ${target.modalidad || 'Efectivo'}\n`,
          target.numReferencia ? `Referencia: ${target.numReferencia}\n` : '',
          esReimpresion ? `Reimpreso:  ${new Date().toLocaleString()}\n` : '',
          separador,

          '\x1B\x45\x01',
          'FACTURAS ABONADAS:\n',
          '\x1B\x45\x00',
          ...lineasFacturas,
          separador,

          lineaDosCols('Saldo Total Ant:', target.saldoTotalAnteriorFormateado),
          '\x1B\x45\x01',
          lineaDosCols('TOTAL ABONADO:', target.totalAbonadoFormateado),
          '\x1B\x45\x00',
          lineaDosCols('Saldo Restante:', target.saldoTotalRestanteFormateado),
          separador,

          '\x1B\x61\x01',         // centrar
          '¡Gracias por su pago!\n\n\n\n\n',
          '\x1D\x56\x00'          // corte de papel
        ]

        await qz.print(config, rawData)
        this.snackbar.notify('success', esReimpresion ? 'Reimpresión enviada a POS-80C exitosamente.' : 'Comprobante impreso en POS-80C exitosamente.')
      } catch (err) {
        console.error('Error al imprimir comprobante en POS-80C:', err)
        this.snackbar.notify('warning', 'No se pudo imprimir en POS-80C. Puede revisar desde la vista previa.')
        this.display.ticketModal = true
      }
    },

    // FORMATTERS
    formatedCurrency(val) {
      return formatters.formatCurrency(val || 0)
    },

    formatearFechaSimple(dateString) {
      if (!dateString) return 'S/F'
      const d = new Date(dateString)
      if (isNaN(d.getTime())) return dateString
      return d.toLocaleDateString('es-NI', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    },

    // EXCEPTION HANDLER
    handleException(ex) {
      if (ex.status === 401) {
        // Redirigir o manejar sesión
      } else if (ex.status === 403) {
        this.snackbar.notify('error', 'No tiene los permisos necesarios.')
      } else {
        const msg = ex.data?.msg || ex.response?.data?.msg || 'Ha ocurrido un error inesperado.'
        this.snackbar.notify('error', msg)
      }
    },

    close() {
      this.$emit('close')
    }
  },

  mounted() {
    this.loadComboboxes()
    this.loadResumenCliente()
  }
}
</script>

<style scoped>
.visualizar-cuentas-container {
  animation: fadeIn 0.25s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-gradient {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
}

.border-amber {
  border: 1px solid #ffb300 !important;
}

.border-green {
  border: 1px solid #4caf50 !important;
}

.font-sm {
  font-size: 13px !important;
}

.tabla-cobros {
  font-size: 13px;
}

.tabla-cobros th {
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #1a237e;
  border-bottom: 2px solid #c5cae9 !important;
}

.tabla-cobros td {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  border-bottom: 1px solid #e8eaf6 !important;
}

.fila-saldada {
  background-color: #f1f8e9 !important;
  opacity: 0.85;
}

.fila-activa-pago {
  background-color: #e8eaf6 !important;
}

.fila-vencida {
  background-color: #fff3e0 !important;
}

.input-abono :deep(input) {
  text-align: right !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  color: #1a237e !important;
}

.input-abono :deep(.v-field__input) {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  min-height: 36px !important;
}

.ticket-preview {
  font-family: 'Courier New', Courier, monospace;
}

.border-b-dashed {
  border-bottom: 1px dashed #bdbdbd;
}

@media print {
  body * {
    visibility: hidden;
  }
  .ticket-preview, .ticket-preview * {
    visibility: visible;
  }
  .ticket-preview {
    position: absolute;
    left: 0;
    top: 0;
    width: 80mm;
    margin: 0;
    padding: 0;
  }
}
</style>