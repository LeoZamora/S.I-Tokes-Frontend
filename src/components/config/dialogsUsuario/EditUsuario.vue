<template>
    <v-dialog v-model="localShow" max-width="500" persistent>
        <v-card id="diag-edit-usuario">
            <v-card-title class="bg-indigo-darken-4 text-white d-flex align-center">
                <v-icon class="mr-2">mdi-account-edit</v-icon>
                <span class="text-h6 font-weight-bold">Editar Usuario</span>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog(false)">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>
            <v-divider />

            <v-card-text id="body-card" class="pa-4">
                <v-row class="pb-2" dense>
                    <v-col cols="12" class="d-flex justify-space-between align-center">
                        <div>
                            <v-chip size="small" :color="data.usuario.estado ? 'green' : 'error'" variant="tonal" class="font-weight-medium">
                                {{ data.usuario.estado ? 'Activo' : 'Inactivo' }}
                            </v-chip>
                        </div>
                        <div v-if="data.usuario.fechaRegistro" class="text-caption text-grey-darken-1">
                            <span>Registrado: <strong>{{ formatDate(data.usuario.fechaRegistro) }}</strong></span>
                        </div>
                    </v-col>
                </v-row>

                <v-card-subtitle class="d-flex align-center text-center my-2 px-0">
                    <small class="mr-2 font-weight-bold text-indigo-darken-3">DATOS GENERALES</small>
                    <v-divider />
                </v-card-subtitle>

                <v-form ref="form">
                    <v-row dense>
                        <!-- Usuario (inmutable) -->
                        <v-col cols="12" class="py-1">
                            <v-text-field 
                                v-model="data.usuario.username" 
                                prepend-inner-icon="mdi-account-lock" 
                                density="compact" 
                                variant="outlined" 
                                label="Usuario (Identificador)" 
                                readonly 
                                disabled
                                persistent-placeholder 
                                persistent-hint
                                hint="El identificador de usuario es inmutable"
                                color="indigo"
                            />
                        </v-col>

                        <!-- Nombre Completo -->
                        <v-col cols="12" class="py-1">
                            <v-text-field 
                                v-model="data.usuario.nombre" 
                                prepend-inner-icon="mdi-account-details" 
                                density="compact" 
                                variant="outlined" 
                                label="Nombre Completo" 
                                placeholder="Ingrese el nombre completo" 
                                persistent-placeholder 
                                color="indigo" 
                                :rules="data.rules.nombreRules"
                            />
                        </v-col>

                        <!-- Rol -->
                        <v-col cols="12" class="py-1">
                            <v-select 
                                v-model="data.usuario.idrol" 
                                :items="data.roles" 
                                prepend-inner-icon="mdi-account-cog" 
                                density="compact" 
                                variant="outlined" 
                                label="Rol" 
                                placeholder="Seleccione un rol" 
                                persistent-placeholder
                                color="indigo" 
                                :rules="data.rules.rolRules"
                            />
                        </v-col>
                    </v-row>

                    <!-- Sección de Contraseña -->
                    <v-card-subtitle class="d-flex align-center text-center mt-4 mb-2 px-0">
                        <small class="mr-2 font-weight-bold text-indigo-darken-3">SEGURIDAD Y CONTRASEÑA</small>
                        <v-divider />
                    </v-card-subtitle>

                    <v-row dense>
                        <v-col cols="12" class="py-1">
                            <div class="d-flex align-center justify-space-between rounded-lg pa-2 bg-grey-lighten-4 border">
                                <div class="d-flex align-center">
                                    <v-icon :color="data.cambiarPassword ? 'indigo-darken-3' : 'grey'" class="mr-2">
                                        {{ data.cambiarPassword ? 'mdi-lock-reset' : 'mdi-lock' }}
                                    </v-icon>
                                    <div>
                                        <div class="text-body-2 font-weight-medium">Actualizar contraseña</div>
                                        <div class="text-caption text-grey-darken-1">
                                            {{ data.cambiarPassword ? 'Asignar una nueva contraseña al usuario' : 'Mantener la contraseña actual sin cambios' }}
                                        </div>
                                    </div>
                                </div>
                                <v-switch 
                                    v-model="data.cambiarPassword" 
                                    color="indigo-darken-3" 
                                    inset 
                                    density="compact"
                                    hide-details
                                    @update:model-value="onTogglePassword"
                                />
                            </div>
                        </v-col>

                        <!-- Campos para nueva contraseña -->
                        <v-col v-if="data.cambiarPassword" cols="12" class="py-1">
                            <v-text-field 
                                v-model="data.password" 
                                :append-inner-icon="data.showPass ? 'mdi-eye' : 'mdi-eye-off'" 
                                density="compact" 
                                @click:append-inner="data.showPass = !data.showPass"
                                variant="outlined" 
                                label="Nueva Contraseña" 
                                placeholder="Ingrese la nueva contraseña"  
                                persistent-placeholder 
                                :type="data.showPass ? 'text' : 'password'"
                                prepend-inner-icon="mdi-lock-outline"
                                color="indigo" 
                                :rules="data.cambiarPassword ? data.rules.passwordRules : []"
                            />
                        </v-col>

                        <v-col v-if="data.cambiarPassword" cols="12" class="py-1">
                            <v-text-field 
                                v-model="data.confirmPassword" 
                                :append-inner-icon="data.showConfirmPass ? 'mdi-eye' : 'mdi-eye-off'" 
                                density="compact" 
                                @click:append-inner="data.showConfirmPass = !data.showConfirmPass"
                                variant="outlined" 
                                label="Confirmar Nueva Contraseña" 
                                placeholder="Repita la nueva contraseña"  
                                persistent-placeholder 
                                :type="data.showConfirmPass ? 'text' : 'password'"
                                prepend-inner-icon="mdi-lock-check-outline"
                                color="indigo" 
                                :rules="data.cambiarPassword ? data.rules.confirmPasswordRules : []"
                            />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-divider />
            <v-card-actions class="pa-3">
                <v-btn color="grey" variant="tonal" @click="closeDialog(false)">
                    Cancelar
                </v-btn>
                <v-spacer />
                <v-btn 
                    class="bg-indigo-darken-4 text-white" 
                    @click="handleUpdate()"
                    :disabled="data.disabledBtn"
                    prepend-icon="mdi-content-save-outline"
                    elevation="2"
                >
                    <template v-if="data.disabledBtn">
                        <v-progress-circular 
                            color="white" 
                            indeterminate
                            :size="20" 
                            :width="2"
                            class="mr-2"
                        />
                        <span>Guardando...</span>
                    </template>
                    <template v-else>
                        <span class="font-weight-bold">Guardar Cambios</span>
                    </template>
                </v-btn>
            </v-card-actions>

            <OverlayComp :show="data.overlay.show" /> 
        </v-card>

        <SuccessAlert 
            :success="data.alertSuccess.success" 
            :msg="data.alertSuccess.msg" 
            :show="data.alertSuccess.show" 
        />
    </v-dialog>
