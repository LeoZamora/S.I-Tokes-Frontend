<template>
  <div>
    <v-dialog v-model="localShow" max-width="750">
      <v-card class="rounded-lg">
        <v-card-title class="font-weight-bold text-center bg-red-darken-4 text-white">
          <v-icon class="me-2">mdi-eye</v-icon> Detalles del Producto
        </v-card-title>

        <v-tabs v-model="tab" color="red-darken-4" density="compact" class="mt-2">
          <v-tab height="25" density="compact" class="border custom-border"><small>Detalles del Producto</small></v-tab>
          <v-tab height="25" density="compact" class="border custom-border"><small>Detalles del Proveedor</small></v-tab>
        </v-tabs>
        <v-divider class="custom-margin"/>
        <v-card-text>
          <v-window v-model="tab">
            <!-- Detalles del Producto -->
            <v-window-item>
              <v-row class="mt-2 d-flex justify-space-between align-center" dense>
                <v-col cols="12" sm="4" class="text-center mb-2">
                  <v-img class="rounded-lg border" :src="producto.imgBase64" height="160" cover></v-img>
                </v-col>

                <v-col cols="12" sm="8" class="d-flex justify-center align-center">
                  <v-row dense>
                    <v-col cols="6" sm="4" class="py-1">
                      <div class="d-flex align-center">
                        <v-icon size="small" class="me-1" color="red-darken-4">mdi-barcode</v-icon>
                        <span class="text-caption"><strong>Código:</strong></span>
                      </div>
                      <div class="ms-6 text-caption">{{ producto.codigo }}</div>
                    </v-col>

                    <v-col cols="6" sm="4" class="py-1">
                      <div class="d-flex align-center">
                        <v-icon size="small" class="me-1" color="red-darken-4">mdi-tag</v-icon>
                        <span class="text-caption"><strong>Nombre:</strong></span>
                      </div>
                      <div class="ms-6 text-caption">{{ producto.nombre }}</div>
                    </v-col>

                    <v-col cols="6" sm="4" class="py-1">
                      <div class="d-flex align-center">
                        <v-icon size="small" class="me-1" color="red-darken-4">mdi-currency-usd</v-icon>
                        <span class="text-caption"><strong>Precio:</strong></span>
                      </div>
                      <div class="ms-6 text-caption">${{ producto.precio }}</div>
                    </v-col>

                    <v-col cols="6" sm="4" class="py-1">
                      <div class="d-flex align-center">
                        <v-icon size="small" class="me-1" color="red-darken-4">mdi-folder-outline</v-icon>
                        <span class="text-caption"><strong>Categoría:</strong></span>
                      </div>
                      <div class="ms-6 text-caption">{{ producto.categoria }}</div>
                    </v-col>

                    <v-col cols="6" sm="4" class="py-1">
                      <div class="d-flex align-center">
                        <v-icon size="small" class="me-1" color="red-darken-4">mdi-shape-outline</v-icon>
                        <span class="text-caption"><strong>Tipo:</strong></span>
                      </div>
                      <div class="ms-6 text-caption">{{ producto.tipo }}</div>
                    </v-col>

                    <v-col cols="6" sm="4" class="py-1">
                      <div class="d-flex align-center">
                        <v-icon size="small" class="me-1" color="red-darken-4">mdi-warehouse</v-icon>
                        <span class="text-caption"><strong>Stock:</strong></span>
                      </div>
                      <div class="ms-6 text-caption">{{ producto.stock }}</div>
                    </v-col>

                    <v-col cols="6" sm="4" class="py-1">
                      <div class="d-flex align-center">
                        <v-icon size="small" class="me-1" color="red-darken-4">mdi-check-circle-outline</v-icon>
                        <span class="text-caption"><strong>Estado:</strong></span>
                      </div>
                      <div class="ms-6 text-caption">{{ producto.estado }}</div>
                    </v-col>

                    <v-col cols="6" sm="4" class="py-1">
                      <div class="d-flex align-center">
                        <v-icon size="small" class="me-1" color="red-darken-4">mdi-account</v-icon>
                        <span class="text-caption"><strong>Registrado por:</strong></span>
                      </div>
                      <div class="ms-6 text-caption">{{ producto.usuarioRegistro }}</div>
                    </v-col>

                    <v-col cols="6" sm="4" class="py-1">
                      <div class="d-flex align-center">
                        <v-icon size="small" class="me-1" color="red-darken-4">mdi-calendar</v-icon>
                        <span class="text-caption"><strong>Fecha:</strong></span>
                      </div>
                      <div class="ms-6 text-caption">{{ producto.fechaRegistro }}</div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Detalles del Proveedor -->
            <v-window-item>
              <v-row class="mt-4" dense>
                <!-- Imagen del Producto -->
                <v-col cols="12" md="6" class="mb-2">
                  <div class="d-flex align-center">
                    <v-icon class="me-2" color="red-darken-4">mdi-truck</v-icon>
                    <strong>Proveedor Principal:</strong>
                  </div>
                  <div class="ms-6">{{ proveedor.nombre || 'N/A' }}</div>
                </v-col>
                <v-col cols="12" md="6" class="mb-2">
                  <div class="d-flex justify-space-between align-center">
                    <div class="d-flex align-center">
                      <v-icon class="me-2" color="red-darken-4">mdi-truck-delivery</v-icon>
                      <strong>Proveedores Secundarios:</strong>
                    </div>
                    <v-btn color="indigo-darken-4" icon="mdi-plus" variant="elevated" size="small" @click="abrirModalProveedor" />
                  </div>
                  <ul class="ms-6 mt-2" v-if="producto.proveedoresSecundarios && producto.proveedoresSecundarios.length">
                    <li v-for="(prov, index) in producto.proveedoresSecundarios" :key="index">{{ prov.nombre }}</li>
                  </ul>
                  <span class="ms-6" v-else>N/A</span>
                </v-col>
                <v-col cols="12" md="6" class="mb-2">
                  <div class="d-flex align-center">
                    <v-icon class="me-2" color="red-darken-4">mdi-cube-outline</v-icon>
                    <strong>Stock Mínimo:</strong>
                  </div>
                  <div class="ms-6">{{ producto.stockMinimo || 'N/A' }}</div>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-end">
          <v-btn color="grey" variant="outlined" @click="closeDialog">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- MODAL PARA AGREGAR PROVEEDOR SECUNDARIO -->
    <v-dialog v-model="modalProveedor" max-width="500">
      <v-card class="rounded-lg">
        <v-card-title class="font-weight-bold text-center bg-red-darken-4 text-white">
          <v-icon class="mr-2">mdi-account-plus</v-icon>
          Agregar Proveedor Secundario
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row dense class="mt-2">
            <v-col cols="12" md="6">
              <v-text-field v-model="nuevoProveedor.nombre" label="Nombre" prepend-inner-icon="mdi-account" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="nuevoProveedor.telefono" label="Teléfono" prepend-inner-icon="mdi-phone" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="nuevoProveedor.correo" label="Correo" prepend-inner-icon="mdi-email" variant="outlined" density="compact" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="justify-end">
          <v-btn color="grey" variant="outlined" @click="modalProveedor = false">Cancelar</v-btn>
          <v-btn class="bg-red-darken-4 text-white" variant="elevated" @click="agregarProveedor">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'

