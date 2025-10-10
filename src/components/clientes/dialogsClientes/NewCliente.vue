<template>
  <v-dialog v-model="localShow" max-width="600" persistent>
    <v-card id="diag-fact">
      <v-card-title class="bg-primary d-flex align-center">
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
      <v-card-text id="body-card" class="">
        <v-row class="pb-0">
          <v-col v-if="!localEdit" cols="6" md="6" sm="6" class="d-flex justify-start align-center pb-0">
            <div class="d-flex justify-start align-center">
              <small class="mr-2">Fecha de Registro: </small>
              <small><strong>{{ localEdit ? '' : formatedDate(data.nowDate) }}</strong></small>
            </div>
          </v-col>
          <v-col :cols="localEdit ? 12 : 6" :md="localEdit ? 12 : 6" :sm="localEdit ? 12 : 6"
                 class="d-flex justify-end align-center pb-0">
            <v-checkbox v-model="data.dataCliente.personaNatural" color="indigo" density="compact" class="label"
                        hide-details :readonly="readonlyOption()">
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
          <v-row>
            <v-col cols="12" md="12" sm="12" class="py-2">
              <v-select
                  v-model="data.dataCliente.idCategoriaCliente"
                  :items="data.categoriaCliente"
                  density="compact"
                  variant="outlined"
                  label="Tipo Cliente"
                  placeholder="tipo de Cliente"
                  hide-details
                  persistent-placeholder
                  :rules="[v => !!v || 'Requerido.']"
                  :readonly="readonlyOption()"
              ></v-select>
            </v-col>
            <v-col cols="12" md="12" sm="12" class="py-2">
              <v-text-field v-model="data.dataCliente.nombre" prepend-inner-icon="mdi-account" density="compact"
                :rules="[v => !!v || 'Requerido.']"
                variant="outlined" hide-details label="Nombre:" placeholder="Ingrese el nombre del cliente"
                persistent-placeholder :readonly="readonlyOption()"/>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="py-2">
              <v-autocomplete :items="data.departamentos" v-model="data.dataCliente.idDepartamento"
                @update:model-value="getMunicipios"
                density="compact"
                :rules="[v => !!v || 'Requerido.']"
                variant="outlined" hide-details label="Departamento" placeholder="ingrese un departamento"
                persistent-placeholder :readonly="readonlyOption()"/>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="py-2">
            <v-autocomplete :items="data.municipios" v-model="data.dataCliente.idMunicipio"
              density="compact"
              variant="outlined" hide-details label="Municipio" placeholder="ingrese un municipio"
              persistent-placeholder :readonly="readonlyOption()"/>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="py-2">
              <v-autocomplete :items="cmb.rutas" v-model="data.dataCliente.idRuta"
                :rules="[v => !!v || 'Requerido.']"
                prepend-inner-icon="mdi-map-marker" density="compact"
                variant="outlined" hide-details label="Ruta:" placeholder="Ruta que cubre al cliente"
                persistent-placeholder :readonly="readonlyOption()"/>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="py-2">
              <v-text-field v-model="data.dataCliente.telefono" prepend-inner-icon="mdi-phone" density="compact"
                variant="outlined" hide-details label="Teléfono" placeholder="teléfono del Cliente"
                persistent-placeholder type="number" :readonly="readonlyOption()"/>
            </v-col>
            <v-col cols="12" md="12" sm="12" class="py-2">
              <v-textarea v-model="data.dataCliente.direccion" prepend-inner-icon="mdi-text" density="compact"
                variant="outlined" hide-details label="Dirección" placeholder="dirección del Cliente"
                persistent-placeholder :rows="2" :readonly="readonlyOption()"/>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider/>
      <v-card-actions v-if="!localView">
        <v-btn color="grey" variant="outlined" @click="closeDialog()">
          Cancelar
        </v-btn>
        <v-btn class="bg-primary" @click="handleSave()">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {formatters} from '@/helpers/formatters';
import {utilsFunctions} from '@/helpers/utilFunctions';
import RequestHttp from '@/services/requestHttp';
import {reactive, ref, watch} from 'vue';
import {getItemsCombobox} from "@/scripts/api.js";

export default {
  mounted() {
    this.getCategoriaCliente()
    this.getDepartamentos()
    this.loadCmbRutas()

    this.data.dataCliente.usuarioRegistro = JSON.parse(localStorage.getItem('token')).usuario
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
        nombre: null,
        ruta: null,
        telefono: null,
        usuarioRegistro: null,
      },
      departamentos: [],
      municipios: [],
      idCliente: null,
      categoriaCliente: [],
      requestHttp: new RequestHttp()
    })
    
    watch(() => props.show, (newValue) => {
      localShow.value = newValue
    })
    watch(() => props.editar, (val) => {
      localEdit.value = val
            
      if (val === true) {
        data.dataCliente.codigo = localCliente.value.codigo
        data.dataCliente.usuarioRegistro = localCliente.value.usuarioRegistro
        data.dataCliente.telefono = localCliente.value.telefono
        data.dataCliente.departamento = localCliente.value.departamento
        data.dataCliente.municipio = localCliente.value.municipio
        data.dataCliente.direccion = localCliente.value.direccion
        data.dataCliente.idCategoriaCliente = localCliente.value.idCategoriaCliente
        data.idCliente = localCliente.value.idCliente
      }
    })
    watch(() => props.prov, (val) => {
      localCliente.value = val
      
      if (val) {
        data.dataCliente = localCliente.value
        data.idCliente = localCliente.value.idCliente
      }
    })
    watch(() => props.title, (val) => {
      localTitle.value = val
    })

    async function getMunicipios() {
      data.municipios = []
      const result = await data.requestHttp.getMunById(data.dataCliente.idDepartamento)
      result.map(item => {
        data.municipios.push({title: item.nombre, value: item.id})
      })
    }

    watch(() => data.dataCliente.idDepartamento, (val) => {
      if (val) {
        getMunicipios()
      }
    })

    watch(() => props.ver, (val) => {
      localView.value = val
      if (val === true) {        
      }
    })

    return {
      localShow,
      localEdit,
      localTitle,
      localCliente,
      localView,
      data,
      getMunicipios,
    }
  },

  methods: {
    async loadCmbRutas() {
      var rutas = await getItemsCombobox('api/rutas/combobox')
      this.cmb.rutas = rutas
    },

    async handleSave() {
      if (!this.localEdit) {
        if (this.$refs.form.validate()) {
          const result = await this.data.requestHttp.postCliente(this.data.dataCliente)

          if (result !== null) {
            alert('Registro Guardado')
            this.$emit('closeDialog', false)
            this.localEdit = false
          } else {
            alert('No se pudo guardar el registro')
          }
        } else {
          alert('Complete toda la información')
          return
        }
      } else {
        if (this.$refs.form.validate() && this.data.idCliente) {
          const result = await this.data.requestHttp.putCliente(this.data.dataCliente, this.data.idCliente)
          if (result !== null) {
            alert('Registro Editado')
            this.$emit('closeDialog', false)
            this.localEdit = false
          } else {
            alert('Registro Editado')
          }
        } else {
          alert('Complete toda la información')
          return
        }
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
      result.map(item => {
        this.data.departamentos.push({title: item.nombre, value: item.id})
      })
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