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

                            <!-- <v-divider class="my-3" />

                            <div class="d-flex justify-space-between align-center mt-4">
                                <div>
                                    <span class="text-body-2">Equivalente en USD</span>
                                    <div class="text-caption text-grey">Tipo de cambio aplicado</div>
                                </div>
                                <span class="text-body-1 font-weight-bold text-blue-darken-3">
                                    {{ formatedCurrency(data.factura.usdTotal, data.fomates.usd) }}
                                </span>
                            </div> -->
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
            const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

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
            const usuarioRegistro = this.data.orden?.usuarioRegistro ?? "";
            const aprobada = this.data.orden?.aprobada ? "SI" : "NO";
            const estado = this.data.orden?.estado ? "Activa" : "Inactiva";
            const fechaRegistro = this.formateDate?.(this.data.orden?.fechaRegistro) ?? "";
            const observaciones = this.data.orden?.observaciones || "Ninguna";

            // Totales
            const subTotal = this.data.factura?.subTotal ?? 0;
            const total = this.data.factura?.total ?? 0;

            // ===== Layout =====
            let y = 0;

            // ===== Header azul =====
            const headerH = 18;
            doc.setFillColor(...COLORS.blue);
            doc.rect(0, 0, pageWidth, headerH, "F");

            setText(11, "bold", [255, 255, 255]);
            doc.text("ORDEN", M, 7);

            setText(10, "normal", [255, 255, 255]);
            doc.text(`Documento No. ${noOrden}`, M, 13);

            // “X” visual (opcional)
            setText(14, "bold", [255, 255, 255]);
            doc.text("Inversiones Zafiro", pageWidth - M, 11, { align: "right" });

            y = headerH + 6;

            // ===== Card Información del cliente =====
            const card1H = 26;
            rect(M, y, pageWidth - M * 2, card1H, [255, 255, 255]);

            setText(8.5, "normal", COLORS.muted);
            doc.text("INFORMACIÓN DEL CLIENTE", M + 4, y + 6);

            // Línea suave
            doc.setDrawColor(...COLORS.border);
            doc.setLineWidth(0.3);
            doc.line(M + 4, y + 8.5, pageWidth - M - 4, y + 8.5);

            // Columnas
            const innerX = M + 4;
            const innerY = y + 12;
            const innerW = pageWidth - M * 2 - 8;

            const colGap = 6;
            const colW = (innerW - colGap * 3) / 4;

            // 4 columnas arriba
            labelValue("PROVEEDOR:", proveedor, innerX + (colW + colGap) * 0, innerY, colW);
            labelValue("REGISTRADO POR:", usuarioRegistro, innerX + (colW + colGap) * 1, innerY, colW);
            labelValue("APROBADA:", aprobada, innerX + (colW + colGap) * 2, innerY, colW);

            // Fecha registro alineada a la derecha (con chip estado)
            labelValue("FECHA REGISTRO", fechaRegistro, innerX + (colW + colGap) * 3, innerY, colW, {
                valueStyle: "bold",
                maxLines: 1,
            });

            // Chip estado (abajo de fecha)
            const chipX = innerX + (colW + colGap) * 3;
            const chipY = innerY + 9;
            chip(estado, chipX, chipY);

            y += card1H + 8;

            // ===== Sección Detalle de productos =====
            const sectionH = 10;
            rect(M, y, pageWidth - M * 2, sectionH, COLORS.grayHeader);

            setText(11, "bold", COLORS.text);
            doc.text("DETALLE DE PRODUCTOS", M + 10, y + 6.8);

            // “iconito” carrito simple (no SVG, solo texto)
            setText(12, "bold", COLORS.blue);
            doc.text("🛒", M + 4, y + 6.8);

            y += sectionH;

            // Tabla (dentro del “card”)
            const tableCardY = y;
            const tableCardH = 70; // puedes ajustar según cantidad de filas (autotable paginará)
            rect(M, tableCardY, pageWidth - M * 2, tableCardH, [255, 255, 255]);

            const headers = this.data.headers.map(h => h.title || h.key || "");
            const filas = this.data.items.map(item =>
                this.data.headers.map(h => {
                const key = h.key;
                if (key === "costoUnitario" || key === "subTotal") {
                    return this.formatedCurrency(item[key], this.data.fomates.nio);
                }
                return item[key] !== undefined ? String(item[key]) : "";
                })
            );

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
                didDrawPage: (data) => {
                // nada extra aquí
                },
            });

            // y después de tabla (cursor real)
            const afterTableY = doc.lastAutoTable.finalY ?? (tableCardY + 25);
            y = afterTableY + 8;

            // ===== Cards inferiores: Observaciones + Resumen de pago =====
            const bottomGap = 8;
            const leftW = (pageWidth - M * 2 - bottomGap) * 0.62;
            const rightW = (pageWidth - M * 2 - bottomGap) * 0.38;
            const bottomH = 45;

            // Observaciones (izq)
            rect(M, y, leftW, bottomH, [255, 255, 255]);
            setText(9, "normal", COLORS.muted);
            doc.text("OBSERVACIONES", M + 4, y + 7);

            // body obs
            setText(10, "normal", COLORS.text);
            const obsMaxW = leftW - 8;
            const obsLines = doc.splitTextToSize(observaciones, obsMaxW);
            const obsY = y + 14;
            doc.text(obsLines.slice(0, 8), M + 4, obsY); // corta por seguridad visual

            // Resumen (der)
            const rx = M + leftW + bottomGap;
            rect(rx, y, rightW, bottomH, [255, 255, 255]);

            setText(9, "normal", COLORS.muted);
            doc.text("RESUMEN DE PAGO", rx + 4, y + 7);

            // Subtotal
            setText(10, "normal", COLORS.text);
            doc.text("Sub Total", rx + 4, y + 18);

            setText(10, "bold", COLORS.text);
            doc.text(
                this.formatedCurrency(subTotal, this.data.fomates.nio),
                rx + rightW - 4,
                y + 18,
                { align: "right" }
            );

            // Línea
            doc.setDrawColor(...COLORS.border);
            doc.setLineWidth(0.3);
            doc.line(rx + 4, y + 23, rx + rightW - 4, y + 23);

            // Total general destacado
            setText(11, "bold", COLORS.text);
            doc.text("TOTAL GENERAL", rx + 4, y + 33);

            setText(12, "bold", COLORS.blue);
            doc.text(
                this.formatedCurrency(total, this.data.fomates.nio),
                rx + rightW - 4,
                y + 33,
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