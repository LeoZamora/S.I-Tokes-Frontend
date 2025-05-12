<template>
    <v-app-bar id="nav" class="w-100 position-fixed border bg-red-darken-4" elevation="0">
      <!-- <LoaderComp v-show="data.dataLoader.visible" :data="data.dataLoader.msg"/> -->
        <v-app-bar-nav-icon class="mr-2" @click="$emit('toggle-drawer')"/>
        <div id="logo" class="ml-4 pa-1 d-flex justify-center align-center">
          <!-- <v-img src="/logo.png" width="100"/> -->
          <div id="text-logo" class="d-flex justify-center align-center">
              <h2>T O K E S</h2>
          </div>
        </div>
        <v-spacer id="spacer-logo"></v-spacer>
        <v-spacer></v-spacer>
        <template v-slot:append>
            <v-row justify="center">
              <v-menu transition="scroll-y-transition">
                <template v-slot:activator="{ props }">
                  <v-btn icon class="mr-5" elevation="0">
                      <v-icon v-bind="props">mdi-account</v-icon>
                  </v-btn>
                </template>
                <v-card class="rounded-lg" elevation="4" width="200" style="left: 20px; top: 15px;">
                  <v-card-text>
                    <div class="mx-auto text-center">
                      <v-avatar color="red-darken-4">
                        <v-icon>mdi-account</v-icon>
                      </v-avatar>
                      <h3>Usuario</h3>
                      <p class="text-caption mt-1">Invitado</p>
                    </div>
                  </v-card-text>
                  <v-divider class="mx-2"></v-divider>
                  <v-card-actions class="pa-0 d-flex justify-center">
                      <v-tooltip activator="parent" location="bottom">Cerrar Sesión</v-tooltip>
                      <v-icon class="cursor-pointer" @click="logout">mdi-logout</v-icon>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-row>
        </template>
    </v-app-bar>    
</template>

<script>
import { reactive } from 'vue';
// import LoaderComp from '../reutilizable/LoaderComp.vue';
// import { useStore } from '@/store';

export default {
    setup() {
    //   const authUser = useStore()
      const data = reactive({
        dataLoader: {
          msg: '',
          visible: false
        }
      })
      return {
        data,
        // authUser
      }
    },

    components: {
    //   LoaderComp
    },

    methods: {
    //   async delay(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms))
    //   },

    //   async logout() {
    //     this.data.dataLoader.visible = true
    //     this.data.dataLoader.msg = 'Cerrando Sesion'

    //     await this.delay(1500);

    //     this.authUser.logout()
    //     this.$emit('logout')
    //     // this.$router.push({ path: '/' })
    //     this.data.dataLoader.visible = false
    //   }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

#nav{
  font-family: Poppins;
  z-index: 99;
}

#logo img:hover{
  cursor: pointer;
}

#logo h4, #logo small{
  color: white;
}

#step{
  width: 50%;
}

/* #text-logo, #text-logo small{
  font-size: 10px;
} */


@media screen and (max-width: 750px){
  .forms h4{
    font-size: 3vw;
  }
}

@media screen and (max-width: 500px) {
  #logo{
    display: none !important;
  }

  #spacer-logo{
    display: none !important;
  }

  #step{
    width: 100%;
  }
}

</style>