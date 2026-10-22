<template>
  <div class="cxc-minimal-view">
    <!-- TARJETA PRINCIPAL: ESTADO DE CUENTA Y ABONOS (MINIMALISTA) -->
    <v-card class="elevation-1 rounded-lg border bg-white">
      <!-- HEADER MINIMALISTA (FONDO BLANCO, SIN COLORES PESADOS) -->
      <div class="px-5 py-4 border-b bg-white">
        <v-row dense align="center" justify="space-between">
          <!-- TÍTULO -->
          <v-col cols="12" md="5">
            <div class="d-flex align-center">
              <v-icon color="primary" size="28" class="mr-3">mdi-cash-clock</v-icon>
              <div>
                <h1 class="text-h6 font-weight-bold text-grey-darken-3 mb-0" style="line-height: 1.2;">
                  Cuentas por Cobrar
                </h1>
                <div class="text-caption text-grey-darken-1">
                  Consulta de estado de crédito y registro de abonos
                </div>
              </div>
            </div>
          </v-col>

          <!-- AUTOCOMPLETE DE BÚSQUEDA Y SELECCIÓN DE CLIENTE -->
          <v-col cols="12" md="7">
            <v-autocomplete
              v-model="selectedIdCxc"
              :items="listaClientes"
              item-title="nombre"
              item-value="idCxc"
              label="Seleccionar Cliente *"
              placeholder="Buscar cliente por nombre..."
              prepend-inner-icon="mdi-account-search-outline"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              :loading="loadingClientes"
              class="cliente-select"
              @update:model-value="onClienteSeleccionado"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="item.raw.nombre">
                  <template v-slot:subtitle>
                    <span class="text-caption text-grey-darken-2">
                      Saldo: <strong class="text-primary">{{ formatedCurrency(item.raw.saldoPendiente) }}</strong>
                      <span v-if="item.raw.ruta" class="ml-2 text-grey">| Ruta: {{ item.raw.ruta }}</span>
                      <span class="ml-2" :class="item.raw.pendientes > 0 ? 'text-amber-darken-3 font-weight-bold' : 'text-green'">
                        | {{ item.raw.pendientes }} facturas pendientes
                      </span>
                    </span>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </div>

      <!-- ESTADO: NINGÚN CLIENTE SELECCIONADO -->
      <div v-if="!selectedIdCxc" class="py-16 text-center text-grey-darken-1">
        <v-avatar size="64" color="grey-lighten-4" class="mb-3">
          <v-icon size="32" color="grey-darken-1">mdi-account-search-outline</v-icon>
        </v-avatar>
        <div class="text-subtitle-1 font-weight-bold text-grey-darken-3">
          Seleccione un cliente para consultar su cuenta
        </div>
        <div class="text-caption text-grey">
          Utilice el buscador superior para cargar las facturas pendientes y registrar abonos.
        </div>
      </div>

      <!-- CONTENIDO ACTIVO: CUENTA DEL CLIENTE SELECCIONADO -->
      <template v-else>
        <!-- FICHA DE INFORMACIÓN DEL CLIENTE (MINIMALISTA) -->
        <div class="px-5 py-3 bg-grey-lighten-5 border-b">
          <v-row dense align="center">
            <!-- DATOS BÁSICOS -->
            <v-col cols="12" md="8">
              <div class="d-flex flex-wrap align-center ga-3">
                <div class="d-flex align-center">
                  <v-avatar size="32" color="indigo-lighten-5" class="mr-2">
                    <v-icon size="18" color="primary">mdi-account-tie</v-icon>
                  </v-avatar>
                  <div>
                    <span class="text-subtitle-2 font-weight-bold text-grey-darken-3 mr-2">
                      {{ clienteInfo.nombre || 'Cargando cliente...' }}
                    </span>
                    <v-chip v-if="clienteInfo.codigo" size="x-small" variant="outlined" color="primary" class="font-weight-bold">
                      CÓD: {{ clienteInfo.codigo }}
                    </v-chip>
                  </div>
                </div>

                <v-divider vertical class="d-none d-sm-block my-1" />

                <div class="d-flex flex-wrap align-center ga-3 text-caption text-grey-darken-2">
                  <span v-if="clienteInfo.telefono" class="d-flex align-center">
                    <v-icon size="14" class="mr-1 text-grey">mdi-phone-outline</v-icon>
                    {{ clienteInfo.telefono }}
                  </span>
                  <span v-if="clienteInfo.direccion" class="d-flex align-center">
                    <v-icon size="14" class="mr-1 text-grey">mdi-map-marker-outline</v-icon>
                    {{ clienteInfo.direccion }}
                  </span>
                  <span v-if="clienteInfo.ruta" class="d-flex align-center">
                    <v-icon size="14" class="mr-1 text-grey">mdi-truck-outline</v-icon>
                    Ruta: {{ clienteInfo.ruta }}
                  </span>
                </div>
              </div>
            </v-col>

            <!-- RESUMEN DE SALDO DEL CLIENTE -->
            <v-col cols="12" md="4" class="text-md-end mt-2 mt-md-0">
              <div class="d-flex align-center justify-md-end ga-2 flex-wrap">
                <v-chip
                  size="small"
                  variant="flat"
                  :color="resumen.saldoTotalPendiente > 0 ? 'amber-lighten-5' : 'green-lighten-5'"
                  :class="resumen.saldoTotalPendiente > 0 ? 'text-amber-darken-4 font-weight-bold' : 'text-green-darken-4 font-weight-bold'"
                >
                  <v-icon start size="14">
                    {{ resumen.saldoTotalPendiente > 0 ? 'mdi-clock-outline' : 'mdi-check-circle-outline' }}
                  </v-icon>
                  Saldo Total: {{ formatedCurrency(resumen.saldoTotalPendiente) }}
                </v-chip>

                <v-chip size="small" variant="outlined" color="grey-darken-2" class="font-weight-medium">
                  {{ resumen.totalFacturasPendientes }} Facturas Pendientes
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- BARRA DE FILTROS Y ACCIONES DE FACTURAS -->
        <div class="px-5 py-2 border-b bg-white">
          <v-row dense align="center" justify="space-between">
            <!-- BUSCADOR -->
            <v-col cols="12" sm="5" md="4">
              <v-text-field
                v-model="search"
                placeholder="Filtrar por N° de Factura..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              />
            </v-col>

            <!-- TOGGLE DE ESTADO -->
            <v-col cols="12" sm="7" md="4" class="d-flex align-center justify-start justify-md-center">
              <v-btn-toggle
                v-model="filtroEstado"
                mandatory
                density="compact"
                color="primary"
                rounded="md"
                variant="outlined"
                class="w-100 w-sm-auto"
              >
                <v-btn value="pendientes" size="small" class="text-caption font-weight-bold flex-grow-1 flex-sm-grow-0">
                  Pendientes ({{ resumen.totalFacturasPendientes }})
                </v-btn>
                <v-btn value="todas" size="small" class="text-caption font-weight-bold flex-grow-1 flex-sm-grow-0">
                  Todas ({{ resumen.facturas.length }})
                </v-btn>
              </v-btn-toggle>
            </v-col>

            <!-- ACCIONES RÁPIDAS -->
            <v-col cols="12" md="4" class="d-flex align-center justify-start justify-md-end ga-2 mt-2 mt-md-0">
              <v-btn
                size="small"
                variant="tonal"
                color="primary"
                prepend-icon="mdi-check-all"
                @click="saldarTodasPendientes"
                :disabled="!tieneFacturasPendientes || guardando"
                class="text-none font-weight-bold flex-grow-1 flex-md-grow-0"
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
                class="text-none flex-grow-1 flex-md-grow-0"
              >
                Limpiar Abonos
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <!-- TABLA DE FACTURAS Y COBRO EN LÍNEA -->
        <v-table density="compact" class="tabla-minimal" hover>
          <thead>
            <tr class="bg-grey-lighten-4">
              <th class="text-center font-weight-bold" style="width: 100px;">Factura</th>
              <th class="text-center font-weight-bold" style="width: 105px;">Fecha Factura</th>
              <th class="text-center font-weight-bold" style="width: 105px;">Estado</th>
              <th class="text-end font-weight-bold" style="width: 120px;">Débito</th>
              <th class="text-end font-weight-bold" style="width: 120px;">Crédito (Abonos)</th>
              <th class="text-end font-weight-bold" style="width: 130px;">Saldo Actual</th>
              <th class="text-center font-weight-bold bg-grey-lighten-3" style="width: 95px;">Saldar</th>
              <th class="text-center font-weight-bold bg-grey-lighten-3" style="width: 170px;">Abono a Aplicar</th>
              <th class="text-end font-weight-bold bg-grey-lighten-3" style="width: 135px;">Nuevo Saldo</th>
              <th class="text-center font-weight-bold" style="width: 70px;">Historial</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loadingResumen">
              <td colspan="10" class="text-center py-8 text-grey">
                <v-progress-circular indeterminate color="primary" size="24" class="mr-2" />
                Cargando estado de cuenta del cliente...
              </td>
            </tr>
            <tr v-else-if="facturasFiltradas.length === 0">
              <td colspan="10" class="text-center py-8 text-grey">
                <v-icon color="grey" class="mr-1">mdi-alert-circle-outline</v-icon>
                No se encontraron facturas pendientes para este cliente.
              </td>
            </tr>
            <tr
              v-else
              v-for="item in facturasFiltradas"
              :key="item.idDetalleCxc"
              :class="{
                'fila-saldada': item.cancelado || item.saldo <= 0,
                'fila-con-abono': item.abonoAplicar > 0,
                'fila-vencida': item.diasVencido > 0 && !item.cancelado && item.saldo > 0
              }"
            >
              <!-- FACTURA -->
              <td class="text-center font-weight-bold text-grey-darken-3">
                {{ item.noVenta || 'S/N' }}
              </td>

              <!-- FECHA -->
              <td class="text-center text-caption text-grey-darken-2">
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
                  color="primary"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  Al día
                </v-chip>
              </td>

              <!-- DÉBITO -->
              <td class="text-end text-caption font-weight-medium">
                {{ formatedCurrency(item.debito) }}
              </td>

              <!-- CRÉDITO (ABONOS PREVIOS) -->
              <td class="text-end text-caption text-grey-darken-2">
                {{ formatedCurrency(item.credito) }}
              </td>

              <!-- SALDO ACTUAL -->
              <td class="text-end font-weight-bold text-body-2 text-grey-darken-4">
                {{ formatedCurrency(item.saldo) }}
              </td>

              <!-- CHECKBOX SALDAR -->
              <td class="text-center bg-grey-lighten-5">
                <v-checkbox-btn
                  v-model="item.saldar"
                  :disabled="item.cancelado || item.saldo <= 0 || guardando"
                  color="primary"
                  density="compact"
                  class="justify-center mx-auto"
                  @update:model-value="() => onToggleSaldar(item)"
                />
              </td>

              <!-- INPUT DE ABONO A APLICAR -->
              <td class="text-center bg-grey-lighten-5 pa-1">
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
                  class="input-abono-clean"
                  :disabled="item.cancelado || item.saldo <= 0 || guardando"
                  @input="() => onInputAbono(item)"
                  @focus="$event.target.select()"
                />
              </td>

              <!-- NUEVO SALDO CALCULADO EN VIVO -->
              <td class="text-end font-weight-bold bg-grey-lighten-5 pr-3">
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
                <v-tooltip text="Ver abonos anteriores" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="x-small"
                      variant="text"
                      color="grey-darken-2"
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

        <!-- PANEL DE LIQUIDACIÓN Y PAGO (MINIMALISTA) -->
        <div class="pa-4 bg-grey-lighten-5 border-t">
          <v-row dense align="center">
            <!-- DETALLES DEL PAGO -->
            <v-col cols="12" md="6">
              <v-card variant="flat" class="pa-3 bg-white border rounded-lg h-100">
                <div class="text-caption font-weight-bold text-grey-darken-3 mb-2 text-uppercase">
                  Parámetros del Abono
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
                      v-model="pago.fechaMovimiento"
                      type="date"
                      label="Fecha"
                      variant="outlined"
                      density="compact"
                      hide-details
                      :disabled="guardando"
                    />
                  </v-col>
                  <v-col cols="12" class="mt-2">
                    <v-text-field
                      v-model="pago.numReferencia"
                      label="N° Referencia / Banco"
                      placeholder="Ej. Cheque #, Transferencia, Depósito..."
                      variant="outlined"
                      density="compact"
                      hide-details
                      :disabled="guardando"
                    />
                  </v-col>
                  <v-col cols="12" class="mt-2">
                    <v-text-field
                      v-model="pago.observaciones"
                      label="Observaciones"
                      placeholder="Notas del abono (opcional)..."
                      variant="outlined"
                      density="compact"
                      hide-details
                      :disabled="guardando"
                    />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- RESUMEN EN VIVO Y BOTÓN GUARDAR -->
            <v-col cols="12" md="6">
              <v-card variant="flat" class="pa-4 bg-white border rounded-lg h-100 d-flex flex-column justify-space-between">
                <div>
                  <div class="text-caption font-weight-bold text-grey-darken-3 mb-2 text-uppercase">
                    Resumen de Saldos
                  </div>

                  <div class="d-flex justify-space-between align-center py-1 border-b">
                    <span class="text-body-2 text-grey-darken-2">Saldo Total Inicial:</span>
                    <span class="text-body-1 font-weight-bold text-grey-darken-4">
                      {{ formatedCurrency(resumen.saldoTotalPendiente) }}
                    </span>
                  </div>

                  <div class="d-flex justify-space-between align-center py-2 border-b bg-grey-lighten-4 px-2 rounded mt-1">
                    <span class="text-body-2 font-weight-bold text-primary d-flex align-center">
                      <v-icon size="16" class="mr-1" color="primary">mdi-cash-plus</v-icon>
                      Total a Abonar:
                    </span>
                    <span class="text-h6 font-weight-bold text-primary">
                      {{ formatedCurrency(totalAbonarCalculado) }}
                    </span>
                  </div>

                  <div class="d-flex justify-space-between align-center py-2 px-2 mt-1 rounded"
                       :class="saldoRestanteCalculado <= 0 ? 'bg-green-lighten-5' : 'bg-grey-lighten-4'">
                    <span class="text-body-2 font-weight-bold"
                          :class="saldoRestanteCalculado <= 0 ? 'text-green-darken-4' : 'text-grey-darken-3'">
                      Saldo Restante:
                    </span>
                    <span class="text-h6 font-weight-bold"
                          :class="saldoRestanteCalculado <= 0 ? 'text-green-darken-4' : 'text-grey-darken-4'">
                      {{ formatedCurrency(saldoRestanteCalculado) }}
                    </span>
                  </div>
                </div>

                <!-- ACCIONES -->
                <div class="d-flex align-center justify-end ga-2 mt-4">
                  <v-btn
                    variant="outlined"
                    color="grey-darken-1"
                    @click="limpiarAbonos"
                    :disabled="guardando || totalAbonarCalculado <= 0"
                    class="text-none"
                  >
                    Limpiar
                  </v-btn>

                  <v-btn
                    v-if="hasAccessToFunct('85')"
                    color="primary"
                    variant="flat"
                    size="large"
                    @click="guardarAbono"
                    :disabled="!puedeGuardar || guardando"
                    :loading="guardando"
                    class="text-none px-6 font-weight-bold"
                  >
                    <v-icon start size="20">mdi-content-save-check-outline</v-icon>
                    Registrar Abono ({{ formatedCurrency(totalAbonarCalculado) }})
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-card>

    <!-- MODAL: HISTORIAL DE ABONOS DE FACTURA -->
    <v-dialog v-model="display.visualizarAbonos" max-width="880" width="880" persistent>
      <visualizar-abonos
        v-if="display.visualizarAbonos"
        @close="display.visualizarAbonos = false"
        :credito="facturaSeleccionadaAbonos"
      />
    </v-dialog>

    <!-- MODAL: CONFIRMACIÓN Y COMPROBANTE DE ABONO -->
    <v-dialog v-model="display.ticketModal" max-width="500" persistent>
      <v-card class="rounded-lg border">
        <div class="px-4 py-3 bg-white border-b d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon color="success" size="22" class="mr-2">mdi-check-circle-outline</v-icon>
            <span class="text-subtitle-1 font-weight-bold text-grey-darken-3">Abono Registrado</span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="display.ticketModal = false" />
        </div>

        <v-card-text class="pa-4">
          <div v-if="ultimoRecibo" class="comprobante-preview pa-3 border rounded bg-grey-lighten-5">
            <div class="text-center pb-2 border-b">
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                {{ ultimoRecibo.empresa?.nombre || 'COMPROBANTE DE ABONO' }}
              </div>
              <div class="text-caption text-grey">
                {{ ultimoRecibo.empresa?.direccion || '' }}
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

            <div class="py-2 border-b">
              <div class="text-caption font-weight-bold mb-1 text-grey-darken-3">
                Facturas Abonadas ({{ ultimoRecibo.totalFacturasAbonadas }}):
              </div>
              <div
                v-for="f in ultimoRecibo.facturasAbonadas"
                :key="f.idDetalleCxc"
                class="py-1 border-b-dashed text-caption"
              >
                <div class="d-flex justify-space-between">
                  <span>Factura N° {{ f.noFactura }}</span>
                  <span class="font-weight-bold text-primary">{{ f.montoAbonadoFormateado }}</span>
                </div>
                <div class="d-flex justify-space-between text-grey">
                  <span>Saldo Resultante:</span>
                  <span :class="f.cancelado ? 'text-success font-weight-bold' : ''">
                    {{ f.saldoResultanteFormateado || f.saldoActualFormateado }}
                  </span>
                </div>
              </div>
            </div>

            <div class="pt-2 text-body-2">
              <div class="d-flex justify-space-between py-1 font-weight-bold">
                <span>TOTAL ABONADO:</span>
                <span class="text-primary">{{ ultimoRecibo.totalAbonadoFormateado }}</span>
              </div>
              <div class="d-flex justify-space-between py-1 text-caption text-grey">
                <span>Saldo Anterior:</span>
                <span>{{ ultimoRecibo.saldoTotalAnteriorFormateado }}</span>
              </div>
              <div class="d-flex justify-space-between py-1 text-caption font-weight-bold text-grey-darken-3">
                <span>Saldo Restante:</span>
                <span>{{ ultimoRecibo.saldoTotalRestanteFormateado }}</span>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3 bg-white d-flex flex-wrap justify-end ga-2">
          <v-btn variant="outlined" color="grey-darken-1" @click="display.ticketModal = false" class="text-none">
            Cerrar
          </v-btn>
          <v-btn
            variant="outlined"
            color="grey-darken-3"
            prepend-icon="mdi-printer-outline"
            @click="imprimirTicketNavegador(ultimoRecibo)"
            class="text-none"
          >
            Imprimir Navegador
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-printer"
            :loading="imprimiendoTicket"
            @click="imprimirTicketAbono(ultimoRecibo, true)"
            class="text-none font-weight-bold"
          >
            Reimprimir en POS-80C
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
  name: 'cuentas-por-cobrar',

  components: {
    VisualizarAbonos,
    OverlayComp
  },

  data() {
    return {
      snackbar: useSnackbar(),
      loadingClientes: false,
      loadingResumen: false,
      guardando: false,

      selectedIdCxc: null,
      listaClientes: [],

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
        idModalidad: 1, // Efectivo por defecto
        numReferencia: '',
        fechaMovimiento: getDate(),
        observaciones: ''
      },

      cmb: {
        modalidades: []
      },

      display: {
        visualizarAbonos: false,
        ticketModal: false
      },

      imprimiendoTicket: false,
      facturaSeleccionadaAbonos: {},
      ultimoRecibo: null
    }
  },

  computed: {
    clienteInfo() {
      return this.resumen.cliente || {}
    },

    facturasFiltradas() {
      let lista = this.resumen.facturas || []

      if (this.filtroEstado === 'pendientes') {
        lista = lista.filter((f) => !f.cancelado && f.saldo > 0)
      }

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

    async loadClientes() {
      this.loadingClientes = true
      try {
        const items = await httpGet('api/cuentas-cobrar')
        if (Array.isArray(items)) {
          this.listaClientes = items.map((c) => ({
            idCxc: c.idCxc,
            nombre: c.cliente || 'Sin Nombre',
            ruta: c.rutaCliente || '',
            saldoPendiente: Number(c.saldoPendienteTotal) || 0,
            pendientes: Number(c.nCreditosPendientes) || 0
          }))
        }
      } catch (e) {
        console.error('Error cargando lista de clientes para cuentas por cobrar:', e)
      } finally {
        this.loadingClientes = false
      }
    },

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

    async onClienteSeleccionado(idCxc) {
      if (!idCxc) {
        this.resetResumen()
        return
      }
      await this.cargarEstadoCuenta(idCxc)
    },

    async cargarEstadoCuenta(idCxc) {
      this.loadingResumen = true
      try {
        const data = await httpGet(`api/cuentas-cobrar/${idCxc}/resumen-cliente`)
        if (data) {
          const clienteRaw = data.cliente || data.Cliente || {}
          const facturasRaw = data.facturas || data.Facturas || []
          const saldoPendiente = Number(data.saldoTotalPendiente !== undefined ? data.saldoTotalPendiente : (data.SaldoTotalPendiente || 0)) || 0

          const facturas = facturasRaw.map((f) => ({
            idDetalleCxc: f.idDetalleCxc !== undefined ? f.idDetalleCxc : f.IdDetalleCxc,
            idVenta: f.idVenta !== undefined ? f.idVenta : f.IdVenta,
            noVenta: f.noVenta || f.NoVenta || 'S/N',
            fechaRegistro: f.fechaRegistro || f.FechaRegistro,
            debito: Number(f.debito !== undefined ? f.debito : (f.Debito !== undefined ? f.Debito : f.monto || 0)) || 0,
            credito: Number(f.credito !== undefined ? f.credito : (f.Credito !== undefined ? f.Credito : 0)) || 0,
            saldo: Number(f.saldo !== undefined ? f.saldo : (f.Saldo !== undefined ? f.Saldo : 0)) || 0,
            cancelado: Boolean(f.cancelado !== undefined ? f.cancelado : f.Cancelado),
            diasVencido: Number(f.diasVencido !== undefined ? f.diasVencido : (f.DiasVencido || 0)) || 0,
            saldar: false,
            abonoAplicar: null
          }))

          this.resumen = {
            idCxc: data.idCxc || data.IdCxc || idCxc,
            noCxc: data.noCxc || data.NoCxc || '',
            cliente: {
              idCliente: clienteRaw.idCliente || clienteRaw.IdCliente || 0,
              codigo: clienteRaw.codigo || clienteRaw.Codigo || '',
              nombre: clienteRaw.nombre || clienteRaw.Nombre || 'Cliente General',
              telefono: clienteRaw.telefono || clienteRaw.Telefono || '',
              direccion: clienteRaw.direccion || clienteRaw.Direccion || '',
              ruta: clienteRaw.ruta || clienteRaw.Ruta || ''
            },
            saldoTotalPendiente: saldoPendiente,
            totalFacturasPendientes: Number(data.totalFacturasPendientes || data.TotalFacturasPendientes || 0),
            totalFacturasSaldadas: Number(data.totalFacturasSaldadas || data.TotalFacturasSaldadas || 0),
            facturas
          }
        }
      } catch (e) {
        this.handleException(e)
      } finally {
        this.loadingResumen = false
      }
    },

    resetResumen() {
      this.resumen = {
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
      }
      this.limpiarAbonos()
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

      if (val > item.saldo) {
        this.snackbar.notify('warning', `El abono no puede superar el saldo pendiente (C$ ${item.saldo.toFixed(2)})`)
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

    async guardarAbono() {
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
        idCxc: this.selectedIdCxc,
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
          this.snackbar.notify('success', 'Abono registrado correctamente.')
          this.ultimoRecibo = response.data?.data || null
          this.display.ticketModal = true

          this.pago.numReferencia = ''
          this.pago.observaciones = ''

          // Imprimir ticket en la impresora térmica de manera automática
          await this.imprimirTicketAbono(this.ultimoRecibo, false)

          // Refrescar clientes y estado de cuenta actual
          await this.loadClientes()
          await this.cargarEstadoCuenta(this.selectedIdCxc)
        } else {
          this.snackbar.notify('error', response.data?.msg || 'Error al procesar el abono.')
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

    lineaDosColumnas(izquierda, derecha, ancho = 42) {
      const izq = String(izquierda || '')
      const der = String(derecha || '')
      const espacio = ancho - izq.length - der.length
      return espacio > 0
        ? izq + ' '.repeat(espacio) + der + '\n'
        : izq.slice(0, Math.max(0, ancho - der.length - 1)) + ' ' + der + '\n'
    },

    generarTextoTicket(reciboObj = null, esReimpresion = false) {
      const target = reciboObj || this.ultimoRecibo
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
      t += `Fecha:     ${target.fechaFormateada}  Hora: ${target.horaFormateada}\n`
      t += `Cliente:   ${target.cliente?.nombre || 'General'}\n`
      if (target.cliente?.codigo) t += `Código:    ${target.cliente.codigo}\n`
      if (target.cliente?.ruta) t += `Ruta:      ${target.cliente.ruta}\n`
      t += `Modalidad: ${target.modalidad || 'Efectivo'}\n`
      if (target.numReferencia) t += `Referencia: ${target.numReferencia}\n`
      if (target.usuarioRegistro) t += `Cajero/Usr: ${target.usuarioRegistro}\n`
      t += separador
      t += 'FACTURAS ABONADAS:\n'
      ;(target.facturasAbonadas || []).forEach((f) => {
        const saldoPost = f.saldoResultanteFormateado || f.saldoActualFormateado || ''
        t += `Factura N° ${f.noFactura}\n`
        t += this.lineaDosColumnas(`  Saldo Ant: ${f.saldoAnteriorFormateado || ''}`, `Abono: ${f.montoAbonadoFormateado || ''}`)
        t += this.lineaDosColumnas(`  Saldo Res: ${saldoPost}`, f.cancelado ? ' [Saldada]' : '')
      })
      t += separador
      t += this.lineaDosColumnas('Saldo Total Ant:', target.saldoTotalAnteriorFormateado)
      t += this.lineaDosColumnas('TOTAL ABONADO:', target.totalAbonadoFormateado)
      t += this.lineaDosColumnas('Saldo Restante:', target.saldoTotalRestanteFormateado)
      t += separador
      if (target.observaciones) {
        t += `Obs: ${target.observaciones}\n`
        t += separador
      }
      t += '\n' + `${'¡Gracias por su pago!'.padStart(Math.floor((ANCHO + 21) / 2))}\n\n`
      return t
    },

    imprimirTicketNavegador(reciboObj = null) {
      const contenido = this.generarTextoTicket(reciboObj, true)
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

    async imprimirTicketAbono(reciboObj = null, esReimpresion = false) {
      const targetRecibo = reciboObj || this.ultimoRecibo
      if (!targetRecibo) return

      this.imprimiendoTicket = true

      const NEGOCIO = {
        nombre: targetRecibo.empresa?.nombre || "Migdalia's Market",
        direccion: targetRecibo.empresa?.direccion || 'Mercado Mayoreo Modulo #4',
        telefono: targetRecibo.empresa?.telefono || '2263-2783',
        ruc: targetRecibo.empresa?.ruc || ''
      }

      const ANCHO = 42
      const separador = '-'.repeat(ANCHO) + '\n'

      const lineasFacturas = (targetRecibo.facturasAbonadas || []).map((f) => {
        const saldoPost = f.saldoResultanteFormateado || f.saldoActualFormateado || ''
        return `Factura N° ${f.noFactura}\n` +
               this.lineaDosColumnas(`  Saldo Ant: ${f.saldoAnteriorFormateado || ''}`, `Abono: ${f.montoAbonadoFormateado || ''}`) +
               this.lineaDosColumnas(`  Saldo Res: ${saldoPost}`, f.cancelado ? ' [Saldada]' : '')
      })

      const rawData = [
        '\x1B\x40',                                     // init
        '\x1B\x61\x01',                                 // centrar
        '\x1B\x21\x10',                                 // doble altura
        '\x1B\x45\x01',                                 // negrita ON
        `${NEGOCIO.nombre}\n`,
        '\x1B\x45\x00',                                 // negrita OFF
        '\x1B\x21\x00',                                 // normal
        NEGOCIO.direccion ? `${NEGOCIO.direccion}\n` : '',
        NEGOCIO.telefono ? `Tel: ${NEGOCIO.telefono}\n` : '',
        NEGOCIO.ruc ? `RUC: ${NEGOCIO.ruc}\n` : '',
        separador,

        '\x1B\x45\x01',                                 // negrita ON
        'COMPROBANTE DE ABONO\n',
        esReimpresion ? '*** REIMPRESIÓN ***\n' : '',
        '\x1B\x45\x00',                                 // negrita OFF
        '\x1B\x61\x00',                                 // izquierda
        `Fecha:     ${targetRecibo.fechaFormateada}  Hora: ${targetRecibo.horaFormateada}\n`,
        `Cliente:   ${targetRecibo.cliente?.nombre || 'General'}\n`,
        targetRecibo.cliente?.codigo ? `Código:    ${targetRecibo.cliente.codigo}\n` : '',
        targetRecibo.cliente?.ruta ? `Ruta:      ${targetRecibo.cliente.ruta}\n` : '',
        `Modalidad: ${targetRecibo.modalidad || 'Efectivo'}\n`,
        targetRecibo.numReferencia ? `Referencia: ${targetRecibo.numReferencia}\n` : '',
        targetRecibo.usuarioRegistro ? `Cajero/Usr: ${targetRecibo.usuarioRegistro}\n` : '',
        esReimpresion ? `Reimpreso:  ${new Date().toLocaleString()}\n` : '',
        separador,

        '\x1B\x45\x01',                                 // negrita ON
        'FACTURAS ABONADAS:\n',
        '\x1B\x45\x00',                                 // negrita OFF
        ...lineasFacturas,
        separador,

        this.lineaDosColumnas('Saldo Total Ant:', targetRecibo.saldoTotalAnteriorFormateado),
        '\x1B\x45\x01',                                 // negrita ON
        this.lineaDosColumnas('TOTAL ABONADO:', targetRecibo.totalAbonadoFormateado),
        '\x1B\x45\x00',                                 // negrita OFF
        this.lineaDosColumnas('Saldo Restante:', targetRecibo.saldoTotalRestanteFormateado),
        separador,

        targetRecibo.observaciones ? `Obs: ${targetRecibo.observaciones}\n${separador}` : '',

        '\x1B\x61\x01',                                 // centrar
        '¡Gracias por su pago!\n\n\n\n\n',
        '\x1D\x56\x00'                                  // corte de papel
      ]

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

        await qz.print(config, rawData)
        this.snackbar.notify('success', esReimpresion ? 'Reimpresión enviada a POS-80C exitosamente.' : 'Comprobante impreso en POS-80C exitosamente.')
      } catch (err) {
        console.error('Error al imprimir comprobante en POS-80C:', err)
        this.snackbar.notify('warning', 'No se pudo imprimir en POS-80C. Puede revisar o imprimir desde la vista previa.')
        this.display.ticketModal = true
      } finally {
        this.imprimiendoTicket = false
      }
    },

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

    handleException(ex) {
      if (ex.status === 401) {
        // sesión
      } else if (ex.status === 403) {
        this.snackbar.notify('error', 'No tiene los permisos necesarios.')
      } else {
        const msg = ex.data?.msg || ex.response?.data?.msg || 'Ha ocurrido un error inesperado.'
        this.snackbar.notify('error', msg)
      }
    }
  },

  mounted() {
    this.loadClientes()
    this.loadComboboxes()
  }
}
</script>

<style scoped>
.cxc-minimal-view {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.cliente-select :deep(.v-field) {
  background-color: #ffffff !important;
}

.tabla-minimal {
  font-size: 13px;
}

.tabla-minimal th {
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #424242;
  border-bottom: 1px solid #e0e0e0 !important;
}

.tabla-minimal td {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  border-bottom: 1px solid #f0f0f0 !important;
}

.fila-saldada {
  background-color: #f9fbe7 !important;
  opacity: 0.85;
}

.fila-con-abono {
  background-color: #f3f4f6 !important;
}

.fila-vencida {
  background-color: #fff8e1 !important;
}

.input-abono-clean :deep(input) {
  text-align: right !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  color: #1a237e !important;
}

.input-abono-clean :deep(.v-field__input) {
  padding-top: 3px !important;
  padding-bottom: 3px !important;
  min-height: 34px !important;
}

.comprobante-preview {
  font-family: 'Courier New', Courier, monospace;
}

.border-b-dashed {
  border-bottom: 1px dashed #e0e0e0;
}

@media print {
  body * {
    visibility: hidden;
  }
  .comprobante-preview, .comprobante-preview * {
    visibility: visible;
  }
  .comprobante-preview {
    position: absolute;
    left: 0;
    top: 0;
    width: 80mm;
    margin: 0;
    padding: 0;
  }
}
</style>