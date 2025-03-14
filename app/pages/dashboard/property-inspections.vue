<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <span class="text-h5">Inspections</span>
            <v-badge
              :content="inspections.length"
              color="primary"
              class="ml-2"
            ></v-badge>
            <v-spacer></v-spacer>

            <!-- Barre de recherche -->
            <v-text-field
              v-model="q"
              prepend-icon="mdi-magnify"
              placeholder="Filtrer les inspections..."
              class="mx-4"
              hide-details
              density="comfortable"
              variant="outlined"
              style="max-width: 300px"
            >
              <template v-slot:append>
                <v-btn
                  variant="text"
                  icon="mdi-keyboard"
                  size="small"
                >/</v-btn>
              </template>
            </v-text-field>

            <v-btn
              color="white"
              variant="outlined"
              prepend-icon="mdi-plus"
              @click="openNewInspectionModal"
            >
              Nouvelle inspection
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectedStatuses"
                  :items="defaultStatuses"
                  label="Statut"
                  multiple
                  chips
                  variant="outlined"
                  prepend-icon="mdi-check-circle"
                ></v-select>
              </v-col>
            </v-row>

            <v-data-table
              v-model="selected"
              :headers="defaultColumns"
              :items="inspections"
              :loading="pending"
              show-select
            >
              <template v-slot:item.date="{ item }">
                {{ formatDate(item.date) }}
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  :variant="item.status === 'Submitted' ? 'elevated' : 'tonal'"
                  class="text-capitalize text-white"
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.who="{ item }">
                <span class="text-capitalize">{{ item.who }}</span>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  variant="outlined"
                  color="white"
                  class="text-white"
                  size="small"
                  @click="openViewModal(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                  Show
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de visualisation -->
    <v-dialog v-model="isViewInspectionModalOpen" max-width="800">
      <v-card v-if="selectedInspection" style="background-color: #1a2436;">
        <v-card-title class="d-flex align-center">
          <span class="text-h6">Détails de l'inspection</span>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="handleModalClose"
          ></v-btn>
        </v-card-title>
        <v-card-text>
          <PropertyInspectionShow
            :inspection="selectedInspection"
            @close="handleModalClose"
            @update="handleInspectionUpdate"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal de création -->
    <v-dialog v-model="isNewInspectionModalOpen" max-width="1000">
      <v-card style="background-color: #1a2436;">
        <v-card-title class="d-flex align-center pa-4">
          <span class="text-h6">Nouvelle Inspection</span>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="closeNewInspectionModal"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form @submit.prevent="storeInspection">
            <v-row>
              <!-- Colonne gauche : Propriété et détails estate -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="mb-4">
                  <v-card-title>Propriété</v-card-title>
                  <v-card-text>
                    <div v-if="!selectedEstateForInspection">
                      <v-btn
                        block
                        color="primary"
                        variant="outlined"
                        @click="openEstateSelectionModal"
                      >
                        Sélectionner une propriété
                      </v-btn>
                    </div>
                    <div v-else class="pa-4 bg-grey-lighten-4 rounded">
                      <p class="text-subtitle-1 font-weight-bold mb-2">Propriété sélectionnée :</p>
                      <p>
                        {{ selectedEstateForInspection.title }}<br>
                        {{ selectedEstateForInspection.location }}<br>
                        {{ formatPrice(selectedEstateForInspection.price) }}
                      </p>
                      <v-btn
                        color="primary"
                        variant="text"
                        class="mt-2"
                        @click="openEstateSelectionModal"
                      >
                        Modifier la propriété
                      </v-btn>
                    </div>

                    <!-- Inputs estate details -->
                    <div v-if="!selectedEstateForInspection" class="mt-4">
                      <v-text-field
                        v-model="formData.estate_name"
                        label="Nom de l'établissement"
                        variant="outlined"
                        density="comfortable"
                      ></v-text-field>

                      <v-text-field
                        v-model="formData.location"
                        label="Localisation"
                        variant="outlined"
                        density="comfortable"
                      ></v-text-field>

                      <v-text-field
                        v-model="formData.title"
                        label="Titre"
                        variant="outlined"
                        density="comfortable"
                      ></v-text-field>

                      <v-text-field
                        v-model="formData.price"
                        label="Prix"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                      ></v-text-field>

                      <v-textarea
                        v-model="formData.description"
                        label="Description"
                        variant="outlined"
                        density="comfortable"
                      ></v-textarea>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Colonne droite : Date, Commentaires et Configuration -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="mb-4">
                  <v-card-title>Détails de l'inspection</v-card-title>
                  <v-card-text>
                    <v-text-field
                      v-model="inspectionDate"
                      label="Date"
                      type="date"
                      variant="outlined"
                      density="comfortable"
                      required
                    ></v-text-field>

                    <v-textarea
                      v-model="inspectionComments"
                      label="Commentaires"
                      variant="outlined"
                      density="comfortable"
                      placeholder="Ajoutez vos observations..."
                    ></v-textarea>
                  </v-card-text>
                </v-card>

                <!-- Configuration -->
                <v-card
                  v-if="!selectedEstateForInspection"
                  variant="outlined"
                  color="primary"
                  class="mb-4"
                >
                  <v-card-title class="text-uppercase">
                    Configuration de l'inspection
                  </v-card-title>
                  <v-card-text>
                    <p class="text-body-2 mb-4">
                      Indiquez le nombre d'étages et configurez les pièces par étage.
                    </p>

                    <v-text-field
                      v-model.number="numFloors"
                      label="Nombre d'étages"
                      type="number"
                      min="1"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>

                    <template v-if="numFloors > 0">
                      <v-expansion-panels>
                        <v-expansion-panel
                          v-for="(floor, index) in floorsConfig"
                          :key="index"
                        >
                          <v-expansion-panel-title>
                            Étage {{ index + 1 }}
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <v-text-field
                              v-model="floor.label"
                              label="Nom de l'étage"
                              variant="outlined"
                              density="comfortable"
                              placeholder="Par exemple: Rez-de-chaussée, 1er étage"
                            ></v-text-field>

                            <v-row>
                              <v-col cols="12" sm="6">
                                <p class="text-subtitle-1 font-weight-bold mb-2">
                                  Pièces principales
                                </p>
                                <div
                                  v-for="room in roomTypes.mainRooms"
                                  :key="room"
                                  class="d-flex align-center mb-2"
                                >
                                  <v-checkbox
                                    v-model="floor.rooms[room]"
                                    :label="room"
                                    hide-details
                                    class="mr-4"
                                  ></v-checkbox>
                                  <v-text-field
                                    v-if="floor.rooms[room] !== undefined"
                                    v-model.number="floor.rooms[room]"
                                    type="number"
                                    min="1"
                                    variant="outlined"
                                    density="comfortable"
                                    style="max-width: 100px"
                                    hide-details
                                  ></v-text-field>
                                </div>
                              </v-col>

                              <v-col cols="12" sm="6">
                                <p class="text-subtitle-1 font-weight-bold mb-2">
                                  Pièces techniques
                                </p>
                                <div
                                  v-for="room in roomTypes.technicalRooms"
                                  :key="room"
                                  class="d-flex align-center mb-2"
                                >
                                  <v-checkbox
                                    v-model="floor.rooms[room]"
                                    :label="room"
                                    hide-details
                                    class="mr-4"
                                  ></v-checkbox>
                                  <v-text-field
                                    v-if="floor.rooms[room] !== undefined"
                                    v-model.number="floor.rooms[room]"
                                    type="number"
                                    min="1"
                                    variant="outlined"
                                    density="comfortable"
                                    style="max-width: 100px"
                                    hide-details
                                  ></v-text-field>
                                </div>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </template>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <div class="d-flex justify-end mt-4">
              <v-btn
                type="submit"
                color="success"
                :loading="newInspectionLoading"
                size="large"
              >
                {{ newInspectionLoading ? "Création..." : "Créer l'inspection" }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal de sélection de propriété -->
    <v-dialog v-model="isEstateSelectionModalOpen" max-width="500">
      <v-card style="background-color: #1a2436;">
        <v-card-title class="d-flex align-center pa-4">
          <span class="text-h6">Sélectionnez une propriété</span>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="closeEstateSelectionModal"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-list>
            <v-list-item
              v-for="estate in estatesList"
              :key="estate.id"
              @click="selectEstate(estate)"
              class="mb-2"
            >
              <v-list-item-title class="font-weight-bold">
                {{ estate.title }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ estate.location }} - {{ formatPrice(estate.price) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch } from '#app'
import type { PropertyInspection, Estate } from '~/types'
import axios from 'axios'
import PropertyInspectionShow from '~/components/dashboard/PropertyInspectionShow.vue'

const defaultColumns = [
  { key: 'id', title: '#' },
  { key: 'estate_id', title: 'Propriété', sortable: true },
  { key: 'user_id', title: 'Inspecteur', sortable: true },
  { key: 'who', title: 'Type de client', sortable: true },
  { key: 'date', title: 'Date', sortable: true },
  { key: 'status', title: 'Statut', sortable: true },
  { key: 'actions', title: 'Actions', sortable: false }
]

const defaultStatuses = ['Submitted', 'Approved', 'Rejected', 'In Progress', 'Completed', 'Closed']

const q = ref('')
const selected = ref<PropertyInspection[]>([])
const selectedStatuses = ref([])
const sort = ref({ column: 'id', direction: 'asc' as const })
const isNewInspectionModalOpen = ref(false)
const isViewInspectionModalOpen = ref(false)
const selectedInspection = ref<PropertyInspection | null>(null)

// Ajout de la variable userId
const userId = ref<number | null>(null)

// Fonction pour récupérer l'utilisateur
const fetchUser = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/user', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    console.log('marcyl', response.data)
    if (response.data) {
      userId.value = response.data.id
      // Une fois l'utilisateur récupéré, on charge les inspections
      await fetchPropertyInspections()
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
  }
}

