<template>
    <v-dialog v-model="localShow" max-width="900" persistent>
        <v-card class="rounded-lg" elevation="10">
            <v-card-title class="d-flex align-center bg-indigo-darken-4 text-white ">
                <v-avatar size="48" color="white" class="mr-4" variant="flat">
                    <v-icon color="indigo-darken-4" size="28">mdi-receipt</v-icon>
                </v-avatar>
                <div class="text-white">
                    <h6 class="font-weight-bold">ÓRDEN DE COMPRA</h6>
                    <div class="text-subtitle-1 text-grey-lighten-3">
                        Documento No. {{ data.orden.noOrden }}
                    </div>
                </div>
                <v-spacer />
                <v-btn icon color="white" variant="text" @click="closeDialog()" size="small" class="ml-2">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="pa-3 bg-grey-lighten-4">
                <v-card color="white" class="details px-4 py-3 mb-3 rounded-lg border" elevation="0">
                    <v-row dense>
                        <v-col cols="12" md="10">
                            <div class="text-caption text-indigo-darken-3 font-weight-bold mb-1">INFORMACIÓN DE LA COMPRA / PROVEEDOR</div>
                            <v-divider class="mb-2" />
                            <v-row dense>
                                <v-col cols="12" sm="6" md="3">
                                    <div class="text-caption text-grey">
                                        PROVEEDOR:
                                    </div>
                                    <div class="text-subtitle-2 font-weight-bold text-grey-darken-4 text-truncate">
                                        {{ data.orden.proveedor || '---' }}
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <div class="text-caption text-grey">
                                        BODEGA DESTINO:
                                    </div>
                                    <div class="text-subtitle-2 font-weight-bold text-indigo-darken-4">
                                        {{ data.orden.bodegaNombre || 'Sin asignar' }}
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <div class="text-caption text-grey">
                                        REGISTRADO POR:
                                    </div>
                                    <div class="text-subtitle-2">
                                        {{ data.orden.usuarioRegistro || 'Sistema' }}
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <div class="text-caption text-grey">
                                        APROBADA:
                                    </div>
                                    <div class="text-subtitle-2 font-weight-bold" :class="data.orden.aprobada ? 'text-green-darken-2' : 'text-grey-darken-1'">
                                        {{ data.orden.aprobada ? 'SÍ' : 'NO' }}
                                    </div>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-divider vertical class="d-none d-md-block" />
                        <v-col cols="12" md="2" class="d-flex flex-column text-center justify-center align-center pt-2 pt-md-0">
                            <div>
                                <div class="text-caption text-grey">
                                    FECHA REGISTRO
                                </div>
                                <div class="text-subtitle-2 font-weight-bold">
                                    {{ formateDate(data.orden.fechaRegistro) }}
                                </div>
                            </div>
                            <div class="mt-1">
                                <v-chip :color="!data.orden.estado ? 'orange-darken-3' : 'green-darken-3'"
                                    density="compact" size="small" class="font-weight-bold">
                                    {{ data.orden.estado ? 'Activa' : 'Inactiva' }}
                                </v-chip>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>

                <!-- Tabla de productos -->
                <v-card variant="flat" class="rounded-lg overflow-hidden mb-3 border" elevation="0">
                    <v-card-title class="px-4 py-2" style="background-color: #e8eaf6;">
                        <v-icon color="indigo-darken-3" class="mr-2">mdi-cart</v-icon>
                        <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">DETALLE DE PRODUCTOS E IMPUESTOS</span>
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
                            <div class="text-right font-weight-medium">{{ formatedCurrency(item.costoUnitario, data.fomates.nio) }}</div>
                        </template>
                        <template v-slot:item.montoImpuesto="{ item }">
                            <div class="text-right font-weight-bold text-indigo-darken-3">
                                {{ formatedCurrency(item.montoImpuesto, data.fomates.nio) }}
                            </div>
                        </template>
                        <template v-slot:item.subTotal="{ item }">
                            <div class="text-right font-weight-bold text-indigo-darken-3">{{ formatedCurrency(item.totalConIva, data.fomates.nio) }}</div>
                        </template>
                    </v-data-table>
                </v-card>

                <!-- Totales y observaciones -->
                <v-row dense>
                    <v-col cols="12" md="6">
                        <v-card variant="flat" color="white" class="pa-4 rounded-lg border h-100">
                            <div class="text-caption text-indigo-darken-3 font-weight-bold mb-2">OBSERVACIONES</div>

                            <v-textarea v-model="data.orden.observaciones" density="compact" variant="plain" 
                                hide-details placeholder="Sin observaciones registradas en la orden..." 
                                rows="4" readonly/>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-card variant="flat" color="white" class="pa-4 rounded-lg border h-100">
                            <div class="text-caption text-indigo-darken-3 font-weight-bold mb-3">RESUMEN DE PAGO</div>

                            <div class="d-flex justify-space-between align-center mb-2">
                                <span class="text-caption text-grey-darken-1 font-weight-medium">Sub Total (Neto):</span>
                                <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                                    {{ formatedCurrency(data.factura.subTotal, data.fomates.nio) }}
                                </span>
                            </div>

                            <div class="d-flex justify-space-between align-center mb-2">
                                <span class="text-caption text-indigo-darken-3 font-weight-bold d-flex align-center">
                                    <v-icon size="14" color="indigo-darken-3" class="mr-1">mdi-receipt-text-outline</v-icon>
                                    Impuestos (IVA 15%):
                                </span>
                                <span class="text-subtitle-2 font-weight-bold text-indigo-darken-3">
                                    {{ formatedCurrency(data.factura.totalImpuestos, data.fomates.nio) }}
                                </span>
                            </div>

                            <v-divider class="my-2" thickness="2" />

                            <div class="d-flex justify-space-between align-center mb-2">
                                <span class="text-subtitle-2 font-weight-black text-indigo-darken-4">TOTAL GENERAL:</span>
                                <span class="text-h6 font-weight-black text-indigo-darken-4">
                                    {{ formatedCurrency(data.factura.total, data.fomates.nio) }}
                                </span>
                            </div>

                            <v-divider class="my-2" />

                            <div class="d-flex justify-space-between align-center pt-1">
                                <div>
                                    <span class="text-caption text-grey-darken-1 font-weight-medium">Equivalente en USD</span>
                                    <div class="text-caption text-grey" style="font-size: 10px;">T/C 36.6243</div>
                                </div>
                                <span class="text-subtitle-1 font-weight-bold text-green-darken-2">
                                    {{ formatedCurrency(data.factura.usdTotal, data.fomates.usd) }}
                                </span>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider/>
            <v-card-actions class="px-4 py-3 bg-white justify-end">
                <v-btn color="grey-darken-1" variant="outlined" @click="closeDialog()" class="mr-2">
                    Cerrar
                </v-btn>
                <v-btn color="indigo-darken-4" variant="flat" @click="exportDialogToPDF()">
                    <template v-slot:prepend>
                        <v-icon>mdi-printer</v-icon>
                    </template>
                    Descargar PDF
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

        const calcularTotals = () => {
            let subTotal = 0
            let totalImpuestos = 0
            data.factura.subTotal = 0
            data.factura.totalImpuestos = 0
            data.factura.total = 0
            data.factura.usdTotal = 0

            data.items.forEach(item => {
                subTotal += Number(item.subTotal || 0)
                totalImpuestos += Number(item.montoImpuesto || 0)
            })

            data.factura.subTotal = Number(subTotal.toFixed(2))
            data.factura.totalImpuestos = Number(totalImpuestos.toFixed(2))
            data.factura.total = Number((subTotal + totalImpuestos).toFixed(2))
            data.factura.usdTotal = Number((data.factura.total / 36.6243).toFixed(2))
        }

        watch(() => props.orden, async (val) => {
            if (val && val.idCompra && (!localOrden.value || localOrden.value.idCompra !== val.idCompra)) {
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
                data.orden.proveedor = proveedor ? proveedor.nombre : (val.proveedor || '')
                data.orden.bodegaNombre = val.bodegaNombre || null
                await Promise.all(result.detalleCompras.map(async (item) => {
                    const product = await data.requestHttp.getByIdProducto(item.idProducto)
                    const costoUnit = Number(item.costoUnitario || 0)
                    const cant = Number(item.cantidad || 0)
                    const sub = Number((cant * costoUnit).toFixed(2))
                    const imp = Number((sub * 0.15).toFixed(2))
                    data.items.push({
                        idCompra: item.idCompra,
                        idProducto: item.idProducto, 
                        cantidad: cant,
                        costoUnitario: costoUnit,
                        costoConIva: Number((costoUnit * 1.15).toFixed(2)),
                        montoImpuesto: imp,
                        observaciones: item.observaciones,
                        subTotal: sub,
                        totalConIva: sub + imp,
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

        watch(() => props.orden, (val) => {
            localOrden.value = val
        })

        const data = reactive({
            headers: [
                { title: 'Producto', key: 'producto', align: 'start' },
                { title: 'Cantidad', key: 'cantidad', align: 'center', width: '90px' },
                { title: 'Costo Unitario', key: 'costoUnitario', align: 'end', width: '135px' },
                { title: 'IVA (15%)', key: 'montoImpuesto', align: 'end', width: '110px' },
                { title: 'SubTotal', key: 'subTotal', align: 'end', width: '130px' },
            ],
            items: [],
            orden: {
                noOrden: null,
                idProveedor: null,
                proveedor: null,
                bodegaNombre: null,
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
                totalImpuestos: 0.00,
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
            data,
            calcularTotals
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
                alert("No hay datos para exportar.");
                return;
            }

            const doc = new jsPDF("p", "mm", "a4");
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // ===== Helpers UI =====
            const COLORS = {
                blue: [18, 42, 120],        // barra superior
                blueSoft: [235, 240, 255],  // fondos suaves
                border: [220, 225, 235],
                text: [25, 35, 55],
                muted: [120, 130, 150],
                grayHeader: [236, 239, 245],
                green: [40, 140, 70],
                greenSoft: [224, 245, 232],
            };

            const M = 12;                 // margen general
            const R = 4;                  // "radio" visual (simulado)
            const lineH = 5;

            const setText = (size = 10, style = "normal", rgb = COLORS.text) => {
                doc.setFont("helvetica", style);
                doc.setFontSize(size);
                doc.setTextColor(...rgb);
            };

            const rect = (x, y, w, h, fillRgb = null, borderRgb = COLORS.border, lw = 0.3) => {
                doc.setLineWidth(lw);
                doc.setDrawColor(...borderRgb);
                if (fillRgb) doc.setFillColor(...fillRgb);
                doc.roundedRect(x, y, w, h, R, R, fillRgb ? "FD" : "S");
            };

            const labelValue = (label, value, x, y, w, opts = {}) => {
                const {
                    labelSize = 8,
                    valueSize = 10,
                    labelColor = COLORS.muted,
                    valueColor = COLORS.text,
                    valueStyle = "bold",
                    maxLines = 1,
                } = opts;

                setText(labelSize, "normal", labelColor);
                doc.text(label, x, y);

                setText(valueSize, valueStyle, valueColor);
                const v = value ?? "";
                const lines = doc.splitTextToSize(String(v), w);
                const sliced = lines.slice(0, maxLines);
                doc.text(sliced, x, y + 4);

                return y + 4 + (sliced.length - 1) * lineH;
            };

            const chip = (text, x, y, opts = {}) => {
                const { fill = COLORS.greenSoft, color = COLORS.green } = opts;
                setText(9, "bold", color);
                const paddingX = 3;
                const paddingY = 2.5;
                const textW = doc.getTextWidth(text);
                const w = textW + paddingX * 2;
                const h = 7;
                doc.setFillColor(...fill);
                doc.setDrawColor(...fill);
                doc.roundedRect(x, y, w, h, 3, 3, "F");
                doc.text(text, x + paddingX, y + paddingY + 1.5);
                return { w, h };
            };

            // ===== Datos =====
            const noOrden = this.data.orden?.noOrden ?? "";
            const proveedor = this.data.orden?.proveedor ?? "";
            const bodegaNombre = this.data.orden?.bodegaNombre ?? "Sin asignar";
            const usuarioRegistro = this.data.orden?.usuarioRegistro ?? "";
            const aprobada = this.data.orden?.aprobada ? "SI" : "NO";
            const estado = this.data.orden?.estado ? "Activa" : "Inactiva";
            const fechaRegistro = this.formateDate?.(this.data.orden?.fechaRegistro) ?? "";
            const observaciones = this.data.orden?.observaciones || "Ninguna";

            // Totales
            const subTotal = this.data.factura?.subTotal ?? 0;
            const totalImpuestos = this.data.factura?.totalImpuestos ?? 0;
            const total = this.data.factura?.total ?? 0;

            // ===== Layout =====
            let y = 0;

            // ===== Header azul =====
            const headerH = 18;
            doc.setFillColor(...COLORS.blue);
            doc.rect(0, 0, pageWidth, headerH, "F");

            setText(11, "bold", [255, 255, 255]);
            doc.text("ÓRDEN DE COMPRA", M, 7);

            setText(10, "normal", [255, 255, 255]);
            doc.text(`Documento No. ${noOrden}`, M, 13);

            setText(14, "bold", [255, 255, 255]);
            doc.text("DevoDigital", pageWidth - M, 11, { align: "right" });

            y = headerH + 6;

            // ===== Card Información del Proveedor y Bodega =====
            const card1H = 26;
            rect(M, y, pageWidth - M * 2, card1H, [255, 255, 255]);

            setText(8.5, "normal", COLORS.muted);
            doc.text("INFORMACIÓN DE LA COMPRA / PROVEEDOR", M + 4, y + 6);

            // Línea suave
            doc.setDrawColor(...COLORS.border);
            doc.setLineWidth(0.3);
            doc.line(M + 4, y + 8.5, pageWidth - M - 4, y + 8.5);

            // Columnas
            const innerX = M + 4;
            const innerY = y + 12;
            const innerW = pageWidth - M * 2 - 8;

            const colGap = 6;
            const colW = (innerW - colGap * 4) / 5;

            // Columnas
            labelValue("PROVEEDOR:", proveedor, innerX + (colW + colGap) * 0, innerY, colW);
            labelValue("BODEGA DESTINO:", bodegaNombre, innerX + (colW + colGap) * 1, innerY, colW);
            labelValue("REGISTRADO POR:", usuarioRegistro, innerX + (colW + colGap) * 2, innerY, colW);
            labelValue("APROBADA:", aprobada, innerX + (colW + colGap) * 3, innerY, colW);

            // Fecha registro alineada a la derecha (con chip estado)
            labelValue("FECHA REGISTRO", fechaRegistro, innerX + (colW + colGap) * 4, innerY, colW, {
                valueStyle: "bold",
                maxLines: 1,
            });

            const chipX = innerX + (colW + colGap) * 4;
            const chipY = innerY + 9;
            chip(estado, chipX, chipY);

            y += card1H + 8;

            // ===== Sección Detalle de productos =====
            const sectionH = 10;
            rect(M, y, pageWidth - M * 2, sectionH, COLORS.grayHeader);

            setText(11, "bold", COLORS.text);
            doc.text("DETALLE DE PRODUCTOS", M + 10, y + 6.8);

            setText(12, "bold", COLORS.blue);
            doc.text("🛒", M + 4, y + 6.8);

            y += sectionH;

            // Tabla (dentro del “card”)
            const tableCardY = y;
            const tableCardH = 70;
            rect(M, tableCardY, pageWidth - M * 2, tableCardH, [255, 255, 255]);

            const headers = ["Producto", "Cantidad", "Costo", "IVA (15%)", "SubTotal"];
            const filas = this.data.items.map(item => [
                String(item.producto || ''),
                String(item.cantidad || ''),
                this.formatedCurrency(item.costoUnitario, this.data.fomates.nio),
                this.formatedCurrency(item.montoImpuesto, this.data.fomates.nio),
                this.formatedCurrency(item.totalConIva, this.data.fomates.nio),
            ]);

            doc.autoTable({
                startY: tableCardY + 6,
                head: [headers],
                body: filas,
                theme: "plain",
                margin: { left: M + 4, right: M + 4 },
                tableWidth: pageWidth - (M + 4) * 2,
                headStyles: {
                    fillColor: COLORS.grayHeader,
                    textColor: COLORS.text,
                    fontStyle: "bold",
                    halign: "left",
                    cellPadding: 2.5,
                },
                bodyStyles: {
                    textColor: COLORS.text,
                    cellPadding: 2.5,
                    fontSize: 9.5,
                },
                styles: {
                    lineWidth: 0.2,
                    lineColor: COLORS.border,
                },
                didDrawPage: () => {},
            });

            // y después de tabla (cursor real)
            const afterTableY = doc.lastAutoTable.finalY ?? (tableCardY + 25);
            y = afterTableY + 8;

            // ===== Cards inferiores: Observaciones + Resumen de pago =====
            const bottomGap = 8;
            const leftW = (pageWidth - M * 2 - bottomGap) * 0.58;
            const rightW = (pageWidth - M * 2 - bottomGap) * 0.42;
            const bottomH = 50;

            // Observaciones (izq)
            rect(M, y, leftW, bottomH, [255, 255, 255]);
            setText(9, "normal", COLORS.muted);
            doc.text("OBSERVACIONES", M + 4, y + 7);

            setText(10, "normal", COLORS.text);
            const obsMaxW = leftW - 8;
            const obsLines = doc.splitTextToSize(observaciones, obsMaxW);
            const obsY = y + 14;
            doc.text(obsLines.slice(0, 8), M + 4, obsY);

            // Resumen (der)
            const rx = M + leftW + bottomGap;
            rect(rx, y, rightW, bottomH, [255, 255, 255]);

            setText(9, "normal", COLORS.muted);
            doc.text("RESUMEN DE PAGO", rx + 4, y + 7);

            // Subtotal
            setText(9.5, "normal", COLORS.text);
            doc.text("Sub Total (Neto)", rx + 4, y + 16);

            setText(9.5, "bold", COLORS.text);
            doc.text(
                this.formatedCurrency(subTotal, this.data.fomates.nio),
                rx + rightW - 4,
                y + 16,
                { align: "right" }
            );

            // IVA
            setText(9.5, "normal", COLORS.blue);
            doc.text("Impuestos (IVA 15%)", rx + 4, y + 23);

            setText(9.5, "bold", COLORS.blue);
            doc.text(
                this.formatedCurrency(totalImpuestos, this.data.fomates.nio),
                rx + rightW - 4,
                y + 23,
                { align: "right" }
            );

            // Línea
            doc.setDrawColor(...COLORS.border);
            doc.setLineWidth(0.3);
            doc.line(rx + 4, y + 28, rx + rightW - 4, y + 28);

            // Total general destacado
            setText(11, "bold", COLORS.text);
            doc.text("TOTAL GENERAL", rx + 4, y + 37);

            setText(12, "bold", COLORS.blue);
            doc.text(
                this.formatedCurrency(total, this.data.fomates.nio),
                rx + rightW - 4,
                y + 37,
                { align: "right" }
            );

            y += bottomH + 8;

            // ===== Footer =====
            const now = new Date();
            const dateStr = `${("0" + now.getDate()).slice(-2)}/${("0" + (now.getMonth() + 1)).slice(-2)}/${now.getFullYear()}`;
            const timeStr = `${("0" + now.getHours()).slice(-2)}:${("0" + now.getMinutes()).slice(-2)}:${("0" + now.getSeconds()).slice(-2)}`;

            setText(8, "italic", COLORS.muted);
            doc.text(`Fecha-Hora de impresión: ${dateStr} ${timeStr}`, pageWidth - M, pageHeight - 8, {
                align: "right",
            });

            doc.save(`Orden_${noOrden}.pdf`);
        }
    },
}
</script>

<style scoped>
.v-card-item{
    padding: 8px 12px !important;
}

.h-100 {
    height: 100%;
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