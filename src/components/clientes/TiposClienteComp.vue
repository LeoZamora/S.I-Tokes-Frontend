<template>
  <div>
    <v-card elevation="0" class="border-t border-b" rounded="0">
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div class="font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="primary">mdi-account-tie</v-icon>
            <small v-if="isMobile">Tipos de Cliente</small>
            <span v-else class="text-h6 font-weight-bold">Tipos de Cliente</span>
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn class="rounded" 
            @click="openDialog('create', null)"
            prepend-icon="mdi-account-plus" color="indigo-darken-4" variant="tonal">
            NUEVO T. DE CLIENTE
        </v-btn>
      </template>
      
      <v-divider/>
      
      <v-card-text class="py-2">
        <v-row dense class="mt-1 mb-2 pa-2 bg-grey-lighten-4 rounded" justify="space-between" align="center">
          <v-col cols="12" md="4" sm="6">
            <v-text-field v-model="data.search" density="compact" variant="outlined" label="Buscar" 
                hide-details placeholder="Buscar textos" persistent-placeholder/>
          </v-col>
          <v-col cols="12" md="3" sm="6" class="d-flex justify-end align-center">
            <v-btn icon size="small" class="border" @click="getCategoriaClientes()">
                <v-icon color="grey">mdi-refresh</v-icon>
                <v-tooltip activator="parent" location="top center">
                    Actualizar
                </v-tooltip>
            </v-btn>
          </v-col>
        </v-row>

        <v-card-subtitle class="d-flex align-center text-center my-2">
          <v-divider/>
          <span class="mx-6 text-grey font-weight-bold">Tipos de Cliente</span>
          <v-divider/>
        </v-card-subtitle>

        <v-data-table :loading="data.loading" :search="data.search" class="border font"
          :headers="data.headers" density="compact" :items="data.items" :row-props="setStyle" 
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
                  color="indigo" @click="openDialog('edit', item)">
                  <template v-slot:title>
                      <v-divider vertical />
                      Editar tipo cliente
                  </template>
                </v-list-item>

                <v-list-item rounded density="compact" prepend-icon="mdi-eye"
                  color="indigo" @click="openDialog('view', item)">
                  <template v-slot:title>
                      <v-divider vertical />
                      Ver tipo cliente
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip :color="item.estado ? 'green' : 'error'" :text="item.estado ? 'Activo' : 'Inactivo'"/>
          </template>
        </v-data-table>
      </v-card-text>

    </v-card>

    <SuccessAlert 
        :success="data.alertSuccess.success" 
        :msg="data.alertSuccess.msg" 
        :show="data.alertSuccess.show" 
    />
    <NewTipoCliente :show="data.newCatCliente.show" :editar="data.newCatCliente.editar"
      :title="data.newCatCliente.title"
      :prov="data.newCatCliente.item" :ver="data.newCatCliente.ver" @closeDialog="closeDialog"/>
    <AlertComp :show="data.viewAlert" @deleteItem="deleteAction"/>
  </div>
</template>

<script>
import {computed, onMounted, onUnmounted, reactive, ref} from 'vue';
import {formatters} from '@/helpers/formatters';
import NewTipoCliente from './dialogsClientes/NewTipoCliente.vue';
import RequestHttp from '@/services/requestHttp';
import AlertComp from '@/components/widgets/AlertaAction.vue';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';

export default {
  mounted() {
    this.getCategoriaClientes()
  },

  components: {
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
      newCatCliente: {
        show: false,
        editar: false,
        ver: false,
        title: '',
        item: {}
      },

      selectedItem: null,
      search: null,
      loading: false,
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
    setStyle({index}) {
      return {
        class: index % 2 === 0 ? 'bg-white' : 'bg-indigo-lighten-5',
      }
    },

    async getCategoriaClientes() {
      this.data.items = []
      this.data.loading = true
      const result = await this.data.requestHttp.getCategoriaClientes()
      this.data.loading = false
      if (result) {
        result.map(item => {
          this.data.items.push(item)
        })
      }
    },

    openDialog(type, item = null) {
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
    },

    formateDate(dateString) {
      return formatters.formatDate(dateString)
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
      if (this.data.selectedItem?.idCategoriaCliente) {
        const result = await this.data.requestHttp.deleteCategoriaCliente(this.data.selectedItem.idCategoriaCliente)
        if (result.code === 200) {
          this.showSuccesAlert('¡Registro Eliminado!', true)
          this.getCategoriaClientes()
        } else {
          this.showSuccesAlert('Hubo un problema al eliminar el registro', false)
        }
      }
    },

    closeDialog(val) {
      this.data.newCatCliente.show = val
      this.data.newCatCliente.item = {}
      this.data.newCatCliente.title = ''
      this.data.newCatCliente.editar = false
      this.data.newCatCliente.ver = false
      this.getCategoriaClientes()
    },

    refresData() {
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
