<template>
  <div>
    <v-card class="border-t border-b" elevation="0">
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div class="font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="primary">mdi-sync-circle</v-icon>
            <span class="text-h6 font-weight-bold">Movimientos</span>
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn @click="openDialog('create')" variant="tonal" color="indigo-darken-4"
          prepend-icon="mdi-plus">
          Nuevo Movimiento
        </v-btn>
      </template>
      <v-divider/>

      <v-card-text class="px-0">

        <v-row dense class="align-center px-2">
          <v-col cols="12" sm="4" md="4">
            <v-text-field v-model="data.search" density="compact" variant="outlined" label="Buscar" hide-details
              placeholder="Buscar textos" persistent-placeholder color="indigo"/>
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <v-autocomplete v-model="search.tipoMov" :items="data.movimientos" density="compact" variant="outlined"
              label="Tipos de Movimientos" hide-details
              placeholder="movimientos" persistent-placeholder color="indigo"/>
          </v-col>
          <v-col cols="12" sm="4" md="4" class="d-flex justify-end align-center">
            <v-btn size="small" icon color="green" class="border mx-2" variant="text" @click="getMovs()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn size="small" icon color="grey" variant="text" class="border" @click="clearData()">
              <v-icon>mdi-broom</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-2"/>

        <v-card-subtitle class="d-flex align-center text-center mb-2">
          <v-divider/>
          <span class="mx-6 text-grey font-weight-bold">Registros</span>
          <v-divider/>
        </v-card-subtitle>

        <v-data-table :search="data.search" :headers="data.headers" :items="filteredMovimientos" 
          class="border-b border-t font" density="compact" :row-props="setStyle" hover 
          :header-props="{ class: 'font-weight-bold text-uppercase' }" :loading="data.loading">
          <template v-slot:loader>
            <v-progress-linear color="indigo" indeterminate height="2"/>
          </template>
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
          </template>
          <template v-slot:item.monto="{ item }">
            <div>{{ formatedCurrency(item.monto) }}</div>
          </template>
          <template v-slot:item.fechaMovimiento="{ item }">
            <div>{{ formatedDate(item.fechaMovimiento) }}</div>
          </template>
          <template v-slot:item.fechaRegistro="{ item }">
            <div>{{ formatedDate(item.fechaRegistro) }}</div>
          </template>
          <template v-slot:item.fechaUltMod="{ item }">
            <div>{{ formatedDate(item.fechaUltMod) }}</div>
          </template>
          <template v-slot:item.aprobada="{ item }">
            <div>{{ item.aprobada ? 'SI' : 'NO' }}</div>
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
                    <template v-slot:title >
                        <v-divider vertical />
                        Editar Movimiento
                    </template>
                  </v-list-item>

                  <v-list-item rounded density="compact" prepend-icon="mdi-eye"
                    color="indigo" @click="openDialog('view', item)">
                    <template v-slot:title>
                        <v-divider vertical />
                        Ver Movimiento
                    </template>
                  </v-list-item>
                </v-list>
              </v-menu>
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip :color="item.estado ? 'green' : 'error'" small>
              {{ item.estado ? 'Activo' : 'Inactivo' }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <NewMov :show="data.newMov.show" :editar="data.newMov.editar" :title="data.newMov.title"
      :mov="data.newMov.item" :ver="data.newMov.ver" @closeDialog="closeDialog"/>
  </div>
</template>

<script>
import RequestHttp from '@/services/requestHttp';
import NewMov from './dialogsMov/NewMov.vue';
import {formatters} from '@/helpers/formatters';
import {reactive, ref, computed} from 'vue';
import endPoints from '@/services/endPoints';

export default {
  components: {
    NewMov
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getMovs()
      vm.getTipoMov()
    })
  },

  setup() {
    const filterTipoMov = async () => {
      data.items = data.itemsBack.filter(item => item.tipoMov === data.movimiento)
    }

    const search = ref({
      tipoMov: ''
    })
    const filteredMovimientos = computed(() => {
      return data.items.filter(item => {
        const matchCodigoContrato = item.idTipoMovimiento?.toString().includes(search.value.tipoMov)

        return matchCodigoContrato
      })
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
        {title: 'Tipo Mov', key: 'tipoMovimineto', align: 'center'},
        {title: 'Concepto', key: 'conceptoTipoMov', align: 'center'},
        {title: 'Modalidad', key: 'modalidad', align: 'center'},
        {title: 'Monto', key: 'monto', align: 'center'},
        {title: 'Fecha Mov.', key: 'fechaMovimiento', align: 'center'},
        {title: 'Fecha Registro', key: 'fechaRegistro', align: 'center'},
        {title: 'Fecha Ult.', key: 'fechaUltMod', align: 'center'},
        {title: 'Observaciones', key: 'observaciones', align: 'center'},
        {title: 'Usuario R.', key: 'usuarioRegistro', align: 'center'},
        {title: 'Usuario M.', key: 'usuarioUltMod', align: 'center'},
        {title: 'Estado', key: 'estado', align: 'center'},
      ],
      items: [],
      tiposMov: [],
      movimientos: [],
      newMov: {
        show: false,
        editar: false,
        ver: false,
        title: '',
        item: {}
      },
      nio: true,
      usd: false,
      idOrden: null,
      fomates: {
        nio: 'NIO',
        usd: 'USD'
      },
      loading: false,
      movimiento: null,
      producto: null,
      dialog: false,
      search: null,
      requestHttp: new RequestHttp()
    })
    const selectedItem = ref({});

    return {
      data,
      selectedItem,
      filterTipoMov,
      filteredMovimientos,
      search
    }
  },

  methods: {
    setStyle({index}) {
      return {
        class: index % 2 === 0 ? 'bg-white' : 'bg-indigo-lighten-5',
      }
    },

    async getTipoMov() {
      this.data.movimientos = []
      const result = await this.data.requestHttp.getCombobox(endPoints.getTipoMov)
      if (result.code === 200) {
        result.data.map(item => {
          this.data.movimientos.push({title: item.nombre, value: item.id})
        })
      }
    },

    async getMovs() {
      this.data.items = []
      
      this.data.loading = true
      const result = await this.data.requestHttp.getMovs()
      this.data.loading = false

      if (result.code === 200) {
        this.data.items = result.data
      }

      this.data.items.reverse()
    },

    openDialog(type, item = null) {
      this.data.newMov.show = true
      switch (type) {
        case 'create':
          this.data.newMov.ver = false
          this.data.newMov.editar = false
          this.data.newMov.title = 'Nuevo Movimiento'
          break;
        case 'edit':
          this.data.newMov.ver = false
          this.data.newMov.editar = true
          this.data.newMov.item = item
          this.data.newMov.title = 'Editar Movimiento'
          break;
        case 'view':
          this.data.newMov.ver = true
          this.data.newMov.editar = false
          this.data.newMov.item = item
          this.data.newMov.title = 'Movimiento'
          break;
        default:
          break;
      }
    },


    formatedCurrency(key) {
      const value = formatters.formatCurrency(key)
      return value
    },

    formatedDate(dataString) {
      const value = formatters.formatDate(dataString)
      return value
    },

    clearData() {
      this.data.movimiento = null
      this.data.search = null
      this.getData()
    },

    closeDialog(val) {
      this.data.items = []
      this.data.newMov.show = val
      this.data.newMov.item = {}
      this.data.newMov.title = ''
      this.data.newMov.editar = val
      this.data.newMov.ver = val
      this.getMovs()
    },
  }

}
</script>

<style scoped>
.font {
  font-size: 12px !important;
  color: black;
  font-weight: 500;
}
</style>