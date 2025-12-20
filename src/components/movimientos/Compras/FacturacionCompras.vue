<template>
    <div class="w-100">
        <v-card class="border-t border-b" elevation="0" rounded="0">
            <!-- Encabezado -->
            <template v-slot:prepend>
                <div class="d-flex align-center">
                    <!-- Título -->
                    <div class="text-h6 font-weight-bold d-flex align-center">
                        <v-icon class="me-2" color="primary">
                            mdi-package-variant
                        </v-icon>
                            Órdenes de Compras
                    </div>
                </div>
            </template>
            <template v-slot:append>
                <v-btn v-if="data.crud.create" class="rounded" color="indigo-darken-4" @click="createOrden()"
                    prepend-icon="mdi-plus" variant="tonal">
                    Nueva Órden
                </v-btn>
            </template>
            <v-divider /> 

            <!-- FILTROS PRINCIPALES -->
            <v-card class="pa-2 mb-2" elevation="0">
                <div class="d-flex align-center mb-2">
                    <v-icon color="primary" class="mr-2">
                        mdi-filter
                    </v-icon>
                    <span class="text-subtitle- font-weight-medium">
                        Filtros de búsqueda
                    </span>
                </div>
                
                <v-row dense align="center">
                    <v-col cols="12" md="6" sm="6">
                        <v-row dense>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field
                                    label="Fecha inicial"
                                    type="date"
                                    disabled
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    prepend-inner-icon="mdi-calendar-arrow-left"
                                />
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field
                                    label="Fecha final"
                                    type="date"
                                    disabled
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    prepend-inner-icon="mdi-calendar-arrow-right"
                                />
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-row>
                            <v-col cols="10" md="10" sm="10">
                                <v-text-field v-model="data.search" color="primary" density="compact" variant="outlined" 
                                    append-inner-icon="mdi-magnify" label="Buscar productos" hide-details 
                                    placeholder="Ingrese un texto a buscar..." persistent-placeholder/>
                            </v-col>
                            <v-col cols="2" md="2" sm="2">
                                <v-btn icon size="small" class="mx-2 border" @click="getOrdenes()">
                                    <v-icon  color="green">
                                        mdi-refresh
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top center">
                                        Actualizar
                                    </v-tooltip>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>

            <v-card-text class="pt-0 px-0">
                <v-card-subtitle class="d-flex align-center text-center mb-2">
                    <v-divider /> 
                    <span class="mx-6 text-grey font-weight-bold">Registros</span>
                    <v-divider />
                </v-card-subtitle>

                <v-data-table :search="data.search" :headers="data.header" :loading="data.loading"
                    :items="data.ordenes" class="border-t border-b font" density="compact" :items-per-page="50"
                    :row-props="setStyle" :header-props="{ class: 'font-weight-bold' }" hover>
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
                    <template v-slot:item.total="{ item }">
                        <div>{{ formatedCurrency(item.total) }}</div>
                    </template>
                    <template v-slot:item.fechaRegistro="{ item }">
                        <div>{{ formatedDate(item.fechaRegistro) }}</div>
                    </template>
                    <template v-slot:item.aprobada="{ item }">
                        <div>{{ item.aprobada ? 'SI' : 'NO' }}</div>
                    </template>
                    <template v-slot:item.opc="{ item }">
                        <v-menu :close-on-content-click="false" offset-y location="right center">
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

                            <v-list nav density="compact" rounded="lg">
                                <v-list-item @click="viewOrden(item)" prepend-icon="mdi-eye">
                                    <v-list-item-title>Ver Compra</v-list-item-title>
                                </v-list-item>
                                <v-list-item v-if="data.crud.edit" @click="editOrden(item)"
                                    prepend-icon="mdi-pencil">
                                    <v-list-item-title>Editar Compra</v-list-item-title>
                                </v-list-item>
                                <!-- <v-list-item v-if="data.crud.delete" @click="showAlert(item)">
                                    <v-list-item-icon>
                                        <v-icon color="error">mdi-delete</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Eliminar Registro</v-list-item-title>
                                </v-list-item> -->
                            </v-list>
                        </v-menu>

                        <!-- <v-tooltip text="Editar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-if="data.crud.edit" v-bind="props" size="small" 
                                    color="green" @click="editOrden(item)" class="mr-1" >
                                    mdi-pencil
                                </v-icon>
                            </template>
                        </v-tooltip>
                        
                        <v-tooltip text="Eliminar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-if="data.crud.delete" v-bind="props" size="small" 
                                    @click="showAlert(item)" color="error" class="mr-1">
                                    mdi-delete
                                </v-icon>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Ver" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-if="data.crud.view" v-bind="props" size="small" 
                                    color="indigo-darken-4" @click="viewOrden(item)">
                                    mdi-eye
                                </v-icon>
                            </template>
                        </v-tooltip> -->
                    </template>
                    <template v-slot:item.estado="{ item }">
                        <v-chip :color="item.estado ? 'green' : 'error'" small>
                            {{ item.estado ? 'Activo' : 'Inactivo' }}
                        </v-chip>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <NuevaFacturaCompras :show="data.compra.show" :editar="data.compra.editar" :title="data.compra.title" 
            :orden="data.compra.item" @closeDialog="closeDialog" @refreshTable="getOrdenes()"/>
        <ViewOrdenes :show="data.viewOrden.show" :orden="data.viewOrden.item" @closeDialog="closeDialog"/>
        <AlertComp :show="data.viewAlert" @deleteItem="deleteAction"/>
    </div>
