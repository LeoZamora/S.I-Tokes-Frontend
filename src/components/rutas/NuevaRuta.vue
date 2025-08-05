<template>
  <v-dialog v-model="localShow" max-width="600" persistent>
    <v-card id="diag-fact">
      <v-card-title class="bg-indigo-darken-4 d-flex align-center">
        <h5>
          <v-icon>mdi-file-document-outline</v-icon>
          {{ localTitle }}
        </h5>
        <v-spacer/>
        <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
          <v-icon>mdi-close</v-icon>
          <v-tooltip activator="parent" location="top" text="Cerrar"/>
        </v-btn>
      </v-card-title>
      <v-divider/>
      <v-card-text id="body-card">
        <v-row class="pb-0">
          <v-col cols="12" md="12" sm="12" class="w-100 d-flex justify-end align-center pb-0">
            <div class="d-flex justify-end align-end">
              <small class="mr-2">Fecha Registro: </small>
              <small><strong>{{ formatedDate(data.emision) }}</strong></small>
            </div>
          </v-col>
        </v-row>
        <v-card-subtitle class="d-flex align-center text-center my-4">
          <small class="mx-6 font-weight-bold">GENERALES</small>
          <v-divider/>
        </v-card-subtitle>
        <v-form validate-on="invalid-input" ref="form">
          <v-row dense>
            <v-col cols="12" md="4" sm="4">
              <v-text-field v-model="data.ruta.codigo" prepend-inner-icon="mdi-identifier"
                            density="compact" variant="outlined" :hide-details="data.hide ? true : false"
                            label="Código" placeholder="nº Ruta" persistent-placeholder/>
            </v-col>
            <v-col cols="12" md="4" sm="4">
              <v-text-field v-model="data.ruta.nombre" :rules="data.rules.rule" prepend-inner-icon="mdi-routes"
                            density="compact" variant="outlined" :hide-details="data.hide ? true : false"
                            label="Nombre" placeholder="nombre de la ruta" persistent-placeholder/>
            </v-col>
            <v-col cols="12" md="4" sm="4">
              <v-text-field v-model="data.ruta.gestor" :rules="data.rules.rule"
                            prepend-inner-icon="mdi-account-question"
                            density="compact" variant="outlined" :hide-details="data.hide ? true : false"
                            label="Gestor" placeholder="gestor de la ruta" persistent-placeholder/>
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <v-textarea v-model="data.ruta.descripcion" density="compact" variant="outlined"
                          :hide-details="data.hide ? true : false" label="Descripción"
                          placeholder="ingrese algunos detalles de la ruta"
                          persistent-placeholder rows="3"/>
            </v-col>
          </v-row>
        </v-form>
        <v-card-subtitle class="d-flex align-center text-center my-4">
          <small class="mx-6 font-weight-bold">COBERTURAS</small>
          <v-divider/>
        </v-card-subtitle>
        <v-row dense>
          <v-col cols="12" md="6" sm="6">
            <v-autocomplete v-model="data.cobertura.idDepartamento" prepend-inner-icon="mdi-shopping" density="compact"
                            variant="outlined"
                            :hide-details="data.hide ? true : false" label="Departamento" placeholder="departamentos"
                            persistent-placeholder
                            :items="data.departamentos" @update:model-value="getMunicipios"/>
          </v-col>
          <v-col cols="12" md="6" sm="6">
            <v-autocomplete v-model="data.cobertura.idMunicipio" prepend-inner-icon="mdi-shopping" density="compact"
                            variant="outlined"
                            :hide-details="data.hide ? true : false" label="Municipios" placeholder="municipios"
                            persistent-placeholder
                            :items="data.municipios"/>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-textarea density="compact" variant="outlined" v-model="data.cobertura.observaciones"
                        :hide-details="data.hide ? true : false" label="Descripción"
                        placeholder="ingrese algunos detalles de la ruta"
                        persistent-placeholder rows="1"/>
          </v-col>
          <v-col cols="12" md="12" sm="12" class="d-flex justify-end align-center py-0">
            <v-btn icon class="border mr-2" color="grey" size="small" variant="text" @click="clearProductos()">
              <v-icon>mdi-broom</v-icon>
              <v-tooltip activator="parent" location="bottom">Limpiar</v-tooltip>
            </v-btn>

            <v-btn icon color="indigo-darken-4" size="small" variant="tonal" @click="addCobertura()">
              <v-icon>mdi-plus</v-icon>
              <v-tooltip activator="parent" location="bottom">Agregar Ruta</v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-data-table class="border rounded font" density="compact" :headers="data.headers" :items="data.items"
                          hide-default-footer>
              <template v-slot:item.opc="{ item }">
                <v-tooltip text="Eliminar" location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" color="error" @click="deleteProduct(item)" class="mr-1">mdi-delete</v-icon>
                  </template>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider/>
      <v-card-actions>
        <v-btn color="grey" variant="outlined" @click="closeDialog()">
          Cancelar
        </v-btn>
        <v-btn class="bg-indigo-darken-4" @click="guardarRuta()">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {formatters} from '@/helpers/formatters';
