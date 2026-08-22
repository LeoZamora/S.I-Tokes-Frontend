<template>
  <div class="w-100 pa-4 min-vh-100">
    <!-- ENCABEZADO PRINCIPAL DEL WORKSPACE (OPCIONAL) -->
    <!--<v-card class="mb-4 rounded-lg border elevation-1" color="indigo-darken-4 text-white">
      <div class="pa-4 d-flex align-center justify-space-between flex-wrap ga-3">
        <div class="d-flex align-center">
          <v-avatar color="white" class="me-3 shadow-sm" size="48" variant="flat">
            <v-icon color="indigo-darken-4" size="28">mdi-view-dashboard-variant</v-icon>
          </v-avatar>
          <div>
            <h1 class="text-h5 font-weight-bold mb-0 text-white">
              Workspace de Pedidos
            </h1>
            <div class="text-body-2 text-indigo-lighten-4">
              Control integral del ciclo de vida: Recepción ➔ Despacho ➔ Entrega ➔ Devolución
            </div>
          </div>
        </div>

        <div class="d-flex align-center ga-2">
          <v-chip color="amber-lighten-3" class="font-weight-bold text-indigo-darken-4" prepend-icon="mdi-timeline-text-outline">
            Ciclo de Vida Activo
          </v-chip>
        </div>
      </div>
    </v-card>-->

    <!-- BARRA DE PESTAÑAS DEL WORKSPACE -->
    <v-card class="mb-2 border rounded-lg bg-white" elevation="0">
      <v-tabs v-model="activeStage" color="indigo-darken-4" align-tabs="center" grow class="border-b">
        <v-tab :value="1" class="text-none py-3">
          <v-icon size="20" color="indigo" class="me-2">mdi-receipt-text-clock</v-icon>
          <span class="font-weight-bold">1. Recepción de Pedidos</span>
        </v-tab>
        <v-tab :value="2" class="text-none py-3">
          <v-icon size="20" color="amber-darken-3" class="me-2">mdi-truck-fast</v-icon>
          <span class="font-weight-bold">2. Despacho de Pedidos</span>
        </v-tab>
        <v-tab :value="3" class="text-none py-3">
          <v-icon size="20" color="green-darken-3" class="me-2">mdi-package-variant-closed-check</v-icon>
          <span class="font-weight-bold">3. Entrega de Pedidos</span>
        </v-tab>
        <v-tab :value="4" class="text-none py-3">
          <v-icon size="20" color="deep-orange-darken-3" class="me-2">mdi-keyboard-return</v-icon>
          <span class="font-weight-bold">4. Devolución de Pedidos</span>
        </v-tab>
      </v-tabs>
    </v-card>

    <!-- ÁREA DE COMPONENTES DEL WORKSPACE -->
    <v-window v-model="activeStage">
      <!-- VISTA 1: RECEPCIÓN (PedidosComp) -->
      <v-window-item :value="1">
        <v-card class="border rounded-lg bg-white" elevation="0">
          <PedidosComp />
        </v-card>
      </v-window-item>

      <!-- VISTA 2: DESPACHO (DespachoPedidosComp) -->
      <v-window-item :value="2">
        <v-card class="border rounded-lg bg-white" elevation="0">
          <DespachoPedidosComp />
        </v-card>
      </v-window-item>

      <!-- VISTA 3: ENTREGA (EntregaPedidosComp) -->
      <v-window-item :value="3">
        <v-card class="border rounded-lg bg-white" elevation="0">
          <EntregaPedidosComp />
        </v-card>
      </v-window-item>

      <!-- VISTA 4: DEVOLUCIÓN (DevolucionPedidosComp) -->
      <v-window-item :value="4">
        <v-card class="border rounded-lg bg-white" elevation="0">
          <DevolucionPedidosComp />
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import PedidosComp from '@/components/movimientos/Ventas/PedidosComp.vue'
import DespachoPedidosComp from '@/components/movimientos/Ventas/DespachoPedidosComp.vue'
import EntregaPedidosComp from '@/components/movimientos/Ventas/EntregaPedidosComp.vue'
import DevolucionPedidosComp from '@/components/movimientos/Ventas/DevolucionPedidosComp.vue'

export default {
  name: 'WorkspacePedidosComp',

  components: {
    PedidosComp,
    DespachoPedidosComp,
    EntregaPedidosComp,
    DevolucionPedidosComp
  },

  data() {
    return {
      activeStage: 1
    }
  },

  mounted() {
    if (this.$route.query && this.$route.query.stage) {
      const stageMap = { recepcion: 1, despacho: 2, entrega: 3, devolucion: 4 }
      if (stageMap[this.$route.query.stage]) {
        this.activeStage = stageMap[this.$route.query.stage]
      }
    }
  }
}
</script>

<style scoped>
.transition-all {
  transition: all 0.25s ease-in-out;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
