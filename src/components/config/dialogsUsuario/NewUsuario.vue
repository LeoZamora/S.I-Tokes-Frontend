<template>
    <v-dialog v-model="localShow" max-width="400" persistent>
        <v-card id="diag-fact">
            <v-card-title class="bg-primary d-flex align-center">
                <h5><v-icon>mdi-account-outline</v-icon>Crear Usuario</h5>
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
                        <v-text-field v-model="data.usuario.username" prepend-inner-icon="mdi-account" density="compact" 
                        variant="outlined" hide-details label="Usuario" placeholder="ingrese el Usuario"  persistent-placeholder/>
                    </v-col>
                    <v-col cols="12" md="12" sm="12" class="py-2">
                        <v-select v-model="data.usuario.idrol" :items="data.roles" prepend-inner-icon="mdi-account-question" density="compact" 
                        variant="outlined" hide-details label="Rol" placeholder="roles"  persistent-placeholder/>
                    </v-col>
                    <v-col cols="12" md="12" sm="12" class="py-2">
                        <v-text-field v-model="data.usuario.password" :append-inner-icon="data.showPass ? 'mdi-eye' : 'mdi-eye-off'" density="compact" @click:append-inner="data.showPass = !data.showPass"
                        variant="outlined" hide-details label="Contraseña" placeholder="ingrese una contraseña"  persistent-placeholder :type="data.showPass ? 'text' : 'password'"/>
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
import { utilsFunctions } from '@/helpers/utilFunctions';
import RequestHttp from '@/services/requestHttp';
import { reactive, ref, watch } from 'vue';
import { useStore } from '@/store';

export default {
    mounted() {
        this.getRoles()
    },
    
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
        })

        const data = reactive({
            nowDate: new Date(),
            usuario: {
                idrol: null,
                username: null,
                password: null,
                usuarioRegistro: store.getNameUser(),
            },
            roles: [],
            showPass: false,
            requestHttp: new RequestHttp()
        })

        return {
            localShow,
            data
        }
    },

    methods: {
        async handleSave() {
            console.log(this.data.usuario);
            
            const valid = utilsFunctions.objectValidate(this.data.usuario)
            if (valid) {
                const result = await this.data.requestHttp.postUsuario(this.data.usuario)
                if (result !== null) {
                    alert('Usuario Guardado')
                    this.$emit('closeDialog', false)
                    this.localShow = false
                } else {
                    alert('No se pudo guardar el usuario')
                }
            } else {
                alert('Complete toda la información')
                return
            }
        },
        
        async getRoles() {
            const result = await this.data.requestHttp.getRoles()
            if (result !== null) {
                result.map(item => {
                    this.data.roles.push({title: item.nombre, value: item.idrol})
                })
            }
        },        

        formatedDate(dataString) {
            const value = formatters.formatDate(dataString)
            return value
        },

        closeDialog() {
            this.$emit('closeDialog', false)
            this.data.usuario = {}
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