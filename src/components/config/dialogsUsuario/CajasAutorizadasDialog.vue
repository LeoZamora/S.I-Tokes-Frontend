<template>
  <v-dialog v-model="localShow" max-width="650" persistent scrollable>
    <v-card id="diag-cajas" class="rounded-lg">
      <!-- HEADER -->
      <v-card-title class="bg-indigo-darken-4 d-flex align-center py-3 px-4">
        <div class="d-flex align-center">
          <v-icon class="mr-2" size="28">mdi-cash-register</v-icon>
          <div>
            <div class="text-subtitle-1 font-weight-bold text-white lh-1">
              Cajas Autorizadas
            </div>
            <div class="text-caption text-indigo-lighten-4">
              Gestión de acceso a cajas para el usuario
            </div>
          </div>
        </div>
        <v-spacer />
        <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
          <v-icon>mdi-close</v-icon>
          <v-tooltip activator="parent" location="top" text="Cerrar" />
        </v-btn>
      </v-card-title>

      <!-- USER INFO BANNER -->
      <div class="bg-indigo-lighten-5 px-4 py-3 border-b d-flex align-center justify-between flex-wrap ga-2">
        <div class="d-flex align-center">
          <v-avatar color="indigo-darken-3" size="36" class="mr-3 text-white font-weight-bold">
            {{ getInitials(usuario?.nombre || usuario?.username) }}
          </v-avatar>
          <div>
            <div class="font-weight-bold text-indigo-darken-4">
              {{ usuario?.nombre || usuario?.username || 'Usuario' }}
            </div>
            <div class="text-caption text-grey-darken-2">
              <v-icon size="14" class="mr-1">mdi-account</v-icon>
              {{ usuario?.username }}
              <span v-if="usuario?.rol" class="mx-1">•</span>
              <span v-if="usuario?.rol" class="font-weight-medium text-indigo-darken-2">
                {{ usuario?.rol }}
              </span>
            </div>
          </div>
        </div>
        <div>
          <v-chip size="small" color="indigo-darken-3" variant="flat">
            <v-icon start size="14">mdi-check-circle-outline</v-icon>
            {{ selectedCajasIds.length }} de {{ totalCajasCount }} seleccionadas
          </v-chip>
        </div>
      </div>

      <!-- BODY CONTENT -->
      <v-card-text class="pa-4" style="max-height: 480px;">
        <!-- SEARCH & QUICK SELECT -->
        <v-row dense class="mb-2 align-center">
          <v-col cols="12" sm="7">
            <v-text-field
              v-model="search"
              density="compact"
              variant="outlined"
              label="Buscar caja..."
              prepend-inner-icon="mdi-magnify"
              placeholder="Código, nombre o bodega"
              hide-details
              clearable
              color="indigo"
            />
          </v-col>
          <v-col cols="12" sm="5" class="d-flex justify-end ga-1">
            <v-btn
              size="small"
              variant="text"
              color="indigo-darken-3"
              prepend-icon="mdi-checkbox-multiple-marked-outline"
              @click="selectAll()"
              :disabled="loading || filteredCajas.length === 0"
            >
              Todas
            </v-btn>
            <v-btn
              size="small"
              variant="text"
              color="grey-darken-2"
              prepend-icon="mdi-checkbox-multiple-blank-outline"
              @click="deselectAll()"
              :disabled="loading || selectedCajasIds.length === 0"
            >
              Ninguna
            </v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-2" />

        <!-- LOADING STATE -->
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="indigo" size="40" width="3" />
          <div class="text-caption text-grey mt-2">Cargando cajas y autorizaciones...</div>
        </div>

        <!-- EMPTY STATE -->
        <div v-else-if="filteredCajas.length === 0" class="text-center py-8 text-grey">
          <v-icon size="48" color="grey-lighten-1">mdi-cash-register</v-icon>
          <div class="mt-2 text-subtitle-2">No se encontraron cajas</div>
          <div class="text-caption">Intenta ajustar el criterio de búsqueda</div>
        </div>

        <!-- CAJAS LIST -->
        <v-list v-else lines="two" class="pa-0 bg-transparent">
          <v-card
            v-for="caja in filteredCajas"
            :key="caja.idCaja"
            variant="outlined"
            class="mb-2 transition-all cursor-pointer border"
            :class="{
              'border-indigo-darken-3 bg-indigo-lighten-5': isSelected(caja.idCaja),
              'bg-white': !isSelected(caja.idCaja)
            }"
            @click="toggleCaja(caja.idCaja)"
          >
            <div class="d-flex align-center pa-3">
              <v-checkbox-btn
                :model-value="isSelected(caja.idCaja)"
                color="indigo-darken-3"
                class="mr-2"
                @click.stop="toggleCaja(caja.idCaja)"
              />
              <div class="flex-grow-1">
                <div class="d-flex align-center justify-space-between flex-wrap">
                  <div class="font-weight-bold text-body-2 text-grey-darken-4">
                    <span v-if="caja.codigo" class="text-indigo-darken-3 mr-1">[{{ caja.codigo }}]</span>
                    {{ caja.nombre }}
                  </div>
                  <div class="d-flex align-center ga-1 mt-1 mt-sm-0">
                    <v-chip v-if="caja.bodegaNombre" size="x-small" color="blue-grey" variant="tonal">
                      <v-icon start size="12">mdi-warehouse</v-icon>
                      {{ caja.bodegaNombre }}
                    </v-chip>
                    <v-chip
                      v-if="caja.estadoNombre"
                      size="x-small"
                      :color="caja.estadoNombre.toLowerCase().includes('abiert') ? 'green' : 'grey'"
                      variant="flat"
                    >
                      {{ caja.estadoNombre }}
                    </v-chip>
                  </div>
                </div>
                <div v-if="caja.descripcion" class="text-caption text-grey-darken-1 mt-1">
                  {{ caja.descripcion }}
                </div>
              </div>
            </div>
          </v-card>
        </v-list>
      </v-card-text>

      <v-divider />

      <!-- ACTIONS -->
      <v-card-actions class="pa-3 bg-grey-lighten-4 d-flex justify-end">
        <v-btn
          variant="outlined"
          color="grey-darken-2"
          @click="closeDialog()"
          :disabled="saving"
        >
          Cancelar
        </v-btn>
        <v-btn
          class="bg-indigo-darken-4"
          @click="saveCajasAutorizadas()"
          :loading="saving"
          :disabled="loading"
          prepend-icon="mdi-content-save-check"
          elevation="2"
        >
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import RequestHttp from '@/services/requestHttp'

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    usuario: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['closeDialog', 'updated'],

  setup(props, { emit }) {
    const requestHttp = new RequestHttp()
    const localShow = ref(props.show)
    const loading = ref(false)
    const saving = ref(false)
    const search = ref('')
    const allCajas = ref([])
    const selectedCajasIds = ref([])

    const totalCajasCount = computed(() => allCajas.value.length)

    const filteredCajas = computed(() => {
      if (!search.value || search.value.trim() === '') {
        return allCajas.value
      }
      const q = search.value.toLowerCase().trim()
      return allCajas.value.filter(c => {
        const codigo = (c.codigo || '').toLowerCase()
        const nombre = (c.nombre || '').toLowerCase()
        const bodega = (c.bodegaNombre || '').toLowerCase()
        const desc = (c.descripcion || '').toLowerCase()
        return codigo.includes(q) || nombre.includes(q) || bodega.includes(q) || desc.includes(q)
      })
    })

    const isSelected = (idCaja) => {
      return selectedCajasIds.value.includes(idCaja)
    }

    const toggleCaja = (idCaja) => {
      const idx = selectedCajasIds.value.indexOf(idCaja)
      if (idx > -1) {
        selectedCajasIds.value.splice(idx, 1)
      } else {
        selectedCajasIds.value.push(idCaja)
      }
    }

    const selectAll = () => {
      const idsToAdd = filteredCajas.value.map(c => c.idCaja)
      const merged = new Set([...selectedCajasIds.value, ...idsToAdd])
      selectedCajasIds.value = Array.from(merged)
    }

    const deselectAll = () => {
      if (!search.value || search.value.trim() === '') {
        selectedCajasIds.value = []
      } else {
        const idsToRemove = new Set(filteredCajas.value.map(c => c.idCaja))
        selectedCajasIds.value = selectedCajasIds.value.filter(id => !idsToRemove.has(id))
      }
    }

    const getInitials = (text) => {
      if (!text) return 'U'
      const parts = text.trim().split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return text.substring(0, 2).toUpperCase()
    }

    const loadData = async () => {
      const idUsuario = props.usuario?.idusuario ?? props.usuario?.idUsuario
      if (!idUsuario) return

      loading.value = true
      try {
        // Cargar todas las cajas del sistema
        const resCajas = await requestHttp.getCajas()
        if (resCajas.code === 200 && Array.isArray(resCajas.data)) {
          allCajas.value = resCajas.data
        }

        // Cargar los IDs de cajas actualmente autorizadas para el usuario
        const resIds = await requestHttp.getCajasAutorizadasIds(idUsuario)
        if (resIds.code === 200 && Array.isArray(resIds.data)) {
          selectedCajasIds.value = [...resIds.data]
        } else {
          // Si endpoint /ids no devuelve array, intentar con listado completo
          const resDetalle = await requestHttp.getCajasAutorizadas(idUsuario)
          if (resDetalle.code === 200 && Array.isArray(resDetalle.data)) {
            selectedCajasIds.value = resDetalle.data.map(x => x.idCaja)
          }
        }
      } catch (err) {
        console.error('Error cargando cajas autorizadas:', err)
      } finally {
        loading.value = false
      }
    }

    watch(
      () => props.show,
      (newVal) => {
        localShow.value = newVal
        if (newVal) {
          search.value = ''
          loadData()
        }
      }
    )

    const closeDialog = () => {
      localShow.value = false
      emit('closeDialog', false)
    }

    const saveCajasAutorizadas = async () => {
      const idUsuario = props.usuario?.idusuario ?? props.usuario?.idUsuario
      if (!idUsuario) return

      saving.value = true
      try {
        const res = await requestHttp.putCajasAutorizadas(idUsuario, selectedCajasIds.value)
        if (res.code === 200) {
          emit('updated', {
            idUsuario,
            totalAsignadas: selectedCajasIds.value.length
          })
          closeDialog()
        } else {
          const msg = res.data?.msg || 'No se pudieron actualizar las cajas autorizadas.'
          alert(msg)
        }
      } catch (err) {
        alert('Ocurrió un error al guardar las cajas autorizadas.')
      } finally {
        saving.value = false
      }
    }

    return {
      localShow,
      loading,
      saving,
      search,
      allCajas,
      selectedCajasIds,
      totalCajasCount,
      filteredCajas,
      isSelected,
      toggleCaja,
      selectAll,
      deselectAll,
      getInitials,
      closeDialog,
      saveCajasAutorizadas
    }
  }
}
</script>

<style scoped>
.lh-1 {
  line-height: 1.2;
}
.cursor-pointer {
  cursor: pointer;
}
.transition-all {
  transition: all 0.15s ease-in-out;
}
</style>
