<template>
    <div>
        <v-card elevation="0" class="border-t border-b" rounded="0">
            <template v-slot:prepend>
                <div class="d-flex align-center">
                <!-- Título -->
                    <div class="font-weight-bold d-flex align-center">
                        <v-icon class="me-2" color="primary">mdi-account-multiple-outline</v-icon>
                        <span class="text-h6 font-weight-bold">
                            Usuarios
                        </span>
                    </div>
                </div>
            </template>
            <template v-slot:append>
                <v-btn v-if="hasAccessToFunct('52')" color="indigo-darken-4" variant="text" 
                    @click="openDialog('tipo', 'create', null)" prepend-icon="mdi-account-plus">
                    NUEVO USUARIO
                </v-btn>
            </template>
            <v-divider />
            <v-card-text>
                <v-card-subtitle class="d-flex align-center text-center mb-2">
                    <v-divider /> 
                    <span class="mx-6 text-grey font-weight-bold">Usuarios</span>
                    <v-divider />
                </v-card-subtitle>
                <v-data-table :loading="data.loading" :search="data.search" :mobile="isMobile" class="" 
                    :headers="data.headers" density="compact" :items="data.items" :row-props="setStyle"
                    :header-props="{ class: 'font-weight-bold text-uppercase' }">
                    <template v-slot:top>
                        <v-row dense class="px-0" style="margin: 0;">
                            <v-col cols="6" sm="4" md="4">
                                <v-text-field v-model="data.search" density="compact" variant="outlined" label="Buscar" 
                                    hide-details placeholder="Buscar textos" persistent-placeholder color="indigo"/>
                            </v-col>
                            <v-col cols="6" md="8" sm="8" class="d-flex justify-end align-center">
                                <v-btn color="green" variant="tonal" @click="getUsuarios()"
                                    prepend-icon="mdi-refresh">
                                    Actualizar
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>

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
                    <template v-slot:item.opc="{ item }">
                        <v-menu :close-on-content-click="false" location="right center"
                            origin="auto">
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

                            <v-list nav rounded="lg" >
                                <v-list-item-subtitle class="pa-1">
                                    Opciones
                                </v-list-item-subtitle>
                                <v-list-item v-if="hasAccessToFunct('52')" rounded density="compact" 
                                    :prepend-icon="item.estado ? 'mdi-cancel' : 'mdi-check-circle-outline'" 
                                    color="indigo" @click="showAlert(item)">
                                    <template v-slot:title>
                                        <v-divider vertical />
                                        {{ item.estado ? 'Desactivar usuario' : 'Activar Usuario' }}
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>

                    <template v-slot:item.fechaRegistro="{ item }">
                        <div>{{ formateDate(item.fechaRegistro) }}</div>
                    </template>

                    <template v-slot:item.estado="{ item }">
                        <v-chip :color="item.estado ? 'green' : 'error'" :text="item.estado ? 'Activo' : 'Inactivo'"/>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <SuccessAlert 
            :success="data.alertSuccess.success" 
            :msg="data.alertSuccess.msg" 
            :show="data.alertSuccess.show" 
        />

        <NewUsuario :show="data.show" @closeDialog="closeDialog"/>
        <AlertComp :show="data.viewAlert" @deleteItem="deleteAction"/>
    </div>
</template>

<script>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { formatters } from '@/helpers/formatters';
import NewUsuario from './dialogsUsuario/NewUsuario.vue';
import RequestHttp from '@/services/requestHttp';
import { useStore } from '@/store';
import { hasAccessToFunct } from '@/scripts/Seguridad.js'
import AlertComp from '@/components/widgets/AlertaAction.vue';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';

export default {
    mounted() {
        this.getUsuarios()
    },

    components: {
        NewUsuario,
        AlertComp,
        SuccessAlert,        
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

        const data = reactive({
            headers: [
                {title: '', key: 'opc', align: 'center',
                    headerProps: {
                        class: 'pa-0'
                    },
                    cellProps: {
                        class: 'pa-0'
                    }
                },
                {title: 'Usuario', key: 'username', align: 'center'},
                {title: 'Roles', key: 'rol', align: 'center'},
                {title: 'Fecha Registro', key: 'fechaRegistro', align: 'center'},
                {title: 'Estado', key: 'estado', align: 'center'},
            ],
            // ALERT SUCCESS
            alertSuccess: {
                show: false,
                msg: '',
                success: false,
            },
            items: [],
            search: null,
            loading: false, 
            show: false,
            viewAlert: false,
            selectedItem: null,
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
            store,
            showSuccesAlert
        }
    },

    methods: {
      hasAccessToFunct,
        setStyle({ index }) {
            return {
                class:
                index % 2 === 0
                    ? 'bg-white'
                    : 'bg-indigo-lighten-5'
            }
        },

        showAlert(item){
            this.data.viewAlert = true
            this.data.selectedItem = item
        },

        deleteAction(val) {
            if (val) {
                this.changeStateUser()
            }
            this.data.viewAlert = false
        },

        async getUsuarios() {
            this.data.items = []
            this.data.loading = true
            const result = await this.data.requestHttp.getUsuarios()
            this.data.loading = false

            if (result.code === 200) {
                result.data.map(item => {
                    this.data.items.push(item)
                })
            }

        },

        async changeStateUser() {
            try {
                const result = await this.data.requestHttp.putUser(
                    this.data.selectedItem.idusuario,
                    this.data.selectedItem.estado ? false : true
                )

                const msg = this.data.selectedItem?.estado ? '¡Usuario desactivado!' : '¡Usuario activado!'

                if (result.code === 200) {
                    this.showSuccesAlert(msg, true)
                    this.getUsuarios()
                } else {
                    const msgAlert = this.data.selectedItem?.estado ? 'desactivar' : 'activar'
                    this.showSuccesAlert(`Hubo un problema al ${msgAlert} al usuario`, false)
                    return
                }
            } catch (error) {
                this.showSuccesAlert('Hubo un problema al eliminar el registro', false)
                return
            }
        },

        formateDate(dateString) {
            const value = formatters.formatDate(dateString)
            return value
        },

        openDialog() {
            this.data.show = true
        },


        closeDialog(val) {
            this.data.show = val
            this.getUsuarios()
        },
    }
}
</script>

<style scoped>

</style>