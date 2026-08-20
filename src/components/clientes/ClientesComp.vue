<template>
  <div class="w-100">
    <!-- VISTA 1: TABLA Y LISTADO DE CLIENTES (cuando !data.newCliente.show) -->
    <div v-if="!data.newCliente.show">
      <v-card
        elevation="0"
        class="border-t border-b"
        rounded="0"
      >
        <template v-slot:prepend>
          <div class="d-flex align-center">
            <!-- Título -->
            <div
              class="font-weight-bold d-flex align-center"
            >
              <v-icon class="me-2" color="primary"
                >mdi-account-multiple</v-icon
              >
              <small v-if="isMobile"
                >Clientes</small
              >
              <span
                v-else
                class="text-h6 font-weight-bold"
                >Clientes</span
              >
            </div>
          </div>
        </template>
        <template v-slot:append>
          <v-btn
            v-if="hasAccessToFunct('92')"
            class="rounded"
            @click="openDialog('create', null)"
            prepend-icon="mdi-account-plus"
            color="indigo-darken-4"
            variant="tonal"
          >
            NUEVO CLIENTE
          </v-btn>
        </template>

        <v-divider />

        <v-card-text class="py-2">
          <v-row
            dense
            class="mt-1 mb-2 pa-2 bg-grey-lighten-4 rounded"
            justify="space-between"
            align="center"
          >
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="data.search"
                density="compact"
                variant="outlined"
                label="Buscar"
                hide-details
                placeholder="Buscar textos"
                persistent-placeholder
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
              sm="6"
              class="d-flex justify-end align-center"
            >
              <v-btn
                icon
                size="small"
                class="border"
                @click="getClientes()"
              >
                <v-icon color="grey"
                  >mdi-refresh</v-icon
                >
                <v-tooltip
                  activator="parent"
                  location="top center"
                >
                  Actualizar
                </v-tooltip>
              </v-btn>
            </v-col>
          </v-row>

          <v-card-subtitle
            class="d-flex align-center text-center mb-2"
          >
            <v-divider />
            <span
              class="mx-6 text-grey font-weight-bold"
              >Clientes</span
            >
            <v-divider />
          </v-card-subtitle>

          <v-data-table
            :loading="data.loading"
            :search="data.search"
            class="border font"
            :headers="data.headers"
            density="compact"
            :items="data.items"
            :row-props="setStyle"
            hover
            :header-props="{
              class: 'font-weight-bold'
            }"
            height="400"
            fixed-header
          >
            <template v-slot:loader>
              <v-progress-linear
                color="indigo"
                indeterminate
                height="2"
              />
            </template>
            <template v-slot:loading>
              <v-skeleton-loader
                type="table-row@10"
              ></v-skeleton-loader>
            </template>

            <!-- SLOT NOMBRE / RAZON SOCIAL -->
            <template
              v-slot:item.nombre="{ item }"
            >
              <div>
                <div
                  class="font-weight-bold text-indigo-darken-4"
                >
                  {{ item.nombre }}
                </div>
                <div
                  v-if="
                    item.razonSocial &&
                    item.razonSocial !==
                      item.nombre
                  "
                  class="text-caption text-grey"
                >
                  {{ item.razonSocial }}
                </div>
              </div>
            </template>

            <!-- SLOT TIPO DOCUMENTO -->
            <template
              v-slot:item.tipoDocumento="{ item }"
            >
              <span
                v-if="item.tipoDocumento"
                class="font-weight-medium"
                >{{ item.tipoDocumento }}</span
              >
              <span v-else class="text-grey"
                >—</span
              >
            </template>

            <!-- SLOT NUMERO DOCUMENTO -->
            <template
              v-slot:item.noDocumento="{ item }"
            >
              <v-chip
                v-if="item.noDocumento"
                size="x-small"
                color="blue-grey-darken-2"
                variant="tonal"
                class="font-weight-bold"
              >
                {{ item.noDocumento }}
              </v-chip>
              <span v-else class="text-grey"
                >—</span
              >
            </template>

            <!-- VISUALIZACIÓN ESPECIAL: RUTAS -->
            <template
              v-slot:item.rutas="{ item }"
            >
              <v-menu
                v-if="
                  item.rutas &&
                  item.rutas.length > 0
                "
                location="bottom end"
                transition="scale-transition"
                :close-on-content-click="false"
              >
                <template
                  v-slot:activator="{ props }"
                >
                  <v-chip
                    color="indigo-darken-3"
                    size="small"
                    variant="outlined"
                    class="font-weight-bold"
                    v-bind="props"
                    style="cursor: pointer"
                  >
                    {{
                      item.rutasCount ||
                      item.rutas.length
                    }}
                    {{
                      (item.rutasCount ||
                        item.rutas.length) === 1
                        ? 'ruta'
                        : 'rutas'
                    }}
                    <v-icon
                      size="x-small"
                      class="ml-1"
                      >mdi-eye</v-icon
                    >
                  </v-chip>
                </template>

                <v-card
                  width="280"
                  class="elevation-4 border rounded-lg"
                >
                  <v-card-item
                    class="bg-indigo-lighten-5 py-2"
                  >
                    <v-card-title
                      class="text-subtitle-2 font-weight-bold text-indigo-darken-4 d-flex align-center justify-space-between"
                    >
                      <span
                        class="d-flex align-center"
                      >
                        <v-icon
                          size="small"
                          class="mr-1"
                          color="indigo"
                          >mdi-routes</v-icon
                        >
                        Rutas Asignadas
                      </span>
                      <v-chip
                        size="x-small"
                        color="indigo"
                        variant="flat"
                        max-width="110"
                        class="text-truncate"
                      >
                        {{ item.nombre }}
                      </v-chip>
                    </v-card-title>
                  </v-card-item>
                  <v-divider></v-divider>

                  <v-list
                    density="compact"
                    class="py-1"
                  >
                    <v-list-item
                      v-for="(
                        r, idx
                      ) in item.rutas"
                      :key="idx"
                      density="compact"
                      class="py-1"
                    >
                      <template v-slot:prepend>
                        <v-icon
                          size="small"
                          color="indigo"
                          >mdi-map-marker-path</v-icon
                        >
                      </template>
                      <v-list-item-title
                        class="text-caption font-weight-medium"
                      >
                        {{ r.nombre }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
              <span
                v-else-if="item.ruta"
                class="font-weight-medium text-caption"
              >
                {{ item.ruta }}
              </span>
              <span v-else class="text-grey"
                >—</span
              >
            </template>

            <!-- VISUALIZACIÓN ESPECIAL: DIRECCIONES -->
            <template
              v-slot:item.direcciones="{ item }"
            >
              <v-menu
                v-if="
                  item.direcciones &&
                  item.direcciones.length > 0
                "
                location="bottom end"
                transition="scale-transition"
                :close-on-content-click="false"
              >
                <template
                  v-slot:activator="{ props }"
                >
                  <v-chip
                    color="teal-darken-3"
                    size="small"
                    variant="outlined"
                    class="font-weight-bold"
                    v-bind="props"
                    style="cursor: pointer"
                  >
                    {{
                      item.direccionesCount ||
                      item.direcciones.length
                    }}
                    {{
                      (item.direccionesCount ||
                        item.direcciones
                          .length) === 1
                        ? 'dirección'
                        : 'direcciones'
                    }}
                    <v-icon
                      size="x-small"
                      class="ml-1"
                      >mdi-eye</v-icon
                    >
                  </v-chip>
                </template>

                <v-card
                  width="380"
                  class="elevation-4 border rounded-lg"
                >
                  <v-card-item
                    class="bg-teal-lighten-5 py-2"
                  >
                    <v-card-title
                      class="text-subtitle-2 font-weight-bold text-teal-darken-4 d-flex align-center justify-space-between"
                    >
                      <span
                        class="d-flex align-center"
                      >
                        <v-icon
                          size="small"
                          class="mr-1"
                          color="teal"
                          >mdi-map-marker-multiple</v-icon
                        >
                        Direcciones
                      </span>
                      <v-chip
                        size="x-small"
                        color="teal"
                        variant="flat"
                        max-width="140"
                        class="text-truncate"
                      >
                        {{ item.nombre }}
                      </v-chip>
                    </v-card-title>
                  </v-card-item>
                  <v-divider></v-divider>

                  <v-list
                    density="compact"
                    class="py-1"
                  >
                    <v-list-item
                      v-for="(
                        dir, idx
                      ) in item.direcciones"
                      :key="idx"
                      density="compact"
                      class="py-2 border-b"
                    >
                      <template v-slot:prepend>
                        <v-icon
                          size="small"
                          :color="
                            dir.esDirFacturacion
                              ? 'amber-darken-3'
                              : 'teal'
                          "
                        >
                          {{
                            dir.esDirFacturacion
                              ? 'mdi-file-document-outline'
                              : 'mdi-map-marker'
                          }}
                        </v-icon>
                      </template>
                      <v-list-item-title
                        class="text-caption font-weight-bold d-flex align-center justify-space-between"
                      >
                        <span>{{
                          dir.nombre ||
                          'Dirección'
                        }}</span>
                        <v-chip
                          v-if="
                            dir.esDirFacturacion
                          "
                          size="x-small"
                          color="amber-darken-3"
                          variant="flat"
                        >
                          Facturación
                        </v-chip>
                      </v-list-item-title>
                      <v-list-item-subtitle
                        class="text-caption text-wrap text-grey-darken-2 mt-1"
                      >
                        {{
                          dir.direccionIngresada
                        }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle
                        class="text-caption text-grey mt-1"
                      >
                        <v-icon
                          size="x-small"
                          class="mr-1"
                          >mdi-city-variant</v-icon
                        >
                        {{ dir.departamento
                        }}<span
                          v-if="
                            dir.municipio &&
                            dir.municipio !==
                              '- - -'
                          "
                          >,
                          {{
                            dir.municipio
                          }}</span
                        >
                      </v-list-item-subtitle>

                      <div
                        v-if="
                          dir.googleMapsURL ||
                          (dir.latitude &&
                            dir.longitude)
                        "
                        class="mt-2"
                      >
                        <v-btn
                          size="x-small"
                          color="teal-darken-3"
                          variant="tonal"
                          prepend-icon="mdi-navigation"
                          :href="getGpsUrl(dir)"
                          target="_blank"
                          class="text-none"
                        >
                          Abrir GPS Google Maps
                        </v-btn>
                      </div>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
              <span
                v-else-if="item.direccion"
                class="font-weight-medium text-caption"
              >
                {{ item.direccion }}
              </span>
              <span v-else class="text-grey"
                >—</span
              >
            </template>

            <template v-slot:item.opc="{ item }">
              <v-menu
                :close-on-content-click="false"
                location="right center"
                origin="auto"
              >
                <template
                  v-slot:activator="{ props }"
                >
                  <v-tooltip
                    text="Opciones"
                    location="top"
                  >
                    <template
                      v-slot:activator="{
                        props: tooltipProps
                      }"
                    >
                      <v-btn
                        size="small"
                        icon
                        variant="text"
                        color="grey-darken-1"
                        v-bind="{
                          ...props,
                          ...tooltipProps
                        }"
                        class="hover-scale"
                      >
                        <v-icon
                          >mdi-dots-vertical</v-icon
                        >
                      </v-btn>
                    </template>
                  </v-tooltip>
                </template>

                <v-list nav rounded="lg">
                  <v-list-item-subtitle
                    class="pa-1"
                  >
                    Opciones
                  </v-list-item-subtitle>
                  <v-list-item
                    v-if="hasAccessToFunct('93')"
                    rounded
                    density="compact"
                    prepend-icon="mdi-pencil"
                    color="indigo"
                    @click="
                      openDialog('edit', item)
                    "
                  >
                    <template v-slot:title>
                      <v-divider vertical />
                      Editar cliente
                    </template>
                  </v-list-item>

                  <v-list-item
                    rounded
                    density="compact"
                    prepend-icon="mdi-eye"
                    color="indigo"
                    @click="
                      openDialog('view', item)
                    "
                  >
                    <template v-slot:title>
                      <v-divider vertical />
                      Ver cliente
                    </template>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>

            <template
              v-slot:item.estado="{ item }"
            >
              <v-chip
                :color="
                  item.estado ? 'green' : 'error'
                "
                :text="
                  item.estado
                    ? 'Activo'
                    : 'Inactivo'
                "
              />
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>

    <!-- VISTA 2: FORMULARIO CARD DE NUEVO / EDITAR CLIENTE (cuando data.newCliente.show) -->
    <NewCliente
      v-else
      :show="data.newCliente.show"
      :editar="data.newCliente.editar"
      :title="data.newCliente.title"
      :prov="data.newCliente.item"
      @closeDialog="closeDialog"
    />

    <!-- MODAL DIALOG DE DETALLES / VER CLIENTE -->
    <DetallesCliente
      :show="data.detallesCliente.show"
      :cliente="data.detallesCliente.item"
      @cerrarDialog="
        data.detallesCliente.show = false
      "
    />

    <SuccessAlert
      :success="data.alertSuccess.success"
      :msg="data.alertSuccess.msg"
      :show="data.alertSuccess.show"
    />
    <AlertComp
      :show="data.viewAlert"
      @deleteItem="deleteAction"
    />
  </div>
