<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const chartData = ref({
  labels: [],
  datasets: []
})

const fetchEstatesData = async () => {
  try {
    const response = await axios.get('estates')
    const estates = response.data

    // Trier les estates par ID et par prix pour avoir un ordre constant
    const sortedEstates = estates.sort((a, b) => {
      // D'abord par ID pour garantir un ordre stable
      if (a.id !== b.id) {
        return a.id - b.id
      }
      // Ensuite par prix si les IDs sont égaux
      return parseFloat(a.price) - parseFloat(b.price)
    })
    
    chartData.value = {
      labels: sortedEstates.map(estate => `#${estate.id} - ${estate.title.substring(0, 15)}...`),
      datasets: [{
        label: 'Prix des propriétés',
        data: sortedEstates.map(estate => parseFloat(estate.price)),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }]
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error)
  }
}

onMounted(() => {
  fetchEstatesData()
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Prix (€)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Propriétés'
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    title: {
      display: true,
      text: 'Distribution des prix des propriétés',
      font: {
        size: 16
      }
    }
  }
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <Bar :data="chartData" :options="chartOptions" class="h-[400px]" />
  </div>
</template> 