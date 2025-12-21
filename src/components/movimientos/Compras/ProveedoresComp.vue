<template>
    <div>
        <v-card elevation="0" class="border-t border-b" rounded="0">
            <template v-slot:prepend>
                <div class="d-flex align-center">
                <!-- Título -->
                    <div class="font-weight-bold d-flex align-center">
                        <v-icon class="me-2" color="primary">mdi-package-variant</v-icon>
                        <small v-if="isMobile">
                            Gestión de Proveedores
                        </small>
                        <span v-else class="text-h6 font-weight-bold">
                            Gestión de Proveedores
                        </span>
                    </div>
                </div>
            </template>
            <template v-slot:append>
                <v-btn v-if="data.wind === 1" class="rounded" @click="openDialog('prov', 'create', null)"
                    prepend-icon="mdi-account-plus" color="indigo-darken-4" variant="tonal">
                    NUEVO PROVEEDOR
                </v-btn>
                <v-btn v-if="data.wind === 2" class="rounded" @click="openDialog('tipo', 'create', null)"
                    prepend-icon="mdi-account-plus" color="indigo-darken-4" variant="tonal">
                    NUEVO T. DE PROVEEDOR
                </v-btn>
            </template>
            <v-divider />
            <v-card-text class="py-2">
                <!-- SEGUNDA FILA: OPCIONES DE VISUALIZACIÓN -->
                <v-row dense class="mt-3 pa-2 bg-grey-lighten-4 rounded" justify="space-between">
                    <v-col cols="12" md="6" sm="6">
                        <div class="d-flex align-center justify-space-between">
                            <div class="d-flex align-center">
                                <v-icon size="small" class="mr-2" color="primary">
                                    mdi-view-dashboard
                                </v-icon>
                                <span class="text-subtitle-2">
                                    Seleccionar: 
                                </span>
                            </div>
                            
                            <v-btn-toggle v-model="data.wind" color="primary"
                                density="comfortable" mandatory rounded="lg">
                                <v-btn :value="1" variant="flat">
                                    <v-icon start>mdi-account</v-icon>
                                    Proveedores
                                </v-btn>
                                
                                <v-btn :value="2" variant="flat">
                                    <v-icon start>mdi-account-tie</v-icon>
                                    T. Proveedores
                                </v-btn>
                            </v-btn-toggle>
                        </div>
                    </v-col>
                    <v-col cols="12" md="3" sm="3" class="d-flex justify-space-between align-center">
                        <v-text-field v-model="data.search" density="compact" variant="outlined" label="Buscar" 
                            hide-details placeholder="Buscar textos" persistent-placeholder/>
                        <v-btn icon size="small" class="mx-2 border" @click="refreshData()">
                            <v-icon color="grey">mdi-refresh</v-icon>
                            <v-tooltip activator="parent" location="top center">
                                Actualizar
                            </v-tooltip>
                        </v-btn>
                    </v-col>
                </v-row>

                <v-window v-model="data.wind">
                    <v-window-item :value="1">
                        <v-card-subtitle class="d-flex align-center text-center my-2">
                            <v-divider /> 
                            <span class="mx-6 text-grey font-weight-bold">Proveedores</span>
                            <v-divider />
                        </v-card-subtitle>
                        <v-data-table :loading="data.loading" :search="data.search" class="border" 
                            :headers="data.headers" density="compact" :items="data.items" :row-props="setStyle" 
                            :header-props="{ class: 'font-weight-bold' }" hover>
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

                            <template v-slot:item.fechaRegistro="{ item }">
                                <div>{{ formateDate(item.fechaRegistro) }}</div>
                            </template>
                            <template v-slot:item.tipoProveedor="{ item }">
                                <div>{{ item.idTipoProveedorNavigation.nombre }}</div>
                            </template>
                            <template v-slot:item.opc="{ item }">

                                <v-menu location="right center" :close-on-content-click="false" origin="auto">
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
                                    <v-list nav rounded="lg" density="compact">
                                        <v-list-item-subtitle class="pa-1">
                                            Opciones
                                        </v-list-item-subtitle>
                                        <v-list-item @click="openDialog('prov', 'edit', item)" 
                                            prepend-icon="mdi-pencil">
                                            <v-list-item-title>Editar</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="showAlert(item)" prepend-icon="mdi-delete">
                                            <v-list-item-title>Eliminar</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="openDialog('prov', 'view', item)"
                                            prepend-icon="mdi-eye">
                                            <v-list-item-title>Ver</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>

                                <!-- <v-tooltip text="Editar" location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" size="small" color="green" 
                                            @click="openDialog('prov', 'edit', item)" class="mr-1" >
                                            mdi-pencil
                                        </v-icon>
                                    </template>
                                </v-tooltip>
                                
                                <v-tooltip text="Eliminar" location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" size="small" color="error" @click="showAlert(item)" 
                                            class="mr-1">
                                        mdi-delete
                                        </v-icon>
                                    </template>
                                </v-tooltip>

                                <v-tooltip text="Ver" location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" size="small" color="indigo-darken-4" 
                                            @click="openDialog('prov', 'view', item)">
                                            mdi-eye
                                        </v-icon>
                                    </template>
                                </v-tooltip> -->
                            </template>
                            <template v-slot:item.estado="{ item }">
                                <v-chip :color="item.estado ? 'green' : 'error'" :text="item.estado ? 'Activo' : 'Inactivo'"/>
                            </template>
                        </v-data-table>
                    </v-window-item>

                    <v-window-item :value="2">
                        <v-card-subtitle class="d-flex align-center text-center my-2">
                            <v-divider /> 
                            <span class="mx-6 text-grey font-weight-bold">
                                Tipo de Proveedores
                            </span>
                            <v-divider />
                        </v-card-subtitle>
                        <v-data-table :loading="data.loadingTipo" :search="data.search" class="border" 
                            :headers="data.headersTipoProv" density="compact" :items="data.itemsTipoProv"
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

                            <template v-slot:item.fechaRegistro="{ item }">
                                <div>{{ formateDate(item.fechaRegistro) }}</div>
                            </template>
                            <template v-slot:item.opc="{ item }">
                                <v-menu location="right center" :close-on-content-click="false" origin="auto">
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
                                    <v-list nav rounded="lg" density="compact">
                                        <v-list-item-subtitle class="pa-1">
                                            Opciones
                                        </v-list-item-subtitle>
                                        <v-list-item @click="openDialog('tipo', 'edit', item)"
                                            prepend-icon="mdi-pencil">
                                            <v-list-item-title>Editar</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="showAlert(item)" prepend-icon="mdi-delete">
                                            <v-list-item-title>Eliminar</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="openDialog('tipo', 'view', item)"
                                            prepend-icon="mdi-eye">
                                            <v-list-item-title>Ver</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>

                                <!-- <v-tooltip text="Editar" location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" size="small" color="green" @click="openDialog('tipo', 'edit', item)" 
                                            class="mr-1" >
                                            mdi-pencil
                                        </v-icon>
                                    </template>
                                </v-tooltip>
                                
                                <v-tooltip text="Eliminar" location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" size="small" @click="showAlert(item)" color="error" 
                                            class="mr-1">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                </v-tooltip>

                                <v-tooltip text="Ver" location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" size="small" color="indigo-darken-4" 
                                            @click="openDialog('tipo', 'view', item)">
                                            mdi-eye
                                        </v-icon>
                                    </template>
                                </v-tooltip> -->
                            </template>
                            <template v-slot:item.estado="{ item }">
                                <v-chip :color="item.estado ? 'green' : 'error'" :text="item.estado ? 'Activo' : 'Inactivo'"/>
                            </template>
                        </v-data-table>
                    </v-window-item>
                </v-window>

            </v-card-text>
        </v-card>

        <SuccessAlert 
            :success="data.alertSuccess.success" 
            :msg="data.alertSuccess.msg" 
            :show="data.alertSuccess.show" 
        />

        <NewProveedor :show="data.newProv.show" :editar="data.newProv.editar" :title="data.newProv.title" 
            :prov="data.newProv.item" :ver="data.newProv.ver" @closeDialog="closeDialog"/>
        <NewTipoProv :show="data.newTipoProv.show" :editar="data.newTipoProv.editar" :title="data.newTipoProv.title" 
            :prov="data.newTipoProv.item" :ver="data.newTipoProv.ver" @closeDialog="closeDialogTipoProv"/>
        <AlertComp :show="data.viewAlert" @deleteItem="deleteAction"/>
    </div>
