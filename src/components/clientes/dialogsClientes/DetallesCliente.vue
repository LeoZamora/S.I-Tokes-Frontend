<template>
  <v-dialog v-model="localShow" max-width="750" persistent>
    <v-card class="rounded-lg overflow-hidden">
      <!-- Encabezado del diálogo -->
      <v-card-title class="d-flex align-center bg-indigo-darken-4 text-white py-2 px-4">
        <v-avatar size="36" color="white" class="me-3" variant="flat">
          <v-icon color="indigo-darken-4" size="22">mdi-account-tie</v-icon>
        </v-avatar>
        <div>
          <div class="text-subtitle-1 font-weight-bold">Detalles del Cliente</div>
          <div class="text-caption text-indigo-lighten-4" v-if="fullClienteData.nombre">
            {{ fullClienteData.nombre }} <span v-if="fullClienteData.codigo">({{ fullClienteData.codigo }})</span>
          </div>
        </div>
        <v-spacer />
        <v-btn variant="text" icon size="small" color="white" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
          <v-tooltip activator="parent" location="top">Cerrar</v-tooltip>
        </v-btn>
      </v-card-title>

      <!-- Contenido principal -->
      <v-card-text class="px-4 pt-2 pb-4 bg-grey-lighten-5">
        <!-- Tabs de navegación -->
        <v-tabs v-model="tab" color="indigo-darken-4" align-tabs="center" class="mb-3">
          <v-tab :value="1" class="text-capitalize px-4">
            <v-icon size="18" class="me-2">mdi-card-account-details-outline</v-icon>
            <span class="font-weight-medium">Información General</span>
          </v-tab>
          <v-tab :value="2" class="text-capitalize px-4">
            <v-icon size="18" class="me-2">mdi-map-marker-multiple</v-icon>
            <span class="font-weight-medium">
              Direcciones ({{ clientAddresses.length }})
            </span>
          </v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <!-- PESTAÑA 1: DATOS GENERALES Y LOGÍSTICA -->
          <v-window-item :value="1">
            <v-row dense>
              <!-- Columna Izquierda: Información Básica y Fiscal -->
              <v-col cols="12" md="6">
                <v-card variant="flat" class="border rounded-lg bg-white pa-4 mb-3" elevation="0">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="indigo" size="20" class="me-2">mdi-information-outline</v-icon>
                    <h4 class="font-weight-bold text-indigo-darken-4">Datos Básicos y Fiscales</h4>
                  </div>

                  <v-list density="compact" class="pa-0">
                    <v-list-item class="px-0 py-1">
                      <template v-slot:prepend>
                        <v-icon size="18" color="blue-grey" class="me-2">mdi-barcode</v-icon>
                      </template>
                      <v-list-item-title class="text-caption text-grey-darken-1">Código:</v-list-item-title>
                      <v-list-item-subtitle class="text-caption font-weight-bold text-grey-darken-3">
                        {{ fullClienteData.codigo || 'S/C' }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider class="my-1" />

                    <v-list-item class="px-0 py-1">
                      <template v-slot:prepend>
                        <v-icon size="18" color="blue-grey" class="me-2">mdi-account</v-icon>
                      </template>
                      <v-list-item-title class="text-caption text-grey-darken-1">Nombre Comercial:</v-list-item-title>
                      <v-list-item-subtitle class="text-caption font-weight-bold text-indigo-darken-4">
                        {{ fullClienteData.nombre || '—' }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider class="my-1" />

                    <v-list-item class="px-0 py-1">
                      <template v-slot:prepend>
                        <v-icon size="18" color="blue-grey" class="me-2">mdi-office-building</v-icon>
                      </template>
                      <v-list-item-title class="text-caption text-grey-darken-1">Razón Social:</v-list-item-title>
                      <v-list-item-subtitle class="text-caption font-weight-medium text-grey-darken-3">
                        {{ fullClienteData.razonSocial || '—' }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider class="my-1" />

                    <v-list-item class="px-0 py-1">
                      <template v-slot:prepend>
                        <v-icon size="18" color="blue-grey" class="me-2">mdi-shape-outline</v-icon>
                      </template>
                      <v-list-item-title class="text-caption text-grey-darken-1">Tipo de Cliente:</v-list-item-title>
                      <v-list-item-subtitle class="text-caption font-weight-medium text-grey-darken-3">
                        {{ getCategoriaClienteNombre() }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider class="my-1" />

                    <v-list-item class="px-0 py-1">
                      <template v-slot:prepend>
                        <v-icon size="18" color="blue-grey" class="me-2">mdi-card-account-details</v-icon>
                      </template>
                      <v-list-item-title class="text-caption text-grey-darken-1">Documento:</v-list-item-title>
                      <v-list-item-subtitle class="text-caption font-weight-medium text-grey-darken-3">
                        <span v-if="fullClienteData.noDocumento">
                          {{ fullClienteData.tipoDocumento ? fullClienteData.tipoDocumento + ': ' : '' }}{{ fullClienteData.noDocumento }}
                        </span>
                        <span v-else class="text-grey">—</span>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider class="my-1" />

                    <v-list-item class="px-0 py-1">
                      <template v-slot:prepend>
                        <v-icon size="18" color="blue-grey" class="me-2">mdi-phone</v-icon>
                      </template>
                      <v-list-item-title class="text-caption text-grey-darken-1">Teléfono:</v-list-item-title>
                      <v-list-item-subtitle class="text-caption font-weight-medium text-grey-darken-3">
                        {{ fullClienteData.telefono || '—' }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider class="my-1" />

                    <v-list-item class="px-0 py-1">
                      <template v-slot:prepend>
                        <v-icon size="18" color="blue-grey" class="me-2">mdi-email-outline</v-icon>
                      </template>
                      <v-list-item-title class="text-caption text-grey-darken-1">Correo Electrónico:</v-list-item-title>
                      <v-list-item-subtitle class="text-caption font-weight-medium text-grey-darken-3">
                        {{ fullClienteData.correo || fullClienteData.email || '—' }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>

              <!-- Columna Derecha: Logística y Auditoría -->
              <v-col cols="12" md="6">
                <!-- Logística y Rutas -->
                <v-card variant="flat" class="border rounded-lg bg-white pa-4 mb-3" elevation="0">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="indigo" size="20" class="me-2">mdi-routes</v-icon>
                    <h4 class="font-weight-bold text-indigo-darken-4">Ruta y Logística</h4>
                  </div>

                  <v-list density="compact" class="pa-0">
                    <v-list-item class="px-0 py-1">
                      <template v-slot:prepend>
                        <v-icon size="18" color="amber-darken-3" class="me-2">mdi-map-marker-path</v-icon>
                      </template>
                      <v-list-item-title class="text-caption text-grey-darken-1">Ruta Asignada:</v-list-item-title>
                      <v-list-item-subtitle class="text-caption font-weight-bold text-indigo-darken-4">
                        {{ fullClienteData.ruta || (fullClienteData.idRutaNavigation ? fullClienteData.idRutaNavigation.nombre : '—') }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider class="my-1" />

                    <v-list-item class="px-0 py-1" v-if="fullClienteData.observaciones">
                      <template v-slot:prepend>
                        <v-icon size="18" color="blue-grey" class="me-2">mdi-text</v-icon>
                      </template>
                      <v-list-item-title class="text-caption text-grey-darken-1">Observaciones / Notas:</v-list-item-title>
                      <v-list-item-subtitle class="text-caption text-wrap text-grey-darken-2 mt-1">
                        {{ fullClienteData.observaciones }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card>

                <!-- Información del Registro -->
                <v-card variant="flat" class="border rounded-lg bg-white pa-4" elevation="0">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="indigo" size="20" class="me-2">mdi-history</v-icon>
                    <h4 class="font-weight-bold text-indigo-darken-4">Información del Registro</h4>
                  </div>

                  <v-list density="compact" class="pa-0">
                    <v-list-item class="px-0 py-1">
                      <template v-slot:prepend>
                        <v-avatar size="24" color="grey-lighten-3" class="me-2">
                          <v-icon size="14" color="grey-darken-2">mdi-account</v-icon>
                        </v-avatar>
                      </template>
                      <v-list-item-title class="text-caption text-grey-darken-1">Registrado por:</v-list-item-title>
                      <v-list-item-subtitle class="text-caption font-weight-medium text-grey-darken-3">
                        {{ fullClienteData.usuarioRegistro || 'N/A' }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider class="my-1" />

                    <v-list-item class="px-0 py-1">
                      <template v-slot:prepend>
                        <v-icon size="18" color="blue-grey" class="me-2">mdi-calendar-clock</v-icon>
                      </template>
                      <v-list-item-title class="text-caption text-grey-darken-1">Fecha de Registro:</v-list-item-title>
                      <v-list-item-subtitle class="text-caption font-weight-medium text-grey-darken-3">
                        {{ formateDate(fullClienteData.fechaRegistro) }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider class="my-1" />

                    <v-list-item class="px-0 py-1">
                      <template v-slot:prepend>
                        <v-chip :color="fullClienteData.estado ? 'green' : 'red'" size="x-small" class="me-2" variant="flat">
                          <v-icon size="12" class="me-1">{{ fullClienteData.estado ? 'mdi-check' : 'mdi-close' }}</v-icon>
                          {{ fullClienteData.estado ? 'Activo' : 'Inactivo' }}
                        </v-chip>
                      </template>
                      <v-list-item-title class="text-caption text-grey-darken-1">Estado en Sistema</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- PESTAÑA 2: DIRECCIONES Y UBICACIONES -->
          <v-window-item :value="2">
            <div v-if="clientAddresses.length > 0" class="d-flex flex-column ga-3">
              <v-card
                v-for="(dir, idx) in clientAddresses"
                :key="idx"
                variant="flat"
                class="border rounded-lg bg-white pa-3"
                elevation="0"
              >
                <div class="d-flex align-center justify-space-between mb-2">
                  <div class="d-flex align-center">
                    <v-avatar size="32" :color="dir.esDirFacturacion ? 'amber-lighten-5' : 'teal-lighten-5'" class="me-2">
                      <v-icon size="18" :color="dir.esDirFacturacion ? 'amber-darken-3' : 'teal'">
                        {{ dir.esDirFacturacion ? 'mdi-file-document-outline' : 'mdi-map-marker' }}
                      </v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-subtitle-2 font-weight-bold text-indigo-darken-4">
                        {{ dir.nombre || 'Dirección ' + (idx + 1) }}
                      </div>
                      <div class="text-caption text-grey">
                        {{ dir.departamento || 'Departamento' }}<span v-if="dir.municipio && dir.municipio !== '- - -'">, {{ dir.municipio }}</span>
                      </div>
                    </div>
                  </div>

                  <v-chip v-if="dir.esDirFacturacion" color="amber-darken-3" size="small" variant="flat" class="font-weight-medium">
                    <v-icon size="small" class="me-1">mdi-star</v-icon> Facturación Principal
                  </v-chip>
                </div>

                <div class="bg-grey-lighten-5 pa-2 rounded text-caption text-grey-darken-3 border mb-2">
                  <span class="font-weight-bold">Dirección: </span>{{ dir.direccionIngresada || dir.direccion || '—' }}
                </div>

                <div v-if="dir.googleMapsURL || (dir.latitude && dir.longitude)" class="d-flex justify-end">
                  <v-btn
                    size="x-small"
                    color="teal-darken-3"
                    variant="tonal"
                    prepend-icon="mdi-navigation"
                    :href="getGpsUrl(dir)"
                    target="_blank"
                    class="text-none"
                  >
                    Abrir en Google Maps
                  </v-btn>
                </div>
              </v-card>
            </div>

            <v-alert v-else type="info" variant="tonal" density="compact" class="mt-2 text-caption">
              No se han encontrado direcciones registradas para este cliente.
            </v-alert>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-divider />

      <v-card-actions class="bg-white px-4 py-2">
        <v-spacer />
        <v-btn color="indigo-darken-4" variant="tonal" size="small" @click="closeDialog">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatters } from '@/helpers/formatters';
import RequestHttp from '@/services/requestHttp';
import { ref, watch, reactive } from 'vue';

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    cliente: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  setup(props, { emit }) {
    const localShow = ref(props.show)
    const tab = ref(1)
    const requestHttp = new RequestHttp()

    const fullClienteData = reactive({
      idCliente: null,
      codigo: null,
      nombre: null,
      razonSocial: null,
      categoriaCliente: null,
      idCategoriaCliente: null,
      idCategoriaClienteNavigation: null,
      tipoDocumento: null,
      noDocumento: null,
      telefono: null,
      correo: null,
      email: null,
      ruta: null,
      idRutaNavigation: null,
      departamento: null,
      municipio: null,
      direccion: null,
      observaciones: null,
      estado: true,
      fechaRegistro: null,
      usuarioRegistro: null,
      direcciones: []
    })

    const clientAddresses = ref([])

    function populateData(data) {
      if (!data) return
      Object.assign(fullClienteData, data)

      if (Array.isArray(data.direcciones) && data.direcciones.length > 0) {
        clientAddresses.value = [...data.direcciones]
      } else if (data.direccion || data.departamento) {
        clientAddresses.value = [
          {
            nombre: 'Principal',
            departamento: data.departamento || '',
            municipio: data.municipio || '',
            direccionIngresada: data.direccion || '',
            googleMapsURL: data.googleMapsURL || '',
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            esDirFacturacion: true
          }
        ]
      } else {
        clientAddresses.value = []
      }
    }

    async function loadClientDetails(id) {
      if (!id) return
      try {
        const result = await requestHttp.getByIdCliente(id)
        if (result && result.code === 200 && result.data) {
          const apiData = result.data.data || result.data
          populateData(apiData)
        }
      } catch (err) {
        console.error('Error fetching client details in modal:', err)
      }
    }

    watch(() => props.show, (newVal) => {
      localShow.value = newVal
      if (newVal) {
        tab.value = 1
        if (props.cliente) {
          populateData(props.cliente)
          if (props.cliente.idCliente) {
            loadClientDetails(props.cliente.idCliente)
          }
        }
      }
    })

    watch(() => props.cliente, (newClient) => {
      if (newClient) {
        populateData(newClient)
        if (newClient.idCliente && localShow.value) {
          loadClientDetails(newClient.idCliente)
        }
      }
    }, { deep: true })

    function closeDialog() {
      emit('cerrarDialog', false)
    }

    function formateDate(dateString) {
      if (!dateString) return '—'
      return formatters.formatDate(dateString)
    }

    function getGpsUrl(dir) {
      if (!dir) return '#'
      if (dir.googleMapsURL) return dir.googleMapsURL
      if (dir.latitude && dir.longitude) {
        return `https://www.google.com/maps/dir/?api=1&destination=${dir.latitude},${dir.longitude}`
      }
      return '#'
    }

    function getCategoriaClienteNombre() {
      if (fullClienteData.categoriaCliente) return fullClienteData.categoriaCliente
      if (fullClienteData.idCategoriaClienteNavigation && fullClienteData.idCategoriaClienteNavigation.nombre) {
        return fullClienteData.idCategoriaClienteNavigation.nombre
      }
      return '—'
    }

    return {
      localShow,
      tab,
      fullClienteData,
      clientAddresses,
      closeDialog,
      formateDate,
      getGpsUrl,
      getCategoriaClienteNombre
    }
  }
}
</script>

<style scoped>
</style>
