<template>
  <v-dialog v-model="localShow" max-width="600" persistent>
    <v-card class="rounded" elevation="8">
      <!-- Header con gradiente profesional -->
      <v-card-title class="d-flex align-center" style="background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);">
        <v-avatar  color="white" class="mr-3" variant="flat">
          <v-icon color="#1a237e" size="24">mdi-map-marker-path</v-icon>
        </v-avatar>
        <div class="text-white">
          <h5 class="text-h6 font-weight-bold">
            {{ localTitle }}
          </h5>
          <div class="text-caption text-grey-lighten-3">
            Gestión de rutas logísticas
          </div>
        </div>
        <v-spacer />
        <v-btn icon color="white" variant="text" @click="closeDialog()" size="small" class="ml-1">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-5" style="background-color: #f8f9fa;">
        <!-- Encabezado con fecha -->
        <v-card variant="flat" color="white" class="mb-4 pa-2 rounded-lg border">
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon color="indigo" size="small" class="mr-2">mdi-calendar-clock</v-icon>
              <span class="text-caption text-grey-darken-2">Información de registro</span>
            </div>
            <div class="d-flex align-center">
              <span class="text-caption text-grey-darken-2 mr-2">
                Fecha de registro:
              </span>
              <span class="text-body-2 font-weight-bold text-indigo-darken-3">
                {{ formatedDate(data.emision) }}
              </span>
            </div>
          </div>
        </v-card>

        <!-- Sección GENERALES -->
        <v-card variant="flat" color="white" class="mb-5 rounded border" >
          <v-card-title class="pa-2" style="background-color: #e8eaf6;">
            <div class="d-flex align-center">
              <v-icon color="indigo-darken-3" size="small" class="mr-2">
                mdi-cog
              </v-icon>
              <span class="text-subtitle-2 font-weight-bold">
                INFORMACIÓN GENERAL DE LA RUTA
              </span>
            </div>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-form ref="form">
              <v-row dense>
                <v-col cols="12" md="12" sm="12">
                  <v-text-field 
                    v-model="data.ruta.codigo" 
                    prepend-inner-icon="mdi-numeric"
                    density="compact" 
                    :rules="data.rules.rule"
                    variant="outlined" 
                    :hide-details="data.hide"
                    label="Código de Ruta"
                    placeholder="Ej: RT-001"
                    persistent-placeholder
                    color="indigo-darken-3"
                    bg-color="grey-lighten-4"
                    class="rounded-lg"
                  />
                </v-col>
                <v-col cols="12" md="12" sm="12">
                  <v-text-field 
                    v-model="data.ruta.nombre" 
                    :rules="data.rules.rule" 
                    prepend-inner-icon="mdi-route"
                    density="compact" 
                    variant="outlined" 
                    :hide-details="data.hide"
                    label="Nombre de Ruta"
                    placeholder="Ej: Ruta Norte"
                    persistent-placeholder
                    color="indigo-darken-3"
                    bg-color="grey-lighten-4"
                    class="rounded-lg"
                  />
                </v-col>
                <v-col cols="12" md="12" sm="12">
                  <v-text-field 
                    v-model="data.ruta.gestor" 
                    :rules="data.rules.rule"
                    prepend-inner-icon="mdi-account-tie"
                    density="compact" 
                    variant="outlined" 
                    :hide-details="data.hide"
                    label="Gestor Asignado"
                    placeholder="Nombre del gestor"
                    persistent-placeholder
                    color="indigo-darken-3"
                    bg-color="grey-lighten-4"
                    class="rounded-lg"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea 
                    v-model="data.ruta.descripcion" 
                    density="compact" 
                    variant="outlined"
                    :hide-details="data.hide" 
                    label="Descripción"
                    placeholder="Describa los detalles, características y objetivos de esta ruta..."
                    persistent-placeholder 
                    rows="3"
                    color="indigo-darken-3"
                    bg-color="grey-lighten-4"
                    class="rounded-lg"
                    auto-grow
                  />
                </v-col>
                <transition name="slide-y-transition">
                  <AlertComp 
                    :show="data.alert.show" 
                    :type="data.alert.type" 
                    :message="data.alert.message"/>
                </transition>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Sección COBERTURAS -->
        <v-card variant="flat" color="white" class="mb-5 rounded border" >
          <v-card-title class="pa-2" style="background-color: #e8eaf6;">
            <div class="d-flex align-center">
              <v-icon color="indigo-darken-3" size="small" class="mr-2">
                mdi-map-legend
              </v-icon>
              <span class="text-subtitle-2 font-weight-bold">
                COBERTURA GEOGRÁFICA
              </span>
            </div>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-form ref="formCobertura">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-autocomplete 
                    v-model="data.cobertura.idDepartamento" 
                    prepend-inner-icon="mdi-map-marker"
                    density="compact"
                    variant="outlined"
                    :rules="data.rules.rule"
                    :hide-details="data.hide" 
                    label="Departamento"
                    placeholder="Seleccione un departamento"
                    persistent-placeholder
                    :items="data.departamentos"
                    @update:model-value="getMunicipios"
                    color="indigo-darken-3"
                    bg-color="grey-lighten-4"
                    class="rounded-lg"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete 
                    v-model="data.cobertura.idMunicipio" 
                    prepend-inner-icon="mdi-city"
                    density="compact"
                    variant="outlined"
                    :hide-details="data.hide" 
                    label="Municipio"
                    :rules="data.rules.rule"
                    placeholder="Seleccione un municipio"
                    persistent-placeholder
                    :items="data.municipios"
                    color="indigo-darken-3"
                    bg-color="grey-lighten-4"
                    class="rounded-lg"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea 
                    density="compact" 
                    variant="outlined" 
                    v-model="data.cobertura.observaciones"
                    :hide-details="data.hide" 
                    label="Observaciones de Cobertura"
                    placeholder="Observaciones específicas sobre esta cobertura..."
                    persistent-placeholder 
                    rows="2"
                    color="indigo-darken-3"
                    bg-color="grey-lighten-4"
                    class="rounded-lg"
                    auto-grow
                  />
                </v-col>

                <transition name="slide-y-transition">
                  <AlertComp 
                    :show="data.alert.show2" 
                    :type="data.alert.type" 
                    :message="data.alert.message"/>
                </transition>
                
                <!-- Botones de acción para cobertura -->
                <v-col cols="12" class="mt-2">
                  <v-card variant="flat" class="rounded">
                    <div class="d-flex justify-end align-center">
                      <v-btn 
                        color="grey-darken-2" 
                        variant="tonal"
                        class="mr-2"
                      >
                        Limpiar
                      </v-btn>

                      <v-btn 
                        color="indigo-darken-3" 
                        variant="flat" 
                        @click="addCobertura()"
                        prepend-icon="mdi-plus-circle"
                      >
                        Agregar
                      </v-btn>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Tabla de coberturas agregadas -->
        <v-card variant="flat" class="rounded-lg overflow-hidden border" elevation="2">
          <v-card-title class="pa-3" style="background-color: #e8eaf6;">
            <div class="d-flex align-center">
              <v-icon color="indigo-darken-3" size="small" class="mr-2">mdi-format-list-bulleted</v-icon>
              <span class="text-subtitle-2 font-weight-bold">COBERTURAS AGREGADAS</span>
              <v-chip size="small" color="indigo" variant="flat" class="ml-3">
                {{ data.items.length }}
              </v-chip>
            </div>
          </v-card-title>
          
          <v-data-table 
            class="elevation-1"
            density="compact" 
            :headers="data.headers" 
            :items="data.items"
            hide-default-footer
            height="200"
            :header-props="{
              class: 'text-uppercase font-weight-bold bg-indigo-lighten-5'
            }"
          >
            <template v-slot:item.opc="{ item }">
              <v-btn 
                icon 
                variant="text" 
                color="error" 
                size="small"
                @click="deleteProduct(item)"
                class="mr-1"
              >
                <v-icon>mdi-delete-outline</v-icon>
                <v-tooltip activator="parent" location="top">
                  Eliminar cobertura
                </v-tooltip>
              </v-btn>
            </template>
            
            <template v-slot:no-data>
              <div class="pa-4 text-center text-grey">
                <v-icon size="large" class="mb-2">mdi-map-outline</v-icon>
                <div class="text-body-2">No hay coberturas agregadas</div>
                <div class="text-caption">Agregue departamentos y municipios para comenzar</div>
              </div>
            </template>

            <template v-slot:bottom>
              <transition name="slide-y-transition">
                <AlertComp 
                  :show="data.alert.show3" 
                  :type="data.alert.type" 
                  :message="data.alert.message"/>
              </transition>
            </template>
          </v-data-table>
        </v-card>
      </v-card-text>

      <!-- Footer con acciones -->
      <v-divider thickness="2" />
      <v-card-actions class="pa-4 bg-white">
        <v-btn color="grey-darken-2" variant="tonal"  @click="closeDialog()"
          prepend-icon="mdi-close-circle">
          Cancelar
        </v-btn>
        
        <v-btn @click="guardarRuta()" prepend-icon="mdi-content-save" elevation="2"
          class="bg-indigo-darken-4">
          <span class="text-white">
            Guardar
          </span>
        </v-btn>
      </v-card-actions>
    </v-card>
    <OverlayComp :show="data.overlay.show"/>

    <SuccessAlert 
        :success="data.alertSuccess.success" 
        :msg="data.alertSuccess.msg" 
        :show="data.alertSuccess.show" 
    />
  </v-dialog>
