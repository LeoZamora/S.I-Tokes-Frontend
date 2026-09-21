<template>
  <div class="w-100">
    <!-- Encabezado y botón de agregar -->
    <v-card class="border-t border-b" elevation="0" rounded="0">
      <!-- Encabezado -->
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <div class="text-h6 font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="indigo">
              mdi-cash-register
            </v-icon>
            Cajas
          </div>
        </div>
      </template>

      <template v-slot:append>
        <v-btn
          v-if="hasAccessToFunct('162')"
          color="indigo-darken-4"
          @click="openCreateDialog()"
          variant="tonal"
          prepend-icon="mdi-plus"
        >
          Nueva Caja
        </v-btn>
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
            v-model="data.search"
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
            @click="loadData"
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
      :headers="data.headers"
      :items="filteredItems"
      :items-per-page="10"
      :search="data.search"
      :loading="data.loading"
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
          v-model="filters.idBodega"
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
          v-model="filters.estado"
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

      <!-- Columna de Acciones (Opciones) -->
      <template v-slot:item.actions="{ item }">
        <v-menu
          :close-on-content-click="false"
          location="right center"
          origin="auto"
        >
          <template v-slot:activator="{ props }">
            <v-tooltip
              text="Opciones"
              location="top"
            >
              <template v-slot:activator="{ props: tooltipProps }">
                <v-btn
                  size="small"
                  icon
                  variant="text"
                  color="grey-darken-1"
                  v-bind="{
                    ...props,
                    ...tooltipProps
                  }"
                  class="hover-scale"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </template>

          <v-list nav rounded="lg">
            <v-list-item-subtitle class="pa-1">
              Opciones
            </v-list-item-subtitle>

            <v-list-item
              rounded
              density="compact"
              prepend-icon="mdi-pencil"
              color="indigo"
              @click="openEditDialog(item)"
            >
              <template v-slot:title>
                <v-divider vertical />
                Editar Caja
              </template>
            </v-list-item>

            <v-list-item
              v-if="isCajaAbierta(item)"
              rounded
              density="compact"
              prepend-icon="mdi-eye-check-outline"
              color="indigo"
              @click="verAperturaVigente(item)"
            >
              <template v-slot:title>
                <v-divider vertical />
                Ver Apertura Vigente
              </template>
            </v-list-item>

            <v-list-item
              rounded
              density="compact"
              prepend-icon="mdi-history"
              color="indigo"
              @click="abrirHistorialCaja(item)"
            >
              <template v-slot:title>
                <v-divider vertical />
                Historial de Sesiones
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <!-- Columna Bodega -->
      <template v-slot:item.bodegaNombre="{ item }">
        <span class="font-weight-medium">{{ item.bodegaNombre || '—' }}</span>
      </template>

      <!-- Columna Nombre (Similar a ClientesComp.vue: Nombre + Código) -->
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

      <!-- Columna Descripción -->
      <template v-slot:item.descripcion="{ item }">
        <span class="text-caption text-grey-darken-1">{{ item.descripcion || '—' }}</span>
      </template>

      <!-- Columna Cajeros Autorizados (Similar a Direcciones en ClientesComp.vue) -->
      <template v-slot:item.cajerosAutorizados="{ item }">
        <v-menu
          v-if="item.cajerosAutorizados && item.cajerosAutorizados.length > 0"
          location="bottom end"
          transition="scale-transition"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ props }">
            <v-chip
              color="teal-darken-3"
              size="small"
              variant="outlined"
              class="font-weight-bold"
              v-bind="props"
              style="cursor: pointer"
            >
              {{ item.cajerosAutorizados.length }}
              {{ item.cajerosAutorizados.length === 1 ? 'cajero' : 'cajeros' }}
              <v-icon size="x-small" class="ml-1">mdi-eye</v-icon>
            </v-chip>
          </template>

          <v-card width="340" class="elevation-4 border rounded-lg">
            <v-card-item class="bg-teal-lighten-5 py-2">
              <v-card-title class="text-subtitle-2 font-weight-bold text-teal-darken-4 d-flex align-center justify-space-between">
                <span class="d-flex align-center">
                  <v-icon size="small" class="mr-1" color="teal">mdi-account-multiple-check</v-icon>
                  Cajeros Autorizados
                </span>
                <v-chip size="x-small" color="teal" variant="flat" max-width="140" class="text-truncate">
                  {{ item.nombre }}
                </v-chip>
              </v-card-title>
            </v-card-item>

            <v-divider></v-divider>

            <v-list density="compact" class="py-1">
              <v-list-item
                v-for="(cajero, idx) in item.cajerosAutorizados"
                :key="idx"
                density="compact"
                class="py-2 border-b"
              >
                <template v-slot:prepend>
                  <v-avatar color="teal-lighten-4" size="30" class="mr-2">
                    <v-icon size="18" color="teal-darken-3">mdi-account</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-caption font-weight-bold text-grey-darken-4">
                  {{ cajero.nombre || cajero.usuario }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption text-grey">
                  Usuario: @{{ cajero.usuario }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip
                    :color="cajero.estado !== false ? 'teal' : 'grey'"
                    size="x-small"
                    variant="flat"
                  >
                    {{ cajero.estado !== false ? 'Activo' : 'Inactivo' }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <span v-else class="text-grey">—</span>
      </template>

      <!-- Columna Fecha Ult. Sesión -->
      <template v-slot:item.fechaUltimaSesion="{ item }">
        <span class="text-caption font-weight-medium">
          {{ formatDate(item.fechaUltimaSesion) }}
        </span>
      </template>

      <!-- Columna Cajero Ult. Sesión -->
      <template v-slot:item.cajeroUltimaSesion="{ item }">
        <div v-if="item.cajeroUltimaSesion || item.cajeroUltimaSesionNombre" class="d-flex align-center">
          <v-avatar size="24" color="indigo-lighten-5" class="mr-2">
            <v-icon size="14" color="indigo-darken-3">mdi-account</v-icon>
          </v-avatar>
          <div>
            <div class="font-weight-bold text-caption text-grey-darken-4">
              {{ item.cajeroUltimaSesionNombre || item.cajeroUltimaSesion }}
            </div>
            <div
              v-if="item.cajeroUltimaSesionNombre && item.cajeroUltimaSesion"
              class="text-caption text-grey font-weight-medium"
              style="font-size: 10px !important; line-height: 1;"
            >
              @{{ item.cajeroUltimaSesion }}
            </div>
          </div>
        </div>
        <span v-else class="text-caption text-grey font-italic">—</span>
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
    </v-data-table>

    <!-- CREATE / EDIT DIALOG -->
    <v-dialog v-model="dialogs.form" max-width="500" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="bg-indigo-darken-4 d-flex align-center py-3 px-4">
          <v-icon class="mr-2">{{ isEditing ? 'mdi-pencil-box' : 'mdi-plus-box' }}</v-icon>
          <span class="text-subtitle-1 font-weight-bold text-white">
            {{ isEditing ? 'Modificar Caja' : 'Registrar Nueva Caja' }}
          </span>
          <v-spacer />
          <v-btn icon size="small" color="white" variant="tonal" @click="closeFormDialog()">
            <v-icon>mdi-close</v-icon>
            <v-tooltip activator="parent" location="top" text="Cerrar" />
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-form ref="formCaja" v-model="formValid">
            <v-row dense>
              <!-- BODEGA -->
              <v-col cols="12" class="py-1">
                <v-select
                  v-model="formData.idBodega"
                  :items="data.bodegasForm"
                  density="compact"
                  variant="outlined"
                  label="Bodega *"
                  placeholder="Seleccione la bodega asignada"
                  prepend-inner-icon="mdi-warehouse"
                  :rules="[v => !!v || 'La bodega es obligatoria']"
                  color="indigo"
                />
              </v-col>

              <!-- NOMBRE -->
              <v-col cols="12" class="py-1">
                <v-text-field
                  v-model="formData.nombre"
                  density="compact"
                  variant="outlined"
                  label="Nombre de la Caja *"
                  placeholder="Ej. Caja Principal"
                  prepend-inner-icon="mdi-cash-register"
                  :rules="[v => !!v || 'El nombre de la caja es obligatorio']"
                  color="indigo"
                  persistent-placeholder
                />
              </v-col>

              <!-- DESCRIPCION -->
              <v-col cols="12" class="py-1">
                <v-textarea
                  v-model="formData.descripcion"
                  rows="2"
                  density="compact"
                  variant="outlined"
                  label="Descripción"
                  placeholder="Observaciones o ubicación de la caja..."
                  prepend-inner-icon="mdi-text-box-outline"
                  color="indigo"
                  persistent-placeholder
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3 bg-grey-lighten-4 d-flex justify-end">
          <v-btn
            variant="outlined"
            color="grey-darken-2"
            @click="closeFormDialog()"
            :disabled="saving"
          >
            Cancelar
          </v-btn>
          <v-btn
            class="bg-indigo-darken-4"
            @click="saveCaja()"
            :loading="saving"
            prepend-icon="mdi-content-save"
            elevation="2"
          >
            {{ isEditing ? 'Guardar Cambios' : 'Registrar Caja' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIÁLOGO: HISTORIAL DE SESIONES / APERTURAS DE LA CAJA -->
    <v-dialog v-model="dialogs.historial" max-width="920" persistent scrollable>
      <v-card class="rounded-lg overflow-hidden elevation-10">
        <!-- Header -->
        <div class="pa-4 bg-indigo-darken-4 text-white d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="38" color="white" class="mr-3" variant="flat">
              <v-icon color="indigo-darken-4" size="22">mdi-history</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold leading-tight">
                Historial de Sesiones / Aperturas
              </div>
              <div class="text-caption text-indigo-lighten-4">
                {{ historialCaja.caja?.nombre }} ({{ historialCaja.caja?.codigo || '—' }}) — Bodega: {{ historialCaja.caja?.bodegaNombre }}
              </div>
            </div>
          </div>
          <v-btn icon color="white" variant="text" size="small" @click="dialogs.historial = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="pa-4 bg-grey-lighten-5">
          <!-- Loader -->
          <div v-if="historialCaja.loading" class="text-center py-8">
            <v-progress-circular indeterminate color="indigo-darken-3" size="48" />
            <div class="text-caption text-grey-darken-1 mt-2">Cargando historial de aperturas...</div>
          </div>

          <!-- Empty state -->
          <v-alert
            v-else-if="historialCaja.items.length === 0"
            type="info"
            variant="tonal"
            class="rounded-lg"
          >
            No se han registrado aperturas o sesiones anteriores para esta caja.
          </v-alert>

          <!-- Tabla de Historial de la Caja -->
          <v-card v-else variant="flat" class="border rounded-lg bg-white overflow-hidden" elevation="0">
            <div class="pa-3 bg-grey-lighten-4 border-b d-flex align-center justify-space-between">
              <span class="text-caption font-weight-bold text-grey-darken-3 text-uppercase">
                Aperturas Registradas ({{ historialCaja.items.length }})
              </span>
            </div>

            <v-data-table
              :headers="headersHistorialCaja"
              :items="historialCaja.items"
              density="compact"
              hover
              items-per-page="10"
              class="font"
              :header-props="{ class: 'font-weight-bold text-uppercase bg-indigo-lighten-5' }"
            >
              <template v-slot:item.codigo="{ item }">
                <span class="font-weight-bold text-indigo-darken-4">{{ item.codigo }}</span>
              </template>

              <template v-slot:item.usuarioAperturaNombre="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="22" color="indigo-lighten-5" class="mr-2">
                    <v-icon size="13" color="indigo-darken-3">mdi-account</v-icon>
                  </v-avatar>
                  <span class="font-weight-medium text-grey-darken-4">
                    {{ item.usuarioAperturaNombre || '—' }}
                  </span>
                </div>
              </template>

              <template v-slot:item.fechaApertura="{ item }">
                <span class="text-caption font-weight-medium">{{ formatDate(item.fechaApertura) }}</span>
              </template>

              <template v-slot:item.montoAperturaEfectivo="{ item }">
                <span class="font-weight-bold text-success">{{ formatCurrency(item.montoAperturaEfectivo) }}</span>
              </template>

              <template v-slot:item.montoAperturaMercaderia="{ item }">
                <span class="font-weight-bold text-blue-grey-darken-2">{{ formatCurrency(item.montoAperturaMercaderia) }}</span>
              </template>

              <template v-slot:item.estado="{ item }">
                <v-chip
                  :color="item.estado ? 'success' : 'blue-grey-darken-1'"
                  size="x-small"
                  variant="flat"
                  class="font-weight-bold text-uppercase"
                >
                  {{ item.estado ? 'Vigente' : 'Cerrada' }}
                </v-chip>
              </template>

              <template v-slot:item.acciones="{ item }">
                <v-btn
                  icon="mdi-receipt-text-outline"
                  size="x-small"
                  color="indigo-darken-3"
                  variant="tonal"
                  title="Ver Comprobante"
                  @click="verDetalleComprobante(item)"
                />
              </template>
            </v-data-table>
          </v-card>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-3 bg-white d-flex justify-end">
          <v-btn color="indigo-darken-3" variant="tonal" class="px-5 font-weight-bold text-none" @click="dialogs.historial = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- APERTURA VIGENTE / DETALLE DIALOG -->
    <v-dialog v-model="dialogs.apertura" max-width="600">
      <v-card class="rounded-lg overflow-hidden elevation-10">
        <v-card-title class="bg-indigo-darken-4 d-flex align-center py-3 px-4 text-white">
          <v-avatar size="32" color="white" class="mr-2" variant="flat">
            <v-icon color="indigo-darken-4" size="18">mdi-receipt-text-check-outline</v-icon>
          </v-avatar>
          <span class="text-subtitle-1 font-weight-bold">
            Comprobante de Apertura - {{ detalleAperturaCaja?.nombre }}
          </span>
          <v-spacer />
          <v-btn icon size="small" color="white" variant="text" @click="dialogs.apertura = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4 bg-grey-lighten-5">
          <div v-if="loadingApertura" class="text-center py-6">
            <v-progress-circular indeterminate color="indigo-darken-3" />
            <div class="text-caption text-grey mt-2">Cargando datos de apertura...</div>
          </div>

          <div v-else-if="detalleApertura">
            <v-card variant="flat" class="pa-3 rounded-lg border bg-white mb-2" elevation="0">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <span class="text-caption text-grey font-weight-bold">CÓDIGO APERTURA:</span>
                  <div class="text-body-2 font-weight-bold text-indigo-darken-4">
                    {{ detalleApertura.codigo || '—' }}
                  </div>
                </v-col>

                <v-col cols="12" sm="6">
                  <span class="text-caption text-grey font-weight-bold">ESTADO:</span>
                  <div>
                    <v-chip
                      :color="detalleApertura.estado ? 'success' : 'blue-grey-darken-1'"
                      size="x-small"
                      variant="flat"
                      class="font-weight-bold text-uppercase"
                    >
                      {{ detalleApertura.estado ? 'VIGENTE / ACTIVA' : 'CERRADA' }}
                    </v-chip>
                  </div>
                </v-col>

                <v-col cols="12" sm="6" class="mt-2">
                  <span class="text-caption text-grey font-weight-bold">CAJERO RESPONSABLE:</span>
                  <div class="text-body-2 font-weight-medium text-grey-darken-4 d-flex align-center">
                    <v-icon size="x-small" color="indigo" class="mr-1">mdi-account</v-icon>
                    {{ detalleApertura.usuarioAperturaNombre || detalleApertura.usuarioApertura || '—' }}
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
                    <span class="text-caption text-green-darken-4 font-weight-bold d-block">FONDO EFECTIVO:</span>
                    <span class="text-subtitle-1 font-weight-black text-green-darken-4">
                      {{ formatCurrency(detalleApertura.montoAperturaEfectivo) }}
                    </span>
                  </div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="pa-2 bg-indigo-lighten-5 rounded border border-indigo-lighten-3">
                    <span class="text-caption text-indigo-darken-4 font-weight-bold d-block">VALOR MERCADERÍA:</span>
                    <span class="text-subtitle-1 font-weight-black text-indigo-darken-4">
                      {{ formatCurrency(detalleApertura.montoAperturaMercaderia) }}
                    </span>
                  </div>
                </v-col>

                <v-col cols="12" class="mt-2" v-if="detalleApertura.observaciones || detalleApertura.observacion">
                  <span class="text-caption text-grey font-weight-bold">OBSERVACIONES:</span>
                  <div class="text-caption pa-2 bg-grey-lighten-4 rounded mt-1 text-grey-darken-3">
                    {{ detalleApertura.observaciones || detalleApertura.observacion }}
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </div>

          <div v-else class="text-center py-4 text-grey">
            No hay apertura vigente registrada para esta caja.
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3 bg-white d-flex justify-end">
          <v-btn variant="tonal" color="indigo-darken-3" class="font-weight-bold px-4" @click="dialogs.apertura = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SUCCESS ALERT TOAST -->
    <SuccessAlert
      :success="data.alertSuccess.success"
      :msg="data.alertSuccess.msg"
      :show="data.alertSuccess.show"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onActivated } from 'vue'
import { formatters } from '@/helpers/formatters'
import RequestHttp from '@/services/requestHttp'
import { useStore } from '@/store'
import SuccessAlert from '@/components/widgets/SuccessAlert.vue'
import { hasAccessToFunct } from '@/scripts/Seguridad.js'

export default {
  name: 'CajasModule',

  components: {
    SuccessAlert
  },

  setup() {
    const store = useStore()
    const requestHttp = new RequestHttp()

    const formValid = ref(false)
    const isEditing = ref(false)
    const saving = ref(false)
    const loadingApertura = ref(false)
    const detalleApertura = ref(null)
    const detalleAperturaCaja = ref(null)

    const dialogs = reactive({
      form: false,
      apertura: false,
      historial: false
    })

    const headersHistorialCaja = [
      { title: 'Código Apertura', key: 'codigo', align: 'start' },
      { title: 'Cajero Responsable', key: 'usuarioAperturaNombre', align: 'start' },
      { title: 'Fecha y Hora', key: 'fechaApertura', align: 'start' },
      { title: 'Fondo Inicial Efectivo', key: 'montoAperturaEfectivo', align: 'end' },
      { title: 'Valor Mercadería', key: 'montoAperturaMercaderia', align: 'end' },
      { title: 'Estado', key: 'estado', align: 'center' },
      { title: 'Acción', key: 'acciones', align: 'center', sortable: false }
    ]

    const historialCaja = reactive({
      caja: null,
      items: [],
      loading: false
    })

    const formData = reactive({
      idCaja: null,
      idBodega: null,
      nombre: '',
      descripcion: '',
      idEstadoActual: null
    })

    const filters = reactive({
      idBodega: null,
      estado: null
    })

    const estadosOptions = [
      { title: 'Aperturadas', value: 'aperturadas' },
      { title: 'Arqueadas', value: 'arqueadas' },
      { title: 'Cerradas', value: 'cerradas' }
    ]

    const getEstadoChip = (caja) => {
      const nombre = (caja?.estadoNombre || '').toLowerCase().trim()
      if (nombre.includes('aperturad') || nombre.includes('abiert')) {
        return {
          color: 'green-darken-3',
          text: caja.estadoNombre || 'Aperturada',
          icon: 'mdi-lock-open-variant',
          variant: 'flat'
        }
      }
      if (nombre.includes('arquead')) {
        return {
          color: 'amber-darken-3',
          text: caja.estadoNombre || 'Arqueada',
          icon: 'mdi-scale-balance',
          variant: 'flat'
        }
      }
      if (nombre.includes('cerrad')) {
        return {
          color: 'blue-grey-darken-1',
          text: caja.estadoNombre || 'Cerrada',
          icon: 'mdi-lock',
          variant: 'flat'
        }
      }
      if (nombre.includes('inactiv') || nombre.includes('bloquead') || nombre.includes('cancelad')) {
        return {
          color: 'red-darken-3',
          text: caja.estadoNombre || 'Inactiva',
          icon: 'mdi-alert-circle-outline',
          variant: 'flat'
        }
      }
      return {
        color: 'indigo-darken-2',
        text: caja?.estadoNombre || 'Desconocido',
        icon: 'mdi-information-outline',
        variant: 'flat'
      }
    }

    const data = reactive({
      headers: [
        {
          title: '',
          key: 'actions',
          sortable: false,
          align: 'center',
          headerProps: {
            class: 'pa-0'
          },
          cellProps: {
            class: 'pa-0'
          }
        },
        { title: 'Bodega', key: 'bodegaNombre', align: 'center', sortable: false },
        { title: 'Nombre', key: 'nombre', align: 'start' },
        { title: 'Descripción', key: 'descripcion', align: 'start' },
        { title: 'Cajeros Autorizados', key: 'cajerosAutorizados', align: 'center', sortable: false },
        { title: 'Fecha Ult. Sesión', key: 'fechaUltimaSesion', align: 'center' },
        { title: 'Cajero Ult. Sesión', key: 'cajeroUltimaSesion', align: 'start', sortable: false },
        { title: 'Estado', key: 'estadoNombre', align: 'center', sortable: false },
      ],
      items: [],
      bodegas: [],
      bodegasForm: [],
      search: '',
      loading: false,
      alertSuccess: {
        show: false,
        msg: '',
        success: false
      }
    })

    const bodegasOptions = computed(() => {
      return data.bodegas.map(b => ({ title: b.nombre, value: b.idBodega }))
    })

    const isCajaAbierta = (caja) => {
      if (!caja || !caja.estadoNombre) return false
      const nombre = caja.estadoNombre.toLowerCase()
      return nombre.includes('abiert') || nombre.includes('aperturad') || nombre.includes('arquead')
    }

    const filteredItems = computed(() => {
      let list = [...data.items]

      if (filters.idBodega !== null && filters.idBodega !== undefined) {
        list = list.filter(c => c.idBodega === filters.idBodega)
      }

      if (filters.estado !== null && filters.estado !== undefined) {
        if (filters.estado === 'aperturadas' || filters.estado === 'abiertas') {
          list = list.filter(c => {
            const nom = (c.estadoNombre || '').toLowerCase()
            return nom.includes('abiert') || nom.includes('aperturad')
          })
        } else if (filters.estado === 'arqueadas') {
          list = list.filter(c => (c.estadoNombre || '').toLowerCase().includes('arquead'))
        } else if (filters.estado === 'cerradas') {
          list = list.filter(c => (c.estadoNombre || '').toLowerCase().includes('cerrad'))
        }
      }

      return list.sort((a, b) => {
        const codA = a.codigo || ''
        const codB = b.codigo || ''
        return codB.localeCompare(codA, undefined, { numeric: true, sensitivity: 'base' })
      })
    })

    const showSuccesAlert = (msg, success = true) => {
      data.alertSuccess.msg = msg
      data.alertSuccess.show = true
      data.alertSuccess.success = success
      setTimeout(() => {
        data.alertSuccess.show = false
        data.alertSuccess.msg = ''
      }, 2000)
    }

    const loadData = async () => {
      data.loading = true
      try {
        // Cargar bodegas
        const resBodegas = await requestHttp.getBodegas()
        if (resBodegas.code === 200 && Array.isArray(resBodegas.data)) {
          data.bodegas = resBodegas.data
          data.bodegasForm = resBodegas.data.map(b => ({ title: b.nombre, value: b.idBodega }))
        }

        // Cargar cajas
        const resCajas = await requestHttp.getCajas()
        if (resCajas.code === 200 && Array.isArray(resCajas.data)) {
          data.items = resCajas.data.sort((a, b) => {
            const codA = a.codigo || ''
            const codB = b.codigo || ''
            return codB.localeCompare(codA, undefined, { numeric: true, sensitivity: 'base' })
          })
        } else {
          data.items = []
        }
      } catch (err) {
        console.error('Error cargando cajas:', err)
      } finally {
        data.loading = false
      }
    }

    onActivated(() => {
      loadData()
    })

    const formatDate = (dateString) => {
      if (!dateString) return '—'
      return formatters.formatDate(dateString)
    }

    const formatCurrency = (val) => {
      return formatters.formatCurrency(val || 0, 'NIO')
    }

    const setStyle = ({ index }) => {
      return {
        class: index % 2 === 0 ? 'bg-white' : 'bg-indigo-lighten-5'
      }
    }

    const openCreateDialog = () => {
      isEditing.value = false
      formData.idCaja = null
      formData.idBodega = data.bodegasForm.length > 0 ? data.bodegasForm[0].value : null
      formData.nombre = ''
      formData.descripcion = ''
      formData.idEstadoActual = null
      dialogs.form = true
    }

    const openEditDialog = (item) => {
      isEditing.value = true
      formData.idCaja = item.idCaja
      formData.idBodega = item.idBodega
      formData.nombre = item.nombre || ''
      formData.descripcion = item.descripcion || ''
      formData.idEstadoActual = item.idEstadoActual
      dialogs.form = true
    }

    const closeFormDialog = () => {
      dialogs.form = false
    }

    const saveCaja = async () => {
      if (!formData.nombre || formData.nombre.trim() === '') {
        alert('Ingrese el nombre de la caja.')
        return
      }
      if (!formData.idBodega) {
        alert('Seleccione una bodega.')
        return
      }

      saving.value = true
      try {
        const username = store.getNameUser() || 'Admin'

        if (isEditing.value) {
          const updatePayload = {
            idBodega: formData.idBodega,
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion || null,
            usuarioUltMod: username,
            idEstadoActual: formData.idEstadoActual
          }

          const res = await requestHttp.putCaja(formData.idCaja, updatePayload)
          if (res.code === 200) {
            showSuccesAlert('Caja modificada correctamente.', true)
            closeFormDialog()
            loadData()
          } else {
            const errorMsg = res.data?.msg || 'No se pudo modificar la caja.'
            alert(errorMsg)
          }
        } else {
          const createPayload = {
            idBodega: formData.idBodega,
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion || null,
            usuarioRegistro: username
          }

          const res = await requestHttp.postCaja(createPayload)
          if (res.code === 200) {
            showSuccesAlert('Caja registrada correctamente.', true)
            closeFormDialog()
            loadData()
          } else {
            const errorMsg = res.data?.msg || 'No se pudo registrar la caja.'
            alert(errorMsg)
          }
        }
      } catch (err) {
        alert('Ocurrió un error al procesar la solicitud.')
      } finally {
        saving.value = false
      }
    }

    const verAperturaVigente = async (caja) => {
      detalleAperturaCaja.value = caja
      detalleApertura.value = null
      dialogs.apertura = true
      loadingApertura.value = true

      try {
        const res = await requestHttp.getCajaAperturaVigente(caja.idCaja)
        if (res.code === 200 && res.data) {
          detalleApertura.value = res.data
        }
      } catch (err) {
        console.error('Error cargando apertura vigente:', err)
      } finally {
        loadingApertura.value = false
      }
    }

    const abrirHistorialCaja = async (caja) => {
      historialCaja.caja = caja
      historialCaja.items = []
      historialCaja.loading = true
      dialogs.historial = true

      try {
        const res = await requestHttp.getAperturasByCaja(caja.idCaja)
        if (res.code === 200 && Array.isArray(res.data)) {
          historialCaja.items = res.data
        }
      } catch (err) {
        console.error('Error cargando historial de la caja:', err)
      } finally {
        historialCaja.loading = false
      }
    }

    const verDetalleComprobante = (apertura) => {
      detalleAperturaCaja.value = historialCaja.caja || { nombre: apertura.cajaNombre }
      detalleApertura.value = apertura
      dialogs.apertura = true
    }

    return {
      data,
      filters,
      bodegasOptions,
      estadosOptions,
      filteredItems,
      formValid,
      isEditing,
      saving,
      dialogs,
      formData,
      detalleApertura,
      detalleAperturaCaja,
      loadingApertura,
      isCajaAbierta,
      formatDate,
      formatCurrency,
      setStyle,
      loadData,
      openCreateDialog,
      openEditDialog,
      closeFormDialog,
      saveCaja,
      verAperturaVigente,
      getEstadoChip,
      headersHistorialCaja,
      historialCaja,
      abrirHistorialCaja,
      verDetalleComprobante,
      hasAccessToFunct
    }
  }
}
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
