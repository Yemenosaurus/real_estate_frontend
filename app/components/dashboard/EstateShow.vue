<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-h6 mb-4">{{ estate.title }}</div>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card variant="outlined" class="h-100">
          <v-card-text>
            <div class="text-subtitle-2 text-grey-darken-1 mb-2">Prix</div>
            <div>{{ formatPrice(Number(estate.price)) }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card variant="outlined" class="h-100">
          <v-card-text>
            <div class="text-subtitle-2 text-grey-darken-1 mb-2">Localisation</div>
            <div>{{ estate.location }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-text>
            <div class="text-subtitle-2 text-grey-darken-1 mb-2">Description</div>
            <div>{{ estate.description }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card variant="outlined" class="h-100">
          <v-card-text>
            <div class="text-subtitle-2 text-grey-darken-1 mb-2">Date de création</div>
            <div>{{ formatDate(estate.created_at) }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card variant="outlined" class="h-100">
          <v-card-text>
            <div class="text-subtitle-2 text-grey-darken-1 mb-2">Dernière mise à jour</div>
            <div>{{ formatDate(estate.updated_at) }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Estate } from '~/types'

const props = defineProps<{
  estate: Estate
}>()

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

<style scoped>
.h-100 {
  height: 100%;
}
</style>

