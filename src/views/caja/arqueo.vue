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
            <span class="text-h6 font-weight-bold d-block text-indigo-darken-4">Arqueo de Caja</span>
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

            <template v-slot:item.montoArqueoRetiros="{ item }">
              <span class="text-caption text-red-darken-3">{{ formatCurrency(item.montoArqueoRetiros) }}</span>
            </template>

            <template v-slot:item.montoArqueoMercaderia="{ item }">
              <span class="text-caption text-grey-darken-2">{{ formatCurrency(item.montoArqueoMercaderia) }}</span>
            </template>

            <template v-slot:item.fechaArqueo="{ item }">
              <span class="text-caption">{{ formateDate(item.fechaArqueo) }}</span>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>

    <!-- DIALOG: REALIZAR ARQUEO -->
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
              <v-col cols="6" sm="3">
                <span class="text-grey-darken-1 d-block">Fondo Inicial:</span>
                <strong class="text-body-2 text-indigo-darken-4">{{ formatCurrency(cajaSeleccionada?.apertura?.montoAperturaEfectivo) }}</strong>
              </v-col>
              <v-col cols="6" sm="3">
                <span class="text-grey-darken-1 d-block">Ventas Turno:</span>
                <strong class="text-body-2 text-green-darken-4">{{ formatCurrency(resumenVigente.totalVentas) }}</strong>
              </v-col>
              <v-col cols="6" sm="3">
                <span class="text-grey-darken-1 d-block">Retiros Registrados:</span>
                <strong class="text-body-2 text-red-darken-4">{{ formatCurrency(resumenVigente.totalRetiros) }}</strong>
              </v-col>
              <v-col cols="6" sm="3">
                <span class="text-grey-darken-1 d-block">Teórico en Caja:</span>
                <strong class="text-body-2 text-indigo-darken-4">{{ formatCurrency(resumenVigente.totalEnCaja) }}</strong>
              </v-col>
            </v-row>
          </v-card>

          <!-- TABLA DE DESGLOSE DE EFECTIVO -->
          <div class="text-subtitle-2 font-weight-bold mb-2 text-indigo-darken-4 d-flex align-center">
            <v-icon size="18" class="mr-1">mdi-cash-multiple</v-icon>
            Desglose de Efectivo Físico Contado
          </div>

          <v-table density="compact" class="border rounded mb-4">
            <thead class="bg-grey-lighten-4">
              <tr>
                <th class="text-left font-weight-bold">Denominación</th>
                <th class="text-center font-weight-bold" style="width: 140px;">Cantidad</th>
                <th class="text-right font-weight-bold" style="width: 150px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="den in denominaciones" :key="den.valor">
                <td class="font-weight-medium">{{ den.label }}</td>
                <td class="pa-1">
                  <v-text-field
                    v-model.number="cantidades[den.valor]"
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
                  {{ formatCurrency((cantidades[den.valor] || 0) * den.valor) }}
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-indigo-lighten-5">
              <tr>
                <td colspan="2" class="text-right font-weight-bold text-indigo-darken-4">Total Efectivo Físico Contado:</td>
                <td class="text-right font-weight-bold text-h6 text-green-darken-3">
                  {{ formatCurrency(totalEfectivoContado) }}
                </td>
              </tr>
            </tfoot>
          </v-table>

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
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onActivated } from 'vue'
import { formatters } from '@/helpers/formatters'
import RequestHttp from '@/services/requestHttp'

