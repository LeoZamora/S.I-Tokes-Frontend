<template>
  <v-dialog
    v-model="localShow"
    max-width="600"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-lg overflow-hidden elevation-8">
      <!-- HEADER -->
      <v-card-item class="bg-orange-darken-3 text-white py-3 px-4">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="36" color="orange-darken-4" class="mr-3">
              <v-icon size="22" color="white">mdi-cash-minus</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">
                Retiros de Caja
              </div>
              <div class="text-caption text-orange-lighten-4">
                Gestión de egresos y salidas de efectivo
              </div>
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            color="white"
            @click="closeModal"
            :disabled="loading"
          />
        </div>
      </v-card-item>

      <!-- TABS -->
      <v-tabs
        v-model="tab"
        color="orange-darken-3"
        bg-color="grey-lighten-4"
        density="compact"
        grow
      >
        <v-tab :value="0" class="text-none font-weight-bold">
          <v-icon start size="18">mdi-cash-minus</v-icon>
          Registrar Retiro
        </v-tab>
        <v-tab :value="1" class="text-none font-weight-bold">
          <v-icon start size="18">mdi-history</v-icon>
          Historial de Retiros
          <v-chip
            v-if="retirosList.length > 0"
            size="x-small"
            color="orange-darken-3"
            class="ml-2 font-weight-bold"
          >
            {{ retirosList.length }}
          </v-chip>
        </v-tab>
      </v-tabs>

      <v-divider />

      <v-card-text class="pa-4">
        <v-window v-model="tab">
          <!-- TAB 0: FORMULARIO DE NUEVO RETIRO -->
          <v-window-item :value="0">
            <!-- BANNER INFORMATIVO / SESIÓN -->
            <div
              v-if="activeApertura"
              class="mb-3 d-flex align-center justify-space-between bg-orange-lighten-5 pa-2 px-3 rounded border"
            >
              <div class="d-flex align-center">
                <v-icon size="18" color="orange-darken-3" class="mr-1.5">mdi-cash-register</v-icon>
                <span class="text-caption font-weight-bold text-orange-darken-4">
                  Sesión: {{ activeApertura.codigo || activeApertura.cajaNombre || ('#' + resolvedIdApertura) }}
                </span>
              </div>
              <v-chip size="x-small" color="success" variant="flat" class="font-weight-bold">
                Caja Activa
              </v-chip>
            </div>

            <v-alert
              v-else
              type="info"
              variant="tonal"
              density="compact"
              color="indigo"
              class="mb-3 text-caption"
              icon="mdi-information-outline"
            >
              El monto retirado se descontará del saldo en efectivo de la sesión de caja activa actual.
            </v-alert>

            <!-- MENSAJE DE ERROR -->
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-3 text-caption"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <!-- MENSAJE DE ÉXITO -->
            <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              density="compact"
              class="mb-3 text-caption"
            >
              {{ successMessage }}
            </v-alert>

            <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitRetiro">
              <v-row dense>
                <!-- CONCEPTO -->
                <v-col cols="12">
                  <v-autocomplete
                    v-model="form.idConcepto"
                    :items="conceptos"
                    item-title="nombre"
                    item-value="id"
                    label="Concepto de Retiro *"
                    placeholder="Seleccione el concepto o motivo del retiro"
                    density="compact"
                    variant="outlined"
                    color="orange-darken-3"
                    prepend-inner-icon="mdi-format-list-bulleted-type"
                    :rules="[rules.required]"
                    :loading="loadingConceptos"
                    no-data-text="No hay conceptos de retiro disponibles"
                    persistent-placeholder
                    hide-details="auto"
                  />
                </v-col>

                <!-- MONTO -->
                <v-col cols="12">
                  <v-text-field
                    v-model.number="form.monto"
                    label="Monto a Retirar (C$) *"
                    placeholder="0.00"
                    type="number"
                    min="0.01"
                    step="0.01"
                    prefix="C$"
                    density="compact"
                    variant="outlined"
                    color="orange-darken-3"
                    prepend-inner-icon="mdi-currency-usd"
                    :rules="[rules.required, rules.positiveNumber]"
                    persistent-placeholder
                    hide-details="auto"
                    class="font-weight-bold"
                  />
                </v-col>

                <!-- OBSERVACIONES -->
                <v-col cols="12">
                  <v-textarea
                    v-model="form.observaciones"
                    label="Observaciones / Justificación"
                    placeholder="Especifique detalles adicionales del retiro (ej. compra de insumos, pago de servicio, etc.)"
                    rows="3"
                    density="compact"
                    variant="outlined"
                    color="orange-darken-3"
                    prepend-inner-icon="mdi-text"
                    persistent-placeholder
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>

          <!-- TAB 1: HISTORIAL DE RETIROS DE LA SESIÓN DE CAJA -->
          <v-window-item :value="1">
            <div class="d-flex align-center justify-space-between mb-3">
              <div>
                <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 d-flex align-center">
                  <v-icon size="small" color="orange-darken-3" class="mr-1">mdi-cash-register</v-icon>
                  Retiros de la Sesión Actual
                </div>
                <div v-if="activeApertura" class="text-caption text-grey">
                  Apertura: <strong>{{ activeApertura.codigo || ('#' + resolvedIdApertura) }}</strong>
                  <span v-if="activeApertura.cajaNombre"> ({{ activeApertura.cajaNombre }})</span>
                </div>
              </div>
              <v-btn
                size="small"
                variant="tonal"
                color="orange-darken-3"
                prepend-icon="mdi-refresh"
                @click="loadRetiros"
                :loading="loadingRetiros"
              >
                Actualizar
              </v-btn>
            </div>

            <!-- RESUMEN TOTAL RETIROS -->
            <v-card
              v-if="retirosList.length > 0"
              variant="flat"
              class="bg-orange-lighten-5 border pa-3 mb-3 rounded"
            >
              <div class="d-flex align-center justify-space-between">
                <span class="text-caption font-weight-bold text-orange-darken-4">
                  Total Retirado en Sesión:
                </span>
                <span class="text-subtitle-1 font-weight-bold text-orange-darken-4">
                  C$ {{ totalRetirosFormatted }}
                </span>
              </div>
            </v-card>

            <!-- LISTADO DE RETIROS -->
            <div v-if="loadingRetiros" class="text-center py-6">
              <v-progress-circular indeterminate color="orange-darken-3" size="32" />
              <div class="text-caption text-grey mt-2">Cargando retiros de la sesión...</div>
            </div>

            <div v-else-if="!tieneApertura && !loadingRetiros" class="text-center py-6 text-grey">
              <v-icon size="42" color="amber-darken-2">mdi-alert-circle-outline</v-icon>
              <div class="text-caption font-weight-medium mt-1">No se encontró una apertura de caja activa para el usuario.</div>
              <div class="text-caption text-grey-darken-1">Inicie sesión en caja para registrar o visualizar los retiros del turno.</div>
            </div>

            <div v-else-if="retirosList.length === 0" class="text-center py-6 text-grey">
              <v-icon size="42" color="grey-lighten-1">mdi-cash-check</v-icon>
              <div class="text-caption mt-1">No hay retiros registrados en esta sesión de caja.</div>
            </div>

            <v-list v-else density="compact" class="pa-0" style="max-height: 280px; overflow-y: auto;">
              <v-list-item
                v-for="(ret, idx) in retirosList"
                :key="idx"
                class="border-b py-2 px-2"
              >
                <template v-slot:prepend>
                  <v-avatar size="28" color="orange-lighten-4" class="me-2">
                    <v-icon size="16" color="orange-darken-3">mdi-arrow-up-bold</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="text-caption font-weight-bold d-flex justify-space-between align-center">
                  <span>{{ ret.conceptoNombre || 'Retiro de Caja' }}</span>
                  <span class="text-orange-darken-4 font-weight-bold">
                    C$ {{ Number(ret.monto || 0).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </span>
                </v-list-item-title>

                <v-list-item-subtitle class="text-caption text-grey mt-0.5 d-flex justify-space-between">
                  <span>
                    <v-icon size="x-small" class="mr-0.5">mdi-account-outline</v-icon>
                    {{ ret.usuarioRegistro || 'Usuario' }}
                  </span>
                  <span>
                    <v-icon size="x-small" class="mr-0.5">mdi-clock-outline</v-icon>
                    {{ formatDate(ret.fechaRegistro) }}
                  </span>
                </v-list-item-subtitle>

                <v-list-item-subtitle v-if="ret.observaciones" class="text-caption text-grey-darken-2 mt-1 bg-grey-lighten-4 pa-1 rounded">
                  {{ ret.observaciones }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn
                    icon
                    size="x-small"
                    variant="tonal"
                    color="indigo-darken-3"
                    class="ms-2"
                    title="Imprimir Comprobante de Retiro"
                    @click.stop="imprimirTicketRetiro(ret, idx)"
                    :loading="printingId === (ret.idRetiroCaja || ret.id || idx)"
                  >
                    <v-icon size="16">mdi-printer</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-divider />

      <!-- ACTIONS -->
      <v-card-actions class="bg-grey-lighten-5 px-4 py-2">
        <v-spacer />
        <v-btn
          variant="tonal"
          color="grey-darken-2"
          size="small"
          @click="closeModal"
          :disabled="loading"
        >
          Cerrar
        </v-btn>
        <v-btn
          v-if="tab === 0"
          color="orange-darken-3"
          variant="flat"
          size="small"
          prepend-icon="mdi-check"
          @click="submitRetiro"
          :loading="loading"
          :disabled="loading"
          class="font-weight-bold"
        >
          Registrar Retiro
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import RequestHttp from '@/services/requestHttp'
import { formatters } from '@/helpers/formatters'
import { useStore } from '@/store'

const NEGOCIO = {
  nombre: 'Migdalia\'s Market',
  direccion: 'Mercado Mayoreo Modulo #4',
  telefono: '2263-2783'
}

const ANCHO_TICKET = 42

function lineaDosColumnas(izquierda, derecha, ancho = ANCHO_TICKET) {
  izquierda = String(izquierda ?? '')
  derecha = String(derecha ?? '')
  const espacio = ancho - izquierda.length - derecha.length
  return espacio > 0
    ? izquierda + ' '.repeat(espacio) + derecha + '\n'
    : izquierda.slice(0, Math.max(0, ancho - derecha.length - 1)) + ' ' + derecha + '\n'
}

export default {
  name: 'ModalRetiroCaja',
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    idAperturaCaja: {
      type: [Number, String],
      default: null
    }
  },
  emits: ['closeDialog', 'retiroSuccess', 'update:show'],

  setup(props, { emit }) {
    const store = useStore()
    const localShow = ref(props.show)
    const tab = ref(0)
    const requestHttp = new RequestHttp()
    const formRef = ref(null)
    const isFormValid = ref(false)

    const loading = ref(false)
    const loadingConceptos = ref(false)
    const loadingRetiros = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')

    const activeApertura = ref(null)
    const tieneApertura = ref(false)
    const resolvedIdApertura = ref(props.idAperturaCaja ? Number(props.idAperturaCaja) : null)

    const conceptos = ref([])
    const retirosList = ref([])

    const form = reactive({
      idConcepto: null,
      monto: null,
      observaciones: ''
    })

    const rules = {
      required: (v) => !!v || 'Este campo es obligatorio',
      positiveNumber: (v) => (v !== null && v !== '' && Number(v) > 0) || 'El monto debe ser mayor a 0'
    }

    const totalRetirosFormatted = computed(() => {
      const sum = retirosList.value.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0)
      return sum.toLocaleString('es-NI', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    })

    function resetForm() {
      form.idConcepto = null
      form.monto = null
      form.observaciones = ''
      errorMessage.value = ''
      successMessage.value = ''
      if (formRef.value) {
        formRef.value.resetValidation()
      }
    }

    function closeModal() {
      resetForm()
      localShow.value = false
      emit('closeDialog', false)
      emit('update:show', false)
    }

    function formatDate(dateStr) {
      if (!dateStr) return '—'
      return formatters.formatDate(dateStr)
    }

    let resolveAperturaPromise = null

    async function resolveAperturaActiva(force = false) {
      if (!force && resolvedIdApertura.value && tieneApertura.value) {
        return resolvedIdApertura.value
      }

      if (props.idAperturaCaja && Number(props.idAperturaCaja) > 0) {
        resolvedIdApertura.value = Number(props.idAperturaCaja)
        tieneApertura.value = true
        return resolvedIdApertura.value
      }

      if (resolveAperturaPromise && !force) {
        return resolveAperturaPromise
      }

      const token = store.getInfoUser()
      const idUsuario = token?.idusuario ? parseInt(token.idusuario) : null
      if (!idUsuario) {
        resolvedIdApertura.value = null
        tieneApertura.value = false
        activeApertura.value = null
        return null
      }

      resolveAperturaPromise = (async () => {
        try {
          const res = await requestHttp.getUsuarioCajaActiva(idUsuario)
          if (res.code === 200 && res.data?.tieneAperturaActiva && res.data?.apertura) {
            activeApertura.value = res.data.apertura
            resolvedIdApertura.value = res.data.apertura.idAperturaCaja || res.data.apertura.IdAperturaCaja
            tieneApertura.value = true
            return resolvedIdApertura.value
          } else {
            activeApertura.value = null
            resolvedIdApertura.value = null
            tieneApertura.value = false
            return null
          }
        } catch (err) {
          console.error('Error al resolver apertura de caja activa:', err)
          resolvedIdApertura.value = null
          tieneApertura.value = false
          return null
        } finally {
          resolveAperturaPromise = null
        }
      })()

      return resolveAperturaPromise
    }

    async function loadConceptos() {
      if (loadingConceptos.value) return
      loadingConceptos.value = true
      try {
        const res = await requestHttp.getConceptosRetiroCajaCombobox()
        if (res && res.code === 200 && Array.isArray(res.data)) {
          conceptos.value = res.data
        } else {
          const resFallback = await requestHttp.getConceptos(2)
          if (resFallback && resFallback.code === 200 && Array.isArray(resFallback.data)) {
            conceptos.value = resFallback.data.map((c) => ({
              id: c.idConceptoTipoMov || c.id,
              nombre: c.nombre
            }))
          }
        }
      } catch (err) {
        console.error('Error al cargar conceptos de retiro:', err)
      } finally {
        loadingConceptos.value = false
      }
    }

    async function loadRetiros(idAperturaExplicit = null) {
      if (loadingRetiros.value) return
      loadingRetiros.value = true
      try {
        const idAp = idAperturaExplicit || await resolveAperturaActiva()
        if (!idAp) {
          retirosList.value = []
          return
        }

        const res = await requestHttp.getRetirosCaja({ idAperturaCaja: idAp })
        if (res && res.code === 200 && Array.isArray(res.data)) {
          retirosList.value = res.data
        } else {
          retirosList.value = []
        }
      } catch (err) {
        console.error('Error al cargar historial de retiros:', err)
        retirosList.value = []
      } finally {
        loadingRetiros.value = false
      }
    }

    async function submitRetiro() {
      errorMessage.value = ''
      successMessage.value = ''

      if (formRef.value) {
        const { valid } = await formRef.value.validate()
        if (!valid) return
      }

      if (!form.idConcepto) {
        errorMessage.value = 'Por favor, seleccione un concepto de retiro.'
        return
      }

      if (!form.monto || Number(form.monto) <= 0) {
        errorMessage.value = 'El monto a retirar debe ser mayor a 0.'
        return
      }

      loading.value = true
      try {
        const payload = {
          idConcepto: Number(form.idConcepto),
          monto: Number(form.monto),
          observaciones: form.observaciones ? String(form.observaciones).trim() : null
        }

        const res = await requestHttp.postRetiroCaja(payload)

        if (res && (res.code === 200 || res.code === 201)) {
          const msg = res.data?.msg || '¡Retiro de caja registrado correctamente!'
          successMessage.value = msg
          emit('retiroSuccess', res.data)
          await loadRetiros()
          setTimeout(() => {
            closeModal()
          }, 1200)
        } else {
          const errBackend =
            res.data?.msg ||
            res.data?.message ||
            'No se pudo registrar el retiro. Verifique si cuenta con apertura de caja activa y saldo suficiente.'
          errorMessage.value = errBackend
        }
      } catch (error) {
        errorMessage.value =
          error.response?.data?.msg ||
          error.response?.data?.message ||
          'Ocurrió un error inesperado al procesar el retiro de caja.'
      } finally {
        loading.value = false
      }
    }

    async function init() {
      tab.value = 0
      resetForm()
      await nextTick()
      const idAp = await resolveAperturaActiva()
      loadConceptos()
      if (idAp) {
        loadRetiros(idAp)
      } else {
        retirosList.value = []
      }
    }

    onMounted(() => {
      if (props.show) {
        localShow.value = true
        init()
      }
    })

    watch(
      () => props.show,
      (newVal) => {
        localShow.value = newVal
        if (newVal) {
          init()
        }
      }
    )

    watch(
      () => props.idAperturaCaja,
      (newVal) => {
        resolvedIdApertura.value = newVal ? Number(newVal) : null
        if (localShow.value) {
          loadRetiros()
        }
      }
    )

    watch(localShow, (newVal) => {
      if (!newVal) {
        emit('closeDialog', false)
        emit('update:show', false)
      }
    })

    const printingId = ref(null)

    async function imprimirTicketRetiro(ret, idx = 0) {
      const idKey = ret.idRetiroCaja || ret.id || ret.noRetiro || idx
      printingId.value = idKey

      try {
        const qz = window.qz
        if (!qz) {
          console.warn('QZ Tray no está disponible')
          return
        }

        if (!qz.websocket.isActive()) {
          await qz.websocket.connect()
        }

        const nombreImpresora = await qz.printers.find('POS-80C')
        const config = qz.configs.create(nombreImpresora)

        const separador = '-'.repeat(ANCHO_TICKET) + '\n'
        const separadorBlank = ' '.repeat(ANCHO_TICKET) + '\n'

        const noRetiro = ret.noRetiro || ret.idRetiroCaja || ret.id || 'N/A'
        const sesionCodigo =
          ret.codigoApertura ||
          ret.codigoAperturaCaja ||
          ret.aperturaCodigo ||
          activeApertura.value?.codigo ||
          (resolvedIdApertura.value ? `#${resolvedIdApertura.value}` : 'N/A')

        const rawFecha = ret.fechaRegistro || ret.fecha || new Date()
        const fechaRetiro = formatters.formatDate(rawFecha)
        const fechaImpresion = formatters.formatDate(new Date())

        const concepto = ret.conceptoNombre || ret.concepto || 'Retiro de Caja'
        const observaciones = ret.observaciones ? String(ret.observaciones).trim() : ''

        const token = store.getInfoUser()
        const cajero =
          ret.usuarioRegistro ||
          ret.usuario ||
          activeApertura.value?.usuario ||
          token?.nombre ||
          token?.usuario ||
          'N/A'

        const montoNum = Number(ret.monto || 0)
        const montoStr = 'C$ ' + montoNum.toLocaleString('es-NI', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })

        const ticket = [
          '\x1B\x40',                                    // init
          '\x1B\x61\x01',                                // centrar
          '\x1B\x21\x10',                                // doble altura
          '\x1B\x45\x01',                                // negrita ON
          `${NEGOCIO.nombre}\n`,
          '\x1B\x45\x00',                                // negrita OFF
          '\x1B\x21\x00',                                // fuente normal
          `${NEGOCIO.direccion}\n`,
          `Tel: ${NEGOCIO.telefono}\n`,
          separador,

          '\x1B\x45\x01',                                // negrita ON
          'COMPROBANTE DE RETIRO DE CAJA\n',
          '\x1B\x45\x00',                                // negrita OFF
          separador,

          '\x1B\x61\x00',                                // alinear izquierda
          `No. Retiro: ${noRetiro}\n`,
          `Sesion de caja: ${sesionCodigo}\n`,
          `Fecha: ${fechaRetiro}\n`,
          `Fecha de impresion: ${fechaImpresion}\n`,
          `Concepto: ${concepto}\n`,
          observaciones ? `Observaciones: ${observaciones}\n` : '',
          `Cajero: ${cajero}\n`,
          separador,

          '\x1B\x45\x01',                                // negrita ON
          lineaDosColumnas('MONTO RETIRADO:', montoStr),
          '\x1B\x45\x00',                                // negrita OFF
          separador,

          separadorBlank,
          separadorBlank,
          '\x1B\x61\x01',                                // centrar
          '______________________________\n',
          'Firma del Cajero\n\n\n',
          '______________________________\n',
          'Firma de Recibido Conforme\n\n\n',

          separadorBlank,
          '\x1D\x56\x00'                                  // corte de papel
        ]

        await qz.print(config, ticket)
        console.log('Comprobante de retiro enviado a imprimir ✅')
      } catch (err) {
        console.error('Error al imprimir comprobante de retiro:', err)
      } finally {
        printingId.value = null
      }
    }

    return {
      localShow,
      tab,
      formRef,
      isFormValid,
      loading,
      loadingConceptos,
      loadingRetiros,
      errorMessage,
      successMessage,
      activeApertura,
      tieneApertura,
      resolvedIdApertura,
      conceptos,
      retirosList,
      form,
      rules,
      totalRetirosFormatted,
      closeModal,
      formatDate,
      loadRetiros,
      submitRetiro,
      printingId,
      imprimirTicketRetiro
    }
  }
}
</script>
