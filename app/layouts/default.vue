<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDashboard } from "@/composables/useDashboard";
import axios from "axios";
import Logo from "~/components/global/Logo.vue";

// ------------------
// Gestion de l'authentification
// ------------------
const isAuthenticated = ref(false);
const isLoading = ref(true);
const email = ref("a@a.com");
const password = ref("a");
const loginSuccess = ref(false);
const router = useRouter();

// Configuration d'axios pour inclure les credentials
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

async function handleLogin() {
  try {
    isLoading.value = true;
    // Récupération du cookie CSRF
    await axios.get("/sanctum/csrf-cookie");
    
    // Tentative de connexion
    const loginResponse = await axios.post("/api/login", {
      email: email.value,
      password: password.value,
    });
    
    if (loginResponse.data.message === 'Login successful') {
      // Stocker le token
      const token = loginResponse.data.token;
      localStorage.setItem('auth_token', token);
      
      // Configurer axios avec le token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      loginSuccess.value = true;
      isAuthenticated.value = true;
      await router.push('/');
    }
  } catch (error) {
    console.error("Login failed:", error.response?.data);
    loginSuccess.value = false;
    isAuthenticated.value = false;
  } finally {
    isLoading.value = false;
  }
}

// Vérifier au montage si l'utilisateur est déjà connecté
onMounted(async () => {
  isLoading.value = true;
  try {
    // Récupérer le token du localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Récupération du cookie CSRF
    await axios.get("/sanctum/csrf-cookie");
    
    // Utilisation du endpoint /api/user protégé par Sanctum
    const response = await axios.get('/api/user');
    if (response.data) {
      isAuthenticated.value = true;
      if (window.location.pathname === '/login') {
        await router.push('/');
      }
    }
  } catch (error) {
    console.error("Session invalide ou expirée:", error);
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
    isAuthenticated.value = false;
    if (window.location.pathname !== '/login') {
      await router.push('/login');
    }
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
});

// Fonction de logout
async function logout() {
  try {
    isLoading.value = true;
    await axios.post('/api/logout');
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
    isAuthenticated.value = false;
    await router.push('/login');
  } catch (error) {
    console.error("Erreur lors du logout:", error);
  } finally {
    isLoading.value = false;
  }
}

// ------------------
// Reste du layout (dashboard)
// ------------------
const route = useRoute();
const { isHelpSlideoverOpen } = useDashboard();

const links = [
  {
    id: "home",
    label: "Home",
    icon: "i-heroicons-home",
    to: "/",
    tooltip: {
      text: "Home",
      shortcuts: ["G", "H"],
    },
  },
  {
    id: "estates",
    label: "Estates",
    icon: "i-heroicons-building-office-2",
    to: "/estates",
    tooltip: {
      text: "Users",
      shortcuts: ["G", "U"],
    },
  },
  {
    id: "propertyInspections",
    label: "Property Inspections",
    icon: "i-heroicons-building-office-2",
    to: "/property-inspections",
    tooltip: {
      text: "Users",
      shortcuts: ["G", "U"],
    },
  },
  {
    id: "Inspection Reactions",
    label: "Inspection Reactions",
    icon: "i-heroicons-check-circle",
    to: "/inspection-reactions",
    tooltip: {
      text: "Users",
      shortcuts: ["G", "U"],
    },
  },
  {
    id: "settings",
    label: "Settings",
    to: "/settings",
    icon: "i-heroicons-cog-8-tooth",
    children: [
      {
        label: "General",
        to: "/settings",
        exact: true,
      },
    ],
    tooltip: {
      text: "Settings",
      shortcuts: ["G", "S"],
    },
  },
];

const footerLinks = [
  {
    label: "Invite people",
    icon: "i-heroicons-plus",
    to: "/settings/members",
  },
  {
    label: "Help & Support",
    icon: "i-heroicons-question-mark-circle",
    click: () => (isHelpSlideoverOpen.value = true),
  },
];

const groups = [
  {
    key: "links",
    label: "Go to",
    commands: links.map((link) => ({ ...link, shortcuts: link.tooltip?.shortcuts })),
  },
  {
    key: "code",
    label: "Code",
    commands: [
      {
        id: "source",
        label: "View page source",
        icon: "i-simple-icons-github",
        click: () => {
          window.open(
            `https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${
              route.path === "/" ? "/index" : route.path
            }.vue`,
            "_blank"
          );
        },
      },
    ],
  },
];
</script>

<template>
  <div v-cloak>
    <!-- Écran de chargement -->
    <template v-if="isLoading">
      <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="text-center">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-4 text-xl font-semibold text-gray-700">Chargement...</p>
        </div>
      </div>
    </template>

    <!-- Si l'utilisateur est authentifié, on affiche le dashboard complet -->
    <template v-else-if="isAuthenticated">
      <UDashboardLayout>
        <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
          <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
            <template #left>
              <!-- Éléments complémentaires éventuels -->
            </template>
          </UDashboardNavbar>
          <UDashboardSidebar>
            <UDashboardSidebarLinks :links="links" />
            <UDivider />
            <div class="flex-1" />
            <!-- Le logout sera affiché en bas de la sidebar -->
            <UDivider class="sticky bottom-0" />
            <template #footer>
              <button
                @click="logout"
                class="group flex items-center justify-between p-2 w-full transition-colors duration-200 hover:bg-red-600 rounded-md"
              >
                <span
                  class="text-gray-700 transition-colors duration-200 group-hover:text-white"
                >
                  Logout
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-[#FF2400] transition-colors duration-200 group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                  />
                </svg>
              </button>
            </template>
          </UDashboardSidebar>
        </UDashboardPanel>
        <slot />
        <!-- Composants complémentaires -->
        <HelpSlideover />
        <NotificationsSlideover />
        <ClientOnly>
          <LazyUDashboardSearch :groups="groups" />
        </ClientOnly>
      </UDashboardLayout>
    </template>

    <!-- Sinon, on affiche la vue de login -->
    <template v-else>
      <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white rounded-lg shadow-lg flex w-3/4 max-w-3xl">
          <div class="flex-1 p-8">
            <h2 class="text-2xl font-bold mb-4">Login</h2>
            <form v-if="!loginSuccess" @submit.prevent="handleLogin">
              <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700"
                  >Email</label
                >
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700"
                  >Password</label
                >
                <input
                  type="password"
                  id="password"
                  v-model="password"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700"
              >
                Login
              </button>
            </form>
            <div v-else class="flex items-center justify-center flex-col">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p class="text-lg font-semibold text-green-500 mt-4">Connexion réussie</p>
            </div>
          </div>
          <div class="flex-1 flex items-center justify-center bg-gray-100">
            <Logo class="w-32 h-32" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
[v-cloak] {
  display: none;
}
</style>