// États du formulaire
const newInspectionLoading = ref(false)
const inspectionDate = ref('')
const inspectionComments = ref('')

const formData = ref({
  estateId: '',
  userId: '',
  status: '',
  who: '',
  config: '',
  date: '',
  comments: '',
  level: '',
  roomType: '',
  roomCount: 0,
  additionalInfo: '',
  details: '',
  pieces: '',
  estate_name: '',
  location: '',
  title: '',
  price: '',
  description: ''
})

// Configuration multi-floor
const numFloors = ref(0)
const floorsConfig = ref<{ label: string; rooms: Record<string, number> }[]>([])

watchEffect(() => {
  floorsConfig.value = Array(numFloors.value).fill(null).map((_, i) => ({
    label: `Étage ${i + 1}`,
    rooms: {}
  }))
})

// Configuration des types de pièces
const roomTypes = {
  mainRooms: ['Entrée', 'Salon', 'Salle à manger', 'Chambres', 'Bureaux'],
  technicalRooms: ['Cuisine', 'Salle de bain', 'WC', 'Buanderie', 'Garage', 'Cave', 'Grenier']
}

// Sélection de propriété
const isEstateSelectionModalOpen = ref(false)
const selectedEstateForInspection = ref<Estate | null>(null)
const estatesList = ref<Estate[]>([])

