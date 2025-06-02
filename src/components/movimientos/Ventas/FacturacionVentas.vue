<template>
    <div class="w-100">
        <v-card class="border" elevation="0" rounded="0">
            <!-- Encabezado -->
            <template v-slot:prepend>
                <div class="d-flex align-center">
                    <!-- Título -->
                    <div class="text-h6 font-weight-bold d-flex align-center">
                    <v-icon class="me-2" color="red-darken-4">mdi-package-variant</v-icon>
                        Facturación
                    </div>
                </div>
            </template>
            <template v-slot:append>
                <v-btn class="bg-red-darken-4 rounded-" @click="createFactura()">
                    <v-icon>mdi-plus</v-icon>
                    <v-tooltip activator="parent" location="left">Nueva Factura</v-tooltip> 
                </v-btn>
            </template>
            <v-divider /> 
            <v-row class="pa-2" dense>
                <v-col cols="6" md="3" sm="3">
                    <v-text-field color="indigo-darken-4" variant="outlined" append-inner-icon="mdi-calendar" 
                        density="compact" label="Fecha Desde" v-model="dateDesde" readonly  @click="data.menuDesde = true" 
                        placeholder="dd/mm/yyyy" persistent-placeholder hide-details/>
                    <v-dialog v-model="data.menuDesde" width="auto">
                        <v-date-picker color="indigo-darken-4" v-model="dateDesdeFormatted" />
                    </v-dialog>
                </v-col>
                <v-col cols="6" md="3" sm="3">
                    <v-text-field color="indigo-darken-4" variant="outlined" append-inner-icon="mdi-calendar" density="compact" 
                        label="Fecha Hasta" v-model="dateHasta" readonly  @click="data.menuHasta = true" 
                            placeholder="dd/mm/yyyy" persistent-placeholder hide-details/>
                    <v-dialog v-model="data.menuHasta" width="auto">
                        <v-date-picker color="indigo-darken-4" v-model="dateHastaFormatted" />
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

            <v-card-text class="pt-0 px-0">
                <v-card-subtitle class="d-flex align-center text-center mb-2">
                    <v-divider /> 
                    <span class="mx-6 text-grey font-weight-bold">Registros</span>
                    <v-divider />
                </v-card-subtitle>
                <v-data-table :mobile="isMobile" :headers="data.header" :items="data.facturas" class="border" density="compact">
                    <template v-slot:item.total="{ item }">
                        <div>{{ formatedCurrency(item.total) }}</div>
                    </template>
                    <template v-slot:item.fecha="{ item }">
                        <div>{{ formatedDate(item.fecha) }}</div>
                    </template>
                    <template v-slot:item.opc="{ item }">
                        <v-tooltip text="Editar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" color="green" @click="editFactura(item)" class="mr-1" >mdi-pencil</v-icon>
                            </template>
                        </v-tooltip>
                        
                        <v-tooltip text="Eliminar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" color="error" class="mr-1">mdi-delete</v-icon>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Ver" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" color="indigo-darken-4" @click="viewFactura(item)">mdi-eye</v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                    <template v-slot:item.estado="{ item }">
                        <v-chip :color="getStatusColor(item.estado)" small>
                            {{ item.estado }}
                        </v-chip>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <NuevaFactura :show="data.editFactura.show" :editar="data.editFactura.editar" :factura="data.editFactura.item" 
            @closeDialog="closeDialog" :title="data.editFactura.title"/>
        <ViewVenta :show="data.viewFactura.show" :factura="data.viewFactura.item" @closeDialog="closeDialog"/>
    </div>
</template>

<script>
import { formatters } from '@/helpers/formatters.js';
import { reactive, computed, ref, onMounted, onUnmounted } from 'vue';
import NuevaFactura from './NuevaFactura.vue';
import ViewVenta from './ViewVenta.vue';

export default {
    components: {
        NuevaFactura,
        ViewVenta
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

        const dateHastaFormatted = ref(null)
        const dateDesdeFormatted = ref(null)
        const dateHasta = computed(() => {
            return dateHastaFormatted.value ? new Date(dateHastaFormatted.value).toLocaleDateString() : null;
        })

        const dateDesde = computed(() => {
            return dateDesdeFormatted.value ? new Date(dateDesdeFormatted.value).toLocaleDateString() : null;
        })
        const data = reactive({
            header: [
                {title: '', key: 'opc', align: 'center',},
                {title: 'Nº Factura', key: 'numFactura', align: 'center'},
                {title: 'Cliente', key: 'cliente', align: 'center'},
                {title: 'Vendedor', key: 'vendedor', align: 'center'},
                {title: 'Fecha Emisión', key: 'fecha', align: 'center'},
                {title: 'Total', key: 'total', align: 'center'},
                {title: 'Observaciones', key: 'observaiones', align: 'center'},
                {title: 'Estado', key: 'estado', align: 'center'},
            ],
            facturas: [{
                numFactura: '0001',
                cliente: 'Cliente Prueba',
                vendedor: 'Vendedor Prueba',
                fecha: '01/01/2025',
                total: 2000,
                estado: 'Activo'
            }],
            visibleDialog: false,

            editFactura: {
                show: false,
                item: {},
                editar: false,
                title: ''
            },
            viewFactura: {
                show: false,
                item: {}
            },
            menuDesde: false,
            menuHasta: false,
        })

        return {
            data,
            dateDesde,
            dateDesdeFormatted,
            dateHasta,
            dateHastaFormatted,
            isMobile
        }
    },

    methods: {
        formatedCurrency(key) {
            const value = formatters.formatCurrency(key)
            return value
        },
        
        formatedDate(dataString) {
            const value = formatters.formatDate(dataString)
            return value
        },
        
        getStatusColor(status) {
            const statusColors = {
                'Activo': 'success',
                'Inactivo': 'warning',
                'Descontinuado': 'error'
            }
            return statusColors[status] || 'grey'
        },
        
        createFactura() {
            this.data.editFactura.title = ''
            this.data.editFactura.show = true
            this.data.editFactura.editar = false
            this.data.editFactura.title = 'NUEVA FACTURA'
        },
        
        viewFactura(item) {
            this.data.viewFactura.show = true
            this.data.viewFactura.item = item
        },
        
        editFactura(item) {
            this.data.editFactura.show = true
            this.data.editFactura.editar = true
            this.data.editFactura.item = item
            this.data.editFactura.title = 'EDITAR FACTURA'
        },

        closeDialog(val) {  
            this.data.viewFactura.show = val
            this.data.editFactura.show = val
        }

    }
}
</script>

<style scoped>

</style>