<template>
    <v-dialog v-model="localShow" max-width="800" persistent>
        <v-card class="rounded-lg" elevation="10">
            <!-- Header con gradiente profesional -->
            <v-card-title class="d-flex align-center bg-indigo-darken-4 text-white ">
                <v-avatar size="48" color="white" class="mr-4" variant="flat">
                    <v-icon color="indigo-darken-4" size="28">mdi-receipt</v-icon>
                </v-avatar>
                <div class="text-white">
                    <h6 class="font-weight-bold">FACTURA</h6>
                    <div class="text-subtitle-1 text-grey-lighten-3">
                        Documento No. {{ data.venta.noVenta }}
                    </div>
                </div>
                <v-spacer />
                <v-btn icon color="white" variant="text" @click="closeDialog()" size="small" class="ml-2">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <!-- Cuerpo del documento -->
            <v-card-text class="pa-2 bg-grey-lighten-4">
                <!-- Encabezado informativo -->
                <v-card color="white" class="details px-4 py-2 mb-2 rounded-lg border" elevation="0">
                    <v-row dense>
                        <v-col>
                            <div class="text-grey">INFORMACIÓN DEL CLIENTE</div>
                            <v-divider />
                            <v-row>
                                <v-col cols="4">
                                    <div class="text-caption text-grey">
                                        NOMBRE DEL CLIENTE
                                    </div>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        {{ data.venta.cliente }}
                                    </div>
                                </v-col>
                                <v-col cols="4">
                                    <div class="text-caption text-grey">
                                        DIRECCIÓN DE ENVÍO
                                    </div>
                                    <div class="text-subtitle-2">
                                        {{ data.venta.enviarA }}
                                    </div>
                                </v-col>
                                <v-col cols="4">
                                    <div class="text-caption text-grey">
                                        REGISTRADO POR
                                    </div>
                                    <div class="text-subtitle-2">
                                        {{ data.venta.usuarioRegistro }}
                                    </div>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-divider vertical/>
                        <v-col cols="2" class="d-flex flex-column text-center justify-center align-center">
                            <div>
                                <div class="text-caption text-grey">
                                    FECHA EMISIÓN
                                </div>
                                <div class="text-subtitle-2 font-weight-bold">
                                    {{ formateDate(data.editVenta.fechaRegistro) }}
                                </div>
                            </div>
                            <div>
                                <v-chip :color="data.venta.credito ? 'orange-darken-3' : 'green-darken-3'">
                                    {{ data.venta.credito ? 'Crédito' : 'Contado' }}
                                </v-chip>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>                

                <!-- Tabla de productos -->
                <v-card variant="flat" class="rounded-lg overflow-hidden mb-2 border" elevation="0">
                    <v-card-title class="px-4" style="background-color: #e8eaf6;">
                        <v-icon color="indigo-darken-3" class="mr-2">mdi-cart</v-icon>
                        <span class="text-subtitle-1 font-weight-bold">DETALLE DE PRODUCTOS</span>
                    </v-card-title>
                    
                    <v-data-table
                        :headers="data.headers"
                        :items="data.items"
                        density="compact"
                        hide-default-footer
                        class="elevation-0"
                        :header-props="{
                            class: 'text-uppercase font-weight-bold bg-indigo-lighten-5'
                        }"
                        fixed-header
                        height="200px"                        
                    >
                        <template v-slot:item.opc>
                            <v-btn icon variant="text" color="grey" size="x-small">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        
                        <template v-slot:item.costoUnitario="{ item }">
                            <div class="text-right font-weight-medium">
                                {{ formatedCurrency(item.costoUnitario) }}
                            </div>
                        </template>
                        
                        <template v-slot:item.subTotal="{ item }">
                            <div class="text-right font-weight-bold text-indigo-darken-3">
                                {{ formatedCurrency(item.subTotal) }}
                            </div>
                        </template>
                    </v-data-table>
                </v-card>

                <!-- Totales y observaciones -->
                <v-row>
                    <v-col cols="7">
                        <v-card variant="flat" color="white" class="px-4 rounded-lg border h-100">
                            <div class="text-overline text-grey mb-2">OBSERVACIONES</div>
                            <v-textarea
                                v-model="data.venta.observaciones"
                                variant="plain"
                                hide-details
                                auto-grow
                                rows="4"
                                class="pa-2"
                                readonly
                                style="background-color: #f9f9f9;"
                            />
                        </v-card>
                    </v-col>
                    
                    <v-col cols="5">
                        <v-card variant="flat" color="white" class="px-4 rounded-lg border h-100">
                            <div class="text-overline text-grey mb-3">RESUMEN DE PAGO</div>
                            
                            <div class="d-flex justify-space-between align-center mb-3">
                                <span class="text-body-2">Sub Total</span>
                                <span class="text-body-1 font-weight-medium">{{ formatedCurrency(data.factura.subTotal, data.fomates.nio) }}</span>
                            </div>
                            
                            <div class="d-flex justify-space-between align-center mb-4">
                                <span class="text-body-1 font-weight-bold">TOTAL GENERAL</span>
                                <span class="text-h6 font-weight-bold text-indigo-darken-4">
                                    {{ formatedCurrency(data.factura.total, data.fomates.nio) }}
                                </span>
                            </div>
                            
                            <v-divider class="my-3" />
                            
                            <div v-if="data.usd" class="d-flex justify-space-between align-center mt-4">
                                <div>
                                    <span class="text-body-2">Equivalente en USD</span>
                                    <div class="text-caption text-grey">Tipo de cambio aplicado</div>
                                </div>
                                <span class="text-body-1 font-weight-bold text-blue-darken-3">
                                    {{ formatedCurrency(data.factura.usdTotal, data.fomates.usd) }}
                                </span>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Información adicional -->
                <!-- <v-card variant="flat" color="#e8f5e9" class="pa-3 rounded-lg mt-4 border" v-if="data.venta.credito">
                    <div class="d-flex align-center">
                        <v-icon color="orange-darken-3" class="mr-3">mdi-clock-outline</v-icon>
                        <div>
                            <div class="text-caption font-weight-bold">
                                ESTA FACTURA ES A CRÉDITO
                            </div>
                        </div>
                    </div>
                </v-card> -->

            </v-card-text>

            <!-- Footer con acciones -->
            <v-divider />
            <v-card-actions class="pa-4 bg-white">
                <v-btn 
                    color="grey-darken-2" 
                    variant="tonal" 
                    @click="closeDialog()"
                    class="px-5"
                >
                    <v-icon size="small" class="mr-2">
                        mdi-close
                    </v-icon>
                    Cerrar
                </v-btn>
                
                <v-btn 
                    color="indigo-darken-3" 
                    variant="flat" 
                    @click="exportDialogToPDF()"
                    class="px-6"
                    elevation="2"
                >
                    <v-icon class="mr-2">
                        mdi-printer
                    </v-icon>
                    Descargar
                </v-btn>
            </v-card-actions>

            <OverlayComp :show="data.overlay.show"/>
        </v-card>
    </v-dialog>
</template>

<script>
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';
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

    components: {
        OverlayComp
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

                data.overlay.show = true

                const result = await getVenta(val.idVenta)
                data.venta.credito = result.data.credito
                data.venta.enviarA = result.data.enviarA
                data.venta.idCliente = result.data.idCliente
                data.venta.noVenta = result.data.noVenta
                data.venta.cliente = await getCliente(result.data.idCliente)
                data.venta.observaciones = result.data.observaciones
                data.venta.usuarioRegistro = result.data.usuarioRegistro
                data.editVenta.estado = result.data.estado
                data.editVenta.fechaRegistro = result.data.fechaRegistro
                data.editVenta.idVenta = result.data.idVenta
                data.editVenta.idClienteNavigation = result.data.idClienteNavigation
                result.data.detalleCxcs.map(item => {
                    data.editVenta.detalleCxcs.push(item)
                })
                const promises = result.data.detalleVenta.map(async (item) => {
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

                data.overlay.show = false
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

            // Overlay
            overlay: {
                show: false
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

.details {
    font-size: 12px !important;
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