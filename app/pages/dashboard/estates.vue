<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <span class="text-h5">Propriétés</span>
            <v-badge
              :content="estates.length"
              color="primary"
              class="ml-2"
            ></v-badge>
            <v-spacer></v-spacer>

            <!-- Barre de recherche -->
            <v-text-field
              v-model="q"
              prepend-icon="mdi-magnify"
              placeholder="Filtrer les propriétés..."
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
              color="primary"
              prepend-icon="mdi-plus"
              @click="openNewEstateModal"
            >
              Nouvelle propriété
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="selectedLocations"
                  :items="defaultLocations"
                  label="Localisation"
                  multiple
                  chips
                  variant="outlined"
                  prepend-icon="mdi-map-marker"
                ></v-select>
              </v-col>
            </v-row>

            <v-data-table
              v-model="selected"
              :headers="defaultColumns"
              :items="estates"
              :loading="pending"
              show-select
            >
              <template v-slot:item.price="{ item }">
                {{ new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(item.price) }}
              </template>

              <template v-slot:item.created_at="{ item }">
                {{ new Date(item.created_at).toLocaleDateString("fr-FR") }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  variant="text"
                  size="small"
                  @click="openViewModal(item)"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de visualisation -->
    <v-dialog v-model="isViewEstateModalOpen" max-width="800">
      <v-card v-if="selectedEstate">
        <v-card-title class="d-flex align-center">
          <span class="text-h6">Détails de la propriété</span>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="isViewEstateModalOpen = false"
          ></v-btn>
        </v-card-title>
        <v-card-text>
          <EstateShow
            :estate="selectedEstate"
            @close="isViewEstateModalOpen = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal de création -->
    <v-dialog v-model="isNewEstateModalOpen" max-width="600">
      <v-card>
        <v-card-title class="d-flex align-center">
          <span class="text-h6">Nouvelle propriété</span>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="isNewEstateModalOpen = false"
          ></v-btn>
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="storeEstate">
            <v-text-field
              v-model="newTitle"
              label="Titre"
              variant="outlined"
              required
            ></v-text-field>

            <v-textarea
              v-model="newDescription"
              label="Description"
              variant="outlined"
            ></v-textarea>

            <v-text-field
              v-model="newPrice"
              label="Prix"
              type="number"
              variant="outlined"
              required
            ></v-text-field>

            <v-text-field
              v-model="newLocation"
              label="Localisation"
              variant="outlined"
            ></v-text-field>

            <v-alert
              v-if="newError"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              {{ newError }}
            </v-alert>

            <v-card-actions class="pa-0">
              <v-spacer></v-spacer>
              <v-btn
                :loading="newLoading"
                color="primary"
                type="submit"
              >
                Créer la propriété
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useFetch } from "#app";
import type { Estate } from "~/types";
import axios from "axios";
import EstateShow from "~/components/dashboard/EstateShow.vue";

const defaultColumns = [
  { key: "id", title: "#" },
  { key: "title", title: "Titre", sortable: true },
  { key: "price", title: "Prix", sortable: true },
  { key: "location", title: "Localisation", sortable: true },
  { key: "created_at", title: "Date de création", sortable: true },
  { key: "actions", title: "Actions", sortable: false },
];

const q = ref("");
const selected = ref<Estate[]>([]);
const selectedLocations = ref([]);
const sort = ref({ column: "id", direction: "asc" as const });
const isNewEstateModalOpen = ref(false);
const isViewEstateModalOpen = ref(false);
const selectedEstate = ref<Estate | null>(null);
const userId = ref<number | null>(null);
const pending = ref(true);
const error = ref(null);
const data = ref<{ data: Estate[] } | null>(null);

// États du formulaire
const newTitle = ref("");
const newDescription = ref("");
const newPrice = ref("");
const newLocation = ref("");
const newError = ref("");
const newLoading = ref(false);

// Récupération de l'utilisateur et des propriétés
async function fetchUserAndEstates() {
  try {
    // Récupération de l'utilisateur
    const userResponse = await axios.get("http://127.0.0.1:8000/api/user", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    
    if (userResponse.data && userResponse.data.id) {
      userId.value = userResponse.data.id;
      
      // Récupération des propriétés
      const estatesResponse = await axios.get(
        `http://127.0.0.1:8000/api/estates/${userId.value}`,
        {
          params: query.value,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      
      if (estatesResponse.data) {
        data.value = estatesResponse.data;
      }
    }
  } catch (err) {
    error.value = err;
    console.error("Erreur lors de la récupération des données:", err);
  } finally {
    pending.value = false;
  }
}

onMounted(() => {
  fetchUserAndEstates();
});

const query = computed(() => ({
  q: q.value,
  locations: selectedLocations.value,
  sort: sort.value.column,
  order: sort.value.direction,
}));

const estates = computed(() => data.value?.data ?? []);

const defaultLocations = computed(() =>
  estates.value.reduce((acc, estate) => {
    if (!acc.includes(estate.location)) {
      acc.push(estate.location);
    }
    return acc;
  }, [] as string[])
);

function openNewEstateModal() {
  isNewEstateModalOpen.value = true;
}

function openViewModal(estate: Estate) {
  selectedEstate.value = estate;
  isViewEstateModalOpen.value = true;
}

async function storeEstate() {
  if (!userId.value) return;
  
  newLoading.value = true;
  newError.value = "";
  try {
    await axios.post("http://127.0.0.1:8000/api/estates", {
      title: newTitle.value,
      description: newDescription.value,
      price: newPrice.value,
      location: newLocation.value,
      user_id: userId.value,
    });
    
    isNewEstateModalOpen.value = false;
    newTitle.value = "";
    newDescription.value = "";
    newPrice.value = "";
    newLocation.value = "";

    // Actualiser la liste
    await fetchUserAndEstates();
  } catch (err: any) {
    newError.value = err.response?.data.message || "Erreur lors de la création de la propriété";
  } finally {
    newLoading.value = false;
  }
}

// Watch pour les changements de query
watchEffect(() => {
  if (userId.value) {
    fetchUserAndEstates();
  }
});
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

/* Style pour les inputs sur fond sombre */
.v-text-field.white-input .v-field__input {
  color: white !important;
}

/* Ajustements pour le responsive */
@media (max-width: 600px) {
  .v-toolbar-title {
    font-size: 1.2rem !important;
  }
}
</style>
