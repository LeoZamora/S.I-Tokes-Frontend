<template>
    <v-dialog v-model="localShow" max-width="300">
      <v-card rounded="lg" flat class="pa-3">
        <v-card-text class="d-flex flex-column text-center align-center pa-4">
          <!-- Círculo de fondo sutil -->
          <v-avatar size="48"
            :class="success ? 'bg-success' : 'bg-error'" 
            class="rounded-circle pa-4 mb-4"
          >
            <v-icon color="'white'" >
              {{ success ? 'mdi-check' : 'mdi-alert-circle' }}
            </v-icon>
          </v-avatar>
          
          <span class="text-uppercase text-body-1 font-weight-bold">
            {{ msg }}
          </span>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
import { ref, watch } from 'vue'

export default {
    props: {
        show: {
            type: Boolean,
            required: true
        }, 
        msg: {
            type: String,
            required: false,
            default: ''
        },
        success: {
            type: Boolean,
            required: true
        },
    },

    setup(props) {
        const localShow = ref(props.show)
        watch(() => props.show, (val) => {
            localShow.value = val
        })

        const message = ref(props.msg)
        watch(() => props.msg, (val) => {
            message.value = val
        })

        return {
            localShow,
            message
        }
    },

    methods: {
        closeDialog() {
            this.$emit('closDialog', true)
            this.localShow = false
        }  
    }
}
</script>

<style scoped>
.dialog-center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>