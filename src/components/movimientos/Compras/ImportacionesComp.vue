<template>
  <v-container fluid class="pa-4 bg-grey-lighten-4 min-vh-100">
    <!-- VISTA 1: LISTADO Y FILTROS -->
    <div v-if="currentView === 'list'">
      <!-- PANEL CABECERA -->
      <v-row dense class="mb-3">
        <v-col cols="12">
          <v-card class="elevation-2 rounded-lg">
            <v-card-title class="bg-gradient text-white pa-4 d-flex flex-wrap align-center justify-space-between">
              <div class="d-flex align-center">
                <v-avatar color="white" size="44" class="mr-3 text-primary elevation-2">
                  <v-icon size="26" color="orange-darken-4">mdi-ship-wheel</v-icon>
                </v-avatar>
                <div>
                  <h1 class="text-h5 font-weight-bold">Gestión de Expedientes de Importación</h1>
                  <p class="text-caption opacity-80 mb-0">Control de expedientes logísticos, embarques marítimos y documentación</p>
                </div>
              </div>

              <div class="d-flex align-center mt-2 mt-sm-0">
                <v-btn
                  color="white"
                  variant="elevated"
                  class="text-orange-darken-4 font-weight-bold mr-2"
                  prepend-icon="mdi-plus"
                  @click="openNewExpediente"
                >
                  Nuevo Expediente
                </v-btn>
                <v-btn
                  color="white"
                  variant="outlined"
                  icon="mdi-refresh"
                  title="Refrescar datos"
                  @click="fetchExpedientes"
                />
              </div>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <!-- FILTROS Y BÚSQUEDA -->
      <v-card class="elevation-1 rounded-lg mb-4 pa-4 bg-white">
        <!-- BARRA DE BÚSQUEDA GLOBAL -->
        <v-row dense class="align-center mb-3">
          <v-col cols="12" md="6" lg="7">
            <v-text-field
              v-model="search"
              label="Buscar expediente (No. Expediente, BL, DUCA, Proveedor...)"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6" lg="5" class="d-flex align-center justify-end flex-wrap gap-2">
            <span class="text-caption font-weight-bold text-grey-darken-2 mr-2">Filtros Rápidos:</span>
            <v-chip-group v-model="selectedQuickFilter" mandatory color="orange-darken-4" @update:model-value="onQuickFilterChange">
              <v-chip value="all" filter variant="outlined" size="small">Todos</v-chip>
              <v-chip value="etd-mes" filter variant="outlined" size="small" prepend-icon="mdi-calendar-export">Sale este mes</v-chip>
              <v-chip value="etd-semana" filter variant="outlined" size="small" prepend-icon="mdi-calendar-week">Sale esta semana</v-chip>
              <v-chip value="eta-mes" filter variant="outlined" size="small" prepend-icon="mdi-calendar-import">Llega este mes</v-chip>
              <v-chip value="eta-semana" filter variant="outlined" size="small" prepend-icon="mdi-calendar-week-begin">Llega esta semana</v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <v-divider class="my-3" />

        <!-- FILTROS POR SELECTORES DE CATÁLOGO -->
        <v-row dense>
          <v-col cols="12" sm="4" md="3">
            <v-autocomplete
              v-model="filtro.idProveedor"
              :items="proveedores"
              item-title="nombre"
              item-value="idProveedor"
              label="Filtrar por Proveedor"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              prepend-inner-icon="mdi-domain"
              @update:model-value="fetchExpedientes"
            />
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-autocomplete
              v-model="filtro.idNaviera"
              :items="navieras"
              item-title="nombre"
              item-value="idProveedor"
              label="Filtrar por Naviera"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              prepend-inner-icon="mdi-ferry"
              @update:model-value="fetchExpedientes"
            />
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-autocomplete
              v-model="filtro.idAgenciaAduanera"
              :items="agenciasAduaneras"
              item-title="nombre"
              item-value="idProveedor"
              label="Filtrar por Agencia Aduanera"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              prepend-inner-icon="mdi-office-building"
              @update:model-value="fetchExpedientes"
            />
          </v-col>
          <v-col cols="12" md="3" class="d-flex align-center justify-end">
            <v-btn
              variant="text"
              color="grey-darken-1"
              size="small"
              prepend-icon="mdi-filter-remove-outline"
              @click="resetFilters"
            >
              Limpiar Filtros
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- TABLA DE EXPEDIENTES -->
      <v-card class="elevation-2 rounded-lg overflow-hidden">
        <v-data-table
          :headers="headers"
          :items="expedientes"
          :search="search"
          :loading="loading"
          hover
          class="elevation-0"
          no-data-text="No se encontraron expedientes de importación."
          loading-text="Cargando expedientes..."
        >
          <!-- No. Expediente + badge -->
          <template #item.noExpediente="{ item }">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-4" class="mr-2">mdi-folder</v-icon>
              <div>
                <span class="font-weight-bold text-primary cursor-pointer" @click="editExpediente(item)">
                  {{ item.noExpediente }}
                </span>
                <div v-if="item.incoterm" class="text-caption text-grey-darken-1">
                  Incoterm: {{ item.incoterm }}
                </div>
              </div>
            </div>
          </template>

          <!-- Proveedor -->
          <template #item.nombreProveedor="{ item }">
            <div class="text-body-2 font-weight-medium">{{ item.nombreProveedor || 'N/A' }}</div>
          </template>

          <!-- BL y Naviera -->
          <template #item.numeroBL="{ item }">
            <div class="text-caption">
              <div><strong>BL:</strong> {{ item.numeroBL || 'Sin BL' }}</div>
              <div class="text-grey-darken-1"><strong>Naviera:</strong> {{ item.nombreNaviera || 'N/A' }}</div>
            </div>
          </template>

          <!-- Fechas ETD y ETA -->
          <template #item.etd="{ item }">
            <div class="text-caption">
              <div><v-icon size="14" color="indigo" class="mr-1">mdi-calendar-export</v-icon> <strong>ETD:</strong> {{ formatDate(item.etd) }}</div>
              <div><v-icon size="14" color="teal" class="mr-1">mdi-calendar-import</v-icon> <strong>ETA:</strong> {{ formatDate(item.eta) }}</div>
            </div>
          </template>

          <!-- DUCA y Agencia Aduanera -->
          <template #item.noDUCA="{ item }">
            <div class="text-caption">
              <div><strong>DUCA:</strong> {{ item.noDUCA || 'N/A' }}</div>
              <div class="text-grey-darken-1">{{ item.nombreAgenciaAduanera || '' }}</div>
            </div>
          </template>

          <!-- Total Documentos Badge -->
          <template #item.totalDocumentos="{ item }">
            <v-chip
              size="small"
              :color="item.totalDocumentos > 0 ? 'orange-darken-4' : 'grey'"
              class="font-weight-bold cursor-pointer"
              @click="openVerDocumentos(item)"
            >
              <v-icon start size="14">mdi-paperclip</v-icon>
              {{ item.totalDocumentos || 0 }} Doc(s)
            </v-chip>
          </template>

          <!-- Acciones -->
          <template #item.acciones="{ item }">
            <div class="d-flex align-center gap-1">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="orange-darken-4"
                size="small"
                title="Editar Expediente"
                @click="editExpediente(item)"
              />
              <v-btn
                icon="mdi-paperclip-plus"
                variant="text"
                color="success"
                size="small"
                title="Adjuntar Documento"
                @click="openSubirDocumento(item)"
              />
              <v-btn
                icon="mdi-folder-eye"
                variant="text"
                color="info"
                size="small"
                title="Ver Documentos"
                @click="openVerDocumentos(item)"
              />
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                color="error"
                size="small"
                title="Eliminar Expediente"
                @click="confirmDeleteExpediente(item)"
              />
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- VISTA 2: FORMULARIO CARD COMPLETO EN ESTILO EXPEDIENTE -->
    <div v-else-if="currentView === 'form'">
      <ExpedienteFormCard
        :expediente-data="selectedExpediente"
        :proveedores="proveedores"
        :navieras="navieras"
        :agencias-aduaneras="agenciasAduaneras"
        @saved="onExpedienteSaved"
        @cancel="currentView = 'list'"
      />
    </div>

    <!-- DIÁLOGO SUBIR DOCUMENTO -->
    <SubirDocumentoDialog
      :show="showSubirDialog"
      :expediente="selectedExpediente"
      @close="showSubirDialog = false"
      @uploaded="onDocumentUploaded"
    />

    <!-- DIÁLOGO VER DOCUMENTOS (CARDS GRID) -->
    <VerDocumentosExpedienteDialog
      :show="showVerDocsDialog"
      :expediente="selectedExpediente"
      @close="showVerDocsDialog = false"
      @open-upload="showVerDocsDialog = false; showSubirDialog = true"
      @doc-deleted="fetchExpedientes"
    />

    <!-- DIÁLOGO ELIMINAR EXPEDIENTE -->
    <v-dialog v-model="showDeleteExpDialog" max-width="450px">
      <v-card class="rounded-lg">
        <v-card-title class="bg-error text-white pa-4">Eliminar Expediente</v-card-title>
        <v-card-text class="pa-4">
          ¿Está seguro que desea eliminar el expediente <strong>{{ expedienteToDelete?.noExpediente }}</strong>?
        </v-card-text>
        <v-card-actions class="pa-3 justify-end">
          <v-btn variant="outlined" color="grey" @click="showDeleteExpDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deletingExp" @click="deleteExpediente">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, reactive, onMounted, onActivated } from 'vue'