async function fetchEstates() {
  // try {
    if (!userId.value) return

    const response = await axios.get(
      `http://127.0.0.1:8000/api/estates/${userId.value}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    //if (response.data.status === 'success') {
    console.log('marcyl', response.data)
    estatesList.value = response.data.data
    //}
  // } catch (error) {
  //   console.error('Error fetching estates:', error)
  // }
}

function openEstateSelectionModal() {
  fetchEstates()
  isEstateSelectionModalOpen.value = true
}

function closeEstateSelectionModal() {
  isEstateSelectionModalOpen.value = false
}

function selectEstate(estate: Estate) {
  selectedEstateForInspection.value = estate
  formData.value.estateId = String(estate.id)
  closeEstateSelectionModal()
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

// Gestion des modals
function openNewInspectionModal() {
  isNewInspectionModalOpen.value = true
}

function closeNewInspectionModal() {
  isNewInspectionModalOpen.value = false
}

// Récupération des inspections
const data = ref<{ data: PropertyInspection[] }>({ data: [] })
const pending = ref(false)
const error = ref(null)

const inspections = computed(() => data.value?.data ?? [])

const fetchPropertyInspections = async () => {
  try {
    if (!userId.value) return
    
    pending.value = true
    const response = await axios.get(
      `http://127.0.0.1:8000/api/property-inspections/${userId.value}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-XSRF-TOKEN': useCookie('X-XSRF-TOKEN').value
        }
      }
    )
    console.log('xyz', response.data.data)
    data.value = { data: response.data.data }
  } catch (err) {
    error.value = err
    console.error('Erreur lors de la récupération des inspections:', err)
  } finally {
    pending.value = false
  }
}

