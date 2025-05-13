<template>
  <div class="w-100">
    <!-- Encabezado y botón de agregar -->
    <v-card class="border" elevation="0" rounded="0">
    <!-- Encabezado -->
    <v-card-title class="d-flex align-center justify-space-between pa-2">
      <!-- Logo + Título -->
      <div class="d-flex align-center">
        <!-- Título -->
        <div class="text-h6 font-weight-bold d-flex align-center">
          <v-icon class="me-2" color="red-darken-4">mdi-package-variant</v-icon>
          Productos
        </div>
      </div>

      <!-- Botón de añadir -->
      <v-btn class="bg-indigo-darken-4" @click="openDialog('create')" variant="elevated" elevation="2">
        <v-icon>mdi-plus</v-icon>
        <v-tooltip activator="parent" location="left">Agregar Producto</v-tooltip> 
      </v-btn>
    </v-card-title>

    <!-- Buscador -->
    <v-card-actions class="pa-2">
      <v-text-field color="red-darken-4" density="compact" variant="outlined" v-model="search" append-inner-icon="mdi-magnify" label="Buscar productos"
        hide-details placeholder="Ingrese un texto a buscar..." persistent-placeholder/>
    </v-card-actions>
    </v-card>
    <!-- Tabla de productos -->
    <v-card elevation="0" class="border" rounded="0">
      <v-data-table :headers="headers" :items="data.products" :items-per-page="10" :search="search">
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
              <v-icon v-bind="props" color="green" class="mr-3" @click="openDialog('edit', item)" >mdi-pencil</v-icon>
            </template>
          </v-tooltip>
          
          <v-tooltip text="Eliminar" location="top">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" color="error" class="mr-3" @click="confirmDelete(item)">mdi-delete</v-icon>
            </template>
          </v-tooltip>

          <v-tooltip text="Ver" location="top">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" color="indigo-darken-4" @click="openDialogDet(item)">mdi-eye</v-icon>
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo para agregar/editar -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card class="w-100 border mb-6" elevation="0">
        <v-card-title class="text-h5 text-center pa-1 font-weight-bold">
          <v-icon>mdi-package-variant</v-icon>
          Inventario - Registro de Productos
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4">
          <v-form class="w-100" ref="form" @submit.prevent="handleSave(data.form)">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field color="red-darken-4" v-model="data.form.codigo" label="Código" :rules="[rules.required]" variant="outlined" 
                  hide-details density="compact" clearable prepend-inner-icon="mdi-barcode"/>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field color="red-darken-4" v-model="data.form.nombre" label="Nombre" :rules="[rules.required, rules.minLength(3)]"  variant="outlined" 
                  hide-details density="compact" clearable prepend-inner-icon="mdi-text-box" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field color="red-darken-4" v-model="data.form.precio" label="Precio" :rules="[rules.required, rules.numeric]" variant="outlined" 
                  hide-details density="compact" prefix="$" type="number" step="0.01" prepend-inner-icon="mdi-currency-usd" />
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="data.form.categoria" label="Categoría" :items="data.categorias" :rules="[rules.required]"
                  variant="outlined" hide-details density="compact" prepend-inner-icon="mdi-shape-outline" />
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="data.form.subcategoria" label="Sub categoría" :items="data.categorias" :rules="[rules.required]"
                  variant="outlined" hide-details density="compact" prepend-inner-icon="mdi-shape-outline" />
              </v-col>

              <v-col cols="12" md="6">
                <v-select  v-model="data.form.tipo" label="Tipo" :items="data.tipos" :rules="[rules.required]" variant="outlined" 
                  hide-details density="compact" prepend-inner-icon="mdi-tag" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field color="red-darken-4" v-model="data.form.stock" label="Stock" :rules="[rules.required, rules.numeric]" variant="outlined" 
                  hide-details density="compact" type="number" prepend-inner-icon="mdi-numeric" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field color="red-darken-4" v-model="data.form.stockMin" label="Stock Mínimo" :rules="[rules.required, rules.numeric]" variant="outlined" 
                  hide-details density="compact" type="number" prepend-inner-icon="mdi-numeric" />
              </v-col>

              <v-col cols="12" md="12">
                <v-file-input density="compact" variant="outlined" label="Selecciona una imagen" accept="image/*" @update:model-value="convertirImagen" prepend-inner-icon="mdi-image" />
              </v-col>

              <v-col cols="12" class="d-flex justify-end pt-6">
                <v-btn color="grey" variant="outlined" hide-details class="mr-4" @click="closeDialog()" prepend-icon="mdi-broom">
                  Cerrar
                </v-btn>
                <v-btn color="red-darken-4" type="submit" prepend-icon="mdi-content-save" >
                  Guardar
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
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
import DetallesProducto from '../widgets/DetallesProducto.vue'

export default {
  components: {
    DetallesProducto
  },
  
  setup() {
    const screenWidth = ref(window.innerWidth)
    const isMobile = computed(() => screenWidth.value < 600)
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
      products: [{
        id: 1,
        codigo: 'PROD-001',
        nombre: 'Mesa de mármol 10x20',
        precio: 1250.99,
        categoria: 'Mesas',
        subCategoria: 'Mesas de noche',
        tipo: 'Producto físico',
        stock: 2,
        stockMin: 2,
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
        tipo: 'Producto físico',
        stock: 3,
        stockMin: 2,
        fechaRegistro: '2023-05-10',
        usuarioRegistro: 'admin',
        estado: 'Activo'
      }],
      form: {
        id: 1,
        codigo: '',
        nombre: '',
        precio: 0,
        categoria: '',
        subcategoria: '',
        tipo: '',
        stock: 0,
        stockMin: 0,
        fechaRegistro: '',
        usuarioRegistro: '',
        estado: 'Activo',
        imgBase64: null
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
      isMobile
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
      headers: [
        { title: 'Código', value: 'codigo', align: 'center' },
        { title: 'Nombre', value: 'nombre' },
        { title: 'Precio', value: 'precio', align: 'center' },
        { title: 'Categoría', value: 'categoria', align: 'center' },
        { title: 'Sub categoría', value: 'subCategoria', align: 'center' },
        { title: 'Tipo', value: 'tipo' },
        { title: 'Stock', value: 'stock', align: 'center' },
        { title: 'Stock Min', value: 'stockMin', align: 'center' },
        { title: 'Fecha Registro', value: 'fechaRegistro', align: 'center' },
        { title: 'Estado', value: 'estado', align: 'center' },
        { title: 'Acciones', value: 'actions', sortable: false, align: 'center' }
      ],
      rules: {
        required: value => !!value || 'Campo requerido',
        minLength: min => value => (value && value.length >= min) || `Mínimo ${min} caracteres`,
        numeric: value => !isNaN(parseFloat(value)) || 'Debe ser un número válido'
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
        this.data.form.categoria = product.categoria
        this.data.form.nombre = product.nombre
        this.data.form.precio = product.precio
        this.data.form.categoria = product.categoria
        this.data.form.subcategoria = product.subcategoria
        this.data.form.tipo = product.tipo
        this.data.form.stock = product.stock
        this.data.form.stockMin = product.stockMin
        this.data.form.fechaRegistro = product.fechaRegistro,
        this.data.form.usuarioRegistro = product.usuarioRegistro
        this.data.form.estado = product.estado 
      }
      this.dialog = true
    },

    openDialogDet(obj) {
      this.data.showDialog = !this.data.showDialog,
      this.data.productDialog = obj
    },

    closeDialogDet(value) {
      this.data.showDialog = value
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
    
    formatCurrency(value) {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(value)
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
        this.data.form.imgBase64 = lector.result;
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