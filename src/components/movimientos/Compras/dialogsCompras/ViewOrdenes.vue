<template>
    <v-dialog v-model="localShow" max-width="800" persistent>
        <v-card class="rounded-lg" elevation="10">
            <v-card-title class="d-flex align-center bg-indigo-darken-4 text-white ">
                <v-avatar size="48" color="white" class="mr-4" variant="flat">
                    <v-icon color="indigo-darken-4" size="28">mdi-receipt</v-icon>
                </v-avatar>
                <div class="text-white">
                    <h6 class="font-weight-bold">ÓRDEN</h6>
                    <div class="text-subtitle-1 text-grey-lighten-3">
                        Documento No. {{ data.orden.noOrden }}
                    </div>
                </div>
                <v-spacer />
                <v-btn icon color="white" variant="text" @click="closeDialog()" size="small" class="ml-2">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="pa-2 bg-grey-lighten-4">
                <v-card color="white" class="details px-4 py-2 mb-2 rounded-lg border" elevation="0">
                    <v-row dense>
                        <v-col>
                            <div class="text-grey">INFORMACIÓN DEL CLIENTE</div>
                            <v-divider />
                            <v-row>
                                <v-col cols="3">
                                    <div class="text-caption text-grey">
                                        PROVEEDOR:
                                    </div>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        {{ data.orden.proveedor }}
                                    </div>
                                </v-col>
                                <v-col cols="3">
                                    <div class="text-caption text-grey">
                                        REGISTRADO POR:
                                    </div>
                                    <div class="text-subtitle-2">
                                        {{ data.orden.usuarioRegistro }}
                                    </div>
                                </v-col>
                                <v-col cols="3">
                                    <div class="text-caption text-grey">
                                        APROBADA:
                                    </div>
                                    <div class="text-subtitle-2">
                                        {{ data.orden.aprobada ? 'SI' : 'NO' }}
                                    </div>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-divider vertical/>
                        <v-col cols="2" class="d-flex flex-column text-center justify-center align-center">
                            <div>
                                <div class="text-caption text-grey">
                                    FECHA REGISTRO
                                </div>
                                <div class="text-subtitle-2 font-weight-bold">
                                    {{ formateDate(data.orden.fechaRegistro) }}
                                </div>
                            </div>
                            <div>
                                <v-chip :color="!data.orden.estado ? 'orange-darken-3' : 'green-darken-3'"
                                    density="compact">
                                    {{ data.orden.estado ? 'Activa' : 'Inactiva' }}
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
                    
                    <v-data-table hide-default-footer 
                        density="compact" 
                        :headers="data.headers" 
                        :items="data.items" 
                        :header-props="{ 
                            class: 'font-weight-bold text-uppercase bg-indigo-lighten-5' 
                        }"
                        height="200" fixed-header>
                        <template v-slot:item.costoUnitario="{ item }">
                            <div>{{ formatedCurrency(item.costoUnitario, data.fomates.nio) }}</div>
                        </template>
                        <template v-slot:item.subTotal="{ item }">
                            <div>{{ formatedCurrency(item.subTotal, data.fomates.nio) }}</div>
                        </template>
                    </v-data-table>
                </v-card>

                <!-- Totales y observaciones -->
                <v-row>
                    <v-col cols="7">
                        <v-card variant="flat" color="white" class="px-4 rounded-lg border h-100">
                            <div class="text-overline text-grey mb-2">OBSERVACIONES</div>
                            
                            <v-textarea v-model="data.orden.observaciones" density="compact" variant="plain" 
                                hide-details label="Observaciones" placeholder="ingrese algunos detalles de la orden" 
                                persistent-placeholder rows="4" readonly/>
                        </v-card>
                    </v-col>
                    
                    <v-col cols="5">
                        <v-card variant="flat" color="whiet" class="px-4 rounded-lg border h-100">
                            <div class="text-overline text-grey mb-3">RESUMEN DE PAGO</div>
                            
                            <div class="d-flex justify-space-between align-center mb-3">
                                <span class="text-body-2">Sub Total</span>
                                <span class="text-body-1 font-weight-medium">
                                    {{ formatedCurrency(data.factura.subTotal, data.fomates.nio) }}
                                </span>
                            </div>
                            
                            <div class="d-flex justify-space-between align-center mb-4">
                                <span class="text-body-1 font-weight-bold">TOTAL GENERAL</span>
                                <span class="text-h6 font-weight-bold text-indigo-darken-4">
                                    {{ formatedCurrency(data.factura.total, data.fomates.nio) }}
                                </span>
                            </div>
                            
                            <v-divider class="my-3" />
                            
                            <div class="d-flex justify-space-between align-center mt-4">
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

            <OverlayComp :show="data.overlay.show"/>
        </v-card>
    </v-dialog>
</template>