function openViewModal(inspection: PropertyInspection) {
  selectedInspection.value = inspection
  isViewInspectionModalOpen.value = true
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Submitted':
      return 'primary' // Bleu pour les nouvelles soumissions
    case 'Approved':
      return 'success-darken-2' // Vert foncé pour approuvé
    case 'Rejected':
      return 'error' // Rouge pour rejeté
    case 'In Progress':
      return 'amber-darken-2' // Orange/Ambre pour en cours
    case 'Completed':
      return 'teal-darken-1' // Bleu-vert pour complété
    case 'Closed':
      return 'grey-darken-1' // Gris foncé pour fermé
    default:
      return 'grey'
  }
}

const storeInspection = async () => {
  if (!userId.value) return
  
  newInspectionLoading.value = true
  try {
    const configPayload = selectedEstateForInspection.value
      ? null
      : JSON.stringify(flattenInspectionConfig())

    const payload = {
      estate_id: selectedEstateForInspection.value ? selectedEstateForInspection.value.id : null,
      user_id: userId.value,
      status: 'Submitted',
      who: formData.value.who || 'particulier',
      config: configPayload,
      date: inspectionDate.value,
      comments: inspectionComments.value,
      estate_name: !selectedEstateForInspection.value ? formData.value.estate_name : null,
      location: !selectedEstateForInspection.value ? formData.value.location : null,
      title: !selectedEstateForInspection.value ? formData.value.title : null,
      price: !selectedEstateForInspection.value ? formData.value.price : null,
      description: !selectedEstateForInspection.value ? formData.value.description : null
    }

    await axios.post('http://127.0.0.1:8000/api/property-inspections', payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-XSRF-TOKEN': useCookie('X-XSRF-TOKEN').value
      }
    })

    closeNewInspectionModal()
    resetForm()
    await fetchPropertyInspections()
  } catch (err: any) {
    console.error('Erreur lors de la création de l\'inspection:', err.response?.data)
  } finally {
    newInspectionLoading.value = false
  }
}

const resetForm = () => {
  inspectionDate.value = ''
  inspectionComments.value = ''
  selectedEstateForInspection.value = null
  formData.value = {
    estateId: '',
    userId: userId.value?.toString() || '',
    status: '',
    who: '',
    config: '',
    date: '',
    comments: '',
    level: '',
    roomType: '',
    roomCount: 0,
    additionalInfo: '',
    details: '',
    pieces: '',
    estate_name: '',
    location: '',
    title: '',
    price: '',
    description: ''
  }
  numFloors.value = 0
  floorsConfig.value = []
}

function flattenInspectionConfig() {
  const result: Record<string, string[]> = {}

  floorsConfig.value.forEach((floor) => {
    if (!floor.label) {
      console.error('Le nom de l\'étage est requis')
      return
    }

    const roomsArray: string[] = []

    Object.entries(floor.rooms).forEach(([room, quantity]) => {
      if (quantity > 0) {
        roomsArray.push(`${room}|${quantity}`)
      }
    })

    if (roomsArray.length > 0) {
      result[floor.label] = roomsArray
    }
  })

  return result
}

const handleModalClose = async () => {
  isViewInspectionModalOpen.value = false
  await fetchPropertyInspections()
}

const handleInspectionUpdate = async (inspection: PropertyInspection) => {
  if (selectedInspection.value) {
    selectedInspection.value = inspection
  }
  await fetchPropertyInspections()
}

onMounted(() => {
  fetchUser()
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-data-table {
  background-color: transparent !important;
}

@media (max-width: 600px) {
  .v-toolbar-title {
    font-size: 1.2rem !important;
  }
}

/* Styles pour les chips de statut */
.v-chip {
  color: white !important;
}

.v-chip.v-chip--variant-elevated,
.v-chip.v-chip--variant-tonal {
  opacity: 1 !important;
}

/* Style pour le bouton Show */
.v-btn.v-btn--variant-outlined.text-white {
  transition: all 0.3s ease;
}

.v-btn.v-btn--variant-outlined.text-white:hover {
  background-color: white !important;
  color: #1a2436 !important;
}

.v-btn.v-btn--variant-outlined.text-white:hover .v-icon {
  color: #1a2436 !important;
}
</style>
