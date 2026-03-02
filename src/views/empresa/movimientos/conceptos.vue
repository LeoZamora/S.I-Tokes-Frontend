<template>
  <div class="w-100">
    <v-card class="border-t border-b"
      elevation="0"
      rounded="0"
    >
    <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div class="text-h6 font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="primary">
              mdi-package-variant
            </v-icon>
            Conceptos
          </div>
        </div>
      </template>

      <template v-slot:append>
        <v-btn class="rounded" @click="newConcepto"
          color="indigo-darken-4" prepend-icon="mdi-plus" variant="tonal">
          Nueva Concepto
        </v-btn>
      </template>

      <v-divider />

      <v-container>
        <v-row>
          <v-col cols="12" md="6" sm="6">
            <v-row dense align="center">
              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  v-model="data.search"
                  label="Buscar"
                  placeholder="Ingrese un texto a buscar"
                  persistent-placeholder
                  type="text"
                  color="indigo-darken-4"
                  density="compact"
                  variant="outlined"
                  hide-details
                  append-inner-icon="mdi-magnify"
                />
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-autocomplete
                  v-model="data.idTipoMov"
                  label="Tipo de Movimientos"
                  density="compact"
                  :items="data.tipoMovs"
                  color="indigo-darken-4"
                  variant="outlined"
                  hide-details
                  prepend-inner-icon="mdi-calendar-arrow-right"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="6" sm="6">

          </v-col>
        </v-row>
      </v-container>


      <v-card-text class="pt-0 px-0">
        <v-data-table
          :headers="data.headers"
          :loading="data.loading"
          :items="data.items"
          :search="data.search"
          class="font border-t"
          :row-props="setStyle"
        >

        <template v-slot:item.opc="{ item }">
          <v-menu :close-on-content-click="false" location="right center"
            origin="auto">
            <template v-slot:activator="{ props }">
              <v-tooltip text="Opciones" location="top">
                <template v-slot:activator="{ props: tooltipProps }">
                  <v-btn size="small" icon variant="text" color="grey-darken-1"
                    v-bind="{ ...props, ...tooltipProps }" class="hover-scale">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </template>

            <v-list nav rounded="lg" >
              <v-list-item-subtitle class="pa-1">
                Opciones
              </v-list-item-subtitle>
              <v-list-item rounded density="compact" prepend-icon="mdi-pencil"
                color="indigo" @click="editarConcepto(item.idConceptoTipoMov)">
                <template v-slot:title>
                    <v-divider vertical />
                    Editar Concepto
                </template>
              </v-list-item>

              <v-list-item rounded density="compact" prepend-icon="mdi-eye"
                color="indigo" @click="showInfoConcepto(item.idConceptoTipoMov)">
                <template v-slot:title>
                    <v-divider vertical />
                    Ver Concepto
                </template>
              </v-list-item>

              <v-list-item rounded density="compact" :prepend-icon="item.estado ? 'mdi-cancel' : 'mdi-check-circle-outline'"
                color="indigo" @click="changeState(item.estado, item.idConceptoTipoMov)">
                <template v-slot:title>
                  {{ `${ item.estado ? 'Desactivar' : 'Activar' }` }}
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template
          v-slot:item.fechaRegistro="{ item }"
        >
          <div>
            {{
              formattedDate(item.fechaRegistro)
            }}
          </div>
        </template>
        <template
          v-slot:item.fechaUltMod="{ item }"
        >
          <div>
            {{
              formattedDate(item.fechaUltMod)
            }}
          </div>
        </template>

        <template v-slot:item.estado="{ item }">
            <v-chip :color="item.estado ? 'green' : 'error'" small>
              {{
                item.estados
                  ? 'Activo'
                  : 'Inactivo'
              }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card-text>

    </v-card>

    <!-- EDITAR ESTADO -->
    <v-dialog v-model="data.editarEstado" max-width="400" persistent>
      <v-card>
        <v-card-title>
          Cambiar estado
        </v-card-title>

        <v-card-text class="text-center">
          {{ `¿Desea ${data.estadoRegistro ? 'desactivar' : 'activar'} este registro?` }}
        </v-card-text>

        <v-card-actions>
          <v-btn color="grey" variant="text" @click="closeDialogEstado">
              Cancelar
          </v-btn>

          <v-btn
              class="bg-indigo-darken-4"
              :disabled="data.disabledBtn"
              prepend-icon="mdi-content-save-outline"
              elevation="2"
              @click="editarEstadoConcepto"
          >
              <template v-if="data.disabledBtn">
                  <v-progress-circular
                      color="white"
                      indeterminate
                      :size="24"
                      :width="3"
                      class="mr-2"
                  />
                  <span class="text-white">
                      Guardando...
                  </span>
              </template>
              <template v-else>
                  <span class="text-white font-weight-bold">
                      Guardar
                  </span>
              </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <NewConcepto
      :editar="data.editarDialog"
      :title="data.titleDialog"
      :ver="data.verInfoConcepto"
      :show="data.showDialog"
      :idConceptoTipoMov="data.idConceptoTipoMov"
      @closeDialog="closeDialog"
    />

    <SuccessAlert
      :success="data.alertSuccess.success"
      :msg="data.alertSuccess.msg"
      :show="data.alertSuccess.show"
    />
  </div>
</template>

<script>
import { formatters } from '@/helpers/formatters';
import RequestHttp from '@/services/requestHttp';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';
import NewConcepto from './dialogsMov/NewConcepto.vue';
import { reactive, watch } from 'vue';

export default {
  beforeRouteEnter(from, to, next) {
    next(vm => {
      vm.getConceptos()
      vm.getTipoMovimientos()
    })
  },

  components: {
    NewConcepto,
    SuccessAlert
  },

  setup() {
    const data = reactive({
      headers: [
        {
          title: '',
          key: 'opc',
          align: 'center',
          headerProps: {
            class: 'pa-0'
          },
          cellProps: {
            class: 'pa-0'
          }
        },
        { title: 'Tipo Mov', key: 'tipoMovimiento', align: 'center',
          headerProps: {
            class: 'pa-0'
          },
          cellProps: {
            class: 'pa-0'
          }
        },
        { title: 'Código', key: 'codigo', align: 'center',
          headerProps: {
            class: 'pa-1'
          },
          cellProps: {
            class: 'pa-1'
          }
        },
        { title: 'Nombre', key: 'nombre', align: 'center',
          headerProps: {
            class: 'pa-1'
          },
          cellProps: {
            class: 'pa-1'
          }
        },
        { title: 'Descripción', key: 'descripcion', align: 'center',
          headerProps: {
            class: 'pa-1'
          },
          cellProps: {
            class: 'pa-1'
          }
        },
        { title: 'Fecha de Registro', key: 'fechaRegistro', align: 'center',
          headerProps: {
            class: 'pa-1'
          },
          cellProps: {
            class: 'pa-1'
          }
        },
        { title: 'Usuario de Registro', key: 'usuarioRegistro', align: 'center',
          headerProps: {
            class: 'pa-1'
          },
          cellProps: {
            class: 'pa-1'
          }
        },
        { title: 'Última modificación', key: 'fechaUltMod', align: 'center',
          headerProps: {
            class: 'pa-1'
          },
          cellProps: {
            class: 'pa-1'
          }
        },
        { title: 'Usuario de Modificación', key: 'usuarioUltMod', align: 'center',
          headerProps: {
            class: 'pa-1'
          },
          cellProps: {
            class: 'pa-1'
          }
        },
        {
          title: 'Estado',
          key: 'estado',
          align: 'center'
        }
      ],
      items: [],
      tipoMovs: [],

      // ALERT SUCCESS
      alertSuccess: {
        show: false,
        msg: '',
        success: false,
      },

      search: null,
      showDialog: false,
      verInfoConcepto: false,
      estadoRegistro: false,
      titleDialog: "Nuevo Concepto",
      idConceptoTipoMov: null,
      idTipoMov: 1,
      disabledBtn: false,
      editarDialog: false,
      editarEstado: false,
      loading: false,
      requestHttp: new RequestHttp()
    })

    function showSuccesAlert(msg, success = true) {
      data.alertSuccess.msg = msg
      data.alertSuccess.show = true
      data.alertSuccess.success = success
      setTimeout(() => {
        data.alertSuccess.show = false
        data.alertSuccess.msg = ''
      }, 1500);
    }

    async function getConceptos() {
      data.items = []
      data.loading = true

      const result = await data.requestHttp.getConceptos(data.idTipoMov)

      data.items = result.data
      data.loading = false
    }


    async function getTipoMovimientos() {
      data.tipoMovs = []
      data.loading = true

      const result = await data.requestHttp.getCombobox('api/tipos-movimiento/combobox')

      data.loading = false

      if (result.code === 200) {
        data.tipoMovs = result.data.map(item => (
          {title: `${item.codigo}-${item.nombre}`, value: item.id}
        ))
      }
    }

    watch(() => data.idTipoMov, () => {
      getConceptos()
    })

    return {
      data,
      getConceptos,
      showSuccesAlert,
      getTipoMovimientos
    }
  },

  methods: {
    setStyle({ index }) {
      return {
        class:
          index % 2 === 0
            ? 'bg-white'
            : 'bg-indigo-lighten-5'
      }
    },

    formattedDate(date) {
      return formatters.formatDate(date)
    },

    async editarEstadoConcepto() {
      this.data.disabledBtn = true

      const result = await this.data.requestHttp.putEstadoConcepto(
        !this.data.estadoRegistro, this.data.idConceptoTipoMov
      )
      this.data.disabledBtn = false

      if (result.code === 200) {
        this.showSuccesAlert(`¡Registro editado!`, true)
      } else {
        this.showAlert('No se pudo guardar el registro', 'Warning')
      }

      setTimeout(() => {
        this.closeDialogEstado()
      }, 1500);

    },

    newConcepto() {
      this.data.showDialog = true
      this.data.editarDialog = false
    },

    editarConcepto(id) {
      this.data.showDialog = true
      this.data.editarDialog = true
      this.data.idConceptoTipoMov = id
      this.data.titleDialog = 'Editar Concepto'
    },

    showInfoConcepto(id) {
      this.data.showDialog = true
      this.data.editarDialog = false
      this.data.verInfoConcepto = true
      this.data.idConceptoTipoMov = id
      this.data.titleDialog = 'Concepto de Movimiento'
    },

    changeState(state, id) {
      this.data.editarEstado = true
      this.data.estadoRegistro = state
      this.data.idConceptoTipoMov = id
    },

    closeDialog() {
      this.data.showDialog = false
      this.data.editarDialog = false
      this.data.verInfoConcepto = false
      this.data.idConceptoTipoMov = null
      this.getConceptos()
    },

    closeDialogEstado() {
      this.data.editarEstado = false
      this.data.estadoRegistro = false
      this.getConceptos()
    }
  }
}
</script>


<style scoped>
.font {
  font-size: 12px !important;
  color: black;
  font-weight: 500;
}
</style>