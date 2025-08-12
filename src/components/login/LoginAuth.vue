<template>
  <div id="cont">
    <LoaderComp :data="data.msgLoader" v-show="data.loading"/>
    <div id="logo-auth" class="w-100 d-flex flex-column  align-center">
      <div>
        <img width="300px" class="my-10" src="/logoIZ.jpg"/>
      </div>
      <v-card id="card-form" elevation="0" class="bg-transparent border" rounded="lg">
        <v-card-title class="text-center mt-2"><strong>INICIO DE SESION</strong></v-card-title>
        <v-form id="form-login" v-model="data.valid" class="mx-2 mb-8 px-4" ref="form" lazy-validation>
          <v-card-text class="pt-0">
            <div class="text-subtitle-1 text-medium-emphasis">Usuario</div>
            <v-text-field color="primary" v-model="data.data.usuario" placeholder="Ingrese su usuario" type="email"
                          :rules="data.rules.userRules" @input="clearError" variant="outlined"
                          prepend-inner-icon="mdi-account-outline"
                          aria-describedby="input-username-messages" autocomplete="username" density="compact"/>
            <div class="text-subtitle-1 text-medium-emphasis">Contraseña</div>
            <v-text-field
                color="primary" v-model="data.data.password" placeholder="Ingrese su contraseña"
                @keydown.enter="authLoging"
                autocomplete="current-password" @click:append-inner="passVisible"
                :append-inner-icon="data.showPass ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" prepend-inner-icon="mdi-lock-outline"
                @input="clearError"
                variant="outlined" density="compact" :type="data.showPass ? 'text': 'password'"
                :rules="data.rules.passRules"/>
          </v-card-text>
          <v-fade-transition>
            <v-alert density="compact" v-if="data.error" type="warning" variant="tonal">
              {{ data.errorMsg }}
            </v-alert>
          </v-fade-transition>
          <span v-show="data.count">Intentos restantes: {{ 5 - data.count }}</span>
          <div v-if="data.count === 5" class="w-100 d-flex justify-space-between align-center">

            <span>Volver a intentar en: </span>
            <strong class="ml-1">{{ cronometro }}</strong>
          </div>
          <v-card-actions id="btn" class="pb-8 d-flex justify-center">
            <v-btn :disabled="data.disableBtn" size="large" @click="authLoging()" class="bg-primary" block>Acceder
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script>
import RequestHttp from '@/services/requestHttp';
import LoaderComp from '../widgets/LoaderComp.vue';
import JWTDecoder from '@/helpers/decoderJWT';
import {useStore} from '@/store';
import {reactive, ref} from 'vue';

export default {
  name: 'LoginAuth',

  setup() {
    const tiempo = ref(15000)
    const cronometro = ref('15')
    let interval = null

    const timer = () => {
      if (interval) clearInterval(interval);

      tiempo.value = 5 * 60 * 1000
      actualizarTimer()

      interval = setInterval(() => {
        let minutos = Math.floor(tiempo.value / 60000);
        let segundos = Math.floor((tiempo.value % 60000) / 1000);

        cronometro.value = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

        if (tiempo.value <= 0) {
          clearInterval(interval);
          cronometro.value = "00:00";
        }

        tiempo.value -= 1000;
      }, 1000); // Ejecutar cada segundo
    }

    const actualizarTimer = () => {
      let minutos = Math.floor(tiempo.value / 60000);
      let segundos = Math.floor((tiempo.value % 60000) / 1000);
      cronometro.value = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    }

    const useAuth = useStore()
    const data = reactive({
      rules: {
        userRules: [v => !!v || 'El campo es obligatorio'],
        passRules: [v => !!v || 'El campo es obligatorio']
      },
      data: {
        usuario: '',
        password: ''
      },
      count: 0,
      disableBtn: false,
      loading: false,
      valid: false,
      error: false,
      errorMsg: '',
      showPass: false,
      isVisible: false,
      msgLoader: '',
      requestHttp: new RequestHttp(),
    })

    return {
      data,
      useAuth,
      cronometro,
      timer,
      tiempo,
    }
  },

  components: {
    LoaderComp
  },

  methods: {
    passVisible() {
      this.data.showPass = !this.data.showPass;
    },

    clearError() {
      this.data.errorMsg = '';
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    async authLoging() {
      this.$refs.form.validate();

      if (!this.data.data.usuario || !this.data.data.password) {
        return;
      }

      this.data.msgLoader = 'Iniciando Sesion'
      this.data.loading = true
      const result = await this.data.requestHttp.postLogin(this.data.data)
      this.data.loading = false

      if (result.code == 200) {        
        await this.delay(1500)
        let jwtHandler = new JWTDecoder(result.token)
        const decode = jwtHandler.decodeToken()
        this.useAuth.login(decode)
        this.useAuth.sendNameUser(this.data.data.usuario)
      } else if (result.code == 404 || result.code == 400) {
        this.data.count += 1;
        if (this.data.count === 5) {
          this.data.disableBtn = true
          this.data.error = true

          setTimeout(() => {
            this.data.disableBtn = false
            this.data.error = false
            this.data.count = 0
          }, 300000)
          this.timer()
          this.data.errorMsg = 'Acceso Bloqueado';
          return
        } else {
          this.data.error = true
          setTimeout(() => {
            this.data.error = false
          }, 1500)
          this.data.errorMsg = result.msg;
          this.data.loading = false;
        }
      } else {
        this.data.error = true
          setTimeout(() => {
            this.data.error = false
          }, 1500)
          this.data.errorMsg = 'No se pude acceder al sistema.';
          this.data.loading = false;
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

#cont {
  width: 100%;
  height: 100vh;
  font-family: Poppins;
  /* position: relative; */
}

.v-app-bar {
  background-color: transparent !important;
}

div.v-toolbar__content {
  height: 80px !important; /* Ajusta el valor según lo que necesites */
}

#cont-form {
  width: 100%;
  height: 100%;
}

#card-form {
  width: 380px;
}

/* #title {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#logo-form {
  width: 400px;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
}
 */

#title {
  font-weight: 500;
}

#text-logo {
  color: #08529D;
}

#btn-ac {
  background-color: #08529D;
}

@keyframes visibleLogo {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bg-logo {
  animation: visibleLogo 1s ease-in-out forwards;
  width: 600px;
  position: absolute;
  top: 59%;
  left: 10%;
  transform: translate(-50%, -50%) rotate(360deg);
  transform-origin: center;
}

@media screen and (max-width: 600px) {
  /* .bg-logo{
     width: 600px;
     left: -60%;
  } */
}
</style>