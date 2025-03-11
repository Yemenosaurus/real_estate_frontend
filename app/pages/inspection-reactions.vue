<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'

interface Estate {
  id: number
  name: string
  title: string
}

interface InspectionReaction {
  id: number
  comment: string
  photo: string
  estate_configuration: any
  property_inspection: any
}

interface GroupedReaction {
  estate: Estate
  reactions: InspectionReaction[]
}

const selectedEstate = ref<GroupedReaction | null>(null)
const isViewModalOpen = ref(false)
const q = ref('')
const sort = ref({ column: 'id', direction: 'asc' })
const selected = ref([])
const selectedLevel = ref(null)
const selectedImage = ref<string | null>(null)
const isImagePreviewOpen = ref(false)
const pdfGenerated = ref(false)

const userId = ref(localStorage.getItem('userId'))

const query = computed(() => ({
  q: q.value,
  sort: sort.value.column,
  order: sort.value.direction
}))

const { data, pending, error } = await useFetch<{ data: Estate[] }>(`http://127.0.0.1:8000/api/inspection-reactions/${userId.value}`, {
  params: query.value, // Utiliser params au lieu de query
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
const estates = computed(() => {
  if (!data.value?.data) return []
  return Object.values(data.value.data)
})

const groupedReactionsByLevel = computed(() => {
  if (!selectedEstate.value) return {}
  
  return selectedEstate.value.reactions.reduce((acc, reaction) => {
    const level = reaction.estate_configuration.level
    if (!acc[level]) {
      acc[level] = []
    }
    acc[level].push(reaction)
    return acc
  }, {})
})

const availableLevels = computed(() => {
  if (!selectedEstate.value) return []
  return [...new Set(selectedEstate.value.reactions.map(r => r.estate_configuration.level))].sort()
})

// Sélectionner automatiquement le premier niveau disponible
watch(availableLevels, (newLevels) => {
  if (newLevels.length > 0 && !selectedLevel.value) {
    selectedLevel.value = newLevels[0]
  }
}, { immediate: true })

const columns = [
  {
    key: 'estate',
    label: 'Estate',
    sortable: true
  },
  {
    key: 'estate_title',
    label: 'Titre',
    sortable: true
  },
  {
    key: 'inspection_date',
    label: 'Date d\'inspection',
    sortable: true
  },
  {
    key: 'reactions_count',
    label: 'Nombre de réactions',
    sortable: true
  },
  {
    key: 'actions',
    label: '',
    sortable: false
  }
]

const openViewModal = (row: GroupedReaction) => {
  selectedEstate.value = row
  isViewModalOpen.value = true
}

const openImagePreview = (imageUrl: string) => {
  selectedImage.value = imageUrl
  isImagePreviewOpen.value = true
}

const generatePDF = async (inspectionId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/property-inspections/${inspectionId}/generate-pdf`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf',
        'Content-Type': 'application/json'
      }
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `inspection_${inspectionId}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Afficher la card de satisfaction
    pdfGenerated.value = true
    
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleClose = async () => {
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/property-inspections/${selectedEstate.value.reactions[0].property_inspection.id}/close`
    )

    if (response.data) {
      toast.add({ 
        title: 'Inspection clôturée', 
        icon: 'i-heroicons-check-circle',
        color: 'emerald'
      })

      isViewModalOpen.value = false
    }
  } catch (error) {
    console.error('Error closing inspection:', error)
    toast.add({ 
      title: 'Erreur lors de la clôture', 
      icon: 'i-heroicons-x-circle', 
      color: 'red' 
    })
  }
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="Inspection Reactions"
        :badge="estates.length"
      >
        <template #right>
          <UInput
            v-model="q"
            icon="i-heroicons-funnel"
            autocomplete="off"
            placeholder="Filtrer les réactions..."
            class="hidden lg:block"
            @keydown.esc="$event.target.blur()"
          >
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>
        </template>
      </UDashboardNavbar>

      <UTable
        v-model="selected"
        v-model:sort="sort"
        :rows="estates"
        :columns="columns"
        :loading="pending"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      >
        <template #estate-data="{ row }">
          {{ row.estate.name }}
        </template>

        <template #estate_title-data="{ row }">
          {{ row.estate.title }}
        </template>

        <template #inspection_date-data="{ row }">
          {{ formatDate(row.reactions[0]?.property_inspection?.date) }}
        </template>

        <template #reactions_count-data="{ row }">
          {{ row.reactions.length }}
        </template>

        <template #actions-data="{ row }">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-eye"
            @click="openViewModal(row)"
          />
        </template>
      </UTable>

      <UDashboardModal
        v-model="isViewModalOpen"
        :title="selectedEstate?.estate.name ?? 'Détails des réactions'"
        :ui="{ width: 'sm:max-w-4xl' }"
        :closeOnEscape="false"
        :closeOnClickOutside="false"
      >
        <div v-if="selectedEstate" class="space-y-4">
          <!-- En-tête avec bouton PDF -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex space-x-2">
              <UButton
                v-for="level in availableLevels"
                :key="level"
                :variant="selectedLevel === level ? 'solid' : 'outline'"
                :color="selectedLevel === level ? 'primary' : 'gray'"
                @click="selectedLevel = level"
              >
                Étage {{ level }}
              </UButton>
            </div>

            <div class="space-y-4">
              <UButton
                color="white"
                variant="solid"
                @click="() => generatePDF(selectedEstate.reactions[0].property_inspection.id)"
                class="shadow-sm"
              >
                <template #leading>
                  <i class="i-heroicons-document-arrow-down text-lg" />
                </template>
                Générer PDF
              </UButton>

              <!-- Card de satisfaction -->
              <div v-if="pdfGenerated" class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-3">
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Êtes-vous satisfait du PDF généré ?
                </p>
                <UButton
                  color="emerald"
                  label="Clôturer l'inspection"
                  @click="handleClose"
                />
              </div>
            </div>
          </div>

          <!-- Affichage des réactions pour l'étage sélectionné -->
          <div v-if="selectedLevel !== null" class="grid grid-cols-2 gap-4">
            <div
              v-for="reaction in groupedReactionsByLevel[selectedLevel]"
              :key="reaction.id"
              class="p-4 border rounded-lg flex flex-col h-[300px] relative"
            >
              <!-- Nom de la pièce (30%) -->
              <div class="mb-2 h-[30%]">
                <p class="text-sm text-gray-500">Pièce :</p>
                <p class="font-medium">{{ reaction.estate_configuration.name }}</p>
              </div>

              <!-- Commentaire (30%) -->
              <div class="mb-2 h-[30%]">
                <p class="text-sm text-gray-500">Commentaire :</p>
                <p class="line-clamp-3">{{ reaction.comment || 'Aucun commentaire' }}</p>
              </div>

              <!-- Photo (40%) -->
              <div class="h-[40%] relative">
                <p class="text-sm text-gray-500 mb-1">Photo :</p>
                <div 
                  v-if="reaction.photo_url" 
                  class="relative w-full h-[calc(100%-20px)] group cursor-pointer"
                  @click="openImagePreview(reaction.photo_url)"
                >
                  <img
                    :src="reaction.photo_url"
                    class="w-full h-full object-cover rounded"
                    alt="Photo de la réaction"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded flex items-center justify-center">
                    <i class="i-mdi-eye text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                  </div>
                </div>
                <p v-else class="text-gray-400 italic">Aucune photo</p>
              </div>
            </div>
          </div>

          <!-- Message si aucune réaction pour l'étage sélectionné -->
          <div
            v-if="selectedLevel !== null && (!groupedReactionsByLevel[selectedLevel] || groupedReactionsByLevel[selectedLevel].length === 0)"
            class="text-center py-4 text-gray-500"
          >
            Aucune réaction pour cet étage
          </div>
        </div>
      </UDashboardModal>

      <!-- Nouveau modal pour la prévisualisation d'image -->
      <Teleport to="body">
        <div v-if="isImagePreviewOpen" class="fixed inset-0 z-[9999] flex items-center justify-center">
          <div class="absolute inset-0 bg-black bg-opacity-50" @click="isImagePreviewOpen = false"></div>
          <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-3xl max-h-[80vh] overflow-hidden">
            <button 
              class="absolute top-2 right-2 p-1.5 rounded-full bg-gray-800/50 hover:bg-gray-800/70"
              @click="isImagePreviewOpen = false"
            >
              <i class="i-heroicons-x-mark text-white w-5 h-5" />
            </button>
            <img
              v-if="selectedImage"
              :src="selectedImage"
              class="w-full h-auto max-h-[70vh] object-contain"
              alt="Prévisualisation de la photo"
            />
          </div>
        </div>
      </Teleport>

    </UDashboardPanel>
  </UDashboardPage>
</template> 