<template>
  <v-dialog v-model="localShow" max-width="600" persistent>
    <v-card id="diag-fact">
      <v-card-title class="bg-indigo-darken-4 d-flex align-center">
        <h5>
          <v-icon>mdi-account-tie</v-icon>
          {{ localTitle }}
        </h5>
        <v-spacer/>
        <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
          <v-icon>mdi-close</v-icon>
          <v-tooltip activator="parent" location="top" text="Cerrar"/>
        </v-btn>
      </v-card-title>
      <v-divider/>
      <v-card-text class="py-2">
        <v-row class="pb-0">
          <v-col v-if="!localEdit" cols="6" md="6" sm="6" class="d-flex justify-start align-center pb-0">
            <v-card variant="tonal" color="green">  
              <v-card-text class="pa-2">
                <div class="d-flex justify-start align-center">
                  <small class="mr-2">Fecha de Registro: </small>
                  <small>
                    <strong>
                      {{ localEdit ? '' : formatedDate(localView ? data.dataCliente.fechaRegistro : data.nowDate) }}
                    </strong>
                  </small>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col :cols="localEdit ? 12 : 6" :md="localEdit ? 12 : 6" :sm="localEdit ? 12 : 6"
              class="d-flex justify-end align-center pb-0">
            <v-checkbox v-model="data.dataCliente.personaNatural" color="indigo" density="compact" class="label"
               :readonly="readonlyOption()" hide-details>
              <template v-slot:label>
                <span id="checkLabel">Persona Natural</span>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
        <v-card-subtitle class="d-flex align-center text-center my-4">
          <small class="mr-2 font-weight-bold">GENERALES</small>
          <v-divider/>
        </v-card-subtitle>
        <v-form ref="form">
          <v-row >
            <v-col cols="12" md="12" sm="12" class="py-2">
              <v-select
                  v-model="data.dataCliente.idCategoriaCliente"
                  :items="data.categoriaCliente"
                  density="compact"
                  variant="outlined"
                  label="Tipo Cliente"
                  placeholder="tipo de Cliente"
                  color="indigo"
                  persistent-placeholder
                  :rules="[v => !!v || 'Requerido.']"
                  :readonly="readonlyOption()"
              ></v-select>
            </v-col>
            <v-col cols="12" md="12" sm="12" class="py-2">
              <v-text-field v-model="data.dataCliente.nombre" prepend-inner-icon="mdi-account" density="compact"
                :rules="[v => !!v || 'Requerido.']" color="indigo"
                variant="outlined" label="Nombre:" placeholder="Ingrese el nombre del cliente"
                persistent-placeholder :readonly="readonlyOption()"/>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="py-2">
              <v-autocomplete :items="data.departamentos" v-model="data.dataCliente.idDepartamento"
                density="compact" color="indigo"
                :rules="[v => !!v || 'Requerido.']"
                variant="outlined" label="Departamento" placeholder="ingrese un departamento"
                persistent-placeholder :readonly="readonlyOption()"/>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="py-2">
            <v-autocomplete :items="data.municipios" v-model="data.dataCliente.idMunicipio"
              density="compact" color="indigo" variant="outlined" label="Municipio" 
              placeholder="ingrese un municipio"
              persistent-placeholder :readonly="readonlyOption()"/>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="py-2">
              <v-autocomplete :items="cmb.rutas" v-model="data.dataCliente.idRuta"
                :rules="[v => !!v || 'Requerido.']" color="indigo"
                prepend-inner-icon="mdi-map-marker" density="compact"
                variant="outlined" label="Ruta:" placeholder="Ruta que cubre al cliente"
                persistent-placeholder :readonly="readonlyOption()"/>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="py-2">
              <v-text-field v-model="data.dataCliente.telefono" prepend-inner-icon="mdi-phone" density="compact"
                variant="outlined" label="Teléfono" placeholder="teléfono del Cliente" color="indigo"
                persistent-placeholder type="number" :readonly="readonlyOption()"/>
            </v-col>
            <v-col cols="12" md="12" sm="12" class="py-2">
              <v-textarea v-model="data.dataCliente.direccion" prepend-inner-icon="mdi-text" density="compact"
                variant="outlined" label="Dirección" placeholder="dirección del Cliente"
                persistent-placeholder :rows="2" :readonly="readonlyOption()" color="indigo"/>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider/>
      <v-card-actions v-if="!localView">
        <v-btn color="grey" variant="outlined" @click="closeDialog()">
          Cancelar
        </v-btn>
        <v-btn 
            class="bg-indigo-darken-4" 
            @click="handleSave()"
            :disabled="data.disabledBtn"
            prepend-icon="mdi-content-save-outline"
            elevation="2"
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
      <OverlayComp :show="data.overlay.show"/>
    </v-card>

    <SuccessAlert 
      :success="data.alertSuccess.success" 
      :msg="data.alertSuccess.msg" 
      :show="data.alertSuccess.show" 
    />
  </v-dialog>
</template>

<script>
import {formatters} from '@/helpers/formatters';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';
import RequestHttp from '@/services/requestHttp';
import {reactive, ref, watch} from 'vue';
import {getItemsCombobox} from "@/scripts/api.js";
import { useStore } from '@/store';

