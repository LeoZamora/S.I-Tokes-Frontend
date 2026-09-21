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
                        <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">DETALLE DE PRODUCTOS</span>
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
                        <template v-slot:item.subTotal="{ item }">
                            <div class="text-right font-weight-bold text-indigo-darken-3">{{ formatedCurrency(item.subTotal, data.fomates.nio) }}</div>
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
                                <span class="text-caption text-grey-darken-1 font-weight-medium">Sub Total:</span>
                                <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                                    {{ formatedCurrency(data.factura.subTotal, data.fomates.nio) }}
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
            data.factura.subTotal = 0
            data.factura.totalImpuestos = 0
            data.factura.total = 0
            data.factura.usdTotal = 0

            data.items.forEach(item => {
                subTotal += Number(item.subTotal || 0)
            })

            data.factura.subTotal = Number(subTotal.toFixed(2))
            data.factura.totalImpuestos = 0
            data.factura.total = Number(subTotal.toFixed(2))
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
                    data.items.push({
                        idCompra: item.idCompra,
                        idProducto: item.idProducto, 
                        cantidad: cant,
                        costoUnitario: costoUnit,
                        observaciones: item.observaciones,
                        subTotal: sub,
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
            },
            factura: {
                subTotal: 0.00,
                totalImpuestos: 0.00,
                total: 0.00,
                usdTotal: 0.00,
            },
            fomates: {
                nio: "NIO",
                usd: "USD",
            },
            overlay: {
                show: false
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
        closeDialog() {
            this.localShow = false
            this.$emit('closeDialog')
        },
        formatedCurrency(val, cur) {
            return formatters.formatCurrency(val, cur);
        },
        formateDate(val) {
            return formatters.formatedDate(val);
        },
        exportDialogToPDF() {
            const doc = new jsPDF({
                orientation: "p",
                unit: "mm",
                format: "a4",
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const M = 12;

            const COLORS = {
                headerBg: [26, 35, 126],
                headerSub: [197, 202, 233],
                white: [255, 255, 255],
                bgPage: [245, 245, 245],
                cardBg: [255, 255, 255],
                border: [224, 224, 224],
                text: [33, 33, 33],
                muted: [117, 117, 117],
                blue: [40, 53, 147],
                green: [46, 125, 50],
                orange: [239, 108, 0],
                grayHeader: [232, 234, 246],
            };

            const setText = (size = 10, style = "normal", color = COLORS.text) => {
                doc.setFont("helvetica", style);
                doc.setFontSize(size);
                doc.setTextColor(...color);
            };

            const rect = (x, y, w, h, fill = COLORS.white, stroke = COLORS.border, r = 2.5) => {
                doc.setFillColor(...fill);
                doc.setDrawColor(...stroke);
                doc.roundedRect(x, y, w, h, r, r, "FD");
            };

            // Background general
            doc.setFillColor(...COLORS.bgPage);
            doc.rect(0, 0, pageWidth, pageHeight, "F");

            let y = M;

            // ===== Header principal =====
            const headerH = 22;
            doc.setFillColor(...COLORS.headerBg);
            doc.roundedRect(M, y, pageWidth - M * 2, headerH, 3, 3, "F");

            // Icon circle
            const circleR = 7;
            const circleX = M + 8 + circleR;
            const circleY = y + headerH / 2;
            doc.setFillColor(...COLORS.white);
            doc.circle(circleX, circleY, circleR, "F");

            // Icon text inside circle
            setText(11, "bold", COLORS.blue);
            doc.text("🧾", circleX, circleY + 3.5, { align: "center" });

            // Títulos
            const textLeft = circleX + circleR + 6;
            setText(13, "bold", COLORS.white);
            doc.text("ÓRDEN DE COMPRA", textLeft, y + 9);

            const noOrden = this.data.orden?.noOrden || `COMP-${this.data.idOrden || ""}`;
            setText(9.5, "normal", COLORS.headerSub);
            doc.text(`Documento No. ${noOrden}`, textLeft, y + 15.5);

            y += headerH + 6;

            // ===== Card Info General =====
            const infoH = 34;
            rect(M, y, pageWidth - M * 2, infoH, [255, 255, 255]);

            setText(9, "bold", COLORS.blue);
            doc.text("INFORMACIÓN DE LA COMPRA / PROVEEDOR", M + 4, y + 6.5);

            doc.setDrawColor(...COLORS.border);
            doc.setLineWidth(0.3);
            doc.line(M + 4, y + 8.5, pageWidth - M - 4, y + 8.5);

            const proveedor = this.data.orden?.proveedor || "---";
            const bodega = this.data.orden?.bodegaNombre || "Sin asignar";
            const usuario = this.data.orden?.usuarioRegistro || "Sistema";
            const aprobada = this.data.orden?.aprobada ? "SÍ" : "NO";
            const fechaReg = this.formateDate(this.data.orden?.fechaRegistro);
            const estado = this.data.orden?.estado ? "Activa" : "Inactiva";

            const colW = (pageWidth - M * 2 - 8) / 5;
            let cx = M + 4;

            // Col 1: Proveedor
            setText(8, "normal", COLORS.muted);
            doc.text("PROVEEDOR:", cx, y + 14);
            setText(8.8, "bold", COLORS.text);
            const provLines = doc.splitTextToSize(proveedor, colW - 3);
            doc.text(provLines.slice(0, 2), cx, y + 19);

            cx += colW;
            // Col 2: Bodega
            setText(8, "normal", COLORS.muted);
            doc.text("BODEGA DESTINO:", cx, y + 14);
            setText(8.8, "bold", COLORS.blue);
            const bodegaLines = doc.splitTextToSize(bodega, colW - 3);
            doc.text(bodegaLines.slice(0, 2), cx, y + 19);

            cx += colW;
            // Col 3: Registrado por
            setText(8, "normal", COLORS.muted);
            doc.text("REGISTRADO POR:", cx, y + 14);
            setText(8.8, "normal", COLORS.text);
            const userLines = doc.splitTextToSize(usuario, colW - 3);
            doc.text(userLines.slice(0, 2), cx, y + 19);

            cx += colW;
            // Col 4: Aprobada
            setText(8, "normal", COLORS.muted);
            doc.text("APROBADA:", cx, y + 14);
            setText(8.8, "bold", this.data.orden?.aprobada ? COLORS.green : COLORS.muted);
            doc.text(aprobada, cx, y + 19);

            cx += colW;
            // Col 5: Fecha y Estado
            setText(8, "normal", COLORS.muted);
            doc.text("FECHA REGISTRO:", cx, y + 14);
            setText(8.8, "bold", COLORS.text);
            doc.text(fechaReg || "---", cx, y + 19);

            // Chip estado
            const chipW = 20;
            const chipH = 5.5;
            const chipX = cx;
            const chipY = y + 23;
            const isActiva = !!this.data.orden?.estado;

            doc.setFillColor(...(isActiva ? [232, 245, 233] : [255, 243, 224]));
            doc.setDrawColor(...(isActiva ? [76, 175, 80] : [255, 152, 0]));
            doc.roundedRect(chipX, chipY, chipW, chipH, 1.5, 1.5, "FD");

            setText(7.5, "bold", isActiva ? COLORS.green : COLORS.orange);
            doc.text(estado, chipX + chipW / 2, chipY + 3.8, { align: "center" });

            y += infoH + 6;

            // ===== Sección Detalle Productos =====
            const sectionH = 10;
            rect(M, y, pageWidth - M * 2, sectionH, COLORS.grayHeader, COLORS.grayHeader);

            setText(9.5, "bold", COLORS.blue);
            doc.text("DETALLE DE PRODUCTOS", M + 10, y + 6.8);

            setText(12, "bold", COLORS.blue);
            doc.text("🛒", M + 4, y + 6.8);

            y += sectionH;

            // Tabla (dentro del “card”)
            const tableCardY = y;
            const tableCardH = 70;
            rect(M, tableCardY, pageWidth - M * 2, tableCardH, [255, 255, 255]);

            const headers = ["Producto", "Cantidad", "Costo", "SubTotal"];
            const filas = this.data.items.map(item => [
                String(item.producto || ''),
                String(item.cantidad || ''),
                this.formatedCurrency(item.costoUnitario, this.data.fomates.nio),
                this.formatedCurrency(item.subTotal, this.data.fomates.nio),
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

            const afterTableY = doc.lastAutoTable.finalY ?? (tableCardY + 25);
            y = afterTableY + 8;

            // ===== Cards inferiores: Observaciones + Resumen de pago =====
            const bottomGap = 8;
            const leftW = (pageWidth - M * 2 - bottomGap) * 0.58;
            const rightW = (pageWidth - M * 2 - bottomGap) * 0.42;
            const bottomH = 50;

            const observaciones = this.data.orden?.observaciones || "Sin observaciones registradas en la orden...";
            const subTotal = this.data.factura?.subTotal || 0;
            const total = this.data.factura?.total || 0;
            const totalUsd = this.data.factura?.usdTotal || 0;

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
            doc.text("Sub Total", rx + 4, y + 18);

            setText(9.5, "bold", COLORS.text);
            doc.text(
                this.formatedCurrency(subTotal, this.data.fomates.nio),
                rx + rightW - 4,
                y + 18,
                { align: "right" }
            );

            // Línea
            doc.setDrawColor(...COLORS.border);
            doc.setLineWidth(0.3);
            doc.line(rx + 4, y + 25, rx + rightW - 4, y + 25);

            // Total general destacado
            setText(11, "bold", COLORS.text);
            doc.text("TOTAL GENERAL", rx + 4, y + 34);

            setText(12, "bold", COLORS.blue);
            doc.text(
                this.formatedCurrency(total, this.data.fomates.nio),
                rx + rightW - 4,
                y + 34,
                { align: "right" }
            );

            // Equivalente USD
            setText(8.5, "normal", COLORS.muted);
            doc.text("Equiv. USD (T/C 36.6243)", rx + 4, y + 42);

            setText(9, "bold", COLORS.green);
            doc.text(
                this.formatedCurrency(totalUsd, this.data.fomates.usd),
                rx + rightW - 4,
                y + 42,
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