</template>

<script>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { formatters } from '@/helpers/formatters';
import NewProveedor from './dialogsCompras/NewProveedor.vue';
import NewTipoProv from './dialogsCompras/NewTipoProv.vue';
import RequestHttp from '@/services/requestHttp';
import AlertComp from '@/components/widgets/AlertaAction.vue';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getProveedores()
            vm.getTipoProveedores()
        })
    },

    components: {
        NewProveedor,
        NewTipoProv,
        AlertComp,
        SuccessAlert
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

        const data = reactive({
            headers: [
                {title: '', key: 'opc', align: 'center',
                    headerProps: { class: 'pa-0' },
                    cellProps: { class: 'pa-0' }
                },
                {title: 'Proveedor', key: 'nombre', align: 'center'},
                {title: 'T. Proveedor', key: 'tipoProveedor', align: 'center'},
                {title: 'Departamento', key: 'departamento', align: 'center'},
                {title: 'Teléfono', key: 'telefono', align: 'center'},
                {title: 'Fecha Registro', key: 'fechaRegistro', align: 'center'},
                {title: 'Estado', key: 'estado', align: 'center'},
            ],
            items: [],
            headersTipoProv: [
                {title: '', key: 'opc', align: 'center', 
                    headerProps: { class: 'pa-0' },
                    cellProps: { class: 'pa-0' }
                },
                {title: 'Tipo Proveedor', key: 'nombre', align: 'center'},
                {title: 'Fecha Registro', key: 'fechaRegistro', align: 'center'},
                {title: 'Observaciones', key: 'observaciones', align: 'center'},
                {title: 'Estado', key: 'estado', align: 'center'},
            ],
            itemsTipoProv: [],
            newProv: {
                show: false,
                editar: false,
                ver: false,
                title: '',
                item: {}
            },
            newTipoProv: {
                show: false,
                editar: false,
                ver: false,
                title: '',
                item: {}
            },

            // ALERT SUCCESS
            alertSuccess: {
                show: false,
                msg: '',
                success: false,
            },

            wind: 1,
            selectedItem: null,
            search: null,
            menuDesde: false,
            menuHasta: false,
            loading: false, 
            loadingTipo: false,
            viewAlert: false,
            requestHttp: new RequestHttp()
        })

        function showSuccesAlert(msg, success = true) {
            data.alertSuccess.msg = msg
            data.alertSuccess.show = true
            data.alertSuccess.success = success
            setTimeout(() => {
                data.alertSuccess.show = false
                data.alertSuccess.msg = ''
            }, 1500);
        }


        return {
            isMobile,
            data,
            showSuccesAlert
        }
    },

    methods: {
        setStyle({index}) {
            return {
                class: index % 2 === 0 ? 'bg-white' : 'bg-indigo-lighten-5',
            }
        },

        async getProveedores() {
            this.data.items = []
            this.data.loading = true
            const result = await this.data.requestHttp.getProveedores()
            this.data.loading = false
            result.map(item => {
                this.data.items.push(item)
            })
        },

        async getTipoProveedores() {
            this.data.itemsTipoProv = []
            this.data.loadingTipo = true
            const result = await this.data.requestHttp.getTipoProveedores()
            this.data.loadingTipo = false
            result.map(item => {
                this.data.itemsTipoProv.push(item)
            })
        },

        openDialog(comp, type, item = null) {
            if (comp === 'prov') {
                this.data.newProv.show = true
                switch(type) {
                    case 'create': this.data.newProv.ver = false
                                    this.data.newProv.editar = false
                                    this.data.newProv.title = 'Nuevo Proveedor'
                                    break;
                    case 'edit':  this.data.newProv.ver = false
                                    this.data.newProv.editar = true
                                    this.data.newProv.item = item
                                    this.data.newProv.title = 'Editar Proveedor'
                                    break;
                    case 'view':  this.data.newProv.ver = true
                                    this.data.newProv.editar = false
                                    this.data.newProv.item = item
                                    this.data.newProv.title = 'Proveedor'
                                    break;
                    default: break;
                }
            } else if (comp === 'tipo') {
                this.data.newTipoProv.show = true
                switch(type) {
                    case 'create': this.data.newTipoProv.ver = false
                                    this.data.newTipoProv.editar = false
                                    this.data.newTipoProv.title = 'Nuevo Tipo Proveedor'
                                    break;
                    case 'edit':  this.data.newTipoProv.ver = false
                                    this.data.newTipoProv.editar = true
                                    this.data.newTipoProv.item = item
                                    this.data.newTipoProv.title = 'Editar Tipo Proveedor'
                                    break;
                    case 'view':  this.data.newTipoProv.ver = true
                                    this.data.newTipoProv.editar = false
                                    this.data.newTipoProv.item = item
                                    this.data.newTipoProv.title = 'Tipo de Proveedor'
                                    break;
                    default: break;
                }
            }
        },

        formateDate(dateString) {
            const value = formatters.formatDate(dateString)
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
            if (this.data.selectedItem.idProveedor) {
                const result = await this.data.requestHttp.deleteProveedor(this.data.selectedItem.idProveedor)
                if (result.code === 200) {
                    this.showSuccesAlert('¡Registro Eliminado!', true)
                    this.getProveedores()
                } else {
                    this.showSuccesAlert('Hubo un problema al eliminar el registro', false)
                    return
                }
            } else {
                const result = await this.data.requestHttp.deleteTipoProveedor(this.data.selectedItem.idTipoProveedor)
                if (result.code === 200) {
                    this.showSuccesAlert('¡Registro Eliminado!', true)
                    this.getTipoProveedores()
                } else {
                    this.showSuccesAlert('Hubo un problema al eliminar el registro', false)
                    return
                }
            }
        },

        refreshData() {
            this.getProveedores()
            this.getTipoProveedores()
        },

        closeDialog(val) {
            this.data.newProv.show = val
            this.data.newProv.item = {}
            this.data.newProv.title = ''
            this.data.newProv.editar = false
            this.data.newProv.ver = false
            this.getProveedores()
        },

        closeDialogTipoProv (val) {
            this.data.newTipoProv.show = val
            this.data.newTipoProv.item = {}
            this.data.newTipoProv.title = ''
            this.data.newTipoProv.editar = false
            this.data.newTipoProv.ver = false
            this.getTipoProveedores()
        }
    }
}
</script>

<style scoped>

</style>