<template>
    <v-dialog v-model="localShow" max-width="400" persistent>
        <v-card id="diag-fact">
            <v-card-title class="bg-primary d-flex align-center">
                <h5><v-icon class="mr-1">mdi-account-cog</v-icon>Crear Rol</h5>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text id="body-card" class="">
                <v-row class="pb-0">
                    <v-col cols="12" md="12" sm="12" class="d-flex justify-end align-center pb-0">
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Fecha de Registro: </small>
                            <small><strong>{{ formatedDate(data.nowDate) }}</strong></small>
                        </div>
                    </v-col>
                </v-row>
                <v-card-subtitle class="d-flex align-center text-center my-4">
                    <small class="mr-2 font-weight-bold">GENERALES</small>
                    <v-divider/>
                </v-card-subtitle>
                <v-row>
                    <v-col cols="12" md="12" sm="12" class="py-2">
                        <v-text-field v-model="data.roles.codigo" prepend-inner-icon="mdi-barcode" density="compact" 
                        variant="outlined" hide-details label="Código" placeholder="Ingrese el código del rol" persistent-placeholder/>
                    </v-col>
                    <v-col cols="12" md="12" sm="12" class="py-2">
                        <v-text-field v-model="data.roles.nombre" prepend-inner-icon="mdi-account-cog" density="compact" 
                        variant="outlined" hide-details label="Rol" placeholder="Ingrese el nombre del rol" persistent-placeholder/>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider/>
            <v-card-actions>
                <v-btn color="grey" variant="outlined" @click="closeDialog()">
                    Cancelar
                </v-btn>
                <v-btn class="bg-primary" @click="handleSave()">
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { formatters } from '@/helpers/formatters';
import { reactive, ref, watch } from 'vue';
import { useStore } from '@/store';
import RequestHttp from '@/services/requestHttp';

export default {    
    props: {
        show: {
            type: Boolean,
            required: true,
            default: true
        }
    },

    setup(props) {
        const store = useStore()
        const localShow = ref(props.show)
       
        watch(() => props.show, (newValue) => {
            localShow.value = newValue
            if (newValue) {
                data.roles = {
                    codigo: '',
                    nombre: '',
                    usuarioRegistro: store.getNameUser(),
                }
                data.nowDate = new Date()
            }
        })

        const data = reactive({
            nowDate: new Date(),
            roles: {
                codigo: '',
                nombre: '',
                usuarioRegistro: store.getNameUser(),
            },
            showPass: false,
            requestHttp: new RequestHttp()
        })

        return {
            store,
            localShow,
            data
        }
    },

    methods: {
        async handleSave() {
            if (!this.data.roles.nombre || this.data.roles.nombre.trim() === '') {
                alert('Ingrese el nombre del Rol.')
                return
            }
            if (!this.data.roles.usuarioRegistro) {
                this.data.roles.usuarioRegistro = this.store.getNameUser()
            }
            const result = await this.data.requestHttp.postRol(this.data.roles)
            if (result !== null) {
                alert('Rol Guardado')
                this.closeDialog()
            } else {
                alert('No se pudo guardar el Rol')
            }
        },

        formatedDate(dataString) {
            const value = formatters.formatDate(dataString)
            return value
        },

        closeDialog() {
            this.$emit('closeDialog', false)
            this.localShow = false
            this.data.roles = {
                codigo: '',
                nombre: '',
                usuarioRegistro: this.store.getNameUser(),
            }
        },
    },
}
</script>

<style scoped>
.v-card-item{
    padding: 8px 12px !important;
}

#diag-fact{
    position: relative;
}

#body-card{
    z-index: 2;
}

#checkLabel{
    font-size: 12px !important;
}

</style>