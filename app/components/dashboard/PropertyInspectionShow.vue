<!-- Template -->
<template>
  <div class="max-w-7xl">
    <!-- Informations de l'inspection toujours visibles -->
    <div class="space-y-6">
      <div class="mb-4">
        <h3 class="text-h6">Inspection #{{ inspection.id }}</h3>
      </div>

      <v-row>
        <v-col cols="12" sm="6">
          <v-card variant="outlined" class="h-100">
            <v-card-text>
              <div class="text-subtitle-2 text-grey-darken-1 mb-2">Propriété</div>
              <div class="d-flex align-center">
                <span>{{ inspection.estate?.title }}</span>
                <v-tooltip text="Afficher les infos de la propriété">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-eye"
                      variant="text"
                      size="small"
                      @click="handleShowEstate"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card variant="outlined" class="h-100">
            <v-card-text>
              <div class="text-subtitle-2 text-grey-darken-1 mb-2">ID de l'inspecteur</div>
              <div>{{ inspection.user_id }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card variant="outlined" class="h-100">
            <v-card-text>
              <div class="text-subtitle-2 text-grey-darken-1 mb-2">Date d'inspection</div>
              <div>{{ formatDate(inspection.date) }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card variant="outlined" class="h-100">
            <v-card-text>
              <div class="text-subtitle-2 text-grey-darken-1 mb-2">Statut</div>
              <v-chip
                :color="getStatusColor(inspection.status)"
                :variant="inspection.status === 'Submitted' ? 'elevated' : 'tonal'"
                :class="['text-capitalize', inspection.status === 'Submitted' ? 'text-white' : '']"
              >
                {{ inspection.status }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card variant="outlined">
            <v-card-text>
              <div class="text-subtitle-2 text-grey-darken-1 mb-2">Commentaires</div>
              <div>{{ inspection.comments }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card variant="outlined" class="h-100">
            <v-card-text>
              <div class="text-subtitle-2 text-grey-darken-1 mb-2">Date de création</div>
              <div>{{ formatDate(inspection.created_at) }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card variant="outlined" class="h-100">
            <v-card-text>
              <div class="text-subtitle-2 text-grey-darken-1 mb-2">Dernière mise à jour</div>
              <div>{{ formatDate(inspection.updated_at) }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card variant="outlined">
            <v-card-text>
              <div class="text-subtitle-2 text-grey-darken-1 mb-2">Demandeur</div>
              <div>{{ inspection.who || "Non spécifié" }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card variant="outlined">
            <v-card-text>
              <div class="text-subtitle-2 text-grey-darken-1 mb-2">Configuration</div>
              <div class="mt-1 space-y-4">
                <template v-if="inspection.estate?.configurations?.length">
                  <div v-for="(configs, level) in groupedConfigurations" :key="level">
                    <div class="font-medium">
                      {{ level }} ({{ getTotalRooms(configs) }} pièces):
                    </div>
                    <v-list>
                      <template v-for="config in configs" :key="config.id">
                        <template v-for="(piece, index) in getParsedPieces(config.pieces)" :key="index">
                          <v-list-item>
                            {{ piece.nombre }} {{ piece.type }}{{ piece.nombre > 1 ? "s" : "" }}
                          </v-list-item>
                        </template>
                      </template>
                    </v-list>
                  </div>
                </template>
                <p v-else>Non configuré</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Boutons de confirmation initiale - visibles uniquement si l'inspection n'est pas démarrée -->
      <div v-if="!isStepperStarted">
        <!-- Boutons pour Submitted -->
        <div v-if="inspection.status === 'Submitted'" class="mt-6 d-flex justify-end border-t pt-4">
          <v-btn
            color="error"
            class="mr-2 text-white custom-btn-decline"
            @click="showDeclineConfirmation = true"
          >
            Refuser la demande
          </v-btn>
          <v-btn
            color="success-darken-2"
            class="text-white custom-btn-accept"
            @click="handleAccept"
          >
            Accepter l'état des lieux
          </v-btn>
        </div>

        <!-- Bouton fermer pour Rejected -->
        <div v-if="inspection.status === 'Rejected'" class="mt-6 d-flex justify-end border-t pt-4">
          <v-btn
            color="grey"
            variant="outlined"
            @click="$emit('close')"
          >
            Fermer
          </v-btn>
        </div>

        <!-- Boutons pour Approved -->
        <div v-if="inspection.status === 'Approved'" class="mt-6 d-flex justify-end border-t pt-4">
          <v-btn
            color="grey"
            variant="outlined"
            class="mr-2"
            @click="$emit('close')"
          >
            Fermer
          </v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            @click="startStepper"
          >
            Démarrer l'inspection
          </v-btn>
        </div>

        <!-- Boutons pour In Progress -->
        <div v-if="inspection.status === 'In Progress'" class="mt-6 d-flex justify-end border-t pt-4">
          <v-btn
            color="grey"
            variant="outlined"
            class="mr-2"
            @click="$emit('close')"
          >
            Fermer
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Stepper pour l'inspection -->
    <div v-if="isStepperStarted" class="mt-6">
      <v-stepper v-model="currentStep" class="mb-4">
        <v-stepper-header>
          <template v-for="(step, index) in steps" :key="index">
            <v-stepper-item :value="index">
              {{ step.title }}
              <small>{{ step.description }}</small>
            </v-stepper-item>
            <v-divider v-if="index < steps.length - 1"></v-divider>
          </template>
        </v-stepper-header>

        <v-stepper-window>
          <v-stepper-window-item
            v-for="(step, index) in steps"
            :key="index"
            :value="index"
          >
            <div class="pa-4 bg-grey-darken-4 rounded">
              <h3 class="text-h6 text-grey-lighten-2 mb-4">{{ step.title }}</h3>

              <div class="space-y-4">
                <template
                  v-for="config in groupedConfigurations[step.title]"
                  :key="config.id"
                >
                  <template
                    v-for="piece in getParsedPieces(config.pieces)"
                    :key="piece.type"
                  >
                    <template v-for="index in piece.nombre" :key="`${piece.type}_${index}`">
                      <v-card class="bg-grey-darken-3 mb-4">
                        <v-card-text>
                          <div class="d-flex gap-6">
                            <div class="flex-grow-1">
                              <h4 class="text-h6 text-grey-lighten-2">
                                {{ piece.type }} {{ piece.nombre > 1 ? `#${index}` : "" }}
                              </h4>

                              <v-textarea
                                v-model="inspectionDetails[step.title].comments[`${piece.type}_${index}`]"
                                label="Commentaire"
                                variant="outlined"
                                color="grey-lighten-1"
                                bg-color="grey-darken-4"
                                placeholder="Ajoutez vos observations..."
                                rows="3"
                              ></v-textarea>
                            </div>

                            <div class="flex-shrink-0" style="width: 200px">
                              <v-file-input
                                v-model="inspectionDetails[step.title].photos[`${piece.type}_${index}`]"
                                label="Photo"
                                variant="outlined"
                                density="comfortable"
                                accept="image/*"
                                @change="handlePhotoUpload(step.title, `${piece.type}_${index}`, $event)"
                                :placeholder="
                                  inspectionDetails[step.title].photos[`${piece.type}_${index}`]
                                    ? 'Changer la photo'
                                    : 'Ajouter une photo'
                                "
                              ></v-file-input>
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </template>
                  </template>
                </template>
              </div>
            </div>
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>

      <div class="d-flex justify-space-between mt-6">
        <v-btn
          v-if="currentStep > 0"
          variant="outlined"
          @click="handleStepChange(currentStep - 1)"
        >
          Précédent
        </v-btn>

        <v-btn
          v-if="currentStep < steps.length - 1"
          color="primary"
          class="ml-auto"
          @click="handleStepChange(currentStep + 1)"
        >
          Suivant
        </v-btn>

        <v-btn
          v-if="currentStep === steps.length - 1"
          color="grey"
          variant="outlined"
          class="ml-auto"
          @click="$emit('close')"
        >
          Fermer
        </v-btn>
      </div>
    </div>

    <!-- Modal détails propriété -->
    <v-dialog
      v-model="showEstateDetails"
      max-width="500"
      v-if="inspection.estate"
    >
      <v-card class="bg-grey-darken-4">
        <v-card-title class="d-flex justify-space-between pa-4">
          <span class="text-h6">{{ inspection.estate.title }}</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="handleClose"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="6">
              <div class="text-subtitle-2 text-grey">Localisation</div>
              <div>{{ inspection.estate.location }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-subtitle-2 text-grey">Prix</div>
              <div>{{ inspection.estate.price }} €</div>
            </v-col>
          </v-row>

          <div class="mt-4">
            <div class="text-subtitle-2 text-grey">Description</div>
            <p class="text-grey-lighten-1">{{ inspection.estate.description }}</p>
          </div>

          <v-row class="mt-4">
            <v-col cols="6">
              <div class="text-subtitle-2 text-grey">Date de création</div>
              <div>{{ formatDate(inspection.estate.created_at) }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-subtitle-2 text-grey">Dernière modification</div>
              <div>{{ formatDate(inspection.estate.updated_at) }}</div>
            </v-col>
          </v-row>

          <div class="mt-4">
            <div class="text-subtitle-2 text-grey">ID Propriétaire</div>
            <div>{{ inspection.estate.user_id }}</div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="outlined"
            @click="handleClose"
          >
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de confirmation de refus -->
    <v-dialog v-model="showDeclineConfirmation" max-width="500">
      <v-card style="background-color: #1a2436;">
        <v-card-title class="d-flex justify-space-between pa-4">
          <span class="text-h6">Confirmer le refus</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="showDeclineConfirmation = false"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <p>Êtes-vous sûr de vouloir refuser cette demande d'inspection ?</p>
          <p class="text-grey mt-2">Cette action ne peut pas être annulée.</p>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="outlined"
            class="mr-2"
            @click="showDeclineConfirmation = false"
          >
            Annuler
          </v-btn>
          <v-btn
            color="error"
            class="text-white custom-btn-decline"
            @click="handleDecline"
          >
            Confirmer le refus
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { PropertyInspection } from '~/types'
// import { useToast } from 'vue-toastification'
import axios from 'axios'

const toast = useToast()

const props = defineProps<{
  inspection: PropertyInspection
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update', inspection: PropertyInspection): void
}>()

const loading = ref(false)
const isStepperStarted = ref(false)
const currentStep = ref(0)
const showEstateDetails = ref(false)
const isFinalizing = ref(false)
const shouldCloseAfterFinalize = ref(false)
const showDeclineConfirmation = ref(false)

const csrfToken = useCookie<string>('XSRF-TOKEN', {
  default: () => ''
})

const steps = computed(() => {
  return Object.keys(groupedConfigurations.value).map(level => ({
    title: level,
    description: `Inspection du ${level.toLowerCase()}`
  }))
})

const startStepper = async () => {
  loading.value = true
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/property-inspections/${props.inspection.id}/edl-in-progress`
    )

    if (response.data) {
      props.inspection.status = 'In Progress'
      isStepperStarted.value = true
      loading.value = false
    }
  } catch (error) {
    console.error('Error starting inspection:', error)
    toast.error('Erreur lors du démarrage')
    loading.value = false
  }
}

const handleFinalize = async () => {
  if (isFinalizing.value) return
  
  isFinalizing.value = true
  loading.value = true

  try {
    await axios.put(`http://127.0.0.1:8000/api/property-inspections/${props.inspection.id}/complete`)

    for (const [level, details] of Object.entries(inspectionDetails.value)) {
      const levelConfigs = groupedConfigurations.value[level]

      for (const [roomKey, comment] of Object.entries(details.comments)) {
        const [roomType, roomNumber] = roomKey.split('_')
        const formData = new FormData()

        formData.append('property_inspection_id', props.inspection.id.toString())
        formData.append('estate_configuration_id', levelConfigs[0].id.toString())
        formData.append('level', level)
        formData.append('room_type', roomType)
        formData.append('room_number', roomNumber)
        formData.append('comment', comment)

        if (details.photos[roomKey]) {
          formData.append('photo', details.photos[roomKey])
        }

        await axios.post('http://127.0.0.1:8000/api/inspection-reactions', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRF-TOKEN': csrfToken.value,
            Accept: 'application/json'
          }
        })
      }
    }

    shouldCloseAfterFinalize.value = true
    toast.success('Inspection finalisée avec succès')
  } catch (error) {
    console.error('Erreur lors de la finalisation:', error)
    toast.error('Erreur lors de la finalisation')
  } finally {
    loading.value = false
    isFinalizing.value = false
    if (shouldCloseAfterFinalize.value) {
      emit('close')
    }
  }
}

const handleStepChange = (step: number) => {
  if (step >= 0 && step < steps.value.length) {
    currentStep.value = step
  }
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
      return 'primary'
    case 'Approved':
      return 'success-darken-2'
    case 'Rejected':
      return 'error'
    case 'In Progress':
      return 'amber-darken-2'
    case 'Completed':
      return 'teal-darken-1'
    case 'Closed':
      return 'grey-darken-1'
    default:
      return 'grey'
  }
}

const groupedConfigurations = computed(() => {
  if (!props.inspection.estate?.configurations) return {}

  return props.inspection.estate.configurations.reduce((acc, config) => {
    const level = config.level || 'Non spécifié'
    if (!acc[level]) {
      acc[level] = []
    }
    acc[level].push(config)
    return acc
  }, {} as Record<string, typeof props.inspection.estate.configurations>)
})

const getParsedPieces = (piecesString: string) => {
  try {
    return JSON.parse(piecesString)
  } catch {
    return []
  }
}

const getTotalRooms = (configs: any[]) => {
  return configs.reduce((total, config) => {
    const pieces = getParsedPieces(config.pieces)
    const roomCount = pieces.reduce((sum: number, piece: any) => sum + piece.nombre, 0)
    return total + roomCount
  }, 0)
}

const inspectionDetails = ref(
  {} as Record<
    string,
    {
      comments: Record<string, string>
      photos: Record<string, File | null>
    }
  >
)

const initializeInspectionDetails = () => {
  Object.entries(groupedConfigurations.value).forEach(([level, configs]) => {
    inspectionDetails.value[level] = {
      comments: {},
      photos: {}
    }

    configs.forEach((config) => {
      const pieces = getParsedPieces(config.pieces)
      pieces.forEach((piece: { type: string; nombre: number }) => {
        for (let i = 1; i <= piece.nombre; i++) {
          const key = `${piece.type}_${i}`
          inspectionDetails.value[level].comments[key] = ''
          inspectionDetails.value[level].photos[key] = null
        }
      })
    })
  })
}

const handlePhotoUpload = (level: string, pieceKey: string, event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    inspectionDetails.value[level].photos[pieceKey] = input.files[0]
  }
}

const handleShowEstate = () => {
  if (props.inspection.estate) {
    showEstateDetails.value = true
  }
}

const handleClose = () => {
  showEstateDetails.value = false
}

const handleAccept = async () => {
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/property-inspections/${props.inspection.id}/accept`
    )

    if (response.data) {
      props.inspection.status = 'Approved'
      toast.success('État des lieux accepté')
      emit('update', props.inspection)
    }
  } catch (error) {
    console.error('Error accepting inspection:', error)
    toast.error('Erreur lors de l\'acceptation')
  }
}

const handleDecline = async () => {
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/property-inspections/${props.inspection.id}/decline`
    )

    if (response.data) {
      showDeclineConfirmation.value = false
      props.inspection.status = 'Rejected'
      toast.error('Demande refusée')
      emit('update', props.inspection)
    }
  } catch (error) {
    console.error('Error declining inspection:', error)
    toast.error('Erreur lors du refus')
  }
}

onMounted(() => {
  initializeInspectionDetails()
})
</script>

<style scoped>
.h-100 {
  height: 100%;
}

.custom-btn-decline {
  background-color: rgb(var(--v-theme-error)) !important;
  transition: all 0.3s ease;
}

.custom-btn-decline:hover {
  background-color: transparent !important;
  color: rgb(var(--v-theme-error)) !important;
  border: 1px solid rgb(var(--v-theme-error)) !important;
}

.custom-btn-accept {
  background-color: rgb(var(--v-theme-success-darken-2)) !important;
  transition: all 0.3s ease;
}

.custom-btn-accept:hover {
  background-color: transparent !important;
  color: rgb(var(--v-theme-success)) !important;
  border: 1px solid rgb(var(--v-theme-success)) !important;
}
</style>
