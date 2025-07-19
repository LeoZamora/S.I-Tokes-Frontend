<template>
    <v-card elevation="0" class="bg-transparent">
        <v-card-text class="pa-0 d-flex justify-center aling-center">
            <v-chart id="barra" class="chart text-center" :option="graphOptions" autoresize/>
        </v-card-text>
    </v-card>
</template>

<script>
import { use } from 'echarts';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { computed, watch, ref, onMounted, onUnmounted } from 'vue';
import { useStore } from '@/store';

use([BarChart, CanvasRenderer, GridComponent, TooltipComponent]);

export default {
    props: {
        data: {
            type: Array,
            required: false,
        }
    },

    setup(props) {
        const authStore = useStore();
        const theme = computed(() => authStore.theme);
        const screenWidth = ref(window.innerWidth)
        const isMobile = computed(() => screenWidth.value < 600)

        const updateScreenWidth = () => {
            screenWidth.value = window.innerWidth
        }

        onMounted(() => {
            window.addEventListener('resize', updateScreenWidth)
        })
        onUnmounted(() => {
            window.addEventListener('resize', updateScreenWidth)
        })
 
        // Opciones de la gráfica
        const graphOptions = ref({
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'transparent',
                borderColor: '#6C6CFF',
                textStyle: { color: computed(() => theme.value == 'dark' ? "white" : "#000000"), },
                formatter: (params) => {
                    return `Valor: C$${params[0].value.toLocaleString()}`;
                }
            },
            xAxis: {
                type: 'category',
                data: [],
                axisLabel: {
                    color: computed(() => theme.value == 'dark' ? "white" : "#000000"),
                    fontSize: 14
                },
                axisLine: {
                    lineStyle: { color: "#6C6CFF" },
                }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 0,
                interval: 10000,
                splitLine: {
                    lineStyle: {
                        color: '#757575',
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    color: '#757575',
                    fontSize: 12
                },
                axisLine: {
                    lineStyle: { color: '#6C6CFF' }
                }
            },
            series: []
        });

        // **Observa cambios en `data` y actualiza la gráfica**
        watch(() => props.data, (newData) => {
            const maxValue = Math.max(...newData.map(item => 
                (item.totalCostoSalario || 0) + (item.totalCostoMedios || 0) + (item.totalCostoUniforme || 0)
            ))

             // Ordenar los datos de mayor a menor
            const sortedData = [...newData].sort((a, b) => 
                (b.totalCostoSalario + b.totalCostoMedios + b.totalCostoUniforme) -
                (a.totalCostoSalario + a.totalCostoMedios + a.totalCostoUniforme)
            );

            graphOptions.value.yAxis.max = Math.round(maxValue * 10000) / 10000;

            graphOptions.value.yAxis = {
                type: 'value',
                max: Math.round((maxValue) * 10000)/10000,
                axisLabel: {
                    color: computed(() => theme.value == 'dark' ? 'white' : '#000000'),
                    fontSize: 10
                }
            }
            
            const colors = ["#FF6347", "#6A5ACD", "#3CB371", "#FFA500", "#20B2AA", "#DC143C", "#8A2BE2", "#FF4500"];

            graphOptions.value.xAxis = {
                type: 'category',
                data: sortedData.map(item => item.nombreObjetivo),
                axisLabel: {
                    color: computed(() => theme.value == 'dark' ? "white" : "#000000"),
                    fontSize:  7, // Reduce el tamaño de la fuente
                    rotate: computed(() => isMobile.value ?  15 : 0), // Rota el texto 30 grados para mejorar la visualización
                    interval: 0, // Asegura que todas las etiquetas se muestre
                    fontWeight: "bold",
                },
                axisLine: {
                    lineStyle: { color: "#6C6CFF" },
                }
            };
            graphOptions.value.series = [{
                name: "Costo Total",
                type: "bar",
                data: sortedData.map((item, index) => ({
                    value: item.totalCostoSalario + item.totalCostoMedios + item.totalCostoUniforme,
                    itemStyle: {
                        color: colors[index % colors.length]
                    }
                })),
                barWidth: "50%",
                label: {
                    show: true,
                    position: "top",
                    color: computed(() => theme.value == 'dark' ? "white" : "#000000"),
                    fontWeight: "bold",
                    formatter: (params) => `C$${params.value.toLocaleString()}`,
                },
            }, {
                name: "Costo Promedio",
                type: "line",
                data: sortedData.map(item => 
                    (item.totalCostoSalario || 0) + (item.totalCostoMedios || 0) + (item.totalCostoUniforme || 0)
                ),
                lineStyle: {
                    color: "#3F51B5", // Color de la línea (puedes cambiarlo)
                    width: 1, // Grosor de la línea
                },
                symbol: "circle", // Forma de los puntos en la línea
                symbolSize: 5,
            }, {
                name: 'Picos de Costo',
                type: 'effectScatter',
                data: sortedData.map((item, index) => [
                    index, (item.totalCostoSalario || 0) + (item.totalCostoMedios || 0) + (item.totalCostoUniforme || 0)
                ]),
                itemStyle: {
                    color: "#D32F2F"
                },
                rippleEffect: {
                    scale: 3,
                    brushType: 'stroke'
                },
                symbol: 'circle',
                symbolSize: 10
            }];
        }, { deep: true, immediate: true });

        return {
            authStore,
            graphOptions,
        };
    },

    components: {
        VChart
    }
}
</script>

<style scoped>
.chart {
    width: 100%;
    height: 350px;
}

#barra{
    margin-top: -20px;
}
</style>
