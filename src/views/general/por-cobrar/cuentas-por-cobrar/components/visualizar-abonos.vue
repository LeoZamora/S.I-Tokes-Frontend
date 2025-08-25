<template>
  <v-card>
    <v-card-title>{{ `Abonos a cuenta (Factura N° ${credito.noVenta})` }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
          :headers="tbl.headers"
          :items="tbl.items"
          hide-default-footer
      >
        <template v-slot:item="{ item }">
          <tr>
            <td
                v-for="header in tbl.headers.filter(c => !c.opciones)"
                :key="header.key"
                :class="[
                    header.align === 'center' && 'text-center',
                    header.align === 'end' && 'text-right',
                    header.align === 'start' && 'text-left'
                  ]"
                style="border: 1px solid #e0e0e0"
            >
                <span v-if="header.format === 'currency'">
                  {{ formatedCurrency(item[header.key]) }}
                </span>
              <span v-else-if="header.format === 'date'">
                  {{ formatedDate(item[header.key]) }}
                </span>
              <span v-else>
                  {{ `${header.format}${item[header.key]}` }}
                </span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn @click="close" color="secondary" variant="outlined">Cerrar</v-btn>
      <v-btn @click="close" color="primary" variant="flat">Ok</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {httpGet} from "@/scripts/api.js";
import {useLoading} from "@/composables/use-loading.js";
import {useSnackbar} from "@/composables/use-snackbar.js";
import {formatters} from "@/helpers/formatters.js";
export default {
  name: 'visualizar-abonos',

  props: {
    credito: {
      type: Object,
      required: true,
    }
  },

  data(){
    return{
      snackbar: useSnackbar(),
      loading: useLoading(),

      tbl: {
        headers: [
          /*{
            title: 'Opciones',
            key: 'opc',
            align: 'center',
            opciones: true,
            sortable: false,
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },*/
          {
            title: 'Modalidad',
            key: 'modalidad',
            format: '',
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
            title: 'N° Referencia',
            key: 'numReferencia',
            align: 'center',
            format: '',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Fecha Movimiento',
            key: 'fechaMovimiento',
            format: 'date',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
              style: 'min-width: 150px;'
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Monto',
            key: 'monto',
            format: 'currency',
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
            title: 'Observaciones',
            key: 'observaciones',
            format: '',
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
            title: 'Fecha Registro',
            key: 'fechaRegistro',
            format: 'date',
            align: 'center',
            headerProps: {
              class: 'pa-1',
              style: 'min-width: 150px;'
            },
            cellProps: {
              class: 'pa-1',
            }
          },
          {
            title: 'Usuario Registro',
            key: 'usuarioRegistro',
            format: '',
            align: 'center',
            width: 1,
            headerProps: {
              class: 'pa-1',
            },
            cellProps: {
              class: 'pa-1',
            }
          }
        ],
        items: [],
      },
    }
  },

  methods: {
    async loadTblAbonos(){
      this.loading.load(true)
      const abonos = await httpGet(`api/creditos/${this.credito.idDetalleCxc}/abonos`)
      this.tbl.items = abonos
      this.loading.load(false)
    },

    //FORMATERS
    formatedDate(dateString) {
      const value = formatters.formatDate(dateString)
      return value
    },

    formatedCurrency(key) {
      const value = formatters.formatCurrency(key)
      return value
    },

    close(){
      this.$emit('close')
    }
  },

  mounted() {
    this.loadTblAbonos()
  }
}
</script>

<style scoped>

</style>