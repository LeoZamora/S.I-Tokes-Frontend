<template>
  <div class="w-100">
    <!-- Snackbar de alertas -->
    <v-snackbar v-model="alert.show" :color="alert.type" timeout="4000" location="top right">
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ alert.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
        <span>{{ alert.message }}</span>
      </div>
    </v-snackbar>

    <!-- Encabezado y búsqueda -->
    <v-card class="border-t border-b" elevation="0" rounded="0">
      <!-- Encabezado -->
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <div class="text-h6 font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="indigo">
              mdi-lock-open-check-outline
            </v-icon>
            Apertura de Caja
          </div>
        </div>
      </template>

      <v-divider />

      <v-row class="pa-2" dense>
        <v-col cols="6" md="6" sm="6">
          <v-text-field
            color="indigo"
            density="compact"
            variant="outlined"
            append-inner-icon="mdi-magnify"
            label="Buscar cajas"
            v-model="searchQuery"
            hide-details
            placeholder="Ingrese un texto a buscar..."
            persistent-placeholder
          />
        </v-col>
        <v-col
          cols="6"
          md="6"
          sm="6"
          class="d-flex justify-end align-center"
        >
          <v-btn
            class="mr-2"
            variant="text"
            color="indigo"
            @click="recargarTodo"
            icon
            size="small"
          >
            <v-icon>
              mdi-refresh
            </v-icon>
            <v-tooltip
              location="top center"
              activator="parent"
            >
              Actualizar
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Tabla de cajas -->
    <v-data-table
      class="font"
      density="compact"
      :headers="headers"
      :items="filteredCajas"
      :items-per-page="10"
      :search="searchQuery"
      :loading="loading"
      :row-props="setStyle"
      :header-props="{
        class: 'font-weight-bold'
      }"
      hover
    >
      <template v-slot:loader>
        <v-progress-linear
          color="indigo"
          indeterminate
          height="2"
        />
      </template>
      <template v-slot:loading>
        <v-skeleton-loader
          type="table-row@10"
        ></v-skeleton-loader>
      </template>

      <!-- Header Filtro Bodega -->
      <template v-slot:header.bodegaNombre>
        <div>Bodega</div>
        <v-autocomplete
          v-model="filtroBodega"
          variant="outlined"
          density="compact"
          :items="bodegasOptions"
          hide-details
          clearable
          placeholder="Todas"
          color="indigo"
          class="mt-1"
        >
        </v-autocomplete>
      </template>

      <!-- Header Filtro Estado -->
      <template v-slot:header.estadoNombre>
        <div>Estado</div>
        <v-autocomplete
          v-model="filtroEstado"
          variant="outlined"
          density="compact"
          :items="estadosOptions"
          hide-details
          clearable
          placeholder="Todos"
          color="indigo"
          class="mt-1"
        >
        </v-autocomplete>
      </template>

      <!-- Columna Bodega -->
      <template v-slot:item.bodegaNombre="{ item }">
        <span class="font-weight-medium">{{ item.bodegaNombre || '—' }}</span>
      </template>

      <!-- Columna Nombre -->
      <template v-slot:item.nombre="{ item }">
        <div>
          <div class="font-weight-bold text-indigo-darken-4">
            {{ item.nombre }}
          </div>
          <div v-if="item.codigo" class="text-caption text-grey">
            {{ item.codigo }}
          </div>
        </div>
      </template>

      <!-- Columna Cajero / Turno -->
      <template v-slot:item.cajeroTurno="{ item }">
        <div v-if="!item.isCerrada" class="d-flex align-center">
          <v-avatar size="24" color="indigo-lighten-5" class="mr-2">
            <v-icon size="14" color="indigo-darken-3">mdi-account</v-icon>
          </v-avatar>
          <div>
            <div class="font-weight-bold text-caption text-grey-darken-4">
              {{ item.cajeroUltimaSesionNombre || item.apertura?.usuarioAperturaNombre || item.cajeroUltimaSesion || '—' }}
            </div>
            <div class="text-caption text-grey" style="font-size: 11px;">
              {{ formatDate(item.apertura?.fechaApertura || item.fechaUltimaSesion) }}
            </div>
          </div>
        </div>
        <span v-else class="text-caption text-grey font-italic">Sin sesión activa</span>
      </template>

      <!-- Columna Fondo Inicial -->
      <template v-slot:item.montoAperturaEfectivo="{ item }">
        <span class="text-caption font-weight-bold text-success">
          {{ !item.isCerrada && item.apertura ? formatCurrency(item.apertura.montoAperturaEfectivo) : '—' }}
        </span>
      </template>

      <!-- Columna Valor Mercadería -->
      <template v-slot:item.montoAperturaMercaderia="{ item }">
        <span class="text-caption font-weight-bold text-blue-grey-darken-2">
          {{ !item.isCerrada && item.apertura ? formatCurrency(item.apertura.montoAperturaMercaderia) : '—' }}
        </span>
      </template>

      <!-- Columna Estado -->
      <template v-slot:item.estadoNombre="{ item }">
        <v-chip
          :color="getEstadoChip(item).color"
          :variant="getEstadoChip(item).variant"
          size="small"
          class="font-weight-bold text-white"
        >
          <v-icon start size="x-small">{{ getEstadoChip(item).icon }}</v-icon>
          {{ getEstadoChip(item).text }}
        </v-chip>
      </template>

      <!-- Columna Acción -->
      <template v-slot:item.acciones="{ item }">
        <v-btn
          v-if="item.isCerrada && hasAccessToFunct('172')"
          color="indigo-darken-3"
          variant="flat"
          size="x-small"
          prepend-icon="mdi-lock-open-check"
          class="font-weight-bold text-none"
          @click="openAperturaDialog(item)"
        >
          Aperturar
        </v-btn>
        <v-btn
          v-else
          color="indigo-darken-3"
          variant="tonal"
          size="x-small"
          icon="mdi-receipt-text-outline"
          title="Ver comprobante"
          @click="verDetalleApertura(item.apertura)"
        />
      </template>
    </v-data-table>

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
import { hasAccessToFunct } from '@/scripts/Seguridad.js';