</template>

<script>
import { reactive, ref, watch } from 'vue';
import { formatters } from '@/helpers/formatters';
import RequestHttp from '@/services/requestHttp';
import SuccessAlert from '@/components/widgets/SuccessAlert.vue';
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';

export default {
    name: 'EditUsuarioDialog',

    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        usuario: {
            type: Object,
            default: () => null
        }
    },

    emits: ['closeDialog'],

    components: {
        SuccessAlert,
        OverlayComp
    },

    setup(props, { emit }) {
        const localShow = ref(props.show);

        const data = reactive({
            rules: {
                nombreRules: [
                    v => (!!v && v.trim().length > 0) || 'El nombre es obligatorio'
                ],
                rolRules: [
                    v => !!v || 'Debe seleccionar un rol'
                ],
                passwordRules: [
                    v => (!!v && v.length >= 4) || 'La contraseña debe tener al menos 4 caracteres'
                ],
                confirmPasswordRules: [
                    v => !!v || 'Debe confirmar la contraseña',
                    v => v === data.password || 'Las contraseñas no coinciden'
                ]
            },
            usuario: {
                idusuario: null,
                username: '',
                nombre: '',
                idrol: null,
                estado: true,
                fechaRegistro: null,
                usuarioRegistro: ''
            },
            cambiarPassword: false,
            password: '',
            confirmPassword: '',
            showPass: false,
            showConfirmPass: false,
            disabledBtn: false,
            roles: [],
            overlay: {
                show: false
            },
            alertSuccess: {
                show: false,
                msg: '',
                success: false
            },
            requestHttp: new RequestHttp()
        });

        const loadUserFromProp = (userProp) => {
            if (!userProp) return;
            data.usuario.idusuario = userProp.idusuario ?? userProp.idUsuario ?? null;
            data.usuario.username = userProp.username ?? userProp.Username ?? '';
            data.usuario.nombre = userProp.nombre ?? userProp.Nombre ?? '';
            data.usuario.idrol = userProp.idrol ?? userProp.Idrol ?? null;
            data.usuario.estado = userProp.estado ?? true;
            data.usuario.fechaRegistro = userProp.fechaRegistro ?? null;
            data.usuario.usuarioRegistro = userProp.usuarioRegistro ?? '';

            // Reset password state
            data.cambiarPassword = false;
            data.password = '';
            data.confirmPassword = '';
            data.showPass = false;
            data.showConfirmPass = false;
        };

        watch(() => props.show, (newVal) => {
            localShow.value = newVal;
            if (newVal) {
                loadUserFromProp(props.usuario);
            }
        });

        watch(() => props.usuario, (newVal) => {
            if (newVal && props.show) {
                loadUserFromProp(newVal);
            }
        });

        function showSuccessAlert(msg, success = true) {
            data.alertSuccess.msg = msg;
            data.alertSuccess.show = true;
            data.alertSuccess.success = success;
            setTimeout(() => {
                data.alertSuccess.show = false;
                data.alertSuccess.msg = '';
            }, 1800);
        }

        return {
            localShow,
            data,
            showSuccessAlert
        };
    },

    mounted() {
        this.getRoles();
    },

    methods: {
        async getRoles() {
            try {
                this.data.roles = [];
                const result = await this.data.requestHttp.getRoles();
                if (result && Array.isArray(result)) {
                    result.forEach(item => {
                        const label = item.codigo ? `[${item.codigo}] ${item.nombre}` : item.nombre;
                        this.data.roles.push({
                            title: label,
                            value: item.idrol ?? item.idRol
                        });
                    });
                }
            } catch (err) {
                console.error('Error al cargar roles:', err);
            }
        },

        onTogglePassword(val) {
            if (!val) {
                this.data.password = '';
                this.data.confirmPassword = '';
                if (this.$refs.form) {
                    this.$refs.form.resetValidation();
                }
            }
        },

        formatDate(dateString) {
            if (!dateString) return '—';
            return formatters.formatDate(dateString);
        },

        async handleUpdate() {
            const valid = await this.$refs.form.validate();
            if (!valid.valid) return;

            const id = Number(this.data.usuario.idusuario);
            if (!id || id <= 0) {
                this.showSuccessAlert('ID de usuario no válido', false);
                return;
            }

            const payload = {
                idUsuario: id,
                idrol: Number(this.data.usuario.idrol),
                nombre: this.data.usuario.nombre ? this.data.usuario.nombre.trim() : ''
            };

            if (this.data.cambiarPassword && this.data.password && this.data.password.trim() !== '') {
                payload.password = this.data.password;
            }

            this.data.disabledBtn = true;
            this.data.overlay.show = true;

            try {
                const result = await this.data.requestHttp.putUsuario(id, payload);
                this.data.disabledBtn = false;
                this.data.overlay.show = false;

                if (result.code === 200) {
                    const successMsg = result.data?.msg || '¡Usuario actualizado exitosamente!';
                    this.showSuccessAlert(successMsg, true);
                    setTimeout(() => {
                        this.closeDialog(true);
                    }, 1200);
                } else {
                    const errorMsg = result.data?.msg || result.data?.error || (typeof result.data === 'string' ? result.data : 'Error al actualizar el usuario');
                    this.showSuccessAlert(errorMsg, false);
                }
            } catch (error) {
                this.data.disabledBtn = false;
                this.data.overlay.show = false;
                this.showSuccessAlert('Ocurrió un error inesperado al actualizar el usuario', false);
            }
        },

        closeDialog(updated = false) {
            this.$emit('closeDialog', updated);
            this.localShow = false;
            this.data.cambiarPassword = false;
            this.data.password = '';
            this.data.confirmPassword = '';
            if (this.$refs.form) {
                this.$refs.form.resetValidation();
            }
        }
    }
};
</script>

<style scoped>
#diag-edit-usuario {
    position: relative;
}
#body-card {
    z-index: 2;
}
</style>
