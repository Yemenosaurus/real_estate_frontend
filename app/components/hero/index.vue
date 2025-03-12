<script setup>
import Header from "./Header.vue";
</script>

<template>
  <div class="relative">
    <Header />
    <section class="w-full grid grid-cols-1 md:grid-cols-2 items-center p-5 sm:p-20 my-2 mt-[50px]">
      <div class="space-y-3">
        <p class="uppercase font-poppins text-sm text-[#DF6951] font-bold">
          Tailored Solutions for Every Need
        </p>
        <div class="font-volkhov font-bold text-5xl md:text-6xl lg:text-8xl text-[#181E4B]">
          <div class="flex space-x-3">
            <div>Discover,</div>
            <div class="relative">optimize</div>
          </div>
          <div>and enhance your</div>
          <div>property experience</div>
        </div>
        <p class="text-[#5E6282] text-base">
          Our platform offers comprehensive services for individuals, agencies, and investors, ensuring efficiency, flexibility, and added value at every step.
        </p>
        <div class="flex items-center space-x-12">
          <button
            class="bg-[#F1A501] text-white px-4 py-3 rounded-lg shadow-[0px_20px_35px_rgba(241,165,1,0.15)]"
          >
            Learn More
          </button>
          <button class="flex items-center space-x-5">
            <div
              class="w-14 h-14 rounded-full bg-[#DF6951] grid place-items-center shadow-[0px_15px_30px_rgba(223,105,81,0.3)]"
            >
              <Icon name="ph:play-fill" class="w-4 h-4 text-white" />
            </div>
            <span class="text-[#686D77]">Watch Demo (Soon)</span>
          </button>
        </div>
      </div>
      <img
        src="@/assets/images/header.png"
        alt="Property header image"
        class="w-full h-auto object-cover rounded-lg"
      />
    </section>
  </div>
</template> 