import { useSnackbar } from '@/composables/use-snackbar.js'
import RequestHttp from '@/services/requestHttp'
import ExpedienteFormCard from './dialogsCompras/ExpedienteFormCard.vue'
import SubirDocumentoDialog from './dialogsCompras/SubirDocumentoDialog.vue'
import VerDocumentosExpedienteDialog from './dialogsCompras/VerDocumentosExpedienteDialog.vue'

export default {
  name: 'ImportacionesComp',
  components: {
    ExpedienteFormCard,
    SubirDocumentoDialog,
    VerDocumentosExpedienteDialog
  },
  setup() {
    const { snackbar } = useSnackbar()
    const requestHttp = new RequestHttp()

    const currentView = ref('list') // 'list' | 'form'
    const loading = ref(false)
    const search = ref('')
    const selectedQuickFilter = ref('all')

    const expedientes = ref([])
    const proveedores = ref([])
    const navieras = ref([])
    const agenciasAduaneras = ref([])

    const selectedExpediente = ref(null)
    const showSubirDialog = ref(false)
    const showVerDocsDialog = ref(false)

    const showDeleteExpDialog = ref(false)
    const deletingExp = ref(false)
    const expedienteToDelete = ref(null)

    const filtro = reactive({
      idProveedor: null,
      idNaviera: null,
      idAgenciaAduanera: null,
      etaDesde: null,
      etaHasta: null,
      etdDesde: null,
      etdHasta: null
    })

    const headers = [
      { title: 'No. Expediente', key: 'noExpediente', align: 'start' },
      { title: 'Proveedor', key: 'nombreProveedor', align: 'start' },
      { title: 'Embarque / Naviera', key: 'numeroBL', align: 'start' },
      { title: 'Fechas (ETD / ETA)', key: 'etd', align: 'start' },
      { title: 'DUCA / Aduana', key: 'noDUCA', align: 'start' },
      { title: 'Documentos', key: 'totalDocumentos', align: 'center' },
      { title: 'Acciones', key: 'acciones', align: 'center', sortable: false }
    ]

    const loadProveedores = async () => {
      try {
        const [resProv, resNav, resAg] = await Promise.all([
          requestHttp.getProveedores({ tipo: 'Proveedor' }),
          requestHttp.getProveedores({ tipo: 'Naviera' }),
          requestHttp.getProveedores({ tipo: 'Agencia' })
        ])

        proveedores.value = Array.isArray(resProv) ? resProv : (resProv?.data && Array.isArray(resProv.data) ? resProv.data : [])
        navieras.value = Array.isArray(resNav) ? resNav : (resNav?.data && Array.isArray(resNav.data) ? resNav.data : [])
        agenciasAduaneras.value = Array.isArray(resAg) ? resAg : (resAg?.data && Array.isArray(resAg.data) ? resAg.data : [])
      } catch (err) {
        console.error(err)
      }
    }

    const fetchExpedientes = async () => {
      loading.value = true
      try {
        const params = {}
        if (filtro.idProveedor) params.idProveedor = filtro.idProveedor
        if (filtro.idNaviera) params.idNaviera = filtro.idNaviera
        if (filtro.idAgenciaAduanera) params.idAgenciaAduanera = filtro.idAgenciaAduanera
        if (filtro.etaDesde) params.etaDesde = filtro.etaDesde
        if (filtro.etaHasta) params.etaHasta = filtro.etaHasta
        if (filtro.etdDesde) params.etdDesde = filtro.etdDesde
        if (filtro.etdHasta) params.etdHasta = filtro.etdHasta

        const res = await requestHttp.getExpedientesImportacion(params)
        if (res.code === 200 && Array.isArray(res.data)) {
          expedientes.value = res.data
        } else {
          expedientes.value = []
        }
      } catch (err) {
        console.error(err)
        expedientes.value = []
      } finally {
        loading.value = false
      }
    }

    const onQuickFilterChange = (val) => {
      filtro.etaDesde = null
      filtro.etaHasta = null
      filtro.etdDesde = null
      filtro.etdHasta = null

      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()

      if (val === 'etd-mes') {
        const firstDay = new Date(year, month, 1).toISOString().split('T')[0]
        const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0]
        filtro.etdDesde = firstDay
        filtro.etdHasta = lastDay
      } else if (val === 'etd-semana') {
        const curr = new Date()
        const first = curr.getDate() - curr.getDay()
        const last = first + 6
        filtro.etdDesde = new Date(curr.setDate(first)).toISOString().split('T')[0]
        filtro.etdHasta = new Date(curr.setDate(last)).toISOString().split('T')[0]
      } else if (val === 'eta-mes') {
        const firstDay = new Date(year, month, 1).toISOString().split('T')[0]
        const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0]
        filtro.etaDesde = firstDay
        filtro.etaHasta = lastDay
      } else if (val === 'eta-semana') {
        const curr = new Date()
        const first = curr.getDate() - curr.getDay()
        const last = first + 6
        filtro.etaDesde = new Date(curr.setDate(first)).toISOString().split('T')[0]
        filtro.etaHasta = new Date(curr.setDate(last)).toISOString().split('T')[0]
      }

      fetchExpedientes()
    }

    const resetFilters = () => {
      search.value = ''
      selectedQuickFilter.value = 'all'
      filtro.idProveedor = null
      filtro.idNaviera = null
      filtro.idAgenciaAduanera = null
      filtro.etaDesde = null
      filtro.etaHasta = null
      filtro.etdDesde = null
      filtro.etdHasta = null
      fetchExpedientes()
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return 'N/A'
      return dateStr.split('T')[0]
    }

    const openNewExpediente = () => {
      selectedExpediente.value = null
      currentView.value = 'form'
    }

    const editExpediente = (item) => {
      selectedExpediente.value = { ...item }
      currentView.value = 'form'
    }

    const onExpedienteSaved = () => {
      currentView.value = 'list'
      fetchExpedientes()
    }

    const openSubirDocumento = (item) => {
      selectedExpediente.value = item
      showSubirDialog.value = true
    }

    const onDocumentUploaded = () => {
      fetchExpedientes()
    }

    const openVerDocumentos = (item) => {
      selectedExpediente.value = item
      showVerDocsDialog.value = true
    }

    const confirmDeleteExpediente = (item) => {
      expedienteToDelete.value = item
      showDeleteExpDialog.value = true
    }

    const deleteExpediente = async () => {
      if (!expedienteToDelete.value) return
      deletingExp.value = true
      try {
        const res = await requestHttp.deleteExpedienteImportacion(expedienteToDelete.value.idExpedienteImportacion)
        if (res.code === 200) {
          snackbar.value = { show: true, text: 'Expediente eliminado exitosamente', color: 'success' }
          showDeleteExpDialog.value = false
          fetchExpedientes()
        } else {
          snackbar.value = { show: true, text: res.data?.mensaje || 'Error al eliminar expediente', color: 'error' }
        }
      } catch (err) {
        snackbar.value = { show: true, text: 'Error de comunicación con el servidor', color: 'error' }
      } finally {
        deletingExp.value = false
      }
    }

    onActivated(() => {
      loadProveedores()
      fetchExpedientes()
    })

    return {
      currentView,
      loading,
      search,
      selectedQuickFilter,
      expedientes,
      proveedores,
      navieras,
      agenciasAduaneras,
      selectedExpediente,
      showSubirDialog,
      showVerDocsDialog,
      showDeleteExpDialog,
      deletingExp,
      expedienteToDelete,
      filtro,
      headers,
      fetchExpedientes,
      onQuickFilterChange,
      resetFilters,
      formatDate,
      openNewExpediente,
      editExpediente,
      onExpedienteSaved,
      openSubirDocumento,
      onDocumentUploaded,
      openVerDocumentos,
      confirmDeleteExpediente,
      deleteExpediente
    }
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #e65100 0%, #ef6c00 100%);
}
.cursor-pointer {
  cursor: pointer;
}
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
</style>
