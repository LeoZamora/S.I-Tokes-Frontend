<template>
  <v-dialog v-model="localShow" max-width="950" persistent>
    <v-card class="rounded-xl overflow-hidden invoice-preview-card" elevation="16">
      <!-- Header con gradiente profesional y badges de estado -->
      <div class="invoice-header px-6 py-4 d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-avatar size="44" color="white" class="mr-3 elevation-2">
            <v-icon color="indigo-darken-4" size="24">mdi-receipt-text-outline</v-icon>
          </v-avatar>
          <div>
            <div class="d-flex align-center gap-2">
              <span class="text-h6 font-weight-bold text-white mr-2">DETALLE DE FACTURA</span>
              <v-chip
                size="small"
                color="white"
                variant="flat"
                class="text-indigo-darken-4 font-weight-black"
              >
                {{ data.venta.noVenta || 'N/A' }}
              </v-chip>
            </div>
            <div class="text-caption text-indigo-lighten-4 mt-1">
              Registro del sistema de facturación y movimientos
            </div>
          </div>
        </div>

        <div class="d-flex align-center">
          <v-chip
            size="small"
            :color="data.editVenta.estado !== false ? 'success' : 'error'"
            variant="flat"
            class="font-weight-bold mr-2 text-uppercase"
          >
            <v-icon start size="14">
              {{ data.editVenta.estado !== false ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
            {{ data.editVenta.estado !== false ? 'Activa' : 'Anulada' }}
          </v-chip>

          <v-chip
            size="small"
            :color="data.venta.credito ? 'amber-darken-4' : 'blue-grey-darken-3'"
            variant="flat"
            class="font-weight-bold mr-3"
          >
            <v-icon start size="14">
              {{ data.venta.credito ? 'mdi-clock-outline' : 'mdi-cash' }}
            </v-icon>
            {{ data.venta.credito ? 'Crédito' : 'Contado' }}
          </v-chip>

          <v-btn
            icon
            color="white"
            variant="text"
            size="small"
            @click="closeDialog()"
            class="close-btn"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Contenido de la Factura -->
      <v-card-text class="pa-5 bg-grey-lighten-5">
        <!-- Bloque de Información General -->
        <v-card variant="flat" class="pa-4 rounded-lg border bg-white mb-4" elevation="0">
          <v-row dense>
            <v-col cols="12" sm="4">
              <div class="d-flex align-center mb-1">
                <v-icon size="16" color="indigo" class="mr-1">mdi-account</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">CLIENTE</span>
              </div>
              <div class="text-body-2 font-weight-bold text-grey-darken-4">
                {{ data.venta.cliente || 'Consumidor Final' }}
              </div>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="d-flex align-center mb-1">
                <v-icon size="16" color="indigo" class="mr-1">mdi-calendar-clock</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">FECHA Y HORA</span>
              </div>
              <div class="text-body-2 font-weight-medium text-grey-darken-4">
                {{ formateDate(data.editVenta.fechaRegistro) }}
              </div>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="d-flex align-center mb-1">
                <v-icon size="16" color="indigo" class="mr-1">mdi-account-check</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">REGISTRADO POR</span>
              </div>
              <div class="text-body-2 font-weight-medium text-grey-darken-4">
                {{ data.venta.usuarioRegistro || 'N/A' }}
              </div>
            </v-col>

            <v-divider class="my-3 w-100" />

            <v-col cols="12" sm="4">
              <div class="d-flex align-center mb-1">
                <v-icon size="16" color="indigo" class="mr-1">mdi-format-list-bulleted</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">TIPO DE VENTA</span>
              </div>
              <div class="text-body-2 font-weight-medium text-grey-darken-4">
                {{ data.venta.tipoVenta || 'Venta General' }}
              </div>
            </v-col>

            <v-col cols="12" sm="8">
              <div class="d-flex align-center mb-1">
                <v-icon size="16" color="indigo" class="mr-1">mdi-map-marker-outline</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">DIRECCIÓN / UBICACIÓN</span>
              </div>
              <div class="text-body-2 font-weight-medium text-grey-darken-4">
                {{ data.venta.enviarA || data.venta.ubicacion || 'Entregado en sucursal' }}
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Tabla de Productos con Impuestos y Precios Mayoristas -->
        <v-card variant="flat" class="rounded-lg border bg-white mb-4 overflow-hidden" elevation="0">
          <div class="table-header-banner px-4 py-2 d-flex align-center justify-space-between bg-indigo-lighten-5 border-b">
            <div class="d-flex align-center">
              <v-icon size="18" color="indigo-darken-3" class="mr-2">mdi-package-variant-closed</v-icon>
              <span class="text-caption font-weight-bold text-indigo-darken-4 text-uppercase">Detalle de Productos en la Factura</span>
            </div>
            <v-chip size="x-small" color="indigo-darken-3" variant="flat" class="font-weight-bold">
              {{ data.items.length }} {{ data.items.length === 1 ? 'ítem' : 'ítems' }}
            </v-chip>
          </div>

          <v-table density="compact" hover class="invoice-items-table">
            <thead>
              <tr class="bg-grey-lighten-4">
                <th class="text-left text-caption font-weight-bold text-grey-darken-3" style="width: 40px;">#</th>
                <th class="text-left text-caption font-weight-bold text-grey-darken-3">Producto</th>
                <th class="text-center text-caption font-weight-bold text-grey-darken-3" style="width: 100px;">Cantidad</th>
                <th class="text-right text-caption font-weight-bold text-grey-darken-3" style="width: 130px;">Precio Unit.</th>
                <th class="text-right text-caption font-weight-bold text-grey-darken-3" style="width: 140px;">Impuesto (IVA)</th>
                <th class="text-right text-caption font-weight-bold text-grey-darken-3" style="width: 140px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="data.items.length === 0">
                <td colspan="6" class="text-center py-6 text-grey text-caption">
                  No hay productos registrados en esta factura
                </td>
              </tr>
              <tr v-for="(item, index) in data.items" :key="index">
                <td class="text-left text-caption text-grey-darken-1 font-weight-medium">
                  {{ index + 1 }}
                </td>
                <td class="text-left py-2">
                  <div class="font-weight-bold text-body-2 text-grey-darken-4">
                    {{ item.producto }}
                  </div>
                  <div class="d-flex align-center flex-wrap gap-1 mt-1">
                    <span v-if="item.codigo" class="text-caption text-grey-darken-1 mr-2">
                      Cód: {{ item.codigo }}
                    </span>
                    <v-chip
                      v-if="item.esMayorista"
                      size="x-small"
                      color="orange-darken-4"
                      variant="flat"
                      class="font-weight-bold"
                    >
                      <v-icon size="11" class="mr-1">mdi-tag-outline</v-icon>
                      Mayorista {{ item.rangoMayorista }}
                    </v-chip>
                  </div>
                  <div v-if="item.observaciones" class="text-caption text-grey-darken-2 font-italic mt-1">
                    Obs: {{ item.observaciones }}
                  </div>
                </td>
                <td class="text-center">
                  <v-chip size="x-small" color="grey-lighten-3" variant="flat" class="font-weight-bold text-grey-darken-4">
                    {{ formatQty(item.cantidad) }}
                  </v-chip>
                </td>
                <td class="text-right text-body-2 font-weight-medium text-grey-darken-3">
                  {{ formatedCurrency(item.costoUnitario, data.fomates.nio) }}
                </td>
                <td class="text-right text-body-2">
                  <div v-if="item.montoImpuesto > 0" class="text-indigo-darken-3 font-weight-medium">
                    {{ formatedCurrency(item.montoImpuesto, data.fomates.nio) }}
                    <small class="text-grey-darken-1 d-block font-weight-bold">
                      (+{{ item.porcentajeImpuesto }}%)
                    </small>
                  </div>
                  <span v-else class="text-caption text-grey font-weight-medium">
                    Exento
                  </span>
                </td>
                <td class="text-right text-body-2 font-weight-bold text-indigo-darken-4">
                  {{ formatedCurrency(item.subTotal, data.fomates.nio) }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- Bloque de Resumen Financiero y Observaciones -->
        <v-row dense>
          <!-- Observaciones de la Venta -->
          <v-col cols="12" md="6">
            <v-card variant="flat" class="pa-4 rounded-lg border bg-white h-100 d-flex flex-column" elevation="0">
              <div class="d-flex align-center mb-2">
                <v-icon size="16" color="indigo" class="mr-1">mdi-comment-text-outline</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">OBSERVACIONES DE LA FACTURA</span>
              </div>
              <div class="pa-3 bg-grey-lighten-4 rounded text-body-2 text-grey-darken-3 min-h-obs flex-grow-1">
                {{ data.venta.observaciones || 'Sin observaciones registradas.' }}
              </div>
            </v-card>
          </v-col>

          <!-- Resumen de Totales e Impuestos idéntico a NuevaFactura -->
          <v-col cols="12" md="6">
            <v-card variant="flat" class="pa-4 rounded-lg border bg-white h-100 d-flex flex-column justify-space-between" elevation="0">
              <div class="d-flex align-center mb-3">
                <v-icon size="16" color="indigo" class="mr-1">mdi-calculator</v-icon>
                <span class="text-caption font-weight-bold text-grey-darken-2">RESUMEN FINANCIERO</span>
              </div>

              <div class="financial-breakdown bg-indigo-lighten-5 pa-3 rounded-lg border border-indigo-lighten-4">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-caption text-grey-darken-2 font-weight-medium">Sub Total (Neto):</span>
                  <span class="text-body-2 font-weight-bold text-grey-darken-3">
                    {{ formatedCurrency(data.factura.subTotal, data.fomates.nio) }}
                  </span>
                </div>

                <div v-if="data.factura.totalImpuestos > 0" class="d-flex justify-space-between align-center mb-2 text-indigo-darken-3">
                  <span class="text-caption font-weight-medium">Impuestos (IVA):</span>
                  <span class="text-body-2 font-weight-bold">
                    {{ formatedCurrency(data.factura.totalImpuestos, data.fomates.nio) }}
                  </span>
                </div>

                <v-divider class="my-2 border-indigo-lighten-3" />

                <div class="d-flex justify-space-between align-center pa-2 rounded-lg bg-indigo-darken-3 text-white">
                  <span class="text-body-2 font-weight-bold text-uppercase">TOTAL GENERAL</span>
                  <span class="text-h6 font-weight-black">
                    {{ formatedCurrency(data.factura.total, data.fomates.nio) }}
                  </span>
                </div>

                <div class="d-flex justify-space-between align-center mt-2 px-1 text-caption text-grey-darken-2">
                  <span>Equivalente en USD (T/C 36.6243):</span>
                  <span class="font-weight-bold text-grey-darken-4">
                    {{ formatedCurrency(data.factura.usdTotal, data.fomates.usd) }}
                  </span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Footer de Acciones -->
      <v-divider />
      <v-card-actions class="pa-4 bg-white d-flex align-center justify-space-between">
        <v-btn
          color="grey-darken-2"
          variant="tonal"
          @click="closeDialog()"
          class="px-5 font-weight-bold text-none"
        >
          <v-icon start size="18">mdi-arrow-left</v-icon>
          Cerrar
        </v-btn>

        <div class="d-flex align-center gap-2">
          <v-btn
            color="indigo-darken-3"
            variant="flat"
            @click="exportDialogToPDF()"
            class="px-5 font-weight-bold text-none elevation-2"
          >
            <v-icon start size="18">mdi-file-pdf-box</v-icon>
            Descargar PDF
          </v-btn>
        </div>
      </v-card-actions>

      <OverlayComp :show="data.overlay.show" />
    </v-card>
  </v-dialog>
</template>

<script>
import OverlayComp from '@/components/reutilizable/OverlayComp.vue'
import { formatters } from '@/helpers/formatters'
import RequestHttp from '@/services/requestHttp'
import { reactive, ref, watch } from 'vue'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    factura: {
      type: [Object, Number, String],
      required: false,
      default: () => ({})
    }
  },

  components: {
    OverlayComp
  },

  setup(props, { emit }) {
    const localShow = ref(props.show)

    const data = reactive({
      headers: [
        { title: 'Producto', key: 'producto', align: 'left' },
        { title: 'Cantidad', key: 'cantidad', align: 'center' },
        { title: 'Precio Unit.', key: 'costoUnitario', align: 'right' },
        { title: 'Impuesto (IVA)', key: 'impuesto', align: 'right' },
        { title: 'SubTotal', key: 'subTotal', align: 'right' }
      ],
      items: [],
      productos: [],
      factura: {
        subTotal: 0.0,
        totalImpuestos: 0.0,
        total: 0.0,
        usdTotal: 0.0
      },
      venta: {
        noVenta: null,
        idCliente: null,
        credito: false,
        cliente: null,
        observaciones: null,
        enviarA: null,
        ubicacion: null,
        tipoVenta: null,
        usuarioRegistro: null,
        detalleVenta: []
      },
      editVenta: {
        idVenta: null,
        fechaRegistro: null,
        estado: true,
        idClienteNavigation: null,
        detalleCxcs: []
      },
      overlay: {
        show: false
      },
      fomates: {
        nio: 'NIO',
        usd: 'USD'
      },
      requestHttp: new RequestHttp()
    })

    const calcularFactura = () => {
      let subtotal = 0
      let totalImpuestos = 0
      data.factura.subTotal = 0.0
      data.factura.totalImpuestos = 0.0
      data.factura.total = 0.0
      data.factura.usdTotal = 0.0

      data.items.forEach((item) => {
        const lineSubtotal = (Number(item.costoUnitario) || 0) * (Number(item.cantidad) || 0)
        item.subTotal = lineSubtotal
        subtotal += lineSubtotal
        if (item.montoImpuesto) {
          totalImpuestos += Number(item.montoImpuesto) || 0
        }
      })

      data.factura.subTotal = subtotal
      data.factura.totalImpuestos = totalImpuestos
      data.factura.total = subtotal + totalImpuestos
      data.factura.usdTotal = data.factura.total / 36.6243
    }

    const cargarDetalleFactura = async (facturaParam) => {
      if (!facturaParam) return

      let idVenta = null
      if (typeof facturaParam === 'number' || typeof facturaParam === 'string') {
        idVenta = facturaParam
      } else if (typeof facturaParam === 'object') {
        idVenta = facturaParam.idVenta || facturaParam.raw?.idVenta || facturaParam.id || facturaParam.raw?.id || null
      }

      if (!idVenta) return

      data.overlay.show = true
      data.items = []
      data.factura.subTotal = 0.0
      data.factura.totalImpuestos = 0.0
      data.factura.total = 0.0
      data.factura.usdTotal = 0.0

      try {
        let prodPromise = null
        if (!data.productos || data.productos.length === 0) {
          prodPromise = data.requestHttp.getProductosDetalleVenta()
        }

        const [result, prodRes] = await Promise.all([
          data.requestHttp.getByIdVenta(idVenta),
          prodPromise ? prodPromise : Promise.resolve(null)
        ])

        if (prodRes && prodRes.code === 200 && Array.isArray(prodRes.data)) {
          data.productos = prodRes.data
        }

        if (result && result.code === 200 && result.data) {
          const ventaData = result.data

          // Mapear cabecera de venta
          data.venta.noVenta = ventaData.noVenta
          data.venta.cliente =
            ventaData.cliente ||
            ventaData.nombreCliente ||
            ventaData.idClienteNavigation?.nombre ||
            'Consumidor Final'
          data.venta.credito = !!ventaData.credito
          data.venta.enviarA = ventaData.enviarA
          data.venta.ubicacion = ventaData.ubicacion
          data.venta.tipoVenta =
            ventaData.tipoVenta ||
            ventaData.idTipoVentaNavigation?.nombre ||
            'Venta General'
          data.venta.idCliente = ventaData.idCliente
          data.venta.observaciones = ventaData.observaciones
          data.venta.usuarioRegistro = ventaData.usuarioRegistro

          data.editVenta.idVenta = ventaData.idVenta
          data.editVenta.estado = ventaData.estado !== false
          data.editVenta.fechaRegistro = ventaData.fechaRegistro

          // Mapear líneas de producto utilizando el catálogo de productos con impuestos/mayoristas
          const detalles = ventaData.detalleVenta || []
          const catalogo = data.productos || []

          const resolvedItems = detalles.map((item) => {
            const prod = catalogo.find((p) => p.idProducto === item.idProducto) || item.idProductoNavigation || null
            const productName = prod?.nombre || item.producto || item.idProductoNavigation?.nombre || `Producto #${item.idProducto}`
            const productCode = prod?.codigo || item.codigo || item.idProductoNavigation?.codigo || ''

            const qty = Number(item.cantidad) || 0
            const unitCost = Number(item.precioUnitario || item.costoUnitario) || 0
            const lineSubtotal = qty * unitCost

            // Evaluación de Precios Mayoristas
            let esMayoristaAplicado = false
            let rangoMayoristaText = ''
            if (prod?.esMayorista && prod?.preciosMayoristas && prod.preciosMayoristas.length > 0) {
              const matchingRange = prod.preciosMayoristas.find(
                (pm) => qty >= pm.minimo && (pm.rangoIndefinido || qty <= pm.maximo)
              )
              if (matchingRange) {
                esMayoristaAplicado = true
                rangoMayoristaText = `(${matchingRange.minimo}${matchingRange.maximo ? ' - ' + matchingRange.maximo : ' o más'})`
              }
            }

            // Evaluación y Cálculo de Impuestos aplicables a la venta
            const rawImpuestos = prod?.impuestos || item.impuestos || item.idProductoNavigation?.impuestos || []
            const impuestosVenta = rawImpuestos.filter((i) => i.esAplicadoVenta)
            const porcentajeImpuestoTotal = impuestosVenta.reduce(
              (acc, imp) => acc + (Number(imp.valorPorcentual) || 0),
              0
            )

            const montoImpuesto = lineSubtotal * (porcentajeImpuestoTotal / 100)

            return {
              idDetalleVenta: item.idDetalleVenta,
              idVenta: item.idVenta,
              idProducto: item.idProducto,
              codigo: productCode,
              producto: productName,
              cantidad: qty,
              costoUnitario: unitCost,
              observaciones: item.observaciones,
              esMayorista: esMayoristaAplicado,
              rangoMayorista: rangoMayoristaText,
              subTotal: lineSubtotal,
              montoImpuesto: montoImpuesto,
              porcentajeImpuesto: porcentajeImpuestoTotal
            }
          })

          data.items = resolvedItems
          calcularFactura()
        }
      } catch (error) {
        console.error('Error al cargar la venta:', error)
      } finally {
        data.overlay.show = false
      }
    }

    watch(
      () => props.factura,
      (newVal) => {
        if (newVal) {
          cargarDetalleFactura(newVal)
        }
      },
      { immediate: true, deep: true }
    )

    watch(
      () => props.show,
      (val) => {
        localShow.value = val
        if (val && props.factura) {
          cargarDetalleFactura(props.factura)
        }
      }
    )

    return {
      localShow,
      data,
      cargarDetalleFactura
    }
  },

  methods: {
    formatedCurrency(key, currency) {
      return formatters.formatCurrency(key, currency || 'NIO')
    },

    formateDate(dateString) {
      if (!dateString) return 'N/A'
      return formatters.formatDate(dateString)
    },

    formatQty(qty) {
      const num = Number(qty) || 0
      return num % 1 === 0 ? num.toString() : num.toFixed(4).replace(/0+$/, '')
    },

    closeDialog() {
      this.$emit('closeDialog', false)
      this.localShow = false
    },

    exportDialogToPDF() {
      if (!this.data.items || this.data.items.length === 0) {
        alert('No hay datos para exportar.')
        return
      }

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()

      const primaryColor = [26, 35, 126] // Indigo oscuro
      const secondaryColor = [220, 53, 69]
      const accentColor = [41, 128, 185]
      const lightGray = [245, 247, 250]
      const darkGray = [52, 58, 64]

      // Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.rect(0, 0, pageWidth, 24, 'F')

      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text('FACTURA DE VENTA', 15, 16)

      doc.setFontSize(12)
      doc.text(`Nº: ${this.data.venta.noVenta || 'N/A'}`, pageWidth - 15, 16, { align: 'right' })

      let currentY = 34

      // Info Empresa & Info Cliente
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.text('INFORMACIÓN DE LA VENTA:', 15, currentY)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])

      const infoLines = [
        `Cliente: ${this.data.venta.cliente || 'Consumidor Final'}`,
        `Condición de Pago: ${this.data.venta.credito ? 'Crédito' : 'Contado'}`,
        `Fecha de Emisión: ${this.formateDate(this.data.editVenta.fechaRegistro)}`,
        `Registrado por: ${this.data.venta.usuarioRegistro || 'N/A'}`,
        `Dirección / Ubicación: ${this.data.venta.enviarA || this.data.venta.ubicacion || 'Sucursal'}`
      ]

      infoLines.forEach((line, index) => {
        doc.text(line, 15, currentY + 6 + index * 5)
      })

      currentY += infoLines.length * 5 + 12

      // Línea divisoria
      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
      doc.setLineWidth(0.5)
      doc.line(15, currentY, pageWidth - 15, currentY)
      currentY += 8

      // Tabla de ítems con columna de impuesto
      const headers = [['#', 'Producto', 'Cantidad', 'Precio Unit.', 'Impuesto (IVA)', 'Subtotal']]
      const filas = this.data.items.map((item, idx) => [
        (idx + 1).toString(),
        `${item.codigo ? item.codigo + ' - ' : ''}${item.producto}${item.esMayorista ? ' (Mayorista ' + item.rangoMayorista + ')' : ''}`,
        this.formatQty(item.cantidad),
        this.formatedCurrency(item.costoUnitario, this.data.fomates.nio),
        item.montoImpuesto > 0
          ? `${this.formatedCurrency(item.montoImpuesto, this.data.fomates.nio)} (+${item.porcentajeImpuesto}%)`
          : 'Exento',
        this.formatedCurrency(item.subTotal, this.data.fomates.nio)
      ])

      doc.autoTable({
        startY: currentY,
        head: headers,
        body: filas,
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor,
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 8.5,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 'auto', halign: 'left' },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 28, halign: 'right' },
          4: { cellWidth: 32, halign: 'right' },
          5: { cellWidth: 32, halign: 'right' }
        },
        margin: { left: 15, right: 15 },
        didDrawPage: (dataObj) => {
          currentY = dataObj.cursor.y + 10
        }
      })

      // Totales
      currentY = doc.lastAutoTable.finalY + 8

      const totalBoxHeight = this.data.factura.totalImpuestos > 0 ? 35 : 28
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
      doc.rect(pageWidth - 100, currentY, 85, totalBoxHeight, 'F')
      doc.setDrawColor(200, 200, 200)
      doc.rect(pageWidth - 100, currentY, 85, totalBoxHeight)

      let totalLineY = currentY + 7
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
      doc.text('Sub Total (Neto):', pageWidth - 95, totalLineY)
      doc.text(this.formatedCurrency(this.data.factura.subTotal, this.data.fomates.nio), pageWidth - 18, totalLineY, { align: 'right' })

      if (this.data.factura.totalImpuestos > 0) {
        totalLineY += 6
        doc.text('Impuestos (IVA):', pageWidth - 95, totalLineY)
        doc.text(this.formatedCurrency(this.data.factura.totalImpuestos, this.data.fomates.nio), pageWidth - 18, totalLineY, { align: 'right' })
      }

      totalLineY += 8
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.text('TOTAL GENERAL:', pageWidth - 95, totalLineY)
      doc.text(this.formatedCurrency(this.data.factura.total, this.data.fomates.nio), pageWidth - 18, totalLineY, { align: 'right' })

      totalLineY += 6
      doc.setFontSize(8.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(`USD: ${this.formatedCurrency(this.data.factura.usdTotal, this.data.fomates.usd)}`, pageWidth - 95, totalLineY)

      // Observaciones
      if (this.data.venta.observaciones) {
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text('OBSERVACIONES:', 15, currentY + 5)

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
        const obsLines = doc.splitTextToSize(this.data.venta.observaciones, pageWidth - 125)
        doc.text(obsLines, 15, currentY + 11)
      }

      doc.save(`Factura_${this.data.venta.noVenta || 'Venta'}.pdf`)
    }
  }
}
</script>

<style scoped>
.invoice-preview-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.invoice-header {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
}

.invoice-items-table {
  background-color: #ffffff;
}

.invoice-items-table th {
  font-size: 0.75rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.min-h-obs {
  min-height: 80px;
}

.financial-breakdown {
  width: 100%;
}
</style>