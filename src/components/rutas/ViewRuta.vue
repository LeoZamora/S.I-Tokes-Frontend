<template>
    <v-dialog v-model="localShow" max-width="600" persistent>
        <v-card id="diag-fact">
            <v-card-title class="bg-indigo-darken-4 d-flex align-center">
                <h5><v-icon>mdi-file-document-outline</v-icon>ruta</h5>
                <v-spacer />
                <v-btn icon size="small" color="white" variant="tonal" @click="closeDialog()">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top" text="Cerrar" />
                </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text id="body-card" >
                <v-card-subtitle class="d-flex align-center mb-2">
                    <small class="font-weight-bold">GENERALES</small>
                    <v-spacer />
                    <v-chip size="small" :color="data.ruta.estado ? 'green' : 'errror'" :text="data.ruta.estado ? 'Activa' : 'Inactiva'" />
                </v-card-subtitle>
                <v-row>
                    <v-col cols="12" md="12" sm="12">
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey"> Código Ruta:</small>
                            <small><strong>{{ data.ruta.codigo }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Nombre:</small>
                            <small><strong>{{ data.ruta.nombre }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Gestor:</small>
                            <small><strong>{{ data.ruta.gestor }}</strong></small>
                        </div>
                        <v-divider class="my-2" />
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Fecha Registro:</small>
                            <small><strong>{{ formateDate(data.ruta.fechaRegistro) }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Fecha Última Mod:</small>
                            <small><strong>{{ formateDate(data.ruta.fechaRegistro) }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Usuario Registro:</small>
                            <small><strong>{{ data.ruta.usuarioRegistro }}</strong></small>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-1">
                            <small class="text-grey">Usuario Última Mod:</small>
                            <small><strong>{{ data.ruta.usuarioUltMod }}</strong></small>
                        </div>
                    </v-col>
                </v-row>
                <v-card-subtitle class="d-flex align-center text-center my-4">                    
                    <small class="font-weight-bold">DETALLES</small>
                    <v-divider/>
                </v-card-subtitle>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table class="border rounded font" density="compact" :headers="data.headers" 
                            :items="data.ruta.coberturasRuta" hide-default-footer :row-props="setStyle" 
                            :header-props="{ class: 'font-weight-bold text-uppercase' }">
                        </v-data-table>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-textarea v-model="data.ruta.descripcion" density="compact" variant="outlined" 
                            hide-details label="Observaciones" placeholder="ingrese algunos detalles de la ruta" 
                            persistent-placeholder rows="3"/>                        
                    </v-col>
                </v-row>

            </v-card-text>

            <v-divider/>
            <v-card-actions>
                <v-btn color="grey" variant="outlined" @click="closeDialog()">
                    Cerrar
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
        ruta: {
            type: Object,
            required: false
        }
    },

    setup(props) {
        const getRuta = async (id) => {
            return await data.requestHttp.getByIdRuta(id)
        }

        const localShow = ref(props.show)
        const localRuta = ref(props.ruta)
        watch(() => props.ruta, (val) => {
            localRuta.value = val
        })
        watch(() => props.show, async (val) => {
            localShow.value = val
            
            if (val === true) {
                const result = await getRuta(localRuta.value.idRuta)
                data.ruta = result  
            }
        })

        const data = reactive({
            headers: [
                {title: '', key: 'opc', align: 'center'},
                {title: 'Departamento', key: 'departamento', align: 'center'},
                {title: 'Municipio', key: 'municipio', align: 'center'},
                {title: 'Observaciones', key: 'observaciones', align: 'center'},
            ],
            items: [],
            ruta:{
                codigo: null,
                nombre: null,
                descripcion: null,
                gestor: null,
                fechaRegistro: null,
                fechaUltMod: null,
                usuarioRegistro: null,
                usuarioUltMod: null,
                estado: true,   
                coberturasRuta: []
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
        setStyle({index}) {
            return {
                class: index % 2 === 0 ? 'bg-white' : 'bg-indigo-lighten-5',
            }
        },
        
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
            this.data.items = []
            this.data.ruta.subTotal = 0.00
            this.data.ruta.total = 0.00
            this.data.ruta.usdTotal = 0.00
            this.data.venta = {}
            this.data.editVenta = {}
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
            doc.text("ruta", pageWidth / 2, 15, { align: "center" });

            // Información general
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0);

            const lineSpacing = 6;
            let currentY = 25;

            const generales = [
                `Nº ruta: ${this.data.venta.noVenta || ''}`,
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
                `Sub Total: ${this.formatedCurrency(this.data.ruta.subTotal, this.data.fomates.nio)}`,
                `TOTAL: ${this.formatedCurrency(this.data.ruta.total, this.data.fomates.nio)}`,
            ];
            if (this.data.usd) {
                totalLines.push(`TOTAL $: ${this.formatedCurrency(this.data.ruta.usdTotal, this.data.fomates.usd)}`);
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

            doc.save(`ruta_${this.data.venta.noVenta}.pdf`);
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
}
</style>