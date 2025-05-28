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
                <v-btn class="bg-red-darken-4 rounded-" @click="openDialog()">
                    <v-icon>mdi-plus</v-icon>
                    <v-tooltip activator="parent" location="left">Nueva Factura</v-tooltip> 
                </v-btn>
            </template>
            <v-divider /> 
            <v-row class="pa-2" dense>
                <v-col cols="6" md="6" sm="6">
                    <v-text-field color="red-darken-4" density="compact" variant="outlined" append-inner-icon="mdi-magnify" label="Buscar productos"
                        hide-details placeholder="Ingrese un texto a buscar..." persistent-placeholder/>
                </v-col>
                <v-col cols="6" md="6" sm="6" class="d-flex justify-end align-center">
                    <v-btn icon color="red-darken-4" size="small" variant="text" class="mr-2 border">
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn icon color="grey" size="small" variant="text" class="border">
                        <v-icon>mdi-broom</v-icon>
                    </v-btn>
                </v-col>
            </v-row>

            <v-card-text class="px-0">
                <v-data-table :headers="data.header" :items="data.facturas" class="border" density="compact">
                    <template v-slot:item.monto="{ item }">
                        <div>{{ formatedCurrency(item.monto) }}</div>
                    </template>
                    <template v-slot:item.fecha="{ item }">
                        <div>{{ formatedDate(item.fecha) }}</div>
                    </template>
                    <template v-slot:item.opc="{ item }">
                        <v-tooltip text="Editar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="green" @click="editFactura(item)" class="mr-1" >mdi-pencil</v-icon>
                            </template>
                        </v-tooltip>
                        
                        <v-tooltip text="Eliminar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="error" class="mr-1">mdi-delete</v-icon>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Ver" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="indigo-darken-4">mdi-eye</v-icon>
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

            <v-card-actions>

            </v-card-actions>
        </v-card>
        <NuevaFactura :show="data.visibleDialog" @closeDialog="closeDialog"/>
    </div>
</template>

<script>
import { formatters } from '@/helpers/formatters.js';
import { reactive } from 'vue';
import NuevaFactura from './NuevaFactura.vue';

export default {
    components: {
        NuevaFactura
    },

    setup() {
        const data = reactive({
            header: [
                {title: '', key: 'opc', align: 'center',},
                {title: 'Nº Factura', key: 'numFactura', align: 'center'},
                {title: 'Cliente', key: 'cliente', align: 'center'},
                {title: 'Vendedor', key: 'vendedor', align: 'center'},
                {title: 'Fecha', key: 'fecha', align: 'center'},
                {title: 'Monto', key: 'monto', align: 'center'},
                {title: 'Observaciones', key: 'observaiones', align: 'center'},
                {title: 'Estado', key: 'estado', align: 'center'},
            ],
            facturas: [{
                numFactura: '0001',
                cliente: 'Cliente Prueba',
                vendedor: 'Vendedor Prueba',
                fecha: '01/01/2025',
                monto: 2000,
                estado: 'Activo'
            }],
            visibleDialog: false
        })

        return {
            data
        }
    },

    methods: {
        editFactura(item) {
            console.log(item);
        },

        viewFactura(item) {
            console.log(item);
        },

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

        openDialog() {
            this.data.visibleDialog = true
        },

        closeDialog(val) {  
            this.data.visibleDialog = val
        }

    }
}
</script>

<style scoped>

</style>