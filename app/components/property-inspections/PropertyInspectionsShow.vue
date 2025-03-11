<template>
  <div class="max-w-7xl">
    <div v-if="!isStepperStarted" class="space-y-6">
      <div class="mb-4">
        <h3 class="text-lg font-medium">Inspection #{{ inspection.id }}</h3>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="text-sm font-medium text-gray-500">Propriété</h3>
          <div class="mt-1 flex items-center gap-2">
            <span class="text-sm">{{ inspection.estate?.title }}</span>
            <UTooltip text="Afficher les infos de la propriété">
              <button
                type="button"
                @click="handleShowEstate"
                class="inline-flex items-center justify-center w-8 h-8 text-primary-600 hover:text-white hover:bg-primary-600 rounded-full transition-colors border border-primary-600"
              >
                <Icon name="mdi:eye" class="w-5 h-5" />
              </button>
            </UTooltip>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">ID de l'inspecteur</h3>
          <p class="mt-1 text-sm">
            {{ inspection.user_id }}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Date d'inspection</h3>
          <p class="mt-1 text-sm">
            {{ formatDate(inspection.date) }}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Statut</h3>
          <p class="mt-1">
            <UBadge
              :label="inspection.status"
              :color="getStatusColor(inspection.status)"
              variant="subtle"
              class="capitalize"
            />
          </p>
        </div>

        <div class="col-span-2">
          <h3 class="text-sm font-medium text-gray-500">Commentaires</h3>
          <p class="mt-1 text-sm">
            {{ inspection.comments }}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Date de création</h3>
          <p class="mt-1 text-sm">
            {{ formatDate(inspection.created_at) }}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Dernière mise à jour</h3>
          <p class="mt-1 text-sm">
            {{ formatDate(inspection.updated_at) }}
          </p>
        </div>

        <div class="col-span-2">
          <h3 class="text-sm font-medium text-gray-500">Demandeur</h3>
          <p class="mt-1 text-sm">
            {{ inspection.who || "Non spécifié" }}
          </p>
        </div>

        <div class="col-span-2">
          <h3 class="text-sm font-medium text-gray-500">Configuration</h3>
          <div class="mt-1 text-sm space-y-4">
            <template v-if="inspection.estate?.configurations?.length">
              <div v-for="(configs, level) in groupedConfigurations" :key="level">
                <div class="font-medium">
                  {{ level }} ({{ getTotalRooms(configs) }} pièces):
                </div>
                <ul class="ml-4 mt-1 space-y-1">
                  <template v-for="config in configs" :key="config.id">
                    <template
                      v-for="(piece, index) in getParsedPieces(config.pieces)"
                      :key="index"
                    >
                      <li class="text-gray-600">
                        - {{ piece.nombre }} {{ piece.type
                        }}{{ piece.nombre > 1 ? "s" : "" }}
                      </li>
                    </template>
                  </template>
                </ul>
              </div>
            </template>
            <p v-else>Non configuré</p>
          </div>
        </div>
      </div>

      <!-- Boutons de confirmation initiale -->
      <div v-if="inspection.status === 'Submitted'" class="mt-6 flex justify-end space-x-3 border-t pt-4">
        <UButton 
          color="red" 
          variant="outline" 
          label="Refuser la demande" 
          @click="showDeclineConfirmation = true" 
        />
        <UButton 
          color="primary" 
          label="Accepter de prester l'état des lieux" 
          @click="handleAccept" 
        />
      </div>

      <!-- Bouton fermer pour Rejected -->
      <div v-if="inspection.status === 'Rejected'" class="mt-6 flex justify-end space-x-3 border-t pt-4">
        <UButton color="gray" variant="outline" label="Fermer" @click="$emit('close')" />
      </div>

      <!-- Boutons pour Approved -->
      <div v-if="inspection.status === 'Approved'" class="mt-6 flex justify-end space-x-3 border-t pt-4">
        <UButton color="gray" variant="outline" label="Fermer" @click="$emit('close')" />
        <UButton color="primary" label="Démarrer l'inspection" :loading="loading" @click="startStepper" />
      </div>

      <!-- Boutons pour In Progress -->
      <div v-if="inspection.status === 'In Progress'" class="mt-6 flex justify-end space-x-3 border-t pt-4">
        <UButton color="gray" variant="outline" label="Fermer" @click="$emit('close')" />
        <UButton color="primary" label="Continuer l'inspection" :loading="loading" @click="continueInspection" />
      </div>
    </div>

    <div v-else class="">
      <UStepper
        v-model="currentStep"
        :steps="steps"
        :ui="{
          wrapper: 'flex flex-col space-y-4',
          step: {
            wrapper: 'flex items-center gap-3',
            icon:
              'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 font-medium',
          },
        }"
      >
        <template #step="{ step, index }">
          <div class="flex flex-col gap-1">
            <p class="font-medium">Étape {{ index + 1 }}</p>
            <p class="text-sm text-gray-500">
              {{ step.description }}
            </p>
          </div>
        </template>
      </UStepper>

      <div class="p-4 bg-gray-900 rounded-lg">
        <template v-if="currentStep < steps.length - 1">
          <div class="space-y-6">
            <h3 class="font-medium text-gray-200">{{ steps[currentStep].title }}</h3>

            <div class="space-y-4">
              <template
                v-for="config in groupedConfigurations[steps[currentStep].title]"
                :key="config.id"
              >
                <template
                  v-for="piece in getParsedPieces(config.pieces)"
                  :key="piece.type"
                >
                  <template v-for="index in piece.nombre" :key="`${piece.type}_${index}`">
                    <div
                      class="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700"
                    >
                      <div class="flex items-start gap-6">
                        <div class="flex-grow space-y-4">
                          <h4 class="font-medium text-gray-200">
                            {{ piece.type }} {{ piece.nombre > 1 ? `#${index}` : "" }}
                          </h4>

                          <div class="w-full">
                            <label
                              :for="`comment_${piece.type}_${index}`"
                              class="block text-sm font-medium text-gray-300 mb-1"
                            >
                              Commentaire
                            </label>
                            <textarea
                              :id="`comment_${piece.type}_${index}`"
                              v-model="
                                inspectionDetails[steps[currentStep].title].comments[
                                  `${piece.type}_${index}`
                                ]
                              "
                              rows="3"
                              class="w-full rounded-md border-gray-700 shadow-sm focus:border-gray-600 focus:ring-gray-600 bg-gray-900 text-gray-200"
                              placeholder="Ajoutez vos observations..."
                            ></textarea>
                          </div>
                        </div>

                        <div class="flex-shrink-0 w-48">
                          <label
                            :for="`photo_${piece.type}_${index}`"
                            class="block text-sm font-medium text-slate-200 mb-2"
                          >
                            Photo
                          </label>
                          <div class="flex flex-col items-center">
                            <input
                              type="file"
                              accept="image/*"
                              :id="`photo_${piece.type}_${index}`"
                              class="hidden"
                              @change="
                                handlePhotoUpload(
                                  steps[currentStep].title,
                                  `${piece.type}_${index}`,
                                  $event
                                )
                              "
                            />
                            <label
                              :for="`photo_${piece.type}_${index}`"
                              class="w-full cursor-pointer px-4 py-2 text-sm font-medium text-center text-slate-200 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600"
                            >
                              {{
                                inspectionDetails[steps[currentStep].title].photos[
                                  `${piece.type}_${index}`
                                ]
                                  ? "Changer la photo"
                                  : "Ajouter une photo"
                              }}
                            </label>
                            <span
                              v-if="
                                inspectionDetails[steps[currentStep].title].photos[
                                  `${piece.type}_${index}`
                                ]
                              "
                              class="mt-2 text-sm text-slate-300"
                            >
                              Photo ajoutée
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
              </template>
            </div>
          </div>
        </template>

        <template v-else>
          <h3 class="font-medium mb-2">Conclusion de l'inspection</h3>
          <p class="text-gray-600">
            Finalisons la demande d'inspection et confirmons tous les détails.
          </p>
        </template>
      </div>

      <div class="mt-6 flex justify-between">
        <button
          v-if="currentStep > 0"
          type="button"
          class="btn btn-secondary"
          @click="handleStepChange(currentStep - 1)"
        >
          Précédent
        </button>

        <button
          v-if="currentStep < steps.length - 1"
          type="button"
          class="btn btn-primary ml-auto"
          @click="handleStepChange(currentStep + 1)"
        >
          Suivant
        </button>

        <button
          v-if="currentStep === steps.length - 1"
          type="button"
          class="btn btn-primary ml-auto"
          :disabled="loading || isFinalizing"
          @click="handleFinalize"
        >
          {{ isFinalizing ? "Finalisation..." : "Finaliser l'inspection" }}
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showEstateDetails && inspection.estate"
        class="fixed inset-0 z-[100] flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div
          class="relative z-[101] w-[500px] max-h-[500px] bg-[#111827] rounded-lg overflow-hidden"
        >
          <!-- Header -->
          <div class="px-6 py-4 bg-gray-900 border-b border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-white">
                {{ inspection.estate.title }}
              </h3>
              <button
                type="button"
                class="text-gray-400 hover:text-white transition-colors"
                @click="handleClose"
              >
                <i class="mdi mdi-close text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div
            class="p-6 overflow-y-auto text-gray-200"
            style="height: calc(100% - 65px)"
          >
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-400">Localisation</h4>
                  <p class="mt-1 text-sm text-white">{{ inspection.estate.location }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-400">Prix</h4>
                  <p class="mt-1 text-sm text-white">{{ inspection.estate.price }} €</p>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-400">Description</h4>
                <p class="mt-1 text-sm text-gray-300">
                  {{ inspection.estate.description }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-400">Date de création</h4>
                  <p class="mt-1 text-sm text-white">
                    {{ new Date(inspection.estate.created_at).toLocaleDateString() }}
                  </p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-400">Dernière modification</h4>
                  <p class="mt-1 text-sm text-white">
                    {{ new Date(inspection.estate.updated_at).toLocaleDateString() }}
                  </p>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-400">ID Propriétaire</h4>
                <p class="mt-1 text-sm text-white">{{ inspection.estate.user_id }}</p>
              </div>
            </div>

            <!-- Bouton Fermer -->
            <div class="mt-8 flex justify-end">
              <button
                type="button"
                class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                @click="handleClose"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import type { PropertyInspection } from "~/types";
import { Dialog, DialogPanel } from "@headlessui/vue";
// import UStepper from '@/components/UStepper.vue'
import EstateShow from "@/components/estates/EstatesShow.vue";
import { ref, computed, onMounted } from "vue";

const props = defineProps<{
  inspection: PropertyInspection;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update", inspection: PropertyInspection): void;
}>();

const loading = ref(false);
const isStepperStarted = ref(false);
const currentStep = ref(0);
const showEstateDetails = ref(false);
const isFinalizing = ref(false);
const shouldCloseAfterFinalize = ref(false);

console.log("Component mounted");

const csrfToken = useCookie<string>("XSRF-TOKEN", {
  default: () => "",
});

const steps = computed(() => {
  const configSteps = Object.keys(groupedConfigurations.value).map((level) => ({
    title: level,
    description: `Inspection du ${level.toLowerCase()}`,
  }));

  return [
    ...configSteps,
    {
      title: "Conclusion",
      description: "Conclure la demande",
    },
  ];
});

const startStepper = async () => {
  loading.value = true;
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/property-inspections/${props.inspection.id}/edl-in-progress`
    );

    if (response.data) {
      props.inspection.status = "In Progress";

      setTimeout(() => {
        isStepperStarted.value = true;
        loading.value = false;
      }, 500);
    }
  } catch (error) {
    console.error("Error starting inspection:", error);
    toast.add({
      title: "Erreur lors du démarrage",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
    loading.value = false;
  }
};

const handleFinalize = async () => {
  console.log("handleFinalize called");
  if (isFinalizing.value) {
    console.log("Already finalizing, exiting function");
    return;
  }
  isFinalizing.value = true;
  loading.value = true;

  // changer le status de la property inspection en 'Completed'
  await axios.put(`http://127.0.0.1:8000/api/property-inspections/${props.inspection.id}/complete`);

  try {
    for (const [level, details] of Object.entries(inspectionDetails.value)) {
      const levelConfigs = groupedConfigurations.value[level];

      for (const [roomKey, comment] of Object.entries(details.comments)) {
        const [roomType, roomNumber] = roomKey.split("_");
        const formData = new FormData();

        formData.append("property_inspection_id", props.inspection.id.toString());
        formData.append("estate_configuration_id", levelConfigs[0].id.toString());
        formData.append("level", level);
        formData.append("room_type", roomType);
        formData.append("room_number", roomNumber);
        formData.append("comment", comment);

        if (details.photos[roomKey]) {
          formData.append("photo", details.photos[roomKey]);
        }

        console.log("Sending request for room:", roomKey);
        await axios.post("http://127.0.0.1:8000/api/inspection-reactions", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-TOKEN": csrfToken.value,
            Accept: "application/json",
          },
        });
      }
    }

    shouldCloseAfterFinalize.value = true;
  } catch (error) {
    console.error("Erreur lors de la finalisation:", error);
  } finally {
    loading.value = false;
    isFinalizing.value = false;
    if (shouldCloseAfterFinalize.value) {
      console.log("Closing pop-up after finalization");
      emit("close");
    }
  }
};

