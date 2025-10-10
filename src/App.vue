<template>
  <v-layout>
    <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
        location="top right"
    >
      <div class="d-flex">
        <v-icon size="large">
          {{ snackbar.icon }}
        </v-icon>
        <v-divider
            vertical
            class="mx-2"
        ></v-divider>
        <div style="font-size: 16px">
          {{ snackbar.text }}
        </div>
      </div>
    </v-snackbar>
    <!-- <LoginAuth v-if="!isLoggeInd"/> -->
    <v-app id="app" class="w-100 h-100">
      <AppBar v-if="isLoggeInd" @toggle-drawer="toggleDrawer" @nameRoute="nameTab" @logout="clearApp"/>

      <v-navigation-drawer v-if="isLoggeInd" id="drawer" v-model="data.drawer" 
        class="position-fixed bg-indigo-darken-4 font">
        <v-list density="compact" v-model:selected="data.selectedItems" :mandatory="true" select-strategy="leaf">
          <v-list-item prepend-icon="mdi-home" color="white" title="Inicio" :lines="true" rounded
            value="Inicio" @click="clearApp()" variant="elevated"/>

          <v-list-item
              @click="nameTab('Resumen Inventario')"
              prepend-icon="mdi-package" title="Resumen Inventario" :lines="true" rounded
              value="Resumen Inventario"></v-list-item>

          <v-list-subheader><small class="font-weight-bold text-white">Gestión General</small></v-list-subheader>

          <v-list-group prepend-icon="mdi-cash-register">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" rounded value="Venta" :lines="true" color="white"
                title="Ventas"/>
            </template>
            <v-list-item class="mx-2" rounded :lines="true" color="white"
              v-for="([title, route, icon], i) in ventasFiltradas"
              :key="i" :value="title" @click="nameTab(route)">
              <template v-slot:prepend>
                  <v-icon>mdi-menu-right</v-icon>
                </template>
                <small>{{ title }}</small>
            </v-list-item>
          </v-list-group>

          <v-list-group prepend-icon="mdi-cash-clock">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" rounded value="Por Cobrar" :lines="true" color="white"
                           title="Por Cobrar"/>
            </template>
            <v-list-item class="mx-2" rounded :lines="true" color="white"
                         v-for="([title, route, icon], i) in data.cxcActions"
                         :key="i" :value="title" @click="nameTab(route)">
              <template v-slot:prepend>
                <v-icon>mdi-menu-right</v-icon>
              </template>
              <small>{{ title }}</small>
            </v-list-item>
          </v-list-group>

          <v-list-group prepend-icon="mdi-cart-arrow-down">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" rounded value="Compras" :lines="true" color="white"
                title="Compras"/>
            </template>
            <v-list-item class="mx-2" rounded :lines="true" color="white"
              v-for="([title, route, icon], i) in comprasFiltradas"
              :key="i" :value="title" @click="nameTab(route)">
              <template v-slot:prepend>
                  <v-icon>mdi-menu-right</v-icon>
                </template>
                <small>{{ title }}</small>
            </v-list-item>
          </v-list-group>
          <v-list-group prepend-icon="mdi-account">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" rounded value="Clientes" :lines="true" color="white"
                           title="Clientes"/>
            </template>
            <v-list-item class="mx-2" rounded :lines="true" color="white"
                         v-for="([title, route, icon], i) in data.clientes"
                         :key="i" :value="title" @click="nameTab(route)">
              <template v-slot:prepend>
                <v-icon>mdi-menu-right</v-icon>
              </template>
              <small>{{ title }}</small>
            </v-list-item>
          </v-list-group>
          <v-list-subheader><small class="font-weight-bold text-white">Gestión Logística</small></v-list-subheader>

          <v-list-group prepend-icon="mdi-truck-off-road">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" rounded value="Rutas" :lines="true" color="white"
                title="Rutas"/>
            </template>
            <v-list-item class="mx-2" rounded :lines="true" color="white"
              v-for="([title, route, icon], i) in data.rutas"
              :key="i" :value="title" @click="nameTab(route)">
              <template v-slot:prepend>
                  <v-icon>mdi-menu-right</v-icon>
                </template>
                <small>{{ title }}</small>
            </v-list-item>
          </v-list-group>

          <v-list-group prepend-icon="mdi-package-variant">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" rounded value="Inventario" :lines="true" color="white"
                title="Inventario"/>
            </template>
            <v-list-item class="mx-2" rounded :lines="true" color="white"
              v-for="([title, route, icon], i) in data.managerStock"
              :key="i" :value="title" @click="nameTab(route)">
              <template v-slot:prepend>
                  <v-icon>mdi-menu-right</v-icon>
                </template>
                <small>{{ title }}</small>
            </v-list-item>
          </v-list-group>


          <v-list-subheader><small class="font-weight-bold text-white">Gestión Empresarial</small></v-list-subheader>
          <v-list-group prepend-icon="mdi-abacus">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" rounded value="Movimientos" :lines="true" color="white"
                title="Movimientos"/>
            </template>
            <v-list-item class="mx-2" rounded :lines="true" color="white"
              v-for="([title, route, icon], i) in data.movimientos"
              :key="i" :value="title" @click="nameTab(route)">
              <template v-slot:prepend>
                  <v-icon>mdi-menu-right</v-icon>
                </template>
                <small>{{ title }}</small>
            </v-list-item>
          </v-list-group>

          <v-list-group prepend-icon="mdi-calendar">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" rounded value="Cierres" :lines="true" color="white"
                title="Cierres"/> 
            </template>
            <v-list-item class="mx-2" rounded :lines="true" color="white"
              v-for="([title, route, icon], i) in data.cierres"
              :key="i" :value="title" @click="nameTab(route)">
              <template v-slot:prepend>
                  <v-icon>mdi-menu-right</v-icon>
                </template>
                <small>{{ title }}</small>
            </v-list-item>
          </v-list-group>
        </v-list>
        <template v-slot:append>
          <v-divider class="mx-4"/>
          <div class="d-flex justify-center pa-2 align-center">
            <div class="d-flex flex-column align-center bg-white pa-1 rounded-lg">
              <v-img width="30" src="/32px.png"></v-img>
            </div>
            <v-divider vertical class="mx-3"></v-divider>
            <div class="d-flex flex-column align-center">
              <h6 style="font-size: 10px;">
                Inversiones Zafiro
              </h6>
              <h6 style="font-size: 10px;">
                v1.0.0
              </h6>
            </div>
          </div>
        </template>
      </v-navigation-drawer>

      <v-main class="w-100 position-relative">
        <TabsRoutes :routes="data.nameTabs" :name="data.nameCurrentTab" :index-tab="data.activeTab"
          v-if="isLoggeInd"/>
        <router-view v-slot="{ Component }">
          <v-progress-linear indeterminate :active="loading.show" height="5" color="primary"></v-progress-linear>
          <transition name="slide-x-transition">
            <keep-alive>
              <component :is="Component"/>
            </keep-alive>
          </transition>
        </router-view>
      </v-main>
      <v-footer app inset absolute height="45" class="px-0" 
        v-if="isLoggeInd">
        <v-row dense class="pa-1">
          <v-col>
            <div></div>
          </v-col>
          <v-col class="d-flex flex-column align-center">
            <span
              class="font-weight-bold"
              style="color: black; font-size: 10px;"
            >
            &copy;DevoDigital - {{ new Date().getFullYear() }}
          </span>
            <span
              style="color: grey; font-size: 8px"
            >
            Todos los derechos reservados.
          </span>
          </v-col>
          <v-col class="pa-0 pr-2 justify-end">

          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </v-layout>