import RequestHttp from '@/services/requestHttp';
import {reactive, ref, watch} from 'vue';
import {httpGet} from '@/scripts/api.js'

export default {
  mounted() {
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

  setup(props) {
    const getRuta = async (id) => {
      return await data.requestHttp.getByIdRuta(id)
    }
    const token = ref(JSON.parse(localStorage.getItem('token')))
    const localShow = ref(props.show)
    const localEdit = ref(props.editar)
    const localRuta = ref(props.idRuta)
    const localTitle = ref(props.title)
    watch(() => props.show, async (newValue) => {
      localShow.value = newValue
      var cod = await httpGet('api/Ruta/no-Ruta')
      data.ruta.noRuta = String(cod)
    })
    watch(() => props.editar, async (val) => {
      localEdit.value = val
      if (val === true) {
        const result = await data.requestHttp.getByIdRuta(localRuta.value)
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
        {title: '', key: 'opc', align: 'center'},
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
      token
    }
  },

  methods: {
    async getDepartamentos() {
      this.data.departamentos = []
      this.data.loading = true
      const result = await this.data.requestHttp.getDepartamentos()
      this.data.loading = false
      result.map(item => {
        this.data.departamentos.push({title: item.nombre, value: item.id})
      })
    },

    async getMunicipios() {
      this.data.municipios = []
      this.data.loading = true
      const result = await this.data.requestHttp.getMunById(this.data.cobertura.idDepartamento)
      this.data.loading = false
      result.map(item => {
        this.data.municipios.push({title: item.nombre, value: item.id})
      })
    },

    async getEmpleados() {
      this.data.empleados = []
      this.data.loading = true
      const result = await this.data.requestHttp.getUsuarios()
      this.data.loading = false
      result.map(item => {
        this.data.empleados.push({title: item.username, value: item.username})
      })
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
      if (!this.data.cobertura.idDepartamento || !this.data.cobertura.idMunicipio) {
        alert('Ingrese la informacion necesaria.')
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
        departamento: departamento.title,
        municipio: municipio.title,
        observaciones: obs
      })

      this.data.ruta.coberturasRuta.push({
        ...this.data.cobertura,
        observaciones: obs
      })
      this.data.cobertura.idDepartamento = null
      this.data.cobertura.idMunicipio = null
      this.data.cobertura.observaciones = null
    },

    deleteProduct(itemSelected) {
      const items = this.data.items.filter(item => item.idProducto !== itemSelected.idProducto)
      this.data.items = []
      items.map(item => {
        this.data.items.push(item)
      })
    },

    async guardarRuta() {
      const valid = await this.$refs.form.validate()
      if (!valid.valid) {
        alert('Complete la información.')
        return
      }
      this.data.ruta.usuarioRegistro = this.token.usuario
      if (!this.localEdit) {
        const result = await this.data.requestHttp.postRuta(this.data.ruta)

        if (!result.code) {
          alert('Registro Guardado')
          this.closeDialog()
        } else {
          alert(result.msg)
          return
        }
      } else {
        if (!this.data.ruta.codigo ||
            !this.data.ruta.descripcion ||
            !this.data.ruta.gestor ||
            !this.data.ruta.nombre ||
            !this.data.ruta.usuarioRegistro ||
            this.data.ruta.coberturasRuta.length === 0
        ) {
          alert('Complete la informacion de la orden')
          return
        } else {
          const result = await this.data.requestHttp.putRuta(this.data.ruta, this.localRuta)

          if (result !== null) {
            alert('Registro Editado')
            this.closeDialog()
          } else {
            alert('Registro Editado')
            this.closeDialog()
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
      this.data.ruta = {}
      this.data.editRuta = {}
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