export default {
  name: 'AperturaCajaView',

  data() {
    return {
      requestHttp: new RequestHttp(),
      loading: false,
      loadingStockPreview: false,
      guardandoApertura: false,

      searchQuery: '',
      filtroBodega: null,
      filtroEstado: null,

      headers: [
        { title: 'Bodega', key: 'bodegaNombre', align: 'center', sortable: false },
        { title: 'Caja', key: 'nombre', align: 'start' },
        { title: 'Cajero / Turno', key: 'cajeroTurno', align: 'start', sortable: false },
        { title: 'Fondo Inicial', key: 'montoAperturaEfectivo', align: 'end', sortable: false },
        { title: 'Valor Mercadería', key: 'montoAperturaMercaderia', align: 'end', sortable: false },
        { title: 'Estado', key: 'estadoNombre', align: 'center', sortable: false },
        { title: 'Acción', key: 'acciones', align: 'center', sortable: false }
      ],

      estadosOptions: [
        { title: 'Aperturadas', value: 'aperturadas' },
        { title: 'Arqueadas', value: 'arqueadas' },
        { title: 'Cerradas', value: 'cerradas' }
      ],

      cajas: [],
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

    bodegasOptions() {
      const map = new Map();
      const list = [];
      this.cajas.forEach(c => {
        if (c.idBodega && !map.has(c.idBodega)) {
          map.set(c.idBodega, true);
          list.push({ title: c.bodegaNombre, value: c.idBodega });
        }
      });
      return list;
    },

    filteredCajas() {
      let list = [...this.cajas];

      if (this.filtroBodega !== null && this.filtroBodega !== undefined) {
        list = list.filter(c => c.idBodega === this.filtroBodega);
      }

      if (this.filtroEstado) {
        if (this.filtroEstado === 'aperturadas' || this.filtroEstado === 'abiertas') {
          list = list.filter(c => {
            const nom = (c.estadoNombre || '').toLowerCase();
            return nom.includes('abiert') || nom.includes('aperturad');
          });
        } else if (this.filtroEstado === 'arqueadas') {
          list = list.filter(c => (c.estadoNombre || '').toLowerCase().includes('arquead'));
        } else if (this.filtroEstado === 'cerradas') {
          list = list.filter(c => (c.estadoNombre || '').toLowerCase().includes('cerrad'));
        }
      }

      if (this.searchQuery && this.searchQuery.trim() !== '') {
        const q = this.searchQuery.toLowerCase().trim();
        list = list.filter(c =>
          (c.nombre && c.nombre.toLowerCase().includes(q)) ||
          (c.codigo && c.codigo.toLowerCase().includes(q)) ||
          (c.bodegaNombre && c.bodegaNombre.toLowerCase().includes(q)) ||
          (c.cajeroUltimaSesionNombre && c.cajeroUltimaSesionNombre.toLowerCase().includes(q)) ||
          (c.cajeroUltimaSesion && c.cajeroUltimaSesion.toLowerCase().includes(q)) ||
          (c.apertura?.usuarioAperturaNombre && c.apertura.usuarioAperturaNombre.toLowerCase().includes(q))
        );
      }

      return list.sort((a, b) => {
        const codA = a.codigo || '';
        const codB = b.codigo || '';
        return codB.localeCompare(codA, undefined, { numeric: true, sensitivity: 'base' });
      });
    }
  },

  mounted() {
    this.cargarUsuarioSesion();
    this.recargarTodo();
  },

  methods: {
    hasAccessToFunct,
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
      await this.cargarCajas();
    },

    async cargarCajas() {
      this.loading = true;
      try {
        const res = await this.requestHttp.getCajas();
        if (res && res.code === 200 && Array.isArray(res.data)) {
          const mapped = res.data.map(c => {
            const estadoNombre = c.estadoNombre || c.idEstadoActualNavigation?.nombre || 'Cerrada';
            const estLower = estadoNombre.toLowerCase();
            const isCerrada = estLower === 'cerrada' || estLower.includes('cerrad');
            return {
              idCaja: c.idCaja,
              codigo: c.codigo,
              nombre: c.nombre,
              idBodega: c.idBodega,
              bodegaNombre: c.bodegaNombre || c.idBodegaNavigation?.nombre || 'Sin Bodega',
              idEstadoActual: c.idEstadoActual,
              estadoNombre: estadoNombre,
              isCerrada: isCerrada,
              cajeroUltimaSesion: c.cajeroUltimaSesion,
              cajeroUltimaSesionNombre: c.cajeroUltimaSesionNombre,
              fechaUltimaSesion: c.fechaUltimaSesion,
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

          this.cajas = mapped.sort((a, b) => {
            const codA = a.codigo || '';
            const codB = b.codigo || '';
            return codB.localeCompare(codA, undefined, { numeric: true, sensitivity: 'base' });
          });
        } else {
          this.showAlert('No se pudieron obtener las cajas', 'error');
        }
      } catch (error) {
        this.showAlert('Error al procesar consulta de cajas', 'error');
      } finally {
        this.loading = false;
      }
    },

    setStyle({ index }) {
      return {
        class: index % 2 === 0 ? 'bg-white' : 'bg-indigo-lighten-5'
      };
    },

    getEstadoChip(caja) {
      const nombre = (caja?.estadoNombre || '').toLowerCase().trim();
      if (nombre.includes('aperturad') || nombre.includes('abiert')) {
        return {
          color: 'green-darken-3',
          text: caja.estadoNombre || 'Aperturada',
          icon: 'mdi-lock-open-variant',
          variant: 'flat'
        };
      }
      if (nombre.includes('arquead')) {
        return {
          color: 'amber-darken-3',
          text: caja.estadoNombre || 'Arqueada',
          icon: 'mdi-scale-balance',
          variant: 'flat'
        };
      }
      if (nombre.includes('cerrad')) {
        return {
          color: 'blue-grey-darken-1',
          text: caja.estadoNombre || 'Cerrada',
          icon: 'mdi-lock',
          variant: 'flat'
        };
      }
      if (nombre.includes('inactiv') || nombre.includes('bloquead') || nombre.includes('cancelad')) {
        return {
          color: 'red-darken-3',
          text: caja.estadoNombre || 'Inactiva',
          icon: 'mdi-alert-circle-outline',
          variant: 'flat'
        };
      }
      return {
        color: 'indigo-darken-2',
        text: caja?.estadoNombre || 'Desconocido',
        icon: 'mdi-information-outline',
        variant: 'flat'
      };
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
.font {
  font-size: 12px !important;
}

.hover-scale {
  transition: transform 0.2s;
}

.hover-scale:hover {
  transform: scale(1.1);
}
</style>