</template>

<script>
import {formatters} from '@/helpers/formatters';
import RequestHttp from '@/services/requestHttp';
import {reactive, ref, watch} from 'vue';
import {httpGet} from '@/scripts/api.js'
import AlertComp from '@/components/reutilizable/AlertComp.vue';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';
import { useStore } from '@/store';

export default {
   async mounted() {
    this.getDepartamentos()
    this.getEmpleados()
  },

  props: {
    show: {
      type: Boolean,
      required: true,
    },
    editar: {
      type: Boolean,
      required: false
    },
    idRuta: {
      type: Number,
      required: false
    },
    title: {
      type: String,
      required: true,
      default: 'Nueva Ruta'
    }
  },

  data(){
    return {
      usuarioRegistro: JSON.parse(localStorage.getItem('token')).usuario
    }
  },

  components: {
    AlertComp,
    SuccessAlert,
    OverlayComp
  },

  setup(props) {
    const getRuta = async (id) => {
      return await data.requestHttp.getByIdRuta(id)
    }

    async function getDepartamentos() {
      data.departamentos = []
      data.loading = true
      const result = await data.requestHttp.getDepartamentos()
      data.loading = false

      if (result.code === 200) {
        result.data.map(item => {
          data.departamentos.push({title: item.nombre, value: item.id})
        })
      }
    }

    function showSuccesAlert(msg, success = true) {
      data.alertSuccess.msg = msg
      data.alertSuccess.show = true
      data.alertSuccess.success = success
      setTimeout(() => {
        data.alertSuccess.show = false
        data.alertSuccess.msg = ''
      }, 1500);
    }

    function showAlert(val, message, type) {
      if (val === 1) {
        data.alert.show = true
      } else if(val === 2) {
        data.alert.show2 = true
      } else if(val === 3) {
        data.alert.show3 = true
      }
      data.alert.type = type
      data.alert.message = message

      setTimeout(() => {
        data.alert.show = false
        data.alert.show2 = false
        data.alert.show3 = false
        data.alert.val = 0
      }, 3000);
    }

    const token = ref(JSON.parse(localStorage.getItem('token')))
    const localShow = ref(props.show)
    const localEdit = ref(props.editar)
    const localRuta = ref(props.idRuta)
    const localTitle = ref(props.title)
    watch(() => props.show, async (newValue) => {
      localShow.value = newValue

      if (newValue) {
        data.ruta.usuarioRegistro = useStore().getNameUser()
        var cod = await httpGet('api/Ruta/no-Ruta')
        data.ruta.noRuta = String(cod)

        getDepartamentos()
      }

    })
    watch(() => props.editar, async (val) => {
      localEdit.value = val
      if (val === true) {
        data.overlay.show = true
        const result = await data.requestHttp.getByIdRuta(localRuta.value)
        data.overlay.show = false
        data.ruta = result
        result.coberturasRuta.map(item => {
          data.items.push(item)
        })
      }
    })
    watch(() => props.idRuta, async (val) => {
      localRuta.value = val
    })
    watch(() => props.title, (val) => {
      localTitle.value = val
    })

    const data = reactive({
      rules: {
        rule: [v => !!v || 'El campo es obligatorio']
      },

      headers: [
        {title: 'Opciones', key: 'opc', align: 'center'},
        {title: 'Departamento', key: 'departamento', align: 'center'},
        {title: 'Municipio', key: 'municipio', align: 'center'},
        {title: 'Observaciones', key: 'observaciones', align: 'center'},
      ],
      departamentos: [],
      municipios: [],
      items: [],
      ruta: {
        codigo: null,
        nombre: null,
        descripcion: null,
        gestor: null,
        usuarioRegistro: null,
        coberturasRuta: []
      },
      // ALERT
      alert: {
        show: false,
        show2: false,
        show3: false,
        type: 'success',
        message: '',
        val: 0,
      },

      // ALERT SUCCESS
      alertSuccess: {
        show: false,
        msg: '',
        success: false,
      },

      // Overlay
      overlay: {
        show: false
      },
      cobertura: {
        idDepartamento: null,
        idMunicipio: null,
        observaciones: null
      },
      hide: true,
      idRuta: null,
      emision: new Date(),
      nio: true,
      usd: false,
      fornates: {
        nio: 'NIO',
        usd: 'USD'
      },
      requestHttp: new RequestHttp()
    })

    return {
      localShow,
      localEdit,
      localRuta,
      localTitle,
      data,
      token,
      getDepartamentos,
      showAlert,
      showSuccesAlert
    }
  },

  methods: {

    async getMunicipios() {
      this.data.municipios = []
      this.data.loading = true
      const result = await this.data.requestHttp.getMunById(this.data.cobertura.idDepartamento)
      this.data.loading = false

      if (result.code === 200) {
        result.data.map(item => {
          this.data.municipios.push({title: item.nombre, value: item.id})
        })
      }

    },

    async getEmpleados() {
      this.data.empleados = []
      this.data.loading = true
      const result = await this.data.requestHttp.getUsuarios()
      this.data.loading = false

      if (result.code === 200) {
        result.data.map(item => {
          this.data.empleados.push({title: item.username, value: item.username})
        })
      }
    },

    async getProductos() {
      this.data.productos = []
      this.data.loading = true
      const result = await this.data.requestHttp.getProductos('Herramientas')
      this.data.loading = false

      if (result !== null) {
        result.map(item => {
          if (item.tipoProducto === 'Herramientas') {
            this.data.productos.push({title: item.nombre, value: item.idProducto})
          }
        })
      } else {
        throw new Error('Error en la solicitud')
      }
    },

    async addCobertura() {
      const valid = await this.$refs.formCobertura.validate()

      if (!valid.valid) {
        this.showAlert(2, 'Complete la información', 'warning')
        return
      }
      
      const departamento = this.data.departamentos.find(item =>
          item.value === this.data.cobertura.idDepartamento
      )

      const municipio = this.data.municipios.find(item =>
          item.value === this.data.cobertura.idMunicipio
      )

      let obs = this.data.cobertura.observaciones

      this.data.items.push({
        idDepartamento: departamento.value,
        idMunicipio: municipio.value,
        departamento: departamento.title,
        municipio: municipio.title,
        observaciones: obs
      })

      this.data.ruta.coberturasRuta.push({
        ...this.data.cobertura,
        observaciones: obs
      })
      this.data.cobertura.idMunicipio = null
      this.data.cobertura.observaciones = null
    },

    deleteProduct(itemSelected) {
      var index = this.data.items.indexOf(itemSelected)
      const items = this.data.items.splice(index, 1)
    },

    async guardarRuta() {
      const valid = await this.$refs.form.validate()
      if (!valid.valid) {
        this.showAlert(1, 'Complete la información', 'warning')
        return
      }

      if (this.data.items.length === 0) {
        this.showAlert(3, 'Ingrese al menos una cobertura', 'warning')
        return
      }

      if (!this.localEdit) {
        this.data.ruta.coberturasRuta = this.data.items
        const result = await this.data.requestHttp.postRuta(this.data.ruta)

        if (result.code === 200) {
          this.showSuccesAlert('¡Nueva Ruta registrada!', true)
          setTimeout(() => {
            this.closeDialog()
          }, 1500)
        } else {
          this.showSuccesAlert(`La ruta no pudo ser registrada. ${result.data.msg}`, false)
          return
        }
      } else {
        if (!this.data.ruta.codigo ||
            !this.data.ruta.gestor ||
            !this.data.ruta.nombre ||
            this.data.ruta.coberturasRuta.length === 0
        ) {
          alert('Complete la informacion de la orden')
          return
        } else {
          this.data.ruta.coberturasRuta = this.data.items
          const result = await this.data.requestHttp.putRuta(this.data.ruta, this.localRuta)

          if (result.code === 200) {
            this.showSuccesAlert('¡Nueva Ruta Editada!', true)
            setTimeout(() => {
              this.closeDialog()
            }, 1500)
          } else {
            this.showSuccesAlert(`La ruta no pudo ser editada. ${result.data.msg}`, false)
            return
          }
        }
      }
      this.$emit('refreshTable')
    },

    formatedCurrency(key, currency) {
      const value = formatters.formatCurrency(key, currency)
      return value
    },

    formatedDate(dataString) {
      const value = formatters.formatDate(dataString)
      return value
    },

    closeDialog() {
      this.$emit('closeDialog', false)
      this.data.items = []
      this.data.editRuta = {}
      this.data.ruta = {}
    },
  },
}
</script>

<style scoped>
.v-card-item {
  padding: 8px 12px !important;
}

#diag-fact {
  position: relative;
}

#body-card {
  z-index: 2;
}

#checkLabel {
  font-size: 12px !important;
}

.font {
  font-size: 12px !important;
}
</style>