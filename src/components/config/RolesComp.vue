<template>
  <div>
    <v-card elevation="0" class="border" rounded="0">
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div class="font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="red-darken-4">mdi-account-cog</v-icon>
            <span class="text-h6 font-weight-bold">Roles y Permisos</span>
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn icon color="red-darken-4" class="mr-2" variant="text" @click="openDialog('tipo', 'create', null)">
          <v-icon>mdi-account-plus</v-icon>
          <v-tooltip activator="parent" location="left">Agregar Usuario</v-tooltip>
        </v-btn>
      </template>
      <v-divider/>
      <v-card-text class="py-2 px-0">
        <v-row dense class="px-0" style="margin: 0;">
          <v-col cols="6" sm="6" md="6">
            <v-text-field v-model="data.search" density="compact" variant="outlined" label="Buscar" hide-details
                          placeholder="Buscar textos" persistent-placeholder/>
          </v-col>
          <v-col cols="6" md="6" sm="6" class="d-flex justify-end align-center">
            <v-btn icon color="green" size="small" variant="text" class="mr-2 border" @click="getRoles()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn icon color="grey" size="small" variant="text" class="border">
              <v-icon>mdi-broom</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row dense class="w-100">
        </v-row>
        <v-card-subtitle class="d-flex align-center text-center mb-2">
          <v-divider/>
          <span class="mx-6 text-grey font-weight-bold">Usuarios</span>
          <v-divider/>
        </v-card-subtitle>
        <v-data-table :loading="data.loading" :search="data.search" :mobile="isMobile" class="border"
                      :headers="data.headers" density="compact" :items="data.items">
          <template v-slot:item.fechaRegistro="{ item }">
            <div>{{ formateDate(item.fechaRegistro) }}</div>
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip :color="item.estado ? 'green' : 'error'" :text="item.estado ? 'Activo' : 'Inactivo'"/>
          </template>
          <template v-slot:item.opc="{ item }">
            <v-tooltip text="Editar Permisos" location="top">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="small" color="green" @click="openPermisos(item)"
                        class="mr-1">mdi-pencil
                </v-icon>
              </template>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="data.showPermisos" width="800">
      <v-card>
        <v-card-title>Permisos</v-card-title>
        <v-card-text>
          <v-row
              dense
          >
            <v-col
                cols="12" sm="6" md="6"
                style='
                border: 1px solid #e0e0e0;
              '
            >
              <div class="d-flex justify-center">Movimientos</div>
              <div
                  class="ma-2"
                  style='border: 1px solid #e0e0e0;'
              >
                <div class="d-flex justify-center">
                  <v-treeview
                      open-all
                      item-value="id"
                      selectable
                      select-strategy="classic"
                      v-model="data.win2.data.permisos.facturacion"
                      :items="data.win2.setup.facturacionPermisosTreeItems"

                  >
                    <template v-slot:prepend="{ item }">
                      <v-icon>{{ item.icon }}</v-icon>
                    </template>
                  </v-treeview>
                </div>
              </div>
            </v-col>
            <v-col
                cols="12" sm="6" md="6"
                style='
                border: 1px solid #e0e0e0;
              '
            >
              <div class="d-flex justify-center">Configuración</div>
              <div
                  class="ma-2"
                  style='border: 1px solid #e0e0e0;'
              >
                <div class="d-flex justify-center">
                  <v-treeview
                      open-all
                      item-value="id"
                      selectable
                      select-strategy="classic"
                      v-model="data.win2.data.permisos.configuracion"
                      :items="data.win2.setup.configuracionPermisosTreeItems"

                  >
                    <template v-slot:prepend="{ item }">
                      <v-icon>{{ item.icon }}</v-icon>
                    </template>
                  </v-treeview>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
              variant="outlined"
              @click="data.showPermisos = false"
          >Cerrar</v-btn>
          <v-btn
              class="bg-red-darken-4"
              @click="guardarPermisos"
          >Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <NewRol :show="data.show" @closeDialog="closeDialog"/>
  </div>
</template>

<script>
import {computed, onMounted, onUnmounted, reactive, ref} from 'vue';
import {formatters} from '@/helpers/formatters';
import NewRol from './dialogsUsuario/NewRol.vue';
import RequestHttp from '@/services/requestHttp';

import {httpGet, httpPut} from "@/scripts/api.js";

import { VTreeview } from 'vuetify/labs/VTreeview'

