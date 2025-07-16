<template>
    <v-app-bar id="nav" class="w-100 position-fixed border bg-primary" elevation="0">
      <LoaderComp v-show="data.dataLoader.visible" :data="data.dataLoader.msg"/>
        <v-app-bar-nav-icon class="mr-2" @click="$emit('toggle-drawer')"/>
        <div class="ml-4 pa-1 d-flex justify-center align-center">
          <!-- <v-img src="/logo.png" width="100"/> -->
          <div id="text-logo" class="d-flex justify-center align-center">
              <h2>Inversiones Zafiro</h2>
          </div>
        </div>
        <v-spacer id="spacer-logo"></v-spacer>
        <v-spacer></v-spacer>
        <template v-slot:append>
          <v-row justify="center">
            <v-menu transition="scroll-y-transition">
              <template v-slot:activator="{ props }">
                <v-btn icon class="mr-5" elevation="0" v-bind="props">
                  <v-icon>mdi-account</v-icon>
                </v-btn>
              </template>

              <v-card class="rounded-lg" elevation="4" width="280" style="top: 5px; left: 10px;">
                <v-card-text class="text-center">
                  <v-avatar size="64" class="mx-auto mb-2" color="primary">
                    <v-icon size="36">mdi-account</v-icon>
                  </v-avatar>
                  <h3 class="text-h6 mb-1">Guest</h3>
                </v-card-text>

                <v-divider class="my-1"></v-divider>

                <v-list density="compact">
                  <v-list-subheader><small class="font-weight-bold">GESTIÓN DEL SISTEMA</small></v-list-subheader>
                  <v-list-group>
                    <template v-slot:activator="{ props }">
                      <v-list-item v-bind="props" v-for="(item, i) in data.settings" :key="i" :prepend-icon="item.icon" rounded :value="item"
                        color="primary" class="mx-2" :title="item.name"/>
                    </template>
                    <v-list-item class="mx-2" rounded :lines="true" color="primary" v-for="([title, icon], i) in accesosFiltrados"
                      :key="i" :value="title" @click="emitNameRoute(title)" :append-icon="icon">
                      <v-list-item-title>{{ title }}</v-list-item-title>
                    </v-list-item>
                  </v-list-group>
                </v-list>

                <v-divider class="my-1"></v-divider>

                <!-- Logout -->
                <v-card-actions class="justify-center">
                  <v-tooltip text="Cerrar Sesión" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" class="cursor-pointer" @click="logout">mdi-logout</v-icon>
                    </template>
                  </v-tooltip>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-row>
        </template>
    </v-app-bar>
</template>

<script>
import { computed, reactive } from 'vue';
import LoaderComp from '../widgets/LoaderComp.vue';
import { useStore } from '@/store';

export default {
  mounted() {
    this.verifyDataSecurity()
  },

  setup() {
    const store = useStore()
    const isLoggeInd = computed(() => store.isLoggedIn)
    const data = reactive({
      settings: [{
        name: 'Configuraciones',
        icon: 'mdi-cog-outline'
      }],
      accesos: [
        ['Roles', 'mdi-shield-account'],
        ['Usuarios', 'mdi-account-multiple'],
      ],
      dataLoader: {
        msg: '',
        visible: false
      },
      views: {
        roles: false,
        user: false
      },
    })
    const accesosFiltrados = computed(() => {
      return data.accesos.filter(([title]) => {
        if (title === 'Roles' && !data.views.roles) return false
        if (title === 'Usuarios' && !data.views.user) return false
        return true
      })
    })
    return {
      data,
      store,
      accesosFiltrados
    }
  },

  components: {
    LoaderComp
  },

  methods: {
    verifyDataSecurity() {
      const token = this.store.getInfoUser()
      const ventanas = token.ventanasAcceso.split(",")
      
      ventanas.map(item => {
        switch(item) {
          case '4': this.data.views.roles = true
              break;
          case '5': this.data.views.user = true
              break;
        }
      })
    },

    emitNameRoute(name) {
      this.$emit('nameRoute', name)
    },

    async delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    async logout() {
      this.data.dataLoader.visible = true
      this.data.dataLoader.msg = 'Cerrando Sesion'
      this.$emit('logout')

      await this.delay(1500);

      this.store.logout()
      this.data.dataLoader.visible = false
    }
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