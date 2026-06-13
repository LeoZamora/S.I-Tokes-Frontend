<template>
  <v-responsive>
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

    <v-app id="app">
      <v-navigation-drawer
        v-if="isLoggeInd"
        v-model="data.drawer"
        class="font"
      >
        <!-- bg-orange-darken-4 -->
        <template v-slot:prepend>
          <div
            class="d-flex bg-white justify-center align-center"
          >
            <img
              src="/48px.svg"
              alt="Routes By DevoDigital"
              height="120px"
            />
          </div>
          <!-- <v-container >
            </v-container> -->
        </template>

        <v-list
          density="compact"
          v-model:selected="data.selectedItems"
          :mandatory="true"
          select-strategy="leaf"
          class="mx-2"
        >
          <v-list-subheader
            class="font-weight-bold"
          >
            Resúmenes
          </v-list-subheader>

          <v-list-item
            prepend-icon="mdi-home"
            color="orange-darken-4"
            title="Inicio"
            :lines="true"
            rounded
            value="Inicio"
            @click="goToHome()"
          />

          <v-list-item
            v-if="hasAccessToMenu('10')"
            @click="nameTab('Resumen Inventario')"
            prepend-icon="mdi-package"
            title="Resumen Inventario"
            :lines="true"
            rounded
            value="Resumen Inventario"
          ></v-list-item>

          <v-list-subheader
            class="font-weight-bold"
          >
            Gestión General
          </v-list-subheader>

          <!-- VENTAS -->
          <v-list-group
            prepend-icon="mdi-cash-register"
            v-if="
              data.ventas.filter((c) =>
                hasAccessToMenu(c.idVentana)
              ).length
            "
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-list-item
                v-bind="props"
                rounded
                value="Venta"
                :lines="true"
                color="orange-darken-4"
                title="Ventas"
              />
            </template>
            <v-list-item
              class="mx-2"
              rounded
              :lines="true"
              color="orange-darken-4"
              v-for="(
                i, index
              ) in data.ventas.filter((c) =>
                hasAccessToMenu(c.idVentana)
              )"
              :key="index"
              :value="i.title"
              @click="nameTab(i.route)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-menu-right</v-icon>
              </template>
              <small>{{ i.title }}</small>
            </v-list-item>
          </v-list-group>

          <!-- POR COBRAR -->
          <v-list-group
            prepend-icon="mdi-cash-clock"
            v-if="
              data.porCobrar.filter((c) =>
                hasAccessToMenu(c.idVentana)
              ).length
            "
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-list-item
                v-bind="props"
                rounded
                value="Por Cobrar"
                :lines="true"
                color="orange-darken-4"
                title="Por Cobrar"
              />
            </template>
            <v-list-item
              class="mx-2"
              rounded
              :lines="true"
              color="orange-darken-4"
              v-for="(
                i, index
              ) in data.porCobrar.filter((c) =>
                hasAccessToMenu(c.idVentana)
              )"
              :key="index"
              :value="i.title"
              @click="nameTab(i.route)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-menu-right</v-icon>
              </template>
              <small>{{ i.title }}</small>
            </v-list-item>
          </v-list-group>

          <v-list-group
            prepend-icon="mdi-cart-arrow-down"
            v-if="
              data.compras.filter((c) =>
                hasAccessToMenu(c.idVentana)
              ).length
            "
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-list-item
                v-bind="props"
                rounded
                value="Compras"
                :lines="true"
                color="orange-darken-4"
                title="Compras"
              />
            </template>
            <v-list-item
              class="mx-2"
              rounded
              :lines="true"
              color="orange-darken-4"
              v-for="(
                i, index
              ) in data.compras.filter((c) =>
                hasAccessToMenu(c.idVentana)
              )"
              :key="index"
              :value="i.title"
              @click="nameTab(i.route)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-menu-right</v-icon>
              </template>
              <small>{{ i.title }}</small>
            </v-list-item>
          </v-list-group>
          <!--CLIENTES-->
          <v-list-group
            prepend-icon="mdi-account"
            v-if="
              data.clientes.filter((c) =>
                hasAccessToMenu(c.idVentana)
              ).length
            "
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-list-item
                v-bind="props"
                rounded
                value="Clientes"
                :lines="true"
                color="orange-darken-4"
                title="Clientes"
              />
            </template>
            <v-list-item
              class="mx-2"
              rounded
              :lines="true"
              color="orange-darken-4"
              v-for="(
                i, index
              ) in data.clientes.filter((c) =>
                hasAccessToMenu(c.idVentana)
              )"
              :key="index"
              :value="i.title"
              @click="nameTab(i.route)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-menu-right</v-icon>
              </template>
              <small>{{ i.title }}</small>
            </v-list-item>
          </v-list-group>

          <v-list-subheader
            class="font-weight-bold"
          >
            Gestión Logística
          </v-list-subheader>

          <!--RUTAS-->
          <v-list-group
            prepend-icon="mdi-truck-off-road"
            v-if="
              data.rutas.filter((c) =>
                hasAccessToMenu(c.idVentana)
              ).length
            "
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-list-item
                v-bind="props"
                rounded
                value="Rutas"
                :lines="true"
                color="orange-darken-4"
                title="Rutas"
              />
            </template>
            <v-list-item
              class="mx-2"
              rounded
              :lines="true"
              color="orange-darken-4"
              v-for="(
                i, index
              ) in data.rutas.filter((c) =>
                hasAccessToMenu(c.idVentana)
              )"
              :key="index"
              :value="i.title"
              @click="nameTab(i.route)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-menu-right</v-icon>
              </template>
              <small>{{ i.title }}</small>
            </v-list-item>
          </v-list-group>

          <!--INVENTARIO-->
          <v-list-group
            prepend-icon="mdi-package-variant"
            v-if="
              data.inventario.filter((c) =>
                hasAccessToMenu(c.idVentana)
              ).length
            "
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-list-item
                v-bind="props"
                rounded
                value="Inventario"
                :lines="true"
                color="orange-darken-4"
                title="Inventario"
              />
            </template>
            <v-list-item
              class="mx-2"
              rounded
              :lines="true"
              color="orange-darken-4"
              v-for="(
                i, index
              ) in data.inventario.filter((c) =>
                hasAccessToMenu(c.idVentana)
              )"
              :key="index"
              :value="i.title"
              @click="nameTab(i.route)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-menu-right</v-icon>
              </template>
              <small>{{ i.title }}</small>
            </v-list-item>
          </v-list-group>

          <v-list-subheader
            class="font-weight-bold"
          >
            Gestión Empresarial
          </v-list-subheader>

          <v-list-group
            prepend-icon="mdi-abacus"
            v-if="
              data.movimientos.filter((c) =>
                hasAccessToMenu(c.idVentana)
              ).length
            "
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-list-item
                v-bind="props"
                rounded
                value="Movimientos"
                :lines="true"
                color="orange-darken-4"
                title="Movimientos"
              />
            </template>
            <v-list-item
              class="mx-2"
              rounded
              :lines="true"
              color="orange-darken-4"
              v-for="(
                i, index
              ) in data.movimientos.filter((c) =>
                hasAccessToMenu(c.idVentana)
              )"
              :key="index"
              :value="i.title"
              @click="nameTab(i.route)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-menu-right</v-icon>
              </template>
              <small>{{ i.title }}</small>
            </v-list-item>
          </v-list-group>

          <v-list-group
            prepend-icon="mdi-calendar"
            v-if="
              data.cierres.filter((c) =>
                hasAccessToMenu(c.idVentana)
              ).length
            "
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-list-item
                v-bind="props"
                rounded
                value="Cierres"
                :lines="true"
                color="orange-darken-4"
                title="Cierres"
              />
            </template>
            <v-list-item
              class="mx-2"
              rounded
              :lines="true"
              color="orange-darken-4"
              v-for="(
                i, index
              ) in data.cierres.filter((c) =>
                hasAccessToMenu(c.idVentana)
              )"
              :key="index"
              :value="i.title"
              @click="nameTab(i.route)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-menu-right</v-icon>
              </template>
              <small>{{ i.title }}</small>
            </v-list-item>
          </v-list-group>
        </v-list>

        <template v-slot:append>
          <v-divider class="mx-4" />
          <div
            class="d-flex justify-center pa-2 align-center"
          >
            <div
              class="d-flex flex-column align-center bg-white pa-1 rounded-lg"
            >
              <v-img
                width="50"
                src="/32px.png"
              ></v-img>
            </div>
            <v-divider
              vertical
              class="mx-3"
            ></v-divider>
            <div
              class="d-flex flex-column align-center"
            >
              <h6 style="font-size: 10px">
                DevoDigital
              </h6>
              <h6 style="font-size: 10px">
                v2.0.0
              </h6>
            </div>
          </div>
        </template>
      </v-navigation-drawer>

      <AppBar
        v-if="isLoggeInd"
        @toggle-drawer="toggleDrawer"
        @nameRoute="nameTab"
        @logout="clearApp"
      />

      <v-main class="w-100 position-relative">
        <TabsRoutes
          :routes="data.nameTabs"
          :name="data.nameCurrentTab"
          :index-tab="data.activeTab"
          v-if="isLoggeInd"
          @nameTab="nameTab"
        />
        <router-view v-slot="{ Component }">
          <v-progress-linear
            indeterminate
            :active="loading.show"
            height="5"
            color="orange-darken-4"
          />
          <transition name="fade-transition">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </v-main>
      <v-footer
        app
        inset
        absolute
        height="45"
        class="px-0"
        v-if="isLoggeInd"
      >
        <v-row dense class="pa-1">
          <v-col>
            <div></div>
          </v-col>
          <v-col
            class="d-flex flex-column align-center"
          >
            <span
              class="font-weight-bold"
              style="
                color: black;
                font-size: 10px;
              "
            >
              &copy;DevoDigital -
              {{ new Date().getFullYear() }}
            </span>
            <span
              style="color: grey; font-size: 8px"
            >
              Todos los derechos reservados.
            </span>
          </v-col>
        </v-row>
      </v-footer>

      <VerifySession
        :show="data.verifySesion"
        @logout="logout"
        @reset="setSession"
      />
    </v-app>
  </v-responsive>