export default {
  name: 'ArqueoCajaModule',

  setup() {
    const requestHttp = new RequestHttp()

    const loading = ref(false)
    const savingArqueo = ref(false)
    const tabActive = ref('disponibles')
    const searchHistorial = ref('')

    const dialogs = reactive({
      arqueo: false
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

    const resumenVigente = reactive({
      totalVentas: 0,
      totalMercaderia: 0,
      efectivoApertura: 0,
      totalRetiros: 0,
      totalEnCaja: 0
    })

    const formArqueo = reactive({
      montoRetiros: 0,
      observaciones: ''
    })

    const denominaciones = [
      { valor: 1000, label: 'Billetes de C$ 1,000' },
      { valor: 500, label: 'Billetes de C$ 500' },
      { valor: 200, label: 'Billetes de C$ 200' },
      { valor: 100, label: 'Billetes de C$ 100' },
      { valor: 50, label: 'Billetes de C$ 50' },
      { valor: 20, label: 'Billetes de C$ 20' },
      { valor: 10, label: 'Billetes de C$ 10' },
      { valor: 5, label: 'Monedas de C$ 5' },
      { valor: 1, label: 'Monedas de C$ 1' },
      { valor: 0.5, label: 'Monedas de C$ 0.50' },
      { valor: 0.25, label: 'Monedas de C$ 0.25' },
      { valor: 0.1, label: 'Monedas de C$ 0.10' }
    ]

    const cantidades = reactive({
      1000: 0,
      500: 0,
      200: 0,
      100: 0,
      50: 0,
      20: 0,
      10: 0,
      5: 0,
      1: 0,
      0.5: 0,
      0.25: 0,
      0.1: 0
    })

    const resetCantidades = () => {
      denominaciones.forEach(d => {
        cantidades[d.valor] = 0
      })
      formArqueo.montoRetiros = 0
      formArqueo.observaciones = ''
    }

    const totalEfectivoContado = computed(() => {
      return denominaciones.reduce((acc, d) => {
        const qty = Number(cantidades[d.valor]) || 0
        return acc + qty * d.valor
      }, 0)
    })

    const diferenciaArqueo = computed(() => {
      const teorico = Number(resumenVigente.totalEnCaja) || 0
      const retirosIngresados = Number(formArqueo.montoRetiros) || 0
      const fisico = Number(totalEfectivoContado.value) || 0
      return (fisico + retirosIngresados) - teorico
    })

    const cajasAperturadas = computed(() => {
      return cajasList.value.filter(c => {
        const est = (c.estadoNombre || '').toLowerCase()
        return est.includes('aperturad') || est.includes('arquead')
      })
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
      { title: 'Retiros', key: 'montoArqueoRetiros', align: 'end' },
      { title: 'Mercadería', key: 'montoArqueoMercaderia', align: 'end' },
      { title: 'Fecha Arqueo', key: 'fechaArqueo', align: 'center' }
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
        // 1. Cargar cajas
        const resCajas = await requestHttp.getCajas()
        if (resCajas.code === 200 && Array.isArray(resCajas.data)) {
          cajasList.value = resCajas.data

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

        // 2. Cargar historial de arqueos
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

      // Cargar resumen vigente de la caja
      try {
        const resResumen = await requestHttp.getCajaAperturaVigenteResumen(caja.idCaja)
        if (resResumen.code === 200 && resResumen.data) {
          resumenVigente.totalVentas = resResumen.data.totalVentas || 0
          resumenVigente.totalMercaderia = resResumen.data.totalMercaderia || 0
          resumenVigente.efectivoApertura = resResumen.data.efectivoApertura || 0
          resumenVigente.totalRetiros = resResumen.data.totalRetiros || 0
          resumenVigente.totalEnCaja = resResumen.data.totalEnCaja || 0
        } else {
          resumenVigente.totalVentas = 0
          resumenVigente.totalMercaderia = 0
          resumenVigente.efectivoApertura = 0
          resumenVigente.totalRetiros = 0
          resumenVigente.totalEnCaja = 0
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

      // Preparar desglose de denominaciones con cantidad > 0
      const desgloceDetalle = denominaciones
        .filter(d => (cantidades[d.valor] || 0) > 0)
        .map(d => ({
          valorDenominacion: d.valor,
          cantidad: Number(cantidades[d.valor])
        }))

      if (desgloceDetalle.length === 0 && totalEfectivoContado.value === 0) {
        if (!confirm('¿Desea registrar el arqueo con total de efectivo en 0?')) {
          return
        }
        // Si es 0, agregar una denominacion con valor 0 o cantidad 0 según regla del backend
        desgloceDetalle.push({
          valorDenominacion: 1,
          cantidad: 0.001 // O valor mínimo válido según Range
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

    // onActivated se ejecuta tanto al montarse por primera vez como al volver a entrar mediante keep-alive
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
      arqueosHistorial,
      filteredHistorial,
      headersHistorial,
      cajaSeleccionada,
      resumenVigente,
      formArqueo,
      denominaciones,
      cantidades,
      totalEfectivoContado,
      diferenciaArqueo,
      ultimoArqueoTexto,
      loadAllData,
      iniciarArqueo,
      guardarArqueo,
      formateDate,
      formatCurrency,
      preventNegative
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
