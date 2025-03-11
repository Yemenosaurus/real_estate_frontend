<template>
  <div>
    <div class="space-y-6">
      <div class="mb-4">
        <h3 class="text-lg font-medium ">
          {{ estate.title }}
        </h3>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="text-sm font-medium text-gray-500">
            Prix
          </h3>
          <p class="mt-1 text-sm ">
            {{ formatPrice(Number(estate.price)) }}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">
            Localisation
          </h3>
          <p class="mt-1 text-sm ">
            {{ estate.location }}
          </p>
        </div>

        <div class="col-span-2">
          <h3 class="text-sm font-medium text-gray-500">
            Description
          </h3>
          <p class="mt-1 text-sm ">
            {{ estate.description }}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">
            Date de création
          </h3>
          <p class="mt-1 text-sm ">
            {{ formatDate(estate.created_at) }}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">
            Dernière mise à jour
          </h3>
          <p class="mt-1 text-sm ">
            {{ formatDate(estate.updated_at) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Estate } from '~/types'

const props = defineProps<{
  estate: Estate
}>()

console.log('Estate in modal:', props.estate)

defineEmits<{
  (e: 'close'): void
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 