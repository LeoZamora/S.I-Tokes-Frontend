<template>
    <v-dialog v-model="localShow" max-width="300">
      <v-card rounded="xl">
        <v-divider class="mx-4"/>

        <v-card-text class="text-center px-2">
            <v-icon :color="success ? 'success' : 'error'" size="64">
                {{ success ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
            </v-icon>

            <h3 class="mt-4 mb-2">
                {{ msg }}
            </h3>
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