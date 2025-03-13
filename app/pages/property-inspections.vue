<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Inspections" :badge="inspections.length">
        <template #right>
          <UInput ref="input" v-model="q" icon="i-heroicons-funnel" autocomplete="off"
            placeholder="Filtrer les inspections..." class="hidden lg:block" @keydown.esc="$event.target.blur()">
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>
          <UButton label="Nouvelle inspection" trailing-icon="i-heroicons-plus" color="gray"
            @click="openNewInspectionModal" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <USelectMenu v-model="selectedStatuses" icon="i-heroicons-check-circle" placeholder="Statut"
            :options="defaultStatuses" multiple />
        </template>
        <template #right>
          <USelectMenu v-model="selectedColumns" icon="i-heroicons-adjustments-horizontal-solid"
            :options="defaultColumns" multiple class="hidden lg:block">
            <template #label>Affichage</template>
          </USelectMenu>
        </template>
      </UDashboardToolbar>

      <UTable :rows="inspections" v-model:sort="sort" :columns="columns" :loading="pending" sort-mode="manual"
        class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
        <template #date-data="{ row }">
          {{ formatDate(row.date) }}
        </template>
        <template #status-data="{ row }">
          <UBadge :label="row.status" :color="getStatusColor(row.status)" variant="subtle" class="capitalize" />
        </template>
        <template #who-data="{ row }">
          <span class="capitalize">{{ row.who }}</span>
        </template>
        <template #config-data="{ row }">
          <span>{{ row.config }}</span>
        </template>
        <template #actions-data="{ row }">
          <UButton color="gray" variant="ghost" icon="i-heroicons-eye"
            @click="() => { console.log('Ouverture du modal pour:', row); openViewModal(row); }" />
        </template>
      </UTable>

      <UDashboardModal v-model="isViewInspectionModalOpen" title="Détails de l'inspection"
        :ui="{ width: 'sm:max-w-2xl' }" @close="handleModalClose">
        <PropertyInspectionsShow v-if="selectedInspection" :inspection="selectedInspection"
          @close="isViewInspectionModalOpen = false" />
      </UDashboardModal>
    </UDashboardPanel>

    <!-- Modal custom pour création d'une nouvelle inspection -->
    <div v-if="isNewInspectionModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeNewInspectionModal">
      <div class="bg-white rounded-md shadow-lg w-full max-w-4xl p-8 relative">
        <button @click="closeNewInspectionModal" class="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Nouvelle Inspection</h2>
        <form @submit.prevent="storeInspection" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Colonne gauche : Propriété et détails estate -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Propriété</label>
              <div v-if="!selectedEstateForInspection">
                <button type="button" class="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md"
                  @click="openEstateSelectionModal">
                  Sélectionner une propriété
                </button>
              </div>
              <div v-else class="border p-2 rounded-md mb-4">
                <p class="text-sm font-semibold">Propriété sélectionnée :</p>
                <p class="text-sm">
                  {{ selectedEstateForInspection.title }}<br>
                  {{ selectedEstateForInspection.location }}<br>
                  {{ formatPrice(selectedEstateForInspection.price) }}
                </p>
                <button type="button" class="mt-2 bg-gray-200 text-gray-700 py-1 px-3 rounded-md"
                  @click="openEstateSelectionModal">
                  Modifier la propriété
                </button>
              </div>
              <!-- Inputs estate details s'affichent si aucune propriété n'est sélectionnée -->
              <div v-if="!selectedEstateForInspection" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nom de l'établissement</label>
                  <input type="text" v-model="formData.estate_name" placeholder="Nom de l'établissement"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Localisation</label>
                  <input type="text" v-model="formData.location" placeholder="Localisation"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Titre</label>
                  <input type="text" v-model="formData.title" placeholder="Titre"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Prix</label>
                  <input type="number" v-model="formData.price" placeholder="Prix"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea v-model="formData.description" placeholder="Description"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
              </div>
            </div>
            <!-- Colonne droite : Date, Commentaires et Configuration -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" v-model="inspectionDate" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Commentaires</label>
                <textarea v-model="inspectionComments" placeholder="Add any notes here"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
              </div>
              <!-- Configuration uniquement si aucune propriété n'est sélectionnée -->
              <div v-if="!selectedEstateForInspection" class="bg-indigo-500 p-4 rounded-md">
                <h3 class="uppercase tracking-wide text-sm text-white font-semibold mb-2">
                  Configuration de l'inspection
                </h3>
                <p class="text-white text-sm mb-2">
                  Indiquez le nombre d'étages et configurez les pièces par étage.
                </p>
                <!-- Nouvel input pour le nombre d'étages -->
                <div class="mb-4">
                  <label class="block text-white text-sm font-medium">Nombre d'étages</label>
                  <input type="number" v-model.number="numFloors" min="1" placeholder="Entrez le nombre d'étages"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <!-- Affichage de la configuration multi-floor si numFloors > 0 -->
                <div v-if="numFloors > 0" class="space-y-4">
                  <div v-for="(floor, index) in floorsConfig" :key="index"
                    class="border p-4 rounded-md bg-white bg-opacity-20">
                    <label class="block text-white text-sm font-medium mb-1">Étage {{ index + 1 }}</label>
                    <input type="text" v-model="floor.label" placeholder="Par exemple: Rez-de-chaussée, 1er étage"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    <label class="block text-white text-sm font-medium mt-2">Configuration des pièces</label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                      <!-- Main Rooms -->
                      <div>
                        <h4 class="text-white font-semibold">Main Rooms</h4>
                        <div v-for="room in roomTypes.mainRooms" :key="room" class="flex items-center space-x-2 mt-2">
                          <input type="checkbox" :value="room" v-model="floor.rooms[room]" class="text-white"
                            @change="toggleRoom(index, room, $event.target.checked)" />
                          <span class="text-white">{{ room }}</span>
                          <input v-if="floor.rooms[room] !== undefined" type="number" min="1"
                            v-model.number="floor.rooms[room]" placeholder="Qty"
                            class="ml-2 w-20 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                      </div>
                      <!-- Technical Rooms -->
                      <div>
                        <h4 class="text-white font-semibold">Technical Rooms</h4>
                        <div v-for="room in roomTypes.technicalRooms" :key="room"
                          class="flex items-center space-x-2 mt-2">
                          <input type="checkbox" :value="room" v-model="floor.rooms[room]" class="text-white"
                            @change="toggleRoom(index, room, $event.target.checked)" />
                          <span class="text-white">{{ room }}</span>
                          <input v-if="floor.rooms[room] !== undefined" type="number" min="1"
                            v-model.number="floor.rooms[room]" placeholder="Qty"
                            class="ml-2 w-20 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Fin de la partie Configuration -->
            </div>
          </div>
          <div>
            <button type="submit" :disabled="newInspectionLoading"
              class="w-full bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600">
              <span v-if="newInspectionLoading">Création...</span>
              <span v-else>Créer l'inspection</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de sélection de propriété -->
    <div v-if="isEstateSelectionModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeEstateSelectionModal">
      <div class="bg-white rounded-md shadow-lg w-full max-w-md p-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-xl font-semibold text-gray-800">Sélectionnez une propriété</h2>
          <button @click="closeEstateSelectionModal" class="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mt-4">
          <ul>
            <li v-for="estate in estatesList" :key="estate.id" class="p-2 border-b hover:bg-gray-100 cursor-pointer"
              @click="selectEstate(estate)">
              <p class="font-semibold">{{ estate.title }}</p>
              <p class="text-sm text-gray-600">{{ estate.location }} - {{ formatPrice(estate.price) }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </UDashboardPage>
</template>

<style>
.form-section {
  width: 80%;
  margin: 0 auto;
}

.bg-[#F1A501] {
  height: 600px;
  overflow-y: auto;
  padding-left: 80px;
  padding-right: 80px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useFetch } from "#app";
import type { PropertyInspection, Estate } from "~/types";
import axios from "axios";

// ----- Configuration de la page d'inspections -----
const defaultColumns = [
  { key: "id", label: "#" },
  { key: "estate_id", label: "Propriété", sortable: true },
  { key: "user_id", label: "Inspecteur", sortable: true },
  { key: "who", label: "Type de client", sortable: true },
  { key: "date", label: "Date", sortable: true },
  { key: "status", label: "Statut", sortable: true },
  { key: "actions", label: "Actions", sortable: false }
];
const defaultStatuses = ["Submitted", "Approved", "Rejected", "In Progress", "Completed", "Closed"];
const q = ref("");
const selected = ref<PropertyInspection[]>([]);
const selectedColumns = ref(defaultColumns);
const selectedStatuses = ref([]);
const sort = ref({ column: "id", direction: "asc" as const });
const input = ref<{ input: HTMLInputElement }>();

// ----- Variables pour la nouvelle inspection -----
const isNewInspectionModalOpen = ref(false);
const isViewInspectionModalOpen = ref(false);
const selectedInspection = ref<PropertyInspection | null>(null);

// ----- Variables pour la création d'une nouvelle inspection -----
const newInspectionLoading = ref(false);
const inspectionDate = ref("");
const inspectionComments = ref("");

// ----- Inputs pour estate details (Step 1) -----
const formData = ref({
  estateId: "",
  userId: "",
  status: "",
  who: "",
  config: "",
  date: "",
  comments: "",
  level: "",
  roomType: "",
  roomCount: 0,
  additionalInfo: "",
  details: "",
  pieces: "",
  estate_name: "",
  location: "",
  title: "",
  price: "",
  description: ""
});
formData.value.userId = localStorage.getItem("userId") || "";

// ----- Configuration multi-floor -----
const numFloors = ref(0);
const floorsConfig = ref<{ label: string; rooms: Record<string, number> }[]>([]);
watch(numFloors, (newVal) => {
  floorsConfig.value = [];
  for (let i = 0; i < newVal; i++) {
    floorsConfig.value.push({ label: `Floor ${i + 1}`, rooms: {} });
  }
});
const numFloorsArray = computed(() => Array.from({ length: numFloors.value }, (_, i) => i));

// ----- Configuration d'inspection (Inputs) -----
const roomTypes = {
  mainRooms: ["Entrée", "Salon", "Salle à manger", "Chambres", "Bureaux"],
  technicalRooms: ["Cuisine", "Salle de bain", "WC", "Buanderie", "Garage", "Cave", "Grenier"],
  exteriors: ["Balcon", "Terrasse", "Jardin", "Cour", "Piscine", "Espace"],
  additionalElements: ["Couloirs", "Escaliers", "Placards", "Locaux techniques"]
};
const allRoomTypes = [
  ...roomTypes.mainRooms,
  ...roomTypes.technicalRooms,
  ...roomTypes.exteriors,
  ...roomTypes.additionalElements
];
const inspectionConfig = ref({
  mainRooms: [] as string[],
  technicalRooms: [] as string[],
  exteriors: [] as string[],
  additionalElements: [] as string[],
  others: ""
});
const roomQuantities = ref({
  mainRooms: {} as Record<string, number>,
  technicalRooms: {} as Record<string, number>,
  exteriors: {} as Record<string, number>,
  additionalElements: {} as Record<string, number>
});
const getRoomQuantity = (room: string, category: string) => {
  return roomQuantities.value[category][room] || 0;
};
const setRoomQuantity = (room: string, category: string, value: number) => {
  roomQuantities.value[category][room] = Number(value);
};


// ----- Estate selection -----
const isEstateSelectionModalOpen = ref(false);
const selectedEstateForInspection = ref<Estate | null>(null);
const estatesList = ref<Estate[]>([]);
async function fetchEstates() {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/estates/${localStorage.getItem("userId")}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    if (response.data.status === "success") {
      estatesList.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching estates:", error);
  }
}
function openEstateSelectionModal() {
  fetchEstates();
  isEstateSelectionModalOpen.value = true;
}
function closeEstateSelectionModal() {
  isEstateSelectionModalOpen.value = false;
}
function selectEstate(estate: Estate) {
  selectedEstateForInspection.value = estate;
  formData.value.estateId = String(estate.id);
  // Si une propriété est choisie, la configuration manuelle ne sera pas utilisée.
  closeEstateSelectionModal();
}
function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price);
}