const handleStepChange = (step: number) => {
  console.log("handleStepChange called with step:", step);
  if (step === steps.value.length - 1) {
    currentStep.value = step;
  } else if (step > currentStep.value) {
    currentStep.value = step;
  } else {
    currentStep.value = step;
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Submitted":
      return "blue";
    case "Approved":
      return "green";
    case "Rejected":
      return "red";
    case "In Progress":
      return "yellow";
    case "Completed":
      return "emerald";
    case "Closed":
      return "gray";
    default:
      return "gray";
  }
};

const groupedConfigurations = computed(() => {
  if (!props.inspection.estate?.configurations) return {};

  return props.inspection.estate.configurations.reduce((acc, config) => {
    const level = config.level || "Non spécifié";
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(config);
    return acc;
  }, {} as Record<string, typeof props.inspection.estate.configurations>);
});

const getParsedPieces = (piecesString: string) => {
  try {
    return JSON.parse(piecesString);
  } catch {
    return [];
  }
};

const getTotalRooms = (configs: any[]) => {
  return configs.reduce((total, config) => {
    const pieces = getParsedPieces(config.pieces);
    const roomCount = pieces.reduce((sum: number, piece: any) => sum + piece.nombre, 0);
    return total + roomCount;
  }, 0);
};

const inspectionDetails = ref(
  {} as Record<
    string,
    {
      comments: Record<string, string>;
      photos: Record<string, File | null>;
    }
  >
);

