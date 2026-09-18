<template>
  <div>
    <v-dialog
      v-model="localShow"
      max-width="1000"
      persistent
      scrollable
    >
      <v-card class="rounded-lg">
        <!-- Header -->
        <v-card-title class="d-flex align-center justify-space-between bg-indigo-darken-4 text-white py-3 px-4">
          <div class="d-flex align-center">
            <v-avatar size="36" color="white" class="me-3">
              <v-icon color="indigo-darken-4" size="22">mdi-warehouse-plus</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">Asignación de Producto a Bodegas</div>
              <div class="text-caption text-indigo-lighten-4">
                Consulta de asignaciones actuales y registro en nuevas bodegas
              </div>
            </div>
          </div>
          <v-btn
            variant="text"
            icon
            size="small"
            color="white"
            @click="closeModal"
            :disabled="saving"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <!-- Product Banner Summary -->
        <div class="bg-indigo-lighten-5 px-4 py-3 border-b">
          <v-row dense align="center">
            <v-col cols="12" md="7">
              <div class="d-flex align-center">
                <v-chip
                  v-if="producto?.codigo"
                  size="small"
                  color="indigo-darken-3"
                  variant="flat"
                  class="font-weight-bold mr-2"
                >
                  {{ producto.codigo }}
                </v-chip>
                <span class="text-subtitle-2 font-weight-bold text-grey-darken-3 text-truncate">
                  {{ producto?.nombre || 'Producto no seleccionado' }}
                </span>
              </div>
              <div class="text-caption text-grey-darken-1 mt-1 d-flex flex-wrap align-center">
                <span v-if="producto?.categoria" class="mr-3">
                  <v-icon size="14" class="mr-1">mdi-folder-outline</v-icon>
                  {{ producto.categoria }}
                </span>
                <span v-if="producto?.unidadMedida" class="mr-3">
                  <v-icon size="14" class="mr-1">mdi-scale-balance</v-icon>
                  U/M: {{ producto.unidadMedida }}
                </span>
                <span v-if="producto?.costo !== undefined">
                  <v-icon size="14" class="mr-1">mdi-currency-usd</v-icon>
                  Costo: {{ formatCurrency(producto.costo) }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="5" class="d-flex justify-md-end align-center mt-2 mt-md-0">
              <v-chip
                size="small"
                color="indigo"
                variant="outlined"
                class="font-weight-bold mr-2"
              >
                Stock Global Actual: {{ Number(producto?.cantidadTotal || 0) }}
              </v-chip>
              <v-chip
                size="small"
                color="orange-darken-3"
                variant="outlined"
                class="font-weight-bold"
              >
                Mínimo Global: {{ Number(producto?.cantidadMinima || 0) }}
              </v-chip>
            </v-col>
          </v-row>
        </div>

        <v-card-text class="pa-4">
          <!-- Loading State -->
          <div v-if="loading" class="d-flex flex-column align-center justify-center py-8">
            <v-progress-circular indeterminate color="indigo" size="40" class="mb-3" />
            <div class="text-caption text-grey-darken-1 font-weight-medium">
              Consultando asignaciones y bodegas disponibles...
            </div>
          </div>

          <div v-else>
            <!-- Error Alert -->
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              density="compact"
              closable
              class="mb-3 text-caption"
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <!-- SECCIÓN 1: BODEGAS YA ASIGNADAS -->
            <v-card variant="outlined" class="rounded-lg border mb-4 overflow-hidden">
              <div class="d-flex align-center justify-space-between bg-grey-lighten-4 px-3 py-2 border-b">
                <div class="d-flex align-center">
                  <v-icon size="18" color="success" class="mr-2">mdi-check-decagram</v-icon>
                  <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                    Bodegas Actualmente Asignadas ({{ bodegasAsignadas.length }})
                  </span>
                </div>
                <v-chip
                  size="x-small"
                  :color="bodegasAsignadas.length > 0 ? 'success' : 'grey'"
                  variant="flat"
                  class="font-weight-bold"
                >
                  {{ bodegasAsignadas.length }} de {{ todasBodegas.length }} bodegas
                </v-chip>
              </div>

              <!-- Lista / Tabla de Bodegas Asignadas -->
              <div v-if="bodegasAsignadas.length > 0" class="pa-0">
                <v-table density="compact" class="elevation-0">
                  <thead>
                    <tr class="text-caption font-weight-bold text-grey-darken-2 bg-grey-lighten-5">
                      <th class="text-start">Bodega</th>
                      <th class="text-start">Tipo</th>
                      <th class="text-center">Stock Actual en Bodega</th>
                      <th class="text-center">Stock Mínimo</th>
                      <th class="text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="b in bodegasAsignadas" :key="b.idBodega">
                      <td class="py-2">
                        <div class="d-flex align-center">
                          <v-icon size="18" :color="getBodegaIconColor(b)" class="mr-2">
                            {{ getBodegaIcon(b) }}
                          </v-icon>
                          <div>
                            <span class="font-weight-medium text-body-2">
                              {{ b.codigo ? `[${b.codigo}] ` : '' }}{{ b.nombre }}
                            </span>
                            <div v-if="b.sucursalNombre || b.placaCamion" class="text-caption text-grey">
                              {{ b.sucursalNombre ? `Sucursal: ${b.sucursalNombre}` : '' }}
                              {{ b.placaCamion ? `Placa: ${b.placaCamion}` : '' }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="py-2 text-caption">
                        <v-chip size="x-small" variant="outlined" color="indigo">
                          {{ b.tipoBodegaNombre || (b.tipoBodegaCodigo === 'SUC' ? 'Sucursal' : 'Bodega') }}
                        </v-chip>
                      </td>
                      <td class="py-2 text-center">
                        <v-chip
                          size="small"
                          :color="b.cantidadTotal > 10 ? 'success' : b.cantidadTotal > 0 ? 'orange-darken-3' : 'error'"
                          variant="flat"
                          class="font-weight-bold"
                        >
                          {{ b.cantidadTotal }} {{ producto?.unidadMedida || 'Und.' }}
                        </v-chip>
                      </td>
                      <td class="py-2 text-center text-body-2 font-weight-medium">
                        {{ b.cantidadMinima ?? 0 }}
                      </td>
                      <td class="py-2 text-center">
                        <v-chip size="x-small" color="success" variant="tonal" class="font-weight-bold">
                          <v-icon start size="12">mdi-check</v-icon>
                          Asignado
                        </v-chip>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>

              <!-- Empty state si no está asignado a ninguna bodega -->
              <div v-else class="pa-4 text-center text-grey-darken-1 text-body-2">
                <v-icon size="28" color="grey-lighten-1" class="mb-1">mdi-warehouse-off</v-icon>
                <div>Este producto aún no está vinculado a ninguna bodega.</div>
              </div>
            </v-card>

            <!-- SECCIÓN 2: ASIGNAR A NUEVAS BODEGAS -->
            <v-card variant="outlined" class="rounded-lg border mb-3 overflow-hidden">
              <div class="d-flex align-center justify-space-between bg-grey-lighten-4 px-3 py-2 border-b">
                <div class="d-flex align-center">
                  <v-icon size="18" color="indigo" class="mr-2">mdi-store-plus</v-icon>
                  <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                    Asignar a Nuevas Bodegas (Disponibles: {{ bodegasDisponiblesParaAsignar.length }})
                  </span>
                </div>
                <v-btn
                  size="small"
                  variant="tonal"
                  color="indigo"
                  prepend-icon="mdi-plus"
                  class="text-none font-weight-bold"
                  @click="addRow"
                  :disabled="saving || bodegasDisponiblesParaAsignar.length === 0 || rows.length >= bodegasDisponiblesParaAsignar.length"
                >
                  Agregar Bodega
                </v-btn>
              </div>

              <!-- Banner si ya están todas asignadas -->
              <div v-if="bodegasDisponiblesParaAsignar.length === 0" class="pa-4 text-center">
                <v-alert
                  type="success"
                  variant="tonal"
                  density="compact"
                  icon="mdi-check-all"
                  class="text-caption font-weight-medium rounded-lg mb-0"
                >
                  ¡El producto ya se encuentra asignado a todas las bodegas activas del sistema ({{ bodegasAsignadas.length }} de {{ todasBodegas.length }})! No hay bodegas pendientes por asignar.
                </v-alert>
              </div>

              <!-- Tabla de nuevas asignaciones -->
              <div v-else class="pa-2">
                <v-table density="compact" class="elevation-0">
                  <thead>
                    <tr class="text-caption font-weight-bold text-grey-darken-2">
                      <th style="min-width: 240px;" class="text-start">Bodega a Asignar *</th>
                      <th style="width: 140px;" class="text-center">Cant. Inicial</th>
                      <th style="width: 130px;" class="text-center">Stock Mínimo</th>
                      <th style="min-width: 180px;" class="text-start">Observaciones</th>
                      <th style="width: 50px;" class="text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in rows" :key="index" class="align-top">
                      <!-- Bodega selector -->
                      <td class="py-2">
                        <v-autocomplete
                          v-model="row.idBodega"
                          :items="getFilteredBodegasForRow(index)"
                          item-title="label"
                          item-value="idBodega"
                          density="compact"
                          variant="outlined"
                          hide-details="auto"
                          :rules="[v => !!v || 'Seleccione una bodega']"
                          placeholder="Seleccione bodega disponible..."
                          color="indigo"
                          class="text-body-2"
                        >
                          <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" density="compact">
                              <template v-slot:prepend>
                                <v-icon size="18" :color="getBodegaIconColor(item.raw)">
                                  {{ getBodegaIcon(item.raw) }}
                                </v-icon>
                              </template>
                              <template v-slot:title>
                                <div class="text-body-2 font-weight-medium">
                                  {{ item.raw.nombre }}
                                </div>
                              </template>
                              <template v-slot:subtitle>
                                <div class="text-caption text-grey">
                                  {{ item.raw.tipoBodegaNombre || (item.raw.tipoBodegaCodigo === 'SUC' ? 'Sucursal' : 'Bodega') }}
                                  <span v-if="item.raw.sucursalNombre"> - {{ item.raw.sucursalNombre }}</span>
                                  <span v-if="item.raw.placaCamion"> (Placa: {{ item.raw.placaCamion }})</span>
                                </div>
                              </template>
                            </v-list-item>
                          </template>

                          <template v-slot:selection="{ item }">
                            <div class="d-flex align-center text-truncate">
                              <v-icon size="16" class="mr-1" :color="getBodegaIconColor(item.raw)">
                                {{ getBodegaIcon(item.raw) }}
                              </v-icon>
                              <span class="text-body-2 font-weight-medium text-truncate">
                                {{ item.raw.nombre }}
                              </span>
                            </div>
                          </template>
                        </v-autocomplete>
                      </td>

                      <!-- Cantidad Inicial -->
                      <td class="py-2">
                        <v-text-field
                          v-model.number="row.cantidadInicial"
                          type="number"
                          min="0"
                          step="1"
                          density="compact"
                          variant="outlined"
                          hide-details="auto"
                          placeholder="0"
                          color="indigo"
                          class="text-body-2"
                          prepend-inner-icon="mdi-numeric"
                          :rules="[v => v >= 0 || '>= 0']"
                        />
                      </td>

                      <!-- Stock Mínimo -->
                      <td class="py-2">
                        <v-text-field
                          v-model.number="row.cantidadMinima"
                          type="number"
                          min="0"
                          step="1"
                          density="compact"
                          variant="outlined"
                          hide-details="auto"
                          placeholder="0"
                          color="indigo"
                          class="text-body-2"
                          :rules="[v => v >= 0 || '>= 0']"
                        />
                      </td>

                      <!-- Observaciones -->
                      <td class="py-2">
                        <v-text-field
                          v-model="row.observaciones"
                          density="compact"
                          variant="outlined"
                          hide-details
                          placeholder="Notas u observaciones..."
                          color="indigo"
                          class="text-body-2"
                        />
                      </td>

                      <!-- Delete button -->
                      <td class="py-2 text-center align-middle">
                        <v-btn
                          icon
                          size="x-small"
                          variant="text"
                          color="error"
                          @click="removeRow(index)"
                          :disabled="rows.length <= 1"
                        >
                          <v-icon size="18">mdi-trash-can-outline</v-icon>
                          <v-tooltip activator="parent" location="top">Quitar fila</v-tooltip>
                        </v-btn>
                      </td>
                    </tr>

                    <tr v-if="rows.length === 0">
                      <td colspan="5" class="text-center text-grey py-4">
                        No hay nuevas bodegas agregadas para asignar. Haga clic en <strong>Agregar Bodega</strong>.
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-card>

            <!-- Projected Stock Summary Card (solo si hay filas activas) -->
            <v-card v-if="bodegasDisponiblesParaAsignar.length > 0" class="pa-3 bg-grey-lighten-4 border rounded-lg" elevation="0">
              <v-row dense align="center">
                <v-col cols="12" sm="4">
                  <div class="text-caption text-grey-darken-1">Nuevas bodegas a vincular:</div>
                  <div class="text-subtitle-2 font-weight-bold text-indigo-darken-3">
                    {{ validRowsCount }} {{ validRowsCount === 1 ? 'bodega seleccionada' : 'bodegas seleccionadas' }}
                  </div>
                </v-col>

                <v-col cols="12" sm="4">
                  <div class="text-caption text-grey-darken-1">Total stock nuevo a ingresar:</div>
                  <div class="text-subtitle-2 font-weight-bold text-green-darken-3">
                    + {{ totalCantidadInicial }} {{ producto?.unidadMedida || 'Unid.' }}
                  </div>
                </v-col>

                <v-col cols="12" sm="4">
                  <div class="text-caption text-grey-darken-1">Nuevo Stock Global Proyectado:</div>
                  <div class="text-subtitle-2 font-weight-bold text-blue-darken-4">
                    {{ nuevoStockGlobal }} {{ producto?.unidadMedida || 'Unid.' }}
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-card-text>

        <v-divider />

        <!-- Footer Actions -->
        <v-card-actions class="px-4 py-3 bg-white d-flex justify-space-between align-center">
          <div class="text-caption text-grey">
            {{ bodegasDisponiblesParaAsignar.length === 0 ? 'No hay bodegas pendientes por asignar' : '* Complete los datos de la bodega a asignar' }}
          </div>
          <div class="d-flex align-center">
            <v-btn
              color="grey-darken-1"
              variant="outlined"
              @click="closeModal"
              :disabled="saving"
              class="mr-2 text-none font-weight-bold"
            >
              {{ bodegasDisponiblesParaAsignar.length === 0 ? 'Cerrar' : 'Cancelar' }}
            </v-btn>
            <v-btn
              v-if="bodegasDisponiblesParaAsignar.length > 0"
              color="indigo-darken-4"
              variant="elevated"
              @click="guardarAsignaciones"
              :loading="saving"
              :disabled="saving || validRowsCount === 0"
              prepend-icon="mdi-content-save-check"
              class="text-none font-weight-bold"
            >
              Guardar Asignaciones
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Resultado / Confirmación Detallada -->
    <v-dialog v-model="showResultModal" max-width="650" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="bg-success text-white py-3 px-4 d-flex align-center">
          <v-icon color="white" class="mr-2">mdi-check-circle</v-icon>
          <span class="text-subtitle-1 font-weight-bold">¡Asignación Exitosa!</span>
          <v-spacer />
          <v-btn icon size="small" variant="text" color="white" @click="cerrarResultado">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <div class="text-body-2 mb-3">
            El producto <strong>{{ resultData?.nombre || producto?.nombre }}</strong> ha sido asignado correctamente a las bodegas especificadas.
          </div>

          <v-table density="compact" class="border rounded mb-3">
            <thead>
              <tr class="bg-grey-lighten-4 text-caption font-weight-bold">
                <th>Bodega</th>
                <th class="text-center">Stock Anterior</th>
                <th class="text-center">Ingresado</th>
                <th class="text-center">Stock Actual Bodega</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in resultData?.asignaciones || []" :key="idx">
                <td class="font-weight-medium text-body-2">
                  {{ item.bodegaNombre }}
                </td>
                <td class="text-center text-body-2">
                  {{ item.stockAnteriorBodega }}
                </td>
                <td class="text-center font-weight-bold text-success text-body-2">
                  + {{ item.cantidadIngresada }}
                </td>
                <td class="text-center font-weight-bold text-indigo-darken-3 text-body-2">
                  {{ item.stockActualBodega }}
                </td>
              </tr>
            </tbody>
          </v-table>

          <div class="d-flex justify-space-between align-center pa-2 bg-indigo-lighten-5 rounded">
            <span class="text-caption font-weight-bold text-indigo-darken-4">
              Nuevo Stock Global General:
            </span>
            <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">
              {{ resultData?.cantidadTotalGeneral ?? nuevoStockGlobal }}
            </span>
          </div>
        </v-card-text>

        <v-card-actions class="px-4 py-3 justify-end bg-grey-lighten-5 border-t">
          <v-btn
            color="indigo-darken-4"
            variant="elevated"
            class="text-none font-weight-bold"
            @click="cerrarResultado"
          >
            Aceptar y Continuar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import RequestHttp from '@/services/requestHttp'

export default {
  name: 'AsignarBodegasProducto',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    producto: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['closeDialog', 'asignado'],

  setup(props, { emit }) {
    const requestHttp = new RequestHttp()
    const localShow = ref(props.show)
    const loading = ref(false)
    const saving = ref(false)
    const errorMessage = ref('')
    const todasBodegas = ref([])
    const bodegasAsignadas = ref([])
    const rows = ref([])
    const showResultModal = ref(false)
    const resultData = ref(null)

    const formatCurrency = (val) => {
      if (val === null || val === undefined) return 'C$ 0.00'
      return `C$ ${Number(val).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const loadData = async () => {
      if (!props.producto?.idProducto) return
      loading.value = true
      errorMessage.value = ''
      todasBodegas.value = []
      bodegasAsignadas.value = []

      try {
        // 1. Obtener todas las bodegas activas
        const resBodegas = await requestHttp.getBodegasCombobox()
        let listaBodegas = []
        if (resBodegas && resBodegas.code === 200 && Array.isArray(resBodegas.data)) {
          listaBodegas = resBodegas.data.map(b => ({
            idBodega: b.idBodega || b.id,
            id: b.idBodega || b.id,
            nombre: b.nombre,
            codigo: b.codigo,
            tipoBodegaCodigo: b.tipoBodegaCodigo,
            tipoBodegaNombre: b.tipoBodegaNombre,
            sucursalNombre: b.sucursalNombre,
            placaCamion: b.placaCamion,
            label: b.codigo ? `[${b.codigo}] ${b.nombre}` : b.nombre
          }))
        }
        todasBodegas.value = listaBodegas

        // 2. Consultar productos por bodega en paralelo para verificar si el producto ya está asignado
        const idProd = props.producto.idProducto
        const checkPromises = listaBodegas.map(async (b) => {
          try {
            const resProd = await requestHttp.getProductosPorBodega(b.idBodega, false)
            if (resProd && resProd.code === 200 && Array.isArray(resProd.data)) {
              const match = resProd.data.find(p => p.idProducto === idProd)
              if (match) {
                return {
                  ...b,
                  cantidadTotal: match.cantidadTotal ?? match.cantidadTotalBodega ?? 0,
                  cantidadMinima: match.cantidadMinima ?? 0,
                  idStockBodega: match.idStockBodega
                }
              }
            }
          } catch (e) {
            console.error(`Error al consultar productos para bodega ${b.idBodega}:`, e)
          }
          return null
        })

        const results = await Promise.all(checkPromises)
        bodegasAsignadas.value = results.filter(Boolean)

        // 3. Inicializar filas para asignación
        resetRows()
      } catch (err) {
        console.error('Error al cargar bodegas asignadas:', err)
        errorMessage.value = 'No se pudieron cargar las bodegas del sistema.'
      } finally {
        loading.value = false
      }
    }

    const getBodegaIcon = (b) => {
      if (!b) return 'mdi-warehouse'
      if (b.tipoBodegaCodigo === 'CAM' || b.placaCamion) return 'mdi-truck'
      if (b.tipoBodegaCodigo === 'SUC' || b.sucursalNombre) return 'mdi-store'
      return 'mdi-warehouse'
    }

    const getBodegaIconColor = (b) => {
      if (!b) return 'indigo'
      if (b.tipoBodegaCodigo === 'CAM' || b.placaCamion) return 'teal'
      if (b.tipoBodegaCodigo === 'SUC' || b.sucursalNombre) return 'indigo-darken-3'
      return 'blue-grey'
    }

    // Bodegas que NO están asignadas todavía al producto
    const bodegasDisponiblesParaAsignar = computed(() => {
      const idsAsignadas = bodegasAsignadas.value.map(b => b.idBodega)
      return todasBodegas.value.filter(b => !idsAsignadas.includes(b.idBodega))
    })

    const resetRows = () => {
      const defaultMin = Number(props.producto?.cantidadMinima || 0)
      if (bodegasDisponiblesParaAsignar.value.length > 0) {
        rows.value = [
          {
            idBodega: null,
            cantidadInicial: 0,
            cantidadMinima: defaultMin,
            observaciones: ''
          }
        ]
      } else {
        rows.value = []
      }
      errorMessage.value = ''
    }

    const addRow = () => {
      if (rows.value.length >= bodegasDisponiblesParaAsignar.value.length) return
      const defaultMin = Number(props.producto?.cantidadMinima || 0)
      rows.value.push({
        idBodega: null,
        cantidadInicial: 0,
        cantidadMinima: defaultMin,
        observaciones: ''
      })
    }

    const removeRow = (index) => {
      if (rows.value.length > 1) {
        rows.value.splice(index, 1)
      }
    }

    // Filtra las bodegas disponibles para una fila específica (excluye ya asignadas y seleccionadas en otras filas)
    const getFilteredBodegasForRow = (currentRowIndex) => {
      const selectedOtherRows = rows.value
        .filter((_, idx) => idx !== currentRowIndex)
        .map(r => r.idBodega)
        .filter(Boolean)

      return bodegasDisponiblesParaAsignar.value.filter(b => !selectedOtherRows.includes(b.idBodega))
    }

    const validRowsCount = computed(() => {
      return rows.value.filter(r => r.idBodega !== null && r.idBodega !== undefined).length
    })

    const totalCantidadInicial = computed(() => {
      return rows.value
        .filter(r => r.idBodega)
        .reduce((sum, r) => sum + (Number(r.cantidadInicial) || 0), 0)
    })

    const nuevoStockGlobal = computed(() => {
      const actual = Number(props.producto?.cantidadTotal || 0)
      return actual + totalCantidadInicial.value
    })

    const closeModal = () => {
      localShow.value = false
      emit('closeDialog')
    }

    const cerrarResultado = () => {
      showResultModal.value = false
      emit('asignado', resultData.value)
      closeModal()
    }

    const guardarAsignaciones = async () => {
      errorMessage.value = ''
      const validRows = rows.value.filter(r => r.idBodega)

      if (validRows.length === 0) {
        errorMessage.value = 'Debe seleccionar al menos una bodega para realizar la asignación.'
        return
      }

      // Validar que ninguna bodega seleccionada esté ya asignada
      const idsYaAsignadas = bodegasAsignadas.value.map(b => b.idBodega)
      for (const r of validRows) {
        if (idsYaAsignadas.includes(r.idBodega)) {
          const yaAsignada = bodegasAsignadas.value.find(b => b.idBodega === r.idBodega)
          errorMessage.value = `El producto ya se encuentra asignado a la bodega "${yaAsignada?.nombre || r.idBodega}".`
          return
        }
        if (Number(r.cantidadInicial) < 0) {
          errorMessage.value = 'La cantidad inicial no puede ser negativa.'
          return
        }
        if (Number(r.cantidadMinima) < 0) {
          errorMessage.value = 'El stock mínimo no puede ser negativo.'
          return
        }
      }

      const idProducto = props.producto?.idProducto
      if (!idProducto) {
        errorMessage.value = 'No se ha especificado un producto válido.'
        return
      }

      saving.value = true

      try {
        let payload = {}

        if (validRows.length === 1) {
          // Opción A: Asignar a una sola bodega
          const item = validRows[0]
          payload = {
            idProducto: idProducto,
            idBodega: item.idBodega,
            cantidadInicial: Number(item.cantidadInicial || 0),
            cantidadMinima: Number(item.cantidadMinima || 0),
            observaciones: item.observaciones || ''
          }
        } else {
          // Opción B: Asignar a múltiples bodegas
          payload = {
            idProducto: idProducto,
            bodegas: validRows.map(r => ({
              idBodega: r.idBodega,
              cantidadInicial: Number(r.cantidadInicial || 0),
              cantidadMinima: Number(r.cantidadMinima || 0),
              observaciones: r.observaciones || ''
            }))
          }
        }

        const res = await requestHttp.postAsignarProductoBodegas(payload, idProducto)

        if (res && res.code === 200) {
          resultData.value = res.data
          showResultModal.value = true
        } else {
          errorMessage.value = res?.data?.msg || res?.data?.message || 'Error al asignar el producto a las bodegas.'
        }
      } catch (err) {
        errorMessage.value = err?.response?.data?.msg || err?.message || 'Ocurrió un error inesperado al procesar la solicitud.'
      } finally {
        saving.value = false
      }
    }

    watch(
      () => props.show,
      async (newVal) => {
        localShow.value = newVal
        if (newVal && props.producto?.idProducto) {
          await loadData()
        }
      }
    )

    return {
      localShow,
      loading,
      saving,
      errorMessage,
      todasBodegas,
      bodegasAsignadas,
      bodegasDisponiblesParaAsignar,
      rows,
      showResultModal,
      resultData,
      validRowsCount,
      totalCantidadInicial,
      nuevoStockGlobal,
      formatCurrency,
      getBodegaIcon,
      getBodegaIconColor,
      getFilteredBodegasForRow,
      addRow,
      removeRow,
      closeModal,
      cerrarResultado,
      guardarAsignaciones
    }
  }
}
</script>

<style scoped>
.v-table th {
  font-weight: 600 !important;
}
</style>