</template>

<script>
import { useSnackbar } from "@/composables/use-snackbar.js";
import {useLoading} from "@/composables/use-loading.js";
import {ref, reactive, computed, onMounted, onUnmounted} from 'vue';
import AppBar from './components/layout/AppBar.vue'
import TabsRoutes from './components/widgets/TabsRoutes.vue';
// import LoginAuth from './components/login/LoginAuth.vue';
import environment from './helpers/environment.js';
import {useStore} from './store';

export default {
  mounted() {
    this.verifySession()
    const lastRoute = sessionStorage.getItem('lastRoute')
    this.data.nameTabs = []
    if (lastRoute) {
      this.data.nameTabs.push(lastRoute);
      this.data.activeTab = this.data.nameTabs.indexOf(lastRoute)
      this.data.selectedItems.splice(this.data.selectedItems.length - 1)
      this.data.selectedItems.push(lastRoute)
    }
  },

  data(){
    return {
      snackbar: useSnackbar().snackbar,
      loading: useLoading().loading
    }
  },

  setup() {
    const store = useStore()
    const { snackbar } = useSnackbar()
    const isLoggeInd = computed(() => store.isLoggedIn)
    const screenWidth = ref(window.innerWidth)
    const isMobile = computed(() => screenWidth.value < 600)
    const updateScreen = () => {
      screenWidth.value = window.innerWidth
    }

    onMounted(() => {
      window.addEventListener('resize', updateScreen)
    })

    onUnmounted(() => {
      window.addEventListener('resize', updateScreen)
    })

    const data = reactive({
      drawer: true,
      clientes: [
        // ['Tipos de Cliente', 'Tipos de Cliente'],
        ['Clientes', 'Clientes'],
      ],
      cxcActions: [
        ['Cuentas por Cobrar', 'CXC'],
      ],
      ventasActions: [
        ['Tipos de Venta', 'Tipos de Venta'],
        ['Facturación', 'Facturacion'],
        //['Cuentas por Cobrar', 'CPC'],
      ],
      compraActions: [
        ['Proveedores', 'Proveedores'],
        ['Órdenes de compra', 'Ordenes']
      ],
      movimientos: [
        ['Tipos Movimiento', 'Tipos M.'],
        ['Conceptos', 'Conceptos'],
        ['Movimientos E.', 'Movimientos E.'],
      ],
      rutas: [
        ['Rutas', 'Rutas'],
      ],
      cierres: [
        ['Cierres', 'Cierres'],
      ],
      managerStock: [
        ['Categorías  Productos', 'Categorias'],
        ['Productos', 'Productos'],
        ['Movimientos', 'Movimientos_Facturacion']
      ],
      accesos: [
        ['Roles'],
        ['Usuarios'],
      ],
      views: {
        fact: false,
        orden: false,
        roles: false,
        user: false
      },
      selectedItems: ['Inicio'],
      nameTabs: [],
      nameCurrentTab: '',
      activeTab: null,
      visible: false,
      version: environment.version
    })

    return {
      data,
      isMobile,
      isLoggeInd,
      store
    }
  },

  computed: {
    ventasFiltradas() {
      return this.data.ventasActions.filter(([title]) => {
        if (!this.isLoggeInd && title === 'Facturación' && !this.data.views.fact) return false;
        return true;
      });
    },
    comprasFiltradas() {
      return this.data.compraActions.filter(([title]) => {
        if (!this.isLoggeInd && title === 'Órdenes de compra' && !this.data.views.orden) return false;
        return true;
      });
    },
    accesosFiltrados() {
      return this.data.accesos.filter(([title]) => {
        if (!this.isLoggeInd && title === 'Roles' && !this.data.views.roles) return false;
        if (!this.isLoggeInd && title === 'Usuarios' && !this.data.views.user) return false;
        return true;
      });
    }
  },

  methods: {
    verifyDataSecurity() {
      const token = this.store.getInfoUser()
      const ventanas = token.ventanasAcceso.split(",")
      this.data.views = {
        fact: true,
        orden: true,
      }

      ventanas.map(item => {
        switch (item) {
          case '3':
            this.data.views.fact = false
            break;
          case '7':
            this.data.views.orden = false
            break;
        }
      })
    },

    verifySession() {
      const exp = localStorage.getItem('exp')
      if (this.isLoggeInd) {
        this.store.deleteSession(exp)
      }
    },

    toggleDrawer() {
      this.data.drawer = !this.data.drawer
    },

    nameTab(name) {
      this.data.selectedItems.splice(this.data.selectedItems.length - 1)
      this.data.nameCurrentTab = name
      this.data.visible = true
      const existElement = this.data.nameTabs.indexOf(name)
      sessionStorage.setItem('lastRoute', name);

      if (existElement === -1) {
        this.data.nameTabs.push(name);
        this.data.activeTab = this.data.nameTabs.indexOf(name)
        this.data.selectedItems.push(name)
      } else {
        this.data.activeTab = existElement
        this.data.selectedItems.push(name)
      }

      this.$router.push({name: name})
    },

    clearApp() {
      this.$router.push({path: '/'})
      this.data.nameTabs = []
      this.data.nameCurrentTab = ''
      this.data.activeTab = null
      this.data.visible = false
    }
  },

  components: {
    AppBar,
    TabsRoutes,
    // LoginAuth
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

#app {
  font-family: Poppins;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
/* 
.font{
  font-size: 12px !important;
} */

:deep() .v-table .v-table__wrapper > table > thead > tr > th{
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)  );
}
:deep() .v-table .v-table__wrapper > table > tbody > tr > td:not(:last-child), .v-table .v-table__wrapper > table > tbody > tr > th:not(:last-child) { 
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
:deep() .v-table .v-table__wrapper > table > tbody > tr > td, .v-table .v-table__wrapper > table > tbody > tr > th:is(:last-child) { 
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}


:deep() .v-list-group__items .v-list-item {
  padding-inline-start: 30px !important;
}

</style>
