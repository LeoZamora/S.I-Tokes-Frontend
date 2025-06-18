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
            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="small" color="green" @click="data.showPermisos = true"
                        class="mr-1">mdi-pencil
                </v-icon>
              </template>
            </v-tooltip>

            <v-tooltip text="Ver" location="top">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="small" color="indigo-darken-4" @click="openDialog('tipo', 'view', item)">
                  mdi-eye
                </v-icon>
              </template>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showPermisos">
      <v-card>
        <v-card-title>Permisos</v-card-title>
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

export default {
  mounted() {
    this.getRoles()
  },

  components: {
    NewRol
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


    closeDialog(val) {
      this.data.show = val
      this.getRoles()
    },
  }
}
</script>

<style scoped>

</style>