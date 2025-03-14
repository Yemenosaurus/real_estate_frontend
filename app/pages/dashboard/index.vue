<template>
  <v-container fluid class="fill-height pa-4">
    <v-row>
      <!-- En-tête avec la barre de navigation -->
      <v-col cols="12">
        <v-card class="mb-4" color="#1a2435">
          <v-toolbar color="#1a2435" dark>
            <v-toolbar-title class="text-h4 font-weight-bold">Tableau de bord</v-toolbar-title>
            <v-spacer></v-spacer>
            
            <!-- Bouton notifications -->
            <v-badge
              :content="notificationsm.length"
              :value="notificationsm.length"
              color="error"
              overlap
              class="mr-2"
            >
              <v-btn icon @click="isNotificationsSlideoverOpen = true">
                <v-icon>mdi-bell</v-icon>
              </v-btn>
            </v-badge>
          </v-toolbar>
        </v-card>
      </v-col>

      <!-- Filtres de date -->
      <v-col cols="12">
        <v-card class="mb-4" color="#1a2435">
          <v-card-text>
            <v-row align="center">
              <v-col cols="12" sm="6" md="4">
                <v-menu
                  v-model="startMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="formattedStartDate"
                      label="Date de début"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                      color="primary"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="range.start"
                    no-title
                    @update:model-value="startMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-menu
                  v-model="endMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="formattedEndDate"
                      label="Date de fin"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                      color="primary"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="range.end"
                    no-title
                    @update:model-value="endMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="period"
                  :items="periodItems"
                  label="Période"
                  prepend-icon="mdi-clock-outline"
                  color="primary"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Cartes des statistiques -->
      <v-col cols="12" md="4">
        <v-card class="mb-4" color="#1a2435">
          <v-card-title class="text-h6 white--text">
            Répartition des inspections par statut
          </v-card-title>
          <v-card-text style="height: 300px">
            <!-- Graphique des statuts
            <ClientOnly>
              <VChart class="h-full w-full" :option="statusChartOption" />
            </ClientOnly>
            -->
            <v-skeleton-loader
              class="mx-auto"
              type="card"
              height="300"
            ></v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="mb-4" color="#1a2435">
          <v-card-title class="text-h6 white--text">
            Répartition des inspection-reactions
          </v-card-title>
          <v-card-text style="height: 300px">
            <!-- Graphique des reactions
            <ClientOnly>
              <VChart class="h-full w-full" :option="reactionStatusChartOption" />
            </ClientOnly>
            -->
            <v-skeleton-loader
              class="mx-auto"
              type="card"
              height="300"
            ></v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="mb-4" color="#1a2435">
          <v-card-title class="text-h6 white--text">
            Répartition par type de client
          </v-card-title>
          <v-card-text style="height: 300px">
            <!-- Graphique des types de clients
            <ClientOnly>
              <VChart class="h-full w-full" :option="whoChartOption" />
            </ClientOnly>
            -->
            <v-skeleton-loader
              class="mx-auto"
              type="card"
              height="300"
            ></v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal des notifications -->
    <v-dialog v-model="isNotificationsSlideoverOpen" width="500">
      <v-card color="#1a2435">
        <v-card-title class="text-h5 white--text">
          Notifications
          <v-spacer></v-spacer>
          <v-btn icon @click="isNotificationsSlideoverOpen = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list v-if="notificationsm.length > 0" color="#1a2435">
            <v-list-item v-for="notification in notificationsm" :key="notification.id">
              <v-list-item-content>
                <v-list-item-title class="white--text">{{ notification.title }}</v-list-item-title>
                <v-list-item-subtitle class="grey--text">{{ notification.message }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-alert v-else type="info" variant="tonal">
            Aucune notification
          </v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { sub, format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Period, Range } from "~/types";
import type { PropertyInspection } from "~/types";
import axios from "axios";

// États
const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() });
const period = ref<Period>("daily");
const startMenu = ref(false);
const endMenu = ref(false);
const isNotificationsSlideoverOpen = ref(false);

