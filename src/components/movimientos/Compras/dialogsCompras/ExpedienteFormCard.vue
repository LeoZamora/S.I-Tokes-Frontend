<template>
  <v-card class="elevation-3 rounded-lg overflow-hidden border">
    <!-- Header visual estilo Expediente / Dossier -->
    <v-card-title class="bg-gradient pa-4 text-white d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-avatar color="white" size="42" class="mr-3 text-primary elevation-2">
          <v-icon size="24" color="orange-darken-4">mdi-folder-account-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-h6 font-weight-bold">
            {{ isEditing ? `Expediente: ${form.noExpediente}` : 'Nuevo Expediente de Importación' }}
          </div>
          <div class="text-caption opacity-80">
            {{ isEditing ? 'Modificación de registro de importación y logística' : 'Completa la información requerida para aperturar un expediente' }}
          </div>
        </div>
      </div>
      <div>
        <v-btn
          variant="tonal"
          color="white"
          size="small"
          prepend-icon="mdi-arrow-left"
          @click="$emit('cancel')"
        >
          Regresar a la Lista
        </v-btn>
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-6 bg-grey-lighten-4">
      <v-form ref="formRef" v-model="valid" @submit.prevent="save">
        <v-row dense>
          <!-- SECCIÓN 1: DATOS PRINCIPALES -->
          <v-col cols="12">
            <div class="d-flex align-center mb-3">
              <v-icon color="orange-darken-4" class="mr-2">mdi-card-text-outline</v-icon>
              <h3 class="text-subtitle-1 font-weight-bold text-uppercase color-heading">1. Datos del Expediente y Proveedor</h3>
            </div>
            <v-card variant="outlined" class="pa-4 bg-white rounded-lg border-subtle mb-4">
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.noExpediente"
                    label="No. Expediente *"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-pound"
                    :rules="[v => !!v || 'El número de expediente es requerido']"
                    placeholder="Ej. EXP-2026-001"
                  />
                </v-col>

                <v-col cols="12" md="5">
                  <v-autocomplete
                    v-model="form.idProveedor"
                    :items="proveedores"
                    item-title="nombre"
                    item-value="idProveedor"
                    label="Proveedor *"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-domain"
                    :rules="[v => !!v || 'El proveedor es requerido']"
                    clearable
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="form.incoterm"
                    label="Incoterm"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-handshake-outline"
                    placeholder="Ej. FOB, CIF, EXW"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="form.descripcion"
                    label="Descripción / Observaciones del Contenido"
                    variant="outlined"
                    density="compact"
                    rows="2"
                    prepend-inner-icon="mdi-text"
                    placeholder="Detalles sobre los productos o notas del embarque..."
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- SECCIÓN 2: DATOS MARÍTIMOS Y LOGÍSTICA -->
          <v-col cols="12">
            <div class="d-flex align-center mb-3">
              <v-icon color="orange-darken-4" class="mr-2">mdi-ferry</v-icon>
              <h3 class="text-subtitle-1 font-weight-bold text-uppercase color-heading">2. Logística y Datos de Embarque</h3>
            </div>
            <v-card variant="outlined" class="pa-4 bg-white rounded-lg border-subtle mb-4">
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.numeroBL"
                    label="Número de B/L (Bill of Lading)"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-file-document-outline"
                    placeholder="Ej. MAEU123456789"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-autocomplete
                    v-model="form.idNaviera"
                    :items="navieras"
                    item-title="nombre"
                    item-value="idProveedor"
                    label="Naviera / Transportista"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-ship-wheel"
                    clearable
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.puertoOrigen"
                    label="Puerto de Origen"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-map-marker-outline"
                    placeholder="Ej. Ningbo, China"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.puertoDestino"
                    label="Puerto de Destino"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-map-marker-check-outline"
                    placeholder="Ej. Puerto Quetzal, GT"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="form.cantidadContenedores"
                    label="Cantidad de Contenedores"
                    type="number"
                    step="0.01"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-cube-outline"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="form.cbm"
                    label="CBM (Metros Cúbicos)"
                    type="number"
                    step="0.01"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-ruler-square"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- SECCIÓN 3: FECHAS ETA & ETD -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-3">
              <v-icon color="orange-darken-4" class="mr-2">mdi-calendar-clock</v-icon>
              <h3 class="text-subtitle-1 font-weight-bold text-uppercase color-heading">3. Tiempos de Embarque</h3>
            </div>
            <v-card variant="outlined" class="pa-4 bg-white rounded-lg border-subtle mb-4">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.etd"
                    label="ETD (Fecha de Salida Estimated)"
                    type="date"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-calendar-export"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.eta"
                    label="ETA (Fecha de Arribo Estimated)"
                    type="date"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-calendar-import"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- SECCIÓN 4: ADUANA Y DUCA -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-3">
              <v-icon color="orange-darken-4" class="mr-2">mdi-office-building-cog</v-icon>
              <h3 class="text-subtitle-1 font-weight-bold text-uppercase color-heading">4. Información Aduanera</h3>
            </div>
            <v-card variant="outlined" class="pa-4 bg-white rounded-lg border-subtle mb-4">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.noDUCA"
                    label="No. DUCA"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-file-certificate-outline"
                    placeholder="Ej. DUCA-D-12345"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="form.idAgenciaAduanera"
                    :items="agenciasAduaneras"
                    item-title="nombre"
                    item-value="idProveedor"
                    label="Agencia Aduanera"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-account-tie"
                    clearable
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-divider />

    <v-card-actions class="pa-4 bg-white justify-end">
      <v-btn
        variant="outlined"
        color="grey-darken-1"
        class="mr-2"
        prepend-icon="mdi-close"
        @click="$emit('cancel')"
      >
        Cancelar
      </v-btn>
      <v-btn
        color="orange-darken-4"
        elevation="2"
        prepend-icon="mdi-content-save"
        :loading="saving"
        @click="save"
      >
        {{ isEditing ? 'Guardar Cambios' : 'Registrar Expediente' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useStore } from '@/store'
import { useSnackbar } from '@/composables/use-snackbar.js'
import RequestHttp from '@/services/requestHttp'

export default {
  name: 'ExpedienteFormCard',
  props: {
    expedienteData: {
      type: Object,
      default: null
    },
    proveedores: {
      type: Array,
      default: () => []
    },
    navieras: {
      type: Array,
      default: () => []
    },
    agenciasAduaneras: {
      type: Array,
      default: () => []
    }
  },
  emits: ['saved', 'cancel'],
  setup(props, { emit }) {
    const store = useStore()
    const { snackbar } = useSnackbar()
    const requestHttp = new RequestHttp()
    const formRef = ref(null)
    const valid = ref(false)
    const saving = ref(false)

    const isEditing = computed(() => !!props.expedienteData?.idExpedienteImportacion)

    const formatDateForInput = (dateStr) => {
      if (!dateStr) return ''
      return dateStr.split('T')[0]
    }

    const form = reactive({
      idExpedienteImportacion: null,
      noExpediente: '',
      idProveedor: null,
      incoterm: '',
      descripcion: '',
      numeroBL: '',
      idNaviera: null,
      puertoOrigen: '',
      puertoDestino: '',
      eta: '',
      etd: '',
      cantidadContenedores: null,
      cbm: null,
      noDUCA: '',
      idAgenciaAduanera: null
    })

    const loadFormData = () => {
      if (props.expedienteData) {
        form.idExpedienteImportacion = props.expedienteData.idExpedienteImportacion
        form.noExpediente = props.expedienteData.noExpediente || ''
        form.idProveedor = props.expedienteData.idProveedor || null
        form.incoterm = props.expedienteData.incoterm || ''
        form.descripcion = props.expedienteData.descripcion || ''
        form.numeroBL = props.expedienteData.numeroBL || ''
        form.idNaviera = props.expedienteData.idNaviera || null
        form.puertoOrigen = props.expedienteData.puertoOrigen || ''
        form.puertoDestino = props.expedienteData.puertoDestino || ''
        form.eta = formatDateForInput(props.expedienteData.eta)
        form.etd = formatDateForInput(props.expedienteData.etd)
        form.cantidadContenedores = props.expedienteData.cantidadContenedores ?? null
        form.cbm = props.expedienteData.cbm ?? null
        form.noDUCA = props.expedienteData.noDUCA || ''
        form.idAgenciaAduanera = props.expedienteData.idAgenciaAduanera || null
      } else {
        form.idExpedienteImportacion = null
        form.noExpediente = ''
        form.idProveedor = null
        form.incoterm = ''
        form.descripcion = ''
        form.numeroBL = ''
        form.idNaviera = null
        form.puertoOrigen = ''
        form.puertoDestino = ''
        form.eta = ''
        form.etd = ''
        form.cantidadContenedores = null
        form.cbm = null
        form.noDUCA = ''
        form.idAgenciaAduanera = null
      }
    }

    watch(() => props.expedienteData, loadFormData, { immediate: true })

    const save = async () => {
      const { valid: isValid } = await formRef.value.validate()
      if (!isValid) return

      saving.value = true
      try {
        const username = store.getNameUser() || 'Sistema'
        const payload = {
          noExpediente: form.noExpediente,
          idProveedor: form.idProveedor,
          incoterm: form.incoterm || null,
          descripcion: form.descripcion || null,
          numeroBL: form.numeroBL || null,
          idNaviera: form.idNaviera || null,
          puertoOrigen: form.puertoOrigen || null,
          puertoDestino: form.puertoDestino || null,
          eta: form.eta ? new Date(form.eta).toISOString() : null,
          etd: form.etd ? new Date(form.etd).toISOString() : null,
          cantidadContenedores: form.cantidadContenedores !== null && form.cantidadContenedores !== '' ? Number(form.cantidadContenedores) : null,
          cbm: form.cbm !== null && form.cbm !== '' ? Number(form.cbm) : null,
          noDUCA: form.noDUCA || null,
          idAgenciaAduanera: form.idAgenciaAduanera || null
        }

        let res
        if (isEditing.value) {
          payload.idExpedienteImportacion = form.idExpedienteImportacion
          payload.usuarioUltMod = username
          res = await requestHttp.putExpedienteImportacion(form.idExpedienteImportacion, payload)
        } else {
          payload.usuarioRegistro = username
          res = await requestHttp.postExpedienteImportacion(payload)
        }

        if (res.code === 200 || res.code === 201) {
          snackbar.value = {
            show: true,
            text: isEditing.value ? 'Expediente actualizado exitosamente' : 'Expediente creado exitosamente',
            color: 'success'
          }
          emit('saved')
        } else {
          snackbar.value = {
            show: true,
            text: res.data?.mensaje || 'Error al procesar la solicitud',
            color: 'error'
          }
        }
      } catch (err) {
        snackbar.value = {
          show: true,
          text: 'Error de comunicación con el servidor',
          color: 'error'
        }
      } finally {
        saving.value = false
      }
    }

    return {
      formRef,
      valid,
      saving,
      form,
      isEditing,
      save
    }
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #e65100 0%, #ef6c00 100%);
}
.color-heading {
  color: #e65100;
}
.border-subtle {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}
</style>