const initializeInspectionDetails = () => {
  console.log("Initializing inspection details");
  Object.entries(groupedConfigurations.value).forEach(([level, configs]) => {
    inspectionDetails.value[level] = {
      comments: {},
      photos: {},
    };

    configs.forEach((config) => {
      const pieces = getParsedPieces(config.pieces);
      pieces.forEach((piece: { type: string; nombre: number }) => {
        for (let i = 1; i <= piece.nombre; i++) {
          const key = `${piece.type}_${i}`;
          inspectionDetails.value[level].comments[key] = "";
          inspectionDetails.value[level].photos[key] = null;
        }
      });
    });
  });
};

const handlePhotoUpload = (level: string, pieceKey: string, event: Event) => {
  console.log("handlePhotoUpload called for piece:", pieceKey);
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    inspectionDetails.value[level].photos[pieceKey] = input.files[0];
  }
};

const handleShowEstate = () => {
  console.log("handleShowEstate called");
  if (props.inspection.estate) {
    showEstateDetails.value = true;
  }
};

const handleClose = () => {
  console.log("handleClose called");
  showEstateDetails.value = false;
};

const handleAccept = async () => {
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/property-inspections/${props.inspection.id}/accept`
    );

    if (response.data) {
      props.inspection.status = 'Approved';
      
      toast.add({ 
        title: 'Demande acceptée', 
        icon: 'i-heroicons-check-circle'
      });

      // Émettre l'événement update pour rafraîchir les données
      emit('update', props.inspection);
    }
  } catch (error) {
    console.error('Error accepting inspection:', error);
    toast.add({ 
      title: 'Erreur lors de l\'acceptation', 
      icon: 'i-heroicons-x-circle', 
      color: 'red' 
    });
  }
};

const handleDecline = async () => {
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/property-inspections/${props.inspection.id}/decline`
    );

    if (response.data) {
      showDeclineConfirmation.value = false;
      props.inspection.status = 'Rejected';
      
      toast.add({ 
        title: 'Demande refusée', 
        icon: 'i-heroicons-x-circle', 
        color: 'red' 
      });

      emit('close');
    }
  } catch (error) {
    console.error('Error declining inspection:', error);
    toast.add({ 
      title: 'Erreur lors du refus', 
      icon: 'i-heroicons-x-circle', 
      color: 'red' 
    });
  }
};

onMounted(() => {
  console.log("Component mounted, initializing inspection details");
  initializeInspectionDetails();
});
</script>

<style scoped>
:deep(.dialog-overlay) {
  z-index: 90 !important;
}

:deep(.dialog-panel) {
  height: 100% !important;
  width: 100% !important;
  margin: 0 !important;
  max-width: none !important;
}
</style>
