<template>
  <div class="w-100">
    <!-- Encabezado y botón de agregar -->
    <v-card class="border" elevation="0" rounded="0">
    <!-- Encabezado -->
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div class="text-h6 font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="red-darken-4">mdi-package-variant</v-icon>
            Productos
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn class="bg-red-darken-4 rounded-" @click="openDialog('create')">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="left">Agregar Producto</v-tooltip> 
        </v-btn>
      </template> 
      <v-divider />

      <v-row class="pa-2" dense>
        <v-col cols="6" md="3" sm="3">
            <v-text-field color="red-darken-4" variant="outlined" append-inner-icon="mdi-calendar" 
              density="compact" label="Fecha Creación" v-model="dateDesde" readonly  @click="data.menuDesde = true" 
              placeholder="dd/mm/yyyy" persistent-placeholder hide-details/>
            <v-dialog v-model="data.menuDesde" width="auto">
              <v-date-picker color="red-darken-4" v-model="dateDesdeFormatted" />
            </v-dialog>
        </v-col>
        <v-col cols="6" md="3" sm="3">
            <v-text-field color="red-darken-4" variant="outlined" append-inner-icon="mdi-calendar" density="compact" 
              label="Fecha Vencimiento" v-model="dateHasta" readonly  @click="data.menuHasta = true" 
              placeholder="dd/mm/yyyy" persistent-placeholder hide-details/>
            <v-dialog v-model="data.menuHasta" width="auto">
              <v-date-picker color="red-darken-4" v-model="dateHastaFormatted" />
            </v-dialog>
        </v-col>
        <v-col cols="12" md="3" sm="3">
            <v-text-field color="red-darken-4" density="compact" variant="outlined" append-inner-icon="mdi-magnify" label="Buscar productos"
              hide-details placeholder="Ingrese un texto a buscar..." persistent-placeholder/>
        </v-col>
        <v-col cols="12" md="3" sm="3" class="d-flex justify-end align-center">
            <v-btn icon color="red-darken-4" size="small" variant="text" class="mr-2 border">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon color="grey" size="small" variant="text" class="border">
              <v-icon>mdi-broom</v-icon>
            </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <!-- Tabla de productos -->
    <v-card elevation="0" class="border" rounded="0">
      <v-data-table :headers="data.headers" :items="data.products" :items-per-page="10" :search="search">
        <template v-slot:item.precio="{ item }">
          {{ formatCurrency(item.precio) }}
        </template>
        
        <template v-slot:item.fechaRegistro="{ item }">
          {{ formatDate(item.fechaRegistro) }}
        </template>
        
        <template v-slot:item.estado="{ item }">
          <v-chip :color="getStatusColor(item.estado)" small>
            {{ item.estado }}
          </v-chip>
        </template>
        
        <template v-slot:item.actions="{ item }">
          <v-tooltip text="Editar" location="top">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="small" color="green" class="mr-1" @click="openDialog('edit', item)" >mdi-pencil</v-icon>
            </template>
          </v-tooltip>
          
          <v-tooltip text="Eliminar" location="top">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="small" color="error" class="mr-1" @click="confirmDelete(item)">mdi-delete</v-icon>
            </template>
          </v-tooltip>

          <v-tooltip text="Ver" location="top">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="small" color="indigo-darken-4" @click="openDialogDet(item)">mdi-eye</v-icon>
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo para agregar/editar -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card class="w-100 mb-6" elevation="0">
        <v-card-title class="text-h5 text-center pa-1 font-weight-bold bg-red-darken-4">
          <v-icon>mdi-package-variant</v-icon>
          Inventario - Registro de Productos
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-form class="w-100" ref="form" @submit.prevent="handleSave(data.form)">
            <v-row dense>
              <v-col cols="12" md="6" sm="6">
                <v-text-field color="red-darken-4" v-model="data.form.codigo" label="Código" 
                  :rules="[rules.required]" variant="outlined" 
                  hide-details density="compact" clearable prepend-inner-icon="mdi-barcode"/>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field color="red-darken-4" v-model="data.form.nombre" label="Nombre" 
                  :rules="[rules.required, rules.minLength(3)]"  variant="outlined" 
                  hide-details density="compact" clearable prepend-inner-icon="mdi-text-box" />
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field color="red-darken-4" v-model="data.form.precio" label="Precio" 
                  :rules="[rules.required, rules.numeric]" variant="outlined" 
                  hide-details density="compact" type="number" step="0.01" prepend-inner-icon="mdi-currency-usd" />
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field color="red-darken-4" v-model="data.form.costo" label="Costo" 
                  :rules="[rules.required, rules.numeric]" variant="outlined" 
                  hide-details density="compact" type="number" step="0.01" prepend-inner-icon="mdi-cash" />
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-autocomplete color="red-darken-4" label="Und. Medidad" v-model="data.form.idUnidadMedida"
                  :rules="[rules.required, rules.numeric]" variant="outlined" 
                  hide-details density="compact" step="0.01" />
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-select v-model="data.form.categoria" label="Categoría" :items="data.categorias" 
                  :rules="[rules.required]"
                  variant="outlined" hide-details density="compact" prepend-inner-icon="mdi-shape-outline" />
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-select v-model="data.form.idSubCatProd" label="Sub categoría" :items="data.categorias" 
                  :rules="[rules.required]"
                  variant="outlined" hide-details density="compact" prepend-inner-icon="mdi-shape-outline" />
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-select  v-model="data.form.tipoProducto" label="Tipo Producto" :rules="[rules.required]" variant="outlined" 
                  hide-details density="compact" prepend-inner-icon="mdi-tag" />
              </v-col>
              <v-col cols="6" md="6" sm="6">
                <v-text-field color="red-darken-4" v-model="data.form.cantidadTotal" label="Stock" 
                  :rules="[rules.required, rules.numeric]" variant="outlined" 
                  hide-details density="compact" type="number" prepend-inner-icon="mdi-numeric" />
              </v-col>
              <v-col cols="6" md="6" sm="6">
                <v-text-field color="red-darken-4" v-model="data.form.cantidadMinima" label="Stock Mínimo" 
                  :rules="[rules.required, rules.numeric]" variant="outlined" 
                  hide-details density="compact" type="number" prepend-inner-icon="mdi-numeric" />
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-file-input density="compact" variant="outlined" label="Selecciona una imagen" accept="image/*" 
                  @update:model-key="convertirImagen" prepend-inner-icon="mdi-image" />
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-textarea v-model="data.form.observaciones" density="compact" variant="outlined" label="Observaciones" prepend-inner-icon="mdi-text" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="grey" variant="outlined" @click="closeDialog()">
            Cerrar
          </v-btn>
          <v-btn class="bg-red-darken-4" type="submit" >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="text-h6 font-weight-bold d-flex justify-center align-center">
          <v-icon color="red-darken-4">mdi-delete</v-icon>
          <span>Confirmar Eliminación</span>
        </v-card-title>
        <v-divider class="mx-4"/>
        <v-card-text class="text-center">
          ¿Estás seguro de que deseas eliminar el producto "{{ productToDelete.nombre }}"?
        </v-card-text>
        <v-divider class="mx-4"/>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteProduct">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <DetallesProducto :show="data.showDialog" :proveedor="data.proveedor" :producto="data.productDialog" @cerrarDialog="closeDialogDet"/>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import DetallesProducto from './modalsProductos/DetallesProducto.vue'