export default {
  async mounted() {
    await Promise.all([
      this.getCategoriaCliente(),
      this.getDepartamentos(),
      this.loadCmbRutas()
    ])
  },

  components: {
    OverlayComp,
    SuccessAlert
  },

  props: {
    show: {
      type: Boolean,
      required: true,
      default: true
    },
    editar: {
      type: Boolean,
      required: false
    },
    prov: {
      type: Object,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    ver: {
      type: Boolean,
      required: false
    }
  },

  data() {
    return {
      cmb: {
        rutas: []
      },
    }
  },

  setup(props) {
    const store = useStore()
    const localShow = ref(props.show)
    const localEdit = ref(props.editar)
    const localCliente = ref(props.prov)
    const localTitle = ref(props.title)
    const localView = ref(props.ver)

    const data = reactive({
      nowDate: new Date(),
      dataCliente: {
        categoriaCliente: null,
        departamento: null,
        direccion: null,
        estado: null,
        fechaRegistro: null,
        idCategoriaCliente: null,
        idCliente: null,
        idDepartamento: null,
        idMunicipio: null,
        idRuta: null,
        municipio: null,
        personaNatural: false,
        nombre: null,
        ruta: null,
        telefono: null,
        usuarioRegistro: null,
      },
      // Overlay
      overlay: {
          show: false
      },
      // ALERT SUCCESS
      alertSuccess: {
          show: false,
          msg: '',
          success: false,
      },
      disabledBtn: false,
      departamentos: [],
      municipios: [],
      idCliente: null,
      categoriaCliente: [],
      requestHttp: new RequestHttp()
    })

    async function getCliente(id) {
      return await data.requestHttp.getByIdCliente(id)
    }
    
    watch(() => props.show, (newValue) => {
      localShow.value = newValue
    })

    watch(() => props.ver, (val) => {
      localView.value = val
    })

    watch(() => props.prov, async (val) => {
      localCliente.value = val
      
      if (val) {
        data.overlay.show = true
        data.idCliente = localCliente.value.idCliente
        
        const result = await getCliente(data.idCliente)
        if (result.code === 200) {
          data.dataCliente = result.data
        }
        data.overlay.show = false
      }
    })

    watch(() => props.editar, async (val) => {
      localEdit.value = val
            
      if (val === true) {
        data.overlay.show = true
        const result = await getCliente(props.prov.idCliente)
        if (result.code === 200) {
          data.dataCliente = result.data
        }
        data.overlay.show = false
      }
    })

    watch(() => props.title, (val) => {
      localTitle.value = val
    })

    async function getMunicipios() {
      data.municipios = []
      const result = await data.requestHttp.getMunById(data.dataCliente.idDepartamento)

      if (result.code === 200) {
        result.data.map(item => {
          data.municipios.push({title: item.nombre, value: item.id})
        })
      }

    }

    watch(() => data.dataCliente.idDepartamento, (val) => {
      if (val) {
        getMunicipios()
      }
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
    return {
      localShow,
      localEdit,
      localTitle,
      localCliente,
      localView,
      data,
      store,
      getMunicipios,
      showSuccesAlert
    }
  },

  methods: {
    async loadCmbRutas() {
      var rutas = await getItemsCombobox('api/rutas/combobox')
      this.cmb.rutas = rutas
    },

    async handleSave() {
      const valid = await this.$refs.form.validate()
      if (!valid.valid) return

      try {
        const usuario = this.store.getNameUser()
        this.data.dataCliente.usuarioRegistro = String(usuario)

        if (!this.localEdit) {

          this.data.disabledBtn = true
          this.data.overlay.show = true
          const result = await this.data.requestHttp.postCliente(this.data.dataCliente)
          this.data.disabledBtn = false
          this.data.overlay.show = false

          if (result.code === 200) {
            this.showSuccesAlert('¡Registro Guardado!', true)
            setTimeout(() => {
              this.$emit('closeDialog', false)
              this.localEdit = false
            }, 1500);
          } else {
            this.showSuccesAlert('No se ha podido guardar el registro', false)
            return
          }

        } else {
          if (this.data.idCliente) {

            this.data.disabledBtn = true
            this.data.overlay.show = true
            const result = await this.data.requestHttp.putCliente(this.data.dataCliente, this.data.idCliente)
            this.data.disabledBtn = false
            this.data.overlay.show = false
            
            if (result.code === 200) {
              this.showSuccesAlert('¡Registro Editado!', true)
              setTimeout(() => {
                this.$emit('closeDialog', false)
                this.localEdit = false
              }, 1500);
            } else {
              this.showSuccesAlert('No se ha podido guardar el registro', false)
              return
            }
          } else {
            this.showSuccesAlert('Hubo un inconveniente, contactese con soporte.', false)
            return
          }
        }
      } catch (error) {
        this.showSuccesAlert('Hubo un inconveniente, contactese con soporte.', false)
        return
      }
    },

    async getCategoriaCliente() {
      this.data.categoriaCliente = []
      const result = await this.data.requestHttp.getCategoriaClientes()
      result.map(item => {
        this.data.categoriaCliente.push({title: item.nombre, value: item.idCategoriaCliente})
      })
    },

    async getDepartamentos() {
      this.data.departamentos = []
      const result = await this.data.requestHttp.getDepartamentos()

      if (result.code === 200) {
        result.data.map(item => {
          this.data.departamentos.push({title: item.nombre, value: item.id})
        })
      }

    },

    formatedDate(dataString) {
      const value = formatters.formatDate(dataString)
      return value
    },

    closeDialog() {
      this.$emit('closeDialog', false)
      this.data.dataCliente = {}
    },

    readonlyOption() {
      if (this.localView) {
        return true
      } else if (this.editar) {
        return false
      } else if (!this.editar && !this.localView) {
        return false
      }
    }
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

</style>