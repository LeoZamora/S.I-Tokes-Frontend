<template>
    <v-dialog v-model="localShow" max-width="400" persistent>
      <v-card rounded="lg" elevation="8">
        <v-card-title class="text-h5 font-weight-bold pa-2 d-flex align-center justify-center" 
          style="background-color: #fef2f2;">
          <v-icon size="32" color="error" class="mr-3">
            mdi-alert-circle-outline
          </v-icon>
          <span style="color: #b91c1c;">
            Realizar Acción
          </span>
        </v-card-title>
        
        <v-divider class="mx-0"/>
        
        <v-card-text class="pa-6 text-center">
          <div class="text-body-1 font-weight-medium mb-2">
            ¿Estás seguro de que deseas realizar esta acción?
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            variant="tonal" 
            color="grey-darken-1" 
            @click="cancelAction()"
            class="px-5"
          >
            Cancelar
          </v-btn>
          <v-btn 
            variant="flat" 
            color="error" 
            @click="deleteItem()"
            class="px-5 ml-2"
            prepend-icon="mdi-check"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { ref, watch } from 'vue';

export default {
    props: {
        show: {
            type: Boolean,
            required: true
        }
    },

    setup(props) {
        const localShow = ref(props.show)
        watch(() => props.show, (val) => {
            localShow.value = val
        })

        return {
            localShow
        }
    },

    methods: {
        deleteItem() {
            this.$emit('deleteItem', true)
            this.localShow = false
        },  

        cancelAction() {
            this.$emit('deleteItem', false)
            this.localShow = false
        }
    }
}
</script>