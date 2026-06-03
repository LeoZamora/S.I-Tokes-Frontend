<template>
  <v-dialog v-model="localShow" max-width="400" persistent>
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
      <v-card-text id="body-card" class="">
        <v-row class="pb-0">
          <v-col cols="12" md="12" sm="12" class="d-flex justify-end align-center pb-0">
            <div v-if="!localEdit" class="d-flex justify-end align-center">
              <small class="mr-2">Fecha de Registro: </small>
              <small>
                <strong>
                  {{ localEdit ? '' : formatedDate(data.nowDate) }}
                </strong>
              </small>
            </div>
          </v-col>
        </v-row>
        <v-card-subtitle class="d-flex align-center text-center my-2">
          <small class="mr-2 font-weight-bold">
            GENERALES
          </small>
          <v-divider/>
        </v-card-subtitle>

        <v-form ref="form">
          <v-row>
            <v-col cols="12" md="12" sm="12" class="py-2">
              <v-text-field v-model="data.dataCat.codigo" prepend-inner-icon="mdi-barcode" density="compact"
                variant="outlined"  label="Código" :rules="data.rules.rule"
                :readonly="readonlyOption()" placeholder="Ingrese un nuevo código"
                persistent-placeholder color="indigo-darken-4"/>
            </v-col>
            <v-col cols="12" md="12" sm="12" class="py-2">
              <v-text-field v-model="data.dataCat.nombre" prepend-inner-icon="mdi-label" density="compact"
                variant="outlined"  label="Categoría" :rules="data.rules.rule"
                placeholder="Ingrese el nombre de la nueva categoría" persistent-placeholder
                :readonly="readonlyOption()" color="indigo-darken-4"/>
            </v-col>
          </v-row>
        </v-form>

      </v-card-text>
      <v-divider/>
      <v-card-actions v-if="!localView">
        <v-btn color="grey" variant="outlined" @click="closeDialog()">
          Cancelar
        </v-btn>
        <v-btn class="bg-indigo-darken-4" @click="handleSave()">
          Guardar
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
import { useStore } from '@/store';
import {reactive, ref, watch} from 'vue';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';

export default {
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
    cat: {
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

  components: {
    SuccessAlert,
    OverlayComp
  },

  setup(props) {
    const localShow = ref(props.show)
    const localEdit = ref(props.editar)
    const localCat = ref(props.cat)
    const localTitle = ref(props.title)
    const localView = ref(props.ver)
    watch(() => props.show, (newValue) => {
      localShow.value = newValue

      if (newValue) {
        data.dataCat.usuarioRegistro = useStore().getNameUser()
      }
    })
    watch(() => props.editar, async (val) => {
      localEdit.value = val
      if (val) {
        data.overlay.show = true
        const result = await data.requestHttp.getByIdCategorias(localCat.value.idCategoriaProducto)
        data.overlay.show = false

        if (result.code === 200) {
          data.dataCat = result.data
          data.idCat = result.data.idCategoriaProducto
        }
      }
    })
    watch(() => props.cat, (val) => {
      localCat.value = val
    })
    watch(() => props.title, (val) => {
      localTitle.value = val
    })
    watch(() => props.ver, async (val) => {
      localView.value = val
      if (val) {
        data.overlay.show = true
        const result = await data.requestHttp.getByIdCategorias(localCat.value.idCategoriaProducto)
        data.overlay.show = false

        if (result.code === 200) {
          data.dataCat = result.data
          data.idCat = result.data.idCategoriaProducto
        }
      }
    })

    const data = reactive({
      rules: {
        rule: [v => !!v || 'Campo Obligatorio']
      },
      nowDate: new Date(),
      dataCat: {
        estado: true,
        fechaRegistro: null,
        idCategoriaProducto: null,
        nombre: null,
        subCategoriaProds: [],
        codigo: '',
        nombre: null,
        usuarioRegistro: null
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

      idCat: null,
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

    return {
      localShow,
      localEdit,
      localTitle,
      localCat,
      localView,
      data,
      showSuccesAlert
    }
  },

  methods: {
    async handleSave() {
      const valid = await this.$refs.form.validate()

      if (!valid.valid) return

      if (!this.localEdit) {

        this.data.overlay.show = true
        const result = await this.data.requestHttp.postCategorias(this.data.dataCat)
        this.data.overlay.show = false

        if (result.code === 200 || result.code === 201) {
          this.showSuccesAlert('¡Registro Guardado!', true)
          setTimeout(() => {
            this.closeDialog()
          }, 1500)
        } else {
          this.showSuccesAlert('¡No se ha podido guardar el registro!', false)
          return
        }
      } else {

        this.data.overlay.show = true
        const result = await this.data.requestHttp.putCategorias(this.data.dataCat, this.data.idCat)
        this.data.overlay.show = false

        if (result.code === 200) {
          this.showSuccesAlert('¡Registro Editado!', true)
          setTimeout(() => {
            this.closeDialog()
          }, 1500)
        } else {
          this.showSuccesAlert('¡No se ha podido editar el registro!', false)
          return
        }
      }
    },

    formatedDate(dataString) {
      const value = formatters.formatDate(dataString)
      return value
    },

    closeDialog() {
      this.$emit('closeDialog', false)
      this.data.dataCat = {}
      this.localEdit = false
      this.localView = false
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