<template>
  <v-card class="rounded-lg border bg-white overflow-hidden">
    <!-- Encabezado minimalista -->
    <div class="px-4 py-3 bg-white border-b d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-avatar color="primary" variant="tonal" size="36" class="mr-3 rounded-lg">
          <v-icon color="primary" size="20">mdi-history</v-icon>
        </v-avatar>
        <div>
          <div class="text-subtitle-1 font-weight-bold text-grey-darken-3">
            Historial de Abonos
          </div>
          <div class="text-caption text-grey">
            Factura N° {{ credito.noVenta }}
          </div>
        </div>
      </div>
      <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
    </div>

    <!-- Tabla de Abonos -->
    <v-card-text class="pa-0">
      <v-data-table
        :headers="tbl.headers"
        :items="tbl.items"
        :loading="loading"
        hide-default-footer
        density="comfortable"
        hover
        class="border-0"
      >
        <!-- Modalidad -->
        <template #item.modalidad="{ item }">
          <v-chip size="small" variant="outlined" color="grey-darken-2" class="font-weight-medium">
            {{ item.modalidad }}
          </v-chip>
        </template>

        <!-- N° Referencia -->
        <template #item.numReferencia="{ item }">
          <span class="text-caption font-mono text-grey-darken-2">
            {{ item.numReferencia || '-' }}
          </span>
        </template>

        <!-- Fecha Movimiento -->
        <template #item.fechaMovimiento="{ item }">
          <span class="text-body-2 font-weight-medium text-grey-darken-3">
            {{ formatedDate(item.fechaMovimiento) }}
          </span>
        </template>

        <!-- Monto Abonado -->
        <template #item.monto="{ item }">
          <span class="font-weight-bold text-success">
            {{ formatedCurrency(item.monto) }}
          </span>
        </template>

        <!-- Saldo Resultante -->
        <template #item.saldoResultante="{ item }">
          <div v-if="item.saldoResultante !== undefined && item.saldoResultante !== null">
            <div v-if="Number(item.saldoResultante || 0) <= 0">
              <span class="text-caption font-weight-bold text-success mr-1">C$ 0.00</span>
              <v-chip size="x-small" color="success" variant="flat" class="font-weight-bold">
                Saldada
              </v-chip>
            </div>
            <div v-else>
              <span class="font-weight-bold text-grey-darken-3">
                {{ formatedCurrency(item.saldoResultante) }}
              </span>
            </div>
          </div>
          <span v-else class="text-grey">-</span>
        </template>

        <!-- Observaciones -->
        <template #item.observaciones="{ item }">
          <span class="text-caption text-grey-darken-1">
            {{ item.observaciones || '-' }}
          </span>
        </template>

        <!-- Fecha Registro -->
        <template #item.fechaRegistro="{ item }">
          <span class="text-caption text-grey">
            {{ formatedDate(item.fechaRegistro) }}
          </span>
        </template>

        <!-- Usuario Registro -->
        <template #item.usuarioRegistro="{ item }">
          <span class="text-caption text-grey-darken-2">
            {{ item.usuarioRegistro || '-' }}
          </span>
        </template>

        <!-- Acciones (Reimprimir Comprobante Directo y Vista Previa) -->
        <template #item.acciones="{ item }">
          <div class="d-flex align-center justify-center ga-1">
            <!-- Reimprimir directamente en POS-80C -->
            <v-tooltip text="Reimprimir en Impresora Térmica (POS-80C)" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-printer"
                  size="small"
                  variant="text"
                  color="green-darken-3"
                  :loading="printingId === getIdAbono(item)"
                  :disabled="!getIdAbono(item)"
                  @click="reimprimirTicketDirecto(item)"
                />
              </template>
            </v-tooltip>

            <!-- Ver Comprobante / Vista Previa -->
            <v-tooltip text="Ver comprobante" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-receipt-text-outline"
                  size="small"
                  variant="text"
                  color="blue-grey-darken-2"
                  :disabled="!getIdAbono(item)"
                  @click="abrirTicket(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>

        <!-- Estado vacío -->
        <template #no-data>
          <div class="py-8 text-center text-grey">
            <v-icon size="40" color="grey-lighten-1" class="mb-2">mdi-cash-remove</v-icon>
            <div class="text-body-2 font-weight-medium">No hay abonos registrados para esta factura</div>
          </div>
        </template>
      </v-data-table>
    </v-card-text>

    <v-divider />

    <v-card-actions class="pa-3 bg-white d-flex justify-end">
      <v-btn color="grey-darken-1" variant="outlined" class="text-none" @click="close">
        Cerrar
      </v-btn>
    </v-card-actions>

    <!-- MODAL DE COMPROBANTE DE ABONO -->
    <v-dialog v-model="ticketModal" max-width="500" persistent>
      <v-card class="rounded-lg border bg-white">
        <div class="px-4 py-3 bg-white border-b d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon color="primary" size="22" class="mr-2">mdi-receipt-text-outline</v-icon>
            <span class="text-subtitle-1 font-weight-bold text-grey-darken-3">
              Comprobante de Abono #{{ ticketActual?.noComprobante || ticketActual?.idMovimiento }}
            </span>
            <v-chip size="x-small" color="amber-darken-3" variant="flat" class="ml-2 font-weight-bold">
              Reimpresión
            </v-chip>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="ticketModal = false" />
        </div>

        <v-card-text class="pa-4">
          <div v-if="ticketActual" class="ticket-preview pa-4 border rounded bg-grey-lighten-5">
            <div class="text-center pb-2 border-b">
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                {{ ticketActual.empresa?.nombre || 'COMPROBANTE DE PAGO' }}
              </div>
              <div class="text-caption text-grey">{{ ticketActual.empresa?.direccion || '' }}</div>
              <div v-if="ticketActual.empresa?.telefono" class="text-caption text-grey">
                Tel: {{ ticketActual.empresa.telefono }}
              </div>
            </div>

            <div class="py-2 text-caption border-b">
              <div class="d-flex justify-space-between">
                <span><strong>Fecha:</strong> {{ ticketActual.fechaFormateada }} {{ ticketActual.horaFormateada }}</span>
                <span><strong>Modalidad:</strong> {{ ticketActual.modalidad }}</span>
              </div>
              <div><strong>Cliente:</strong> {{ ticketActual.cliente?.nombre }}</div>
              <div v-if="ticketActual.numReferencia">
                <strong>Referencia:</strong> {{ ticketActual.numReferencia }}
              </div>
              <div><strong>Registrado por:</strong> {{ ticketActual.usuarioRegistro }}</div>
            </div>

            <div class="py-2 border-b">
              <div class="text-caption font-weight-bold mb-1 text-grey-darken-3">Detalle del Abono:</div>
              <div class="d-flex justify-space-between text-caption py-1">
                <span>N° Factura:</span>
                <span class="font-weight-bold">{{ ticketActual.credito?.noFactura || 'N/A' }}</span>
              </div>
              <div class="d-flex justify-space-between text-caption py-1">
                <span>Saldo Anterior:</span>
                <span>{{ ticketActual.saldoAnteriorFormateado || formatedCurrency(ticketActual.saldoAnterior || 0) }}</span>
              </div>
              <div class="d-flex justify-space-between text-caption py-1 font-weight-bold text-primary">
                <span>MONTO ABONADO:</span>
                <span>{{ ticketActual.montoAbonadoFormateado || formatedCurrency(ticketActual.montoAbonado || 0) }}</span>
              </div>
              <div class="d-flex justify-space-between text-caption py-1 font-weight-bold text-grey-darken-3">
                <span>Saldo Resultante:</span>
                <span>{{ ticketActual.saldoResultanteFormateado || ticketActual.saldoActualFormateado || formatedCurrency(ticketActual.saldoResultante ?? ticketActual.saldoActual ?? 0) }}</span>
              </div>
              <div class="d-flex justify-space-between text-caption py-1">
                <span>Estado Crédito:</span>
                <span :class="ticketActual.cancelado ? 'text-success font-weight-bold' : 'text-warning font-weight-bold'">
                  {{ ticketActual.cancelado ? 'SALDADA' : 'PENDIENTE' }}
                </span>
              </div>
            </div>

            <div class="pt-3 text-center text-caption text-grey">¡Gracias por su pago!</div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3 bg-white d-flex flex-wrap justify-end ga-2">
          <v-btn variant="outlined" color="grey-darken-1" class="text-none" @click="ticketModal = false">
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
            :loading="imprimiendoModal"
            @click="imprimirTicketTermico(true)"
          >
            Reimprimir en POS-80C
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { httpGet } from "@/scripts/api.js";
import { useSnackbar } from "@/composables/use-snackbar.js";
import { formatters } from "@/helpers/formatters.js";

