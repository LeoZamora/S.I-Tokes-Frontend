<template>
    <div class="w-100">
        <v-card class="border" elevation="0" rounded="0">
            <!-- Encabezado -->
            <template v-slot:prepend>
                <div class="d-flex align-center">
                    <!-- Título -->
                    <div class="text-h6 font-weight-bold d-flex align-center">
                    <v-icon class="me-2" color="primary">mdi-package-variant</v-icon>
                        Tipo de Movimientos
                    </div>
                </div>
            </template>
            <v-divider /> 
            <v-row class="pa-2" dense>
                <v-col cols="12" md="4" sm="4" class="align-top">
                    <v-card-subtitle class="d-flex align-center text-center mb-2">
                        <v-divider /> 
                        <span class="mx-6 text-grey font-weight-bold">
                            Busqueda
                        </span>
                        <v-divider />
                    </v-card-subtitle>
                    <v-row dense>
                        <v-col cols="12" md="12" sm="12">
                            <v-text-field v-model="data.search" color="primary" density="compact" 
                                variant="outlined" append-inner-icon="mdi-magnify" label="Buscar productos"
                                hide-details placeholder="Ingrese un texto a buscar..." persistent-placeholder/>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="d-flex justify-space-between align-center">
                            <div>    
                                <v-btn icon color="green" size="small" variant="text" class="mr-2 border"
                                    @click="getTipoMov()">
                                    <v-icon>mdi-refresh</v-icon>
                                </v-btn>
                                <v-btn icon color="grey" size="small" variant="text" class="border" @click="data.search = null">
                                    <v-icon>mdi-broom</v-icon>
                                </v-btn>
                            </div>
                            <v-btn class="bg-primary rounded" @click="newRegister">
                                <v-icon>mdi-plus</v-icon>
                                <v-tooltip activator="parent" location="left">Nueva Factura</v-tooltip> 
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-card-subtitle class="d-flex align-center text-center mb-2">
                        <v-divider /> 
                        <span class="mx-6 text-grey font-weight-bold">Registro</span>
                        <v-divider />
                    </v-card-subtitle>                
                    <v-form ref="form">
                        <v-row dense>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field color="primary" density="compact" :rules="data.rules.rule" 
                                    variant="outlined" label="Codigo" v-model="data.tipoMovimiento.codigo"
                                    hide-details placeholder="Ingrese un codigo" persistent-placeholder
                                    :readonly="data.editType === 'view' ? true : false"/>
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field color="primary" density="compact" :rules="data.rules.rule" 
                                    variant="outlined" label="Nombre" v-model="data.tipoMovimiento.nombre"
                                    hide-details placeholder="Ingrese un nombre" persistent-placeholder
                                    :readonly="data.editType === 'view' ? true : false"/>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-textarea color="primary" density="compact"  :rules="data.rules.rule"
                                    variant="outlined" label="Nombre" v-model="data.tipoMovimiento.descripcion"
                                    hide-details placeholder="Ingrese un nombre" persistent-placeholder
                                    :readonly="data.editType === 'view' ? true : false"/>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="d-flex justify-end align-center">
                                <v-btn class="ml-4" color="green" @click="gaurdarTipoMov()" 
                                    :disabled="data.editType === 'view' ? true : false">
                                    {{ data.editType == 'edit' && data.editType !== 'view'  ? 'Editar' : 'Guardar' }}
                                </v-btn>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <transition name="slide-x-transition">
                                    <v-alert v-if="data.alert.show" :type="data.alert.tipo" density="compact"
                                    :text="data.alert.msg" variant="tonal"/>
                                </transition>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>

                <v-col cols="12" md="8" sm="8">
                    <v-card-subtitle class="d-flex align-center text-center mb-2">
                        <v-divider /> 
                        <span class="mx-6 text-grey font-weight-bold">Registros</span>
                        <v-divider />
                    </v-card-subtitle>
                    <v-data-table :search="data.search" :mobile="isMobile" :headers="data.header" 
                        :items="data.tipoMov" class="border font" density="compact" :loading="data.loading" 
                        :row-props="setStyle" :header-props="{ class: 'font-weight-bold' }"
                        items-per-page="20" hover height="340" fixed-header hide-default-footer>
                        <template v-slot:loader>
                            <v-progress-linear color="indigo" indeterminate height="2"/>
                        </template>
                        <template v-slot:loading>
                            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>
                        <template v-slot:item.total="{ item }">
                            <div>{{ formatedCurrency(item.total) }}</div>
                        </template>
                        <template v-slot:item.fechaRegistro="{ item }">
                            <div>{{ formatedDate(item.fechaRegistro) }}</div>
                        </template>
                        <template v-slot:item.credito="{ item }">
                            <v-chip :color="item.credito ? 'error' : 'indigo-darken-4'" 
                                :text="item.credito ? 'Crédito' : 'Contado'"/>
                        </template>
                        <template v-slot:item.opc="{ item }">
                            <v-tooltip text="Editar" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-if="data.crud.edit" v-bind="props" size="small" color="green" 
                                        @click="getTipoMovById(item.id, 'edit')" class="mr-1" >
                                        mdi-pencil
                                    </v-icon>
                                </template>
                            </v-tooltip>
                            
                            <v-tooltip text="Eliminar" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-if="data.crud.delete" v-bind="props" size="small" color="error" 
                                        class="mr-1" @click="showAlert(item)">
                                        mdi-delete
                                    </v-icon>
                                </template>
                            </v-tooltip>

                            <v-tooltip text="Ver" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-if="data.crud.view" v-bind="props" size="small" color="indigo-darken-4" 
                                        @click="getTipoMovById(item.id, 'view')">
                                        mdi-eye
                                    </v-icon>
                                </template>
                            </v-tooltip>
                        </template>
                        <template v-slot:item.estado="{ item }">
                            <v-chip :color="item.estado ? 'green' : 'error'" small>
                                {{ item.estado ? 'Activo' : 'Inactivo' }}
                            </v-chip>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-card>
        <AlertComp :show="data.viewAlert" @deleteItem="deleteAction"/>
    </div>
