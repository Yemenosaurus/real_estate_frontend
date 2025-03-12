<script setup></script>

<template>
  <section class="p-6 sm:p-20 font-poppins">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-20">
      <div class="space-y-8">
        <p class="text-[#5E6282] text-lg uppercase">Testimonials</p>
        <h2 class="font-volkhov font-bold text-5xl text-[#14183E]">
          What People Say About Us.
        </h2>
        <img src="@/assets/images/testimonial.png" alt="Property header image"
          class="w-full h-auto object-cover rounded-lg" />
      </div>
      <div class="space-y-8">
        <div class="bg-white rounded-xl p-8 shadow-lg">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Mike Taylor" 
            class="w-12 h-12 rounded-full object-cover ring-2 ring-[#6C63FF] ring-offset-2" />
          <p class="mt-8 text-[#5E6282] text-base">
            "On the Windows talking painted pasture yet its express parties use.
            Sure last upon he same as knew next. Of believed or diverted no."
          </p>
          <div class="mt-8">
            <h3 class="font-semibold text-lg text-[#5E6282]">Mike Taylor</h3>
            <p class="text-[#5E6282]">Lahore, Pakistan</p>
          </div>
        </div>
        <div class="bg-white rounded-xl p-8 shadow-lg">
          <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Chris Thomas" 
            class="w-12 h-12 rounded-full object-cover ring-2 ring-[#6C63FF] ring-offset-2" />
          <p class="mt-8 text-[#5E6282] text-base">
            "On the Windows talking painted pasture yet its express parties use.
            Sure last upon he same as knew next. Of believed or diverted no."
          </p>
          <div class="mt-8">
            <h3 class="font-semibold text-lg text-[#5E6282]">Chris Thomas</h3>
            <p class="text-[#5E6282]">CEO of Red Button</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>