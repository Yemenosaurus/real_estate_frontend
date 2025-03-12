<template>
  <footer class="p-5 sm:px-16 sm:py-6 mt-12">
    <div class="w-full text-center p-12 sm:p-0 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-10 gap-20 md:gap-12 lg:gap-20">
      <!-- Logo et description -->
      <div class="col-span-2 space-y-3">
        <NuxtLink to="/" class="text-white font-medium text-5xl">Corevia Estate</NuxtLink>
        <p class="text-white text-xs font-light">
          Corevia Estate est une plateforme de gestion d'états des lieuxs de propriétés immobilières.
        </p>
      </div>

      <!-- Navigation links -->
      <div class="col-span-6 grid grid-cols-1 sm:grid-cols-6">
        <!-- Company -->
        <div class="col-span-2 space-y-4">
          <p class="font-bold text-lg">Company</p>
          <div class="space-y-2">
            <NuxtLink to="about" class="block text-[#5E6282]">About</NuxtLink>
            <NuxtLink to="about" class="block text-[#5E6282]">Careers</NuxtLink>
            <NuxtLink to="about" class="block text-[#5E6282]">Mobile</NuxtLink>
          </div>
        </div>

        <!-- Contact -->
        <div class="col-span-2 space-y-4">
          <p class="font-bold text-lg">Contact</p>
          <div class="space-y-2">
            <NuxtLink to="contact" class="block text-[#5E6282]">Help/FAQ</NuxtLink>
            <NuxtLink to="contact" class="block text-[#5E6282]">Press</NuxtLink>
            <NuxtLink to="contact" class="block text-[#5E6282]">Affilates</NuxtLink>
          </div>
        </div>

        <!-- More -->
        <div class="col-span-2 space-y-4">
          <p class="font-bold text-lg">More</p>
          <div class="space-y-2">
            <NuxtLink to="home" class="block text-[#5E6282]">Airlinefees</NuxtLink>
            <NuxtLink to="home" class="block text-[#5E6282]">Airline</NuxtLink>
            <NuxtLink to="home" class="block text-[#5E6282]">Low fare tips</NuxtLink>
          </div>
        </div>
      </div>

      <!-- Social and App links -->
      <div class="col-span-2">
        <div class="space-y-3 md:space-y-0 lg:space-y-3">
          <!-- Social icons -->
          <div class="flex items-center justify-center sm:justify-right">
            <!-- Facebook icon -->
            <!-- <svg width="61" height="61" viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
              {{ facebook_svg_content }}
            </svg> -->

            <!-- Instagram image -->
            <!-- <nuxt-picture src="/images/Social.jpg" alt="instagram" width="45" height="45" /> -->

            <!-- Twitter icon -->
            <svg width="61" height="61" viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- SVG content for Twitter -->
              {{ twitter_svg_content }}
            </svg>
          </div>

          <!-- App discovery -->
          <p class="text-[#5E6282]">Discover our app (Soon)</p>
          <div class="flex items-center justify-center sm:justify-right space-x-3">
            <!-- <nuxt-picture src="/images/GooglePlay.jpg" alt="GooglePlay" width="107" height="35" /> -->
            <!-- <nuxt-picture src="/images/PlayStore.jpg" alt="PlayStore" width="100" height="35" /> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <!-- <p class="text-center text-xs text-[#5E6282] mb-8 sm:mt-8">
      <NuxtLink to="https://the-coding-montana.vercel.app" class="text-indigo-600">The Coding Montana</NuxtLink>
    </p> -->
  </footer>
</template>

<script setup>
// Logic du footer si nécessaire
</script> 