<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Propriétés" :badge="estates.length">
        <template #right>
          <UInput
            ref="input"
            v-model="q"
            icon="i-heroicons-funnel"
            autocomplete="off"
            placeholder="Filtrer les propriétés..."
            class="hidden lg:block"
            @keydown.esc="$event.target.blur()"
          >
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>

          <UButton
            label="Nouvelle propriété"
            trailing-icon="i-heroicons-plus"
            color="gray"
            @click="openNewEstateModal"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <USelectMenu
            v-model="selectedLocations"
            icon="i-heroicons-map-pin"
            placeholder="Localisation"
            :options="defaultLocations"
            multiple
          />
        </template>

        <template #right>
          <USelectMenu
            v-model="selectedColumns"
            icon="i-heroicons-adjustments-horizontal-solid"
            :options="defaultColumns"
            multiple
            class="hidden lg:block"
          >
            <template #label> Affichage </template>
          </USelectMenu>
        </template>
      </UDashboardToolbar>

      <!-- Table des propriétés -->
      <UTable
        v-model="selected"
        v-model:sort="sort"
        :rows="estates"
        :columns="columns"
        :loading="pending"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
        @select="onSelect"
      >
        <template #price-data="{ row }">
          <span class="font-medium">
            {{
              new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(row.price)
            }}
          </span>
        </template>

        <template #created_at-data="{ row }">
          {{ new Date(row.created_at).toLocaleDateString("fr-FR") }}
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
        v-model="isViewEstateModalOpen"
        title="Détails de la propriété"
        :ui="{ width: 'sm:max-w-2xl' }"
      >
        <EstatesShow :estate="selectedEstate" @close="isViewEstateModalOpen = false" />
      </UDashboardModal>
    </UDashboardPanel>

    <!-- Modal de création d'une nouvelle propriété (modal custom) placé en dehors du panneau -->
    <div
      v-if="isNewEstateModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-md shadow-lg w-full max-w-md p-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-xl font-semibold text-gray-800">Nouvelle propriété</h2>
          <button
            @click="isNewEstateModalOpen = false"
            class="text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p class="text-sm text-gray-500 mb-4">
          Ajouter une nouvelle propriété à la base de données
        </p>
        <div>
          <form @submit.prevent="storeEstate" class="space-y-4">
            <div>
              <label for="newTitle" class="block text-sm font-medium text-gray-700"
                >Titre</label
              >
              <input
                id="newTitle"
                v-model="newTitle"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="newDescription" class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <textarea
                id="newDescription"
                v-model="newDescription"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div>
              <label for="newPrice" class="block text-sm font-medium text-gray-700"
                >Prix</label
              >
              <input
                id="newPrice"
                v-model="newPrice"
                type="number"
                step="0.01"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="newLocation" class="block text-sm font-medium text-gray-700"
                >Localisation</label
              >
              <input
                id="newLocation"
                v-model="newLocation"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div v-if="newError" class="text-red-600 text-sm">{{ newError }}</div>
            <div>
              <button
                type="submit"
                :disabled="newLoading"
                class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700"
              >
                <span v-if="newLoading">Création...</span>
                <span v-else>Créer la propriété</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- Fin du modal custom -->
  </UDashboardPage>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useFetch } from "#app";
import type { Estate } from "~/types";
import axios from "axios";

const defaultColumns = [
  { key: "id", label: "#" },
  { key: "title", label: "Titre", sortable: true },
  { key: "price", label: "Prix", sortable: true },
  { key: "location", label: "Localisation", sortable: true },
  { key: "created_at", label: "Date de création", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
];

const q = ref("");
const selected = ref<Estate[]>([]);
const selectedColumns = ref(defaultColumns);
const selectedLocations = ref([]);
const sort = ref({ column: "id", direction: "asc" as const });
const input = ref<{ input: HTMLInputElement }>();
const isNewEstateModalOpen = ref(false);
const isViewEstateModalOpen = ref(false);
const selectedEstate = ref<Estate | null>(null);

const userId = ref(localStorage.getItem("userId"));

// Champs du formulaire de création d'une nouvelle propriété
const newTitle = ref("");
const newDescription = ref("");
const newPrice = ref("");
const newLocation = ref("");
const newError = ref("");
const newLoading = ref(false);

function openNewEstateModal() {
  console.log("Ouverture du modal de création de propriété");
  isNewEstateModalOpen.value = true;
}

async function storeEstate() {
  newLoading.value = true;
  newError.value = "";
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/estates", {
      title: newTitle.value,
      description: newDescription.value,
      price: newPrice.value,
      location: newLocation.value,
      user_id: parseInt(userId.value),
    });
    console.log("New estate created:", response.data);
    // Vous pouvez actualiser la liste des propriétés ici si nécessaire
    isNewEstateModalOpen.value = false;
    newTitle.value = "";
    newDescription.value = "";
    newPrice.value = "";
    newLocation.value = "";
  } catch (err: any) {
    console.error("Error creating estate:", err.response?.data);
    newError.value =
      err.response?.data.message || "Erreur lors de la création de la propriété";
  } finally {
    newLoading.value = false;
    // Actualiser la liste des propriétés
  }
    const { data: newData } = await useFetch<{ data: Estate[] }>(
      `http://127.0.0.1:8000/api/estates/${userId.value}`,
      {
        params: query.value,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (newData.value) {
      data.value = newData.value;
    }
}

const query = computed(() => ({
  q: q.value,
  locations: selectedLocations.value,
  sort: sort.value.column,
  order: sort.value.direction,
}));

const { data, pending, error } = await useFetch<{ data: Estate[] }>(
  `http://127.0.0.1:8000/api/estates/${userId.value}`,
  {
    params: query.value,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }
);

const estates = computed(() => data.value?.data ?? []);

watchEffect(() => {
  if (error.value) {
    console.error("Erreur de connexion avec l'API:", error.value);
  } else if (data.value) {
    console.log("Connexion API réussie, données reçues:", data.value);
  }
});

const columns = computed(() =>
  defaultColumns.filter((column) => selectedColumns.value.includes(column))
);

const defaultLocations = computed(
  () =>
    estates.value.reduce((acc, estate) => {
      if (!acc.includes(estate.location)) {
        acc.push(estate.location);
      }
      return acc;
    }, [] as string[]) ?? []
);

function onSelect(row: Estate) {
  const index = selected.value.findIndex((item) => item.id === row.id);
  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }
}

function openViewModal(estate: Estate) {
  console.log("Estate clicked:", estate);
  selectedEstate.value = estate;
  isViewEstateModalOpen.value = true;
}
</script>
