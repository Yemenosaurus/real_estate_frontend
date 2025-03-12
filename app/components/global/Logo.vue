<script setup>
defineProps({
  hasScrolled: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <NuxtLink to="/visitor/home" :class="['font-medium text-3xl transition-colors duration-300', hasScrolled ? 'text-white' : 'text-[#181E4B]']">
    Corevia Estate
  </NuxtLink>
</template>