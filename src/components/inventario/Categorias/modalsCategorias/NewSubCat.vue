<template>
  <v-dialog v-model="localShow" max-width="400" persistent>
    <v-card id="diag-fact">
      <v-card-title class="bg-indigo-darken-4 d-flex align-center">
        <h5>
          <v-icon>mdi-account-plus</v-icon>
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
          <v-col cols="12" md="12" sm="12" class="d-flex justify-end align-center pb-0">
            <div class="d-flex justify-end align-center">
              <small class="mr-2">Fecha de Registro: </small>
              <small><strong>{{ localEdit ? '' : formatedDate(data.nowDate) }}</strong></small>
            </div>
          </v-col>
        </v-row>

        <v-card-subtitle class="d-flex align-center text-center my-2">
          <small class="mr-2 font-weight-bold">GENERALES</small>
          <v-divider/>
        </v-card-subtitle>

        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" md="12" sm="12" class="py-2">
              <v-autocomplete v-model="data.dataSubCat.idCategoriaProducto" prepend-inner-icon="mdi-tag-multiple"
                density="compact" :items="data.categorias" @update:model-value="getCodeSub"
                variant="outlined" label="Categoría:" placeholder="Elija una categoría"
                persistent-placeholder :readonly="readonlyOption()" color="indigo-darken-4" 
                :rules="data.rules.rule"/>
            </v-col>
            <v-col cols="12" md="12" sm="12" class="py-2">
              <v-text-field v-model="data.dataSubCat.codigo" prepend-inner-icon="mdi-barcode" density="compact"
                variant="outlined" label="Código:" color="indigo-darken-4"
                :readonly="readonlyOption()" :rules="data.rules.rule"/>
            </v-col>
            <v-col cols="12" md="12" sm="12" class="py-2">
              <v-text-field v-model="data.dataSubCat.nombre" prepend-inner-icon="mdi-label" density="compact"
                variant="outlined" label="Sub Categoría" color="indigo-darken-4"
                placeholder="Ingrese el nombre para la sub categoría" persistent-placeholder
                :readonly="readonlyOption()" :rules="data.rules.rule"/>
            </v-col>

          </v-row>
        </v-form>
      </v-card-text>

      <v-divider/>

      <v-card-actions v-if="!localView">
        <v-btn color="grey" variant="tonal" @click="closeDialog()">
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
import {reactive, ref, watch} from 'vue';
import { useStore } from '@/store';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';

export default {
  mounted() {
    this.getCategorias()
  },

  components: {
    SuccessAlert,
    OverlayComp
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
    subCat: {
      type: Object,
      required: false
    },
    title: {
      type: String,
      required: true,
      default: 'Nueva SubCategoría'
    },
    ver: {
      type: Boolean,
      required: false
    }
  },

  setup(props) {

    const localShow = ref(props.show)
    const localEdit = ref(props.editar)
    const localSubCat = ref(props.subCat)
    const localTitle = ref(props.title)
    const localView = ref(props.ver)

    const data = reactive({
      rules: {
        rule: [v => !!v || 'El campo es obligatorio']
      },
      nowDate: new Date(),
      categorias: [],
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
      dataSubCat: {
        codigo: null,
        estado: null,
        fechaRegistro: null,
        idCategoriaProducto: null,
        idSubCatProd: null,
        nombre: null,
        productos: null,
        usuarioRegistro: null,
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

    watch(() => props.show, (newValue) => {
      localShow.value = newValue
      if (newValue) {
        data.dataSubCat.usuarioRegistro = useStore().getNameUser()
      }
    })

    watch(() => props.subCat, (val) => {
      localSubCat.value = val
    })

    watch(() => props.editar, async (val) => {
      localEdit.value = val
      if (val === true) {
        try {
          data.overlay.show = true
          const result = await data.requestHttp.getByIdSubCategorias(props.subCat.idSubCatProd)
          data.overlay.show = false

          if (result.code === 200) {
            data.dataSubCat = result.data
            data.idCat = localSubCat.value.idSubCatProd
          }
        } catch (error) {
          data.overlay.show = false
          showSuccesAlert('¡No se pudo cargar la informacion!', false)
        }
      }
    })
    watch(() => props.title, (val) => {
      localTitle.value = val
    })
    watch(() => props.ver, async (val) => {
      localView.value = val
      if (val === true) {
        data.overlay.show = true
        const result = await data.requestHttp.getByIdSubCategorias(props.subCat.idSubCatProd)
        data.overlay.show = false

        if (result.code === 200) {
          data.dataSubCat = result.data
          data.idCat = localSubCat.value.idSubCatProd
        }
      }
    })

    return {
      localShow,
      localEdit,
      localTitle,
      localSubCat,
      localView,
      data,
      showSuccesAlert
    }
  },

  methods: {
    async getCodeSub() {
      try {
        this.data.dataSubCat.codigo = await this.data.requestHttp.getCodeSub(this.data.dataSubCat.idCategoriaProducto)
      } catch (error) {
        alert('No se pude obtener el código sugerido.')
      }
    },

    async handleSave() {
      const valid = await this.$refs.form.validate()
      if (!valid.valid) return

      if (!this.localEdit) {
        const result = await this.data.requestHttp.postSubCategorias(this.data.dataSubCat)
        this.data.overlay.show = false

        if (result.code === 200) {
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
        const result = await this.data.requestHttp.putSubCategorias(this.data.dataSubCat, this.data.idCat)
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

    async getCategorias() {
      this.data.categorias = []
      const result = await this.data.requestHttp.getCategorias()

      if (result.code === 200) {
        result.data.map(item => {
          this.data.categorias.push({title: item.nombre, value: item.idCategoriaProducto})
        })
      }

    },
    formatedDate(dataString) {
      const value = formatters.formatDate(dataString)
      return value
    },

    closeDialog() {
      this.$emit('closeDialog', false)
      this.data.dataSubCat = {}
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