<script setup></script>

<template>
  <section class="p-6 sm:p-20 font-poppins">
    <div class="text-center space-y-4">
      <p class="text-[#5E6282] text-lg uppercase">Our Partners</p>
      <h2 class="font-volkhov font-bold text-5xl text-[#14183E]">
        Trusted by the Best
      </h2>
    </div>
    <div class="mt-16 flex items-center space-x-16 justify-center overflow-x-scroll companies">
      <img
        src="https://logo.clearbit.com/axon.com"
        alt="axon"
        class="shrink-0 w-[130px] h-[130px] object-contain"
      />
      <img
        src="https://logo.clearbit.com/jetstar.com"
        alt="jetstar"
        class="shrink-0 w-[162px] h-[32px] object-contain"
      />
      <img
        src="https://logo.clearbit.com/expedia.com"
        alt="expedia"
        class="shrink-0 w-[162px] h-[32px] object-contain"
      />
      <img
        src="https://logo.clearbit.com/qantas.com"
        alt="qantas"
        class="shrink-0 w-[162px] h-[32px] object-contain"
      />
      <img
        src="https://logo.clearbit.com/alitalia.com"
        alt="alitalia"
        class="shrink-0 w-[94px] h-[21px] object-contain"
      />
    </div>
  </section>
</template>

<style scoped>
.companies::-webkit-scrollbar {
  height: 5px;
}
.companies::-webkit-scrollbar-thumb {
  background: #181e4b;
  border-radius: 10px;
}
</style> 