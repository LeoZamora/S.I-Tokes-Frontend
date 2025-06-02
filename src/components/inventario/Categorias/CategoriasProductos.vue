<template>
    <div>
        <v-card elevation="0" class="border" rounded="0">
            <template v-slot:prepend>
                <div class="d-flex align-center">
                <!-- Título -->
                    <div class="font-weight-bold d-flex align-center">
                        <v-icon class="me-2" color="red-darken-4">mdi-package-variant</v-icon>
                        <small v-if="isMobile">Gestión de Proveedores</small>
                        <span v-else class="text-h6 font-weight-bold">Gestión de Proveedores</span>
                    </div>
                </div>
            </template>
            <template v-slot:append>
                <v-btn icon color="red-darken-4" class="mr-2" variant="text" @click="openDialog('tipo', 'create', null)">
                    <v-icon>mdi-account-plus</v-icon>
                    <v-tooltip activator="parent" location="left">Agregar Tipo Proveedores</v-tooltip> 
                </v-btn>
                <v-btn class="bg-red-darken-4 rounded" @click="openDialog('prov', 'create', null)">
                    <v-icon>mdi-plus</v-icon>
                    <v-tooltip activator="parent" location="left">Agregar Proveedores</v-tooltip> 
                </v-btn>
            </template>
            <v-card-text class="px-0">
                <v-row dense class="px-0" style="margin: 0;">
                    <v-col cols="6" sm="6" md="3">
                        <v-text-field density="compact" variant="outlined" label="Buscar" hide-details placeholder="Buscar textos" persistent-placeholder/>
                    </v-col>
                    <v-col cols="6" md="3" sm="6">
                        <v-text-field color="indigo-darken-4" variant="outlined" append-inner-icon="mdi-calendar" 
                            density="compact" label="Fecha Desde" v-model="dateDesde" readonly  @click="data.menuDesde = true" 
                            placeholder="dd/mm/yyyy" persistent-placeholder hide-details/>
                        <v-dialog v-model="data.menuDesde" width="auto">
                            <v-date-picker color="indigo-darken-4" v-model="dateDesdeFormatted" />
                        </v-dialog>
                    </v-col>
                    <v-col cols="6" md="3" sm="6">
                        <v-text-field color="indigo-darken-4" variant="outlined" append-inner-icon="mdi-calendar" density="compact" 
                            label="Fecha Hasta" v-model="dateHasta" readonly  @click="data.menuHasta = true" 
                                placeholder="dd/mm/yyyy" persistent-placeholder hide-details/>
                        <v-dialog v-model="data.menuHasta" width="auto">
                            <v-date-picker color="indigo-darken-4" v-model="dateHastaFormatted" />
                        </v-dialog>
                    </v-col>
                    <v-col cols="6" md="3" sm="6" class="d-flex justify-end align-center">
                        <v-btn icon color="red-darken-4" size="small" variant="text" class="mr-2 border">
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn icon color="grey" size="small" variant="text" class="border">
                            <v-icon>mdi-broom</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row dense class="w-100">
                </v-row>
                <v-card-subtitle class="d-flex align-center text-center mb-2">
                    <v-divider /> 
                    <span class="mx-6 text-grey font-weight-bold">Proveedores</span>
                    <v-divider />
                </v-card-subtitle>
                <v-data-table :mobile="isMobile" class="border" :headers="data.headers" density="compact" :items="data.items">
                    <template v-slot:item.opc="{ item }">
                        <v-tooltip text="Editar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" color="green" @click="openDialog('prov', 'edit', item)" class="mr-1" >mdi-pencil</v-icon>
                            </template>
                        </v-tooltip>
                        
                        <v-tooltip text="Eliminar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" color="error" class="mr-1">mdi-delete</v-icon>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Ver" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" color="indigo-darken-4" @click="openDialog('prov', 'view', item)">mdi-eye</v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                </v-data-table>
                <v-card-subtitle class="d-flex align-center text-center mb-2">
                    <v-divider /> 
                    <span class="mx-6 text-grey font-weight-bold">Tipo de Proveedores</span>
                    <v-divider />
                </v-card-subtitle>
                <v-data-table :mobile="isMobile" class="border" :headers="data.headers" density="compact" :items="data.items">
                    <template v-slot:item.opc="{ item }">
                        <v-tooltip text="Editar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" color="green" @click="openDialog('tipo', 'edit', item)" class="mr-1" >mdi-pencil</v-icon>
                            </template>
                        </v-tooltip>
                        
                        <v-tooltip text="Eliminar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" color="error" class="mr-1">mdi-delete</v-icon>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Ver" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" color="indigo-darken-4" @click="openDialog('tipo', 'view', item)">mdi-eye</v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <NewProveedor :show="data.newProv.show" :editar="data.newProv.editar" :title="data.newProv.title" 
            :orden="data.newProv.item" :ver="data.newProv.ver" @closeDialog="closeDialog"/>
        <NewTipoProv :show="data.newTipoProv.show" :editar="data.newTipoProv.editar" :title="data.newTipoProv.title" 
            :orden="data.newTipoProv.item" :ver="data.newTipoProv.ver" @closeDialog="closeDialogTipoProv"/>
    </div>
</template>

<script>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import NewProveedor from './dialogsCompras/NewProveedor.vue';
import NewTipoProv from './dialogsCompras/NewTipoProv.vue';

export default {
    components: {
        NewProveedor,
        NewTipoProv
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
            headers: [
                {title: '', key: 'opc', align: 'center'},
                {title: 'T. Proveedor', key: 'tipoProveedor', align: 'center'},
                {title: 'Proveedor', key: 'proveedor', align: 'center'},
                {title: 'RUC', key: 'ruc', align: 'center'},
                {title: 'Teléfono', key: 'telefono', align: 'center'},
                {title: 'Email', key: 'email', align: 'center'},
                {title: 'Fecha Registro', key: 'fechaRegistro', align: 'center'},
                {title: 'Estado', key: 'estado', align: 'center'},
            ],
            items: [],
            menuDesde: false,
            menuHasta: false,
        })

        return {
            isMobile,
            dateDesde,
            dateDesdeFormatted,
            dateHasta,
            dateHastaFormatted,
            data
        }
    },

    methods: {
    }
}
</script>

<style scoped>

</style>