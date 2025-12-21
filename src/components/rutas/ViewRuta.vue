<template>
    <v-dialog v-model="localShow" max-width="700" persistent>
        <v-card id="diag-fact" class="rounded" elevation="8">
            <!-- Header con gradiente y título -->
            <v-card-title class="pa-5 d-flex align-center" style="background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);">
                <v-avatar size="44" color="white" class="mr-3" variant="flat">
                    <v-icon color="#1a237e" size="24">mdi-map-marker-path</v-icon>
                </v-avatar>
                <div class="text-white">
                    <h5 class="text-h6 font-weight-bold mb-1">
                        VISUALIZACIÓN DE RUTA
                    </h5>
                    <div class="text-caption text-grey-lighten-3">
                        Detalles completos de la configuración
                    </div>
                </div>
                <v-spacer />
                <v-btn icon color="white" variant="text" @click="closeDialog()" size="small">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="pa-5" style="background-color: #f8f9fa;">
                <!-- Estado y código de ruta -->
                <v-card variant="flat" color="white" class="mb-4 pa-4 rounded-lg border" elevation="1">
                    <div class="d-flex justify-space-between align-center">
                        <div>
                            <div class="text-caption text-grey-darken-2 mb-1">
                                CÓDIGO DE RUTA
                            </div>
                            <div class="text-h5 font-weight-bold text-indigo-darken-4">
                                {{ data.ruta.codigo }}
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-caption text-grey-darken-2 mb-1">
                                ESTADO ACTUAL
                            </div>
                            <v-chip :color="data.ruta.estado ? 'green-darken-1' : 'red-darken-1'" 
                                variant="flat" size="small" class="font-weight-bold">
                                <v-icon size="small" class="mr-1">
                                    {{ data.ruta.estado ? 'mdi-check-circle' : 'mdi-close-circle' }}
                                </v-icon>
                                {{ data.ruta.estado ? 'ACTIVA' : 'INACTIVA' }}
                            </v-chip>
                        </div>
                    </div>
                </v-card>

                <!-- Sección GENERALES -->
                <v-card variant="flat" color="white" class="mb-5 rounded-lg border" elevation="1">
                    <v-card-title class="pa-4" style="background-color: #e8eaf6;">
                    <div class="d-flex align-center">
                        <v-icon color="indigo-darken-3" size="small" class="mr-2">
                            mdi-information
                        </v-icon>
                        <span class="text-subtitle-2 font-weight-bold">
                            INFORMACIÓN GENERAL
                        </span>
                    </div>
                    </v-card-title>
                    <v-card-text class="pa-4">
                    <v-row dense>
                        <v-col cols="12" md="6">
                        <div class="mb-4">
                            <div class="text-caption text-grey-darken-2 mb-1">
                                NOMBRE DE LA RUTA
                            </div>
                            <div class="text-body-1 font-weight-bold">
                                {{ data.ruta.nombre }}
                            </div>
                        </div>
                        <div>
                            <div class="text-caption text-grey-darken-2 mb-1">
                                GESTOR ASIGNADO
                            </div>
                            <div class="text-body-1 font-weight-bold">
                                {{ data.ruta.gestor }}
                            </div>
                        </div>
                        </v-col>
                        
                        <v-col cols="12" md="6">
                        <v-card variant="outlined" color="indigo-lighten-5" class="pa-3 rounded-lg">
                            <div class="text-caption text-grey-darken-2 mb-2">
                                DESCRIPCIÓN
                            </div>
                            <div class="text-body-2 text-grey-darken-3">
                                {{ data.ruta.descripcion || 'Sin descripción registrada' }}
                            </div>
                        </v-card>
                        </v-col>
                    </v-row>
                    </v-card-text>
                </v-card>

                <!-- Sección de REGISTRO -->
                <v-card variant="flat" color="white" class="mb-5 rounded-lg border" elevation="1">
                    <v-card-title class="pa-4" style="background-color: #e8eaf6;">
                    <div class="d-flex align-center">
                        <v-icon color="indigo-darken-3" size="small" class="mr-2">
                            mdi-history
                        </v-icon>
                        <span class="text-subtitle-2 font-weight-bold">
                            HISTORIAL DE REGISTRO
                        </span>
                    </div>
                    </v-card-title>
                    <v-card-text class="pa-4">
                    <v-row dense>
                        <v-col cols="12" md="6">
                        <div class="mb-3">
                            <div class="d-flex align-center mb-2">
                                <v-icon color="green" size="small" class="mr-2">
                                    mdi-calendar-check
                                </v-icon>
                                <div class="text-caption text-grey-darken-2">
                                    FECHA DE REGISTRO
                                </div>
                            </div>
                            <div class="text-body-1 font-weight-medium pl-4">
                                {{ formateDate(data.ruta.fechaRegistro) }}
                            </div>
                        </div>
                        <div>
                            <div class="d-flex align-center mb-2">
                            <v-icon color="green" size="small" class="mr-2">mdi-account-check</v-icon>
                            <div class="text-caption text-grey-darken-2">
                                USUARIO REGISTRO
                            </div>
                            </div>
                            <div class="text-body-1 font-weight-medium pl-4">
                                {{ data.ruta.usuarioRegistro }}
                            </div>
                        </div>
                        </v-col>
                        
                        <v-col cols="12" md="6">
                        <div class="mb-3">
                            <div class="d-flex align-center mb-2">
                            <v-icon color="blue" size="small" class="mr-2">
                                mdi-calendar-sync
                            </v-icon>
                            <div class="text-caption text-grey-darken-2">
                                ÚLTIMA MODIFICACIÓN
                            </div>
                            </div>
                            <div class="text-body-1 font-weight-medium pl-4">
                                {{ formateDate(data.ruta.fechaRegistro) }}
                            </div>
                        </div>
                        <div>
                            <div class="d-flex align-center mb-2">
                                <v-icon color="blue" size="small" class="mr-2">
                                    mdi-account-sync
                                </v-icon>
                                <div class="text-caption text-grey-darken-2">
                                    USUARIO ÚLTIMA MOD.
                                </div>
                            </div>
                            <div class="text-body-1 font-weight-medium pl-4">
                                {{ data.ruta.usuarioUltMod }}
                            </div>
                        </div>
                        </v-col>
                    </v-row>
                    </v-card-text>
                </v-card>

                <!-- Sección de COBERTURAS -->
                <v-card variant="flat" class="rounded-lg overflow-hidden border" elevation="2">
                    <v-card-title class="pa-4" style="background-color: #e8eaf6;">
                        <div class="d-flex align-center justify-space-between w-100">
                            <div class="d-flex align-center">
                                <v-icon color="indigo-darken-3" size="small" class="mr-2">mdi-map-legend</v-icon>
                                <span class="text-subtitle-2 font-weight-bold">COBERTURAS ASIGNADAS</span>
                            </div>
                            <v-chip size="small" color="indigo" variant="flat">
                                {{ data.ruta.coberturasRuta.length || 0 }} ubicaciones
                            </v-chip>
                        </div>
                    </v-card-title>
                    
                    <v-data-table 
                        class="elevation-0"
                        density="comfortable" 
                        :headers="data.headers" 
                        :items="data.ruta.coberturasRuta"
                        hide-default-footer
                        :row-props="setStyle"
                        :header-props="{
                            class: 'text-uppercase font-weight-bold bg-indigo-lighten-5'
                        }"
                        >
                        <template v-slot:no-data>
                            <div class="pa-6 text-center">
                                <v-icon size="large" color="grey-lighten-1" class="mb-3">mdi-map-outline</v-icon>
                                <div class="text-body-1 text-grey mb-1">
                                    No hay coberturas registradas
                                </div>
                                <div class="text-caption text-grey">
                                    Esta ruta no tiene ubicaciones asignadas
                                </div>
                            </div>
                        </template>
                        
                        <template v-slot:item.actions="{ }">
                            <v-icon size="small" color="indigo">mdi-map-marker</v-icon>
                        </template>
                    </v-data-table>
                </v-card>

                <!-- Observaciones -->
                <v-card variant="flat" color="white" class="mt-4 rounded-lg border" elevation="1">
                    <v-card-title class="pa-3" style="background-color: #f5f5f5;">
                        <div class="d-flex align-center">
                            <v-icon color="grey-darken-2" size="small" class="mr-2">mdi-text-box-outline</v-icon>
                            <span class="text-subtitle-2 font-weight-bold">OBSERVACIONES</span>
                        </div>
                    </v-card-title>
                    <v-card-text class="pa-4">
                        <v-textarea 
                            v-model="data.ruta.descripcion" 
                            density="compact" 
                            variant="plain" 
                            hide-details 
                            label="Detalles adicionales"
                            placeholder="No hay observaciones registradas"
                            persistent-placeholder 
                            rows="3"
                            auto-grow
                            readonly
                            bg-color="grey-lighten-5"
                            class="rounded-lg"
                        />
                    </v-card-text>
                </v-card>
            </v-card-text>

            <!-- Footer -->
            <v-divider thickness="2" />
            <v-card-actions class="pa-4 bg-white">
            <v-btn 
                color="grey-darken-2" 
                variant="outlined" 
                @click="closeDialog()"
                class="px-5"
                rounded="lg"
                prepend-icon="mdi-close-circle"
            >
                Cerrar Vista
            </v-btn>
            
            <v-spacer />
            
            <v-chip 
                v-if="data.ruta.estado" 
                color="green-lighten-5" 
                variant="outlined" 
                class="px-3"
            >
                <v-icon size="small" color="green" class="mr-1">mdi-check</v-icon>
                Ruta operativa
            </v-chip>
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