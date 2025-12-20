<template>
  <div>
    <v-card elevation="0" class="border-t border-b" rounded="0">
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div class="font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="primary">mdi-account-multiple</v-icon>
            <small v-if="isMobile">Clientes</small>
            <span v-else class="text-h6 font-weight-bold">Clientes</span>
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn v-if="hasAccessToFunct('92') && data.wind === 1" class="rounded" @click="openDialog('prov', 'create', null)"
            prepend-icon="mdi-account-plus" color="indigo-darken-4" variant="tonal">
            NUEVO CLIENTE
        </v-btn>
        <v-btn v-if="data.wind === 2" class="rounded" 
            @click="openDialog('tipo', 'create', null)"
            prepend-icon="mdi-account-plus" color="indigo-darken-4" variant="tonal">
            NUEVO T. DE CLIENTE
        </v-btn>
      </template>
      
      <v-divider/>
      
      <v-card-text class="py-2">
        <!-- SEGUNDA FILA: OPCIONES DE VISUALIZACIÓN -->
        <v-row dense class="mt-3 pa-2 bg-grey-lighten-4 rounded" justify="space-between">
          <v-col cols="12" md="6" sm="6">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-2" color="primary">
                    mdi-view-dashboard
                </v-icon>
                <span class="text-subtitle-2">
                    Seleccionar: 
                </span>
              </div>
              
              <v-btn-toggle v-model="data.wind" color="primary"
                density="comfortable" mandatory rounded="lg">
                <v-btn :value="1" variant="flat">
                  <v-icon start>mdi-account</v-icon>
                  Clientes
                </v-btn>
                
                <v-btn :value="2" variant="flat">
                  <v-icon start>mdi-account-tie</v-icon>
                  Tipo de Clientes
                </v-btn>
              </v-btn-toggle>
            </div>
          </v-col>
          <v-col cols="12" md="3" sm="3" class="d-flex justify-space-between align-center">
              <v-text-field v-model="data.search" density="compact" variant="outlined" label="Buscar" 
                  hide-details placeholder="Buscar textos" persistent-placeholder/>
              <v-btn icon size="small" class="mx-2 border" @click="refresData()">
                  <v-icon color="grey">mdi-refresh</v-icon>
                  <v-tooltip activator="parent" location="top center">
                      Actualizar
                  </v-tooltip>
              </v-btn>
          </v-col>
        </v-row>
        
        <v-window v-model="data.wind">
          <v-window-item :value="1">
            <v-card-subtitle class="d-flex align-center text-center mb-2">
              <v-divider/>
              <span class="mx-6 text-grey font-weight-bold">Clientes</span>
              <v-divider/>
            </v-card-subtitle>
            
            <v-data-table :loading="data.loading" :search="data.search" class="border font"
              :headers="data.headers" density="compact" :items="data.items" :row-props="setStyle" hover 
              :header-props="{ class: 'font-weight-bold' }" height="400" fixed-header>
              <template v-slot:loader>
                <v-progress-linear color="indigo" indeterminate height="2"/>
              </template>
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
              </template>
              <template v-slot:item.ubicacion="{ item }">
                {{ `${item.departamento}, ${item.municipio}` }}
              </template>
              <template v-slot:item.fechaRegistro="{ item }">
                <div>{{ formateDate(item.fechaRegistro) }}</div>
              </template>
              <template v-slot:item.idCategoriaClienteNavigation="{ item }">
                <div>{{ item.idCategoriaClienteNavigation.nombre }}</div>
              </template>
              <template v-slot:item.opc="{ item }">
                <v-menu :close-on-content-click="false" location="right center"
                  origin="auto">
                  <template v-slot:activator="{ props }">
                    <v-tooltip text="Opciones" location="top">
                      <template v-slot:activator="{ props: tooltipProps }">
                        <v-btn size="small" icon variant="text" color="grey-darken-1"
                          v-bind="{ ...props, ...tooltipProps }" class="hover-scale">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </template>

                  <v-list nav rounded="lg" >
                    <v-list-item-subtitle class="pa-1">
                      Opciones
                    </v-list-item-subtitle>
                    <v-list-item v-if="hasAccessToFunct('93')" rounded density="compact" prepend-icon="mdi-pencil"
                      color="indigo" @click="openDialog('prov', 'edit', item)">
                      <template v-slot:title>
                          <v-divider vertical />
                          Editar cliente
                      </template>
                    </v-list-item>

                    <v-list-item rounded density="compact" prepend-icon="mdi-eye"
                      color="indigo" @click="openDialog('prov', 'view', item)">
                      <template v-slot:title>
                          <v-divider vertical />
                          Ver cliente
                      </template>
                    </v-list-item>

                    <!-- <v-list-item rounded density="compact" prepend-icon="mdi-delete"
                      color="indigo" @click="showAlert(item)">
                      <template v-slot:title>
                          <v-divider vertical />
                          Eliminar cliente
                      </template>
                    </v-list-item> -->
                  </v-list>
                </v-menu>

                <!-- <div class="d-flex justify-space-between align-center">
                  <v-tooltip text="Editar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="small" color="green" @click="openDialog('prov', 'edit', item)"
                        class="mr-1">mdi-pencil
                      </v-icon>
                    </template>
                  </v-tooltip>

                  <v-tooltip text="Eliminar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="small" color="error" @click="showAlert(item)" class="mr-1">
                      mdi-delete
                      </v-icon>
                    </template>
                  </v-tooltip>

                  <v-tooltip text="Ver" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="small" color="indigo-darken-4" @click="openDialog('prov', 'view', item)">
                        mdi-eye
                      </v-icon>
                    </template>
                  </v-tooltip>
                </div> -->
              </template>
              <template v-slot:item.estado="{ item }">
                <v-chip :color="item.estado ? 'green' : 'error'" :text="item.estado ? 'Activo' : 'Inactivo'"/>
              </template>
            </v-data-table>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-subtitle class="d-flex align-center text-center my-2">
              <v-divider/>
              <span class="mx-6 text-grey font-weight-bold">Tipo de Clientes</span>
              <v-divider/>
            </v-card-subtitle>

            <v-data-table :loading="data.loadingTipo" :search="data.search" class="border font"
              :headers="data.headersCat" density="compact" :items="data.itemsCat" :row-props="setStyle" 
              hover :header-props="{ class: 'font-weight-bold' }" height="400" fixed-header>

              <template v-slot:loader>
                <v-progress-linear color="indigo" indeterminate height="2"/>
              </template>
              
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
              </template>

              <template v-slot:item.fechaRegistro="{ item }">
                <div>{{ formateDate(item.fechaRegistro) }}</div>
              </template>

              <template v-slot:item.opc="{ item }">
                <v-menu :close-on-content-click="false" location="right center"
                  origin="auto">
                  <template v-slot:activator="{ props }">
                    <v-tooltip text="Opciones" location="top">
                      <template v-slot:activator="{ props: tooltipProps }">
                        <v-btn size="small" icon variant="text" color="grey-darken-1"
                          v-bind="{ ...props, ...tooltipProps }" class="hover-scale">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </template>

                  <v-list nav rounded="lg" >
                    <v-list-item-subtitle class="pa-1">
                      Opciones
                    </v-list-item-subtitle>
                    <v-list-item rounded density="compact" prepend-icon="mdi-pencil"
                      color="indigo" @click="openDialog('tipo', 'edit', item)">
                      <template v-slot:title>
                          <v-divider vertical />
                          Editar tipo cliente
                      </template>
                    </v-list-item>

                    <v-list-item rounded density="compact" prepend-icon="mdi-eye"
                      color="indigo" @click="openDialog('tipo', 'view', item)">
                      <template v-slot:title>
                          <v-divider vertical />
                          Ver tipo cliente
                      </template>
                    </v-list-item>

                    <!-- <v-list-item rounded density="compact" prepend-icon="mdi-delete"
                      color="indigo" @click="showAlert(item)">
                      <template v-slot:title>
                          <v-divider vertical />
                          Eliminar tipo cliente
                      </template>
                    </v-list-item> -->
                  </v-list>
                </v-menu>
              </template>
              <template v-slot:item.estado="{ item }">
                <v-chip :color="item.estado ? 'green' : 'error'" :text="item.estado ? 'Activo' : 'Inactivo'"/>
              </template>
            </v-data-table>
          </v-window-item>
        </v-window>
      </v-card-text>

    </v-card>

    <SuccessAlert 
        :success="data.alertSuccess.success" 
        :msg="data.alertSuccess.msg" 
        :show="data.alertSuccess.show" 
    />
    <!-- v-if="data.newCliente.show" -->
    <NewCliente :show="data.newCliente.show" :editar="data.newCliente.editar" :title="data.newCliente.title"
      :prov="data.newCliente.item" :ver="data.newCliente.ver" @closeDialog="closeDialog"/>
    <NewTipoCliente :show="data.newCatCliente.show" :editar="data.newCatCliente.editar"
      :title="data.newCatCliente.title"
      :prov="data.newCatCliente.item" :ver="data.newCatCliente.ver" @closeDialog="closeDialogCat"/>
    <AlertComp :show="data.viewAlert" @deleteItem="deleteAction"/>
  </div>