export default {
  name: 'ProductDetailsDialog',
  props: {
    show: Boolean,
    producto: Object,
    proveedor: Object
  },
  setup(props) {
    const tab = ref(0)
    const localShow = ref(props.show)

    watch(() => props.show, (val) => {
      localShow.value = val
      if (val) tab.value = 0
    })

    const modalProveedor = ref(false)
    const nuevoProveedor = reactive({
      nombre: '',
      telefono: '',
      correo: ''
    })

    return {
      tab,
      localShow,
      modalProveedor,
      nuevoProveedor
    }
  },

  methods: {
    closeDialog() {
      this.$emit('cerrarDialog', false)
    },

    abrirModalProveedor() {
      this.nuevoProveedor.nombre = ''
      this.nuevoProveedor.telefono = ''
      this.nuevoProveedor.correo = ''
      this.modalProveedor = true
    },

    agregarProveedor() {
      if (!this.nuevoProveedor.nombre) {
        alert('Por favor ingrese el nombre del proveedor')
        return
      }

      if (!this.producto.proveedoresSecundarios) {
        this.producto.proveedoresSecundarios = []
      }

      this.producto.proveedoresSecundarios.push({ 
        nombre: this.nuevoProveedor.nombre, 
        telefono: this.nuevoProveedor.telefono, 
        correo: this.nuevoProveedor.correo 
      })

      this.modalProveedor = false
    }
  }
}
</script>

<style scoped>
.custom-border{
  border-top-left-radius: 5px !important;
  border-top-right-radius: 5px !important;
}

.custom-margin{
  margin-top: -10px;
}
</style>
