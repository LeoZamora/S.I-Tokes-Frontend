import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: !!localStorage.getItem("token"),
        // isLoggedIn: true,
        theme: ref(localStorage.getItem('theme') || 'dark'),
    }),
    actions: {
        login(decodeToken, rawToken = null) {
            const token = JSON.stringify(decodeToken)
            localStorage.setItem("token", token);
            if (rawToken) {
                localStorage.setItem("authToken", rawToken);
            }
            this.isLoggedIn = true;
        },
        getInfoUser() {
            return JSON.parse(localStorage.getItem("token"))
        },
        getRawToken() {
            return localStorage.getItem("authToken") || localStorage.getItem("raw_token")
        },
        sendExp(exp) {
            localStorage.setItem('exp', exp)
        },
        deleteSession(exp) {
            const now = Date.now()

            if ((now / 1000) >= Number(exp)) {
                this.logout()
                localStorage.removeItem('exp')
                return console.log('Sesión expirada');
            } else {
                return console.log('Sesión activa');
            }
        },
        getExp() {
            return localStorage.getItem('exp')
        },
        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("authToken");
            localStorage.removeItem("raw_token");
            localStorage.removeItem("rol");
            localStorage.removeItem("name");
            localStorage.removeItem('exp');
            sessionStorage.removeItem('lastRoute')
            this.isLoggedIn = false;
        },
        sendRolUser(rol) {
            localStorage.setItem("rol", rol)
        },
        getRolUser() {
            return localStorage.getItem("rol")
        },
        sendNameUser(name) {
            localStorage.setItem('name', name)
        },
        getNameUser() {
            return localStorage.getItem('name')
        },
    },
    getters: {
        getIsLoggedIn: (state) => state.isLoggedIn
    },
});