// Formatage des dates
const formattedStartDate = computed(() => {
  return format(new Date(range.value.start), 'dd MMMM yyyy', { locale: fr });
});

const formattedEndDate = computed(() => {
  return format(new Date(range.value.end), 'dd MMMM yyyy', { locale: fr });
});

// Options pour le select de période
const periodItems = [
  { title: "Quotidien", value: "daily" },
  { title: "Hebdomadaire", value: "weekly" },
  { title: "Mensuel", value: "monthly" },
];

// Données
const inspections = ref([]);
const inspectionReactions = ref([]);
const notificationsm = ref([]);
const userId = ref(localStorage.getItem("userId"));

// Fonctions de récupération des données
const fetchInspections = async () => {
  try {
    const { data } = await useFetch(
      `http://127.0.0.1:8000/api/property-inspections-test/${userId.value}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": useCookie("X-XSRF-TOKEN").value,
        },
      }
    );
    if (data.value?.data && Array.isArray(data.value.data)) {
      inspections.value = data.value.data;
    }
  } catch (err) {
    console.error("Erreur lors du fetch des inspections:", err);
    inspections.value = [];
  }
};

const fetchInspectionReactions = async () => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/inspection-reactions-only/${userId.value}`
    );
    inspectionReactions.value = response.data.data;
  } catch (error) {
    console.error("Error fetching inspection reactions:", error);
  }
};

const fetchNotifications = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/notifications", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    notificationsm.value = response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

// Données calculées pour les graphiques
const statusData = computed(() => {
  const statusCount = {
    Submitted: 0,
    Approved: 0,
    Rejected: 0,
    "In Progress": 0,
    Completed: 0,
    Closed: 0,
  };

  inspections.value.forEach((inspection) => {
    if (statusCount.hasOwnProperty(inspection.status)) {
      statusCount[inspection.status] += 1;
    }
  });

  return Object.entries(statusCount)
    .map(([status, count]) => ({
      name: status,
      value: count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

const reactionStatusData = computed(() => {
  const reactionStatusCount = {
    "en cours": 0,
    "pdf généré": 0,
    "en facturation": 0,
    facturé: 0,
  };

  inspectionReactions.value.forEach((reaction) => {
    if (reactionStatusCount.hasOwnProperty(reaction.status)) {
      reactionStatusCount[reaction.status] += 1;
    }
  });

  return Object.entries(reactionStatusCount).map(([status, count]) => ({
    name: status,
    value: count,
  }));
});

const whoData = computed(() => {
  const whoCount = {
    agence: 0,
    investisseur: 0,
    particulier: 0,
  };

  inspections.value.forEach((inspection) => {
    if (whoCount.hasOwnProperty(inspection.who)) {
      whoCount[inspection.who] += 1;
    }
  });

  return Object.entries(whoCount).map(([who, count]) => ({
    name: who,
    value: count,
  }));
});

// Configuration des graphiques (en commentaire pour l'instant)
/*
const statusChartOption = computed(() => ({
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: Object.keys(statusData.value),
  },
  series: [
    {
      name: "Inspections",
      type: "pie",
      radius: "50%",
      data: statusData.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
}));

const reactionStatusChartOption = computed(() => ({
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: Object.keys(reactionStatusData.value),
  },
  series: [
    {
      name: "Inspection Reactions",
      type: "pie",
      radius: "50%",
      data: reactionStatusData.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
}));

const whoChartOption = computed(() => ({
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: Object.keys(whoData.value),
  },
  series: [
    {
      name: "Type de Client",
      type: "pie",
      radius: "50%",
      data: whoData.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
}));
*/

// Initialisation des données
onMounted(() => {
  fetchInspections();
  fetchInspectionReactions();
  fetchNotifications();
});
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-toolbar-title {
  font-size: 1.5rem !important;
}

/* Ajustements pour le responsive */
@media (max-width: 600px) {
  .v-toolbar-title {
    font-size: 1.2rem !important;
  }
}
</style>
