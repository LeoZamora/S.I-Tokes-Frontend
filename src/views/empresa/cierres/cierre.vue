<template>
  <div>
    <!--WIN1: PRINCIPAL-->
    <v-card v-if="!display.nuevoCierre">
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <!-- Título -->
          <div class="text-h6 font-weight-bold d-flex align-center">
            <v-icon class="me-2" color="primary">mdi-finance</v-icon>
            Cierres de Mes
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn class="bg-primary rounded-" @click="openRegistrarDisplay">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="left">Nuevo cierre</v-tooltip>
        </v-btn>
      </template>

      <v-card-text>
        <v-data-table
            :headers="tbl.headers"
        >

        </v-data-table>
      </v-card-text>
    </v-card>

    <!--WIN2: NUEVO CIERRE-->
    <nuevo-cierre v-if="display.nuevoCierre" @close="closeRegistrarDisplay"></nuevo-cierre>
  </div>
</template>

<script>
import nuevoCierre from "@/views/empresa/cierres/components/nuevo-cierre.vue";
export default {
  components: {
    nuevoCierre
  },

  data(){
    return {
      display: {
        nuevoCierre: false,
      },

      tbl: {
        headers: [
          {
            title: 'Opciones',
            key: 'opc',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Desde',
            key: 'desde',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Hasta',
            key: 'hasta',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Ventas',
            key: 'ventas',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Ingresos Adicionales',
            key: 'ingresosAdicionales',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Total Ingresos',
            key: 'ingresosTotales',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Costos de Ventas',
            key: 'costoVentas',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Gastos Adicionales',
            key: 'gastosAdicionales',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Total Egresos',
            key: 'egresosTotales',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Utilidad',
            key: 'utilidad',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Proporción de Utilidad',
            key: 'proporcionUtilidad',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
        ]
      }
    }
  },

  methods: {
    openRegistrarDisplay(){
      this.display.nuevoCierre = true
    },

    closeRegistrarDisplay(){
      this.display.nuevoCierre = false
    }
  }
}
</script>

<style scoped>

</style>