export default {
  components: {
    DetallesProducto
  },
  
  setup() {
    const screenWidth = ref(window.innerWidth)
    const isMobile = computed(() => screenWidth.key < 600)
    const updateScreen = () => {
      screenWidth.key = window.innerWidth
    }
    onMounted(() => {
      window.addEventListener('resize', updateScreen)
    })
    onUnmounted(() => {
      window.addEventListener('resize', updateScreen)
    })

    const dateHastaFormatted = ref(null)
    const dateDesdeFormatted = ref(null)
    const dateHasta = computed(() => {
      return dateHastaFormatted.value ? new Date(dateHastaFormatted.value).toLocaleDateString() : null;
    })

    const dateDesde = computed(() => {
      return dateDesdeFormatted.value ? new Date(dateDesdeFormatted.value).toLocaleDateString() : null;
    })

    const data = reactive({
      products: [{
        id: 1,
        codigo: 'PROD-001',
        nombre: 'Mesa de mármol 10x20',
        precio: 1250.99,
        costo: 1250.99,
        categoria: 'Mesas',
        subCategoria: 'Mesas de noche',
        tipo: 'Producto físico',
        fechaRegistro: '2023-05-15',
        usuarioRegistro: 'admin',
        estado: 'Activo'
      },
      {
        id: 2,
        codigo: 'PROD-002',
        nombre: 'Gabinetes de madera estilo cocina',
        precio: 2500.50,
        categoria: 'Gabinetes',
        subCategoria: 'Gabinetes de cocina',
        tipoProducto: 'Producto físico',
        fechaRegistro: '2023-05-10',
        usuarioRegistro: 'admin',
        estado: 'Activo'
      }],
      headers: [
        { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
        { title: 'Código', key: 'codigo', align: 'center' },
        { title: 'Und. Medida', key: 'idUnidadMedida' },
        { title: 'Nombre', key: 'nombre', align: 'center' },
        { title: 'Precio', key: 'precio', align: 'center' },
        { title: 'Costo', key: 'Costo', align: 'center' },
        { title: 'Categoría', key: 'categoria', align: 'center' },
        { title: 'Sub categoría', key: 'idSubCatProd', align: 'center' },
        { title: 'Tipo Producto', key: 'tipoProducto', align: 'center' },
        { title: 'Fecha Registro', key: 'fechaRegistro', align: 'center' },
        { title: 'Estado', key: 'estado', align: 'center' },
      ],
      form: {
        codigo: null,
        nombre: null,
        precio: 0,
        costo: 0,
        categoria: null,
        idSubCatProd: null,
        idUnidadMedida: null,
        tipoProducto: null,
        cantidadTotal: 0,
        cantidadMinima: 0,
        usuarioRegistro: '',
        imagen: null,
        observaciones: null,
        usuarioRegistro: null
      },
      proveedor: {
        nombre: 'Distribuidora Central S.A.',
        telefono: '+505 8888-8888',
        email: 'contacto@distribuidoracentral.com',
        direccion: 'Km 7 Carretera Masaya, Managua, Nicaragua'
      },
      categorias: [
        'Roperos', 'Mesas', 'Gabinetes de cocina', 'Otros'
      ],
      tipos: [
        'Nuevo', 'Usado', 'Reacondicionado', 'Importado', 'Nacional'
      ],
      estadosProducto: [
        'Activo', 'Inactivo', 'Descontinuado'
      ],
      showDialog: false,
      productDialog: null,
    })
    
    return { 
      data,
      isMobile,
      dateDesde,
      dateDesdeFormatted,
      dateHasta,
      dateHastaFormatted
    }
  },
  
  data() {
    return {
      search: '',
      dialog: false,
      deleteDialog: false,
      dialogMode: 'create',
      selectedProduct: null,
      productToDelete: null,
      rules: {
        required: key => !!key || 'Campo requerido',
        minLength: min => key => (key && key.length >= min) || `Mínimo ${min} caracteres`,
        numeric: key => !isNaN(parseFloat(key)) || 'Debe ser un número válido'
      }
    }
  },
  
  computed: {
    dialogTitle() {
      return this.dialogMode === 'create' ? 'Nuevo Producto' : 'Editar Producto'
    },
  },
  
  methods: {
    openDialog(mode, product = null) {
      this.dialogMode = mode
      if (product) {
        this.data.form.codigo = product.codigo
        this.data.form.costo = product.costo
        this.data.form.categoria = product.categoria
        this.data.form.nombre = product.nombre
        this.data.form.precio = product.precio
        this.data.form.categoria = product.categoria
        this.data.form.idSubCatProd = product.idSubCatProd
        this.data.form.tipoProducto = product.tipoProducto
        this.data.form.cantidadTotal = product.cantidadTotal
        this.data.form.cantidadMinima = product.cantidadMinima
        this.data.form.usuarioRegistro = product.usuarioRegistro
        this.data.form.imagen = product.imagen
      }
      this.dialog = true
    },

    openDialogDet(obj) {
      this.data.showDialog = !this.data.showDialog,
      this.data.productDialog = obj
    },

    closeDialogDet(key) {
      this.data.showDialog = key
    },
    
    closeDialog() {
      this.dialog = false
      this.selectedProduct = null
      this.data.form = {}
    },
    
    handleSave(productData) {
      if (this.dialogMode === 'create') {
        // Agregar nuevo producto con ID único
        const newProduct = {
          ...productData,
          id: Math.max(...this.data.products.map(p => p.id), 0) + 1,
          usuarioRegistro: 'current_user', // Aquí deberías usar el usuario real
          fechaRegistro: new Date().toISOString().split('T')[0]
        }
        this.data.products.push(newProduct)
      } else {
        // Actualizar producto existente
        const index = this.data.products.findIndex(p => p.id === productData.id)
        if (index !== -1) {
          this.data.products.splice(index, 1, productData)
        }
      }
      this.closeDialog()
    },
    
    confirmDelete(product) {
      this.productToDelete = product
      this.deleteDialog = true
    },
    
    deleteProduct() {
      let i = this.data.products.indexOf(this.productToDelete);
      if (i !== -1) {
        this.data.products.splice(i, 1); // Corrige el uso de `splice`
      }
      this.deleteDialog = false
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
        'Activo': 'success',
        'Inactivo': 'warning',
        'Descontinuado': 'error'
      }
      return statusColors[status] || 'grey'
    },

    convertirImagen(archivo) {
      if (!archivo) return;
      // Si es múltiple, toma el primero
      const file = Array.isArray(archivo) ? archivo[0] : archivo;

      const lector = new FileReader();
      lector.onload = () => {
        this.data.form.imagen = lector.result;
      };
      lector.readAsDataURL(file);
    }
  }
}
</script>

<style scoped>

.v-card-title {
  border-radius: 4px 4px 0 0;
}
</style>