export default {
  mounted() {
    this.getRoles()
  },

  components: {
    NewRol,
    VTreeview
  },

  setup() {
    const screenWidth = ref(window.innerWidth)
    const isMobile = computed(() => screenWidth.value <= 850)
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
      headers: [
        {title: '', key: 'opc', align: 'center'},
        {title: 'Rol', key: 'nombre', align: 'center'},
        {title: 'Usuario Registro', key: 'usuarioRegistro', align: 'center'},
        {title: 'Fecha Registro', key: 'fechaRegistro', align: 'center'},
        {title: 'Estado', key: 'estado', align: 'center'},
      ],
      win2: {
        data: {
          permisos: {
            idRol: 0,
            facturacion: [],
            configuracion: [],
          },
        },
        setup: {
          facturacionPermisosTreeItems: [
            {
              id: 3,
              title: 'Facturacion',
              icon: 'mdi-menu',
              children: [
                {
                  id: '3-1',
                  title: 'Visualizar',
                  icon: 'mdi-monitor',
                },
                {
                  id: '3-2',
                  title: 'Crear',
                  icon: 'mdi-monitor',
                },
                {
                  id: '3-3',
                  title: 'Editar',
                  icon: 'mdi-monitor',
                },

                {
                  id: '3-4',
                  title: 'Eliminar',
                  icon: 'mdi-monitor',
                },
              ],
            },
            {
              id: 7,
              title: 'Órdenes de Compras',
              icon: 'mdi-menu',
              children: [
                {
                  id: '7-1',
                  title: 'Visualizar',
                  icon: 'mdi-monitor',
                },
                {
                  id: '7-2',
                  title: 'Crear',
                  icon: 'mdi-monitor',
                },
                {
                  id: '7-3',
                  title: 'Editar',
                  icon: 'mdi-monitor',
                },

                {
                  id: '7-4',
                  title: 'Eliminar',
                  icon: 'mdi-monitor',
                },
              ],
            },
          ],
          configuracionPermisosTreeItems: [
            {
              id: 4,
              title: 'Roles',
              icon: 'mdi-menu',
              children: [
                {
                  id: '4-1',
                  title: 'Visualizar',
                  icon: 'mdi-monitor',
                },
                {
                  id: '4-2',
                  title: 'Crear',
                  icon: 'mdi-monitor',
                },
                {
                  id: '4-3',
                  title: 'Editar',
                  icon: 'mdi-monitor',
                },

                {
                  id: '4-4',
                  title: 'Eliminar',
                  icon: 'mdi-monitor',
                },
              ],
            },
            {
              id: 5,
              title: 'Usuarios',
              icon: 'mdi-menu',
              children: [
                {
                  id: '5-1',
                  title: 'Visualizar',
                  icon: 'mdi-monitor',
                },
                {
                  id: '5-2',
                  title: 'Crear',
                  icon: 'mdi-monitor',
                },
                {
                  id: '5-3',
                  title: 'Editar',
                  icon: 'mdi-monitor',
                },

                {
                  id: '5-4',
                  title: 'Eliminar',
                  icon: 'mdi-monitor',
                },
              ],
            },
          ]
        },
      },
      showPermisos: false,
      items: [],
      search: null,
      loading: false,
      show: false,
      requestHttp: new RequestHttp()
    })

    return {
      isMobile,
      data
    }
  },

  methods: {
    async guardarPermisos(){
      try {
        await httpPut('api/Rol/EditarPermisos', this.data.win2.data.permisos)

        alert('Permisos editados correctamente.')

        this.data.showPermisos = false
      } catch (err) {
        if (err.status == 401) {

        } else if (err.status == 403) {

        } else {
          console.log(err)
        }
      }
    },

    async getRoles() {
      this.data.items = []
      this.data.loading = true
      const result = await this.data.requestHttp.getRoles()
      this.data.loading = false
      result.map(item => {
        this.data.items.push(item)
      })
    },

    formateDate(dateString) {
      const value = formatters.formatDate(dateString)
      return value
    },

    openDialog() {
      this.data.show = true
    },

    async load_DataPermisosDisplay(item) {
      this.ctrl_Carga = true
      let me = this.data
      me.win2.data.permisos.idRol = item.idrol
      me.win2.data.permisos.facturacion = []
      me.win2.data.permisos.configuracion = []
      try {

        //
        const permisos =
            await httpGet('api/Rol/Permisos/' + item.idrol)

        /*4: GESTION PRESTAMOS
        * 5: OTROS PERMISOS
        * 6: GESTION SISTEMA
        * 8: GESTION COLABORADORES
        * */
        permisos.map(function(x) {
          switch (x.idVentanaPadre) {
            case 6:
              me.win2.data.permisos.facturacion.push(x.idCompuesto)
              break
            case 1:
              me.win2.data.permisos.configuracion.push(x.idCompuesto)
              break
            default:
              break
          }
        })

        this.resultPantalla()

      } catch (err) {

      }
    },

    async openPermisos(item){

      await this.load_DataPermisosDisplay(item)
      this.data.showPermisos = true
    },


    closeDialog(val) {
      this.data.show = val
      this.getRoles()
    },
  }
}
</script>

<style scoped>

</style>