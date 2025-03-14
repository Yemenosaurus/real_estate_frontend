<script setup lang="ts">
definePageMeta({
  layout: "default",
});
import { sub } from "date-fns";
import type { Period, Range } from "~/types";
import { use } from "echarts/core";
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent, TitleComponent } from "echarts/components";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";
import type { PropertyInspection } from "~/types";
import axios from "axios";
import { onMounted, ref, computed } from "vue";
import NotificationsSlideover from "~/components/NotificationsSlideover.vue";
import { useDashboard } from "~/composables/useDashboard";
import { useFetch } from "@vueuse/core";

const { isNotificationsSlideoverOpen } = useDashboard();

const items = [
  [
    {
      label: "New mail",
      icon: "i-heroicons-paper-airplane",
      to: "/inbox",
    },
    {
      label: "New user",
      icon: "i-heroicons-user-plus",
      to: "/users",
    },
  ],
];

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() });
const period = ref<Period>("daily");

use([
  PieChart,
  CanvasRenderer,
  LabelLayout,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
]);

const inspections = ref([]);

const fetchInspections = async () => {
  useFetch(
    `http://127.0.0.1:8000/api/property-inspections-test/${userId.value}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": useCookie("X-XSRF-TOKEN").value,
      },
    }
  )
    .then(({ data, pending, error }) => {
      console.log("data.value:", data.value);
      // Vérifier que data.value contient une clé "data" qui est un tableau
      if (data.value && data.value.data && Array.isArray(data.value.data)) {
        inspections.value = data.value.data;
      } else {
        console.warn("Format de données inattendu :", data.value);
        inspections.value = [];
      }
      console.log("Data a inspecter:", inspections.value);
    })
    .catch((err) => {
      console.error("Erreur lors du fetch:", err);
      inspections.value = [];
    });
};

// Récupé0ration des inspection-reactions
const inspectionReactions = ref([]);
const q = ref("");
const sort = ref({ column: "id", direction: "asc" });
const userId = ref(localStorage.getItem("userId"));
// console.log('userId:', userId.value)

const query = computed(() => ({
  q: q.value,
  sort: sort.value.column,
  order: sort.value.direction,
}));

const fetchInspectionReactions = async () => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/inspection-reactions-only/${userId.value}`
    );
    // console.log('Response:', response.data)
    inspectionReactions.value = response.data.data;
    //console.log('Inspection reactions fetched:', inspectionReactions.value)
  } catch (error) {
    console.error("Error fetching inspection reactions:", error);
  }
};

// Calcul des revenus
const revenueData = computed(() => {
  const revenueMap = new Map<string, number>();

  inspections.value.forEach((inspection) => {
    const estate = inspection.estate;
    if (estate && estate.price) {
      const currentRevenue = revenueMap.get(estate.id) || 0;
      revenueMap.set(estate.id, currentRevenue + estate.price);
    }
  });

  return Array.from(revenueMap.entries()).map(([id, revenue]) => ({
    name: `Estate ${id}`,
    value: revenue,
  }));
});

// Configuration du graphique
const revenueChartOption = computed(() => ({
  tooltip: {
    trigger: "item",
    formatter: "{b}: ${c}",
  },
  xAxis: {
    type: "category",
    data: revenueData.value.map((item) => item.name),
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "bar",
      data: revenueData.value.map((item) => item.value),
      itemStyle: {
        color: "#3498db",
      },
    },
  ],
}));

const statusData = computed(() => {
  const statusCount = {
    Submitted: 0,
    Approved: 0,
    Rejected: 0,
    "In Progress": 0,
    Completed: 0,
    Closed: 0,
  };

  console.log("autre fonction voici inspections:", inspections.value);

  if (inspections.value.length > 0) {
    inspections.value.forEach((inspection) => {
      if (statusCount.hasOwnProperty(inspection.status)) {
        statusCount[inspection.status] += 1;
      }
    });
  } else {
    console.warn("inspections.value n'est pas un tableau :", inspections.value);
  }

  return Object.entries(statusCount)
    .map(([status, count]) => ({
      name: status,
      value: count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Trier par nom de statut
});

// Configuration du graphique des statuts
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

// Calcul du nombre d'inspection-reactions par statut
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

// Configuration du graphique des statuts des inspection-reactions
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

// Calcul du nombre d'inspections par type de client (who)
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

// Configuration du graphique des inspections par type de client (who)
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

// Utilisation de notificationsm pour les notifications du backend
const notificationsm = ref([]);

const fetchNotifications = async () => {
  try {
    console.log("Fetching notifications...");
    const response = await axios.get("http://127.0.0.1:8000/api/notifications", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    notificationsm.value = response.data;
    console.log("Notifications fetched:", notificationsm.value);
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

onMounted(() => {
  fetchInspections();
  fetchInspectionReactions();
  fetchNotifications();
});
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">
        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="gray"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="red" inset v-if="notificationsm.length > 0">
                {{ notificationsm.length }}
              </UChip>
              <UIcon name="i-heroicons-bell" class="w-5 h-5" />
            </UButton>
          </UTooltip>

          <!-- <UDropdown :items="items">
            <UButton
              icon="i-heroicons-plus"
              size="md"
              class="ml-1.5 rounded-full"
            />
          </UDropdown> -->
        </template>
      </UDashboardNavbar>

      <!-- Inclure le composant NotificationsSlideover et passer l'état d'ouverture -->
      <NotificationsSlideover
        :is-open="isNotificationsSlideoverOpen"
        :notifications="notificationsm"
      />

      <UDashboardToolbar>
        <template #left>
          <!-- ~/components/home/HomeDateRangePicker.vue -->
          <HomeDateRangePicker v-model="range" class="-ml-2.5" />
          <!-- ~/components/home/HomePeriodSelect.vue -->
          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <!-- ~/components/home/HomeChart.vue -->
        <HomeChart :period="period" :range="range" />

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <!-- ~/components/home/HomeSales.vue -->
          <!-- <HomeSales /> -->
          <!-- ~/components/home/HomeCountries.vue -->
          <!-- <HomeCountries /> -->
          <!-- Remplacer la carte des Top Countries par celle-ci -->
          <UCard class="mt-4">
            <template #header>
              <div class="flex items-center justify-between">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  Répartition des inspections par statut 
                </h3>
              </div>
            </template>

            <!-- Graphique des statuts des inspections -->
            <div class="relative h-80">
              <ClientOnly>
                <VChart class="h-full w-full" :option="statusChartOption" />
              </ClientOnly>
            </div>
          </UCard>

          <!-- Nouvelle carte pour les inspection-reactions -->
          <UCard class="mt-4">
            <template #header>
              <div class="flex items-center justify-between">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  Répartition des inspection-reactions par statut
                </h3>
              </div>
            </template>

            <!-- Graphique des statuts des inspection-reactions -->
            <div class="relative h-80">
              <ClientOnly>
                <VChart class="h-full w-full" :option="reactionStatusChartOption" />
              </ClientOnly>
            </div>
          </UCard>

          <!-- Nouvelle carte pour les inspections par type de client (who) -->
          <UCard class="mt-4">
            <template #header>
              <div class="flex items-center justify-between">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  Répartition des inspections par type de client
                </h3>
              </div>
            </template>

            <!-- Graphique des inspections par type de client (who) -->
            <div class="relative h-80">
              <ClientOnly>
                <VChart class="h-full w-full" :option="whoChartOption" />
              </ClientOnly>
            </div>
          </UCard>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
