<template>
    <v-alert
        v-model="data.internalShow"
        :type="tipo"
        variant="tonal"
        closable
        density="compact"
        class="ma-3"
    >
        {{ message }}
    </v-alert>
</template>

<script>
import { reactive, watch } from 'vue';


export default {
  name: 'AlertComp',

  props: {
    show: {
      type: Boolean,
      default: false,
    },
    tipo: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
  },

  setup(props) {
    const data = reactive({
        internalShow: false,
    })

    watch(() => props.show, (val) => {
        data.internalShow = val
    })

    return {
        data,
    }
  },
}
</script>

<style scoped>
</style>