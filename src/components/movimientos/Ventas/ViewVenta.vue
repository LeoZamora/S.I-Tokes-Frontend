<template>
    <v-dialog v-model="localShow" max-width="600" persistent>
        <v-card id="diag-fact">
            <v-card-title class="bg-indigo-darken-4 d-flex align-center">
                <h5><v-icon>mdi-file-document-outline</v-icon>FACTURA</h5>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text id="body-card" >
                <v-card-subtitle class="d-flex align-center text-center mb-2">
                    <v-divider /> 
                    <small class="mx-6 text-black">GENERALES</small>
                    <v-divider />
                </v-card-subtitle>
                <div class="w-100 d-flex align-center">
                    <div class="w-50 pa-2 ma-1 border rounded">
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-black"> Nº Factura:</small>
                            <small><strong>{{ data.venta.noVenta }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-black"><strong>C$</strong> Córdobas:</small>
                            <small><strong>{{ data.nio ? 'Si' : 'No' }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-black"><strong>$</strong> Dólares:</small>
                            <small><strong>{{ data.usd ? 'Si' : 'No' }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-black">Crédito:</small>
                            <small><strong>{{ data.venta.credito ? 'Si' : 'No' }}</strong></small>
                        </div>
                    </div>
                    <div class="w-50 pa-2 ma-1 border rounded">
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-black">Fecha Registro:</small>
                            <small><strong>{{ formateDate(data.editVenta.fechaRegistro) }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-black">Cliente:</small>
                            <small><strong>{{ data.venta.cliente }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-black">Dirección:</small>
                            <small><strong>{{ data.venta.enviarA }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-black">Emp. Registro:</small>
                            <small><strong>{{ data.venta.usuarioRegistro }}</strong></small>
                        </div>
                    </div>
                </div>
                <v-card-subtitle class="d-flex align-center text-center mb-2">
                    <v-divider /> 
                    <small class="mx-6 text-black">DETALLES</small>
                    <v-divider />
                </v-card-subtitle>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table class="border rounded font" density="compact" :headers="data.headers" 
                            :items="data.items" :header-props="{ class: 'font-weight-bold text-uppercase' }"
                            height="200" fixed-header hide-default-footer>
                            <template v-slot:item.opc>
                                <v-tooltip text="Eliminar" location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" color="error" class="mr-1">mdi-delete</v-icon>
                                    </template>
                                </v-tooltip>
                            </template>
                            <template v-slot:item.costoUnitario="{ item }">
                                <div>{{ formatedCurrency(item.costoUnitario) }}</div>
                            </template>
                            <template v-slot:item.subTotal="{ item }">
                                <div>{{ formatedCurrency(item.subTotal) }}</div>
                            </template>
                        </v-data-table>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-textarea v-model="data.venta.observaciones" density="compact" variant="outlined" hide-details label="Observaciones" placeholder="ingrese algunos detalles de la factura" 
                            persistent-placeholder rows="3"/>                        
                    </v-col>
                    <v-col cols="12" md="6" sm="6" class="d-flex flex-column justify-end align-end">
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">Sub Total: </small>
                            <strong>{{ formatedCurrency(data.factura.subTotal, data.fomates.nio) }}</strong>
                        </div>
                        <div class="d-flex justify-end align-center">
                            <small class="mr-2">TOTAL: </small>
                            <strong>{{ formatedCurrency(data.factura.total, data.fomates.nio) }}</strong>
                        </div>
                        <div v-if="data.usd" class="d-flex justify-end align-center">
                            <small class="mr-2">TOTAL $: </small>
                            <strong>{{ formatedCurrency(data.factura.usdTotal, data.fomates.usd) }}</strong>
                        </div>
                    </v-col>
                </v-row>

            </v-card-text>

            <v-divider/>
            <v-card-actions>
                <v-btn color="grey" variant="outlined" @click="closeDialog()">
                    Cerrar
                </v-btn>
                <v-btn color="indigo-darken-4" variant="flat" @click="exportDialogToPDF()">
                    <template v-slot:prepend>
                        <v-icon>mdi-printer</v-icon>
                    </template>
                    Imprimir
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { formatters } from '@/helpers/formatters';
import RequestHttp from '@/services/requestHttp';
import { reactive, ref, watch } from 'vue';
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export default {
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        factura: {
            type: Object,
            required: false
        }
    },

    setup(props) {
        const getVenta = async (id) => {
            const result = await data.requestHttp.getByIdVenta(id)
            return result
        }
        const getCliente = async (id) => {
            const result = await data.requestHttp.getByIdCliente(id)
            return result.nombre
        }
        const calcularFactura = () => {
            let subtotal = 0
            data.factura.subTotal = 0.00
            data.factura.total = 0.00
            data.factura.usdTotal = 0.00
            data.items.forEach(item => {
                item.subTotal = item.costoUnitario * item.cantidad
                subtotal += item.subTotal

            })
            data.factura.subTotal = subtotal
            data.factura.total = data.factura.subTotal
            data.factura.usdTotal = data.factura.total / 36.6243
        }
        const localShow = ref(props.show)
        const localIFact = ref(props.factura)
        watch(() => props.factura, async (val) => {
            if (localIFact.value.idVenta !== val.idVenta) {
                data.items = []
                data.factura.subTotal = 0.00
                data.factura.total = 0.00
                data.factura.usdTotal = 0.00
                data.venta = {}
                data.editVenta = {}

                const result = await getVenta(val.idVenta)
                data.venta.credito = result.credito
                data.venta.enviarA = result.enviarA
                data.venta.idCliente = result.idCliente
                data.venta.noVenta = result.noVenta
                data.venta.cliente = await getCliente(result.idCliente)
                data.venta.observaciones = result.observaciones
                data.venta.usuarioRegistro = result.usuarioRegistro
                data.editVenta.estado = result.estado
                data.editVenta.fechaRegistro = result.fechaRegistro
                data.editVenta.idVenta = result.idVenta
                data.editVenta.idClienteNavigation = result.idClienteNavigation
                result.detalleCxcs.map(item => {
                    data.editVenta.detalleCxcs.push(item)
                })
                const promises = result.detalleVenta.map(async (item) => {
                    const product = await data.requestHttp.getByIdProducto(item.idProducto)
                    data.items.push({
                        idDetalleVenta: item.idDetalleVenta,
                        idVenta: item.idVenta,
                        idProducto: item.idProducto,
                        cantidad: item.cantidad,
                        costoUnitario: item.precioUnitario,
                        observaciones: item.observaciones,
                        idProductoNavigation: item.idProductoNavigation,
                        idVentaNavigation: item.idVentaNavigation,
                        producto: product.nombre,
                        subTotal: item.cantidad * item.precioUnitario
                    })
                })
    
                await Promise.all(promises)
                calcularFactura()
            }
            
        })
        watch(() => props.show, async (val) => {
            localShow.value = val
        })

        const data = reactive({
            headers: [
                {title: 'Producto', key: 'producto', align: 'center'},
                {title: 'Cantidad', key: 'cantidad', align: 'center'},
                {title: 'Precio Unit.', key: 'costoUnitario', align: 'center'},
                {title: 'SubTotal', key: 'subTotal', align: 'center'},
            ],
            items: [],
            factura: {
                subTotal: 0.00,
                total: 0.00,
                usdTotal: 0.00,
            },
            venta: {
                noVenta: null,
                idCliente: null,
                credito: false,
                cliente: null,
                observaciones: null,
                enviarA: null,
                usuarioRegistro: null,
                detalleVenta: []
            },
            editVenta: {
                idVenta: null,
                fechaRegistro: null,
                estado: false,
                idClienteNavigation: null,
                detalleCxcs: [],
            },

            idVenta: null,
            emision: new Date(),
            nio: true,
            usd: true,
            fomates: {
                nio: 'NIO', 
                usd: 'USD'
            },
            requestHttp: new RequestHttp()
        })

        return {
            localShow,
            data
        }
    },

    methods: {
        formatedCurrency(key, currency) {
            const value = formatters.formatCurrency(key, currency)
            return value
        },

        formateDate(dateString) {
            const value = formatters.formatDate(dateString)
            return value
        },

        closeDialog() {
            this.$emit('closeDialog', false)
            this.localShow = false
        },

        exportDialogToPDF() {
            if (!this.data.items || this.data.items.length === 0) {
                alert('No hay datos para exportar.');
                return;
            }

            const doc = new jsPDF();

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Encabezado principal
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(200, 0, 0); // Rojo oscuro
            doc.text("FACTURA", pageWidth / 2, 15, { align: "center" });

            // Información general
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0);

            const lineSpacing = 6;
            let currentY = 25;

            const generales = [
                `Nº Factura: ${this.data.venta.noVenta || ''}`,
                `Estado: ${this.data.editVenta.estado ? 'Activa' : 'Inactiva'}`,
                `C$ Córdobas: ${this.data.nio ? 'Si' : 'No'}`,
                `Dólares: ${this.data.usd ? 'Si' : 'No'}`,
                `Fecha Registro: ${this.formateDate(this.data.editVenta.fechaRegistro)}`,
                `Cliente: ${this.data.venta.cliente || ''}`,
                `Dirección: ${this.data.venta.enviarA || ''}`,
                `Emp. Registro: ${this.data.venta.usuarioRegistro || ''}`
            ];

            generales.forEach(dato => {
                doc.text(dato, 14, currentY);
                currentY += lineSpacing;
            });

            // Línea divisoria
            doc.setDrawColor(200, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(14, currentY, pageWidth - 14, currentY);
            currentY += 5;

            // Sección Detalles
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(200, 0, 0);
            doc.text("DETALLES", 14, currentY);
            currentY += 5;
            doc.setTextColor(0);

            const headers = this.data.headers.map(header => header.title || header.key || '');
            const filas = this.data.items.map(item => {
                return this.data.headers.map(header => {
                    const key = header.key;
                    if (key === 'costoUnitario' || key === 'subTotal') {
                        return this.formatedCurrency(item[key], this.data.fomates.nio);
                    }
                    return item[key] !== undefined ? item[key] : 'N/A';
                });
            });

            doc.autoTable({
                startY: currentY,
                head: [headers],
                body: filas,
                theme: 'striped',
                headStyles: { fillColor: [200, 0, 0], textColor: 255, halign: 'center' },
                styles: { fontSize: 9, cellPadding: 2 },
                margin: { left: 14, right: 14 },
                didDrawPage: (data) => {
                    currentY = data.cursor.y + 10;
                }
            });

            // Sección Observaciones
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0);
            doc.text("Observaciones:", 14, currentY);

            doc.setFont("helvetica", "normal");
            const observaciones = this.data.venta.observaciones || 'Ninguna';
            const obsLines = doc.splitTextToSize(observaciones, pageWidth - 28);
            doc.text(obsLines, 14, currentY + 5);

            // Totales
            const totalesY = currentY + obsLines.length * 5 + 15;
            doc.setFont("helvetica", "bold");
            const totalX = pageWidth - 80;
            const totalLines = [
                `Sub Total: ${this.formatedCurrency(this.data.factura.subTotal, this.data.fomates.nio)}`,
                `TOTAL: ${this.formatedCurrency(this.data.factura.total, this.data.fomates.nio)}`,
            ];
            if (this.data.usd) {
                totalLines.push(`TOTAL $: ${this.formatedCurrency(this.data.factura.usdTotal, this.data.fomates.usd)}`);
            }

            totalLines.forEach((line, i) => {
                doc.text(line, totalX, totalesY + i * 7);
            });

            // Pie de página con fecha-hora
            const now = new Date();
            const dateStr = `${("0" + now.getDate()).slice(-2)}/${("0" + (now.getMonth() + 1)).slice(-2)}/${now.getFullYear()}`;
            const timeStr = `${("0" + now.getHours()).slice(-2)}:${("0" + now.getMinutes()).slice(-2)}:${("0" + now.getSeconds()).slice(-2)}`;
            doc.setFontSize(8);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(100);
            doc.text(`Fecha-Hora de impresión: ${dateStr} ${timeStr}`, pageWidth - 80, pageHeight - 10);

            doc.save(`Factura_${this.data.venta.noVenta}.pdf`);
        }

    },
}
</script>

<style scoped>
.v-card-item{
    padding: 8px 12px !important;
}

#diag-fact{
    position: relative;
}

#body-card{
    z-index: 2;
}

#checkLabel{
    font-size: 12px !important;
}
.font{
    font-size: 10px !important;
    font-weight: bold;
    color: black;
}
</style>