</template>

<script>
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref
} from 'vue'
import { formatters } from '@/helpers/formatters'
import NewCliente from './dialogsClientes/NewCliente.vue'
import DetallesCliente from './dialogsClientes/DetallesCliente.vue'
import RequestHttp from '@/services/requestHttp'
import AlertComp from '@/components/widgets/AlertaAction.vue'
import { hasAccessToFunct } from '@/scripts/Seguridad.js'
import SuccessAlert from '@/components/widgets/SuccessAlert.vue'

export default {
  mounted() {
    this.getClientes()
  },

  components: {
    NewCliente,
    DetallesCliente,
    AlertComp,
    SuccessAlert
  },

  setup() {
    const screenWidth = ref(window.innerWidth)
    const isMobile = computed(
      () => screenWidth.value <= 850
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
      headers: [
        {
          title: '',
          key: 'opc',
          align: 'center',
          headerProps: { class: 'pa-0' },
          cellProps: { class: 'pa-0' }
        },
        {
          title: 'Tipo Cliente',
          key: 'categoriaCliente',
          align: 'center'
        },
        //{title: 'Código', key: 'codigo', align: 'center'},
        {
          title: 'Nombre Cliente',
          key: 'nombre',
          align: 'center'
        },
        {
          title: 'Tipo ID.',
          key: 'tipoDocumento',
          align: 'center'
        },
        {
          title: 'Número ID.',
          key: 'noDocumento',
          align: 'center'
        },
        {
          title: 'Teléfono',
          key: 'telefono',
          align: 'center'
        },
        {
          title: 'Rutas',
          key: 'rutas',
          align: 'center'
        },
        {
          title: 'Direcciones',
          key: 'direcciones',
          align: 'center'
        },
        {
          title: 'Estado',
          key: 'estado',
          align: 'center'
        }
      ],

      alertSuccess: {
        show: false,
        msg: '',
        success: false
      },

      items: [],
      newCliente: {
        show: false,
        editar: false,
        title: '',
        item: {}
      },

      detallesCliente: {
        show: false,
        item: null
      },

      selectedItem: null,
      search: null,
      loading: false,
      viewAlert: false,
      requestHttp: new RequestHttp()
    })

    function showSuccesAlert(
      msg,
      success = true
    ) {
      data.alertSuccess.msg = msg
      data.alertSuccess.show = true
      data.alertSuccess.success = success
      setTimeout(() => {
        data.alertSuccess.show = false
        data.alertSuccess.msg = ''
      }, 1500)
    }

    return {
      isMobile,
      data,
      showSuccesAlert
    }
  },

  methods: {
    hasAccessToFunct,
    setStyle({ index }) {
      return {
        class:
          index % 2 === 0
            ? 'bg-white'
            : 'bg-indigo-lighten-5'
      }
    },

    getGpsUrl(dir) {
      if (!dir) return '#'
      if (dir.googleMapsURL)
        return dir.googleMapsURL
      if (dir.latitude && dir.longitude) {
        return (
          'https://www.google.com/maps/dir/?api=1&destination=' +
          dir.latitude +
          ',' +
          dir.longitude
        )
      }
      return '#'
    },

    async getClientes() {
      this.data.items = []
      this.data.loading = true
      const result =
        await this.data.requestHttp.getClientes()
      this.data.loading = false
      if (result) {
        result.map((item) => {
          this.data.items.push(item)
        })
        this.data.items.reverse()
      }
    },

    openDialog(type, item = null) {
      if (type === 'view') {
        this.data.detallesCliente.item = item
        this.data.detallesCliente.show = true
        return
      }

      this.data.newCliente.show = true
      switch (type) {
        case 'create':
          this.data.newCliente.editar = false
          this.data.newCliente.item = {}
          this.data.newCliente.title =
            'Nuevo Cliente'
          break
        case 'edit':
          this.data.newCliente.editar = true
          this.data.newCliente.item = item
          this.data.newCliente.title =
            'Editar Cliente'
          break
        default:
          break
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
      if (this.data.selectedItem?.idCliente) {
        const result =
          await this.data.requestHttp.deleteCliente(
            this.data.selectedItem.idCliente
          )
        if (result.code === 200) {
          this.showSuccesAlert(
            '¡Registro Eliminado!',
            true
          )
          this.getClientes()
        } else {
          this.showSuccesAlert(
            'Hubo un problema al eliminar el registro',
            false
          )
        }
      }
    },

    closeDialog(val) {
      this.data.newCliente.show = val
      this.data.newCliente.item = {}
      this.data.newCliente.title = ''
      this.data.newCliente.editar = false
      this.getClientes()
    },

    refresData() {
      this.getClientes()
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