</template>

<script>
import { useSnackbar } from '@/composables/use-snackbar.js'
import { useLoading } from '@/composables/use-loading.js'
import {
  ref,
  watch,
  reactive,
  computed,
  onMounted,
  onUnmounted
} from 'vue'
import AppBar from './components/layout/AppBar.vue'
import TabsRoutes from './components/widgets/TabsRoutes.vue'
// import LoginAuth from './components/login/LoginAuth.vue';
import environment from './helpers/environment.js'
import { useStore } from './store'
import { hasAccessToMenu } from '@/scripts/Seguridad.js'
import PrinterServices from './helpers/qzTray'
import { useRouter } from 'vue-router'
import VerifySession from './components/config/VerifySession.vue'

export default {
  mounted() {
    this.verifySession()

    setInterval(
      () => {
        this.verifySession()
      },
      1000 * 60 * 120
    )
  },

  data() {
    return {
      snackbar: useSnackbar().snackbar,
      loading: useLoading().loading
    }
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const { snackbar } = useSnackbar()
    const isLoggeInd = computed(
      () => store.isLoggedIn
    )
    const screenWidth = ref(window.innerWidth)
    const isMobile = computed(
      () => screenWidth.value < 600
    )
    const updateScreen = () => {
      screenWidth.value = window.innerWidth
    }

    onMounted(() => {
      window.addEventListener(
        'resize',
        updateScreen
      )
    })

    onUnmounted(() => {
      window.addEventListener(
        'resize',
        updateScreen
      )
    })

    const data = reactive({
      drawer: true,
      cxcActions: [
        [
          'Cuentas por Cobrar',
          'Cuentas por Cobrar'
        ]
      ],
      ventasActions: [
        ['Tipos de Venta', 'Tipos de Venta'],
        ['Facturación', 'Facturacion']
        //['Cuentas por Cobrar', 'CPC'],
      ],
      porCobrar: [
        {
          title: 'Cuentas por Cobrar',
          route: 'Cuentas por Cobrar',
          idVentana: '8'
        }
      ],
      clientes: [
        {
          title: 'Clientes',
          route: 'Clientes',
          idVentana: '9'
        }
      ],
      ventas: [
        {
          title: 'Tipos de Venta',
          route: 'Tipos de Venta',
          idVentana: '3'
        },
        {
          title: 'Facturación',
          route: 'Facturación',
          idVentana: '3'
        }
      ],
      compras: [
        {
          title: 'Proveedores',
          route: 'Proveedores',
          idVentana: '10'
        },
        {
          title: 'Órdenes de compra',
          route: 'Órdenes de compra',
          idVentana: '7'
        }
      ],
      rutas: [
        {
          title: 'Rutas',
          route: 'Rutas',
          idVentana: '11'
        }
      ],
      inventario: [
        {
          title: 'Categorías Productos',
          route: 'Categorías Productos',
          idVentana: '12'
        },
        {
          title: 'Productos',
          route: 'Productos',
          idVentana: '12'
        },
        {
          title: 'Movimientos',
          route: 'Movimientos',
          idVentana: '12'
        }
      ],

      movimientos: [
        {
          title: 'Tipos Movimiento',
          route: 'Tipos Movimiento',
          idVentana: '13'
        },
        {
          title: 'Conceptos',
          route: 'Conceptos',
          idVentana: '13'
        },
        {
          title: 'Movimientos E.',
          route: 'Movimientos E.',
          idVentana: '13'
        }
      ],
      cierres: [
        {
          title: 'Cierres',
          route: 'Cierres',
          idVentana: '13'
        },
        {
          title: 'Detalle de Ventas',
          route: 'Detalle de Ventas',
          idVentana: '13'
        }
      ],

      compraActions: [
        ['Proveedores', 'Proveedores'],
        ['Órdenes de compra', 'Ordenes']
      ],
      managerStock: [
        ['Categorías  Productos', 'Categorias'],
        ['Productos', 'Productos'],
        ['Movimientos', 'Movimientos_Facturacion']
      ],
      accesos: [['Roles'], ['Usuarios']],
      views: {
        fact: false,
        orden: false,
        roles: false,
        user: false
      },
      verifySesion: false,
      selectedItems: ['Inicio'],
      nameTabs: [],
      nameCurrentTab: '',
      activeTab: null,
      visible: false,
      version: environment.version,
      printerServices: new PrinterServices()
    })

    watch(
      () => router.currentRoute.value.meta,
      (val) => {
        if (val?.protected) {
          verifySession()
        }
      },
      { deep: true }
    )

    function goToHome() {
      data.selectedItems.splice(
        data.selectedItems.length - 1
      )
      data.selectedItems = ['Inicio']

      router.push({ name: 'Home' })
      data.visible = false
      sessionStorage.removeItem('lastRoute')
      data.nameTabs = []
    }

    function nameTab(name) {
      if (name === 'Home') {
        goToHome()
        return
      }

      if (name === null || name === 'null') {
        router.push({ name: 'Home' })
      } else {
        data.selectedItems.splice(
          data.selectedItems.length - 1
        )
        data.nameCurrentTab = name
        data.visible = true
        const existElement =
          data.nameTabs.indexOf(name)
        sessionStorage.setItem('lastRoute', name)

        if (existElement === -1) {
          data.nameTabs.push(name)
          data.activeTab =
            data.nameTabs.indexOf(name)
          data.selectedItems.push(name)
        } else {
          data.activeTab = existElement
          data.selectedItems.push(name)
        }
        router.push({ name: name })
      }
    }

    function verifySession() {
      if (isLoggeInd.value) {
        const exp = store.getExp()
        const now = Date.now()
        if (now / 1000 >= Number(exp)) {
          data.verifySesion = true
        }
        const lastRoute =
          sessionStorage.getItem('lastRoute')

        if (
          lastRoute !== 'Login' &&
          lastRoute !== null
        ) {
          nameTab(lastRoute)
        } else {
          router.push({ name: 'Home' })
        }
      }
    }

    return {
      data,
      isMobile,
      isLoggeInd,
      store,
      verifySession,
      goToHome,
      nameTab
    }
  },

  computed: {
    showGestionLogisticaSubTitle() {
      let rutas = !!this.data.rutas.filter((c) =>
        hasAccessToMenu(c.idVentana)
      ).length
      let inventario =
        !!this.data.inventario.filter((c) =>
          hasAccessToMenu(c.idVentana)
        ).length

      if (rutas || inventario) {
        return true
      } else {
        return false
      }
    },
    showGestionEmpresarialSubTitle() {
      let movimientos =
        this.data.movimientos.filter((c) =>
          hasAccessToMenu(c.idVentana)
        ).length
      let cierres = this.data.cierres.filter(
        (c) => hasAccessToMenu(c.idVentana)
      ).length

      if (movimientos || cierres) {
        return true
      } else {
        return false
      }
    },
    ventasFiltradas() {
      return this.data.ventasActions.filter(
        ([title]) => {
          if (
            !this.isLoggeInd &&
            title === 'Facturación' &&
            !this.data.views.fact
          )
            return false
          return true
        }
      )
    },
    comprasFiltradas() {
      return this.data.compraActions.filter(
        ([title]) => {
          if (
            !this.isLoggeInd &&
            title === 'Órdenes de compra' &&
            !this.data.views.orden
          )
            return false
          return true
        }
      )
    },
    accesosFiltrados() {
      return this.data.accesos.filter(
        ([title]) => {
          if (
            !this.isLoggeInd &&
            title === 'Roles' &&
            !this.data.views.roles
          )
            return false
          if (
            !this.isLoggeInd &&
            title === 'Usuarios' &&
            !this.data.views.user
          )
            return false
          return true
        }
      )
    }
  },

  methods: {
    hasAccessToMenu,

    async printerServ() {
      try {
        await this.data.printerServices.findFunction()
      } catch (error) {
        console.log(error)
      }
    },

    verifyDataSecurity() {
      const token = this.store.getInfoUser()
      const ventanas =
        token.ventanasAcceso.split(',')
      this.data.views = {
        fact: true,
        orden: true
      }

      ventanas.map((item) => {
        switch (item) {
          case '3':
            this.data.views.fact = false
            break
          case '7':
            this.data.views.orden = false
            break
        }
      })
    },

    // verifySession() {
    //   const exp = localStorage.getItem('exp')
    //   if (this.isLoggeInd) {
    //     this.store.deleteSession(exp)
    //     const lastRoute = sessionStorage.getItem('lastRoute')
    //     if (lastRoute) {
    //       this.nameTab(lastRoute)
    //     }
    //   }
    // },

    toggleDrawer() {
      this.data.drawer = !this.data.drawer
    },

    async logout(val) {
      this.data.verifySesion = val
      this.data.activeTab = null
      this.data.nameTabs = []
      this.data.nameCurrentTab = null
      // await this.delay(1500);
      this.$router.go(0)
      this.store.logout()
      this.$router.push({ path: '/login' })
    },

    setSession(val) {
      this.data.verifySesion = val
      this.$router.go(0)
    },

    clearApp() {
      this.$router.push({ path: '/' })
      this.data.nameTabs = []
      this.data.nameCurrentTab = ''
      this.data.activeTab = null
      this.data.visible = false
    }
  },

  components: {
    AppBar,
    TabsRoutes,
    VerifySession
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

:deep()
  .v-table
  .v-table__wrapper
  > table
  > thead
  > tr
  > th {
  border-bottom: 1px solid
    rgba(
      var(--v-border-color),
      var(--v-border-opacity)
    );
}
:deep()
  .v-table
  .v-table__wrapper
  > table
  > tbody
  > tr
  > td:not(:last-child),
.v-table
  .v-table__wrapper
  > table
  > tbody
  > tr
  > th:not(:last-child) {
  border-bottom: 1px solid
    rgba(
      var(--v-border-color),
      var(--v-border-opacity)
    );
}
:deep()
  .v-table
  .v-table__wrapper
  > table
  > tbody
  > tr
  > td,
.v-table
  .v-table__wrapper
  > table
  > tbody
  > tr
  > th:is(:last-child) {
  border-bottom: 1px solid
    rgba(
      var(--v-border-color),
      var(--v-border-opacity)
    );
  border-right: 1px solid
    rgba(
      var(--v-border-color),
      var(--v-border-opacity)
    );
}

:deep() .v-list-group__items .v-list-item {
  padding-inline-start: 30px !important;
}
</style>