</template>

<script>
import { formatters } from '@/helpers/formatters.js';
import { reactive } from 'vue';
import AlertComp from '@/components/widgets/AlertaAction.vue';
import NuevaFacturaCompras from './dialogsCompras/NuevaFacturaCompras.vue';
import ViewOrdenes from './dialogsCompras/ViewOrdenes.vue';
import RequestHttp from '@/services/requestHttp';
import { useStore } from '@/store';

export default {
    // mounted() {
    //     this.verifyDataSecurity()
    //     this.getOrdenes()
    // },

    components: {
        NuevaFacturaCompras,
        ViewOrdenes,
        AlertComp
    },

    setup() {
        const store = useStore()
        const data = reactive({
            header: [
                {title: '', key: 'opc', align: 'center',
                    cellProps: {
                        class: 'pa-0',
                    },
                    headerProps: {
                        class: 'pa-0',
                    }
                },
                {title: 'Nº Órden', key: 'noOrden', align: 'center'},
                {title: 'Proveedor', key: 'proveedor', align: 'center'},
                {title: 'Vendedor', key: 'usuarioRegistro', align: 'center'},
                {title: 'Aprobada', key: 'aprobada', align: 'center'},
                {title: 'Monto', key: 'total', align: 'center'},
                {title: 'FechaRegistro', key: 'fechaRegistro', align: 'center'},
                {title: 'Observaciones', key: 'observaciones', align: 'center'},
                {title: 'Estado', key: 'estado', align: 'center'},
            ],
            
            options: [
                { title: 'Compras', icon: 'mdi-cart', value: 'Compras', wind: 1},
                { title: 'Detalle de Compras', icon: 'mdi-chart-bar', value: 'Detalle de Venta', wind: 2}
            ],

            selectedOptions: ['Compras'],
            visibleDialog: false,
            wind: 1,
            drawer: true,

            ordenes: [],
            compra: {
                show: false,
                editar: false,
                item: {},
                title: '',
            },
            loading: false,
            selectedItem: null, 
            viewAlert: false,
            search: null,
            crud: {
                create: false, 
                view: false, 
                edit: false,
                delete: false
            },
            viewOrden: {
                show: false,
                item: {}
            },
            requestHttp: new RequestHttp()
        })

        return {
            data,
            store
        }
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getOrdenes()
        vm.verifyDataSecurity()
      })
    },

    methods: {
        setStyle({index}) {
            return {
                class: index % 2 === 0 ? 'bg-white' : 'bg-indigo-lighten-5',
            }
        },
        
        verifyDataSecurity() {
            const token = this.store.getInfoUser()
            const permisos = token.permisos.split(",")
            permisos.map(item => {
                switch(item) {
                    case '71': this.data.crud.view = true
                        break;
                    case '72': this.data.crud.create = true
                        break;
                    case '73': this.data.crud.edit = true
                        break;
                    case '74': this.data.crud.delete = true
                        break;
                }
            })
        },

        async getOrdenes() {
            this.data.ordenes = []
            this.data.loading = true
            const result = await this.data.requestHttp.getCompras()
            this.data.loading = false
            if (result !== null) {
                result.map(item => {
                    this.data.ordenes.push(item)
                })

                this.data.ordenes.reverse()
            }
        },

        editOrden(item) {
            this.data.compra.show = true
            this.data.compra.editar = true
            this.data.compra.title = 'EDITAR ORDEN DE COMPRA'
            this.data.compra.item = item
        },

        viewOrden(item) {
            this.data.viewOrden.show = true
            this.data.viewOrden.item = item
        },

        createOrden() {
            this.data.compra.show = true
            this.data.compra.editar = false
            this.data.compra.title = 'NUEVA ORDEN DE COMPRA'
        },

        formatedCurrency(key) {
            const value = formatters.formatCurrency(key)
            return value
        },

        formatedDate(dataString) {
            const value = formatters.formatDate(dataString)
            return value
        },

        deleteAction(val) {
            if (val === true) {
                this.deleteItem()
            }
            this.data.viewAlert = false
        },

        showAlert(item){
            this.data.viewAlert = true
            this.data.selectedItem = item
        },

        async deleteItem() {
            const result = await this.data.requestHttp.deleteCompra(this.data.selectedItem.idCompra)
            if (result !== null) {
                alert('Orden Eliminada')
                this.getOrdenes()
            } else {
                alert('No se pudo eliminar el registro')
            }
        },

        closeDialog(val) {  
           this.data.compra.show = val
           this.data.viewOrden.show = val
           this.data.compra.editar = val
           this.data.compra.title = ''
        }

    }
}
</script>

<style scoped>
.font{
    font-size: 12px !important;
}
</style>