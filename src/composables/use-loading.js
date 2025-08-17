import { reactive } from "vue"

const loading = reactive({
    show: false,
})

function load(value) {
    loading.show = value
}

export function useLoading() {
    return {
        loading,
        load
    }
}