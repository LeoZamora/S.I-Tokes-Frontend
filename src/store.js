import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: !!localStorage.getItem("token"),
        // isLoggedIn: true,
        theme: ref(localStorage.getItem('theme') || 'dark'),
    }),
    actions: {
        login(decodeToken) {
            const token = JSON.stringify(decodeToken)
            localStorage.setItem("token", token);
            this.isLoggedIn = true;
        },
        getInfoUser() {
            return JSON.parse(localStorage.getItem("token"))
        },
        logout() {
            localStorage.removeItem("token");
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