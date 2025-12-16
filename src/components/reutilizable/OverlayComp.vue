<template>
    <v-overlay v-model="showOverlay" max-width="100%" max-height="100%" 
        class="d-flex justify-center align-center" contained persistent>
        <div class="d-flex flex-column justify-center align-center">
            <v-progress-circular
                indeterminate
                size="64"
                width="6"
                color="white"
            ></v-progress-circular>

            <span class="mt-4">
                <strong class="text-white">
                    Cargando... 
                </strong>
            </span>
        </div>
    </v-overlay>
</template>

<script>
import { ref, watch } from 'vue';

export default {
    name: 'OverlayComp',

    props: {
        show: {
            type: Boolean,
            required: true 
        }
    },

    setup(props) {
        const showOverlay = ref(props.show)
        watch(() => props.show, (val) => {
            showOverlay.value = val
        })

        return {
            showOverlay
        }
    }
}
</script>