// ----- Modal pour nouvelle inspection -----
function openNewInspectionModal() {
  console.log("Bouton Nouvelle inspection cliqué");
  isNewInspectionModalOpen.value = true;
}
function closeNewInspectionModal() {
  isNewInspectionModalOpen.value = false;
}

// ----- Récupération des inspections -----
const localUserId = localStorage.getItem("userId");
const { data, pending, error } = await useFetch<{ data: PropertyInspection[] }>(
  `http://127.0.0.1:8000/api/property-inspections/${localUserId}`,
  {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": useCookie("X-XSRF-TOKEN").value
    }
  }
);
const inspections = computed(() => data.value?.data ?? []);
const columns = computed(() =>
  defaultColumns.filter((column) => selectedColumns.value.includes(column))
);
const fetchPropertyInspections = async () => {
  try {
    pending.value = true;
    const response = await axios.get(`http://127.0.0.1:8000/api/property-inspections/${localUserId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-XSRF-TOKEN": useCookie("X-XSRF-TOKEN").value
      }
    });
    if (response.data.status === "success") {
      data.value = response.data;
      console.log("Données chargées:", data.value);
    } else {
      console.error("La réponse n'a pas le format attendu");
    }
  } catch (err) {
    error.value = err;
    console.error("Erreur lors de la récupération des inspections:", err);
  } finally {
    pending.value = false;
  }
};
function openViewModal(inspection: PropertyInspection) {
  console.log("Inspection sélectionnée:", inspection);
  selectedInspection.value = inspection;
  isViewInspectionModalOpen.value = true;
}
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
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

const storeInspection = async () => {
  newInspectionLoading.value = true;
  try {
    // Préparation de la configuration
    const configPayload = selectedEstateForInspection.value
      ? null // Pas de configuration à envoyer si une propriété est choisie
      : JSON.stringify(flattenInspectionConfig()); // Si aucune propriété n'est choisie, envoyer la configuration manuelle

    // Préparation du payload
    const payload = {
      estate_id: selectedEstateForInspection.value ? selectedEstateForInspection.value.id : null,
      user_id: localStorage.getItem("userId"),
      status: "Submitted",
      who: formData.value.who || "particulier",
      config: configPayload,
      date: inspectionDate.value,
      comments: inspectionComments.value,
      estate_name: !selectedEstateForInspection.value ? formData.value.estate_name : null,
      location: !selectedEstateForInspection.value ? formData.value.location : null,
      title: !selectedEstateForInspection.value ? formData.value.title : null,
      price: !selectedEstateForInspection.value ? formData.value.price : null,
      description: !selectedEstateForInspection.value ? formData.value.description : null
    };

    console.log("Payload envoyé", payload);

    const response = await axios.post(
      "http://127.0.0.1:8000/api/property-inspections",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": useCookie("X-XSRF-TOKEN").value
        }
      }
    );

    console.log("Nouvelle inspection créée:", response.data);
    closeNewInspectionModal();
    resetForm();
    await fetchPropertyInspections();

  } catch (err: any) {
    console.error("Erreur lors de la création de l'inspection:", err.response?.data);
  } finally {
    newInspectionLoading.value = false;
  }
};

// Nouvelle fonction pour réinitialiser le formulaire
const resetForm = () => {
  inspectionDate.value = "";
  inspectionComments.value = "";
  selectedEstateForInspection.value = null;
  formData.value = {
    estateId: "",
    userId: localStorage.getItem("userId") || "",
    status: "",
    who: "",
    config: "",
    date: "",
    comments: "",
    level: "",
    roomType: "",
    roomCount: 0,
    additionalInfo: "",
    details: "",
    pieces: "",
    estate_name: "",
    location: "",
    title: "",
    price: "",
    description: ""
  };
  numFloors.value = 0;
  floorsConfig.value = [];
};

// Fonction pour transformer la configuration des pièces en format exploitable par le backend
function flattenInspectionConfig() {
  const result: Record<string, string[]> = {};

  // Ajout de la configuration des étages
  floorsConfig.value.forEach((floor) => {
    if (!floor.label) {
      console.error('Le nom de l\'étage est requis');
      return;
    }

    const roomsArray: string[] = [];

    // Ajout des pièces et de leur quantité pour chaque étage
    Object.entries(floor.rooms).forEach(([room, quantity]) => {
      if (quantity > 0) {
        roomsArray.push(`${room}|${quantity}`);
      }
    });

    // Si des pièces ont été ajoutées pour cet étage, les ajouter à la configuration
    if (roomsArray.length > 0) {
      result[floor.label] = roomsArray;
    }
  });

  return result;
}

const handleModalClose = async () => {
  isViewInspectionModalOpen.value = false;
  await fetchPropertyInspections();
};
</script>
