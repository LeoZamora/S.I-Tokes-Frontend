import { reactive } from "vue"

const snackbar = reactive({
    show: false,
    text: "",
    icon: "mdi-information-symbol",
    color: "primary",
    timeout: 3000
})

const typeColors = {
    success: "green",
    error: "red",
    warn: '#FFCA28',
    info: "blue",
    default: "primary"
}

const typeIcons = {
    success: "mdi-check",
    error: "mdi-alert-circle",
    warn: "mdi-alert",
    info: "mdi-information-symbol",
    default: "mdi-information-symbol"
}

function notify(type = "default", text = "", timeout = 3000) {
    snackbar.text = text
    snackbar.color = typeColors[type] || typeColors.default
    snackbar.timeout = timeout
    snackbar.icon = typeIcons[type] || typeIcons.default
    snackbar.show = true
}

export function useSnackbar() {
    return {
        snackbar,
        notify
    }
}