export default {
  name: 'visualizar-abonos',

  props: {
    credito: {
      type: Object,
      required: true,
    }
  },

  data() {
    return {
      snackbar: useSnackbar(),
      loading: false,

      tbl: {
        headers: [
          { title: 'Modalidad', key: 'modalidad', align: 'start', width: '110px' },
          { title: 'N° Referencia', key: 'numReferencia', align: 'start', width: '120px' },
          { title: 'Fecha', key: 'fechaMovimiento', align: 'start', width: '130px' },
          { title: 'Monto', key: 'monto', align: 'end', width: '120px' },
          { title: 'Saldo Resultante', key: 'saldoResultante', align: 'end', width: '130px' },
          { title: 'Observaciones', key: 'observaciones', align: 'start', minWidth: '130px' },
          { title: 'Fecha Registro', key: 'fechaRegistro', align: 'start', width: '130px' },
          { title: 'Usuario', key: 'usuarioRegistro', align: 'start', width: '110px' },
          { title: 'Acciones', key: 'acciones', align: 'center', sortable: false, width: '100px' }
        ],
        items: []
      },

      printingId: null,
      imprimiendoModal: false,
      ticketModal: false,
      ticketActual: null
    };
  },

  mounted() {
    this.loadTblAbonos();
  },

  methods: {
    getIdAbono(item) {
      if (!item) return null;
      return item.idAbonoCXC || item.idAbonoCxc || item.IdAbonoCXC || item.idAbono || null;
    },

    async loadTblAbonos() {
      this.loading = true;
      try {
        const abonos = await httpGet(`api/creditos/${this.credito.idDetalleCxc}/abonos`);
        this.tbl.items = abonos || [];
      } catch (err) {
        console.error('Error al cargar abonos de la factura:', err);
        this.snackbar.notify('error', 'Error al cargar el historial de abonos.');
      } finally {
        this.loading = false;
      }
    },

    async reimprimirTicketDirecto(item) {
      const idAbono = this.getIdAbono(item);
      if (!idAbono) {
        this.snackbar.notify('warning', 'Este registro no tiene un ID de comprobante asociado.');
        return;
      }

      this.printingId = idAbono;
      try {
        const res = await httpGet(`api/creditos/abonos/${idAbono}/ticket`);
        const ticketData = res.data || res;
        if (!ticketData) {
          throw new Error('No se obtuvieron datos del comprobante.');
        }

        this.ticketActual = ticketData;
        await this.imprimirTicketTermico(true);
      } catch (err) {
        console.error('Error al reimprimir comprobante de abono en POS-80C:', err);
        this.snackbar.notify('warning', 'No se pudo reimprimir directamente en POS-80C. Abriendo comprobante.');
        this.ticketModal = true;
      } finally {
        this.printingId = null;
      }
    },

    async abrirTicket(item) {
      const idAbono = this.getIdAbono(item);
      if (!idAbono) {
        this.snackbar.notify('warning', 'Este abono no tiene un ID de comprobante asociado.');
        return;
      }

      try {
        const res = await httpGet(`api/creditos/abonos/${idAbono}/ticket`);
        this.ticketActual = res.data || res;
        this.ticketModal = true;
      } catch (err) {
        console.error('Error al cargar ticket de abono:', err);
        this.snackbar.notify('error', 'No se pudieron cargar los datos del comprobante.');
      }
    },

    lineaDosColumnas(izquierda, derecha, ancho = 42) {
      const izq = String(izquierda || '');
      const der = String(derecha || '');
      const espacio = ancho - izq.length - der.length;
      return espacio > 0
        ? izq + ' '.repeat(espacio) + der + '\n'
        : izq.slice(0, Math.max(0, ancho - der.length - 1)) + ' ' + der + '\n';
    },

    generarTextoTicket(ticketData = null, esReimpresion = true) {
      const target = ticketData || this.ticketActual;
      if (!target) return '';

      const NEGOCIO = {
        nombre: target.empresa?.nombre || "Migdalia's Market",
        direccion: target.empresa?.direccion || 'Mercado Mayoreo Modulo #4',
        telefono: target.empresa?.telefono || '2263-2783'
      };

      const ANCHO = 42;
      const separador = '-'.repeat(ANCHO) + '\n';

      let t = '';
      t += `${NEGOCIO.nombre.padStart(Math.floor((ANCHO + NEGOCIO.nombre.length) / 2))}\n`;
      if (NEGOCIO.direccion) t += `${NEGOCIO.direccion.padStart(Math.floor((ANCHO + NEGOCIO.direccion.length) / 2))}\n`;
      if (NEGOCIO.telefono) t += `${('Tel: ' + NEGOCIO.telefono).padStart(Math.floor((ANCHO + ('Tel: ' + NEGOCIO.telefono).length) / 2))}\n`;
      t += separador;
      t += `${'COMPROBANTE DE ABONO'.padStart(Math.floor((ANCHO + 20) / 2))}\n`;
      if (esReimpresion) {
        t += `${'*** REIMPRESIÓN ***'.padStart(Math.floor((ANCHO + 19) / 2))}\n`;
        t += `Reimpreso: ${new Date().toLocaleString()}\n`;
      }
      t += separador;
      t += `Comprobante: #${target.noComprobante || target.idMovimiento || 'N/A'}\n`;
      t += `Fecha:       ${target.fechaFormateada}  Hora: ${target.horaFormateada}\n`;
      t += `Cliente:     ${target.cliente?.nombre || 'General'}\n`;
      if (target.cliente?.codigo) t += `Código Cli:  ${target.cliente.codigo}\n`;
      t += `Modalidad:   ${target.modalidad || 'Efectivo'}\n`;
      if (target.numReferencia) t += `Referencia:  ${target.numReferencia}\n`;
      if (target.usuarioRegistro) t += `Usuario:     ${target.usuarioRegistro}\n`;
      t += separador;
      t += 'DETALLE DEL ABONO:\n';
      t += `Factura N°:  ${target.credito?.noFactura || 'N/A'}\n`;
      t += this.lineaDosColumnas('Total Factura:', target.credito?.totalFacturadoFormateado || target.credito?.montoCreditoFormateado || '');
      t += this.lineaDosColumnas('Saldo Anterior:', target.saldoAnteriorFormateado || '');
      t += this.lineaDosColumnas('MONTO ABONADO:', target.montoAbonadoFormateado || '');
      t += this.lineaDosColumnas('Saldo Resultante:', target.saldoResultanteFormateado || target.saldoActualFormateado || '');
      t += this.lineaDosColumnas('Estado Factura:', target.cancelado ? 'SALDADA' : 'PENDIENTE');
      t += separador;
      if (target.observaciones) {
        t += `Obs: ${target.observaciones}\n`;
        t += separador;
      }
      t += '\n' + `${'¡Gracias por su pago!'.padStart(Math.floor((ANCHO + 21) / 2))}\n\n`;
      return t;
    },

    imprimirTicketNavegador() {
      const contenido = this.generarTextoTicket(this.ticketActual, true);
      const win = window.open('', '_blank', 'width=450,height=600');
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
        `);
        win.document.close();
        win.focus();
        setTimeout(() => {
          win.print();
          win.close();
        }, 300);
      }
    },

    async imprimirTicketTermico(esReimpresion = true) {
      if (!this.ticketActual) return;

      this.imprimiendoModal = true;
      const NEGOCIO = {
        nombre: this.ticketActual.empresa?.nombre || "Migdalia's Market",
        direccion: this.ticketActual.empresa?.direccion || 'Mercado Mayoreo Modulo #4',
        telefono: this.ticketActual.empresa?.telefono || '2263-2783',
        ruc: this.ticketActual.empresa?.ruc || ''
      };

      const ANCHO = 42;
      const separador = '-'.repeat(ANCHO) + '\n';

      try {
        const qz = window.qz;
        if (!qz) {
          this.snackbar.notify('warning', 'QZ Tray no está disponible en la ventana. Abriendo comprobante.');
          this.ticketModal = true;
          return;
        }

        if (!qz.websocket.isActive()) {
          await qz.websocket.connect();
        }

        const nombreImpresora = await qz.printers.find('POS-80C');
        const config = qz.configs.create(nombreImpresora);

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
          `Comprobante: #${this.ticketActual.noComprobante || this.ticketActual.idMovimiento || 'N/A'}\n`,
          `Fecha:       ${this.ticketActual.fechaFormateada}  Hora: ${this.ticketActual.horaFormateada}\n`,
          `Cliente:     ${this.ticketActual.cliente?.nombre || 'General'}\n`,
          this.ticketActual.cliente?.codigo ? `Código Cli:  ${this.ticketActual.cliente.codigo}\n` : '',
          `Modalidad:   ${this.ticketActual.modalidad || 'Efectivo'}\n`,
          this.ticketActual.numReferencia ? `Referencia:  ${this.ticketActual.numReferencia}\n` : '',
          this.ticketActual.usuarioRegistro ? `Usuario:     ${this.ticketActual.usuarioRegistro}\n` : '',
          esReimpresion ? `Reimpreso:   ${new Date().toLocaleString()}\n` : '',
          separador,

          '\x1B\x45\x01',                                 // negrita ON
          'DETALLE DEL ABONO:\n',
          '\x1B\x45\x00',                                 // negrita OFF
          `Factura N°:  ${this.ticketActual.credito?.noFactura || 'N/A'}\n`,
          this.lineaDosColumnas('Total Factura:', this.ticketActual.credito?.totalFacturadoFormateado || this.ticketActual.credito?.montoCreditoFormateado || ''),
          this.lineaDosColumnas('Saldo Anterior:', this.ticketActual.saldoAnteriorFormateado || ''),
          '\x1B\x45\x01',                                 // negrita ON
          this.lineaDosColumnas('MONTO ABONADO:', this.ticketActual.montoAbonadoFormateado || ''),
          '\x1B\x45\x00',                                 // negrita OFF
          this.lineaDosColumnas('Saldo Resultante:', this.ticketActual.saldoResultanteFormateado || this.ticketActual.saldoActualFormateado || ''),
          this.lineaDosColumnas('Estado Factura:', this.ticketActual.cancelado ? 'SALDADA' : 'PENDIENTE'),
          separador,

          this.ticketActual.observaciones ? `Obs: ${this.ticketActual.observaciones}\n${separador}` : '',

          '\x1B\x61\x01',                                 // centrar
          '¡Gracias por su pago!\n\n\n\n\n',
          '\x1D\x56\x00'                                  // corte de papel
        ];

        await qz.print(config, rawData);
        this.snackbar.notify('success', esReimpresion ? 'Reimpresión enviada a POS-80C exitosamente.' : 'Comprobante impreso exitosamente.');
      } catch (err) {
        console.error('Error al imprimir ticket térmico en POS-80C:', err);
        this.snackbar.notify('warning', 'No se pudo imprimir en POS-80C. Abriendo comprobante en pantalla.');
        this.ticketModal = true;
      } finally {
        this.imprimiendoModal = false;
      }
    },

    formatedDate(dateString) {
      return formatters.formatDate(dateString);
    },

    formatedCurrency(key) {
      return formatters.formatCurrency(key || 0);
    },

    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
.ticket-preview {
  font-family: 'Courier New', Courier, monospace;
}
</style>