<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { use } from "echarts/core"
import { LineChart } from "echarts/charts"
import { 
  TooltipComponent,
  GridComponent 
} from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import VChart from "vue-echarts"

// Enregistrer uniquement les composants nécessaires
use([
  LineChart,
  TooltipComponent,
  GridComponent,
  CanvasRenderer
])

const cardRef = ref<HTMLElement | null>(null)

// Récupération des property inspections
const inspections = ref([])

const userId = localStorage.getItem('userId'); // Récupérer l'userId

const fetchInspections = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/property-inspections/${userId}`)
    inspections.value = response.data.data
  } catch (error) {
    console.error('Error fetching inspections:', error)
  }
}

interface RevenueItem {
  name: string;
  value: number;
}

// Calcul des revenus par année
const revenueData = computed(() => {
  const revenueByYear = {}

  inspections.value.forEach(inspection => {
    const year = new Date(inspection.date).getFullYear()
    const price = parseFloat(inspection.estate.price) // Convertir la chaîne en nombre

    if (!isNaN(price)) {
      if (!revenueByYear[year]) {
        revenueByYear[year] = 0
      }
      revenueByYear[year] += price
    } else {
      console.warn('Invalid price format for inspection:', inspection)
    }
  })

  return Object.entries(revenueByYear).map(([year, revenue]) => ({
    name: year,
    value: revenue
  }))
})

// Configuration du graphique ECharts
const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const data = params[0]
      return `${data.name}: $${data.value.toLocaleString()}`
    }
  },
  grid: {
    top: 10,
    right: 30,
    bottom: 30,
    left: 60
  },
  xAxis: {
    type: 'category',
    data: revenueData.value.map(item => item.name),
    axisLine: {
      lineStyle: {
        color: 'rgb(var(--color-gray-400))'
      }
    },
    axisTick: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: 'rgb(var(--color-gray-200))'
      }
    }
  },
  series: [
    {
      type: 'line',
      data: revenueData.value.map(item => item.value),
      smooth: true,
      showSymbol: false,
      itemStyle: {
        color: 'rgb(var(--color-primary-DEFAULT))'
      },
      areaStyle: {
        color: 'rgb(var(--color-primary-DEFAULT))',
        opacity: 0.1
      }
    }
  ]
}))

onMounted(() => {
  fetchInspections()
})
</script>

<template>
  <UDashboardCard
    ref="cardRef"
    :ui="{ body: { padding: '!pb-3 !px-0' } as any }"
  >
    <template #header>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
          Revenue
        </p>
        <p class="text-3xl text-gray-900 dark:text-white font-semibold">
          ${{ revenueData.reduce((acc: number, item: RevenueItem) => acc + item.value, 0).toLocaleString() }}
        </p>
      </div>
    </template>

    <v-chart
      class="h-96 w-full"
      :option="chartOption"
      autoresize
    />
  </UDashboardCard>
</template>

<style scoped>
.dark {
  .echarts {
    background-color: transparent !important;
  }
}
</style>
