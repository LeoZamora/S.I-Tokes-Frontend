<template>
    <div class="w-100">
        <v-card class="border" elevation="0" rounded="0">
            <!-- Encabezado -->
            <template v-slot:prepend>
                <div class="d-flex align-center">
                    <!-- Título -->
                    <div class="text-h6 font-weight-bold d-flex align-center">
                    <v-icon class="me-2" color="primary">mdi-package-variant</v-icon>
                        Rutas
                    </div>
                </div>
            </template>
            <template v-slot:append>
                <v-btn v-if="hasAccessToFunct('112')" class="bg-primary rounded-" @click="createRutas()">
                    <v-icon>mdi-plus</v-icon>
                    <v-tooltip activator="parent" location="left">Nueva Rutas</v-tooltip> 
                </v-btn>
            </template>
            <v-divider /> 
            <v-row class="pa-2" dense>
                <v-col cols="6" md="6" sm="6">
                    <v-text-field v-model="data.search" color="primary" density="compact" variant="outlined" append-inner-icon="mdi-magnify" label="Buscar productos"
                        hide-details placeholder="Ingrese un texto a buscar..." persistent-placeholder/>
                </v-col>
                <v-col cols="6" md="6" sm="6" class="d-flex justify-end align-center">
                    <v-btn icon color="green" size="small" variant="text" class="mr-2 border" @click="getRutas()">
                        <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                    <v-btn icon color="grey" size="small" variant="text" class="border" @click="data.search = null">
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
                <v-data-table :search="data.search" :mobile="isMobile" :headers="data.header" :items="data.rutas" class="border font" 
                    density="compact" :loading="data.loading" :row-props="setStyle" :header-props="{ class: 'font-weight-bold' }"
                    items-per-page="20" hover>
                    <template v-slot:loader>
                        <v-progress-linear color="indigo" indeterminate height="2"/>
                    </template>
                    <template v-slot:loading>
                        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                    </template>
                  <template v-slot:item.descripcion="{ item }">
                    {{ item.descripcion ?? '- - -' }}
                  </template>
                    <template v-slot:item.total="{ item }">
                        <div>{{ formatedCurrency(item.total) }}</div>
                    </template>
                    <template v-slot:item.fechaRegistro="{ item }">
                        <div>{{ formatedDate(item.fechaRegistro) }}</div>
                    </template>
                    <template v-slot:item.opc="{ item }">
                        <v-tooltip text="Editar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-if="hasAccessToFunct('113')" v-bind="props" size="small" color="green" @click="editRuta(item)" class="mr-1" >mdi-pencil</v-icon>
                            </template>
                        </v-tooltip>
                        
                        <v-tooltip text="Eliminar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-if="data.crud.delete" v-bind="props" size="small" color="error" class="mr-1" @click="showAlert(item)">mdi-delete</v-icon>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Ver" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-if="data.crud.view" v-bind="props" size="small" color="indigo-darken-4" @click="viewRuta(item)">mdi-eye</v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                    <template v-slot:item.estado="{ item }">
                        <v-chip :color="item.estado ? 'green' : 'error'" small>
                            {{ item.estado ? 'Activo' : 'Inactivo' }}
                        </v-chip>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <NuevaRutas :show="data.editRuta.show" :editar="data.editRuta.editar" :idRuta="data.idRuta"
            @closeDialog="closeDialog" :title="data.editRuta.title" @refreshTable="getRutas"/>
        <ViewRuta :show="data.viewRuta.show" :ruta="data.viewRuta.item" @closeDialog="closeDialog"/>
        <AlertComp :show="data.viewAlert" @deleteItem="deleteAction"/>
    </div>
</template>

<script>
import { formatters } from '@/helpers/formatters.js';
import { reactive, computed, ref, onMounted, onUnmounted } from 'vue';
import NuevaRutas from './NuevaRuta.vue';
import ViewRuta from './ViewRuta.vue';
import RequestHttp from '@/services/requestHttp';
import AlertComp from '@/components/widgets/AlertComp.vue';
import { useStore } from '@/store';
import { hasAccessToFunct } from '@/scripts/Seguridad.js'

export default {
    mounted() {
        this.verifyDataSecurity()
        this.getRutas()
    },

    components: {
        NuevaRutas,
        ViewRuta,
        AlertComp
    },

    setup() {
        const store = useStore()
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
                {title: 'Código', key: 'codigo', sortable: false, align: 'center', 
                    headerProps: {
                        class: 'pa-1',
                    },
                    cellProps: {
                        class: 'pa-1',  
                    }
                },
                {title: 'Nombre de Ruta', key: 'nombre', align: 'center'},
                {title: 'Descripción', key: 'descripcion', align: 'center'},
                {title: 'Gestor de Ruta', key: 'gestor', align: 'center'},
                {title: 'Fecha Registro', key: 'fechaRegistro', align: 'center'},
                {title: 'Registrado Por', key: 'usuarioRegistro', align: 'center'},
                {title: 'Estado', key: 'estado', align: 'center'},
            ],
            rutas: [],
            visibleDialog: false,

            editRuta: {
                show: false,
                item: {},
                editar: false,
                title: ''
            },
            viewRuta: {
                show: false,
                item: {}
            },
            crud: {
                create: false, 
                view: false, 
                edit: false,
                delete: false
            },
            loading: false,
            search: null,
            viewAlert: false,
            selectedItem: null,
            idRuta: null,
            menuDesde: false,
            menuHasta: false,
            requestHttp: new RequestHttp()
        })

        return {
            data,
            dateDesde,
            dateDesdeFormatted,
            dateHasta,
            dateHastaFormatted,
            isMobile,
            store
        }
    },

    methods: {
      hasAccessToFunct,
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
                    case '31': this.data.crud.view = true
                        break;
                    case '32': this.data.crud.create = true
                        break;
                    case '33': this.data.crud.edit = true
                        break;
                    case '34': this.data.crud.delete = true
                        break;
                }
            })
        },

        async getRutas() {
            this.data.rutas = []
            this.data.loading = true
            const result = await this.data.requestHttp.getRutas()            
            if (result !== null) {
                result.map(item => {
                    this.data.rutas.push(item)
                })
            }
            this.data.rutas.reverse()
            this.data.loading = false
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
        
        createRutas() {
            this.data.editRuta.title = ''
            this.data.editRuta.show = true
            this.data.editRuta.editar = false
            this.data.editRuta.title = 'NUEVA RUTA'
        },
        
        viewRuta(item) {
            this.data.viewRuta.show = true
            this.data.viewRuta.item = item
        },
        
        editRuta(item) {
            this.data.editRuta.show = true
            this.data.editRuta.editar = true
            this.data.idRuta = item.idRuta
            this.data.editRuta.title = 'EDITAR RUTA'
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
            const result = await this.data.requestHttp.deleteVenta(this.data.selectedItem.idRuta)
            if (result !== null) {
                alert('Venta Eliminada')
                this.getRutas()
            } else {
                alert('No se pudo eliminar el registro')
            }
        },

        closeDialog(val) {  
            this.data.viewRuta.show = val
            this.data.editRuta.show = val
            this.data.editRuta.editar = val
            this.data.editRuta.show = val
            this.data.editRuta.title = ''
        }

    }
}
</script>

<style scoped>
.font{
    font-size: 12px !important;
    color: black;
    font-weight: 500;
}
</style>