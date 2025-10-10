<template>
  <div class="w-100">
    <!-- Encabezado y botón de agregar -->
    <v-card
        class="border"
        elevation="0"
        rounded="0"
    >
      <!-- Encabezado -->
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div
              class="text-h6 font-weight-bold d-flex align-center"
          >
            <v-icon class="me-2" color="indigo"
            >mdi-package-variant
            </v-icon>
            Productos
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn class="mr-4" variant="tonal" color="error" @click="exportToExcel">
          <v-icon>
            mdi-download-multiple
          </v-icon>
          <v-tooltip location="top center" activator="parent">
            Descargar Inventario
          </v-tooltip>
        </v-btn>
        <v-btn
            class="bg-indigo rounded-"
            @click="openDialog('create')"
        >
          <v-icon>mdi-plus</v-icon>
          <v-tooltip
              activator="parent"
              location="left"
          >Agregar Producto
          </v-tooltip>
        </v-btn>
      </template>
      <v-divider/>

      <v-row class="pa-2" dense>
        <v-col cols="6" md="6" sm="6">
          <v-text-field
              color="indigo"
              density="compact"
              variant="outlined"
              append-inner-icon="mdi-magnify"
              label="Buscar productos"
              v-model="search"
              hide-details
              placeholder="Ingrese un texto a buscar..."
              persistent-placeholder
          />
        </v-col>
        <v-col
            cols="6"
            md="6"
            sm="6"
            class="d-flex justify-end align-center"
        >
          <v-btn
              icon
              color="indigo"
              size="small"
              @click="getProductos"
              variant="text"
              class="mr-2 border"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn
              icon
              color="grey"
              size="small"
              variant="text"
              class="border"
          >
            <v-icon>mdi-broom</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <!-- Tabla de productos -->
    <v-card
        elevation="0"
        class="border"
        rounded="0"
    >
      <v-data-table
          class="font"
          density="compact"
          :headers="data.headers"
          :items="data.products"
          :items-per-page="10"
          :search="search"
          :loading="data.loading"
          :row-props="setStyle"
          :header-props="{
          class: 'font-weight-bold'
        }"
          hover
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
        <template v-slot:item.costo="{ item }">
          {{ formatCurrency(item.costo) }}
        </template>
        <template v-slot:item.precio="{ item }">
          {{ formatCurrency(item.precio) }}
        </template>

        <template
            v-slot:item.fechaRegistro="{ item }"
        >
          {{ formatDate(item.fechaRegistro) }}
        </template>

        <template v-slot:item.estado="{ item }">
          <v-chip
              :color="
              item.estado ? 'green' : 'error'
            "
              small
          >
            {{
              item.estado ? 'Activo' : 'Inactivo'
            }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-tooltip text="Editar" location="top">
            <template
                v-slot:activator="{ props }"
            >
              <v-icon
                  v-bind="props"
                  size="small"
                  color="green"
                  class="mr-1"
                  @click="openDialog('edit', item)"
              >
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip
              text="Eliminar"
              location="top"
          >
            <template
                v-slot:activator="{ props }"
            >
              <v-icon
                  v-bind="props"
                  size="small"
                  color="error"
                  class="mr-1"
                  @click="showAlert(item)"
              >mdi-delete
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip text="Ver" location="top">
            <template
                v-slot:activator="{ props }"
            >
              <v-icon
                  v-bind="props"
                  size="small"
                  color="indigo-darken-4"
                  @click="openDialogDet(item)"
              >mdi-eye
              </v-icon>
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <new-categoria
        :title="nuevaCategoriaDisplay.title"
        :show="nuevaCategoriaDisplay.show"
        :editar="nuevaCategoriaDisplay.editar"
        :cat="nuevaCategoriaDisplay.item"
        :ver="nuevaCategoriaDisplay.ver"
        @closeDialog="closeNuevaCategoriaDisplay"
    ></new-categoria>

    <new-sub-categoria
        :title="nuevaSubCatDisplay.title"
        :show="nuevaSubCatDisplay.show"
        :editar="nuevaSubCatDisplay.editar"
        :sub-cat="nuevaSubCatDisplay.item"
        :ver="nuevaSubCatDisplay.ver"
        @closeDialog="closeNuevaSubCatDisplay"
    ></new-sub-categoria>

    <!-- Diálogo para agregar/editar -->
    <v-dialog
        v-model="data.dialog"
        width="750"
        min-height="500"
        persistent
    >
      <v-card class="w-100 mb-6" elevation="0">
        <v-card-title
            class="text-h5 text-center pa-1 font-weight-bold bg-indigo"
        >
          <v-icon>mdi-package-variant</v-icon>
          Inventario - Registro de Productos
        </v-card-title>

        <v-tabs
            v-model="registroDisplay.tab"
            color="primary"
            density="compact"
            class="mt-2"
        >
          <v-tab
              height="25"
              density="compact"
              class="border custom-border"
          ><small
          >Información del Producto</small
          >
          </v-tab>
          <v-tab
              height="25"
              density="compact"
              class="border custom-border"
          ><small
          >Detalles Adicionales</small
          ></v-tab
          >
        </v-tabs>

        <v-divider></v-divider>

        <v-card-text class="pa-2">
          <v-window
              v-model="registroDisplay.tab"
              class="pa-2"
          >
            <v-window-item>
              <v-form class="w-100" ref="form">
                <v-row>
                  <v-col cols="12">
                    <div
                        class="border-custom pa-2"
                    >
                      <v-card-subtitle
                      >Clasificación del
                        Producto
                      </v-card-subtitle>
                      <v-divider
                          class="mb-2"
                      ></v-divider>
                      <v-row dense>
                        <v-col cols="12">
                          <v-select
                              v-model="
                              data.form
                                .idCategoria
                            "
                              label="Categoría:"
                              :items="
                              cmb.categorias
                            "
                              :rules="[
                              rules.required
                            ]"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-shape-outline"
                              hide-details
                              @update:model-value="loadCmbSubCategoria(data.form.idCategoria)"
                          >
                            <template v-slot:prepend>
                              <v-btn
                                  @click="openNuevaCategoriaDisplay"
                                  color="secondary"
                                  size="32"
                              >
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </template>
                          </v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                              v-model="
                              data.form.idSubCatProd"
                              label="Sub categoría"
                              :items="cmb.subCategorias"
                              :rules="[
                                rules.required
                              ]"
                              variant="outlined"
                              hide-details
                              density="compact"
                              prepend-inner-icon="mdi-shape-outline"
                              @update:model-value="loadCodigoRecomendado(data.form.idSubCatProd)"
                          >
                            <template v-slot:prepend>
                              <v-btn
                                  @click="openNuevaSubCatDisplay"
                                  color="secondary"
                                  size="32"
                              >
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </template>
                          </v-select>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                        color="indigo"
                        v-model="data.form.codigo"
                        label="Código"
                        :rules="[rules.required]"
                        variant="outlined"
                        hide-details
                        clearable
                        density="compact"
                        prepend-inner-icon="mdi-barcode"
                    />
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                        color="indigo"
                        v-model="data.form.nombre"
                        label="Nombre"
                        :rules="[
                        rules.required,
                        rules.minLength(3)
                      ]"
                        variant="outlined"
                        hide-details
                        density="compact"
                        clearable
                        prepend-inner-icon="mdi-text-box"
                    />
                  </v-col>
                  <v-col cols="3">
                    <div
                        class="border-custom pa-2"
                    >
                      <v-card-subtitle
                      >Costo del Producto
                      </v-card-subtitle>
                      <v-divider
                          class="mb-2"
                      ></v-divider>
                      <v-text-field
                          v-model="data.form.costo"
                          :rules="[
                          rules.required,
                          rules.numeric
                        ]"
                          class="mb-2"
                          prefix="C$"
                          label="Por unidad:"
                          variant="outlined"
                          hide-details
                          density="compact"
                          type="number"
                          step="0.01"
                          @input="handleChangeCosto"
                      >
                      </v-text-field>
                      <v-text-field
                          v-model="
                          data.form.costoDolar
                        "
                          :rules="[
                          rules.required,
                          rules.numeric
                        ]"
                          prefix="$"
                          label="En US$:"
                          variant="outlined"
                          hide-details
                          density="compact"
                          type="number"
                          step="0.01"
                          @input="
                          handleChangeCostoDolar
                        "
                      >
                      </v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="3">
                    <div
                        class="border-custom pa-2"
                    >
                      <v-card-subtitle
                      >Precio de Venta
                      </v-card-subtitle>
                      <v-divider
                          class="mb-2"
                      ></v-divider>
                      <v-text-field
                          v-model="data.form.precio"
                          :rules="[
                          rules.required,
                          rules.numeric
                        ]"
                          class="mb-2"
                          prefix="C$"
                          label="Precio:"
                          variant="outlined"
                          hide-details
                          density="compact"
                          type="number"
                          step="0.01"
                          @input="
                          handleChangePrecio
                        "
                      >
                      </v-text-field>
                      <v-text-field
                          v-model="
                          data.form.utilidad
                        "
                          :rules="[
                          rules.required,
                          rules.numeric
                        ]"
                          prefix="%"
                          label="% Utilidad:"
                          variant="outlined"
                          hide-details
                          density="compact"
                          type="number"
                          step="0.01"
                          @input="
                          handleChangeUtilidad
                        "
                      >
                      </v-text-field>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6" sm="6">
                    <v-row dense>
                      <v-col cols="12">
                        <v-autocomplete
                            v-model="
                        data.form.idUnidadMedida
                      "
                            :items="data.unidadesMedidas"
                            label="Unidad Medida:"
                            variant="outlined"
                            density="compact"
                            hide-details
                        >
                          <template v-slot:prepend>
                            <v-btn
                                @click="data.showDiagUM = true"
                                color="secondary"
                                size="32"
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                            color="indigo"
                            v-model="
                              data.form.cantidadMinima
                            "
                            label="Stock Mínimo"
                            :rules="[
                              rules.required,
                              rules.numeric
                            ]"
                            variant="outlined"
                            hide-details
                            density="compact"
                            type="number"
                            prepend-inner-icon="mdi-numeric"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                            color="indigo"
                            v-model="
                        data.form.cantidadTotal
                      "
                            label="Stock"
                            :rules="[
                              rules.required,
                              rules.numeric
                            ]"
                            variant="outlined"
                            hide-details
                            density="compact"
                            type="number"
                            prepend-inner-icon="mdi-numeric"
                        />
                      </v-col>
                    </v-row>

                  </v-col>
                  <v-col
                      cols="12"
                      md="12"
                      sm="12"
                  >
                    <v-textarea
                        v-model="data.form.observaciones"
                        density="compact"
                        variant="outlined"
                        label="Observaciones"
                        prepend-inner-icon="mdi-text"
                        rows="2"
                        auto-grow
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-window-item>
            <v-window-item>
              <v-col
                  style="
                  border: 1px solid #e0e0e0;
                  border-left: none;
                "
              >
                <div>
                  <div
                      class="d-flex justify-center mt-2 mb-2"
                  >
                    <v-chip color="secondary">
                      Imagen del Producto
                    </v-chip>
                  </div>
                  <v-file-input
                      v-model="
                      registroDisplay.imagen
                        .archivo
                    "
                      :accept="
                      registroDisplay.formatosImagen
                    "
                      label="Selecciona una imagen"
                      show-size
                      @change="handleInputImagen"
                  ></v-file-input>
                  <v-img
                      v-if="
                      registroDisplay.imagen.url
                    "
                      style="
                      border-top: 1px solid
                        #e0e0e0;
                    "
                      :src="
                      registroDisplay.imagen.url
                    "
                      aspect-ratio="1"
                      contain
                      height="250px"
                  >
                    <v-btn
                        icon
                        @click="
                        handleEliminarImagen
                      "
                    >
                      <v-icon
                          style="color: #f44336"
                      >
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </v-img>
                  <div
                      class="d-flex flex-column justify-center align-center"
                      v-else
                      style="
                      border-top: 1px solid
                        #e0e0e0;
                      height: 250px;
                    "
                  >
                    <h3>Sin imagen.</h3>
                  </div>
                </div>
              </v-col>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
              color="grey"
              variant="outlined"
              @click="closeDialog()"
          >
            Cerrar
          </v-btn>
          <v-btn
              class="bg-indigo"
              @click="guardarRegistro"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <DetallesProducto
        :show="data.showDialog"
        :producto="data.productDialog"
        @cerrarDialog="closeDialogDet"
    />
    <AlertComp
        :show="data.viewAlert"
        @deleteItem="deleteAction"
    />

    <v-dialog v-model="data.showDiagUM" max-width="400" persistent>
      <v-card id="diag-fact">
        <v-card-title class="bg-indigo d-flex align-center">
          <h5>
            <v-icon>mdi-scale-balance</v-icon>
            Nueva Unidad de Medida
          </h5>
          <v-spacer/>
          <v-btn icon size="small" color="white" variant="tonal" @click="closeDialogUM()">
            <v-icon>mdi-close</v-icon>
            <v-tooltip activator="parent" location="top" text="Cerrar"/>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="umForm">
            <v-row dense>
              <v-col cols="12" md="12" sm="12" class="py-2">
                <v-text-field v-model="data.unidadMedida.abreviatura" prepend-inner-icon="mdi-barcode" 
                  density="compact" variant="outlined" hide-details label="Abreviatura"
                  :rules="[ rules.required]"/>
              </v-col>
              <v-col cols="12" md="12" sm="12" class="py-2">
                <v-text-field v-model="data.unidadMedida.nombre" prepend-inner-icon="mdi-ruler" 
                  density="compact" variant="outlined" hide-details label="Nombre"
                  :rules="[ rules.required]"/>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
              color="grey"
              variant="outlined"
              @click="closeDialogUM()"
          >
            Cerrar
          </v-btn>
          <v-btn
              class="bg-indigo"
              @click="guardarUnidadMedida"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="data.descarga.show" width="400">
      <v-card>
        <template v-slot:prepend>
          <h3>
            Descargar inventario
          </h3>
        </template>
        <template v-slot:append>
          <v-btn icon variant="tonal" size="small" @click="data.descarga.show = false">
            <v-icon size="small">
              mdi-close
            </v-icon>
          </v-btn>
        </template>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-select
                  v-model="data.form.idCategoria" label="Categoría:"
                  :items="cmb.categorias" variant="outlined" density="compact" 
                  prepend-inner-icon="mdi-shape-outline" hide-details 
                  @update:model-value="loadCmbSubCategoria(data.form.idCategoria)"
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select v-model=" data.form.idSubCatProd" label="Sub categoría"
                  :items="cmb.subCategorias" variant="outlined" hide-details 
                  density="compact" prepend-inner-icon="mdi-shape-outline"
                  @update:model-value="loadCodigoRecomendado(data.form.idSubCatProd)"
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select v-model=" data.form.idSubCatProd" label="Producto"
                  :items="cmb.subCategorias" variant="outlined" hide-details 
                  density="compact" prepend-inner-icon="mdi-shape-outline"
                  @update:model-value="loadCodigoRecomendado(data.form.idSubCatProd)"
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-checkbox label="Descargar todo el inventario" color="indigo"
                hide-details density="compact"/>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="elevated" class="bg-indigo-darken-4" @click="exportToExcel">
            <template v-slot:prepend>
              <v-icon>
                mdi-download
              </v-icon>
            </template>
            Descargar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  watch
} from 'vue'
import {utilsFunctions} from '@/helpers/utilFunctions'
import DetallesProducto from './modalsProductos/DetallesProducto.vue'
import RequestHttp from '@/services/requestHttp'
import AlertComp from '@/components/widgets/AlertComp.vue'
import {
  getItemsCombobox,
  httpGet, httpPost, httpPut
} from '@/scripts/api.js'
import { saveAs } from "file-saver";
import ExcelJS from 'exceljs'
import axios from "axios";
import NewCategoria from "@/components/inventario/Categorias/modalsCategorias/NewCategoria.vue";
import NewSubCategoria from "@/components/inventario/Categorias/modalsCategorias/NewSubCat.vue";
import { time } from 'echarts'

