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
        <v-btn
            class="bg-primary rounded-"
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
          C${{ item.costo }}
        </template>
        <template v-slot:item.precio="{ item }">
          C${{ item.precio }}
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

    <!-- Diálogo para agregar/editar -->
    <v-dialog
        v-model="dialog"
        width="750"
        min-height="500"
        persistent
    >
      <v-card class="w-100 mb-6" elevation="0">
        <v-card-title
            class="text-h5 text-center pa-1 font-weight-bold bg-primary"
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
                <v-row dense>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                        color="indigo"
                        v-model="data.form.codigo"
                        label="Código"
                        :rules="[rules.required]"
                        variant="outlined"
                        hide-details
                        density="compact"
                        clearable
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
                  <v-col cols="6">
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
                          ></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                              v-model="
                              data.form
                                .idSubCatProd
                            "
                              label="Sub categoría"
                              :items="
                              cmb.subCategorias
                            "
                              :rules="[
                              rules.required
                            ]"
                              variant="outlined"
                              hide-details
                              density="compact"
                              prepend-inner-icon="mdi-shape-outline"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                  <!--<v-col cols="12" md="6" sm="6">
                    <v-text-field
                      color="indigo"
                      v-model="data.form.precio"
                      label="Precio"
                      :rules="[
                        rules.required,
                        rules.numeric
                      ]"
                      variant="outlined"
                      hide-details
                      density="compact"
                      type="number"
                      step="0.01"
                      prepend-inner-icon="mdi-currency-usd"
                    />
                  </v-col>-->
                  <v-col cols="12" md="6" sm="6">
                    <v-autocomplete
                        v-model="
                        data.form.idUnidadMedida
                      "
                        :items="cmb.unidadesMedida"
                        label="Unidad Medida:"
                        variant="outlined"
                        density="compact"
                        hide-details
                    ></v-autocomplete>
                    <!--<v-text-field
                      color="indigo"
                      label="Und. Medidad"
                      v-model="
                        data.form.idUnidadMedida
                      "
                      :rules="[
                        rules.required,
                        rules.numeric
                      ]"
                      variant="outlined"
                      hide-details
                      density="compact"
                      step="0.01"
                      readonly
                    />-->
                  </v-col>
                  <!--<v-col cols="12" md="6" sm="6">
                    <v-select
                      v-model="
                        data.form.tipoProducto
                      "
                      :items="data.tipos"
                      label="Tipo Producto"
                      :rules="[rules.required]"
                      variant="outlined"
                      hide-details
                      density="compact"
                      prepend-inner-icon="mdi-tag"
                    />
                  </v-col>-->
                  <v-col cols="3" md="3" sm="3">
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
                  <v-col cols="3" md="3" sm="3">
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
                  <v-col
                      cols="12"
                      md="12"
                      sm="12"
                  >
                    <v-textarea
                        v-model="data.observaciones"
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
              class="bg-primary"
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
  </div>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted
} from 'vue'
import {utilsFunctions} from '@/helpers/utilFunctions'
import DetallesProducto from './modalsProductos/DetallesProducto.vue'
import RequestHttp from '@/services/requestHttp'
import AlertComp from '@/components/widgets/AlertComp.vue'
import {
  getItemsCombobox,
  httpGet, httpPost, httpPut
} from '@/scripts/api.js'
import axios from "axios";

export default {
  mounted() {
    this.getSubCategorias()
    this.getProductos()
    this.loadCmbCategoria()
  },

  components: {
    DetallesProducto,
    AlertComp
  },

  setup() {
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
        usuarioRegistro: 'admin'
      },
      imagen: null,
      observaciones: null,
      selectedProduct: null,
      loading: false,
      showDialog: false,
      viewAlert: false,
      requestHttp: new RequestHttp()
    })

    return {
      data,
      isMobile
    }
  },

  data() {
    return {
      cmb: {
        unidadesMedida: [],
        categorias: [],
        subCategorias: []
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

    async getSubCategorias() {
      this.data.subCategorias = []
      this.data.loading = true
      const result =
          await this.data.requestHttp.getSubCategorias()
      this.data.loading = false
      if (result !== null) {
        result.map((item) => {
          this.data.subCategorias.push({
            title: item.nombre,
            value: item.idSubCatProd
          })
        })
      } else {
        throw new Error('Error en la solicitud')
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

    async loadCodigoRecomendado() {
      var codigoRecomendado = await httpGet(
          'api/producto/codigo-recomendado'
      )
      this.data.form.codigo = String(codigoRecomendado)
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
          false
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
      var response =
          await httpPost('api/producto', this.data.form)
      this.data.form.idProducto = response.data
      await this.actActualizarImagen()
      await this.getProductos()
      this.closeDialog()
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

      }
      this.registroDisplay.eliminarImagen = false
    },

    async openDialog(mode, product = null) {
      this.registroDisplay.imagen.url = null
      this.registroDisplay.imagen.archivo = null
      await this.loadCmbUnidadMedida()
      await this.loadCmbCategoria()
      await this.loadCmbSubCategoria(product.idCategoriaProducto)
      if(mode !== 'edit'){
        await this.loadCodigoRecomendado()
      }
      this.dialogMode = mode
      if (product) {
        this.selectedProduct = product.idProducto
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
      ;(this.data.showDialog =
          !this.data.showDialog),
          (this.data.productDialog = obj)
    },

    closeDialogDet(key) {
      this.data.showDialog = key
    },

    closeDialog() {
      this.dialog = false
      this.selectedProduct = null
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
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
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
