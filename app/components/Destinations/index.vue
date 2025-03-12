<script setup>
// Destinations component logic
</script>

<template>
  <section class="p-6 sm:p-20 font-poppins">
    <div class="text-center space-y-4">
      <p class="text-[#5E6282] text-lg uppercase">Tailored Solutions</p>
      <h2 class="font-volkhov font-bold text-5xl text-[#14183E]">
        Who We Serve
      </h2>
    </div>
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Particulier -->
      <div class="rounded-2xl overflow-hidden shadow-lg">
        <img src="@/assets/images/individual.png" alt="Property header image"
          class="w-full h-auto object-cover rounded-lg" />
        <div class="p-4">
          <h3 class="font-bold">For Individuals</h3>
          <p class="text-gray-600">
            Personalized services tailored to meet the unique needs of individuals seeking property inspections and
            evaluations.
          </p>
        </div>
      </div>

      <!-- Agence -->
      <div class="rounded-2xl overflow-hidden shadow-lg">
        <img src="@/assets/images/agency.png" alt="Property header image"
          class="w-full h-auto object-cover rounded-lg" />
        <div class="p-4">
          <h3 class="font-bold">For Agencies</h3>
          <p class="text-gray-600">
            Comprehensive solutions designed for real estate agencies to streamline property assessments and client
            interactions.
          </p>
        </div>
      </div>

      <!-- Investisseur -->
      <div class="rounded-2xl overflow-hidden shadow-lg">
        <img src="@/assets/images/investor.png" alt="Property header image"
          class="w-full h-auto object-cover rounded-lg" />
        <div class="p-4">
          <h3 class="font-bold">For Investors</h3>
          <p class="text-gray-600">
            Strategic insights and detailed evaluations to support investors in making informed property investment
            decisions.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Styles spécifiques aux destinations */
</style>