</template>

<script>
import { formatters } from '@/helpers/formatters.js';
import { reactive, computed, ref, onMounted, onUnmounted } from 'vue';
import RequestHttp from '@/services/requestHttp';
import AlertComp from '@/components/widgets/AlertaAction.vue';
import { useStore } from '@/store';
import endPoints from '@/services/endPoints';

export default {
    mounted() {
        this.verifyDataSecurity()
        this.getTipoMov()
    },

    components: {
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
            rules: {
                rule: [v => !!v || 'Campo requerido']
            },
            header: [
                {title: '', key: 'opc', align: 'center',},
                {title: 'Codigo', key: 'codigo', align: 'center'},
                {title: 'Tipo de Venta', key: 'nombre', align: 'center'},
            ],
            tipoMov: [],
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
            crud: {
                create: false, 
                view: false, 
                edit: false,
                delete: false
            },

            tipoMovimiento: {
                codigo: null,
                nombre: null,
                descripcion: null,
                usuarioRegistro: null
            },

            alert: {
                show: false,
                tipo: '',
                msg: ''
            },
            
            loading: false,
            search: null,
            editType: '',
            idTipoMov: null,
            viewAlert: false,
            selectedItem: null,
            idVenta: null,
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

        async gaurdarTipoMov() {
            this.$refs.form.validate()
            const token = this.store.getInfoUser()
            this.data.tipoMovimiento.usuarioRegistro = token.usuario
            if (!this.data.tipoMovimiento.codigo || !this.data.tipoMovimiento.nombre
                || !this.data.tipoMovimiento.usuarioRegistro
            ) {
                this.data.alert.show = true
                this.data.alert.msg = 'Complete todos los datos'
                this.data.alert.tipo = 'info'
                setTimeout(() => {
                    this.data.alert.show = false
                }, 2000)

            } else {
                let result;

                if (this.data.editType === 'save') {
                    result = await this.data.requestHttp.postTipoMov(this.data.tipoMovimiento)
                } else if(this.data.editType === 'edit') {
                    result = await this.data.requestHttp.putTipoMov(this.data.tipoMovimiento, this.data.idTipoMov)
                }

                if (result.code === 200) {
                    this.getTipoMov()
                    this.data.alert.show = true
                    this.data.alert.msg = result.msg
                    this.data.alert.tipo = 'success'
                    setTimeout(() => {
                        this.data.alert.show = false
                    }, 3000)

                    this.data.tipoMovimiento = {}
                } else {
                    this.data.alert.show = true
                    this.data.alert.msg = result.msg
                    this.data.alert.tipo = 'warning'
                    setTimeout(() => {
                        this.data.alert.show = false
                    }, 3000)
                }
            }
        },

        async getTipoMov() {
            this.data.tipoMov = []
            this.data.loading = true
            const result = await this.data.requestHttp.getCombobox(endPoints.getTipoMov)
            this.data.loading = false
            if (result.code === 200) {
                result.data.map(item => {
                    this.data.tipoMov.push(item)
                })
            }
        },

        async getTipoMovById(id, type) {
            this.data.idTipoMov = id
            this.data.editType = type
            this.data.tipoMovimiento = {}
            const result = await this.data.requestHttp.getByIdTipoMov(id)
            this.data.tipoMovimiento = result
        },

        newRegister() {
            this.data.editType = 'save'
            this.data.tipoMovimiento = {}
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
            this.data.idVenta = item.idVenta
            this.data.editFactura.title = 'EDITAR FACTURA'
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
            const result = await this.data.requestHttp.deleteVenta(this.data.selectedItem.idVenta)
            if (result !== null) {
                alert('Venta Eliminada')
                this.getVentas()
            } else {
                alert('No se pudo eliminar el registro')
            }
        },

        closeDialog(val) {  
            this.data.viewFactura.show = val
            this.data.editFactura.show = val
            this.data.editFactura.editar = val
            this.data.editFactura.show = val
            this.data.editFactura.title = ''
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