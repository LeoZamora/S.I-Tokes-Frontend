<template>
  <v-card>
    <v-card-title>{{ `Abonar a cuenta (Factura N° ${credito.noVenta})` }}</v-card-title>
    <v-card-subtitle>
      Saldo actual:
      <strong class="text-error">
        {{ formatedCurrency(credito.saldo) }}
      </strong>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text>
      <v-form ref="form">
        <v-row dense>
          <v-col cols="12">
            <v-autocomplete
              variant="outlined"
              v-model="abono.idModalidad"
              label="Modalidad:"
              density="compact"
              :items="cmb.modalidades"
              :rules="[v => !!v || 'Requerido.']"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-text-field
              variant="outlined"
              v-model="abono.numReferencia"
              label="N° Referencia:"
              placeholder="n° de cheque, transferencia, etc."
              persistent-placeholder
              density="compact"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              variant="outlined"
              v-model="abono.monto"
              label="Monto:"
              density="compact"
              placeholder="0.00"
              persistent-placeholder
              type="number"
              :rules="[v => !!v || 'Requerido.']"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              variant="outlined"
              v-model="abono.fechaMovimiento"
              label="Fecha:"
              type="date"
                density="compact"
                :rules="[v => !!v || 'Requerido.']"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              variant="outlined"
              v-model="abono.observaciones"
              label="Observaciones:"
              density="compact"
              placeholder="Observaciones del abono..."
              persistent-placeholder
              rows="2"
              auto-grow
            ></v-textarea>
          </v-col>
        </v-row>

        <OverlayComp :show="showOverlay" />
      </v-form>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="close" color="secondary" variant="text"
        :disabled="disabledForm">
        Cancelar
      </v-btn>
      <v-btn @click="guardar" color="indigo-darken-4" variant="elevated"
        :disabled="disabledForm">
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {getDate} from "@/scripts/utils.js";
import {useLoading} from "@/composables/use-loading.js";
import {useSnackbar} from "@/composables/use-snackbar.js";
import {getItemsCombobox} from "@/scripts/api.js";
import {formatters} from "@/helpers/formatters.js";
import axios from "axios";
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';

export default {
  name: 'abonar-cuenta',

  props: {
    credito: {
      type: Object,
      required: true
    }
  },


  components: {
    OverlayComp
  },

  data(){
    return {
      snackbar: useSnackbar(),
      loading: useLoading(),

      disabledForm: false,

      abono: {
        idModalidad: 1,
        numReferencia: '',
        monto: null,
        fechaMovimiento: getDate(),
        observaciones: '',
        usuarioRegistro: JSON.parse(localStorage.getItem('token')).usuario
      },

      showOverlay: false,

      cmb: {
        modalidades: []
      }
    }
  },

  methods: {
    async loadCmbModalidades(){
      const modalidades = await getItemsCombobox('api/modalidades/combobox')
      this.cmb.modalidades = modalidades
    },

    async guardar(){
      const valid = await this.$refs.form.validate()

      if(!valid.valid){
        this.snackbar.notify('error', 'Rellene los campos requeridos.')
        return
      }

      // this.loading.load(true)

      try {
        this.disabledForm = true
        this.showOverlay = true
        const response = await axios.post(`api/creditos/${this.credito.idDetalleCxc}/abonos`, this.abono)
        this.disabledForm = false
        this.showOverlay = false
        // this.loading.load(false)

        if(response.status === 200 || response.status === 201) {
          this.close()
          this.snackbar.notify('info', 'Abono registrado correctamente.')
          this.$refs.form.reset()
        } else if(response.status === 403) {
          return this.notify.notify(
            'error',
            'No tiene los permisos necesarios.',
          )
        } else {
          return this.snackbar.notify(
            'error',
            response.data?.msg
            ?? 'Ha surgido un inconveniente al guardar el registro'
          )
        }

      }
      catch (e) {
        this.disabledForm = false
        this.showOverlay = false
        this.handleException(e)
      }
    },

    //FORMATERS
    formatedCurrency(key) {
      return formatters.formatCurrency(key)
    },

    //HANDLERS
    handleException(ex) {
      this.loading.load(false)
      if (ex.status == 401) {
        //void
      } else if (ex.status == 403) {
        this.notify.notify(
            'error',
            'No tiene los permisos necesarios.',
        )
      } else {
        ex.data ?
          this.snackbar.notify(
            'error',
            ex.data.msg,
          ) :
          console.log(ex)
      }
    },

    //DISPLAY
    close(){
      this.$emit('close')
    }
  },

  mounted() {
    this.loadCmbModalidades()
  }
}
</script>

<style scoped>

</style>