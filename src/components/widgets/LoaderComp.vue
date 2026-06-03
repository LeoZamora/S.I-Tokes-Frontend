<template>
    <v-overlay v-model="show" max-width="100%" max-height="100%"
      class="overlay d-flex justify-center align-center" contained persistent
    >
      <v-card class="text-center pa-2 bg-transparent" elevation="0"
        style="min-width: 200px;"
      >
        <v-card-text>
          <img width="100"  src="/devo-white.svg" alt="loading" />
          <h4 class="text-white py-1" style="margin-top: 1px;">
            {{ data }}
          </h4>
          <v-progress-linear color="white" indeterminate rounded height="4"/>
        </v-card-text>
      </v-card>
    </v-overlay>
</template>

<script>
import { computed, reactive } from 'vue';

  export default {
    props: {
      data: {
        type: String,
      },
      show: {
        type: Boolean,
        required: true
      }
    },

    name: "LoaderCard",

    setup(props) {
      const show = computed(() => props.show)
      const state = reactive({
        show: true
      })

      return {
        state,
        show
      }
    }
  };
  </script>
  
<style scoped>
@keyframes opacityOn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2000;
  }

  #card-logo{
    width: 250px;
    height: 150px;
  }
  
  .loader-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001;
  }
  
  .loading-image {
    width: 80px;
    height: 100%;
    /* animation: spin 2s linear infinite; */
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
  