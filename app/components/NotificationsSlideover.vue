<script setup lang="ts">
import { defineProps, watch } from 'vue'
import { useDashboard } from '~/composables/useDashboard'
import { formatTimeAgo } from '@vueuse/core'
import type { Notification } from '~/types'

const { isNotificationsSlideoverOpen } = useDashboard()

// Recevoir l'état d'ouverture et les notifications en tant que props
const props = defineProps<{ isOpen: boolean, notifications: Notification[] }>()

// Synchroniser l'état d'ouverture local avec le prop
watch(() => props.isOpen, (newVal) => {
  isNotificationsSlideoverOpen.value = newVal
})
</script>

<template>
  <UDashboardSlideover
    v-model="isNotificationsSlideoverOpen"
    title="Notifications"
  >
    <div v-if="!props.notifications || props.notifications.length === 0" class="p-3">Aucune notification disponible</div>

    <div
      v-for="notification in props.notifications"
      :key="notification.id"
      class="p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
    >
      <div class="text-sm flex-1">
        <p class="flex items-center justify-between">
          <span class="text-gray-900 dark:text-white font-medium">{{ notification.title }}</span>
          <time
            class="text-gray-500 dark:text-gray-400 text-xs"
            v-text="formatTimeAgo(new Date(notification.created_at))"
          />
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          {{ notification.message }}
        </p>
      </div>
    </div>
  </UDashboardSlideover>
</template>
