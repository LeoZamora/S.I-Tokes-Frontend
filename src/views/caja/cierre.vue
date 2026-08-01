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
            <span class="text-h6 font-weight-bold d-block">Cierre de Caja</span>
            <span class="text-caption text-grey-darken-1">Cajas registradas y sesiones vigentes en el sistema</span>
          </div>
        </div>
        <div class="d-flex align-center ga-3">
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
        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" color="indigo-lighten-5" class="pa-3 rounded-lg">
            <div class="d-flex align-center">
              <v-avatar color="indigo" class="mr-3 text-white">
                <v-icon>mdi-cash-register</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-indigo-darken-3 font-weight-medium">Cajas Abiertas / Vigentes</div>
                <div class="text-h6 font-weight-bold text-indigo-darken-4">
                  {{ stats.abiertas }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" color="grey-lighten-4" class="pa-3 rounded-lg">
            <div class="d-flex align-center">
              <v-avatar color="grey-darken-1" class="mr-3 text-white">
                <v-icon>mdi-lock</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-grey-darken-3 font-weight-medium">Cajas Cerradas</div>
                <div class="text-h6 font-weight-bold text-grey-darken-4">
                  {{ stats.cerradas }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="12">
          <v-card variant="flat" color="green-lighten-5" class="pa-3 rounded-lg">
            <div class="d-flex align-center">
              <v-avatar color="green" class="mr-3 text-white">
                <v-icon>mdi-cash-multiple</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-green-darken-3 font-weight-medium">Total de Efectivo en Cajas Abiertas</div>
                <div class="text-h6 font-weight-bold text-green-darken-4">
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
          label="Buscar caja por nombre o código..."
          prepend-inner-icon="mdi-magnify"
          density="compact"
          variant="outlined"
          color="indigo"
          hide-details
          clearable
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
              :color="caja.estadoNombre === 'Aperturada' ? 'success' : (caja.estadoNombre === 'Arqueada' ? 'warning' : 'grey')"
              size="x-small"
              variant="flat"
              class="font-weight-bold"
            >
              {{ caja.estadoNombre }}
            </v-chip>
          </div>

          <!-- Cuerpo de la Tarjeta -->
          <div class="pa-3 flex-grow-1 bg-white">
            <div class="text-caption text-grey mb-1">
              <v-icon size="small" class="mr-1">mdi-warehouse</v-icon>
              Bodega: {{ caja.bodegaNombre }}
            </div>
            
            <v-divider class="my-2" />

            <!-- Si la caja está abierta (Aperturada o Arqueada) -->
            <div v-if="caja.isOpen" class="caja-info">
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
                <span class="text-caption text-grey">Efectivo Apertura:</span>
                <span class="text-body-2">{{ formatCurrency(caja.apertura?.montoAperturaEfectivo) }}</span>
              </div>

              <!-- Resumen Financiero -->
              <div v-if="caja.resumen" class="mt-2 bg-grey-lighten-4 pa-2 rounded border">
                <div class="d-flex justify-space-between py-0.5">
                  <span class="text-caption text-grey">Ventas (Efectivo):</span>
                  <span class="text-caption font-weight-bold text-success">{{ formatCurrency(caja.resumen.totalVentas) }}</span>
                </div>
                <div class="d-flex justify-space-between py-0.5">
                  <span class="text-caption text-grey">Pedidos Realizados:</span>
                  <span class="text-caption font-weight-bold text-indigo">{{ formatCurrency(caja.resumen.totalPedidos) }}</span>
                </div>
                <div class="d-flex justify-space-between py-0.5">
                  <span class="text-caption text-grey">Valor de Mercadería:</span>
                  <span class="text-caption font-weight-bold text-blue-grey-darken-1">{{ formatCurrency(caja.resumen.totalMercaderia) }}</span>
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
          <v-card-actions class="bg-grey-lighten-4 border-t pa-2 d-flex justify-end">
            <v-btn
              v-if="caja.isOpen"
              color="indigo"
              variant="flat"
              size="small"
              class="text-white"
              prepend-icon="mdi-lock-open"
              @click="openCierreDialog(caja)"
            >
              Cerrar Caja
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
        :items="data.cajas"
        :loading="loading"
        density="compact"
        class="rounded"
      >
        <template v-slot:item.nombre="{ item }">
          <span class="font-weight-bold">{{ item.nombre }}</span>
        </template>
        <template v-slot:item.estadoNombre="{ item }">
          <v-chip
            :color="item.estadoNombre === 'Aperturada' ? 'success' : (item.estadoNombre === 'Arqueada' ? 'warning' : 'grey')"
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
        <template v-slot:item.usuarioApertura="{ item }">
          <span v-if="item.isOpen">{{ item.apertura?.usuarioAperturaNombre || '—' }}</span>
          <span v-else>—</span>
        </template>
        <template v-slot:item.efectivoApertura="{ item }">
          <span v-if="item.isOpen">{{ formatCurrency(item.apertura?.montoAperturaEfectivo) }}</span>
          <span v-else>—</span>
        </template>
        <template v-slot:item.totalMercaderia="{ item }">
          <span v-if="item.isOpen && item.resumen" class="font-weight-bold text-blue-grey-darken-1">
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
          <v-btn
            v-if="item.isOpen"
            color="indigo"
            variant="tonal"
            size="small"
            prepend-icon="mdi-lock-open"
            @click="openCierreDialog(item)"
          >
            Cerrar Caja
          </v-btn>
          <span v-else class="text-caption text-grey italic">Cerrada</span>
        </template>
      </v-data-table>
    </v-card>

    <!-- DIÁLOGO DE CIERRE DE CAJA -->
    <v-dialog v-model="dialogs.cierre" max-width="900" persistent>
      <v-card v-if="activeCaja" class="rounded-lg elevation-12 bg-grey-lighten-4">
        <v-card-title class="bg-indigo-darken-4 text-white d-flex align-center py-2 px-3">
          <v-avatar size="36" color="white" class="mr-3" variant="flat">
            <v-icon color="indigo" size="20">mdi-lock</v-icon>
          </v-avatar>
          <div>
            <h5 class="text-h6 font-weight-bold text-white mb-0">Cerrar Caja: {{ activeCaja.nombre }}</h5>
            <span class="text-caption text-indigo-lighten-3 d-block" style="margin-top: -4px;">
              Apertura activa: {{ activeCaja.apertura?.codigo }}
            </span>
          </div>
          <v-spacer />
          <v-btn icon size="small" color="white" variant="text" @click="closeCierreDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4" style="max-height: 75vh; overflow-y: auto;">
          <v-row dense>
            <!-- LADO IZQUIERDO: RESUMEN DEL SISTEMA -->
            <v-col cols="12" md="4">
              <v-card class="pa-3 h-100 border bg-white" elevation="0" rounded="lg">
                <div class="text-subtitle-2 font-weight-bold text-indigo mb-3 d-flex align-center">
                  <v-icon size="small" class="mr-1">mdi-calculator</v-icon>
                  Saldos de Sistema
                </div>
                
                <div class="py-1.5 border-bottom d-flex justify-space-between">
                  <span class="text-caption text-grey">Efectivo Apertura:</span>
                  <span class="text-body-2 font-weight-medium">{{ formatCurrency(activeCaja.apertura?.montoAperturaEfectivo) }}</span>
                </div>
                <div class="py-1.5 border-bottom d-flex justify-space-between">
                  <span class="text-caption text-grey">Ventas Turno:</span>
                  <span class="text-body-2 font-weight-bold text-success">{{ formatCurrency(activeCaja.resumen?.totalVentas) }}</span>
                </div>
                <div class="py-1.5 border-bottom d-flex justify-space-between">
                  <span class="text-caption text-grey">Pedidos Turno:</span>
                  <span class="text-body-2 font-weight-bold text-indigo">{{ formatCurrency(activeCaja.resumen?.totalPedidos) }}</span>
                </div>
                
                <v-text-field
                  v-model.number="form.montoCierreRetiros"
                  label="Retiros / Gastos (C$)"
                  type="number"
                  min="0"
                  density="compact"
                  variant="outlined"
                  class="mt-3"
                  color="indigo"
                  hide-details
                />

                <v-textarea
                  v-model="form.observaciones"
                  label="Observaciones del Cierre"
                  rows="3"
                  density="compact"
                  variant="outlined"
                  class="mt-3"
                  color="indigo"
                  hide-details
                />
                
                <v-divider class="my-4" />

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
                      :color="diferencia >= 0 ? 'success' : 'error'"
                      size="small"
                      variant="flat"
                      class="font-weight-black"
                    >
                      {{ diferencia >= 0 ? '+' : '' }} {{ formatCurrency(diferencia) }}
                    </v-chip>
                  </div>
                  <div class="text-center mt-2">
                    <span class="text-caption italic font-weight-medium" :class="diferencia >= 0 ? 'text-success' : 'text-error'">
                      {{ diferencia === 0 ? 'Caja Cuadrada' : (diferencia > 0 ? 'Sobrante de Caja' : 'Faltante de Caja') }}
                    </span>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- LADO DERECHO: DESGLOSE DE EFECTIVO -->
            <v-col cols="12" md="8">
              <v-card class="pa-3 border bg-white" elevation="0" rounded="lg">
                <div class="text-subtitle-2 font-weight-bold text-indigo mb-3 d-flex align-center">
                  <v-icon size="small" class="mr-1">mdi-table-edit</v-icon>
                  Desglose y Arqueo de Dinero en Caja
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
        </v-card-text>

        <v-card-actions class="bg-grey-lighten-4 pa-3 border-t">
          <v-spacer />
          <v-btn color="grey-darken-1" variant="outlined" @click="closeCierreDialog()" :disabled="saving">
            Cancelar
          </v-btn>
          <v-btn color="indigo" class="text-white" variant="flat" @click="submitCierre()" :disabled="saving" :loading="saving">
            Confirmar y Cerrar Caja
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RequestHttp from '@/services/requestHttp';

export default {
  name: 'CierreCajaView',
  
  data() {
    return {
      requestHttp: new RequestHttp(),
      loading: false,
      saving: false,
      viewMode: 'grid',
      searchQuery: '',
      
      stats: {
        abiertas: 0,
        cerradas: 0
      },
      
      data: {
        cajas: []
      },
      
      headers: [
        { title: 'Caja', key: 'nombre', align: 'start', sortable: true },
        { title: 'Código', key: 'codigo', align: 'center', sortable: true },
        { title: 'Bodega', key: 'bodegaNombre', align: 'start', sortable: true },
        { title: 'Estado', key: 'estadoNombre', align: 'center', sortable: true },
        { title: 'Código Apertura', key: 'aperturaCodigo', align: 'center', sortable: false },
        { title: 'Responsable', key: 'usuarioApertura', align: 'start', sortable: false },
        { title: 'Monto Apertura', key: 'efectivoApertura', align: 'end', sortable: false },
        { title: 'Valor Mercadería', key: 'totalMercaderia', align: 'end', sortable: false },
        { title: 'Total en Caja', key: 'totalEnCaja', align: 'end', sortable: false },
        { title: 'Opciones', key: 'opc', align: 'center', sortable: false }
      ],
      
      activeCaja: null,
      
      dialogs: {
        cierre: false
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
      if (!this.searchQuery) return this.data.cajas;
      const query = this.searchQuery.toLowerCase();
      return this.data.cajas.filter(c => 
        c.nombre.toLowerCase().includes(query) || 
        (c.codigo && c.codigo.toLowerCase().includes(query)) ||
        c.bodegaNombre.toLowerCase().includes(query)
      );
    },
    
    totalEfectivoEnCajas() {
      return this.data.cajas
        .filter(c => c.isOpen && c.resumen)
        .reduce((sum, c) => sum + (Number(c.resumen.efectivoApertura || 0) + Number(c.resumen.totalVentas || 0)), 0);
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
    }
  },
  
  mounted() {
    this.loadCajas();
  },
  
  methods: {
    showAlert(msg, type = 'success') {
      this.alert.message = msg;
      this.alert.type = type;
      this.alert.show = true;
    },
    
    async loadCajas() {
      this.loading = true;
      try {
        const res = await this.requestHttp.getCajas();
        if (res.code === 200) {
          const mapped = res.data.map(c => {
            const isOpen = c.estadoNombre === 'Aperturada' || c.estadoNombre === 'Arqueada';
            return {
              ...c,
              isOpen,
              apertura: null,
              resumen: null
            };
          });
          // Calculate overall statistics
          this.stats.abiertas = mapped.filter(c => c.isOpen).length;
          this.stats.cerradas = mapped.filter(c => !c.isOpen).length;

          // Show only boxes with a current open/active session
          this.data.cajas = mapped.filter(c => c.isOpen);
          
          await Promise.all(this.data.cajas.map(async (caja) => {
            await this.loadBoxDetails(caja);
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
    
    async loadBoxDetails(caja) {
      try {
        const [apRes, resRes] = await Promise.all([
          this.requestHttp.getCajaAperturaVigente(caja.idCaja),
          this.requestHttp.getCajaAperturaVigenteResumen(caja.idCaja)
        ]);
        
        if (apRes.code === 200 && apRes.data) {
          caja.apertura = apRes.data;
        }
        if (resRes.code === 200 && resRes.data) {
          caja.resumen = resRes.data;
        }
      } catch (e) {
        console.error(`Error loading details for box ${caja.idCaja}:`, e);
      }
    },
    
    getCardBorder(caja) {
      if (caja.estadoNombre === 'Aperturada') {
        return 'border-top: 4px solid #4caf50 !important;';
      } else if (caja.estadoNombre === 'Arqueada') {
        return 'border-top: 4px solid #ff9800 !important;';
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
    
    openCierreDialog(caja) {
      this.activeCaja = caja;
      
      this.form = {
        montoCierreRetiros: 0,
        observaciones: ''
      };
      
      this.denominaciones.forEach(d => {
        this.cantidades[d.valor] = 0;
      });
      
      this.dialogs.cierre = true;
    },
    
    closeCierreDialog() {
      this.dialogs.cierre = false;
      this.activeCaja = null;
    },
    
    async submitCierre() {
      if (this.form.montoCierreRetiros < 0) {
        this.showAlert('El monto de retiros no puede ser negativo', 'warning');
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
          this.loadCajas();
        } else {
          let errorMsg = 'Error al guardar el cierre de caja';
          if (res.data) {
            if (res.data.msg) {
              errorMsg = res.data.msg;
              if (res.data.ex) {
                errorMsg += `: ${res.data.ex}`;
              }
            } else if (res.data.errors) {
              // Extract validation messages from ModelState
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