<script>
import OverlayComp from '@/components/reutilizable/OverlayComp.vue';
import { formatters } from '@/helpers/formatters';
import { reactive, ref, watch } from 'vue';
import RequestHttp from '@/services/requestHttp';
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export default {
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        orden: {
            type: Object,
            required: false
        }
    },

    components: {
        OverlayComp
    },

    setup(props) {
        const localShow = ref(props.show)
        const localOrden = ref(props.orden)

        watch(() => props.orden, async (val) => {
            if (localOrden.value.idCompra !== val.idCompra) {
                data.overlay.show = true
                const result = await data.requestHttp.getByIdCompra(val.idCompra)
                const proveedor = await data.requestHttp.getByIdProveedor(result.idProveedor)

                data.items = []
                data.idOrden = result.idCompra
                data.orden.idProveedor = result.idProveedor
                data.orden.noOrden = result.noOrden
                data.orden.aprobada = result.aprobada
                data.orden.observaciones = result.observaciones
                data.orden.usuarioRegistro = result.usuarioRegistro
                data.orden.fechaRegistro = result.fechaRegistro
                data.orden.estado = result.estado
                data.orden.proveedor = proveedor.nombre
                await Promise.all(result.detalleCompras.map(async (item) => {
                    const product = await data.requestHttp.getByIdProducto(item.idProducto)
                    data.items.push({
                        idCompra: item.idCompra,
                        idProducto: item.idProducto, 
                        cantidad: item.cantidad,
                        costoUnitario: item.costoUnitario,
                        observaciones: item.observaciones,
                        subTotal: item.cantidad * item.costoUnitario,
                        producto: product.nombre
                    })
                }))
                calcularTotals()
                data.overlay.show = false
            }
        })
        
        watch(() => props.show, async (newValue) => {
            localShow.value = newValue
        })
        const  calcularTotals = () => {
            let subTotal = 0
            data.factura.subTotal = 0
            data.factura.total = 0
            data.factura.usdTotal = 0

            data.items.forEach(item => {
                subTotal += item.subTotal
            })

            data.factura.subTotal = subTotal
            data.factura.total = data.factura.subTotal
            data.factura.usdTotal = data.factura.total/36.4263
        }
        watch(() => props.orden, (val) => {
            localOrden.value = val
        })

        const data = reactive({
            headers: [
                {title: 'Producto', key: 'producto', align: 'center'},
                {title: 'Cantidad', key: 'cantidad', align: 'center'},
                {title: 'Precio Unit.', key: 'costoUnitario', align: 'center'},
                {title: 'SubTotal', key: 'subTotal', align: 'center'},
            ],
            items: [],
            orden: {
                noOrden: null,
                idProveedor: null,
                proveedor: null,
                aprobada: false,
                observaciones: null,
                usuarioRegistro: null,
                fechaRegistro: null,
                estado: null,
                detalle: []
            },
            // Overlay
            overlay: {
                show: false
            },
            factura: {
                subTotal: 0.00,
                total: 0.00,
                usdTotal: 0.00
            },
            nio: true,
            usd: false,
            idOrden: null,
            fomates: {
                nio: 'NIO', 
                usd: 'USD'
            },
            requestHttp: new RequestHttp()
        })

        return {
            localShow,
            localOrden,
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
            doc.text("ORDEN DE COMPRA", pageWidth / 2, 15, { align: "center" });

            // Información general
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0);

            const lineSpacing = 6;
            let currentY = 25;

            const generales = [
                `Número de Orden: ${this.data.orden.noOrden || ''}`,
                `Estado: ${this.data.orden.estado ? 'Activa' : 'Inactiva'}`,
                `Aprobada: ${this.data.orden.aprobada ? 'SI' : 'NO'}`,
                `Fecha Registro: ${this.formateDate(this.data.orden.fechaRegistro)}`,
                `Proveedor: ${this.data.orden.proveedor || ''}`,
                `Emp. Registro: ${this.data.orden.usuarioRegistro || ''}`
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

            // Tabla de detalles
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
            const observaciones = this.data.orden.observaciones || 'Ninguna';
            const obsLines = doc.splitTextToSize(observaciones, pageWidth - 28);
            doc.text(obsLines, 14, currentY + 5);

            // Totales
            const totalesY = currentY + obsLines.length * 5 + 15;
            doc.setFont("helvetica", "bold");
            const totalX = pageWidth - 80;
            const totalLines = [
                `Sub Total: ${this.formatedCurrency(this.data.factura.subTotal, this.data.fomates.nio)}`,
                `Total: ${this.formatedCurrency(this.data.factura.total, this.data.fomates.nio)}`,
            ];
            if (this.data.factura.usdTotal) {
                totalLines.push(`Total $: ${this.formatedCurrency(this.data.factura.usdTotal, this.data.fomates.usd)}`);
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

            doc.save(`Orden_${this.data.orden.noOrden}.pdf`);
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