export default {
  mounted() {
    this.getProductos()
    this.loadCmbCategoria()
  },

  components: {
    NewCategoria,
    NewSubCategoria,
    DetallesProducto,
    AlertComp
  },

  setup() {
    const token = ref(JSON.parse(localStorage.getItem('token')))
    const screenWidth = ref(window.innerWidth)
    const isMobile = computed(
        () => screenWidth.key < 600
    )
    const updateScreen = () => {
      screenWidth.key = window.innerWidth
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
      products: [],
      tipos: [
        {
          title: 'Herramientas',
          value: 'Herramientas'
        }
      ],
      headers: [
        {
          title: 'Acciones',
          key: 'actions',
          sortable: false,
          align: 'center'
        },
        {
          title: 'Categoría',
          key: 'categoria',
          align: 'center'
        },
        {
          title: 'Sub categoría',
          key: 'categoria',
          align: 'center'
        },
        {
          title: 'Código',
          key: 'codigo',
          align: 'center'
        },
        {
          title: 'Nombre',
          key: 'nombre',
          align: 'center'
        },
        {
          title: 'U/M',
          key: 'unidadMedida',
          align: 'center'
        },
        {
          title: 'Costo',
          key: 'costo',
          align: 'center'
        },
        {
          title: 'Precio Venta',
          key: 'precio',
          align: 'center'
        },
        {
          title: 'Stock',
          key: 'cantidadTotal',
          align: 'center'
        },
        {
          title: 'Fecha Registro',
          key: 'fechaRegistro',
          align: 'center'
        },
        {
          title: 'Usuario Registro',
          key: 'usuarioRegistro',
          align: 'center'
        },
        {
          title: 'Estado',
          key: 'estado',
          align: 'center'
        }
      ],
      subCategorias: [],
      unidadesMedidas: [],
      unidadMedida: {
        abreviatura: null,
        nombre: null,
        usuarioRegistro: null
      },
      descarga: {
        show: false
      },

      form: {
        idProducto: 0,
        codigo: null,
        nombre: null,
        precio: null,
        utilidad: null,
        costo: null,
        costoDolar: null,
        idCategoria: null,
        idSubCatProd: null,
        idUnidadMedida: 1,
        cantidadTotal: 0,
        cantidadMinima: 0,
        usuarioRegistro: 'admin',
        observaciones: '',
      },
      showDiagUM: false,
      imagen: null,
      observaciones: null,
      selectedProduct: null,
      loading: false,
      showDialog: false,
      dialog: false,
      viewAlert: false,
      requestHttp: new RequestHttp()
    })

    async function getSubCategorias() {
      data.subCategorias = []
      const result = await data.requestHttp.getSubCategorias()
      if (result !== null) {
        result.map((item) => {
          data.subCategorias.push({
            title: item.nombre,
            value: item.idSubCatProd
          })
        })
      } else {
        throw new Error('Error en la solicitud')
      }
    }

    async function getUnidadMedida() {
      data.unidadesMedidas = []
      const result = await data.requestHttp.getUnidadMedida()
      if (result !== null) {
        result.map((item) => {
          data.unidadesMedidas.push({
            title: item.nombre,
            value: item.id
          })
        })
      } else {
        throw new Error('Error en la solicitud')
      }
    }

    watch(() => data.dialog, (val) => {
      if (val) {
        getSubCategorias()
        getUnidadMedida()
      }
    })

    return {
      data,
      isMobile,
      getSubCategorias,
      getUnidadMedida,
      token
    }
  },

  data() {
    return {
      cmb: {
        unidadesMedida: [],
        categorias: [],
        subCategorias: []
      },

      nuevaCategoriaDisplay: {
        show: false,
        editar: false,
        ver: false,
        title: '',
        item: {}
      },

      nuevaSubCatDisplay: {
        show: false,
        editar: false,
        ver: false,
        title: '',
        item: {}
      },

      registroDisplay: {
        tab: null,
        imagen: {
          archivo: null,
          url: null
        },
        formatosImagen: [
          'image/jpeg',
          'image/jpg',
          'image/png'
        ],
        eliminarImagen: false,
        maxFileSize: 1 * 1024 * 1024,
        actualizandoCosto: false
      },

      search: '',
      dialog: false,
      deleteDialog: false,
      dialogMode: 'create',
      selectedProduct: null,
      productToDelete: null,
      rules: {
        required: (key) =>
            !!key || 'Campo requerido',
        minLength: (min) => (key) =>
            (key && key.length >= min) ||
            `Mínimo ${min} caracteres`,
        numeric: (key) =>
            !isNaN(parseFloat(key)) ||
            'Debe ser un número válido'
      }
    }
  },

  computed: {
    dialogTitle() {
      return this.dialogMode === 'create'
        ? 'Nuevo Producto'
        : 'Editar Producto'
    }
  },

  methods: {
    openNuevaCategoriaDisplay() {
      this.nuevaCategoriaDisplay.show = true
    },

    async closeNuevaCategoriaDisplay() {
      await this.loadCmbCategoria()
      this.nuevaCategoriaDisplay.show = false
    },

    openNuevaSubCatDisplay() {
      this.nuevaSubCatDisplay.show = true
      this.nuevaSubCatDisplay.title = 'Nueva SubCategoria'
    },

    async closeNuevaSubCatDisplay() {
      this.nuevaSubCatDisplay.show = false
      this.nuevaSubCatDisplay.item = {}
      this.loadCmbSubCategoria(this.data.form.idCategoria)
      this.getSubCategorias()
    },

    async loadCodigoRecomendado(idSubCat) {
      var codigoRecomendado = await httpGet(
          `api/producto/codigo-recomendado?idSubCat=${idSubCat}`
      )
      this.data.form.codigo = String(codigoRecomendado)
    },

    handleChangeCosto() {
      if (!this.data.form.costo) {
        this.data.form.costoDolar = null
        return
      }
      this.data.form.costoDolar = (
          this.data.form.costo / 36.6243
      ).toFixed(4)
      this.handleChangePrecio()
    },

    handleChangeCostoDolar() {
      if (!this.data.form.costoDolar) {
        this.data.form.costo = null
        return
      }
      this.data.form.costo = (
          this.data.form.costoDolar * 36.6243
      ).toFixed(4)
      this.handleChangePrecio()
    },

    handleChangePrecio() {
      if (!this.data.form.precio) {
        this.data.form.utilidad = null
        return
      }
      var precio = Number(this.data.form.precio)
      var costo = Number(this.data.form.costo)
      this.data.form.utilidad = (
          ((precio - costo) / costo) *
          100
      ).toFixed(4)
    },

    handleChangeUtilidad() {
      if (!this.data.form.utilidad) {
        this.data.form.precio =
            this.data.form.costo
        return
      }
      var utilidad = Number(
          this.data.form.utilidad
      )
      var costo = Number(this.data.form.costo)
      this.data.form.precio =
          (utilidad / 100) * costo + costo
    },

    handleInputImagen() {
      let me = this
      const file =
          me.registroDisplay.imagen.archivo
      if (
          file &&
          file.size > me.registroDisplay.maxFileSize
      ) {
        me.registroDisplay.imagen.archivo = ''
        alert(
            'El archivo excede el tamaño máximo de 1MB.'
        )
      } else {
        if (file) {
          me.registroDisplay.imagen.url =
              URL.createObjectURL(file)
        } else {
          me.registroDisplay.imagen.url = null
        }
      }
    },

    handleEliminarImagen() {
      this.registroDisplay.imagen.url = ''
      this.registroDisplay.imagen.archivo = null
      this.registroDisplay.eliminarImagen = true
    },

    setStyle({index}) {
      return {
        class:
            index % 2 === 0
                ? 'bg-white'
                : 'bg-indigo-lighten-5'
      }
    },

    async getProductos() {
      this.data.products = []
      this.data.loading = true
      const result =
          await this.data.requestHttp.getProductos()
      this.data.products = result
      this.data.loading = false
    },

    async loadCmbUnidadMedida() {
      var unidades = await getItemsCombobox(
          'api/unidades-medida/combobox',
          false
      )
      this.cmb.unidadesMedida = unidades
    },

    async loadCmbCategoria() {
      var categorias = await getItemsCombobox(
          'api/categoriaproducto/combobox',
          true
      )
      this.cmb.categorias = categorias
    },

    async loadCmbSubCategoria(id) {
      var subCategorias = await getItemsCombobox(
        `api/subcatproducto/combobox?idCategoria=${id}`
      )
      this.cmb.subCategorias = subCategorias
    },

    async guardarRegistro() {
      this.data.form.usuarioRegistro = this.token.usuario
      if (this.dialogMode === 'edit') {
        await httpPut(`api/producto/${this.data.form.idProducto}`, this.data.form)
        await this.actActualizarImagen()
        await this.getProductos()
        this.closeDialog()
      } else {
        var response = await httpPost('api/producto', this.data.form)
        this.data.form.idProducto = response.data
        await this.actActualizarImagen()
        await this.getProductos()
        this.closeDialog()
      }
    },

    async guardarUnidadMedida() {
      this.$refs.umForm.validate()
      this.data.unidadMedida.usuarioRegistro = this.token.usuario
      const valid = utilsFunctions.objectValidate(this.data.unidadMedida)

      if (valid) {
        const result = await this.data.requestHttp.postUnidadMedida(this.data.unidadMedida)
        alert(result)
      } else {
        alert('Complete la información.')
        return
      }
      this.closeDialogUM()
    },

    async actActualizarImagen() {
      const file = this.registroDisplay.imagen.archivo
      var id = this.data.form.idProducto
      if (file || this.registroDisplay.eliminarImagen) {
        const formData = new FormData()
        formData.append('imagen', file)
        try {
          await httpPut(`api/producto/${id}/imagen`, formData)
        } catch (err) {
          console.log(err)
        }
      } else {
        //alert('no se eliminar imagen')
      }
      this.registroDisplay.eliminarImagen = false
    },

    async openDialog(mode, product = null) {
      this.registroDisplay.imagen.url = null
      this.registroDisplay.imagen.archivo = null
      await this.loadCmbUnidadMedida()
      await this.loadCmbCategoria()
      if (mode !== 'edit') {
      } else {
        await this.loadCmbSubCategoria(product.idCategoriaProducto)
      }
      this.dialogMode = mode
      if (product) {
        this.selectedProduct = product.idProducto
        this.data.form.idProducto = product.idProducto
        this.data.form.observaciones = product.observaciones
        this.data.form.idUnidadMedida = product.idUnidadMedida
        this.data.form.codigo = product.codigo
        this.data.form.idCategoria = product.idCategoriaProducto
        this.data.form.costo = product.costo
        this.data.form.categoria =
            product.categoria
        this.data.form.nombre = product.nombre
        this.data.form.precio = product.precio
        this.data.form.categoria =
            product.categoria
        this.data.form.idSubCatProd =
            product.idSubCatProd
        this.data.form.tipoProducto =
            product.tipoProducto
        this.data.form.cantidadTotal =
            product.cantidadTotal
        this.data.form.cantidadMinima =
            product.cantidadMinima
        this.data.form.usuarioRegistro =
            product.usuarioRegistro
        this.loadImagenProducto(product.idProducto)
      }
      this.dialog = true
      this.data.dialog = true
      this.handleChangeCosto()
    },

    async loadImagenProducto(id) {
      try {
        const response = await axios.get(`api/producto/${id}/imagen`, {
          responseType: 'arraybuffer',
        })

        const base64Image = btoa(
            new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
            ),
        )
        this.registroDisplay.imagen.url = 'data:image/jpeg;base64,' + base64Image
      } catch (err) {
      }
    },

    openDialogDet(obj) {
      (this.data.showDialog =
          !this.data.showDialog),
          (this.data.productDialog = obj)
    },

    closeDialogDet(key) {
      this.data.showDialog = key
    },

    closeDialogUM() {
      this.data.showDiagUM = false
      this.data.unidadMedida = {}
      this.getUnidadMedida()
    },

    closeDialog() {
      this.dialog = false
      this.data.dialog = false
      this.selectedProduct = null
      this.data.form.idSubCatProd = null
      this.data.form = {}
    },

    async handleSave(productData) {
      this.data.form.costo = Number(
          this.data.form.costo
      )
      this.data.form.precio = Number(
          this.data.form.precio
      )
      this.data.form.cantidadMinima = Number(
          this.data.form.cantidadMinima
      )
      this.data.form.cantidadTotal = Number(
          this.data.form.cantidadTotal
      )
      const valid =
          utilsFunctions.objectValidate(productData)

      if (this.dialogMode === 'create') {
        if (!valid) {
          alert('Complete toda la informacion')
          return
        }

        try {
          productData.idUnidadMedida = 1
          const result =
              await this.data.requestHttp.postProducto(
                  productData
              )
          if (result !== null) {
            alert('Registro Guardado')
            this.getProductos()
          } else {
            alert('Error al guardar el producto')
          }
        } catch (error) {
          throw new Error(
              'Error en la solicitud',
              error
          )
        }
      } else {
        if (!valid) {
          alert('Complete toda la informacion')
          return
        }
        try {
          if (productData.imagen === null) {
            productData.imagen === 'NO IMAGE'
          }
          productData.idUnidadMedida = 1
          const result =
              await this.data.requestHttp.putProductos(
                  productData,
                  this.selectedProduct
              )
          if (result !== null) {
            alert('Registro Editado')
            this.getProductos()
          } else {
            alert('Error al guardar el producto')
          }
        } catch (error) {
          throw new Error(
              'Error en la solicitud',
              error
          )
        }
      }
      this.closeDialog()
    },


    // DESCARGA DE INVENTARIO
    exportToExcel() {
      const go = this
      if(go.data.headers.length === 0 || go.data.products.length === 0) {
        alert('No hay datos a exportar')
        return
      }

      const filteredHeaders = this.data.headers.filter(header => header.key !== 'actions')
      const header = ["", ...filteredHeaders.map(header => header.title)];

      const productos = []
      this.data.products.map(item => {
        productos.push(item)
      })

      let totalInv = 0;
      let totalVentaInv = 0;
      let totalUtilidad = 0;
      productos.map(item => {
        totalInv += item.cantidadTotal * item.costo;
        totalVentaInv += item.cantidadTotal * item.precio

        item.utilidad = item.cantidadTotal * (item.precio - item.costo)
        // item.precio = this.formatCurrency(item.precio)
        // item.costo = this.formatCurrency(item.costo)
      })

      productos.map(item => {
        totalUtilidad += item.utilidad
      })

      const rows = this.data.products.map(item =>
        ["", ...filteredHeaders.map(header => item[header.key] || 0)]
      );

      const today = new Date()
      const dateNow = `${("0" + today.getDate()).slice(-2)}/${("0" + (today.getMonth() + 1)).slice(-2)}/${today.getFullYear().toString().slice(-2)}`
      const timeNow = `${("0" + today.getHours()).slice(-2)}:${("0" + today.getMinutes()).slice(-2)}:${("0" + today.getSeconds()).slice(-2)}`;

      // const clienteR = go.data.clientes.find(item => item.value === go.data.clienteObj.cliente)
      // const objetivoR = go.data.objetivos.find(item => item.value === go.data.clienteObj.objetivo)

      const exporData = [
          // [],
          ["", "", "", "", "", "FECHA-HORA", `${dateNow} - ${timeNow}`],
          ["", "", "", "TOTAL INVENTARIO", this.formatCurrency(totalInv)
            || "", "TOTAL INV VENTA", this.formatCurrency(totalVentaInv)
            || "", "TOTAL UTILIDAD", this.formatCurrency(totalUtilidad)]]

      exporData.push([])
      exporData.push(header)
      exporData.push(...rows)
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`Inventario - IZ`)

      worksheet.mergeCells('E1:H1');
      worksheet.getCell('E1').value = "REPORTE DE INVENTARIO INVERSIONES Z."
      const titleCell = worksheet.getCell('E1')
      titleCell.font = {
          bold: true,
          size: 16
      }

      // Insertar los datos
      worksheet.addRows(exporData);

      const titlesRowIndices = [2, 3]
      const columns = [5, 7, 9]
      titlesRowIndices.forEach(rowIndex => {
          const row = worksheet.getRow(rowIndex)
          row.eachCell((cell, colNumber) => {
              if(columns.includes(colNumber)) {
                  cell.font = { bold: true}
              }
          })
      })

      const headerRowIndex = exporData.length - rows.length; // Índice de la fila de encabezados
      const tableSize = exporData.length + 1
      for (let i = headerRowIndex + 1; i <= tableSize; i++) {  // Desde la fila de datos hasta el final
          const row = worksheet.getRow(i);
          if (i % 2 === 0) {
              row.eachCell((cell, col) => {
                  if (col !== 1) {
                      cell.fill = {
                          type: 'pattern',
                          pattern: 'solid',
                          fgColor: { argb: 'e8eaf6' }
                      }
                  }
              })
          }

          row.eachCell((cell, col) => {
              // Asignar bordes a cada celda
              // Formato especial para columnas numéricas
              
              if (col === 7 ) { // Total
                cell.numFmt = '"C$"#,##0.00';
              }

              if (col === 8 ) { // Total
                cell.numFmt = '"C$"#,##0.00';
              }

              if (1 !== col) {
                  cell.border = {
                      top: { style: 'thin', color: { argb: '000000' } },
                      left: { style: 'thin', color: { argb: '000000' } },
                      bottom: { style: 'thin', color: { argb: '000000' } },
                      right: { style: 'thin', color: { argb: '000000' } }
                  };
              }
          });
      }

      const headerRow = worksheet.getRow(headerRowIndex + 1);
      headerRow.eachCell((cell, col) => {
          if (1 !== col) {
              cell.font = { bold: true, color: {argb: 'ffffff'} };
              cell.style.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: {argb: '0a008c'}
              },
              cell.border = {
                  top: {style: 'thin', color: {argb: '000000'}},
                  left: {style: 'thin', color: {argb: '000000'}},
                  bottom: {style: 'thin', color: {argb: '000000'}},
                  right: {style: 'thin', color: {argb: '000000'}},
              }
          }
      })
      headerRow.commit()

      worksheet.eachRow((row) => {
          row.eachCell((cell) => {
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          })
      })

      // // Agregar una imagen (ejemplo con imagen en Base64)
      // const logoBase64 = imgsBase64.emprovisa;  // Tu imagen en Base64 aquí
      // // Agregar la imagen en la celda A1
      // const imageId = workbook.addImage({
      //     base64: logoBase64,
      //     extension: 'svg',  // o 'jpeg' dependiendo del tipo de imagen
      // });
      // worksheet.getRow(1).height = 70
      // worksheet.getColumn(2).width = 250
      // // Colocar la imagen en la posición deseada (en A1)
      // worksheet.addImage(imageId, {
      //     tl: { col: 1, row: 0 }, // Esquina superior izquierda (A1)
      //     ext: { width: 200, height: 80, align: 'center' } // Tamaño de la imagen
      // });

      // Configurar el ancho de las columnas
      worksheet.columns = [
          { width: 10 },
          { width: 30 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
          { width: 18 },
      ];

      // Crear y descargar el archivo
      workbook.xlsx.writeBuffer().then((buffer) => {
          const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
          saveAs(data, `Reporte - Inventario ${dateNow}.xlsx`);
      });
    },

    deleteAction(val) {
      if (val === true) {
        this.deleteItem()
      }
      this.data.viewAlert = false
    },

    showAlert(item) {
      this.data.viewAlert = true
      this.data.selectedProduct = item.idProducto
    },

    async deleteItem() {
      const result =
          await this.data.requestHttp.deleteProducto(
              this.data.selectedProduct
          )
      if (result !== null) {
        alert('Producto Eliminado')
        this.getProductos()
      } else {
        alert('No se pudo eliminar el registro')
      }
    },

    formatCurrency(key) {
      return new Intl.NumberFormat('es-NI', {
        style: 'currency',
        currency: 'NIO'
      }).format(key)
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    getStatusColor(status) {
      const statusColors = {
        Activo: 'success',
        Inactivo: 'warning',
        Descontinuado: 'error'
      }
      return statusColors[status] || 'grey'
    },

    convertirImagen(archivo) {
      if (!archivo) return
      // Si es múltiple, toma el primero
      const file = Array.isArray(archivo)
          ? archivo[0]
          : archivo

      const lector = new FileReader()
      lector.onload = () => {
        this.data.imagen = lector.result
      }

      lector.readAsDataURL(file)
    }
  }
}
</script>

<style scoped>
.border-custom {
  border: #e0e0e0 1px solid;
  border-radius: 4px;
}

.v-card-title {
  border-radius: 4px 4px 0 0;
}

.font {
  font-size: 12px !important;
}
</style>