</template>

<script>
import {computed, onMounted, onUnmounted, reactive, ref} from 'vue';
import {formatters} from '@/helpers/formatters';
import NewCliente from './dialogsClientes/NewCliente.vue';
import NewTipoCliente from './dialogsClientes/NewTipoCliente.vue';
import RequestHttp from '@/services/requestHttp';
import AlertComp from '@/components/widgets/AlertaAction.vue';
import { hasAccessToFunct } from '@/scripts/Seguridad.js'
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';

export default {
  mounted() {
    this.getClientes()
    this.getCategoriaClientes()
  },

  components: {
    NewCliente,
    AlertComp,
    NewTipoCliente,
    SuccessAlert
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
        {title: '', key: 'opc', align: 'center', 
          headerProps: {
            class: 'pa-0'
          },
          cellProps: {
            class: 'pa-0'
          }
        },
        {title: 'Categoría', key: 'categoriaCliente', align: 'center'},
        {title: 'Nombre', key: 'nombre', align: 'center'},
        {title: 'Ruta', key: 'ruta', align: 'center'},
        {title: 'Ubicación', key: 'ubicacion', align: 'center'},
        {title: 'Dirección', key: 'direccion', align: 'center'},
        {title: 'Teléfono', key: 'telefono', align: 'center'},
        {title: 'Usuario Registro', key: 'usuarioRegistro', align: 'center'},
        {title: 'Fecha Registro', key: 'fechaRegistro', align: 'center'},
        {title: 'Estado', key: 'estado', align: 'center'},
      ],
      headersCat: [
        {title: '', key: 'opc', align: 'center'},
        {title: 'Nombre', key: 'nombre', align: 'center'},
        {title: 'Descripcion', key: 'descripcion', align: 'center'},
        {title: 'Fecha Registro', key: 'fechaRegistro', align: 'center'},
        {title: 'Usuario Registro', key: 'usuarioRegistro', align: 'center'},
        {title: 'Estado', key: 'estado', align: 'center'},
      ],

      // ALERT SUCCESS
      alertSuccess: {
        show: false,
        msg: '',
        success: false,
      },

      items: [],
      itemsCat: [],
      newCliente: {
        show: false,
        editar: false,
        ver: false,
        title: '',
        item: {}
      },
      newCatCliente: {
        show: false,
        editar: false,
        ver: false,
        title: '',
        item: {}
      },

      wind: 1,
      selectedItem: null,
      search: null,
      loading: false,
      loadingTipo: false,
      viewAlert: false,
      requestHttp: new RequestHttp()
    })

    function showSuccesAlert(msg, success = true) {
      data.alertSuccess.msg = msg
      data.alertSuccess.show = true
      data.alertSuccess.success = success
      setTimeout(() => {
          data.alertSuccess.show = false
          data.alertSuccess.msg = ''
      }, 1500);
    }


    return {
      isMobile,
      data,
      showSuccesAlert
    }
  },

  methods: {
    hasAccessToFunct,
    setStyle({index}) {
      return {
        class: index % 2 === 0 ? 'bg-white' : 'bg-indigo-lighten-5',
      }
    },

    async getClientes() {
      this.data.items = []
      this.data.loading = true
      const result = await this.data.requestHttp.getClientes()
      this.data.loading = false
      result.map(item => {
        this.data.items.push(item)
      })

      this.data.items.reverse()
    },
    async getCategoriaClientes() {
      this.data.itemsCat = []
      this.data.loadingTipo = true
      const result = await this.data.requestHttp.getCategoriaClientes()
      this.data.loadingTipo = false
      result.map(item => {
        this.data.itemsCat.push(item)
      })
    },

    openDialog(comp, type, item = null) {
      if (comp === 'prov') {
        this.data.newCliente.show = true
        switch (type) {
          case 'create':
            this.data.newCliente.ver = false
            this.data.newCliente.editar = false
            this.data.newCliente.title = 'Nuevo Cliente'
            break;
          case 'edit':
            this.data.newCliente.ver = false
            this.data.newCliente.editar = true
            this.data.newCliente.item = item
            this.data.newCliente.title = 'Editar Cliente'
            break;
          case 'view':
            this.data.newCliente.ver = true
            this.data.newCliente.editar = false
            this.data.newCliente.item = item
            this.data.newCliente.title = 'Cliente'
            break;
          default:
            break;
        }
      } else if (comp === 'tipo') {
        this.data.newCatCliente.show = true
        switch (type) {
          case 'create':
            this.data.newCatCliente.ver = false
            this.data.newCatCliente.editar = false
            this.data.newCatCliente.title = 'Nuevo Tipo Cliente'
            break;
          case 'edit':
            this.data.newCatCliente.ver = false
            this.data.newCatCliente.editar = true
            this.data.newCatCliente.item = item
            this.data.newCatCliente.title = 'Editar Tipo Cliente'
            break;
          case 'view':
            this.data.newCatCliente.ver = true
            this.data.newCatCliente.editar = false
            this.data.newCatCliente.item = item
            this.data.newCatCliente.title = 'Tipo de Cliente'
            break;
          default:
            break;
        }
      }
    },

    formateDate(dateString) {
      const value = formatters.formatDate(dateString)
      return value
    },

    deleteAction(val) {
      if (val === true) {
        this.deleteItem()
      }
      this.data.viewAlert = false
    },

    showAlert(item) {
      this.data.viewAlert = true
      this.data.selectedItem = item
    },

    async deleteItem() {
      if (this.data.selectedItem.idCliente) {
        const result = await this.data.requestHttp.deleteCliente(this.data.selectedItem.idCliente)
        if (result.code === 200) {
          this.showSuccesAlert('¡Registro Eliminado!', true)
          this.getClientes()
        } else {
          this.showSuccesAlert('Hubo un problema al eliminar el registro', false)
          return
        }
      } else {
        const result = await this.data.requestHttp.deleteCategoriaCliente(this.data.selectedItem.idCategoriaCliente)
        if (result.code === 200) {
          this.showSuccesAlert('¡Registro Eliminado!', true)
          this.getCategoriaClientes()
        } else {
          this.showSuccesAlert('Hubo un problema al eliminar el registro', false)
          return
        }
      }
    },

    closeDialog(val) {
      this.data.newCliente.show = val
      this.data.newCliente.item = {}
      this.data.newCliente.title = ''
      this.data.newCliente.editar = false
      this.data.newCliente.ver = false
      this.getClientes()
    },

    refresData() {
      this.getClientes()
      this.getCategoriaClientes()
    },

    closeDialogCat(val) {
      this.data.newCatCliente.show = val
      this.data.newCatCliente.item = {}
      this.data.newCatCliente.title = ''
      this.data.newCatCliente.editar = false
      this.data.newCatCliente.ver = false
      this.getCategoriaClientes()
    }
  }
}
</script>

<style scoped>
.font {
  font-size: 12px !important;
  font-weight: 500;
}
</style>